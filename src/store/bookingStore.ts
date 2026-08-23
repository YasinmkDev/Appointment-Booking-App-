import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Provider, Service, TimeSlot, PaymentMethod } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { api, ApiError } from '../api/client';
import { cancelBookingReminderForBooking, scheduleBookingReminder } from '../services/pushNotifications';

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
    api.post<Booking>('/bookings', { ...newBooking, paymentMethod })
      .then((serverBooking) => {
        // Replace optimistic record with server-assigned id/refCode
        set((s) => ({
          bookings: s.bookings.map((b) => b.id === newBooking.id ? serverBooking : b),
          currentConfirmedBooking:
            s.currentConfirmedBooking?.id === newBooking.id ? serverBooking : s.currentConfirmedBooking,
        }));
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 0) return; // no backend — keep optimistic
        // Real server error — rollback
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
    api.patch(`/bookings/${bookingId}`, { status: 'canceled', cancelReason: reason })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 0) return;
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
