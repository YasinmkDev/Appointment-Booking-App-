import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { CreditCard, Smartphone, Banknote, Check, Lock, ChevronRight } from 'lucide-react-native';
import { Provider, Service, TimeSlot, PaymentMethod } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface PaymentScreenProps {
  provider: Provider;
  service: Service;
  selectedDate: string;
  slot: TimeSlot;
  onConfirmPayment: (slot: TimeSlot, method: PaymentMethod) => void;
  onBack: () => void;
}

const METHODS: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa, Mastercard, Amex',
    icon: <CreditCard size={18} color={Colors.inkPlum} />,
  },
  {
    id: 'apple_pay',
    label: 'Apple Pay / Google Pay',
    sub: 'One-tap checkout',
    icon: <Smartphone size={18} color={Colors.inkPlum} />,
  },
  {
    id: 'pay_later',
    label: 'Pay at Studio',
    sub: 'Settle on arrival',
    icon: <Banknote size={18} color={Colors.inkPlum} />,
  },
];

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  provider,
  service,
  selectedDate,
  slot,
  onConfirmPayment,
  onBack,
}) => {
  const [selected, setSelected] = useState<PaymentMethod>('card');

  const tax = +(service.price * 0.08).toFixed(2);
  const total = +(service.price + tax).toFixed(2);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Order Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.sectionLabel}>ORDER SUMMARY</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryLeft}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.providerName}>{provider.name}</Text>
          </View>
          <Text style={styles.servicePrice}>${service.price.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Date</Text>
          <Text style={styles.metaValue}>{selectedDate}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Time</Text>
          <Text style={styles.metaValue}>{slot.time}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Duration</Text>
          <Text style={styles.metaValue}>{service.durationMinutes} min</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Subtotal</Text>
          <Text style={styles.metaValue}>${service.price.toFixed(2)}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Tax (8%)</Text>
          <Text style={styles.metaValue}>${tax.toFixed(2)}</Text>
        </View>

        <View style={[styles.metaRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Method */}
      <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
      <View style={styles.methodsCard}>
        {METHODS.map((m, i) => {
          const isSelected = selected === m.id;
          const isLast = i === METHODS.length - 1;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.75}
              onPress={() => setSelected(m.id)}
              style={[
                styles.methodRow,
                isSelected && styles.methodRowSelected,
                !isLast && styles.methodRowBorder,
              ]}
            >
              <View style={[styles.methodIcon, isSelected && styles.methodIconSelected]}>
                {m.icon}
              </View>
              <View style={styles.methodInfo}>
                <Text style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}>
                  {m.label}
                </Text>
                <Text style={styles.methodSub}>{m.sub}</Text>
              </View>
              <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Security note */}
      <View style={styles.secureRow}>
        <Lock size={11} color={Colors.sageTeal} />
        <Text style={styles.secureText}>Payments are encrypted and processed securely.</Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => onConfirmPayment(slot, selected)}
        style={styles.ctaButton}
      >
        <Check size={15} color={Colors.inkPlum} />
        <Text style={styles.ctaText}>
          {selected === 'pay_later' ? `Reserve · Pay $${total.toFixed(2)} at Studio` : `Pay $${total.toFixed(2)} & Confirm`}
        </Text>
        <ChevronRight size={15} color={Colors.inkPlum} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack} style={styles.backLink}>
        <Text style={styles.backLinkText}>← Change time slot</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmAlabaster },
  content: { padding: 16, paddingBottom: 90, gap: 12 },
  sectionLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 14,
    gap: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryLeft: { flex: 1, gap: 2 },
  serviceName: { fontFamily: Fonts.serif, fontSize: 16, fontWeight: '700', color: Colors.inkPlum },
  providerName: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.slate },
  servicePrice: { fontFamily: Fonts.mono, fontSize: 16, fontWeight: '700', color: Colors.inkPlum },
  divider: { height: 1, backgroundColor: Colors.outline, marginVertical: 2 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  metaValue: { fontFamily: Fonts.mono, fontSize: 11, fontWeight: '600', color: Colors.inkPlum },
  totalRow: { borderTopWidth: 1, borderColor: Colors.outline, borderStyle: 'dashed', paddingTop: 8, marginTop: 2 },
  totalLabel: { fontFamily: Fonts.serif, fontSize: 14, fontWeight: '700', color: Colors.inkPlum },
  totalValue: { fontFamily: Fonts.mono, fontSize: 16, fontWeight: '700', color: Colors.inkPlum },
  methodsCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    overflow: 'hidden',
    marginBottom: 4,
  },
  methodRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  methodRowSelected: { backgroundColor: 'rgba(92,131,116,0.07)' },
  methodRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.outline },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconSelected: { borderColor: Colors.sageTeal, backgroundColor: Colors.sageLight },
  methodInfo: { flex: 1 },
  methodLabel: { fontFamily: Fonts.sans, fontSize: 13, fontWeight: '700', color: Colors.inkPlum },
  methodLabelSelected: { color: Colors.sageDark },
  methodSub: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.slate, marginTop: 1 },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: Colors.sageTeal },
  radioInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.sageTeal },
  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'center', marginVertical: 4 },
  secureText: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.slate },
  ctaButton: {
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: Colors.marigoldDeep,
    borderRadius: 4,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: { fontFamily: Fonts.sans, fontSize: 14, fontWeight: '700', color: Colors.inkPlum },
  backLink: { alignItems: 'center', paddingVertical: 8 },
  backLinkText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
});
