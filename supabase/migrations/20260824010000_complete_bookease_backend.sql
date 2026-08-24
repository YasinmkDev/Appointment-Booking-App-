alter table public.profiles
  alter column member_since type text using member_since::text;

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists booking_requests_provider_status_idx
  on public.booking_requests (provider_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists booking_requests_set_updated_at on public.booking_requests;
create trigger booking_requests_set_updated_at
before update on public.booking_requests
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
    case when new.raw_user_meta_data ->> 'role' = 'provider'
      then 'provider'::public.user_role
      else 'customer'::public.user_role
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.booking_requests enable row level security;
grant select, insert, update on public.booking_requests to authenticated;

drop policy if exists "booking participants can view requests" on public.booking_requests;
create policy "booking participants can view requests"
on public.booking_requests for select to authenticated
using (
  customer_id = (select auth.uid())
  or provider_id in (select id from public.providers where owner_id = (select auth.uid()))
);

drop policy if exists "customers can create booking requests" on public.booking_requests;
create policy "customers can create booking requests"
on public.booking_requests for insert to authenticated
with check (customer_id = (select auth.uid()));

drop policy if exists "providers can update booking requests" on public.booking_requests;
create policy "providers can update booking requests"
on public.booking_requests for update to authenticated
using (provider_id in (select id from public.providers where owner_id = (select auth.uid())))
with check (provider_id in (select id from public.providers where owner_id = (select auth.uid())));
