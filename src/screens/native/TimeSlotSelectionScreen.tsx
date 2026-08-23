import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Provider, Service, TimeSlot } from '../../types';
import { TicketSlot, PerforatedDivider } from '../../components/native/TicketStub';
import { useProviderStore } from '../../store/providerStore';
import { useBookingStore } from '../../store/bookingStore';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface TimeSlotSelectionScreenProps {
  provider: Provider;
  service: Service;
  selectedDate: string;
  selectedDateISO: string;
  onConfirmBooking: (slot: TimeSlot) => void;
}

export const TimeSlotSelectionScreen: React.FC<TimeSlotSelectionScreenProps> = ({
  provider,
  service,
  selectedDate,
  selectedDateISO,
  onConfirmBooking,
}) => {
  const getAvailableSlots = useProviderStore((s) => s.getAvailableSlots);
  const bookings = useBookingStore((s) => s.bookings);

  // Compute slots from the availability engine
  const allSlots = useMemo(() => {
    if (!selectedDateISO) return [];
    return getAvailableSlots(provider.id, selectedDateISO, service.durationMinutes, bookings);
  }, [provider.id, selectedDateISO, service.durationMinutes, bookings]);

  const morningSlots = allSlots.filter((s) => s.period === 'morning');
  const afternoonSlots = allSlots.filter((s) => s.period === 'afternoon');
  const eveningSlots = allSlots.filter((s) => s.period === 'evening');

  const firstAvailable = allSlots.find((s) => s.available);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(firstAvailable?.id ?? '');

  const selectedSlot = allSlots.find((s) => s.id === selectedSlotId) ?? firstAvailable;

  const renderGroup = (label: string, slots: TimeSlot[]) => {
    if (slots.length === 0) return null;
    return (
      <View style={styles.groupContainer}>
        <Text style={styles.groupLabel}>{label}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.ribbonScroll}
        >
          {slots.map((slot) => (
            <TicketSlot
              key={slot.id}
              time={slot.time}
              selected={selectedSlotId === slot.id}
              disabled={!slot.available}
              onPress={() => slot.available && setSelectedSlotId(slot.id)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Time</Text>
        <Text style={styles.headerSubtitle}>{selectedDate || 'Select a date'}</Text>
      </View>

      {allSlots.length === 0 ? (
        <View style={styles.noSlotsBox}>
          <Text style={styles.noSlotsTitle}>No availability</Text>
          <Text style={styles.noSlotsSub}>
            This provider has no open slots on the selected date. Try a different day.
          </Text>
        </View>
      ) : (
        <View style={styles.ribbonSection}>
          {renderGroup('Morning', morningSlots)}
          {renderGroup('Afternoon', afternoonSlots)}
          {renderGroup('Evening', eveningSlots)}
        </View>
      )}

      {selectedSlot && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.providerName}>at {provider.name}</Text>
            </View>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{service.durationMinutes} MIN</Text>
            </View>
          </View>

          <PerforatedDivider orientation="horizontal" withNotches={true} />

          <View style={styles.summaryBottom}>
            <View style={styles.summaryMetaRow}>
              <View>
                <Text style={styles.metaLabel}>Slot</Text>
                <Text style={styles.slotTime}>{selectedSlot.time}</Text>
              </View>
              <View style={styles.priceRight}>
                <Text style={styles.metaLabel}>Total</Text>
                <Text style={styles.priceValue}>${service.price.toFixed(2)}</Text>
              </View>
            </View>

            {!provider.instantConfirmation && (
              <View style={styles.pendingNotice}>
                <Text style={styles.pendingNoticeText}>
                  ⏳ This studio requires manual confirmation. Your booking will be pending until accepted.
                </Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => selectedSlot && onConfirmBooking(selectedSlot)}
              style={[styles.confirmButton, !selectedSlot && styles.confirmButtonDisabled]}
              disabled={!selectedSlot}
            >
              <Text style={styles.confirmButtonText}>
                {provider.instantConfirmation ? 'Confirm Appointment' : 'Request Appointment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmAlabaster },
  contentContainer: { padding: 16, paddingBottom: 90 },
  header: { marginBottom: 20 },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  headerSubtitle: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate },
  ribbonSection: { gap: 20, marginBottom: 24 },
  groupContainer: { width: '100%' },
  groupLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.slate,
    marginBottom: 8,
  },
  ribbonScroll: { paddingVertical: 2 },
  noSlotsBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  noSlotsTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  noSlotsSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    textAlign: 'center',
    lineHeight: 16,
  },
  summaryCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTop: {
    padding: 16,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryInfo: { flex: 1, marginRight: 8 },
  serviceName: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  providerName: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, marginTop: 2 },
  durationBadge: {
    backgroundColor: '#EBE8E1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: { fontFamily: Fonts.mono, fontSize: 10, fontWeight: '600', color: Colors.slate },
  summaryBottom: { padding: 16, backgroundColor: Colors.alabasterCard, gap: 12 },
  summaryMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    color: Colors.slate,
    marginBottom: 2,
  },
  slotTime: { fontFamily: Fonts.mono, fontSize: 14, fontWeight: '700', color: Colors.inkPlum },
  priceRight: { alignItems: 'flex-end' },
  priceValue: { fontFamily: Fonts.mono, fontSize: 15, fontWeight: '700', color: Colors.inkPlum },
  pendingNotice: {
    backgroundColor: 'rgba(232, 163, 61, 0.12)',
    borderWidth: 1,
    borderColor: Colors.marigoldLight,
    borderRadius: 4,
    padding: 8,
  },
  pendingNoticeText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.marigoldDeep,
    lineHeight: 15,
  },
  confirmButton: {
    backgroundColor: Colors.inkPlum,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  confirmButtonDisabled: { opacity: 0.5 },
  confirmButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
});
