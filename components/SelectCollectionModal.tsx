import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { File, Paths } from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLLECTION_IMAGES } from '@/constants/collectionImages';

interface Collection {
  id: string;
  name: string;
  description: string;
  imageIndex: number;
  items: any[];
  createdAt: string;
}

interface ItemProps {
  name: string;
  image: string;
  theme: string;
  colour: string;
  id: string;
}

interface SelectCollectionModalProps {
  visible: boolean;
  itemData: ItemProps | null;
  onClose: () => void;
  onAdded: () => void;
}

export default function SelectCollectionModal({ visible, itemData, onClose, onAdded }: SelectCollectionModalProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingToCollection, setAddingToCollection] = useState<string | null>(null);

  // Load collections from file
  const loadCollections = useCallback(() => {
    setLoading(true);
    try {
      const file = new File(Paths.document, 'collection.json');
      if (file.exists) {
        const collectionList = JSON.parse(file.textSync()) as Collection[];
        setCollections(collectionList);
      } else {
        setCollections([]);
      }
    } catch (err) {
      console.error('Error loading collections:', err);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadCollections();
    }
  }, [visible, loadCollections]);

  const handleAddToCollection = (collection: Collection) => {
    if (!itemData) return;
    
    setAddingToCollection(collection.id);
    
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) return;
      
      const all = JSON.parse(file.textSync()) as Collection[];
      const index = all.findIndex((c: Collection) => c.id === collection.id);
      
      if (index === -1) return;

      const items: ItemProps[] = all[index].items ?? [];
      const itemExists = items.some(i => i.id === itemData.id);

      if (itemExists) {
        // Remove item from collection
        all[index].items = items.filter(i => i.id !== itemData.id);
      } else {
        // Add item to collection
        all[index].items = [...items, itemData];
      }

      file.write(JSON.stringify(all));
      
      // Reload collections to update UI
      loadCollections();
      setAddingToCollection(null);
      
      // Only close modal if we added (not removed)
      if (!itemExists) {
        onAdded();
        onClose();
      }
    } catch (err) {
      console.error('Error toggling collection item:', err);
      setAddingToCollection(null);
    }
  };

  const isItemInCollection = (collection: Collection): boolean => {
    if (!itemData) return false;
    return collection.items?.some(i => i.id === itemData.id) ?? false;
  };

  const renderCollection = ({ item }: { item: Collection }) => {
    const coverImage = COLLECTION_IMAGES[item.imageIndex]?.image;
    const isAdding = addingToCollection === item.id;
    const inCollection = isItemInCollection(item);
    
    return (
      <TouchableOpacity
        onPress={() => handleAddToCollection(item)}
        disabled={isAdding}
        style={[styles.collectionRow, isAdding && styles.collectionRowDisabled]}
      >
        {coverImage && (
          <Image source={coverImage} style={styles.collectionImage} />
        )}
        <View style={styles.collectionInfo}>
          <Text style={styles.collectionName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.collectionCount}>
            {item.items?.length || 0} {item.items?.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
        {isAdding ? (
          <ActivityIndicator size="small" color="#4570FF" />
        ) : inCollection ? (
          <View style={styles.removeIcon}>
            <Text style={styles.removeIconText}>✕</Text>
          </View>
        ) : (
          <View style={styles.addIcon}>
            <Text style={styles.addIconText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add to Collection</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Collections List */}
          {loading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color="#4570FF" />
            </View>
          ) : collections.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No collections yet</Text>
              <Text style={styles.emptySubtext}>Create a collection to get started</Text>
            </View>
          ) : (
            <FlatList
              data={collections}
              keyExtractor={item => item.id}
              renderItem={renderCollection}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 17,
    color: '#111111',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 16,
    color: '#666666',
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#FAFAFA',
  },
  collectionRowDisabled: {
    opacity: 0.6,
  },
  collectionImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#E8E8E8',
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: '#111111',
    marginBottom: 4,
  },
  collectionCount: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 12,
    color: '#999999',
  },
  chevron: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 24,
    color: '#CCCCCC',
    marginLeft: 8,
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4570FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addIconText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Rubik_700Bold',
  },
  removeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeIconText: {
    color: '#E53935',
    fontSize: 14,
    fontFamily: 'Rubik_700Bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#999999',
  },
});