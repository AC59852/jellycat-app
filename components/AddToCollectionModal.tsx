import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { fetch } from 'expo/fetch';
import { File, Paths } from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ItemProps {
  name: string;
  image: string;
  theme: string;
  colour: string;
  id: string;
}

interface AddToCollectionModalProps {
  visible: boolean;
  collectionId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const API_BASE = 'https://jellycat-category-fetch.austin-caron1.workers.dev';

export default function AddToCollectionModal({ visible, collectionId, onClose, onUpdated }: AddToCollectionModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ItemProps[]>([]);
  const [collectionItemIds, setCollectionItemIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Load current collection item IDs so we can show +/x correctly
  const loadCollectionIds = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) return;
      const all = JSON.parse(file.textSync());
      const found = all.find((c: any) => c.id === collectionId);
      if (found) {
        setCollectionItemIds(new Set((found.items as ItemProps[]).map(i => i.id)));
      }
    } catch (err) {
      console.error('Error loading collection ids:', err);
    }
  }, [collectionId]);

  // Fetch default bears category on open
  const fetchDefault = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}?category=bears&v=v2`);
      const result = await res.json();
      const items = Array.isArray(result) ? result : result.items;
      setResults(items.filter((i: ItemProps) => i.name && i.image));
    } catch (err) {
      console.error('Error fetching default:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search API
  const fetchSearch = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
      const result = await res.json();
      const items = Array.isArray(result) ? result : result.items;
      setResults(items.filter((i: ItemProps) => i.name && i.image));
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  if (visible) {
    loadCollectionIds();
    // Only fetch default bears if collection is empty
    const file = new File(Paths.document, 'collection.json');
    if (file.exists) {
      const all = JSON.parse(file.textSync());
      const found = all.find((c: any) => c.id === collectionId);
      if (found?.items?.length > 0) {
        setResults(found.items);
        return;
      }
    }
    fetchDefault();
  }
}, [visible]);

  // Debounced search
  useEffect(() => {
    if (!visible) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!query.trim()) {
      fetchDefault();
      return;
    }
    const timer = setTimeout(() => fetchSearch(query.trim()), 400);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleItem = (item: ItemProps) => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) return;
      const all = JSON.parse(file.textSync());
      const index = all.findIndex((c: any) => c.id === collectionId);
      if (index === -1) return;

      const collection = all[index];
      const items: ItemProps[] = collection.items ?? [];
      const alreadyIn = items.some(i => i.id === item.id);

      if (alreadyIn) {
        all[index].items = items.filter(i => i.id !== item.id);
        setCollectionItemIds(prev => { const next = new Set(prev); next.delete(item.id); return next; });
      } else {
        all[index].items = [...items, item];
        setCollectionItemIds(prev => new Set(prev).add(item.id));
      }

      file.write(JSON.stringify(all));
      onUpdated();
    } catch (err) {
      console.error('Error toggling item:', err);
    }
  };

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  const renderItem = ({ item }: { item: ItemProps }) => {
    const inCollection = collectionItemIds.has(item.id);
    return (
      <View style={styles.row}>
        <Image source={{ uri: item.image }} style={styles.rowImage} />
        <View style={styles.rowText}>
          <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.rowTags} numberOfLines={1}>{item.theme}{item.colour ? `, ${item.colour}` : ''}</Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleItem(item)}
          style={[styles.toggleButton, inCollection && styles.toggleButtonRemove]}
        >
          <Text style={[styles.toggleIcon, inCollection && styles.toggleIconRemove]}>
            {inCollection ? '✕' : '+'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Jellycats</Text>
            <TouchableOpacity onPress={handleClose} style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search jellycats..."
              placeholderTextColor="#AAAAAA"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>

          {/* List */}
          {loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color="#4570FF" />
          ) : (
            <FlatList
              data={results}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text style={styles.emptyText}>No results found</Text>
              }
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
  doneButton: {
    backgroundColor: '#4570FF',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  doneText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Rubik_400Regular',
    fontSize: 15,
    color: '#111111',
    paddingVertical: 11,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  rowImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EEF0F2',
  },
  rowText: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  rowName: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: '#111111',
  },
  rowTags: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 11,
    color: '#747474',
    marginTop: 3,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4570FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonRemove: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  toggleIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Rubik_700Bold',
  },
  toggleIconRemove: {
    color: '#E53935',
    fontSize: 14,
  },
  emptyText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 15,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 40,
  },
});