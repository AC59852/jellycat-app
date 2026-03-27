import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { File, Paths } from 'expo-file-system';
import { COLLECTION_IMAGES } from '@/constants/collectionImages';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NewCollectionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewCollectionModal({ visible, onClose, onCreated }: NewCollectionModalProps) {
  const { width } = useWindowDimensions();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [error, setError] = useState('');

  const imageSize = (width - 48 - 32) / 3;

  const handleCreate = () => {
    if (!name.trim()) { setError('Please enter a collection name.'); return; }
    if (selectedImage === null) { setError('Please select a cover image.'); return; }

    try {
      const file = new File(Paths.document, 'collection.json');
      const existing = file.exists ? (JSON.parse(file.textSync()) as object[]) : [];

      const newCollection = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        imageIndex: selectedImage,
        items: [],
        createdAt: new Date().toISOString(),
      };

      file.write(JSON.stringify([...existing, newCollection]));
      setName('');
      setDescription('');
      setSelectedImage(null);
      setError('');
      onCreated();
      onClose();
    } catch (err) {
      setError('Failed to save collection. Please try again.');
      console.error(err);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setSelectedImage(null);
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>New Collection</Text>
            <TouchableOpacity onPress={handleCreate} style={styles.createButton}>
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <Text style={styles.label}>Collection Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. My Favourites"
              placeholderTextColor="#AAAAAA"
              value={name}
              onChangeText={(t) => { setName(t); setError(''); }}
              maxLength={40}
            />

            <Text style={styles.label}>
              Description <Text style={styles.optional}>(optional)</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What's this collection about?"
              placeholderTextColor="#AAAAAA"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={120}
            />

            <Text style={styles.label}>Cover Image</Text>
            <View style={styles.imageGrid}>
              {COLLECTION_IMAGES.map((img, index) => (
                <TouchableOpacity
                  key={img.label}
                  onPress={() => { setSelectedImage(index); setError(''); }}
                  style={[
                    styles.imageWrapper,
                    { width: imageSize, height: imageSize },
                    selectedImage === index && styles.imageSelected,
                  ]}
                >
                  <Image source={img.image} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="cover" />
                  {selectedImage === index && (
                    <View style={styles.imageCheckOverlay}>
                      <Text style={styles.imageCheckMark}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.imageLabel} numberOfLines={1}>{img.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  title: { fontFamily: 'Rubik_700Bold', fontSize: 17, color: '#111111' },
  cancelButton: { paddingVertical: 4, paddingHorizontal: 4, minWidth: 60 },
  cancelText: { fontFamily: 'Rubik_400Regular', fontSize: 16, color: '#666666' },
  createButton: {
    backgroundColor: '#4570FF',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  createText: { fontFamily: 'Rubik_600SemiBold', fontSize: 15, color: '#FFFFFF' },
  body: { padding: 20, paddingBottom: 60 },
  label: { fontFamily: 'Rubik_600SemiBold', fontSize: 14, color: '#333333', marginBottom: 8, marginTop: 20 },
  optional: { fontFamily: 'Rubik_400Regular', color: '#AAAAAA', fontSize: 13 },
  input: {
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
  textArea: { height: 90, textAlignVertical: 'top' },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  imageWrapper: { borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  imageSelected: { borderColor: '#4570FF' },
  imageCheckOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69, 112, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  imageCheckMark: { color: '#FFFFFF', fontSize: 26, fontFamily: 'Rubik_700Bold' },
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
  errorText: { fontFamily: 'Rubik_400Regular', fontSize: 13, color: '#E53935', marginTop: 16, textAlign: 'center' },
});