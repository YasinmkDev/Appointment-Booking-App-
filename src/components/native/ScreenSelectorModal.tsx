import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { X, Check, ChevronRight } from 'lucide-react-native';
import { Screen, UserRole } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface ScreenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: Screen;
  onSelectScreen: (screen: Screen, role: UserRole) => void;
}

export const ScreenSelectorModal: React.FC<ScreenSelectorModalProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onSelectScreen,
}) => {
  const customerScreens: { id: Screen; name: string; desc: string }[] = [
    {
      id: 'welcome',
      name: '1. Welcome & Onboarding',
      desc: 'Hero entry with serif display headline and "No. 001" ledger stamp',
    },
    {
      id: 'auth',
      name: '2. Sign In & Register Identity',
      desc: 'Unified authentication with client/studio intent & 1-tap demo logins',
    },
    {
      id: 'browse',
      name: '3. Browse Providers',
      desc: 'Ledger search, filter tags, studio cards & available time tags',
    },
    {
      id: 'provider_profile',
      name: '4. Provider Profile (Wren & Co.)',
      desc: 'Studio photography, ratings, bio and service catalog',
    },
    {
      id: 'service_date',
      name: '5. Service & Date Selection',
      desc: 'Service summary stub card & horizontal week calendar strip',
    },
    {
      id: 'time_slot',
      name: '6. Time Slot Ribbon',
      desc: 'Signature scrollable ticket ribbons (Morning, Afternoon, Evening)',
    },
    {
      id: 'confirmation',
      name: '7. Booking Confirmation',
      desc: 'Perforated tear ticket card with ref code & QR check-in stamp',
    },
    {
      id: 'my_bookings',
      name: '8. My Bookings Ledger',
      desc: 'Upcoming ticket passes with marigold accent & past reservations',
    },
    {
      id: 'profile',
      name: '9. Member Account & Studio Hub',
      desc: 'User passbook summary & high-contrast CTA to open/manage a studio',
    },
    {
      id: 'studio_setup',
      name: '10. Studio Setup Wizard (3 Steps)',
      desc: 'Details, Service Catalog & Pricing, Slot Intervals & Buffer Times',
    },
    {
      id: 'empty_bookings',
      name: '11. Empty Bookings State',
      desc: 'Tactile empty pass illustration and discovery CTA',
    },
  ];

  const providerScreens: { id: Screen; name: string; desc: string }[] = [
    {
      id: 'dashboard',
      name: '12. Provider Overview & Agenda',
      desc: 'Ink plum hero surface, stats blocks & compact daily agenda tickets',
    },
    {
      id: 'provider_services',
      name: '13. Service Catalog & Pricing Manager',
      desc: 'Add/Edit services, custom prices, durations, and buffer cleanup times',
    },
    {
      id: 'availability',
      name: '14. Availability & Schedule Manager',
      desc: 'Weekly hours ledger with custom sage switches & split shifts',
    },
    {
      id: 'requests',
      name: '15. Booking Requests',
      desc: 'Pending appointment requests with Accept / Decline ticket actions',
    },
  ];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Screen Navigator</Text>
              <Text style={styles.headerSubtitle}>
                Jump instantly to any of the 15 React Native screens
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={18} color={Colors.inkPlum} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Screen List */}
          <ScrollView style={styles.scrollList} contentContainerStyle={styles.scrollListContent}>
            {/* Customer Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Customer Experience (11 Screens)</Text>
              <View style={styles.cardsContainer}>
                {customerScreens.map((item) => {
                  const isActive = currentScreen === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelectScreen(item.id, 'customer');
                        onClose();
                      }}
                      style={[
                        styles.screenCard,
                        isActive && styles.screenCardActive,
                      ]}
                    >
                      <View style={styles.screenCardLeft}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.screenCardTitle,
                              isActive && styles.screenCardTitleActive,
                            ]}
                          >
                            {item.name}
                          </Text>
                          {isActive && (
                            <View style={styles.activeTag}>
                              <Check size={10} color={Colors.inkPlum} />
                              <Text style={styles.activeTagText}>Active</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.screenCardDesc}>{item.desc}</Text>
                      </View>
                      <ChevronRight size={14} color={Colors.slate} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Provider Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Studio / Provider Experience (4 Screens)</Text>
              <View style={styles.cardsContainer}>
                {providerScreens.map((item) => {
                  const isActive = currentScreen === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelectScreen(item.id, 'provider');
                        onClose();
                      }}
                      style={[
                        styles.screenCard,
                        isActive && styles.screenCardActive,
                      ]}
                    >
                      <View style={styles.screenCardLeft}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.screenCardTitle,
                              isActive && styles.screenCardTitleActive,
                            ]}
                          >
                            {item.name}
                          </Text>
                          {isActive && (
                            <View style={styles.activeTag}>
                              <Check size={10} color={Colors.inkPlum} />
                              <Text style={styles.activeTagText}>Active</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.screenCardDesc}>{item.desc}</Text>
                      </View>
                      <ChevronRight size={14} color={Colors.slate} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.closeFooterButton}>
              <Text style={styles.closeFooterText}>Close Navigator</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 27, 46, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    backgroundColor: Colors.warmAlabaster,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    backgroundColor: Colors.alabasterCard,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 4,
  },
  scrollList: {
    maxHeight: 460,
  },
  scrollListContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Colors.slate,
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 2,
  },
  cardsContainer: {
    gap: 8,
  },
  screenCard: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenCardActive: {
    backgroundColor: 'rgba(254, 182, 78, 0.15)',
    borderColor: Colors.marigoldLight,
    borderWidth: 1.5,
  },
  screenCardLeft: {
    flex: 1,
    marginRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenCardTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
  screenCardTitleActive: {
    color: Colors.marigoldDeep,
  },
  screenCardDesc: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
    marginTop: 2,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.marigoldLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    gap: 2,
  },
  activeTagText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    backgroundColor: Colors.alabasterCard,
  },
  closeFooterButton: {
    backgroundColor: Colors.inkPlum,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeFooterText: {
    color: Colors.warmAlabaster,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
});
