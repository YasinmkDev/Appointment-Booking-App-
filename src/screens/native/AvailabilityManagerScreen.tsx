import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';
import { Save, Info, X, Plus, Check } from 'lucide-react';
import { DaySchedule } from '../../types';
import { INITIAL_SCHEDULE } from '../../data/mockData';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

export const AvailabilityManagerScreen: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDay = (dayName: string) => {
    setSchedule((prev) =>
      prev.map((d) => (d.day === dayName ? { ...d, enabled: !d.enabled } : d))
    );
  };

  const removeSlot = (dayName: string, slotIndex: number) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== dayName) return d;
        const newSlots = d.slots.filter((_, idx) => idx !== slotIndex);
        return {
          ...d,
          slots: newSlots,
          enabled: newSlots.length > 0 ? d.enabled : false,
        };
      })
    );
  };

  const addSlot = (dayName: string) => {
    setSchedule((prev) =>
      prev.map((d) => {
        if (d.day !== dayName) return d;
        return {
          ...d,
          enabled: true,
          slots: [...d.slots, { start: '09:00 AM', end: '05:00 PM' }],
        };
      })
    );
  };

  const activeDaysCount = schedule.filter((d) => d.enabled && d.slots.length > 0).length;
  const totalHoursCount = activeDaysCount * 7.5;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDiscard = () => {
    setSchedule(INITIAL_SCHEDULE);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <Text style={styles.subtitle}>
          Define your standard working hours. These slots will be available for clients to book in your ledger.
        </Text>
      </View>

      {/* Schedule Container */}
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Standard Hours</Text>
          <Text style={styles.tzLabel}>EST (UTC-5)</Text>
        </View>

        <View style={styles.daysList}>
          {schedule.map((d, index) => {
            const isLast = index === schedule.length - 1;
            return (
              <View key={d.day} style={[styles.dayRow, !isLast && styles.dayRowBorder]}>
                <View style={styles.dayTopRow}>
                  <Text style={styles.dayName}>{d.day}</Text>
                  <Switch
                    value={d.enabled}
                    onValueChange={() => toggleDay(d.day)}
                    trackColor={{ false: '#E6E2DB', true: Colors.sageTeal }}
                    thumbColor={Colors.white}
                  />
                </View>

                {d.enabled && d.slots.length > 0 ? (
                  <View style={styles.slotsGroup}>
                    {d.slots.map((slot, idx) => (
                      <View key={idx} style={styles.slotItem}>
                        <View style={styles.timeTagRow}>
                          <View style={styles.timeTag}>
                            <Text style={styles.timeTagText}>{slot.start}</Text>
                          </View>
                          <Text style={styles.timeHyphen}>-</Text>
                          <View style={styles.timeTag}>
                            <Text style={styles.timeTagText}>{slot.end}</Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() => removeSlot(d.day, idx)}
                          style={styles.removeSlotBtn}
                        >
                          <X size={12} color={Colors.slate} />
                        </TouchableOpacity>
                      </View>
                    ))}

                    <TouchableOpacity
                      onPress={() => addSlot(d.day)}
                      style={styles.addShiftBtn}
                    >
                      <Plus size={11} color={Colors.sageTeal} />
                      <Text style={styles.addShiftText}>Add split shift</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.unavailableText}>Unavailable</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>

        <View style={styles.summaryStats}>
          <View style={styles.summaryStatRow}>
            <Text style={styles.summaryLabel}>Active Days:</Text>
            <Text style={styles.summaryValue}>{activeDaysCount} / 7</Text>
          </View>
          <View style={styles.summaryStatRow}>
            <Text style={styles.summaryLabel}>Total Hours:</Text>
            <Text style={styles.summaryValue}>{totalHoursCount} hrs</Text>
          </View>
        </View>

        <View style={styles.summaryActions}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            style={styles.saveButton}
          >
            {savedSuccess ? (
              <>
                <Check size={14} color={Colors.inkPlum} />
                <Text style={styles.saveButtonText}>Schedule Saved!</Text>
              </>
            ) : (
              <>
                <Save size={14} color={Colors.inkPlum} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDiscard}
            style={styles.discardButton}
          >
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overrides Tip Box */}
      <View style={styles.tipBox}>
        <Info size={14} color={Colors.sageTeal} style={styles.tipIcon} />
        <Text style={styles.tipText}>
          Need to take a specific day off? Use Date Overrides to block out time without altering your standard weekly ledger.
        </Text>
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
    lineHeight: 17,
  },
  scheduleCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 14,
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    paddingBottom: 8,
    marginBottom: 8,
  },
  scheduleTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  tzLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  daysList: {
    gap: 4,
  },
  dayRow: {
    paddingVertical: 8,
  },
  dayRowBorder: {
    borderBottomWidth: 1,
    borderColor: 'rgba(206, 196, 203, 0.4)',
  },
  dayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  slotsGroup: {
    marginTop: 6,
    paddingLeft: 4,
    gap: 6,
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 6,
  },
  timeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeTag: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.outline,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  timeTagText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.inkPlum,
    fontWeight: '500',
  },
  timeHyphen: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  removeSlotBtn: {
    padding: 4,
  },
  addShiftBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 2,
  },
  addShiftText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.sageTeal,
    fontWeight: '600',
  },
  unavailableText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
    fontStyle: 'italic',
    marginTop: 2,
    paddingLeft: 4,
  },
  summaryCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    padding: 14,
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.inkPlum,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
    paddingBottom: 6,
    marginBottom: 10,
  },
  summaryStats: {
    gap: 6,
    marginBottom: 12,
  },
  summaryStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  summaryValue: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  summaryActions: {
    borderTopWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    paddingTop: 10,
    gap: 8,
  },
  saveButton: {
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: Colors.marigoldDeep,
    paddingVertical: 12,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  discardButton: {
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  discardButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
  tipBox: {
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
    lineHeight: 16,
  },
});
