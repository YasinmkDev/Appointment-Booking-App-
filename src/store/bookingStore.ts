import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Provider, Service, TimeSlot, PaymentMethod } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { cancelBookingReminderForBooking, scheduleBookingReminder } from '../services/pushNotifications';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type DatabaseBooking = Database['public']['Tables']['bookings']['Row'];
const supabaseUrlConfigured = () => Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL);

interface BookingFlow {
  provider: Provider | null;
  service: Service | null;
  selectedDate: string;
  selectedDateISO: string;
}

interface BookingState {
  bookings: Booking[];
  flow: BookingFlow;
  currentConfirmedBooking: Booking | null;

  // Flow setters
  setFlowProvider: (provider: Provider) => void;
  setFlowService: (service: Service) => void;
  setFlowDate: (dateDisplay: string, dateISO: string) => void;
  resetFlow: () => void;

  // Booking actions
  confirmBooking: (slot: TimeSlot, paymentMethod: PaymentMethod) => Booking;
  cancelBooking: (bookingId: string, reason?: string) => void;
  setCurrentConfirmedBooking: (booking: Booking) => void;

  // Computed
  getUpcomingBookings: () => Booking[];
  getPastBookings: () => Booking[];
  getActiveCount: () => number;
  hydrateRemote: () => Promise<void>;
}

function generateRefCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BKE-';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function formatDateDisplay(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
}

function formatTimeRange(startISO: string, durationMinutes: number): string {
  const start = new Date(startISO);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const fmt = (d: Date) =>
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${fmt(start)} - ${fmt(end)}`;
}

const EMPTY_FLOW: BookingFlow = {
  provider: null,
  service: null,
  selectedDate: '',
  selectedDateISO: '',
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
  bookings: INITIAL_BOOKINGS,
  flow: EMPTY_FLOW,
  currentConfirmedBooking: null,

  hydrateRemote: async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, providers(name), services(name, duration_minutes)')
      .order('start_at', { ascending: true }) as unknown as {
        data: Array<DatabaseBooking & {
          providers: { name: string } | { name: string }[] | null;
          services: { name: string; duration_minutes: number } | { name: string; duration_minutes: number }[] | null;
        }> | null;
        error: Error | null;
      };
    if (error || !data) return;

    const remoteBookings: Booking[] = data.map((row) => {
      const provider = Array.isArray(row.providers) ? row.providers[0] : row.providers;
      const service = Array.isArray(row.services) ? row.services[0] : row.services;
      return {
        id: row.id,
        refCode: row.ref_code,
        providerId: row.provider_id,
        providerName: provider?.name ?? 'Provider',
        serviceId: row.service_id,
        serviceName: service?.name ?? 'Appointment',
        date: new Date(row.start_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase(),
        time: formatTimeRange(row.start_at, service?.duration_minutes ?? Math.round((new Date(row.end_at).getTime() - new Date(row.start_at).getTime()) / 60000)),
        startISO: row.start_at,
        endISO: row.end_at,
        duration: `${service?.duration_minutes ?? Math.round((new Date(row.end_at).getTime() - new Date(row.start_at).getTime()) / 60000)} min`,
        price: Number(row.price),
        status: row.status,
        paymentStatus: row.payment_status,
        customerNotes: row.customer_notes ?? undefined,
        cancelReason: row.cancel_reason ?? undefined,
        createdAt: row.created_at,
        isPast: new Date(row.end_at) < new Date(),
      };
    });
    set({ bookings: remoteBookings });
  },

  setFlowProvider: (provider) =>
    set((s) => ({ flow: { ...s.flow, provider, service: null } })),

  setFlowService: (service) =>
    set((s) => ({ flow: { ...s.flow, service } })),

  setFlowDate: (dateDisplay, dateISO) =>
    set((s) => ({ flow: { ...s.flow, selectedDate: dateDisplay, selectedDateISO: dateISO } })),

  resetFlow: () => set({ flow: EMPTY_FLOW }),

  confirmBooking: (slot, paymentMethod) => {
    const { flow } = get();
    if (!flow.provider || !flow.service) throw new Error('Booking flow incomplete');

    const startISO = slot.startISO || `${flow.selectedDateISO}T${slot.time}`;
    const endISO =
      slot.endISO ||
      new Date(new Date(startISO).getTime() + flow.service.durationMinutes * 60000).toISOString();

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      refCode: generateRefCode(),
      providerId: flow.provider.id,
      providerName: flow.provider.name,
      serviceId: flow.service.id,
      serviceName: flow.service.name,
      date: flow.selectedDate || formatDateDisplay(startISO),
      time: formatTimeRange(startISO, flow.service.durationMinutes),
      startISO,
      endISO,
      duration: `${flow.service.durationMinutes} min`,
      price: flow.service.price,
      status: flow.provider.instantConfirmation ? 'confirmed' : 'pending',
      paymentStatus: paymentMethod === 'pay_later' ? 'unpaid' : 'paid',
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    set((s) => ({ bookings: [newBooking, ...s.bookings], currentConfirmedBooking: newBooking }));

    // Fire-and-forget to backend; rollback on hard failure
    supabase.auth.getUser().then(({ data: authData }) => {
      if (!authData.user) return null;
      return supabase.from('bookings').insert({
        customer_id: authData.user.id,
        provider_id: newBooking.providerId,
        service_id: newBooking.serviceId,
        start_at: newBooking.startISO,
        end_at: newBooking.endISO,
        status: newBooking.status,
        payment_status: newBooking.paymentStatus ?? 'unpaid',
        price: newBooking.price,
        customer_notes: newBooking.customerNotes ?? null,
        cancel_reason: null,
      }).select('*').single();
    })
      .then((result) => {
        if (!result || result.error || !result.data) return;
        const serverBooking = {
          ...newBooking,
          id: result.data.id,
          refCode: result.data.ref_code,
          startISO: result.data.start_at,
          endISO: result.data.end_at,
          status: result.data.status,
          paymentStatus: result.data.payment_status,
          createdAt: result.data.created_at,
        };
        // Replace optimistic record with server-assigned id/refCode
        set((s) => ({
          bookings: s.bookings.map((b) => b.id === newBooking.id ? serverBooking : b),
          currentConfirmedBooking:
            s.currentConfirmedBooking?.id === newBooking.id ? serverBooking : s.currentConfirmedBooking,
        }));
      })
      .catch(() => {
        // Keep local optimistic data when the backend is unavailable.
        if (!supabaseUrlConfigured()) return;
        set((s) => ({
          bookings: s.bookings.filter((b) => b.id !== newBooking.id),
          currentConfirmedBooking: null,
        }));
      });

    return newBooking;
  },

  cancelBooking: (bookingId, reason) => {
    const prev = get().bookings;
    const booking = prev.find((item) => item.id === bookingId);
    // Optimistic update
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'canceled', cancelReason: reason } : b
      ),
    }));
    if (booking) cancelBookingReminderForBooking(bookingId).catch(() => {});
    supabase.from('bookings').update({ status: 'canceled', cancel_reason: reason }).eq('id', bookingId)
      .then(({ error }) => {
        if (!error) return;
        if (!supabaseUrlConfigured()) return;
        set({ bookings: prev }); // rollback
        if (booking) scheduleBookingReminder(booking).catch(() => {});
      });
  },

  setCurrentConfirmedBooking: (booking) => set({ currentConfirmedBooking: booking }),

  getUpcomingBookings: () => {
    const now = new Date();
    return get().bookings.filter(
      (b) => !b.isPast && b.status !== 'completed' && b.status !== 'canceled' && new Date(b.startISO) >= now
    );
  },

  getPastBookings: () =>
    get().bookings.filter((b) => b.isPast || b.status === 'completed'),

  getActiveCount: () =>
    get().bookings.filter((b) => !b.isPast && b.status !== 'completed' && b.status !== 'canceled').length,
    }),
    {
      name: 'bookease-bookings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ bookings: s.bookings }),
    }
  )
);
