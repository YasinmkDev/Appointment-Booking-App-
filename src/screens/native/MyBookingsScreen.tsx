import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Calendar, Clock } from 'lucide-react';
import { Booking } from '../../types';
import { StatusPill } from '../../components/native/TicketStub';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface MyBookingsScreenProps {
  bookings: Booking[];
  onSelectBooking?: (booking: Booking) => void;
  onBrowseProviders: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  bookings,
  onSelectBooking,
  onBrowseProviders,
}) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'past'>('all');

  const upcomingBookings = bookings.filter((b) => !b.isPast && b.status !== 'completed');
  const pastBookings = bookings.filter((b) => b.isPast || b.status === 'completed');

  const displayUpcoming = selectedTab === 'all' || selectedTab === 'upcoming';
  const displayPast = selectedTab === 'all' || selectedTab === 'past';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>
          Review your upcoming appointments and past reservations.
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setSelectedTab('all')}
          style={[styles.tabButton, selectedTab === 'all' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
            All ({bookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab('upcoming')}
          style={[styles.tabButton, selectedTab === 'upcoming' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedTab('past')}
          style={[styles.tabButton, selectedTab === 'past' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabText, selectedTab === 'past' && styles.tabTextActive]}>
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Section */}
      {displayUpcoming && upcomingBookings.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPCOMING PASSES</Text>

          <View style={styles.cardsList}>
            {upcomingBookings.map((booking) => (
              <TouchableOpacity
                key={booking.id}
                activeOpacity={0.88}
                onPress={() => onSelectBooking && onSelectBooking(booking)}
                style={styles.ticketCard}
              >
                {/* Left Marigold Border Accent */}
                <View style={styles.marigoldStripe} />

                <View style={styles.ticketContent}>
                  {/* Top Row */}
                  <View style={styles.cardHeader}>
                    <View style={styles.dateRow}>
                      <Calendar size={12} color={Colors.marigoldDeep} />
                      <Text style={styles.dateText}>{booking.date}</Text>
                    </View>
                    <View style={styles.timeRow}>
                      <Clock size={12} color={Colors.slate} />
                      <Text style={styles.timeText}>{booking.time}</Text>
                    </View>
                  </View>

                  {/* Body */}
                  <View style={styles.cardBody}>
                    <Text style={styles.serviceTitle}>{booking.serviceName}</Text>
                    <Text style={styles.providerSubtitle}>{booking.providerName}</Text>
                  </View>

                  {/* Footer */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.refCodeText}>{booking.refCode}</Text>

                    <View style={styles.footerRight}>
                      <StatusPill status={booking.status} />
                      <View style={styles.detailsTag}>
                        <Text style={styles.detailsTagText}>Details</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Past Section */}
      {displayPast && pastBookings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.pastHeaderRow}>
            <Text style={styles.sectionTitle}>PAST BOOKINGS</Text>
            <View style={styles.dashedLine} />
          </View>

          <View style={styles.cardsList}>
            {pastBookings.map((booking) => (
              <View key={booking.id} style={styles.pastCard}>
                <View style={styles.pastCardHeader}>
                  <Text style={styles.pastDateText}>{booking.date}</Text>
                  <Text style={styles.pastDateText}>{booking.time}</Text>
                </View>

                <View style={styles.pastCardBody}>
                  <View>
                    <Text style={styles.pastServiceTitle}>{booking.serviceName}</Text>
                    <Text style={styles.pastProviderSubtitle}>{booking.providerName}</Text>
                  </View>
                  <Text style={styles.pastPriceText}>${booking.price.toFixed(2)}</Text>
                </View>

                <View style={styles.pastCardFooter}>
                  <StatusPill status="completed" />
                  <TouchableOpacity
                    onPress={onBrowseProviders}
                    style={styles.rebookButton}
                  >
                    <Text style={styles.rebookButtonText}>Rebook</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    paddingBottom: 10,
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: Colors.inkPlum,
  },
  tabText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  tabTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.slate,
    marginBottom: 10,
  },
  cardsList: {
    gap: 12,
  },
  ticketCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  marigoldStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: Colors.marigoldLight,
  },
  ticketContent: {
    padding: 14,
    paddingLeft: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  cardBody: {
    marginBottom: 10,
  },
  serviceTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  providerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refCodeText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailsTag: {
    backgroundColor: Colors.inkPlum,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  detailsTagText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
  pastHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    borderStyle: 'dashed',
  },
  pastCard: {
    backgroundColor: Colors.alabasterDarker,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 14,
    opacity: 0.8,
  },
  pastCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  pastDateText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
  pastCardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  pastServiceTitle: {
    fontFamily: Fonts.serif,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.slate,
  },
  pastProviderSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
  },
  pastPriceText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  pastCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rebookButton: {
    borderWidth: 1,
    borderColor: Colors.outline,
    backgroundColor: Colors.alabasterCard,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rebookButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
});
