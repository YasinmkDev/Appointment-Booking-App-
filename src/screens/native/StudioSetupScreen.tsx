import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from 'react-native';
import {
  Store,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  Info,
} from 'lucide-react-native';
import { Service, StudioSetupData, Provider } from '../../types';
import { useProviderStore } from '../../store/providerStore';
import { AvatarPicker } from '../../components/native/AvatarPicker';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface StudioSetupScreenProps {
  onCompleteSetup: (newStudio: Provider) => void;
  onCancel: () => void;
}

export const StudioSetupScreen: React.FC<StudioSetupScreenProps> = ({
  onCompleteSetup,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const setSchedule = useProviderStore((s) => s.setSchedule);

  // Step 1: Details
  const [studioName, setStudioName] = useState('Aura Botanica Studio');
  const [category, setCategory] = useState('Hair & Scalp Artistry');
  const [address, setAddress] = useState('142 Hawthorne Blvd, Suite 2B');
  const [bio, setBio] = useState(
    'Artisanal scalp therapy and organic botanicals tailored to slow wellness and precision cutcraft.'
  );
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
  );

  // Step 2: Services
  const [services, setServices] = useState<Service[]>([
    {
      id: 'srv-1',
      name: 'Artisan Haircut & Style',
      description: 'Precision shear cutting and botanical scalp cleanse.',
      price: 75,
      durationMinutes: 60,
      category: 'Hair',
      bufferMinutes: 10,
      isActive: true,
    },
    {
      id: 'srv-2',
      name: 'Organic Scalp Detox Treatment',
      description: 'Herbal exfoliation, hot towel compress, and balancing mask.',
      price: 50,
      durationMinutes: 45,
      category: 'Wellness',
      bufferMinutes: 10,
      isActive: true,
    },
  ]);

  // New Service inline form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('45');
  const [showAddServiceBox, setShowAddServiceBox] = useState(false);

  // Step 3: Rules & Slot Cadence
  const [slotInterval, setSlotInterval] = useState<number>(30);
  const [bufferTime, setBufferTime] = useState<number>(10);
  const [instantConfirmation, setInstantConfirmation] = useState<boolean>(true);

  const handleAddService = () => {
    if (!newServiceName.trim() || !newServicePrice) return;
    const priceNum = parseFloat(newServicePrice) || 50;
    const durNum = parseInt(newServiceDuration, 10) || 30;

    const srv: Service = {
      id: `srv-${Date.now()}`,
      name: newServiceName.trim(),
      description: 'Custom studio service tailored to client requirements.',
      price: priceNum,
      durationMinutes: durNum,
      category: 'Artisan',
      bufferMinutes: bufferTime,
      isActive: true,
    };

    setServices((prev) => [...prev, srv]);
    setNewServiceName('');
    setNewServicePrice('');
    setShowAddServiceBox(false);
  };

  const handleRemoveService = (id: string) => {
    if (services.length <= 1) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleFinish = () => {
    const newProvider: Provider = {
      id: `studio-${Date.now().toString().slice(-4)}`,
      name: studioName.trim() || 'My Artisan Studio',
      category: category.trim() || 'Boutique Studio',
      rating: 5.0,
      reviewCount: 1,
      distance: '0.5 mi away',
      address: address.trim(),
      bio: bio.trim() || 'Welcome to our studio booking ledger.',
      image: coverImage,
      nextAvailable: 'TOMORROW, 10:00 AM',
      services: services,
      slotIntervalMinutes: slotInterval,
      bufferMinutes: bufferTime,
      instantConfirmation: instantConfirmation,
      timezone: 'America/New_York',
      isVerified: false,
    };

    // Seed a default schedule for the new studio
    setSchedule([
      { day: 'Monday',    dayIndex: 1, enabled: true,  slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
      { day: 'Tuesday',   dayIndex: 2, enabled: true,  slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
      { day: 'Wednesday', dayIndex: 3, enabled: true,  slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
      { day: 'Thursday',  dayIndex: 4, enabled: true,  slots: [{ start: '09:00 AM', end: '05:00 PM' }] },
      { day: 'Friday',    dayIndex: 5, enabled: true,  slots: [{ start: '09:00 AM', end: '03:00 PM' }] },
      { day: 'Saturday',  dayIndex: 6, enabled: false, slots: [] },
      { day: 'Sunday',    dayIndex: 0, enabled: false, slots: [] },
    ]);

    onCompleteSetup(newProvider);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Ledger Header */}
      <View style={styles.topHeader}>
        <View style={styles.badgeRow}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STUDIO ONBOARDING • STEP {currentStep} OF 3</Text>
          </View>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelLinkText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.screenTitle}>
          {currentStep === 1 && 'Studio Profile & Details'}
          {currentStep === 2 && 'Service Catalog & Pricing'}
          {currentStep === 3 && 'Slot Interval & Booking Rules'}
        </Text>
        <Text style={styles.screenSubtitle}>
          {currentStep === 1 && 'Establish your brand identity, location, and aesthetic bio.'}
          {currentStep === 2 && 'Define the services you provide, prices, and appointment lengths.'}
          {currentStep === 3 && 'Configure how clients schedule time slots on your ledger calendar.'}
        </Text>
      </View>

      {/* Progress Dots */}
      <View style={styles.progressRow}>
        <View style={[styles.progressStep, currentStep >= 1 && styles.progressStepActive]}>
          <Text style={[styles.progressNumber, currentStep >= 1 && styles.progressNumberActive]}>1</Text>
        </View>
        <View style={[styles.progressLine, currentStep >= 2 && styles.progressLineActive]} />
        <View style={[styles.progressStep, currentStep >= 2 && styles.progressStepActive]}>
          <Text style={[styles.progressNumber, currentStep >= 2 && styles.progressNumberActive]}>2</Text>
        </View>
        <View style={[styles.progressLine, currentStep >= 3 && styles.progressLineActive]} />
        <View style={[styles.progressStep, currentStep >= 3 && styles.progressStepActive]}>
          <Text style={[styles.progressNumber, currentStep >= 3 && styles.progressNumberActive]}>3</Text>
        </View>
      </View>

      {/* STEP 1: STUDIO DETAILS */}
      {currentStep === 1 && (
        <View style={styles.stepCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>STUDIO COVER PHOTO</Text>
            <AvatarPicker
              uri={coverImage}
              size={80}
              onPicked={setCoverImage}
              label="Tap to change cover photo"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>STUDIO NAME</Text>
            <TextInput
              value={studioName}
              onChangeText={setStudioName}
              placeholder="e.g. Rowan Hair Atelier"
              placeholderTextColor={Colors.slate}
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PRIMARY CRAFT / CATEGORY</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. Boutique Hair & Scalp Artistry"
              placeholderTextColor={Colors.slate}
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>STUDIO ADDRESS OR NEIGHBORHOOD</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 142 Hawthorne Blvd, Suite 2B"
              placeholderTextColor={Colors.slate}
              style={styles.textInput}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ABOUT / CLIENT WELCOME BIO</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              placeholder="Describe your craft, philosophy, and guest experience..."
              placeholderTextColor={Colors.slate}
              style={[styles.textInput, styles.textArea]}
            />
          </View>
        </View>
      )}

      {/* STEP 2: SERVICE CATALOG & PRICING */}
      {currentStep === 2 && (
        <View style={styles.stepCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Active Service Menu ({services.length})</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowAddServiceBox(!showAddServiceBox)}
              style={styles.addServiceTriggerBtn}
            >
              <Plus size={12} color={Colors.inkPlum} />
              <Text style={styles.addServiceTriggerText}>Add Service</Text>
            </TouchableOpacity>
          </View>

          {/* Inline Add Service Form */}
          {showAddServiceBox && (
            <View style={styles.addServiceBox}>
              <Text style={styles.addServiceBoxTitle}>New Service Entry</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SERVICE NAME</Text>
                <TextInput
                  value={newServiceName}
                  onChangeText={setNewServiceName}
                  placeholder="e.g. Gloss & Hydration Blowout"
                  placeholderTextColor={Colors.slate}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>PRICE ($ USD)</Text>
                  <TextInput
                    value={newServicePrice}
                    onChangeText={setNewServicePrice}
                    keyboardType="numeric"
                    placeholder="65"
                    placeholderTextColor={Colors.slate}
                    style={styles.textInput}
                  />
                </View>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>DURATION (MIN)</Text>
                  <TextInput
                    value={newServiceDuration}
                    onChangeText={setNewServiceDuration}
                    keyboardType="numeric"
                    placeholder="45"
                    placeholderTextColor={Colors.slate}
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.addServiceActions}>
                <TouchableOpacity
                  onPress={() => setShowAddServiceBox(false)}
                  style={styles.cancelAddBtn}
                >
                  <Text style={styles.cancelAddText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddService}
                  style={styles.saveAddBtn}
                >
                  <Text style={styles.saveAddText}>Save to Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* List of current services */}
          <View style={styles.servicesList}>
            {services.map((srv, index) => (
              <View key={srv.id} style={styles.serviceItemCard}>
                <View style={styles.serviceLeft}>
                  <View style={styles.serviceIndexBadge}>
                    <Text style={styles.serviceIndexText}>0{index + 1}</Text>
                  </View>
                  <View>
                    <Text style={styles.srvName}>{srv.name}</Text>
                    <Text style={styles.srvMeta}>
                      ${srv.price} • {srv.durationMinutes} mins • {srv.category}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemoveService(srv.id)}
                  style={styles.deleteSrvBtn}
                >
                  <Trash2 size={15} color={Colors.dustyRoseDark} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* STEP 3: SLOT CADENCE & RULES */}
      {currentStep === 3 && (
        <View style={styles.stepCard}>
          {/* Slot Interval */}
          <View style={styles.ruleGroup}>
            <Text style={styles.inputLabel}>APPOINTMENT SLOT INTERVAL</Text>
            <Text style={styles.ruleSub}>How frequently appointment slots start on your calendar ribbon.</Text>
            <View style={styles.optionRow}>
              {[15, 30, 45, 60].map((int) => (
                <TouchableOpacity
                  key={int}
                  activeOpacity={0.8}
                  onPress={() => setSlotInterval(int)}
                  style={[
                    styles.optionPill,
                    slotInterval === int && styles.optionPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionPillText,
                      slotInterval === int && styles.optionPillTextActive,
                    ]}
                  >
                    Every {int}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Buffer Time */}
          <View style={styles.ruleGroup}>
            <Text style={styles.inputLabel}>CLEANUP / BUFFER TIME BETWEEN CLIENTS</Text>
            <Text style={styles.ruleSub}>Automated reset window added after every completed session.</Text>
            <View style={styles.optionRow}>
              {[0, 5, 10, 15, 30].map((buf) => (
                <TouchableOpacity
                  key={buf}
                  activeOpacity={0.8}
                  onPress={() => setBufferTime(buf)}
                  style={[
                    styles.optionPill,
                    bufferTime === buf && styles.optionPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionPillText,
                      bufferTime === buf && styles.optionPillTextActive,
                    ]}
                  >
                    {buf === 0 ? 'No Buffer' : `${buf} min`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Instant Confirmation Switch */}
          <View style={styles.switchRowCard}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Instant Auto-Confirmation</Text>
              <Text style={styles.switchSub}>
                Automatically confirm bookings without manual review when slots are open.
              </Text>
            </View>
            <Switch
              value={instantConfirmation}
              onValueChange={setInstantConfirmation}
              trackColor={{ false: Colors.outline, true: Colors.sageTeal }}
              thumbColor={instantConfirmation ? Colors.white : Colors.slate}
            />
          </View>
        </View>
      )}

      {/* Bottom Step Navigation Bar */}
      <View style={styles.bottomNavRow}>
        {currentStep > 1 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3)}
            style={styles.backStepButton}
          >
            <ArrowLeft size={16} color={Colors.inkPlum} />
            <Text style={styles.backStepButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {currentStep < 3 ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3)}
            style={styles.nextStepButton}
          >
            <Text style={styles.nextStepButtonText}>Continue to Step {currentStep + 1}</Text>
            <ArrowRight size={16} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleFinish}
            style={styles.finishButton}
          >
            <Check size={16} color={Colors.inkPlum} />
            <Text style={styles.finishButtonText}>Launch Studio Ledger</Text>
          </TouchableOpacity>
        )}
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
    paddingBottom: 40,
  },
  topHeader: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stepBadge: {
    backgroundColor: 'rgba(232, 163, 61, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.marigoldLight,
  },
  stepBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.marigoldDeep,
    letterSpacing: 0.5,
  },
  cancelLinkText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
    textDecorationLine: 'underline',
  },
  screenTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginTop: 2,
  },
  screenSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    marginTop: 3,
    lineHeight: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  progressStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAE6DD',
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStepActive: {
    backgroundColor: Colors.inkPlum,
    borderColor: Colors.inkPlum,
  },
  progressNumber: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
  },
  progressNumberActive: {
    color: Colors.white,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.outline,
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: Colors.inkPlum,
  },
  stepCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.inkPlum,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  addServiceTriggerBtn: {
    backgroundColor: Colors.marigoldLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addServiceTriggerText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  addServiceBox: {
    backgroundColor: '#F3EFE7',
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  addServiceBoxTitle: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 8,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  col: {
    flex: 1,
  },
  addServiceActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelAddBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  cancelAddText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
  },
  saveAddBtn: {
    backgroundColor: Colors.inkPlum,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  saveAddText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  servicesList: {
    gap: 8,
  },
  serviceItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    padding: 10,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  serviceIndexBadge: {
    width: 24,
    height: 24,
    backgroundColor: '#EBE8E1',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceIndexText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  srvName: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  srvMeta: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
    marginTop: 1,
  },
  deleteSrvBtn: {
    padding: 6,
  },
  ruleGroup: {
    marginBottom: 16,
  },
  ruleSub: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  optionPill: {
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  optionPillActive: {
    backgroundColor: Colors.inkPlum,
    borderColor: Colors.inkPlum,
  },
  optionPillText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.slate,
  },
  optionPillTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  switchRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    padding: 12,
    marginTop: 6,
  },
  switchTextCol: {
    flex: 1,
    marginRight: 10,
  },
  switchTitle: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  switchSub: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
    marginTop: 2,
    lineHeight: 15,
  },
  bottomNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
  },
  backStepButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
  nextStepButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.inkPlum,
    borderRadius: 6,
  },
  nextStepButtonText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  finishButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    borderRadius: 6,
  },
  finishButtonText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
});
