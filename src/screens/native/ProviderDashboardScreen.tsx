import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { StatusPill } from '../../components/native/TicketStub';
import { useProviderStore } from '../../store/providerStore';
import { useBookingStore } from '../../store/bookingStore';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface ProviderDashboardScreenProps {
  onNavigateToRequests: () => void;
  onNavigateToAvailability: () => void;
}

export const ProviderDashboardScreen: React.FC<ProviderDashboardScreenProps> = ({
  onNavigateToRequests,
  onNavigateToAvailability,
}) => {
  const todaysAgenda = useProviderStore((s) => s.todaysAgenda);
  const markArrived = useProviderStore((s) => s.markArrived);
  const getPendingCount = useProviderStore((s) => s.getPendingCount);
  const getActiveDaysCount = useProviderStore((s) => s.getActiveDaysCount);
  const getTodayBookingsCount = useProviderStore((s) => s.getTodayBookingsCount);

  const getWeekBookingsCount = useProviderStore((s) => s.getWeekBookingsCount);
  const bookings = useBookingStore((s) => s.bookings);

  const pendingCount = getPendingCount();
  const activeDays = getActiveDaysCount();
  const todayCount = getTodayBookingsCount();
  const weekCount = getWeekBookingsCount(bookings);

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Hero Stats */}
      <View style={styles.heroSection}>
        <Text style={styles.heroKicker}>PROVIDER OVERVIEW</Text>
        <Text style={styles.heroTitle}>Good Morning, Studio.</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Bookings Today</Text>
            <Text style={styles.statValue}>{todayCount}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>{weekCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.agendaArea}>
        <View style={styles.agendaHeader}>
          <Text style={styles.agendaTitle}>Today's Agenda</Text>
          <Text style={styles.agendaDate}>{today}</Text>
        </View>

        <View style={styles.agendaCardContainer}>
          {todaysAgenda.length === 0 ? (
            <View style={styles.emptyAgenda}>
              <Text style={styles.emptyAgendaTitle}>No appointments today</Text>
              <Text style={styles.emptyAgendaSubtitle}>Your schedule is clear. New bookings will appear here.</Text>
            </View>
          ) : todaysAgenda.map((item, index) => {
            const isCanceled = item.statusType === 'canceled';
            const isArrived = item.statusType === 'arrived';
            const isLast = index === todaysAgenda.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={item.statusType === 'upcoming' ? 0.7 : 1}
                onPress={() => item.statusType === 'upcoming' && markArrived(item.id)}
                style={[
                  styles.agendaRow,
                  isCanceled && styles.agendaRowCanceled,
                  !isLast && styles.agendaRowBorder,
                ]}
              >
                {item.active && <View style={styles.activeBar} />}

                <View style={styles.timeStub}>
                  <Text style={[styles.timeText, isCanceled && styles.timeTextCanceled, isArrived && styles.timeTextArrived]}>
                    {item.time}
                  </Text>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>

                <View style={styles.clientInfo}>
                  <Text style={[styles.clientName, isCanceled && styles.clientNameCanceled]} numberOfLines={1}>
                    {item.clientName}
                  </Text>
                  <Text style={styles.serviceName} numberOfLines={1}>{item.service}</Text>
                </View>

                <View style={styles.rowRight}>
                  <StatusPill status={item.statusType === 'arrived' ? 'arrived' : item.statusType === 'canceled' ? 'canceled' : 'upcoming'} />
                  <ChevronRight size={14} color={Colors.outline} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity activeOpacity={0.8} onPress={onNavigateToRequests} style={styles.shortcutCard}>
            <View>
              <Text style={styles.shortcutKickerAlert}>
                {pendingCount > 0 ? `● ${pendingCount} Pending` : '● All Clear'}
              </Text>
              <Text style={styles.shortcutTitle}>Booking Requests</Text>
            </View>
            <ChevronRight size={14} color={Colors.slate} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} onPress={onNavigateToAvailability} style={styles.shortcutCard}>
            <View>
              <Text style={styles.shortcutKickerActive}>Active {activeDays}/7 Days</Text>
              <Text style={styles.shortcutTitle}>Set Working Hours</Text>
            </View>
            <ChevronRight size={14} color={Colors.slate} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmAlabaster },
  contentContainer: { paddingBottom: 90 },
  heroSection: { backgroundColor: Colors.inkPlum, padding: 20, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, marginBottom: 20 },
  heroKicker: { fontFamily: Fonts.mono, fontSize: 10, color: '#D8BFD8', letterSpacing: 1.5, marginBottom: 4 },
  heroTitle: { fontFamily: Fonts.serif, fontSize: 24, fontWeight: '700', color: Colors.white, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 6, borderWidth: 1, borderColor: 'rgba(206,196,203,0.25)', padding: 12 },
  statLabel: { fontFamily: Fonts.mono, fontSize: 9, textTransform: 'uppercase', color: '#D8BFD8', letterSpacing: 0.5 },
  statValue: { fontFamily: Fonts.mono, fontSize: 26, fontWeight: '700', color: Colors.white, marginTop: 4 },
  agendaArea: { paddingHorizontal: 16 },
  agendaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', borderBottomWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', paddingBottom: 8, marginBottom: 14 },
  agendaTitle: { fontFamily: Fonts.serif, fontSize: 18, fontWeight: '700', color: Colors.inkPlum },
  agendaDate: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  agendaCardContainer: { backgroundColor: Colors.alabasterCard, borderRadius: 6, borderWidth: 1, borderColor: Colors.outline, overflow: 'hidden', marginBottom: 16 },
  agendaRow: { flexDirection: 'row', alignItems: 'center', padding: 12, position: 'relative' },
  agendaRowCanceled: { opacity: 0.55 },
  agendaRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.outline, borderStyle: 'dashed' },
  activeBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: Colors.marigoldLight },
  timeStub: { width: 75, borderRightWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', paddingRight: 8 },
  timeText: { fontFamily: Fonts.mono, fontSize: 11, fontWeight: '700', color: Colors.inkPlum },
  timeTextCanceled: { textDecorationLine: 'line-through', color: Colors.slate },
  timeTextArrived: { color: Colors.marigoldDeep },
  durationText: { fontFamily: Fonts.mono, fontSize: 9, color: Colors.slate, marginTop: 2 },
  clientInfo: { flex: 1, paddingHorizontal: 10 },
  clientName: { fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700', color: Colors.inkPlum },
  clientNameCanceled: { textDecorationLine: 'line-through', color: Colors.slate },
  serviceName: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.slate, marginTop: 2 },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  shortcutsRow: { flexDirection: 'row', gap: 10 },
  shortcutCard: { flex: 1, backgroundColor: Colors.alabasterCard, borderRadius: 6, borderWidth: 1, borderColor: Colors.outline, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shortcutKickerAlert: { fontFamily: Fonts.mono, fontSize: 9, fontWeight: '700', color: Colors.dustyRose, textTransform: 'uppercase' },
  shortcutKickerActive: { fontFamily: Fonts.mono, fontSize: 9, fontWeight: '700', color: Colors.sageTeal, textTransform: 'uppercase' },
  shortcutTitle: { fontFamily: Fonts.sans, fontSize: 11, fontWeight: '700', color: Colors.inkPlum, marginTop: 2 },
  emptyAgenda: { padding: 24, alignItems: 'center', gap: 6 },
  emptyAgendaTitle: { fontFamily: Fonts.serif, fontSize: 14, fontWeight: '700', color: Colors.inkPlum },
  emptyAgendaSubtitle: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.slate, textAlign: 'center', lineHeight: 16 },
});
