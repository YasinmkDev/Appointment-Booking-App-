import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface TicketSlotProps {
  time: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const TicketSlot: React.FC<TicketSlotProps> = ({
  time,
  selected = false,
  disabled = false,
  onPress,
  style,
}) => {
  if (disabled) {
    return (
      <View style={[styles.slotBase, styles.slotDisabled, style]}>
        <View style={[styles.notch, styles.notchLeft, styles.notchDisabled]} />
        <View style={[styles.notch, styles.notchRight, styles.notchDisabled]} />
        <Text style={[styles.slotText, styles.slotTextDisabled]}>{time}</Text>
      </View>
    );
  }

  if (selected) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.slotBase, styles.slotSelected, style]}
      >
        <View style={[styles.notch, styles.notchLeft, styles.notchSelected]} />
        <View style={[styles.notch, styles.notchRight, styles.notchSelected]} />
        <Text style={[styles.slotText, styles.slotTextSelected]}>{time}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.slotBase, styles.slotDefault, style]}
    >
      <View style={[styles.notch, styles.notchLeft, styles.notchDefault]} />
      <View style={[styles.notch, styles.notchRight, styles.notchDefault]} />
      <Text style={[styles.slotText, styles.slotTextDefault]}>{time}</Text>
    </TouchableOpacity>
  );
};

interface PerforatedDividerProps {
  orientation?: 'horizontal' | 'vertical';
  withNotches?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const PerforatedDivider: React.FC<PerforatedDividerProps> = ({
  orientation = 'horizontal',
  withNotches = true,
  style,
}) => {
  if (orientation === 'vertical') {
    return (
      <View style={[styles.dividerVerticalContainer, style]}>
        {withNotches && <View style={[styles.notchCircle, styles.notchTop]} />}
        <View style={styles.perforatedLineV} />
        {withNotches && <View style={[styles.notchCircle, styles.notchBottom]} />}
      </View>
    );
  }

  return (
    <View style={[styles.dividerHorizontalContainer, style]}>
      {withNotches && <View style={[styles.notchCircle, styles.notchLeftOuter]} />}
      <View style={styles.perforatedLineH} />
      {withNotches && <View style={[styles.notchCircle, styles.notchRightOuter]} />}
    </View>
  );
};

interface StatusPillProps {
  status: 'confirmed' | 'pending' | 'completed' | 'canceled' | 'arrived' | 'upcoming';
  style?: StyleProp<ViewStyle>;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, style }) => {
  switch (status) {
    case 'confirmed':
      return (
        <View style={[styles.pillBase, styles.pillConfirmed, style]}>
          <View style={styles.pillDotConfirmed} />
          <Text style={styles.pillTextConfirmed}>Confirmed</Text>
        </View>
      );
    case 'arrived':
      return (
        <View style={[styles.pillBase, styles.pillArrived, style]}>
          <Text style={styles.pillTextArrived}>ARRIVED</Text>
        </View>
      );
    case 'upcoming':
      return (
        <View style={[styles.pillBase, styles.pillUpcoming, style]}>
          <Text style={styles.pillTextUpcoming}>UPCOMING</Text>
        </View>
      );
    case 'pending':
      return (
        <View style={[styles.pillBase, styles.pillPending, style]}>
          <Text style={styles.pillTextPending}>Pending</Text>
        </View>
      );
    case 'canceled':
      return (
        <View style={[styles.pillBase, styles.pillCanceled, style]}>
          <Text style={styles.pillTextCanceled}>CANCELED</Text>
        </View>
      );
    case 'completed':
      return (
        <View style={[styles.pillBase, styles.pillCompleted, style]}>
          <Text style={styles.pillTextCompleted}>Completed</Text>
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  slotBase: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 8,
    overflow: 'hidden',
  },
  slotDefault: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  slotSelected: {
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    transform: [{ translateY: 1 }],
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  slotDisabled: {
    backgroundColor: '#EBE8E1',
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  slotText: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  slotTextDefault: {
    color: Colors.inkPlum,
    fontWeight: '500',
  },
  slotTextSelected: {
    color: Colors.inkPlum,
    fontWeight: '700',
  },
  slotTextDisabled: {
    color: Colors.slate,
    textDecorationLine: 'line-through',
  },
  notch: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.warmAlabaster,
    top: '50%',
    marginTop: -5,
  },
  notchLeft: {
    left: -5,
    borderRightWidth: 1,
    borderColor: Colors.outline,
  },
  notchRight: {
    right: -5,
    borderLeftWidth: 1,
    borderColor: Colors.outline,
  },
  notchDefault: {
    borderColor: Colors.outline,
  },
  notchSelected: {
    borderColor: Colors.inkPlum,
  },
  notchDisabled: {
    borderColor: Colors.outline,
  },
  // Divider
  dividerHorizontalContainer: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    marginVertical: 4,
  },
  dividerVerticalContainer: {
    height: '100%',
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
  },
  perforatedLineH: {
    width: '100%',
    height: 1.5,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.outline,
    borderStyle: 'dashed',
  },
  perforatedLineV: {
    height: '100%',
    width: 1.5,
    borderRightWidth: 1.5,
    borderRightColor: Colors.outline,
    borderStyle: 'dashed',
  },
  notchCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.warmAlabaster,
    zIndex: 10,
  },
  notchLeftOuter: {
    left: -10,
    borderRightWidth: 1,
    borderRightColor: Colors.outline,
  },
  notchRightOuter: {
    right: -10,
    borderLeftWidth: 1,
    borderLeftColor: Colors.outline,
  },
  notchTop: {
    top: -10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  notchBottom: {
    bottom: -10,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  // Status Pills
  pillBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillConfirmed: {
    backgroundColor: Colors.sageLight,
    borderColor: 'rgba(92, 131, 116, 0.4)',
  },
  pillDotConfirmed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.sageTeal,
    marginRight: 6,
  },
  pillTextConfirmed: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.sageDark,
  },
  pillArrived: {
    backgroundColor: '#E6E2DB',
    borderColor: Colors.outline,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillTextArrived: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '600',
    color: Colors.inkPlum,
    letterSpacing: 0.5,
  },
  pillUpcoming: {
    backgroundColor: 'rgba(254, 182, 78, 0.18)',
    borderColor: Colors.marigoldLight,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillTextUpcoming: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.marigoldDeep,
    letterSpacing: 0.5,
  },
  pillPending: {
    backgroundColor: '#EBE8E1',
    borderColor: Colors.outline,
  },
  pillTextPending: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  pillCanceled: {
    backgroundColor: Colors.dustyRoseLight,
    borderColor: Colors.dustyRose,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  pillTextCanceled: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.dustyRoseDark,
    letterSpacing: 0.5,
  },
  pillCompleted: {
    backgroundColor: '#E6E2DB',
    borderColor: Colors.outline,
  },
  pillTextCompleted: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
});
