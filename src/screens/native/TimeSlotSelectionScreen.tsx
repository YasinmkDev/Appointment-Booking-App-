import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Provider, Service, TimeSlot } from '../../types';
import { TicketSlot, PerforatedDivider } from '../../components/native/TicketStub';
import { TIME_SLOTS } from '../../data/mockData';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface TimeSlotSelectionScreenProps {
  provider: Provider;
  service: Service;
  selectedDate: string;
  onConfirmBooking: (slot: TimeSlot) => void;
}

export const TimeSlotSelectionScreen: React.FC<TimeSlotSelectionScreenProps> = ({
  provider,
  service,
  selectedDate,
  onConfirmBooking,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('m3'); // Default to 10:30 AM

  const morningSlots = TIME_SLOTS.filter((s) => s.period === 'morning');
  const afternoonSlots = TIME_SLOTS.filter((s) => s.period === 'afternoon');
  const eveningSlots = TIME_SLOTS.filter((s) => s.period === 'evening');

  const selectedSlot = TIME_SLOTS.find((s) => s.id === selectedSlotId) || morningSlots[2];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Time</Text>
        <Text style={styles.headerSubtitle}>{selectedDate || 'Wednesday, October 25th'}</Text>
      </View>

      {/* Signature Element: Ticket Ribbon Groupings */}
      <View style={styles.ribbonSection}>
        {/* Morning Group */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupLabel}>Morning</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}
          >
            {morningSlots.map((slot) => (
              <TicketSlot
                key={slot.id}
                time={slot.time}
                selected={selectedSlotId === slot.id}
                disabled={!slot.available}
                onPress={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Afternoon Group */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupLabel}>Afternoon</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}
          >
            {afternoonSlots.map((slot) => (
              <TicketSlot
                key={slot.id}
                time={slot.time}
                selected={selectedSlotId === slot.id}
                disabled={!slot.available}
                onPress={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Evening Group */}
        <View style={styles.groupContainer}>
          <Text style={styles.groupLabel}>Evening</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}
          >
            {eveningSlots.map((slot) => (
              <TicketSlot
                key={slot.id}
                time={slot.time}
                selected={selectedSlotId === slot.id}
                disabled={!slot.available}
                onPress={() => setSelectedSlotId(slot.id)}
              />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Summary Card with Perforated Tear Line */}
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

        {/* Dashed Perforated Divider with Cutout Notches */}
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

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onConfirmBooking(selectedSlot)}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
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
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
  },
  ribbonSection: {
    gap: 20,
    marginBottom: 24,
  },
  groupContainer: {
    width: '100%',
  },
  groupLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.slate,
    marginBottom: 8,
  },
  ribbonScroll: {
    paddingVertical: 2,
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
  summaryInfo: {
    flex: 1,
    marginRight: 8,
  },
  serviceName: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  providerName: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    marginTop: 2,
  },
  durationBadge: {
    backgroundColor: '#EBE8E1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  durationText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.slate,
  },
  summaryBottom: {
    padding: 16,
    backgroundColor: Colors.alabasterCard,
    gap: 16,
  },
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
  slotTime: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  priceRight: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontFamily: Fonts.mono,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.inkPlum,
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
  confirmButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
});
