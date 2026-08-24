create extension if not exists btree_gist;

create type public.user_role as enum ('customer', 'provider');
create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'canceled');
create type public.payment_status as enum ('unpaid', 'paid', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  avatar_url text,
  role public.user_role not null default 'customer',
  member_since text not null default to_char(current_date, 'Month YYYY'),
  has_studio boolean not null default false,
  studio_id uuid,
  studio_name text,
  studio_category text,
  active_passes_count integer not null default 0 check (active_passes_count >= 0),
  past_passes_count integer not null default 0 check (past_passes_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.providers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null,
  category text not null,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  distance text not null default '',
  bio text not null default '',
  image_url text not null default '',
  next_available text not null default '',
  slot_interval_minutes integer not null default 30 check (slot_interval_minutes > 0),
  buffer_minutes integer not null default 0 check (buffer_minutes >= 0),
  instant_confirmation boolean not null default false,
  timezone text not null default 'UTC',
  address text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_studio_fk foreign key (studio_id) references public.providers(id) on delete set null;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  duration_minutes integer not null check (duration_minutes > 0),
  category text not null default '',
  buffer_minutes integer not null default 0 check (buffer_minutes >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.availability (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  day_index smallint not null check (day_index between 0 and 6),
  day_name text not null,
  enabled boolean not null default true,
  slots jsonb not null default '[]'::jsonb,
  unique (provider_id, day_index)
);

create table public.date_overrides (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  date date not null,
  is_blocked boolean not null default false,
  custom_start time,
  custom_end time,
  reason text,
  unique (provider_id, date)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete restrict,
  provider_id uuid not null references public.providers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  ref_code text not null unique default ('BKE-' || upper(substr(md5(random()::text), 1, 5))),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status public.booking_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  price numeric(10,2) not null check (price >= 0),
  customer_notes text,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

alter table public.bookings
  add constraint bookings_no_provider_overlap
  exclude using gist (
    provider_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  ) where (status in ('pending', 'confirmed'));

create index bookings_customer_start_idx on public.bookings (customer_id, start_at desc);
create index bookings_provider_start_idx on public.bookings (provider_id, start_at desc);
create index services_provider_active_idx on public.services (provider_id, is_active);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index booking_requests_provider_status_idx on public.booking_requests (provider_id, status);

create table public.push_tokens (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  token text not null unique,
  platform text not null check (platform in ('ios', 'android', 'web')),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger providers_set_updated_at before update on public.providers
for each row execute function public.set_updated_at();
create trigger services_set_updated_at before update on public.services
for each row execute function public.set_updated_at();
create trigger bookings_set_updated_at before update on public.bookings
for each row execute function public.set_updated_at();
create trigger booking_requests_set_updated_at before update on public.booking_requests
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, ''),
    case when new.raw_user_meta_data ->> 'role' = 'provider' then 'provider'::public.user_role else 'customer'::public.user_role end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.services enable row level security;
alter table public.availability enable row level security;
alter table public.date_overrides enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.booking_requests enable row level security;
alter table public.push_tokens enable row level security;

grant select on public.providers, public.services to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.bookings to authenticated;
grant select, insert, update on public.reviews to authenticated;
grant select, insert, update on public.booking_requests to authenticated;
grant select, insert, update, delete on public.availability, public.date_overrides to authenticated;
grant select, insert, update, delete on public.services to authenticated;
grant select, insert, update, delete on public.providers to authenticated;
grant select, insert, update, delete on public.push_tokens to authenticated;

create policy "public can view verified providers"
on public.providers for select to anon, authenticated
using (is_verified = true or owner_id = (select auth.uid()));

create policy "public can view active services"
on public.services for select to anon, authenticated
using (is_active = true or provider_id in (select id from public.providers where owner_id = (select auth.uid())));

create policy "users can view own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "users can insert own profile"
on public.profiles for insert to authenticated
with check (id = (select auth.uid()));

create policy "users can update own profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "customers can view their bookings"
on public.bookings for select to authenticated
using (customer_id = (select auth.uid()) or provider_id in (select id from public.providers where owner_id = (select auth.uid())));

create policy "customers can create their bookings"
on public.bookings for insert to authenticated
with check (customer_id = (select auth.uid()));

create policy "booking participants can update bookings"
on public.bookings for update to authenticated
using (customer_id = (select auth.uid()) or provider_id in (select id from public.providers where owner_id = (select auth.uid())))
with check (customer_id = (select auth.uid()) or provider_id in (select id from public.providers where owner_id = (select auth.uid())));

create policy "customers can view eligible reviews"
on public.reviews for select to anon, authenticated
using (true);

create policy "customers can create reviews for their bookings"
on public.reviews for insert to authenticated
with check (
  customer_id = (select auth.uid())
  and exists (
    select 1 from public.bookings b
    where b.id = booking_id and b.customer_id = (select auth.uid()) and b.status = 'completed'
  )
);

create policy "booking participants can view requests"
on public.booking_requests for select to authenticated
using (
  customer_id = (select auth.uid())
  or provider_id in (select id from public.providers where owner_id = (select auth.uid()))
);

create policy "customers can create booking requests"
on public.booking_requests for insert to authenticated
with check (customer_id = (select auth.uid()));

create policy "providers can update booking requests"
on public.booking_requests for update to authenticated
using (provider_id in (select id from public.providers where owner_id = (select auth.uid())))
with check (provider_id in (select id from public.providers where owner_id = (select auth.uid())));

create policy "users can manage their push token"
on public.push_tokens for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "providers manage their own record"
on public.providers for all to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "providers manage their services"
on public.services for all to authenticated
using (provider_id in (select id from public.providers where owner_id = (select auth.uid())))
with check (provider_id in (select id from public.providers where owner_id = (select auth.uid())));

create policy "providers manage their availability"
on public.availability for all to authenticated
using (provider_id in (select id from public.providers where owner_id = (select auth.uid())))
with check (provider_id in (select id from public.providers where owner_id = (select auth.uid())));

create policy "providers manage date overrides"
on public.date_overrides for all to authenticated
using (provider_id in (select id from public.providers where owner_id = (select auth.uid())))
with check (provider_id in (select id from public.providers where owner_id = (select auth.uid())));

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "users upload own avatars"
on storage.objects for insert to authenticated
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "users update own avatars"
on storage.objects for update to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "users delete own avatars"
on storage.objects for delete to authenticated
using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "public can view avatars"
on storage.objects for select to public
using (bucket_id = 'avatars');
