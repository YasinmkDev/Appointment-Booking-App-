import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Decorative Top Stamp Header */}
      <View style={styles.topStampContainer}>
        <View style={styles.stampBadge}>
          <Text style={styles.stampBadgeText}>LEDGER NO. 001</Text>
        </View>
        <Text style={styles.locationStamp}>NEW YORK • EST. 2024</Text>
      </View>

      {/* Hero Visual Ticket Container */}
      <View style={styles.heroCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Notches on Card */}
        <View style={[styles.notch, styles.notchLeft]} />
        <View style={[styles.notch, styles.notchRight]} />

        {/* Decorative corner seal */}
        <View style={styles.sealBadge}>
          <Sparkles size={12} color={Colors.marigoldDeep} />
          <Text style={styles.sealText}>ARTISANAL</Text>
        </View>
      </View>

      {/* Main Headline & Narrative Copy */}
      <View style={styles.narrativeSection}>
        <Text style={styles.kicker}>APPOINTMENT DIRECTORY</Text>
        <Text style={styles.mainTitle}>
          Find your next appointment.
        </Text>
        <Text style={styles.subText}>
          Discover vetted independent studios, wellness practitioners, and craft specialists.
          Reserve time slots with instant confirmation.
        </Text>
      </View>

      {/* Feature Highlights Grid */}
      <View style={styles.highlightsGrid}>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>Curated local studios</Text>
        </View>
        <View style={styles.highlightItem}>
          <View style={styles.highlightDot} />
          <Text style={styles.highlightText}>Real-time ledger passes</Text>
        </View>
      </View>

      {/* Action Button: Ink Plum with Marigold Pressed State */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onGetStarted}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={16} color={Colors.marigoldLight} />
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Independent studios • No upfront cancellation fees
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
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  topStampContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  stampBadge: {
    backgroundColor: '#EBE8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  stampBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.inkPlum,
    letterSpacing: 0.5,
  },
  locationStamp: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.slate,
    letterSpacing: 1,
  },
  heroCard: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    backgroundColor: Colors.alabasterCard,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  notch: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.warmAlabaster,
    top: '50%',
    marginTop: -7,
  },
  notchLeft: {
    left: -7,
    borderRightWidth: 1,
    borderColor: Colors.inkPlum,
  },
  notchRight: {
    right: -7,
    borderLeftWidth: 1,
    borderColor: Colors.inkPlum,
  },
  sealBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.warmAlabaster,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
  },
  sealText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.inkPlum,
    letterSpacing: 0.5,
  },
  narrativeSection: {
    width: '100%',
    marginBottom: 20,
  },
  kicker: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.marigoldDeep,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  mainTitle: {
    fontFamily: Fonts.serif,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.inkPlum,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subText: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.slate,
    lineHeight: 20,
  },
  highlightsGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.sageTeal,
  },
  highlightText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.inkPlum,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.inkPlum,
    paddingVertical: 14,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 10,
  },
  primaryButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
  footnote: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
});
