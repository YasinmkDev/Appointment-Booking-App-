/**
 * BookEase - Tactile Mobile Appointment Ledger
 * React Native / Expo — Zustand-powered architecture
 */

import React, { useState, useEffect } from 'react';
import { View, StatusBar, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Screen, Provider, Service, TimeSlot, UserProfile, UserRole, PaymentMethod } from './types';
import { Colors } from './theme/colors';
import { registerForPushNotifications, scheduleBookingReminder } from './services/pushNotifications';
import { startSupabaseAuthRefresh } from './lib/supabase';

// Stores
import { useAuthStore } from './store/authStore';
import { useBookingStore } from './store/bookingStore';
import { useProviderStore } from './store/providerStore';

// Layout Components
import { TopAppBar } from './components/native/TopAppBar';
import { BottomNavBar } from './components/native/BottomNavBar';
import { ScreenSelectorModal } from './components/native/ScreenSelectorModal';
import { NotificationBanner } from './components/native/NotificationBanner';

// Customer Screens
import { WelcomeScreen } from './screens/native/WelcomeScreen';
import { AuthScreen } from './screens/native/AuthScreen';
import { BrowseProvidersScreen } from './screens/native/BrowseProvidersScreen';
import { ProviderProfileScreen } from './screens/native/ProviderProfileScreen';
import { ServiceDateSelectionScreen } from './screens/native/ServiceDateSelectionScreen';
import { TimeSlotSelectionScreen } from './screens/native/TimeSlotSelectionScreen';
import { PaymentScreen } from './screens/native/PaymentScreen';
import { ReviewScreen } from './screens/native/ReviewScreen';
import { BookingConfirmationScreen } from './screens/native/BookingConfirmationScreen';
import { MyBookingsScreen } from './screens/native/MyBookingsScreen';
import { EmptyBookingsScreen } from './screens/native/EmptyBookingsScreen';
import { ProfileScreen } from './screens/native/ProfileScreen';
import { StudioSetupScreen } from './screens/native/StudioSetupScreen';

// Provider Screens
import { ProviderDashboardScreen } from './screens/native/ProviderDashboardScreen';
import { ProviderServicesManagerScreen } from './screens/native/ProviderServicesManagerScreen';
import { AvailabilityManagerScreen } from './screens/native/AvailabilityManagerScreen';
import { BookingRequestsScreen } from './screens/native/BookingRequestsScreen';

export default function App() {
  const insets = useSafeAreaInsets();
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);

  // ── Auth Store ──────────────────────────────────────────────────────────────
  const {
    user, role, currentScreen, isHydrated,
    isAuthenticated, setCurrentScreen, login, loginAsGuest, logout, switchRole, setUser, hydrate,
  } = useAuthStore();

  // Hydrate auth session from AsyncStorage on launch
  useEffect(() => { hydrate(); }, []);
  useEffect(() => startSupabaseAuthRefresh(), []);

  const hydrateBookings = useBookingStore((s) => s.hydrateRemote);
  const hydrateProviders = useProviderStore((s) => s.hydrateRemote);

  // Register for push notifications once authenticated
  useEffect(() => {
    hydrateProviders().catch(() => {});
    if (isAuthenticated) {
      registerForPushNotifications().catch(() => {});
      hydrateBookings().catch(() => {});
    }
  }, [isAuthenticated, hydrateBookings, hydrateProviders]);

  // ── Booking Store ───────────────────────────────────────────────────────────
  const {
    bookings, flow, currentConfirmedBooking,
    setFlowProvider, setFlowService, setFlowDate,
    confirmBooking, setCurrentConfirmedBooking, getActiveCount,
  } = useBookingStore();

  // Pending slot held between time_slot → payment → confirmation
  const [pendingSlot, setPendingSlot] = useState<TimeSlot | null>(null);
  // Booking selected for review
  const [reviewBooking, setReviewBooking] = useState<import('./types').Booking | null>(null);

  // ── Provider Store ──────────────────────────────────────────────────────────
  const {
    providers, studioServices,
    addProvider, updateStudioServices, getPendingCount,
  } = useProviderStore();

  // ── Navigation Helpers ──────────────────────────────────────────────────────
  const go = (screen: Screen) => setCurrentScreen(screen);

  const handleBack = () => {
    const backMap: Partial<Record<Screen, Screen>> = {
      confirmation: 'my_bookings',
      payment: 'time_slot',
      time_slot: 'service_date',
      service_date: 'provider_profile',
      provider_profile: 'browse',
      empty_bookings: 'profile',
      studio_setup: 'profile',
      review: 'my_bookings',
      auth: 'welcome',
    };
    go(backMap[currentScreen] ?? 'browse');
  };

  // ── Auth Handlers ───────────────────────────────────────────────────────────
  const handleAuthSuccess = (authenticatedUser: UserProfile, targetRole: UserRole) => {
    login(authenticatedUser, targetRole);
  };

  // ── Booking Flow Handlers ───────────────────────────────────────────────────
  const handleSelectProvider = (provider: Provider) => {
    setFlowProvider(provider);
    go('provider_profile');
  };

  const handleSelectService = (service: Service) => {
    setFlowService(service);
    go('service_date');
  };

  const handleSelectDate = (dateDisplay: string, dateISO: string) => {
    setFlowDate(dateDisplay, dateISO);
    go('time_slot');
  };

  // Time slot selected → go to payment step
  const handleConfirmSlot = (slot: TimeSlot) => {
    setPendingSlot(slot);
    go('payment');
  };

  // Payment confirmed → finalize booking
  const handleConfirmPayment = (slot: TimeSlot, method: PaymentMethod) => {
    try {
      const booking = confirmBooking(slot, method);
      setUser({ ...user, activePassesCount: user.activePassesCount + 1 });
      setPendingSlot(null);
      // Schedule a local reminder 1 hour before the appointment
      scheduleBookingReminder(booking).catch(() => {});
      go('confirmation');
    } catch (e) {
      go('browse');
    }
  };

  // ── Studio Setup ────────────────────────────────────────────────────────────
  const handleCompleteStudioSetup = (newStudio: Provider) => {
    addProvider(newStudio);
    updateStudioServices(newStudio.services);
    setUser({
      ...user,
      hasStudio: true,
      studioId: newStudio.id,
      studioName: newStudio.name,
      studioCategory: newStudio.category,
      role: 'provider',
    });
    switchRole('provider');
  };

  // ── Role Switch ─────────────────────────────────────────────────────────────
  const handleRoleChange = (newRole: UserRole) => switchRole(newRole);

  const handleSelectScreenFromModal = (screen: Screen, targetRole: UserRole) => {
    useAuthStore.getState().setRole(targetRole);
    go(screen);
  };

  // ── Screen Title ────────────────────────────────────────────────────────────
  const getScreenTitle = (): string => {
    const titles: Partial<Record<Screen, string>> = {
      welcome: 'BookEase',
      auth: 'Sign In / Register',
      browse: 'BookEase',
      provider_profile: flow.provider?.name ?? 'Studio',
      service_date: 'Select Date',
      time_slot: 'Select Time',
      payment: 'Checkout',
      review: 'Write a Review',
      confirmation: 'Pass Confirmed',
      my_bookings: 'My Bookings',
      empty_bookings: 'My Bookings',
      profile: 'Member Passbook',
      studio_setup: 'Open Your Studio',
      dashboard: user.studioName ?? 'Studio Dashboard',
      provider_services: 'Service Catalog',
      availability: 'Availability & Shifts',
      requests: 'Booking Requests',
    };
    return titles[currentScreen] ?? 'BookEase';
  };

  const noNavScreens = ['welcome', 'auth', 'studio_setup'];
  const showNav = !noNavScreens.includes(currentScreen);

  if (!isHydrated) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.inkPlum} />
        <ActivityIndicator size="large" color={Colors.marigoldLight} />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.inkPlum} />

      <View style={[styles.appContainer, { paddingTop: insets.top }]}>
        <TopAppBar
          role={role}
          currentScreen={currentScreen}
          onRoleChange={handleRoleChange}
          onNavigate={go}
          onBack={handleBack}
          onOpenScreenModal={() => setIsScreenModalOpen(true)}
          title={getScreenTitle()}
        />

        <View style={[styles.screenViewport, showNav && { paddingBottom: 62 + insets.bottom }]}>

          {/* ── Customer Screens ─────────────────────────────────────────── */}
          {currentScreen === 'welcome' && (
            <WelcomeScreen onGetStarted={() => go('auth')} />
          )}

          {currentScreen === 'auth' && (
            <AuthScreen
              onAuthSuccess={handleAuthSuccess}
              onContinueAsGuest={loginAsGuest}
            />
          )}

          {currentScreen === 'browse' && (
            <BrowseProvidersScreen
              providers={providers}
              onSelectProvider={handleSelectProvider}
            />
          )}

          {currentScreen === 'provider_profile' && flow.provider && (
            <ProviderProfileScreen
              provider={flow.provider}
              onSelectService={handleSelectService}
            />
          )}

          {currentScreen === 'service_date' && flow.provider && flow.service && (
            <ServiceDateSelectionScreen
              provider={flow.provider}
              service={flow.service}
              onSelectDate={handleSelectDate}
            />
          )}

          {currentScreen === 'time_slot' && flow.provider && flow.service && (
            <TimeSlotSelectionScreen
              provider={flow.provider}
              service={flow.service}
              selectedDate={flow.selectedDate}
              selectedDateISO={flow.selectedDateISO}
              onConfirmBooking={handleConfirmSlot}
            />
          )}

          {currentScreen === 'payment' && flow.provider && flow.service && pendingSlot && (
            <PaymentScreen
              provider={flow.provider}
              service={flow.service}
              selectedDate={flow.selectedDate}
              slot={pendingSlot}
              onConfirmPayment={handleConfirmPayment}
              onBack={() => go('time_slot')}
            />
          )}

          {currentScreen === 'confirmation' && currentConfirmedBooking && (
            <BookingConfirmationScreen
              booking={currentConfirmedBooking}
              onBackToBrowse={() => go('browse')}
              onViewMyBookings={() => go('my_bookings')}
            />
          )}

          {currentScreen === 'my_bookings' && (
            <MyBookingsScreen
              bookings={bookings}
              onSelectBooking={(bk) => {
                setCurrentConfirmedBooking(bk);
                go('confirmation');
              }}
              onBrowseProviders={() => go('browse')}
              onReviewBooking={(bk) => {
                setReviewBooking(bk);
                go('review');
              }}
            />
          )}

          {currentScreen === 'review' && reviewBooking && (
            <ReviewScreen
              booking={reviewBooking}
              authorName={user.name}
              onSubmitted={() => { setReviewBooking(null); go('my_bookings'); }}
              onSkip={() => { setReviewBooking(null); go('my_bookings'); }}
            />
          )}

          {currentScreen === 'empty_bookings' && (
            <EmptyBookingsScreen onBrowseProviders={() => go('browse')} />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              user={user}
              onOpenStudioSetup={() => go('studio_setup')}
              onSwitchToStudio={() => switchRole('provider')}
              onViewMyBookings={() => go('my_bookings')}
              onViewEmptyBookings={() => go('empty_bookings')}
              onSignOut={logout}
            />
          )}

          {currentScreen === 'studio_setup' && (
            <StudioSetupScreen
              onCompleteSetup={handleCompleteStudioSetup}
              onCancel={() => go('profile')}
            />
          )}

          {/* ── Provider Screens ─────────────────────────────────────────── */}
          {currentScreen === 'dashboard' && (
            <ProviderDashboardScreen
              onNavigateToRequests={() => go('requests')}
              onNavigateToAvailability={() => go('availability')}
            />
          )}

          {currentScreen === 'provider_services' && (
            <ProviderServicesManagerScreen
              services={studioServices}
              onUpdateServices={updateStudioServices}
            />
          )}

          {currentScreen === 'availability' && <AvailabilityManagerScreen />}

          {currentScreen === 'requests' && <BookingRequestsScreen />}
        </View>

        {/* Global notification banner — floats above all screens */}
        <NotificationBanner />

        <BottomNavBar
          role={role}
          currentScreen={currentScreen}
          onNavigate={go}
          pendingRequestsCount={getPendingCount()}
          activeBookingsCount={getActiveCount()}
        />
      </View>

      <ScreenSelectorModal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={handleSelectScreenFromModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.inkPlum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#EBE8E1',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.warmAlabaster,
    position: 'relative',
    overflow: 'hidden',
  },
  screenViewport: {
    flex: 1,
    backgroundColor: Colors.warmAlabaster,
  },
});
