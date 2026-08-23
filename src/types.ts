export type UserRole = 'customer' | 'provider';

export type CustomerScreen =
  | 'welcome'
  | 'auth'
  | 'browse'
  | 'provider_profile'
  | 'service_date'
  | 'time_slot'
  | 'payment'
  | 'confirmation'
  | 'my_bookings'
  | 'empty_bookings'
  | 'profile'
  | 'studio_setup'
  | 'review';

export type ProviderScreen =
  | 'dashboard'
  | 'provider_services'
  | 'availability'
  | 'requests';

export type Screen = CustomerScreen | ProviderScreen;

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  bufferMinutes?: number;
  isActive?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  bio: string;
  image: string;
  nextAvailable: string;
  services: Service[];
  slotIntervalMinutes?: number;
  bufferMinutes?: number;
  instantConfirmation?: boolean;
  timezone?: string;
  address?: string;
  isVerified?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
  startISO?: string;
  endISO?: string;
}

export interface Booking {
  id: string;
  refCode: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  startISO: string;
  endISO: string;
  duration: string;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'canceled';
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
  customerName?: string;
  customerAvatar?: string;
  customerNotes?: string;
  cancelReason?: string;
  isPast?: boolean;
  createdAt: string;
}

export interface DaySchedule {
  day: string;
  dayIndex: number; // 0=Sun, 1=Mon ... 6=Sat
  enabled: boolean;
  slots: { start: string; end: string }[];
}

export interface DateOverride {
  date: string; // YYYY-MM-DD
  isBlocked: boolean;
  customStart?: string;
  customEnd?: string;
  reason?: string;
}

export interface BookingRequest {
  id: string;
  bookingId: string;
  customerName: string;
  customerAvatar?: string;
  initials?: string;
  serviceName: string;
  serviceId: string;
  durationMinutes: number;
  date: string;
  timeRange: string;
  startISO: string;
  status: 'pending' | 'accepted' | 'declined';
  isNew?: boolean;
  price: number;
}

export interface AgendaItem {
  id: string;
  time: string;
  duration: string;
  clientName: string;
  service: string;
  status: string;
  statusType: 'upcoming' | 'arrived' | 'canceled' | 'completed';
  active?: boolean;
  canceled?: boolean;
  bookingId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  role: UserRole;
  hasStudio: boolean;
  studioId?: string;
  studioName?: string;
  studioCategory?: string;
  activePassesCount: number;
  pastPassesCount: number;
}

export type PaymentMethod = 'card' | 'apple_pay' | 'pay_later';

export interface StudioSetupData {
  name: string;
  category: string;
  bio: string;
  address: string;
  distance: string;
  slotIntervalMinutes: number;
  bufferMinutes: number;
  instantConfirmation: boolean;
  services: Service[];
}

export interface ProviderStats {
  bookingsToday: number;
  bookingsThisWeek: number;
  pendingRequests: number;
  activeDays: number;
}
