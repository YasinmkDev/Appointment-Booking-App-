/**
 * BookEase - Tactile Mobile Appointment Ledger
 * React Native / Expo Android Architecture
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';
import {
  UserRole,
  Screen,
  Provider,
  Service,
  TimeSlot,
  Booking,
  UserProfile,
} from './types';
import {
  INITIAL_PROVIDERS,
  INITIAL_BOOKINGS,
  INITIAL_USER_PROFILE,
  INITIAL_STUDIO_SERVICES,
} from './data/mockData';
import { Colors } from './theme/colors';
import { Fonts } from './theme/fonts';

// Native Layout & Navigation Components
import { TopAppBar } from './components/native/TopAppBar';
import { BottomNavBar } from './components/native/BottomNavBar';
import { ScreenSelectorModal } from './components/native/ScreenSelectorModal';

// Native Customer Screens
import { WelcomeScreen } from './screens/native/WelcomeScreen';
import { AuthScreen } from './screens/native/AuthScreen';
import { BrowseProvidersScreen } from './screens/native/BrowseProvidersScreen';
import { ProviderProfileScreen } from './screens/native/ProviderProfileScreen';
import { ServiceDateSelectionScreen } from './screens/native/ServiceDateSelectionScreen';
import { TimeSlotSelectionScreen } from './screens/native/TimeSlotSelectionScreen';
import { BookingConfirmationScreen } from './screens/native/BookingConfirmationScreen';
import { MyBookingsScreen } from './screens/native/MyBookingsScreen';
import { EmptyBookingsScreen } from './screens/native/EmptyBookingsScreen';
import { ProfileScreen } from './screens/native/ProfileScreen';
import { StudioSetupScreen } from './screens/native/StudioSetupScreen';

// Native Provider Screens
import { ProviderDashboardScreen } from './screens/native/ProviderDashboardScreen';
import { ProviderServicesManagerScreen } from './screens/native/ProviderServicesManagerScreen';
import { AvailabilityManagerScreen } from './screens/native/AvailabilityManagerScreen';
import { BookingRequestsScreen } from './screens/native/BookingRequestsScreen';

export default function App() {
  const [role, setRole] = useState<UserRole>('customer');
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
  const [deviceFrameMode, setDeviceFrameMode] = useState(true);

  // App & User State
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [selectedProvider, setSelectedProvider] = useState<Provider>(INITIAL_PROVIDERS[0]);
  const [selectedService, setSelectedService] = useState<Service>(INITIAL_PROVIDERS[0].services[0]);
  const [selectedDate, setSelectedDate] = useState<string>('Tuesday, Oct 13');
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [currentConfirmedBooking, setCurrentConfirmedBooking] = useState<Booking>(INITIAL_BOOKINGS[0]);
  const [studioServices, setStudioServices] = useState<Service[]>(INITIAL_STUDIO_SERVICES);

  // Handle Role Switch
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'customer') {
      setCurrentScreen('browse');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  // Handle Screen Jumps from Modal
  const handleSelectScreenFromModal = (screen: Screen, targetRole: UserRole) => {
    setRole(targetRole);
    setCurrentScreen(screen);
  };

  // Auth Handlers
  const handleAuthSuccess = (authenticatedUser: UserProfile, targetRole: UserRole) => {
    setUser(authenticatedUser);
    setRole(targetRole);
    if (targetRole === 'provider') {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('browse');
    }
  };

  // Studio Creation Handler (Wizard Completion)
  const handleCompleteStudioSetup = (newStudio: Provider) => {
    setProviders((prev) => [newStudio, ...prev]);
    setSelectedProvider(newStudio);
    setStudioServices(newStudio.services);
    setUser((prev) => ({
      ...prev,
      hasStudio: true,
      studioId: newStudio.id,
      studioName: newStudio.name,
      studioCategory: newStudio.category,
      role: 'provider',
    }));
    setRole('provider');
    setCurrentScreen('dashboard');
  };

  // Provider Services Catalog Update
  const handleUpdateStudioServices = (updatedServices: Service[]) => {
    setStudioServices(updatedServices);
    setProviders((prev) =>
      prev.map((p) => {
        if (p.id === 'wren-co' || p.id === user.studioId) {
          return { ...p, services: updatedServices };
        }
        return p;
      })
    );
  };

  // Customer Booking Navigation Handlers
  const handleGetStarted = () => {
    setCurrentScreen('auth');
  };

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    if (provider.services.length > 0) {
      setSelectedService(provider.services[0]);
    }
    setCurrentScreen('provider_profile');
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setCurrentScreen('service_date');
  };

  const handleSelectDate = (dateString: string) => {
    setSelectedDate(dateString);
    setCurrentScreen('time_slot');
  };

  const handleConfirmSlot = (slot: TimeSlot) => {
    const randomCode = `BKE-${Math.floor(1000 + Math.random() * 9000)}X`;
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      refCode: randomCode,
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      serviceName: selectedService.name,
      date: selectedDate,
      time: `${slot.time} - Approx. ${selectedService.durationMinutes}m`,
      duration: `${selectedService.durationMinutes} min`,
      price: selectedService.price,
      status: 'confirmed',
    };

    setBookings((prev) => [newBooking, ...prev]);
    setUser((prev) => ({
      ...prev,
      activePassesCount: prev.activePassesCount + 1,
    }));
    setCurrentConfirmedBooking(newBooking);
    setCurrentScreen('confirmation');
  };

  const handleBack = () => {
    if (currentScreen === 'confirmation') {
      setCurrentScreen('my_bookings');
    } else if (currentScreen === 'time_slot') {
      setCurrentScreen('service_date');
    } else if (currentScreen === 'service_date') {
      setCurrentScreen('provider_profile');
    } else if (currentScreen === 'provider_profile') {
      setCurrentScreen('browse');
    } else if (currentScreen === 'empty_bookings') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'studio_setup') {
      setCurrentScreen('profile');
    } else if (currentScreen === 'auth') {
      setCurrentScreen('welcome');
    } else {
      setCurrentScreen('browse');
    }
  };

  // Determine screen header title
  const getScreenTitle = () => {
    if (currentScreen === 'welcome') return 'BookEase';
    if (currentScreen === 'auth') return 'Sign In / Register';
    if (currentScreen === 'browse') return 'BookEase';
    if (currentScreen === 'provider_profile') return selectedProvider.name;
    if (currentScreen === 'service_date') return 'Select Date';
    if (currentScreen === 'time_slot') return 'Select Time';
    if (currentScreen === 'confirmation') return 'Pass Confirmed';
    if (currentScreen === 'my_bookings') return 'My Bookings';
    if (currentScreen === 'empty_bookings') return 'My Bookings';
    if (currentScreen === 'profile') return 'Member Passbook';
    if (currentScreen === 'studio_setup') return 'Open Your Studio';
    if (currentScreen === 'dashboard') return user.studioName || 'Wren & Co.';
    if (currentScreen === 'provider_services') return 'Service Catalog';
    if (currentScreen === 'availability') return 'Availability & Shifts';
    if (currentScreen === 'requests') return 'Booking Requests';
    return 'BookEase';
  };

  return (
    <SafeAreaView style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.inkPlum} />

      {/* Top Banner Toolbar for Presentation / Evaluation */}
      <View style={styles.topBanner}>
        <View style={styles.bannerLeft}>
          <Text style={styles.bannerLogo}>BookEase</Text>
          <Text style={styles.bannerDivider}>|</Text>
          <Text style={styles.bannerTagline}>React Native • Expo Android</Text>
        </View>

        <View style={styles.bannerRight}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsScreenModalOpen(true)}
            style={styles.navTriggerBtn}
          >
            <Sparkles size={13} color={Colors.inkPlum} />
            <Text style={styles.navTriggerText}>Screen Navigator (15)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setDeviceFrameMode(!deviceFrameMode)}
            style={styles.frameToggleBtn}
          >
            {deviceFrameMode ? (
              <>
                <Monitor size={13} color={Colors.warmAlabaster} />
                <Text style={styles.frameToggleText}>Full View</Text>
              </>
            ) : (
              <>
                <Smartphone size={13} color={Colors.warmAlabaster} />
                <Text style={styles.frameToggleText}>Android Frame</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main App Container */}
      <View style={styles.centerContainer}>
        <View
          style={[
            styles.appContainer,
            deviceFrameMode ? styles.frameModeContainer : styles.fullModeContainer,
          ]}
        >
          {/* Android Phone Status Bar (Frame Mode) */}
          {deviceFrameMode && (
            <View style={styles.mockStatusBar}>
              <Text style={styles.statusTime}>9:41</Text>
              <View style={styles.cameraPunchhole} />
              <View style={styles.statusIcons}>
                <Text style={styles.status5G}>5G</Text>
                <View style={styles.batteryIcon}>
                  <View style={styles.batteryFill} />
                </View>
              </View>
            </View>
          )}

          {/* Top App Bar */}
          <TopAppBar
            role={role}
            currentScreen={currentScreen}
            onRoleChange={handleRoleChange}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onBack={handleBack}
            onOpenScreenModal={() => setIsScreenModalOpen(true)}
            title={getScreenTitle()}
          />

          {/* Active Screen View */}
          <View style={styles.screenViewport}>
            {/* Customer Screens */}
            {currentScreen === 'welcome' && (
              <WelcomeScreen onGetStarted={handleGetStarted} />
            )}

            {currentScreen === 'auth' && (
              <AuthScreen
                onAuthSuccess={handleAuthSuccess}
                onContinueAsGuest={() => setCurrentScreen('browse')}
              />
            )}

            {currentScreen === 'browse' && (
              <BrowseProvidersScreen
                providers={providers}
                onSelectProvider={handleSelectProvider}
              />
            )}

            {currentScreen === 'provider_profile' && (
              <ProviderProfileScreen
                provider={selectedProvider}
                onSelectService={handleSelectService}
              />
            )}

            {currentScreen === 'service_date' && (
              <ServiceDateSelectionScreen
                provider={selectedProvider}
                service={selectedService}
                onSelectDate={handleSelectDate}
              />
            )}

            {currentScreen === 'time_slot' && (
              <TimeSlotSelectionScreen
                provider={selectedProvider}
                service={selectedService}
                selectedDate={selectedDate}
                onConfirmBooking={handleConfirmSlot}
              />
            )}

            {currentScreen === 'confirmation' && (
              <BookingConfirmationScreen
                booking={currentConfirmedBooking}
                onBackToBrowse={() => setCurrentScreen('browse')}
                onViewMyBookings={() => setCurrentScreen('my_bookings')}
              />
            )}

            {currentScreen === 'my_bookings' && (
              <MyBookingsScreen
                bookings={bookings}
                onSelectBooking={(bk) => {
                  setCurrentConfirmedBooking(bk);
                  setCurrentScreen('confirmation');
                }}
                onBrowseProviders={() => setCurrentScreen('browse')}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                user={user}
                onOpenStudioSetup={() => setCurrentScreen('studio_setup')}
                onSwitchToStudio={() => {
                  setRole('provider');
                  setCurrentScreen('dashboard');
                }}
                onViewMyBookings={() => setCurrentScreen('my_bookings')}
                onViewEmptyBookings={() => setCurrentScreen('empty_bookings')}
                onSignOut={() => setCurrentScreen('auth')}
              />
            )}

            {currentScreen === 'studio_setup' && (
              <StudioSetupScreen
                onCompleteSetup={handleCompleteStudioSetup}
                onCancel={() => setCurrentScreen('profile')}
              />
            )}

            {currentScreen === 'empty_bookings' && (
              <EmptyBookingsScreen
                onBrowseProviders={() => setCurrentScreen('browse')}
              />
            )}

            {/* Provider Screens */}
            {currentScreen === 'dashboard' && (
              <ProviderDashboardScreen
                onNavigateToRequests={() => setCurrentScreen('requests')}
                onNavigateToAvailability={() => setCurrentScreen('availability')}
              />
            )}

            {currentScreen === 'provider_services' && (
              <ProviderServicesManagerScreen
                services={studioServices}
                onUpdateServices={handleUpdateStudioServices}
              />
            )}

            {currentScreen === 'availability' && <AvailabilityManagerScreen />}

            {currentScreen === 'requests' && <BookingRequestsScreen />}
          </View>

          {/* Bottom Navigation Bar */}
          <BottomNavBar
            role={role}
            currentScreen={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            pendingRequestsCount={4}
            activeBookingsCount={bookings.filter((b) => !b.isPast).length}
          />

          {/* Android Navigation Pill in Frame Mode */}
          {deviceFrameMode && (
            <View style={styles.androidNavPillContainer}>
              <View style={styles.androidNavPill} />
            </View>
          )}
        </View>
      </View>

      {/* Screen Selection Modal */}
      <ScreenSelectorModal
        isOpen={isScreenModalOpen}
        onClose={() => setIsScreenModalOpen(false)}
        currentScreen={currentScreen}
        onSelectScreen={handleSelectScreenFromModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#EBE8E1',
  },
  topBanner: {
    backgroundColor: Colors.inkPlum,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(206, 196, 203, 0.2)',
    zIndex: 50,
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerLogo: {
    fontFamily: Fonts.serif,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.marigoldLight,
  },
  bannerDivider: {
    color: 'rgba(206, 196, 203, 0.5)',
    fontSize: 12,
  },
  bannerTagline: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.outline,
  },
  bannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navTriggerBtn: {
    backgroundColor: Colors.marigoldLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  navTriggerText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  frameToggleBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  frameToggleText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.warmAlabaster,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  appContainer: {
    width: '100%',
    backgroundColor: Colors.warmAlabaster,
    position: 'relative',
    overflow: 'hidden',
  },
  frameModeContainer: {
    maxWidth: 430,
    height: 820,
    borderRadius: 36,
    borderWidth: 10,
    borderColor: Colors.inkPlum,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  fullModeContainer: {
    maxWidth: 480,
    flex: 1,
    minHeight: '100%',
  },
  mockStatusBar: {
    backgroundColor: Colors.alabasterCard,
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(206, 196, 203, 0.3)',
  },
  statusTime: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  cameraPunchhole: {
    width: 60,
    height: 14,
    backgroundColor: Colors.inkPlum,
    borderRadius: 8,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  status5G: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
  },
  batteryIcon: {
    width: 16,
    height: 9,
    borderWidth: 1,
    borderColor: Colors.slate,
    borderRadius: 2,
    padding: 1,
  },
  batteryFill: {
    width: '80%',
    height: '100%',
    backgroundColor: Colors.slate,
  },
  screenViewport: {
    flex: 1,
    backgroundColor: Colors.warmAlabaster,
  },
  androidNavPillContainer: {
    position: 'absolute',
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 60,
    pointerEvents: 'none',
  },
  androidNavPill: {
    width: 90,
    height: 3.5,
    backgroundColor: 'rgba(43, 27, 46, 0.4)',
    borderRadius: 2,
  },
});
