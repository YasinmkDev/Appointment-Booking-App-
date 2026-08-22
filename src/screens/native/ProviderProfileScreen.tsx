import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Star, MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Provider, Service } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface ProviderProfileScreenProps {
  provider: Provider;
  onSelectService: (service: Service) => void;
}

export const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({
  provider,
  onSelectService,
}) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Studio Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: provider.image }} style={styles.headerImage} resizeMode="cover" />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.categoryLabel}>{provider.category}</Text>
          <Text style={styles.studioName}>{provider.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingRow}>
              <Star size={12} color={Colors.marigold} fill={Colors.marigold} />
              <Text style={styles.ratingValue}>{provider.rating}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount} reviews)</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.sageTeal} />
              <Text style={styles.locationText}>{provider.distance}</Text>
            </View>
          </View>

          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{provider.bio}</Text>
          </View>
        </View>
      </View>

      {/* Services List Section */}
      <View style={styles.servicesSection}>
        <View style={styles.servicesHeader}>
          <Text style={styles.servicesTitle}>Services & Offerings</Text>
          <Text style={styles.servicesCount}>{provider.services.length} items</Text>
        </View>

        <View style={styles.servicesList}>
          {provider.services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceMain}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDesc}>{service.description}</Text>
              </View>

              <View style={styles.serviceFooter}>
                <View style={styles.serviceMetrics}>
                  <View style={styles.priceTag}>
                    <DollarSign size={12} color={Colors.sageTeal} />
                    <Text style={styles.priceValue}>${service.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.durationTag}>
                    <Clock size={12} color={Colors.slate} />
                    <Text style={styles.durationValue}>{service.durationMinutes}m</Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => onSelectService(service)}
                  style={styles.bookButton}
                >
                  <Text style={styles.bookButtonText}>Book Slot</Text>
                  <ArrowRight size={11} color={Colors.warmAlabaster} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  headerCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#E6E2DB',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    padding: 16,
  },
  categoryLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.marigoldDeep,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  studioName: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  reviewCount: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outline,
    marginHorizontal: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
  },
  bioContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  bioText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    lineHeight: 18,
  },
  servicesSection: {
    width: '100%',
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inkPlum,
    paddingBottom: 4,
  },
  servicesTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  servicesCount: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 14,
  },
  serviceMain: {
    marginBottom: 12,
  },
  serviceName: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  serviceDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    lineHeight: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  serviceMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceValue: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  durationValue: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  bookButton: {
    backgroundColor: Colors.inkPlum,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  bookButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.warmAlabaster,
  },
});
