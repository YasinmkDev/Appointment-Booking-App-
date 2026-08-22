import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ticket, ArrowRight, Compass } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface EmptyBookingsScreenProps {
  onBrowseProviders: () => void;
}

export const EmptyBookingsScreen: React.FC<EmptyBookingsScreenProps> = ({
  onBrowseProviders,
}) => {
  return (
    <View style={styles.container}>
      {/* Warm Tactile Illustration Container */}
      <View style={styles.circleOuter}>
        <View style={styles.ticketVisual}>
          <View style={styles.ticketVisualTop}>
            <Text style={styles.ticketVisualRef}>TICKET #---</Text>
            <View style={styles.ticketDot} />
          </View>
          <View style={styles.ticketIconCenter}>
            <Ticket size={32} color={Colors.outline} />
          </View>
          <View style={styles.ticketBar} />
        </View>

        {/* Small Tilted Stamp Badge */}
        <View style={styles.tiltedStamp}>
          <Text style={styles.tiltedStampText}>OPEN LEDGER</Text>
        </View>
      </View>

      {/* Typography */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Nothing booked yet</Text>
        <Text style={styles.subtitle}>
          Find a provider to get started and stamp your first appointment pass into your ledger.
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onBrowseProviders}
        style={styles.browseButton}
      >
        <Compass size={16} color={Colors.marigoldLight} />
        <Text style={styles.browseButtonText}>Browse Providers</Text>
        <ArrowRight size={14} color={Colors.marigoldLight} />
      </TouchableOpacity>

      <Text style={styles.footnote}>Curated Studios & Artisanal Wellness</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmAlabaster,
    padding: 24,
    paddingBottom: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.alabasterCard,
    borderWidth: 2,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  ticketVisual: {
    width: 100,
    height: 120,
    backgroundColor: Colors.warmAlabaster,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    padding: 10,
    justifyContent: 'space-between',
    transform: [{ rotate: '-4deg' }],
  },
  ticketVisualTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    paddingBottom: 4,
  },
  ticketVisualRef: {
    fontFamily: Fonts.mono,
    fontSize: 7,
    color: Colors.slate,
  },
  ticketDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.marigold,
  },
  ticketIconCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  ticketBar: {
    height: 4,
    backgroundColor: '#E6E2DB',
    borderRadius: 2,
  },
  tiltedStamp: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: 'rgba(43, 27, 46, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    transform: [{ rotate: '12deg' }],
  },
  tiltedStampText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
    maxWidth: 270,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    textAlign: 'center',
    lineHeight: 18,
  },
  browseButton: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: Colors.inkPlum,
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  browseButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
  footnote: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
});
