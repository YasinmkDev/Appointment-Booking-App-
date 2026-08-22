export type UserRole = 'customer' | 'provider';

export type CustomerScreen = 
  | 'welcome'
  | 'auth'
  | 'browse'
  | 'provider_profile'
  | 'service_date'
  | 'time_slot'
  | 'confirmation'
  | 'my_bookings'
  | 'empty_bookings'
  | 'profile'
  | 'studio_setup';

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
}

export interface TimeSlot {
  id: string;
  time: string; // e.g. "10:30 AM"
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface Booking {
  id: string;
  refCode: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  date: string; // e.g. "Oct 24, 2024"
  time: string; // e.g. "14:00 - 15:30"
  duration: string;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'canceled';
  customerName?: string;
  customerAvatar?: string;
  isPast?: boolean;
}

export interface DaySchedule {
  day: string;
  enabled: boolean;
  slots: { start: string; end: string }[];
}

export interface BookingRequest {
  id: string;
  customerName: string;
  customerAvatar?: string;
  initials?: string;
  serviceName: string;
  durationMinutes: number;
  date: string;
  timeRange: string;
  status: 'pending' | 'accepted' | 'declined';
  isNew?: boolean;
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
