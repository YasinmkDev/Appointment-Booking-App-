import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Provider, Service } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface ServiceDateSelectionScreenProps {
  provider: Provider;
  service: Service;
  onSelectDate: (dateString: string) => void;
}

export const ServiceDateSelectionScreen: React.FC<ServiceDateSelectionScreenProps> = ({
  provider,
  service,
  onSelectDate,
}) => {
  const dates = [
    { day: 'Mon', num: '12', full: 'Monday, Oct 12', available: true },
    { day: 'Tue', num: '13', full: 'Tuesday, Oct 13', available: true },
    { day: 'Wed', num: '14', full: 'Wednesday, Oct 14', available: true },
    { day: 'Thu', num: '15', full: 'Thursday, Oct 15', available: true },
    { day: 'Fri', num: '16', full: 'Friday, Oct 16', available: true },
    { day: 'Sat', num: '17', full: 'Saturday, Oct 17', available: false },
    { day: 'Sun', num: '18', full: 'Sunday, Oct 18', available: false },
  ];

  const [selectedDate, setSelectedDate] = useState(dates[1]); // Default to Tue 13

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Summary Ticket Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Text style={styles.summaryServiceName}>{service.name}</Text>
            <Text style={styles.summaryServiceDesc}>
              {service.description} Approx {service.durationMinutes} mins.
            </Text>
          </View>

          <View style={styles.perforatedLine} />

          <View style={styles.summaryBottom}>
            <View>
              <Text style={styles.metaLabel}>Service Total</Text>
              <Text style={styles.metaPrice}>${service.price.toFixed(2)}</Text>
            </View>

            <View style={styles.providerRight}>
              <Text style={styles.metaLabel}>Studio</Text>
              <Text style={styles.metaProviderName}>{provider.name}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection Strip Section */}
        <View style={styles.dateSection}>
          <View style={styles.dateHeader}>
            <Text style={styles.dateTitle}>Select Date</Text>
            <Text style={styles.dateMonth}>October 2024</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.calendarStrip}
          >
            {dates.map((d) => {
              const isSelected = selectedDate.num === d.num;

              if (!d.available) {
                return (
                  <View key={d.num} style={[styles.dateButton, styles.dateButtonDisabled]}>
                    <Text style={[styles.dayLabel, styles.dayLabelDisabled]}>{d.day}</Text>
                    <Text style={[styles.dateNum, styles.dateNumDisabled]}>{d.num}</Text>
                  </View>
                );
              }

              if (isSelected) {
                return (
                  <TouchableOpacity
                    key={d.num}
                    activeOpacity={0.85}
                    onPress={() => setSelectedDate(d)}
                    style={[styles.dateButton, styles.dateButtonSelected]}
                  >
                    <Text style={[styles.dayLabel, styles.dayLabelSelected]}>{d.day}</Text>
                    <Text style={[styles.dateNum, styles.dateNumSelected]}>{d.num}</Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={d.num}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDate(d)}
                  style={[styles.dateButton, styles.dateButtonDefault]}
                >
                  <Text style={styles.dayLabel}>{d.day}</Text>
                  <Text style={styles.dateNum}>{d.num}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Strip */}
      <View style={styles.bottomBar}>
        <View style={styles.selectedDateInfo}>
          <Text style={styles.bottomDateLabel}>Selected Date</Text>
          <Text style={styles.bottomDateValue}>{selectedDate.full}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onSelectDate(selectedDate.full)}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>Continue to Times</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmAlabaster,
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 110,
  },
  summaryCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTop: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  summaryServiceName: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  summaryServiceDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    lineHeight: 16,
  },
  perforatedLine: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    borderStyle: 'dashed',
  },
  summaryBottom: {
    padding: 16,
    backgroundColor: Colors.alabasterCard,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    color: Colors.slate,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaPrice: {
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  providerRight: {
    alignItems: 'flex-end',
  },
  metaProviderName: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
  dateSection: {
    width: '100%',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  dateTitle: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  dateMonth: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.slate,
  },
  calendarStrip: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  dateButton: {
    width: 60,
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateButtonDefault: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  dateButtonSelected: {
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  dateButtonDisabled: {
    backgroundColor: '#EBE8E1',
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    opacity: 0.4,
  },
  dayLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
    marginBottom: 4,
  },
  dayLabelSelected: {
    color: Colors.inkPlum,
    fontWeight: '700',
  },
  dayLabelDisabled: {
    color: Colors.slate,
  },
  dateNum: {
    fontFamily: Fonts.serif,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  dateNumSelected: {
    color: Colors.inkPlum,
  },
  dateNumDisabled: {
    color: Colors.slate,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.alabasterCard,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  selectedDateInfo: {
    flex: 1,
    marginRight: 12,
  },
  bottomDateLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    textTransform: 'uppercase',
    color: Colors.slate,
  },
  bottomDateValue: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: Colors.inkPlum,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  continueButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
});
