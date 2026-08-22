import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Compass, Ticket, Calendar, Clock, Bell, User, Layers } from 'lucide-react';
import { UserRole, Screen } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface BottomNavBarProps {
  role: UserRole;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  pendingRequestsCount?: number;
  activeBookingsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  role,
  currentScreen,
  onNavigate,
  pendingRequestsCount = 4,
  activeBookingsCount = 2,
}) => {
  if (currentScreen === 'welcome' || currentScreen === 'auth' || currentScreen === 'studio_setup') {
    return null;
  }

  if (role === 'customer') {
    return (
      <View style={styles.container}>
        {/* Explore Tab */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onNavigate('browse')}
          style={styles.tabButton}
        >
          <Compass
            size={20}
            color={
              ['browse', 'provider_profile', 'service_date', 'time_slot'].includes(
                currentScreen
              )
                ? Colors.marigoldDeep
                : Colors.slate
            }
          />
          <Text
            style={[
              styles.tabText,
              ['browse', 'provider_profile', 'service_date', 'time_slot'].includes(
                currentScreen
              )
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            Explore
          </Text>
        </TouchableOpacity>

        {/* My Passes Tab */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onNavigate('my_bookings')}
          style={styles.tabButton}
        >
          <View style={styles.iconWrapper}>
            <Ticket
              size={20}
              color={
                ['my_bookings', 'confirmation', 'empty_bookings'].includes(currentScreen)
                  ? Colors.marigoldDeep
                  : Colors.slate
              }
            />
            {activeBookingsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeBookingsCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.tabText,
              ['my_bookings', 'confirmation', 'empty_bookings'].includes(currentScreen)
                ? styles.tabTextActive
                : styles.tabTextInactive,
            ]}
          >
            Passes
          </Text>
        </TouchableOpacity>

        {/* Member Profile / Open Studio Tab */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onNavigate('profile')}
          style={styles.tabButton}
        >
          <User
            size={20}
            color={currentScreen === 'profile' ? Colors.marigoldDeep : Colors.slate}
          />
          <Text
            style={[
              styles.tabText,
              currentScreen === 'profile' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Account
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Studio / Provider Navigation
  return (
    <View style={styles.container}>
      {/* Today's Agenda */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onNavigate('dashboard')}
        style={styles.tabButton}
      >
        <Calendar
          size={20}
          color={currentScreen === 'dashboard' ? Colors.marigoldDeep : Colors.slate}
        />
        <Text
          style={[
            styles.tabText,
            currentScreen === 'dashboard' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Agenda
        </Text>
      </TouchableOpacity>

      {/* Services & Catalog */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onNavigate('provider_services')}
        style={styles.tabButton}
      >
        <Layers
          size={20}
          color={currentScreen === 'provider_services' ? Colors.marigoldDeep : Colors.slate}
        />
        <Text
          style={[
            styles.tabText,
            currentScreen === 'provider_services' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Services
        </Text>
      </TouchableOpacity>

      {/* Availability / Schedule Manager */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onNavigate('availability')}
        style={styles.tabButton}
      >
        <Clock
          size={20}
          color={currentScreen === 'availability' ? Colors.marigoldDeep : Colors.slate}
        />
        <Text
          style={[
            styles.tabText,
            currentScreen === 'availability' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Hours
        </Text>
      </TouchableOpacity>

      {/* Booking Requests */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onNavigate('requests')}
        style={styles.tabButton}
      >
        <View style={styles.iconWrapper}>
          <Bell
            size={20}
            color={currentScreen === 'requests' ? Colors.marigoldDeep : Colors.slate}
          />
          {pendingRequestsCount > 0 && (
            <View style={styles.badgeNotification}>
              <Text style={styles.badgeText}>{pendingRequestsCount}</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.tabText,
            currentScreen === 'requests' ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Requests
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 62,
    backgroundColor: Colors.alabasterCard,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
  },
  iconWrapper: {
    position: 'relative',
  },
  tabText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: Colors.inkPlum,
    fontWeight: '700',
  },
  tabTextInactive: {
    color: Colors.slate,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeNotification: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.dustyRose,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.inkPlum,
    fontSize: 9,
    fontFamily: Fonts.mono,
    fontWeight: '700',
  },
});
