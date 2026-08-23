import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Save, Info, X, Plus, Check, ChevronDown, ChevronUp, Ban, Clock } from 'lucide-react-native';
import { DaySchedule, DateOverride } from '../../types';
import { useProviderStore } from '../../store/providerStore';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

export const AvailabilityManagerScreen: React.FC = () => {
  const storeSchedule = useProviderStore((s) => s.schedule);
  const setSchedule = useProviderStore((s) => s.setSchedule);
  const storeOverrides = useProviderStore((s) => s.dateOverrides);
  const addDateOverride = useProviderStore((s) => s.addDateOverride);

  const [draft, setDraft] = useState<DaySchedule[]>(storeSchedule);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [overridesOpen, setOverridesOpen] = useState(false);

  // New override form state
  const [newOverrideDate, setNewOverrideDate] = useState('');
  const [newOverrideBlocked, setNewOverrideBlocked] = useState(true);
  const [newOverrideStart, setNewOverrideStart] = useState('09:00 AM');
  const [newOverrideEnd, setNewOverrideEnd] = useState('05:00 PM');
  const [newOverrideReason, setNewOverrideReason] = useState('');

  const handleAddOverride = () => {
    if (!newOverrideDate.match(/^\d{4}-\d{2}-\d{2}$/)) return;
    const override: DateOverride = {
      date: newOverrideDate,
      isBlocked: newOverrideBlocked,
      reason: newOverrideReason || undefined,
      customStart: newOverrideBlocked ? undefined : newOverrideStart,
      customEnd: newOverrideBlocked ? undefined : newOverrideEnd,
    };
    addDateOverride(override);
    setNewOverrideDate('');
    setNewOverrideReason('');
  };

  const removeOverride = (date: string) => {
    // Re-add as unblocked with no custom hours = effectively removes restriction
    // We use addDateOverride with a sentinel — simpler: filter via store
    // Since store only has addDateOverride, we call setSchedule trick:
    // Instead, expose removeOverride from store
    useProviderStore.setState((s) => ({
      dateOverrides: s.dateOverrides.filter((o) => o.date !== date),
    }));
  };

  const toggleDay = (dayName: string) =>
    setDraft((prev) =>
      prev.map((d) => (d.day === dayName ? { ...d, enabled: !d.enabled } : d))
    );

  const removeSlot = (dayName: string, slotIndex: number) =>
    setDraft((prev) =>
      prev.map((d) => {
        if (d.day !== dayName) return d;
        const newSlots = d.slots.filter((_, idx) => idx !== slotIndex);
        return { ...d, slots: newSlots, enabled: newSlots.length > 0 ? d.enabled : false };
      })
    );

  const addSlot = (dayName: string) =>
    setDraft((prev) =>
      prev.map((d) => {
        if (d.day !== dayName) return d;
        return { ...d, enabled: true, slots: [...d.slots, { start: '09:00 AM', end: '05:00 PM' }] };
      })
    );

  const activeDaysCount = draft.filter((d) => d.enabled && d.slots.length > 0).length;

  const handleSave = () => {
    setSchedule(draft);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDiscard = () => setDraft(storeSchedule);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Schedule</Text>
        <Text style={styles.subtitle}>
          Define your standard working hours. These slots will be available for clients to book.
        </Text>
      </View>

      <View style={styles.scheduleCard}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Standard Hours</Text>
          <Text style={styles.tzLabel}>EST (UTC-5)</Text>
        </View>

        <View style={styles.daysList}>
          {draft.map((d, index) => (
            <View key={d.day} style={[styles.dayRow, index < draft.length - 1 && styles.dayRowBorder]}>
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
                        <View style={styles.timeTag}><Text style={styles.timeTagText}>{slot.start}</Text></View>
                        <Text style={styles.timeHyphen}>-</Text>
                        <View style={styles.timeTag}><Text style={styles.timeTagText}>{slot.end}</Text></View>
                      </View>
                      <TouchableOpacity onPress={() => removeSlot(d.day, idx)} style={styles.removeSlotBtn}>
                        <X size={12} color={Colors.slate} />
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity onPress={() => addSlot(d.day)} style={styles.addShiftBtn}>
                    <Plus size={11} color={Colors.sageTeal} />
                    <Text style={styles.addShiftText}>Add split shift</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.unavailableText}>Unavailable</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryStats}>
          <View style={styles.summaryStatRow}>
            <Text style={styles.summaryLabel}>Active Days:</Text>
            <Text style={styles.summaryValue}>{activeDaysCount} / 7</Text>
          </View>
          <View style={styles.summaryStatRow}>
            <Text style={styles.summaryLabel}>Est. Weekly Hours:</Text>
            <Text style={styles.summaryValue}>{(activeDaysCount * 7.5).toFixed(1)} hrs</Text>
          </View>
          <View style={styles.summaryStatRow}>
            <Text style={styles.summaryLabel}>Date Overrides:</Text>
            <Text style={styles.summaryValue}>{storeOverrides.length} active</Text>
          </View>
        </View>

        <View style={styles.summaryActions}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleSave} style={styles.saveButton}>
            {savedSuccess
              ? <><Check size={14} color={Colors.inkPlum} /><Text style={styles.saveButtonText}>Schedule Saved!</Text></>
              : <><Save size={14} color={Colors.inkPlum} /><Text style={styles.saveButtonText}>Save Changes</Text></>
            }
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={handleDiscard} style={styles.discardButton}>
            <Text style={styles.discardButtonText}>Discard Changes</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Date Overrides ─────────────────────────────────────────────── */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOverridesOpen((v) => !v)}
        style={styles.overridesToggle}
      >
        <View style={styles.overridesToggleLeft}>
          <Clock size={13} color={Colors.inkPlum} />
          <Text style={styles.overridesToggleText}>Date Overrides</Text>
          {storeOverrides.length > 0 && (
            <View style={styles.overrideBadge}>
              <Text style={styles.overrideBadgeText}>{storeOverrides.length}</Text>
            </View>
          )}
        </View>
        {overridesOpen ? <ChevronUp size={14} color={Colors.slate} /> : <ChevronDown size={14} color={Colors.slate} />}
      </TouchableOpacity>

      {overridesOpen && (
        <View style={styles.overridesCard}>
          {/* Existing overrides */}
          {storeOverrides.length > 0 && (
            <View style={styles.overridesList}>
              {storeOverrides.map((o) => (
                <View key={o.date} style={styles.overrideRow}>
                  <View style={[styles.overrideTypePill, o.isBlocked ? styles.pillBlocked : styles.pillCustom]}>
                    {o.isBlocked
                      ? <Ban size={10} color={Colors.dustyRoseDark} />
                      : <Clock size={10} color={Colors.sageDark} />
                    }
                    <Text style={[styles.pillText, o.isBlocked ? styles.pillTextBlocked : styles.pillTextCustom]}>
                      {o.isBlocked ? 'Blocked' : 'Custom'}
                    </Text>
                  </View>
                  <View style={styles.overrideInfo}>
                    <Text style={styles.overrideDate}>{o.date}</Text>
                    {!o.isBlocked && (
                      <Text style={styles.overrideHours}>{o.customStart} – {o.customEnd}</Text>
                    )}
                    {o.reason ? <Text style={styles.overrideReason}>{o.reason}</Text> : null}
                  </View>
                  <TouchableOpacity onPress={() => removeOverride(o.date)} style={styles.removeOverrideBtn}>
                    <X size={12} color={Colors.slate} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add new override form */}
          <View style={styles.overrideForm}>
            <Text style={styles.overrideFormTitle}>Add Override</Text>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.formInput}
                value={newOverrideDate}
                onChangeText={setNewOverrideDate}
                placeholder="2025-01-15"
                placeholderTextColor={Colors.slate}
                maxLength={10}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Reason (optional)</Text>
              <TextInput
                style={styles.formInput}
                value={newOverrideReason}
                onChangeText={setNewOverrideReason}
                placeholder="Holiday, personal day..."
                placeholderTextColor={Colors.slate}
              />
            </View>

            <View style={styles.formToggleRow}>
              <Text style={styles.formLabel}>Block entire day</Text>
              <Switch
                value={newOverrideBlocked}
                onValueChange={setNewOverrideBlocked}
                trackColor={{ false: '#E6E2DB', true: Colors.dustyRose }}
                thumbColor={Colors.white}
              />
            </View>

            {!newOverrideBlocked && (
              <View style={styles.customHoursRow}>
                <View style={styles.customHourField}>
                  <Text style={styles.formLabel}>Start</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newOverrideStart}
                    onChangeText={setNewOverrideStart}
                    placeholder="09:00 AM"
                    placeholderTextColor={Colors.slate}
                  />
                </View>
                <View style={styles.customHourField}>
                  <Text style={styles.formLabel}>End</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newOverrideEnd}
                    onChangeText={setNewOverrideEnd}
                    placeholder="05:00 PM"
                    placeholderTextColor={Colors.slate}
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddOverride}
              style={[
                styles.addOverrideBtn,
                !newOverrideDate.match(/^\d{4}-\d{2}-\d{2}$/) && styles.addOverrideBtnDisabled,
              ]}
              disabled={!newOverrideDate.match(/^\d{4}-\d{2}-\d{2}$/)}
            >
              <Plus size={13} color={Colors.inkPlum} />
              <Text style={styles.addOverrideBtnText}>Add Override</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.tipBox}>
        <Info size={14} color={Colors.sageTeal} style={styles.tipIcon} />
        <Text style={styles.tipText}>
          Tip: Date Overrides take precedence over your weekly schedule. Blocked days show as unavailable to clients.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmAlabaster },
  contentContainer: { padding: 16, paddingBottom: 90 },
  header: { marginBottom: 16 },
  title: { fontFamily: Fonts.serif, fontSize: 22, fontWeight: '700', color: Colors.inkPlum, marginBottom: 4 },
  subtitle: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, lineHeight: 17 },
  scheduleCard: { backgroundColor: Colors.alabasterCard, borderRadius: 6, borderWidth: 1, borderColor: Colors.outline, padding: 14, marginBottom: 16 },
  scheduleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: Colors.outline, paddingBottom: 8, marginBottom: 8 },
  scheduleTitle: { fontFamily: Fonts.serif, fontSize: 15, fontWeight: '700', color: Colors.inkPlum },
  tzLabel: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  daysList: { gap: 4 },
  dayRow: { paddingVertical: 8 },
  dayRowBorder: { borderBottomWidth: 1, borderColor: 'rgba(206, 196, 203, 0.4)' },
  dayTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayName: { fontFamily: Fonts.sans, fontSize: 13, fontWeight: '700', color: Colors.inkPlum },
  slotsGroup: { marginTop: 6, paddingLeft: 4, gap: 6 },
  slotItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.warmAlabaster, borderWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', borderRadius: 4, padding: 6 },
  timeTagRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeTag: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.outline, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 3 },
  timeTagText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.inkPlum, fontWeight: '500' },
  timeHyphen: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  removeSlotBtn: { padding: 4 },
  addShiftBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 2 },
  addShiftText: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.sageTeal, fontWeight: '600' },
  unavailableText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate, fontStyle: 'italic', marginTop: 2, paddingLeft: 4 },
  summaryCard: { backgroundColor: Colors.alabasterCard, borderRadius: 6, borderWidth: 1, borderColor: Colors.inkPlum, padding: 14, marginBottom: 16 },
  summaryTitle: { fontFamily: Fonts.serif, fontSize: 15, fontWeight: '700', color: Colors.inkPlum, borderBottomWidth: 1, borderBottomColor: Colors.outline, paddingBottom: 6, marginBottom: 10 },
  summaryStats: { gap: 6, marginBottom: 12 },
  summaryStatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  summaryValue: { fontFamily: Fonts.mono, fontSize: 11, fontWeight: '700', color: Colors.inkPlum },
  summaryActions: { borderTopWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', paddingTop: 10, gap: 8 },
  saveButton: { backgroundColor: Colors.marigoldLight, borderWidth: 1, borderColor: Colors.marigoldDeep, paddingVertical: 12, borderRadius: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  saveButtonText: { fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700', color: Colors.inkPlum },
  discardButton: { borderWidth: 1, borderColor: Colors.inkPlum, paddingVertical: 10, borderRadius: 4, alignItems: 'center' },
  discardButtonText: { fontFamily: Fonts.sans, fontSize: 12, fontWeight: '600', color: Colors.inkPlum },
  tipBox: { backgroundColor: Colors.warmAlabaster, borderWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', borderRadius: 6, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipIcon: { marginTop: 2 },
  tipText: { flex: 1, fontFamily: Fonts.sans, fontSize: 11, color: Colors.slate, lineHeight: 16 },
  // Date overrides
  overridesToggle: { backgroundColor: Colors.alabasterCard, borderWidth: 1, borderColor: Colors.outline, borderRadius: 6, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  overridesToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  overridesToggleText: { fontFamily: Fonts.sans, fontSize: 13, fontWeight: '700', color: Colors.inkPlum },
  overrideBadge: { backgroundColor: Colors.dustyRose, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  overrideBadgeText: { fontFamily: Fonts.mono, fontSize: 10, fontWeight: '700', color: Colors.white },
  overridesCard: { backgroundColor: Colors.alabasterCard, borderRadius: 6, borderWidth: 1, borderColor: Colors.outline, padding: 14, marginBottom: 16, gap: 12 },
  overridesList: { gap: 8, borderBottomWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', paddingBottom: 12 },
  overrideRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  overrideTypePill: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, borderWidth: 1 },
  pillBlocked: { backgroundColor: Colors.dustyRoseLight, borderColor: Colors.dustyRose },
  pillCustom: { backgroundColor: Colors.sageLight, borderColor: Colors.sageTeal },
  pillText: { fontFamily: Fonts.mono, fontSize: 9, fontWeight: '700' },
  pillTextBlocked: { color: Colors.dustyRoseDark },
  pillTextCustom: { color: Colors.sageDark },
  overrideInfo: { flex: 1 },
  overrideDate: { fontFamily: Fonts.mono, fontSize: 11, fontWeight: '700', color: Colors.inkPlum },
  overrideHours: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.slate, marginTop: 1 },
  overrideReason: { fontFamily: Fonts.sans, fontSize: 10, color: Colors.slate, fontStyle: 'italic', marginTop: 1 },
  removeOverrideBtn: { padding: 4 },
  overrideForm: { gap: 8 },
  overrideFormTitle: { fontFamily: Fonts.serif, fontSize: 13, fontWeight: '700', color: Colors.inkPlum },
  formRow: { gap: 3 },
  formLabel: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.slate, textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput: { backgroundColor: Colors.warmAlabaster, borderWidth: 1, borderColor: Colors.outline, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 7, fontFamily: Fonts.mono, fontSize: 12, color: Colors.inkPlum },
  formToggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customHoursRow: { flexDirection: 'row', gap: 10 },
  customHourField: { flex: 1, gap: 3 },
  addOverrideBtn: { backgroundColor: Colors.marigoldLight, borderWidth: 1, borderColor: Colors.marigoldDeep, paddingVertical: 10, borderRadius: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4 },
  addOverrideBtnDisabled: { opacity: 0.45 },
  addOverrideBtnText: { fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700', color: Colors.inkPlum },
});
