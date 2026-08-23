import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  User,
  Store,
  Ticket,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Bell,
  LogOut,
  ChevronRight,
  PlusCircle,
} from 'lucide-react-native';
import { UserProfile } from '../../types';
import { useProviderStore } from '../../store/providerStore';
import { useBookingStore } from '../../store/bookingStore';
import { useAuthStore } from '../../store/authStore';
import { AvatarPicker } from '../../components/native/AvatarPicker';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface ProfileScreenProps {
  user: UserProfile;
  onOpenStudioSetup: () => void;
  onSwitchToStudio: () => void;
  onViewMyBookings: () => void;
  onViewEmptyBookings: () => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onOpenStudioSetup,
  onSwitchToStudio,
  onViewMyBookings,
  onViewEmptyBookings,
  onSignOut,
}) => {
  const pendingCount = useProviderStore((s) => s.getPendingCount());
  const activeBookings = useBookingStore((s) => s.getActiveCount());
  const setUser = useAuthStore((s) => s.setUser);

  const handleAvatarPicked = (uri: string) => setUser({ ...user, avatar: uri });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Member Ledger Card */}
      <View style={styles.memberCard}>
        {/* Card Header Stamp */}
        <View style={styles.cardHeader}>
          <View style={styles.stampBadge}>
            <Text style={styles.stampBadgeText}>MEMBER PASSBOOK</Text>
          </View>
          <Text style={styles.memberRefText}>ID #{user.id.toUpperCase()}</Text>
        </View>

        {/* Member Profile Row */}
        <View style={styles.profileRow}>
          <AvatarPicker uri={user.avatar} size={64} onPicked={handleAvatarPicked} label="" />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            <View style={styles.sinceBadge}>
              <Text style={styles.sinceText}>MEMBER SINCE {user.memberSince.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Perforated Stub Divider */}
        <View style={styles.perforatedRow}>
          <View style={styles.circleCutoutLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.circleCutoutRight} />
        </View>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onViewMyBookings}
            style={styles.statBox}
          >
            <Text style={styles.statNumber}>{activeBookings}</Text>
            <Text style={styles.statLabel}>Active Passes</Text>
          </TouchableOpacity>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.pastPassesCount}</Text>
            <Text style={styles.statLabel}>Past Visits</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>★ 4.9</Text>
            <Text style={styles.statLabel}>Client Score</Text>
          </View>
        </View>
      </View>

      {/* Prominent CTA: Open Studio or Switch to Studio */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>STUDIO & BUSINESS PORTAL</Text>

        {!user.hasStudio ? (
          /* "Open Your Studio" High-Contrast Banner */
          <View style={styles.openStudioCard}>
            <View style={styles.studioBannerTop}>
              <View style={styles.tagPill}>
                <Sparkles size={12} color={Colors.inkPlum} />
                <Text style={styles.tagPillText}>ACCEPT APPOINTMENTS</Text>
              </View>
              <Text style={styles.editionText}>SETUP • NO. 002</Text>
            </View>

            <Text style={styles.studioBannerTitle}>Open Your Studio & Accept Bookings</Text>
            <Text style={styles.studioBannerDesc}>
              List your services, customize appointment durations (15m, 30m, 60m), set working hours, and manage client ledger requests effortlessly.
            </Text>

            <View style={styles.benefitList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Bespoke service catalog & price builder</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Custom buffer times & shift cadence</Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.benefitDot} />
                <Text style={styles.benefitText}>Instant booking request notifications</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onOpenStudioSetup}
              style={styles.openStudioButton}
            >
              <PlusCircle size={16} color={Colors.inkPlum} />
              <Text style={styles.openStudioButtonText}>Start 3-Step Studio Setup</Text>
              <ArrowRight size={16} color={Colors.inkPlum} />
            </TouchableOpacity>
          </View>
        ) : (
          /* "Manage Your Studio" Active Banner */
          <View style={styles.activeStudioCard}>
            <View style={styles.activeStudioTop}>
              <View style={styles.activeStudioBadge}>
                <Store size={14} color={Colors.marigoldLight} />
                <Text style={styles.activeStudioBadgeText}>VERIFIED STUDIO LEDGER</Text>
              </View>
              <Text style={styles.activeStudioStatus}>● LIVE</Text>
            </View>

            <Text style={styles.activeStudioName}>
              {user.studioName || 'Wren & Co. Studio'}
            </Text>
            <Text style={styles.activeStudioCategory}>
              {user.studioCategory || 'Boutique Hair Studio'} • {pendingCount} Pending Requests
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onSwitchToStudio}
              style={styles.switchStudioButton}
            >
              <Text style={styles.switchStudioButtonText}>Switch to Studio Dashboard</Text>
              <ArrowRight size={16} color={Colors.inkPlum} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Account Settings & Quick Navigation */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>PASSBOOK PREFERENCES</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onViewMyBookings}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Ticket size={16} color={Colors.inkPlum} />
              <Text style={styles.menuItemText}>My Active Ticket Passes</Text>
            </View>
            <ChevronRight size={16} color={Colors.slate} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onViewEmptyBookings}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Clock size={16} color={Colors.inkPlum} />
              <Text style={styles.menuItemText}>Empty Ledger State Preview</Text>
            </View>
            <ChevronRight size={16} color={Colors.slate} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <Bell size={16} color={Colors.inkPlum} />
              <Text style={styles.menuItemText}>Appointment Reminders & SMS</Text>
            </View>
            <Text style={styles.menuItemValue}>Enabled</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.menuItem, styles.menuItemLast]}
          >
            <View style={styles.menuItemLeft}>
              <Shield size={16} color={Colors.inkPlum} />
              <Text style={styles.menuItemText}>Privacy & Passbook Security</Text>
            </View>
            <ChevronRight size={16} color={Colors.slate} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSignOut}
        style={styles.signOutButton}
      >
        <LogOut size={16} color={Colors.dustyRoseDark} />
        <Text style={styles.signOutText}>Switch Account or Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmAlabaster,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  memberCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.outline,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#F3EFE7',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  stampBadge: {
    backgroundColor: 'rgba(232, 163, 61, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.marigoldLight,
  },
  stampBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.marigoldDeep,
    letterSpacing: 0.5,
  },
  memberRefText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  userEmail: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    marginTop: 1,
  },
  userPhone: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
    marginTop: 1,
  },
  sinceBadge: {
    backgroundColor: '#EBE8E1',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginTop: 5,
  },
  sinceText: {
    fontFamily: Fonts.mono,
    fontSize: 8,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  perforatedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 16,
    backgroundColor: Colors.alabasterCard,
  },
  circleCutoutLeft: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.warmAlabaster,
    marginLeft: -6,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  circleCutoutRight: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.warmAlabaster,
    marginRight: -6,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  dashedLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    borderStyle: 'dashed',
    marginHorizontal: 4,
  },
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#FAF7F2',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  statLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.slate,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.outline,
  },
  sectionContainer: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Colors.slate,
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 2,
  },
  openStudioCard: {
    backgroundColor: Colors.inkPlum,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.marigoldDeep,
  },
  studioBannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.marigoldLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagPillText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  editionText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.outline,
  },
  studioBannerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.warmAlabaster,
    marginBottom: 6,
  },
  studioBannerDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.outline,
    lineHeight: 17,
    marginBottom: 12,
  },
  benefitList: {
    gap: 6,
    marginBottom: 14,
    paddingLeft: 4,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.marigoldLight,
  },
  benefitText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.warmAlabaster,
  },
  openStudioButton: {
    backgroundColor: Colors.marigoldLight,
    borderRadius: 6,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  openStudioButtonText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  activeStudioCard: {
    backgroundColor: Colors.inkPlum,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.sageTeal,
  },
  activeStudioTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeStudioBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeStudioBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.marigoldLight,
  },
  activeStudioStatus: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.sageTeal,
  },
  activeStudioName: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
  activeStudioCategory: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.outline,
    marginTop: 2,
    marginBottom: 12,
  },
  switchStudioButton: {
    backgroundColor: Colors.marigoldLight,
    borderRadius: 6,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  switchStudioButtonText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  menuContainer: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuItemText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
  menuItemValue: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.sageDark,
    fontWeight: '700',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.dustyRoseLight,
    borderWidth: 1,
    borderColor: Colors.dustyRose,
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 6,
  },
  signOutText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.dustyRoseDark,
  },
});
