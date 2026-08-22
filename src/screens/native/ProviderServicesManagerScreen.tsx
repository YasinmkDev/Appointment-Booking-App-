import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  StyleSheet,
} from 'react-native';
import {
  Plus,
  Edit3,
  Trash2,
  Clock,
  DollarSign,
  Sparkles,
  Layers,
  Check,
  X,
  Sliders,
} from 'lucide-react';
import { Service } from '../../types';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface ProviderServicesManagerScreenProps {
  services: Service[];
  onUpdateServices: (services: Service[]) => void;
}

export const ProviderServicesManagerScreen: React.FC<ProviderServicesManagerScreenProps> = ({
  services,
  onUpdateServices,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('45');
  const [buffer, setBuffer] = useState('10');
  const [category, setCategory] = useState('Hair');

  const categories = ['All', 'Hair', 'Color', 'Treatment', 'Consultation'];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleOpenAddModal = () => {
    setIsNew(true);
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice('65');
    setDuration('45');
    setBuffer('10');
    setCategory('Hair');
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setIsNew(false);
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price.toString());
    setDuration(service.durationMinutes.toString());
    setBuffer((service.bufferMinutes || 10).toString());
    setCategory(service.category);
    setIsEditModalOpen(true);
  };

  const handleToggleService = (serviceId: string) => {
    const updated = services.map((s) => {
      if (s.id === serviceId) {
        return { ...s, isActive: s.isActive === undefined ? false : !s.isActive };
      }
      return s;
    });
    onUpdateServices(updated);
  };

  const handleDeleteService = (serviceId: string) => {
    if (services.length <= 1) return;
    const updated = services.filter((s) => s.id !== serviceId);
    onUpdateServices(updated);
    setIsEditModalOpen(false);
  };

  const handleSaveService = () => {
    if (!name.trim() || !price) return;
    const priceNum = parseFloat(price) || 50;
    const durNum = parseInt(duration, 10) || 30;
    const bufNum = parseInt(buffer, 10) || 10;

    if (isNew) {
      const newSrv: Service = {
        id: `srv-${Date.now()}`,
        name: name.trim(),
        description: description.trim() || 'Tailored artisan service.',
        price: priceNum,
        durationMinutes: durNum,
        bufferMinutes: bufNum,
        category: category,
        isActive: true,
      };
      onUpdateServices([...services, newSrv]);
    } else if (editingService) {
      const updated = services.map((s) => {
        if (s.id === editingService.id) {
          return {
            ...s,
            name: name.trim(),
            description: description.trim(),
            price: priceNum,
            durationMinutes: durNum,
            bufferMinutes: bufNum,
            category: category,
          };
        }
        return s;
      });
      onUpdateServices(updated);
    }
    setIsEditModalOpen(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Stamp */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Service Catalog</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleOpenAddModal}
            style={styles.addBtn}
          >
            <Plus size={13} color={Colors.inkPlum} />
            <Text style={styles.addBtnText}>New Service</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Set appointment durations, prices, buffer cleanup times, and live catalog visibility.
        </Text>
      </View>

      {/* Stats Ribbon */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>{services.filter((s) => s.isActive !== false).length}</Text>
          <Text style={styles.statLabel}>Active Items</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>
            ${Math.min(...services.map((s) => s.price))} - ${Math.max(...services.map((s) => s.price))}
          </Text>
          <Text style={styles.statLabel}>Price Spectrum</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>
            {Math.round(
              services.reduce((acc, s) => acc + s.durationMinutes, 0) / (services.length || 1)
            )}
            m
          </Text>
          <Text style={styles.statLabel}>Avg Duration</Text>
        </View>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            activeOpacity={0.8}
            onPress={() => setActiveCategory(cat)}
            style={[
              styles.catPill,
              activeCategory === cat && styles.catPillActive,
            ]}
          >
            <Text
              style={[
                styles.catPillText,
                activeCategory === cat && styles.catPillTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services List */}
      <View style={styles.serviceList}>
        {filteredServices.map((srv) => {
          const isActive = srv.isActive !== false;
          return (
            <View
              key={srv.id}
              style={[
                styles.serviceCard,
                !isActive && styles.serviceCardInactive,
              ]}
            >
              {/* Top Stub */}
              <View style={styles.stubHeader}>
                <View style={styles.stubLeft}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{srv.category.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.stubIdText}>REF #{srv.id.toUpperCase()}</Text>
                </View>

                {/* Active switch */}
                <View style={styles.switchBox}>
                  <Text style={styles.switchLabelText}>{isActive ? 'LIVE' : 'PAUSED'}</Text>
                  <Switch
                    value={isActive}
                    onValueChange={() => handleToggleService(srv.id)}
                    trackColor={{ false: Colors.outline, true: Colors.sageTeal }}
                    thumbColor={isActive ? Colors.white : Colors.slate}
                  />
                </View>
              </View>

              {/* Service Info */}
              <View style={styles.serviceBody}>
                <Text style={styles.serviceTitle}>{srv.name}</Text>
                <Text style={styles.serviceDesc}>{srv.description}</Text>

                {/* Metrics Row */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <DollarSign size={13} color={Colors.marigoldDeep} />
                    <Text style={styles.metricPrice}>${srv.price.toFixed(2)}</Text>
                  </View>

                  <View style={styles.metricItem}>
                    <Clock size={13} color={Colors.slate} />
                    <Text style={styles.metricText}>{srv.durationMinutes} min appointment</Text>
                  </View>

                  <View style={styles.metricItem}>
                    <Sliders size={13} color={Colors.slate} />
                    <Text style={styles.metricText}>+{srv.bufferMinutes || 10}m reset</Text>
                  </View>
                </View>
              </View>

              {/* Action Footer */}
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleOpenEditModal(srv)}
                  style={styles.editBtn}
                >
                  <Edit3 size={13} color={Colors.inkPlum} />
                  <Text style={styles.editBtnText}>Edit Parameters</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Edit / Add Service Modal */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isNew ? 'Create New Service' : 'Edit Service Parameters'}
              </Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <X size={18} color={Colors.inkPlum} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SERVICE NAME</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Intensive Keratin Gloss"
                  placeholderTextColor={Colors.slate}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CATEGORY</Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  placeholder="e.g. Hair, Color, Treatment, Consultation"
                  placeholderTextColor={Colors.slate}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.twoColRow}>
                <View style={styles.col}>
                  <Text style={styles.inputLabel}>PRICE ($ USD)</Text>
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="85"
                    placeholderTextColor={Colors.slate}
                    style={styles.textInput}
                  />
                </View>

                <View style={styles.col}>
                  <Text style={styles.inputLabel}>DURATION (MINUTES)</Text>
                  <TextInput
                    value={duration}
                    onChangeText={setDuration}
                    keyboardType="numeric"
                    placeholder="60"
                    placeholderTextColor={Colors.slate}
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BUFFER / CLEANUP TIME (MINUTES)</Text>
                <TextInput
                  value={buffer}
                  onChangeText={setBuffer}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={Colors.slate}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DESCRIPTION / WHAT TO EXPECT</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  placeholder="Detailed breakdown of this service..."
                  placeholderTextColor={Colors.slate}
                  style={[styles.textInput, styles.textArea]}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              {!isNew && (
                <TouchableOpacity
                  onPress={() => editingService && handleDeleteService(editingService.id)}
                  style={styles.modalDeleteBtn}
                >
                  <Trash2 size={15} color={Colors.dustyRoseDark} />
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleSaveService}
                style={styles.modalSaveBtn}
              >
                <Check size={15} color={Colors.white} />
                <Text style={styles.modalSaveText}>Save Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.marigoldLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
  },
  addBtnText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    lineHeight: 16,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  statLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.slate,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.outline,
  },
  categoryScroll: {
    marginBottom: 14,
  },
  categoryContent: {
    gap: 6,
  },
  catPill: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  catPillActive: {
    backgroundColor: Colors.inkPlum,
    borderColor: Colors.inkPlum,
  },
  catPillText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.slate,
  },
  catPillTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  serviceList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceCardInactive: {
    opacity: 0.65,
    backgroundColor: '#EAE7E0',
  },
  stubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F3EFE7',
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  stubLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: 'rgba(232, 163, 61, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  categoryTagText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.marigoldDeep,
  },
  stubIdText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.slate,
  },
  switchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchLabelText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.slate,
  },
  serviceBody: {
    padding: 12,
  },
  serviceTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  serviceDesc: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    lineHeight: 16,
    marginBottom: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: Colors.warmAlabaster,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricPrice: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.marigoldDeep,
  },
  metricText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
  cardFooter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
    backgroundColor: '#FAF7F2',
    alignItems: 'flex-end',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editBtnText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(43, 27, 46, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    backgroundColor: Colors.warmAlabaster,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: Colors.alabasterCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outline,
  },
  modalTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  modalBody: {
    padding: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.inkPlum,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.alabasterCard,
    borderTopWidth: 1,
    borderTopColor: Colors.outline,
  },
  modalDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.dustyRoseLight,
    borderWidth: 1,
    borderColor: Colors.dustyRose,
    borderRadius: 4,
  },
  modalDeleteText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.dustyRoseDark,
  },
  modalSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.inkPlum,
    borderRadius: 4,
  },
  modalSaveText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
});
