import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useState, useEffect, useRef } from 'react';
import { COLLECTION_IMAGES } from '@/constants/collectionImages';

const SORT_OPTIONS = ['A - Z', 'Newest In', 'Z - A'] as const;
const SIZE_OPTIONS = ['Tiny', 'Small', 'Medium', 'Large', 'Huge'] as const;
const COLOUR_OPTIONS = ['Yellow', 'Red', 'Green', 'Orange', 'Brown', 'White', 'Blue', 'Gray', 'Black', 'Pink', 'Purple'] as const;

export type SortOption = typeof SORT_OPTIONS[number];
export type SizeOption = typeof SIZE_OPTIONS[number];

export interface FilterState {
  category: string | null;
  sort: SortOption | null;
  sizes: SizeOption[];
  colours: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initial?: FilterState;
}

export const DEFAULT_FILTERS: FilterState = {
  category: null,
  sort: null,
  sizes: [],
  colours: [],
};

export default function FilterModal({ visible, onClose, onApply, initial }: FilterModalProps): JSX.Element {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initial ?? DEFAULT_FILTERS);
  const [modalMounted, setModalMounted] = useState(visible);

  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const dropdownHeight = useRef(new Animated.Value(0)).current;

  const translateX = scale.interpolate({
    inputRange: [0.7, 1],
    outputRange: [-45, 0],
  });

  const translateY = scale.interpolate({
    inputRange: [0.7, 1],
    outputRange: [-60, 0],
  });

  useEffect(() => {
    if (visible) {
      setModalMounted(true);
      scale.setValue(0.7);
      opacity.setValue(0);
      overlayOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 260,
          friction: 18,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0.7,
          useNativeDriver: true,
          tension: 260,
          friction: 18,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalMounted(false);
      });
    }
  }, [visible]);

  // FIXED dropdown toggle
  const toggleCategory = () => {
  Animated.spring(dropdownHeight, {
    toValue: categoryOpen ? 0 : 170,
    useNativeDriver: false,
    tension: 180,
    friction: 22,
  }).start();

  setCategoryOpen(o => !o);
};

  const toggleSize = (size: SizeOption) => {
    setFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColour = (colour: string) => {
    setFilters(prev => ({
      ...prev,
      colours: prev.colours.includes(colour)
        ? prev.colours.filter(c => c !== colour)
        : [...prev.colours, colour],
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Modal visible={modalMounted} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} pointerEvents="none" />

      <Animated.View style={[
        styles.sheet,
        { opacity, transform: [{ translateX }, { translateY }, { scale }] },
      ]}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <Text style={styles.heading}>Filters</Text>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={toggleCategory}
            activeOpacity={0.8}
          >
            <Text style={[styles.dropdownText, !filters.category && { color: '#A0A0A0' }]}>
              {filters.category ?? 'Category'}
            </Text>
            <Text style={[styles.dropdownChevron, categoryOpen && { transform: [{ rotate: '180deg' }] }]}>
              ›
            </Text>
          </TouchableOpacity>

          {/* FIXED DROPDOWN */}
          <View style={styles.dropdownList}>
            <Animated.View style={{ height: dropdownHeight, overflow: 'hidden' }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                scrollEnabled={categoryOpen}
                nestedScrollEnabled
              >
                {COLLECTION_IMAGES.map(({ label }) => (
                  <TouchableOpacity
                    key={label}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFilters(prev => ({
                        ...prev,
                        category: prev.category === label ? null : label
                      }));
                      toggleCategory();
                    }}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      filters.category === label && { color: '#4570FF' }
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </View>

          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.chipRow}>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, filters.sort === opt && styles.chipActive]}
                onPress={() => setFilters(prev => ({
                  ...prev,
                  sort: prev.sort === opt ? null : opt
                }))}
              >
                <Text style={[styles.chipText, filters.sort === opt && styles.chipTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.chipRow}>
            {SIZE_OPTIONS.map(size => (
              <TouchableOpacity
                key={size}
                style={[styles.chip, filters.sizes.includes(size) && styles.chipActive]}
                onPress={() => toggleSize(size)}
              >
                <Text style={[styles.chipText, filters.sizes.includes(size) && styles.chipTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Colours</Text>
          <View style={styles.colourGrid}>
            {COLOUR_OPTIONS.map(colour => {
              const checked = filters.colours.includes(colour);
              return (
                <TouchableOpacity
                  key={colour}
                  style={styles.colourItem}
                  onPress={() => toggleColour(colour)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.colourLabel}>{colour}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply} activeOpacity={0.85}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  sheet: {
    position: 'absolute',
    top: 100,
    left: 16,
    width: 300,
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  heading: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 28,
    color: '#1A1A1A',
    marginBottom: 20,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEF0F2',
  },
  dropdownText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#1A1A1A',
  },
  dropdownChevron: {
    fontSize: 20,
    color: '#666666',
    lineHeight: 22,
  },
  dropdownList: {
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEF0F2',
    marginTop: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#333333',
  },
  sectionTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 18,
    color: '#1A1A1A',
    marginTop: 24,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: '#F6F8FA',
    borderWidth: 1,
    borderColor: '#EEF0F2',
  },
  chipActive: {
    backgroundColor: '#EEF3FF',
    borderColor: '#4570FF',
  },
  chipText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#333333',
  },
  chipTextActive: {
    color: '#4570FF',
    fontFamily: 'Rubik_500Medium',
  },
  colourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
    columnGap: 0,
    marginBottom: 24,
  },
  colourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '33.33%',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#4570FF',
    borderColor: '#4570FF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 11,
    lineHeight: 13,
    fontFamily: 'Rubik_700Bold',
  },
  colourLabel: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#333333',
  },
  applyButton: {
    backgroundColor: '#4570FF',
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  applyButtonText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});