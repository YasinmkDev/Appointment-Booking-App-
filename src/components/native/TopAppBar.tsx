import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft, Sparkles, User, Store } from 'lucide-react-native';
import { UserRole, Screen } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface TopAppBarProps {
  role: UserRole;
  currentScreen: Screen;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (screen: Screen) => void;
  onBack: () => void;
  onOpenScreenModal: () => void;
  title: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  role,
  currentScreen,
  onRoleChange,
  onBack,
  onOpenScreenModal,
  title,
}) => {
  const showBackButton = [
    'provider_profile',
    'service_date',
    'time_slot',
    'confirmation',
    'empty_bookings',
    'studio_setup',
  ].includes(currentScreen);

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton ? (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={styles.iconButton}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={18} color={Colors.inkPlum} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandIconContainer}>
            <View style={styles.brandSquare}>
              <Text style={styles.brandSquareText}>BE</Text>
            </View>
          </View>
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {/* Role Switcher Pill */}
        {currentScreen !== 'welcome' && currentScreen !== 'auth' && (
          <View style={styles.roleSwitcherContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onRoleChange('customer')}
              style={[
                styles.roleButton,
                role === 'customer' ? styles.roleButtonActive : styles.roleButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  role === 'customer' ? styles.roleTextActive : styles.roleTextInactive,
                ]}
              >
                Client
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onRoleChange('provider')}
              style={[
                styles.roleButton,
                role === 'provider' ? styles.roleButtonActive : styles.roleButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.roleText,
                  role === 'provider' ? styles.roleTextActive : styles.roleTextInactive,
                ]}
              >
                Studio
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Screen Navigator Modal Trigger */}
        <TouchableOpacity
          onPress={onOpenScreenModal}
          activeOpacity={0.7}
          style={styles.navigatorButton}
          accessibilityLabel="Open screen navigator"
        >
          <Sparkles size={14} color={Colors.inkPlum} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    backgroundColor: Colors.alabasterCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 30,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
    borderRadius: 4,
  },
  brandIconContainer: {
    marginRight: 8,
  },
  brandSquare: {
    width: 28,
    height: 28,
    backgroundColor: Colors.inkPlum,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandSquareText: {
    color: Colors.marigoldLight,
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.inkPlum,
    letterSpacing: -0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBE8E1',
    padding: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  roleButton: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
  },
  roleButtonActive: {
    backgroundColor: Colors.inkPlum,
  },
  roleButtonInactive: {
    backgroundColor: 'transparent',
  },
  roleText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '600',
  },
  roleTextActive: {
    color: Colors.white,
  },
  roleTextInactive: {
    color: Colors.slate,
  },
  navigatorButton: {
    padding: 7,
    backgroundColor: Colors.marigoldLight,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
  },
});
