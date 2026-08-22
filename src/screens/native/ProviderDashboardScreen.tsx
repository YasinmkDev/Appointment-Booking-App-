import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ChevronRight } from 'lucide-react';
import { StatusPill } from '../../components/native/TicketStub';
import { INITIAL_TODAYS_AGENDA } from '../../data/mockData';
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
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Stats Section: Ink Plum dark surface */}
      <View style={styles.heroSection}>
        <Text style={styles.heroKicker}>PROVIDER OVERVIEW</Text>
        <Text style={styles.heroTitle}>Good Morning, Studio.</Text>

        {/* Quick Stat Blocks in IBM Plex Mono */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Bookings Today</Text>
            <Text style={styles.statValue}>8</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>42</Text>
          </View>
        </View>
      </View>

      {/* Agenda Content Area */}
      <View style={styles.agendaArea}>
        {/* Section Header */}
        <View style={styles.agendaHeader}>
          <Text style={styles.agendaTitle}>Today's Agenda</Text>
          <Text style={styles.agendaDate}>Oct 24, 2024</Text>
        </View>

        {/* Compact Ticket Rows Container */}
        <View style={styles.agendaCardContainer}>
          {INITIAL_TODAYS_AGENDA.map((item, index) => {
            const isCanceled = item.statusType === 'canceled';
            const isArrived = item.statusType === 'arrived';
            const isLast = index === INITIAL_TODAYS_AGENDA.length - 1;

            return (
              <View
                key={item.id}
                style={[
                  styles.agendaRow,
                  isCanceled && styles.agendaRowCanceled,
                  !isLast && styles.agendaRowBorder,
                ]}
              >
                {/* Active Indicator bar */}
                {item.active && <View style={styles.activeBar} />}

                {/* Left Time Stub */}
                <View style={styles.timeStub}>
                  <Text
                    style={[
                      styles.timeText,
                      isCanceled && styles.timeTextCanceled,
                      isArrived && styles.timeTextArrived,
                    ]}
                  >
                    {item.time}
                  </Text>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>

                {/* Client & Service Info */}
                <View style={styles.clientInfo}>
                  <Text
                    style={[
                      styles.clientName,
                      isCanceled && styles.clientNameCanceled,
                    ]}
                    numberOfLines={1}
                  >
                    {item.clientName}
                  </Text>
                  <Text style={styles.serviceName} numberOfLines={1}>
                    {item.service}
                  </Text>
                </View>

                {/* Status Badge & Arrow */}
                <View style={styles.rowRight}>
                  {item.statusType === 'upcoming' && <StatusPill status="upcoming" />}
                  {item.statusType === 'arrived' && <StatusPill status="arrived" />}
                  {item.statusType === 'canceled' && <StatusPill status="canceled" />}
                  <ChevronRight size={14} color={Colors.outline} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Shortcut Buttons */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToRequests}
            style={styles.shortcutCard}
          >
            <View>
              <Text style={styles.shortcutKickerAlert}>● 4 Pending</Text>
              <Text style={styles.shortcutTitle}>Booking Requests</Text>
            </View>
            <ChevronRight size={14} color={Colors.slate} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToAvailability}
            style={styles.shortcutCard}
          >
            <View>
              <Text style={styles.shortcutKickerActive}>Active 4/7 Days</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.warmAlabaster,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  heroSection: {
    backgroundColor: Colors.inkPlum,
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 20,
  },
  heroKicker: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: '#D8BFD8',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: Fonts.serif,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(206, 196, 203, 0.25)',
    padding: 12,
  },
  statLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    color: '#D8BFD8',
    letterSpacing: 0.5,
  },
  statValue: {
    fontFamily: Fonts.mono,
    fontSize: 26,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 4,
  },
  agendaArea: {
    paddingHorizontal: 16,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    paddingBottom: 8,
    marginBottom: 14,
  },
  agendaTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  agendaDate: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  agendaCardContainer: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    overflow: 'hidden',
    marginBottom: 16,
  },
  agendaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  agendaRowCanceled: {
    opacity: 0.55,
  },
  agendaRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    borderStyle: 'dashed',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.marigoldLight,
  },
  timeStub: {
    width: 75,
    borderRightWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    paddingRight: 8,
  },
  timeText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  timeTextCanceled: {
    textDecorationLine: 'line-through',
    color: Colors.slate,
  },
  timeTextArrived: {
    color: Colors.marigoldDeep,
  },
  durationText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.slate,
    marginTop: 2,
  },
  clientInfo: {
    flex: 1,
    paddingHorizontal: 10,
  },
  clientName: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  clientNameCanceled: {
    textDecorationLine: 'line-through',
    color: Colors.slate,
  },
  serviceName: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shortcutKickerAlert: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.dustyRose,
    textTransform: 'uppercase',
  },
  shortcutKickerActive: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.sageTeal,
    textTransform: 'uppercase',
  },
  shortcutTitle: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginTop: 2,
  },
});
