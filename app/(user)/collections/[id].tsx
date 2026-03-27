import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image, useWindowDimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, Link, useFocusEffect, useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { File, Paths } from 'expo-file-system';
import ProductCard from '@/components/ProductCard';
import AddToCollectionModal from '@/components/AddToCollectionModal';
import CogSvg from '@/components/svgs/CogSvg';
import { COLLECTION_IMAGES } from '@/constants/collectionImages';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ItemProps {
  name: string;
  image: string;
  theme: string;
  colour: string;
  id: string;
}

interface CollectionProps {
  id: string;
  name: string;
  description?: string;
  imageIndex: number;
  items: ItemProps[];
  createdAt: string;
}

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.430;
  const router = useRouter();

  const [collection, setCollection] = useState<CollectionProps | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  // Settings menu
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Edit state
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageIndex, setEditImageIndex] = useState<number>(0);
  const [editError, setEditError] = useState('');

  const imagePickerSize = (width - 48 - 32) / 3;

  const loadCollection = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) return;
      const all = JSON.parse(file.textSync()) as CollectionProps[];
      const found = all.find(c => c.id === String(id));
      setCollection(found ?? null);
    } catch (err) {
      console.error('Error loading collection:', err);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadCollection();
    }, [loadCollection])
  );

  const openEdit = () => {
    if (!collection) return;
    setEditName(collection.name);
    setEditDescription(collection.description ?? '');
    setEditImageIndex(collection.imageIndex);
    setEditError('');
    setSettingsVisible(false);
    setEditVisible(true);
  };

  const saveEdit = () => {
    if (!editName.trim()) { setEditError('Name cannot be empty.'); return; }
    try {
      const file = new File(Paths.document, 'collection.json');
      const all = JSON.parse(file.textSync()) as CollectionProps[];
      const index = all.findIndex(c => c.id === String(id));
      if (index === -1) return;
      all[index] = { ...all[index], name: editName.trim(), description: editDescription.trim(), imageIndex: editImageIndex };
      file.write(JSON.stringify(all));
      setEditVisible(false);
      loadCollection();
    } catch (err) {
      console.error('Error saving edit:', err);
    }
  };

  const deleteCollection = () => {
    Alert.alert(
      'Delete Collection',
      'Are you sure you want to delete this collection? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              const file = new File(Paths.document, 'collection.json');
              const all = JSON.parse(file.textSync()) as CollectionProps[];
              file.write(JSON.stringify(all.filter(c => c.id !== String(id))));
              setSettingsVisible(false);
              router.back();
            } catch (err) {
              console.error('Error deleting collection:', err);
            }
          },
        },
      ]
    );
  };

  if (!collection) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Collection not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AddToCollectionModal
        visible={addModalVisible}
        collectionId={String(id)}
        onClose={() => setAddModalVisible(false)}
        onUpdated={loadCollection}
      />

      {/* Settings menu modal */}
      <Modal visible={settingsVisible} transparent animationType="fade" onRequestClose={() => setSettingsVisible(false)}>
        <TouchableOpacity style={styles.settingsOverlay} activeOpacity={1} onPress={() => setSettingsVisible(false)}>
          <SafeAreaView style={styles.settingsSheet}>
            <View style={styles.settingsHandle} />
            <Text style={styles.settingsTitle}>{collection.name}</Text>
            <TouchableOpacity style={styles.settingsRow} onPress={openEdit}>
              <Text style={styles.settingsRowText}>Edit Collection</Text>
            </TouchableOpacity>
            <View style={styles.settingsDivider} />
            <TouchableOpacity style={styles.settingsRow} onPress={deleteCollection}>
              <Text style={[styles.settingsRowText, styles.settingsRowDestructive]}>Delete Collection</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>

      {/* Edit modal */}
      <Modal visible={editVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setEditVisible(false)}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <SafeAreaView style={styles.editContainer}>
            <View style={styles.editHeader}>
              <TouchableOpacity onPress={() => setEditVisible(false)} style={styles.editCancelButton}>
                <Text style={styles.editCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.editTitle}>Edit Collection</Text>
              <TouchableOpacity onPress={saveEdit} style={styles.editSaveButton}>
                <Text style={styles.editSaveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.editBody}>
              <Text style={styles.editLabel}>Collection Name</Text>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={(t) => { setEditName(t); setEditError(''); }}
                placeholderTextColor="#AAAAAA"
                maxLength={40}
              />

              <Text style={styles.editLabel}>Description <Text style={styles.editOptional}>(optional)</Text></Text>
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editDescription}
                onChangeText={setEditDescription}
                placeholder="What's this collection about?"
                placeholderTextColor="#AAAAAA"
                multiline
                numberOfLines={3}
                maxLength={120}
              />

              <Text style={styles.editLabel}>Cover Image</Text>
              <View style={styles.imageGrid}>
                {COLLECTION_IMAGES.map((img, index) => (
                  <TouchableOpacity
                    key={img.label}
                    onPress={() => setEditImageIndex(index)}
                    style={[
                      styles.imageWrapper,
                      { width: imagePickerSize, height: imagePickerSize },
                      editImageIndex === index && styles.imageSelected,
                    ]}
                  >
                    <Image source={img.image} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
                    {editImageIndex === index && (
                      <View style={styles.imageCheckOverlay}>
                        <Text style={styles.imageCheckMark}>✓</Text>
                      </View>
                    )}
                    <Text style={styles.imageLabel} numberOfLines={1}>{img.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {!!editError && <Text style={styles.errorText}>{editError}</Text>}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
        {/* Header row with title and cog */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{collection.name}</Text>
            {collection.description ? (
              <Text style={styles.description}>{collection.description}</Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.cogButton}>
            <CogSvg size={22} color="#7E8283" />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {/* Add Jellycats card */}
          <TouchableOpacity
            onPress={() => setAddModalVisible(true)}
            style={{ width: cardWidth, marginBottom: 15 }}
          >
            <View style={[styles.addBox, { width: cardWidth, height: cardWidth }]}>
              <View style={styles.plusCircle}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
            </View>
            <Text style={styles.addLabel}>Add Jellycats</Text>
          </TouchableOpacity>

          {collection.items.map((item) => (
              <ProductCard
                name={item.name}
                image={item.image}
                theme={item.theme}
                colour={item.colour}
                id={item.id}
              />
          ))}

          {collection.items.length === 0 && (
            <Text style={styles.emptyText}>Add some Jellycats to get started!</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    marginTop: 32,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Rubik_700Bold',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Rubik_400Regular',
    color: '#747474',
    marginTop: 4,
  },
  cogButton: {
    padding: 6,
    marginTop: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    padding: 15,
    paddingBottom: 100,
  },
  addBox: {
    backgroundColor: '#F2F5FF',
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DDE4FF',
    borderStyle: 'dashed',
  },
  plusCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4570FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 36,
    fontFamily: 'Rubik_700Bold',
  },
  addLabel: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    color: '#111111',
  },
  emptyText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 15,
    color: '#AAAAAA',
    textAlign: 'center',
    width: '100%',
    marginTop: 10,
  },

  // Settings menu
  settingsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  settingsSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  settingsHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  settingsTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 16,
    color: '#111111',
    marginBottom: 16,
  },
  settingsRow: {
    paddingVertical: 16,
  },
  settingsRowText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: '#111111',
  },
  settingsRowDestructive: {
    color: '#E53935',
  },
  settingsDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },

  // Edit modal
  editContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  editTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 17,
    color: '#111111',
  },
  editCancelButton: {
    minWidth: 60,
  },
  editCancelText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 16,
    color: '#666666',
  },
  editSaveButton: {
    backgroundColor: '#4570FF',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  editSaveText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  editBody: {
    padding: 20,
    paddingBottom: 60,
  },
  editLabel: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    marginTop: 20,
  },
  editOptional: {
    fontFamily: 'Rubik_400Regular',
    color: '#AAAAAA',
    fontSize: 13,
  },
  editInput: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Rubik_400Regular',
    fontSize: 15,
    color: '#111111',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  editTextArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imageSelected: {
    borderColor: '#4570FF',
  },
  imageCheckOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69, 112, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  imageCheckMark: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'Rubik_700Bold',
  },
  imageLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: '#FFFFFF',
    fontFamily: 'Rubik_500Medium',
    fontSize: 11,
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: '#E53935',
    marginTop: 16,
    textAlign: 'center',
  },
});