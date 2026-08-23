import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Calendar, Clock, X, Star } from 'lucide-react-native';
import { Booking } from '../../types';
import { StatusPill } from '../../components/native/TicketStub';
import { useBookingStore } from '../../store/bookingStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useReviewStore } from '../../store/reviewStore';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface MyBookingsScreenProps {
  bookings: Booking[];
  onSelectBooking?: (booking: Booking) => void;
  onBrowseProviders: () => void;
  onReviewBooking: (booking: Booking) => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  bookings,
  onSelectBooking,
  onBrowseProviders,
  onReviewBooking,
}) => {
  const cancelBooking = useBookingStore((s) => s.cancelBooking);
  const notify = useNotificationStore((s) => s.show);
  const hasReviewed = useReviewStore((s) => s.hasReviewed);
  const [selectedTab, setSelectedTab] = useState<'all' | 'upcoming' | 'past'>('all');

  const upcomingBookings = bookings.filter(
    (b) => !b.isPast && b.status !== 'completed' && b.status !== 'canceled'
  );
  const pastBookings = bookings.filter(
    (b) => b.isPast || b.status === 'completed' || b.status === 'canceled'
  );

  const displayUpcoming = selectedTab === 'all' || selectedTab === 'upcoming';
  const displayPast = selectedTab === 'all' || selectedTab === 'past';

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      `Cancel your appointment for ${booking.serviceName}?`,
      [
        { text: 'Keep It', style: 'cancel' },
        {
          text: 'Cancel Booking',
          style: 'destructive',
          onPress: () => {
            cancelBooking(booking.id, 'Cancelled by customer');
            notify(`Booking for ${booking.serviceName} cancelled`, 'warning');
          },
        },
      ]
    );
  };

  const tabs: { key: 'all' | 'upcoming' | 'past'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: bookings.length },
    { key: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
    { key: 'past', label: 'Past', count: pastBookings.length },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Review your upcoming appointments and past reservations.</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} onPress={() => setSelectedTab(tab.key)}
            style={[styles.tabButton, selectedTab === tab.key && styles.tabButtonActive]}>
            <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {displayUpcoming && upcomingBookings.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>UPCOMING PASSES</Text>
          <View style={styles.cardsList}>
            {upcomingBookings.map((booking) => (
              <TouchableOpacity key={booking.id} activeOpacity={0.88}
                onPress={() => onSelectBooking && onSelectBooking(booking)}
                style={styles.ticketCard}>
                <View style={styles.marigoldStripe} />
                <View style={styles.ticketContent}>
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
                  <View style={styles.cardBody}>
                    <Text style={styles.serviceTitle}>{booking.serviceName}</Text>
                    <Text style={styles.providerSubtitle}>{booking.providerName}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.refCodeText}>{booking.refCode}</Text>
                    <View style={styles.footerRight}>
                      <StatusPill status={booking.status} />
                      <TouchableOpacity onPress={() => handleCancel(booking)} style={styles.cancelBtn}>
                        <X size={12} color={Colors.dustyRoseDark} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

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
                  <StatusPill status={booking.status === 'canceled' ? 'canceled' : 'completed'} />
                  {booking.status !== 'canceled' && (
                    <View style={styles.pastCardActions}>
                      {!hasReviewed(booking.id) && (
                        <TouchableOpacity onPress={() => onReviewBooking(booking)} style={styles.reviewButton}>
                          <Star size={10} color={Colors.marigoldDeep} />
                          <Text style={styles.reviewButtonText}>Review</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity onPress={onBrowseProviders} style={styles.rebookButton}>
                        <Text style={styles.rebookButtonText}>Rebook</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {bookings.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySub}>Browse providers to make your first appointment.</Text>
          <TouchableOpacity onPress={onBrowseProviders} style={styles.browseBtn}>
            <Text style={styles.browseBtnText}>Browse Providers</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmAlabaster },
  contentContainer: { padding: 16, paddingBottom: 90 },
  header: { marginBottom: 16 },
  title: { fontFamily: Fonts.serif, fontSize: 22, fontWeight: '700', color: Colors.inkPlum, marginBottom: 4 },
  subtitle: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate },
  tabsContainer: { flexDirection: 'row', gap: 8, borderBottomWidth: 1, borderBottomColor: Colors.outline, paddingBottom: 10, marginBottom: 16 },
  tabButton: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  tabButtonActive: { backgroundColor: Colors.inkPlum },
  tabText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  tabTextActive: { color: Colors.white, fontWeight: '600' },
  section: { marginBottom: 20 },
  sectionTitle: { fontFamily: Fonts.mono, fontSize: 10, letterSpacing: 1, color: Colors.slate, marginBottom: 10 },
  cardsList: { gap: 12 },
  ticketCard: { backgroundColor: Colors.alabasterCard, borderRadius: 6, borderWidth: 1, borderColor: Colors.inkPlum, overflow: 'hidden', position: 'relative', shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  marigoldStripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: Colors.marigoldLight },
  ticketContent: { padding: 14, paddingLeft: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', marginBottom: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontFamily: Fonts.mono, fontSize: 11, fontWeight: '700', color: Colors.inkPlum },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  cardBody: { marginBottom: 10 },
  serviceTitle: { fontFamily: Fonts.serif, fontSize: 15, fontWeight: '700', color: Colors.inkPlum },
  providerSubtitle: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refCodeText: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.slate },
  footerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cancelBtn: { padding: 4, backgroundColor: Colors.dustyRoseLight, borderRadius: 4, borderWidth: 1, borderColor: Colors.dustyRose },
  pastHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  dashedLine: { flex: 1, height: 1, borderBottomWidth: 1, borderBottomColor: Colors.outline, borderStyle: 'dashed' },
  pastCard: { backgroundColor: Colors.alabasterDarker, borderRadius: 6, borderWidth: 1, borderColor: Colors.outline, padding: 14, opacity: 0.85 },
  pastCardHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 6, borderBottomWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', marginBottom: 8 },
  pastDateText: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.slate },
  pastCardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  pastServiceTitle: { fontFamily: Fonts.serif, fontSize: 13, fontWeight: '600', color: Colors.slate },
  pastProviderSubtitle: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.slate },
  pastPriceText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  pastCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rebookButton: { borderWidth: 1, borderColor: Colors.outline, backgroundColor: Colors.alabasterCard, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  rebookButtonText: { fontFamily: Fonts.sans, fontSize: 10, fontWeight: '600', color: Colors.inkPlum },
  pastCardActions: { flexDirection: 'row', gap: 6 },
  reviewButton: { flexDirection: 'row', alignItems: 'center', gap: 3, borderWidth: 1, borderColor: Colors.marigold, backgroundColor: Colors.marigoldFaded, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  reviewButtonText: { fontFamily: Fonts.sans, fontSize: 10, fontWeight: '600', color: Colors.marigoldDeep },
  emptyBox: { padding: 32, alignItems: 'center' },
  emptyTitle: { fontFamily: Fonts.serif, fontSize: 18, fontWeight: '700', color: Colors.inkPlum, marginBottom: 6 },
  emptySub: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, textAlign: 'center', marginBottom: 16 },
  browseBtn: { backgroundColor: Colors.inkPlum, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  browseBtnText: { fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700', color: Colors.warmAlabaster },
});
