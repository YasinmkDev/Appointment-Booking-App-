import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Provider,
  Service,
  DaySchedule,
  BookingRequest,
  AgendaItem,
  TimeSlot,
  Booking,
  DateOverride,
} from '../types';
import {
  INITIAL_PROVIDERS,
  INITIAL_STUDIO_SERVICES,
  INITIAL_SCHEDULE,
  INITIAL_PROVIDER_REQUESTS,
  INITIAL_TODAYS_AGENDA,
} from '../data/mockData';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type DatabaseProvider = Database['public']['Tables']['providers']['Row'];
type DatabaseService = Database['public']['Tables']['services']['Row'];
type RemoteBookingRequest = {
  id: string;
  booking_id: string;
  provider_id: string;
  customer_id: string;
  status: BookingRequest['status'];
  created_at: string;
  bookings: {
    service_id: string;
    price: number;
    start_at: string;
    services: { name: string; duration_minutes: number } | { name: string; duration_minutes: number }[] | null;
    profiles: { name: string; avatar_url: string | null } | { name: string; avatar_url: string | null }[] | null;
  } | {
    service_id: string;
    price: number;
    start_at: string;
    services: { name: string; duration_minutes: number } | { name: string; duration_minutes: number }[] | null;
    profiles: { name: string; avatar_url: string | null } | { name: string; avatar_url: string | null }[] | null;
  }[] | null;
};


interface ProviderState {
  providers: Provider[];
  studioServices: Service[];
  schedule: DaySchedule[];
  dateOverrides: DateOverride[];
  bookingRequests: BookingRequest[];
  todaysAgenda: AgendaItem[];
  acceptedCount: number;
  declinedCount: number;

  // Provider list
  addProvider: (provider: Provider) => void;
  updateProvider: (id: string, updates: Partial<Provider>) => void;

  // Services
  setStudioServices: (services: Service[]) => void;
  updateStudioServices: (services: Service[]) => void;

  // Schedule
  setSchedule: (schedule: DaySchedule[]) => void;
  toggleDay: (dayName: string) => void;
  addSlot: (dayName: string) => void;
  removeSlot: (dayName: string, slotIndex: number) => void;
  addDateOverride: (override: DateOverride) => void;

  // Requests
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;

  // Agenda
  markArrived: (agendaId: string) => void;

  // Availability engine
  getAvailableSlots: (
    providerId: string,
    dateISO: string,
    serviceDurationMinutes: number,
    existingBookings: Booking[]
  ) => TimeSlot[];

  // Computed
  getPendingCount: () => number;
  getActiveDaysCount: () => number;
  getTodayBookingsCount: () => number;
  getWeekBookingsCount: (allBookings: Booking[]) => number;
  hydrateRemote: () => Promise<void>;
}

function parseTimeToMinutes(timeStr: string): number {
  // Handles "09:00 AM", "02:30 PM"
  const [timePart, meridiem] = timeStr.split(' ');
  const [h, m] = timePart.split(':').map(Number);
  let hours = h;
  if (meridiem === 'PM' && h !== 12) hours += 12;
  if (meridiem === 'AM' && h === 12) hours = 0;
  return hours * 60 + m;
}

function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const meridiem = h >= 12 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${meridiem}`;
}

function getPeriod(minutes: number): 'morning' | 'afternoon' | 'evening' {
  if (minutes < 12 * 60) return 'morning';
  if (minutes < 17 * 60) return 'afternoon';
  return 'evening';
}

export const useProviderStore = create<ProviderState>()(
  persist(
    (set, get) => ({
  providers: INITIAL_PROVIDERS,
  studioServices: INITIAL_STUDIO_SERVICES,
  schedule: INITIAL_SCHEDULE,
  dateOverrides: [],
  bookingRequests: INITIAL_PROVIDER_REQUESTS,
  todaysAgenda: INITIAL_TODAYS_AGENDA,
  acceptedCount: 0,
  declinedCount: 0,

  hydrateRemote: async () => {
    const { data, error } = await supabase
      .from('providers')
      .select('*, services(*)')
      .eq('is_verified', true) as unknown as {
        data: Array<DatabaseProvider & { services: DatabaseService[] }> | null;
        error: Error | null;
      };
    if (error || !data || data.length === 0) return;

    const remoteProviders: Provider[] = data.map((provider) => ({
      id: provider.id,
      name: provider.name,
      category: provider.category,
      rating: Number(provider.rating),
      reviewCount: provider.review_count,
      distance: provider.distance,
      bio: provider.bio,
      image: provider.image_url,
      nextAvailable: provider.next_available,
      slotIntervalMinutes: provider.slot_interval_minutes,
      bufferMinutes: provider.buffer_minutes,
      instantConfirmation: provider.instant_confirmation,
      timezone: provider.timezone,
      address: provider.address ?? undefined,
      isVerified: provider.is_verified,
      services: (provider.services ?? []).map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: Number(service.price),
        durationMinutes: service.duration_minutes,
        category: service.category,
        bufferMinutes: service.buffer_minutes,
        isActive: service.is_active,
      })),
    }));
    set({ providers: remoteProviders });

    const { data: authData } = await supabase.auth.getUser();
    const ownerId = authData.user?.id;
    const ownProvider = data.find((provider) => provider.owner_id === ownerId);
    if (!ownProvider) return;

    const [{ data: availability }, { data: requests }] = await Promise.all([
      supabase.from('availability').select('*').eq('provider_id', ownProvider.id).order('day_index'),
      supabase.from('booking_requests')
        .select('id, booking_id, provider_id, customer_id, status, created_at, bookings(service_id, price, start_at, services(name, duration_minutes), profiles(name, avatar_url))')
        .eq('provider_id', ownProvider.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false }),
    ]);
    const typedRequests = requests as unknown as RemoteBookingRequest[] | null;

    if (availability && availability.length > 0) {
      set({ schedule: availability.map((day) => ({
        day: day.day_name,
        dayIndex: day.day_index,
        enabled: day.enabled,
        slots: Array.isArray(day.slots) ? day.slots as DaySchedule['slots'] : [],
      })) });
    }

    if (typedRequests && typedRequests.length > 0) {
      const mappedRequests: BookingRequest[] = typedRequests.map((request) => {
        const booking = Array.isArray(request.bookings) ? request.bookings[0] : request.bookings;
        const profile = booking && (Array.isArray(booking.profiles) ? booking.profiles[0] : booking.profiles);
        const service = booking && (Array.isArray(booking.services) ? booking.services[0] : booking.services);
        const start = booking?.start_at ? new Date(booking.start_at) : new Date(request.created_at);
        const duration = service?.duration_minutes ?? 30;
        const end = new Date(start.getTime() + duration * 60000);
        return {
          id: request.id,
          bookingId: request.booking_id,
          customerName: profile?.name ?? 'Customer',
          customerAvatar: profile?.avatar_url ?? undefined,
          serviceName: service?.name ?? 'Appointment',
          serviceId: booking?.service_id ?? '',
          durationMinutes: duration,
          date: start.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
          timeRange: `${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
          startISO: start.toISOString(),
          status: request.status,
          price: Number(booking?.price ?? 0),
        };
      });
      set({ bookingRequests: mappedRequests });
    }
  },

  addProvider: (provider) => {
    set((s) => ({ providers: [provider, ...s.providers] }));
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      return supabase.from('providers').insert({
        id: provider.id,
        owner_id: data.user.id,
        name: provider.name,
        category: provider.category,
        rating: provider.rating,
        review_count: provider.reviewCount,
        distance: provider.distance,
        bio: provider.bio,
        image_url: provider.image,
        next_available: provider.nextAvailable,
        slot_interval_minutes: provider.slotIntervalMinutes ?? 30,
        buffer_minutes: provider.bufferMinutes ?? 0,
        instant_confirmation: provider.instantConfirmation ?? false,
        timezone: provider.timezone ?? 'UTC',
        address: provider.address ?? null,
        is_verified: false,
      }).select('id').single().then(({ data: created, error }) => {
        if (error || !created) return;
        return supabase.from('services').insert(provider.services.map((service) => ({
          provider_id: created.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration_minutes: service.durationMinutes,
          category: service.category,
          buffer_minutes: service.bufferMinutes ?? 0,
          is_active: service.isActive ?? true,
        })));
      });
    });
  },

  updateProvider: (id, updates) =>
    set((s) => ({
      providers: s.providers.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  setStudioServices: (services) => set({ studioServices: services }),

  updateStudioServices: (services) => {
    set({ studioServices: services });
    // Also update the provider record if user has a studio
    set((s) => ({
      providers: s.providers.map((p) =>
        p.id === 'wren-co' ? { ...p, services } : p
      ),
    }));
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      return supabase.from('providers').select('id').eq('owner_id', data.user.id).maybeSingle();
    }).then((result) => {
      const providerId = result?.data?.id;
      if (!providerId) return;
      return supabase.from('services').upsert(services.map((service) => ({
        provider_id: providerId,
        name: service.name,
        description: service.description,
        price: service.price,
        duration_minutes: service.durationMinutes,
        category: service.category,
        buffer_minutes: service.bufferMinutes ?? 0,
        is_active: service.isActive ?? true,
      })));
    }).catch(() => {});
  },

  setSchedule: (schedule) => {
    set({ schedule });
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      return supabase.from('providers').select('id').eq('owner_id', data.user.id).maybeSingle();
    }).then((result) => {
      const providerId = result?.data?.id;
      if (!providerId) return;
      return supabase.from('availability').upsert(schedule.map((day) => ({
        provider_id: providerId,
        day_index: day.dayIndex,
        day_name: day.day,
        enabled: day.enabled,
        slots: day.slots,
      })), { onConflict: 'provider_id,day_index' });
    }).catch(() => {});
  },

  toggleDay: (dayName) =>
    set((s) => ({
      schedule: s.schedule.map((d) =>
        d.day === dayName ? { ...d, enabled: !d.enabled } : d
      ),
    })),

  addSlot: (dayName) =>
    set((s) => ({
      schedule: s.schedule.map((d) => {
        if (d.day !== dayName) return d;
        return {
          ...d,
          enabled: true,
          slots: [...d.slots, { start: '09:00 AM', end: '05:00 PM' }],
        };
      }),
    })),

  removeSlot: (dayName, slotIndex) =>
    set((s) => ({
      schedule: s.schedule.map((d) => {
        if (d.day !== dayName) return d;
        const newSlots = d.slots.filter((_, i) => i !== slotIndex);
        return { ...d, slots: newSlots, enabled: newSlots.length > 0 ? d.enabled : false };
      }),
    })),

  addDateOverride: (override) =>
    set((s) => ({
      dateOverrides: [
        ...s.dateOverrides.filter((o) => o.date !== override.date),
        override,
      ],
    })),

  acceptRequest: (requestId) => {
    const prev = get().bookingRequests;
    set((s) => ({
      bookingRequests: s.bookingRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'accepted' } : r
      ),
      acceptedCount: s.acceptedCount + 1,
    }));
    void supabase.from('booking_requests').update({ status: 'accepted' }).eq('id', requestId)
      .then(({ error }) => {
        if (error) {
          set({ bookingRequests: prev, acceptedCount: get().acceptedCount - 1 });
          return;
        }
        set((s) => ({ bookingRequests: s.bookingRequests.filter((r) => r.id !== requestId) }));
      });
  },

  declineRequest: (requestId) => {
    const prev = get().bookingRequests;
    set((s) => ({
      bookingRequests: s.bookingRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'declined' } : r
      ),
      declinedCount: s.declinedCount + 1,
    }));
    void supabase.from('booking_requests').update({ status: 'declined' }).eq('id', requestId)
      .then(({ error }) => {
        if (error) {
          set({ bookingRequests: prev, declinedCount: get().declinedCount - 1 });
          return;
        }
        set((s) => ({ bookingRequests: s.bookingRequests.filter((r) => r.id !== requestId) }));
      });
  },

  markArrived: (agendaId) =>
    set((s) => ({
      todaysAgenda: s.todaysAgenda.map((a) =>
        a.id === agendaId ? { ...a, statusType: 'arrived', status: 'Arrived', active: true } : a
      ),
    })),

  // ─── Availability Engine ───────────────────────────────────────────────────
  // Computes available time slots for a given provider, date, and service duration.
  // Algorithm:
  //   1. Find the provider's weekly schedule for that day of week
  //   2. Check for date overrides (blocked or custom hours)
  //   3. Generate all possible slot start times using slotIntervalMinutes
  //   4. For each slot, check if (slot + serviceDuration + bufferMinutes) overlaps
  //      any existing confirmed/pending booking for that provider on that date
  //   5. Return only non-overlapping slots
  getAvailableSlots: (providerId, dateISO, serviceDurationMinutes, existingBookings) => {
    const { providers, schedule, dateOverrides } = get();
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return [];

    const date = new Date(dateISO);
    const dayOfWeek = date.getDay(); // 0=Sun

    // Check date override
    const dateStr = dateISO.split('T')[0];
    const override = dateOverrides.find((o) => o.date === dateStr);
    if (override?.isBlocked) return [];

    // Find schedule for this day
    const daySchedule = schedule.find((d) => d.dayIndex === dayOfWeek);
    if (!daySchedule || !daySchedule.enabled || daySchedule.slots.length === 0) return [];

    const slotInterval = provider.slotIntervalMinutes || 30;
    const bufferMinutes = provider.bufferMinutes || 0;
    const totalSlotDuration = serviceDurationMinutes + bufferMinutes;

    // Get existing bookings for this provider on this date
    const dateBookings = existingBookings.filter((b) => {
      if (b.providerId !== providerId) return false;
      if (b.status === 'canceled') return false;
      const bDate = b.startISO.split('T')[0];
      return bDate === dateStr;
    });

    const bookedRanges = dateBookings.map((b) => {
      const start = new Date(b.startISO);
      const end = new Date(b.endISO);
      return {
        startMin: start.getHours() * 60 + start.getMinutes(),
        endMin: end.getHours() * 60 + end.getMinutes(),
      };
    });

    const slots: TimeSlot[] = [];

    for (const workSlot of daySchedule.slots) {
      const workStart = override?.customStart
        ? parseTimeToMinutes(override.customStart)
        : parseTimeToMinutes(workSlot.start);
      const workEnd = override?.customEnd
        ? parseTimeToMinutes(override.customEnd)
        : parseTimeToMinutes(workSlot.end);

      let current = workStart;
      while (current + totalSlotDuration <= workEnd) {
        const slotEnd = current + totalSlotDuration;

        // Check overlap with existing bookings
        const hasConflict = bookedRanges.some(
          (r) => current < r.endMin && slotEnd > r.startMin
        );

        const timeStr = minutesToTimeString(current);
        const slotDate = new Date(dateISO);
        slotDate.setHours(Math.floor(current / 60), current % 60, 0, 0);
        const endDate = new Date(slotDate.getTime() + serviceDurationMinutes * 60000);

        slots.push({
          id: `slot-${current}`,
          time: timeStr,
          period: getPeriod(current),
          available: !hasConflict,
          startISO: slotDate.toISOString(),
          endISO: endDate.toISOString(),
        });

        current += slotInterval;
      }
    }

    return slots;
  },

  getPendingCount: () =>
    get().bookingRequests.filter((r) => r.status === 'pending').length,

  getActiveDaysCount: () =>
    get().schedule.filter((d) => d.enabled && d.slots.length > 0).length,

  getTodayBookingsCount: () =>
    get().todaysAgenda.filter((a) => a.statusType !== 'canceled').length,

  getWeekBookingsCount: (allBookings) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return allBookings.filter((b) => {
      if (b.status === 'canceled') return false;
      const d = new Date(b.startISO);
      return d >= weekStart && d < weekEnd;
    }).length;
  },
    }),
    {
      name: 'bookease-provider',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ schedule: s.schedule, dateOverrides: s.dateOverrides }),
    }
  )
);
