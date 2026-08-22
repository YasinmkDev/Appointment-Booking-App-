import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Search, Star, MapPin, X, ArrowRight } from 'lucide-react-native';
import { Provider } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface BrowseProvidersScreenProps {
  providers: Provider[];
  onSelectProvider: (provider: Provider) => void;
}

export const BrowseProvidersScreen: React.FC<BrowseProvidersScreenProps> = ({
  providers,
  onSelectProvider,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Wellness', 'Hair & Artistry', 'Fitness', 'Aesthetics'];

  const filteredProviders = providers.filter((provider) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      provider.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Search Input Box */}
      <View style={styles.searchContainer}>
        <Search size={16} color={Colors.slate} style={styles.searchIcon} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search studios, crafts, treatments..."
          placeholderTextColor={Colors.slate}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <X size={14} color={Colors.slate} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Pills Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
              style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  isSelected && styles.categoryPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Directory Section Header */}
      <View style={styles.directoryHeader}>
        <Text style={styles.directoryTitle}>Available Studios</Text>
        <Text style={styles.resultsCount}>{filteredProviders.length} results</Text>
      </View>

      {/* Providers Cards List */}
      <View style={styles.cardsList}>
        {filteredProviders.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            activeOpacity={0.88}
            onPress={() => onSelectProvider(provider)}
            style={styles.providerCard}
          >
            {/* Left Image */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: provider.image }} style={styles.providerImage} />
            </View>

            {/* Right Card Content */}
            <View style={styles.cardDetails}>
              {/* Category & Rating */}
              <View style={styles.cardTopRow}>
                <Text style={styles.cardCategory}>{provider.category}</Text>
                <View style={styles.ratingBadge}>
                  <Star size={11} color={Colors.marigold} fill={Colors.marigold} />
                  <Text style={styles.ratingText}>{provider.rating}</Text>
                  <Text style={styles.reviewsText}>({provider.reviewCount})</Text>
                </View>
              </View>

              {/* Title & Description */}
              <Text style={styles.providerName} numberOfLines={1}>
                {provider.name}
              </Text>
              <Text style={styles.providerBio} numberOfLines={2}>
                {provider.bio}
              </Text>

              {/* Distance & Teaser Slot Row */}
              <View style={styles.cardBottomRow}>
                <View style={styles.distanceTag}>
                  <MapPin size={11} color={Colors.sageTeal} />
                  <Text style={styles.distanceText}>{provider.distance}</Text>
                </View>

                {provider.nextAvailable && (
                  <View style={styles.nextSlotTag}>
                    <Text style={styles.nextSlotText}>Next: {provider.nextAvailable}</Text>
                  </View>
                )}
              </View>

              {/* Action Button */}
              <View style={styles.bookButtonRow}>
                <TouchableOpacity
                  onPress={() => onSelectProvider(provider)}
                  style={styles.bookButton}
                >
                  <Text style={styles.bookButtonText}>View Services</Text>
                  <ArrowRight size={12} color={Colors.warmAlabaster} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredProviders.length === 0 && (
          <View style={styles.emptySearchContainer}>
            <Text style={styles.emptySearchTitle}>No studios found</Text>
            <Text style={styles.emptySearchSub}>
              Try adjusting your category filter or search keywords.
            </Text>
          </View>
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
    paddingBottom: 90,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.inkPlum,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContent: {
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  categoryPillActive: {
    backgroundColor: Colors.inkPlum,
    borderColor: Colors.inkPlum,
  },
  categoryPillText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  categoryPillTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  directoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inkPlum,
    paddingBottom: 4,
  },
  directoryTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  resultsCount: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
  cardsList: {
    gap: 14,
  },
  providerCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.outline,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  imageWrapper: {
    width: '100%',
    height: 140,
    backgroundColor: '#E6E2DB',
  },
  providerImage: {
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardCategory: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.marigoldDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  reviewsText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
  providerName: {
    fontFamily: Fonts.serif,
    fontSize: 17,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  providerBio: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    lineHeight: 17,
    marginBottom: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    marginBottom: 10,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    color: Colors.slate,
  },
  nextSlotTag: {
    backgroundColor: '#EBE8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nextSlotText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.inkPlum,
    fontWeight: '600',
  },
  bookButtonRow: {
    alignItems: 'flex-end',
  },
  bookButton: {
    backgroundColor: Colors.inkPlum,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 4,
  },
  bookButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.warmAlabaster,
  },
  emptySearchContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  emptySearchTitle: {
    fontFamily: Fonts.serif,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  emptySearchSub: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    textAlign: 'center',
  },
});
