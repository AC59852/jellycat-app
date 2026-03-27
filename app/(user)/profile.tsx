import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import { File, Paths } from 'expo-file-system';
import { fetch } from 'expo/fetch';
import { Link } from 'expo-router';
import NewCollectionModal from '@/components/NewCollectionModal';
import Onboarding from '@/components/Onboarding';
import CogSvg from '@/components/svgs/CogSvg';
import { COLLECTION_IMAGES } from '@/constants/collectionImages';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LikeProps {
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
  items: any[];
  createdAt: string;
}

interface UserProfile {
  name: string;
  imageIndex: number;
  onboardingComplete: boolean;
}

function readProfile(): UserProfile | null {
  try {
    const file = new File(Paths.document, 'user-profile.json');
    if (!file.exists) return null;
    const data = JSON.parse(file.textSync()) as UserProfile;
    return data.onboardingComplete ? data : null;
  } catch {
    return null;
  }
}

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.430;
  const thumbSize = (width - 40 - 72) / 3;

  const tabs = ['Collections', 'Likes'] as const;
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]>('Collections');
  const [collections, setCollections] = useState<CollectionProps[]>([]);
  const [likes, setLikes] = useState<LikeProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Settings modal state
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editImageIndex, setEditImageIndex] = useState(0);
  const [editNameError, setEditNameError] = useState('');

  useEffect(() => {
    const p = readProfile();
    setProfile(p);
    setProfileLoaded(true);
  }, []);

  const openSettings = () => {
    if (!profile) return;
    setEditName(profile.name);
    setEditImageIndex(profile.imageIndex);
    setEditNameError('');
    setSettingsVisible(true);
  };

  const saveSettings = () => {
    if (!editName.trim()) {
      setEditNameError('Name cannot be empty.');
      return;
    }
    try {
      const updated: UserProfile = {
        name: editName.trim(),
        imageIndex: editImageIndex,
        onboardingComplete: true,
      };
      const file = new File(Paths.document, 'user-profile.json');
      file.write(JSON.stringify(updated));
      setProfile(updated);
      setSettingsVisible(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const loadCollections = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) { setCollections([]); return; }
      setCollections(JSON.parse(file.textSync()) as CollectionProps[]);
    } catch (err) {
      console.error('Error loading collections:', err);
    }
  }, []);

  const loadLikes = useCallback(async () => {
    try {
      const file = new File(Paths.document, 'likes.json');
      if (!file.exists) { setLikes([]); return; }
      const ids = JSON.parse(file.textSync()) as { id: string }[];
      const sanitized = ids.filter(item => typeof item.id === 'string' && item.id.trim() !== '');
      if (sanitized.length === 0) { setLikes([]); return; }
      const queryIds = sanitized.map(i => i.id).join(',');
      const res = await fetch(`https://jellycat-category-fetch.austin-caron1.workers.dev/likes?ids=${queryIds}`);
      setLikes(await res.json());
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  }, []);

  const unlikeItem = async (id: string) => {
    try {
      const file = new File(Paths.document, 'likes.json');
      if (!file.exists) return;
      const arr = JSON.parse(file.textSync());
      file.write(JSON.stringify(arr.filter((item: any) => item.id !== id)));
      setLikes(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error updating likes.json:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedTab === 'Collections') loadCollections();
      else loadLikes();
    }, [selectedTab, loadCollections, loadLikes])
  );

  if (!profileLoaded) return null;

  if (!profile) {
    return (
      <Onboarding
        onComplete={(name, imageIndex) => {
          setProfile({ name, imageIndex, onboardingComplete: true });
        }}
      />
    );
  }

  const avatarSource = COLLECTION_IMAGES[profile.imageIndex]?.image;

  return (
    <View style={{ flex: 1 }}>
      {/* ── Collections modal ── */}
      <NewCollectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={loadCollections}
      />

      {/* ── Settings modal ── */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <SafeAreaView style={styles.settingsContainer}>
            {/* Header */}
            <View style={styles.settingsHeader}>
              <TouchableOpacity onPress={() => setSettingsVisible(false)} style={styles.settingsCancelBtn}>
                <Text style={styles.settingsCancelText}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.settingsTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={saveSettings} style={styles.settingsSaveBtn}>
                <Text style={styles.settingsSaveText}>Save</Text>
              </TouchableOpacity>
            </View>

            {/* Fixed top: large preview */}
            <View style={styles.settingsPreviewSection}>
              <View style={styles.largePreviewWrapper}>
                <Image
                  source={COLLECTION_IMAGES[editImageIndex].image}
                  style={styles.largePreview}
                  resizeMode="cover"
                />
              </View>

              {/* Name input */}
              <Text style={styles.settingsLabel}>Display Name</Text>
              <TextInput
                style={[styles.settingsInput, editNameError ? styles.settingsInputError : null]}
                value={editName}
                onChangeText={(t) => { setEditName(t); setEditNameError(''); }}
                placeholder="Your name"
                placeholderTextColor="#AAAAAA"
                maxLength={30}
                textAlign="center"
              />
              {!!editNameError && <Text style={styles.settingsErrorText}>{editNameError}</Text>}
            </View>

            {/* Scrollable thumbnail grid */}
            <Text style={[styles.settingsLabel, { paddingHorizontal: 20, marginBottom: 10 }]}>Profile Image</Text>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.thumbGrid}
              showsVerticalScrollIndicator={false}
            >
              {COLLECTION_IMAGES.map((img, index) => (
                <TouchableOpacity
                  key={img.label}
                  onPress={() => setEditImageIndex(index)}
                  style={[
                    styles.thumbWrapper,
                    { width: thumbSize, height: thumbSize },
                    editImageIndex === index && styles.thumbSelected,
                  ]}
                >
                  <Image
                    source={img.image}
                    style={{ width: '100%', height: '100%', borderRadius: 999 }}
                    resizeMode="cover"
                  />
                  {editImageIndex === index && (
                    <View style={styles.thumbCheckOverlay}>
                      <Text style={styles.thumbCheck}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* Settings cog top left */}
          <TouchableOpacity onPress={openSettings} style={styles.cogButton}>
            <CogSvg size={22} color="#333333" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            {avatarSource && (
              <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
            )}
          </View>
          <Text style={styles.name}>Hello, {profile.name}</Text>

          <View style={styles.tabRow}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                style={[styles.tabPill, selectedTab === tab && styles.tabPillActive]}
              >
                <Text style={[styles.tabPillText, selectedTab === tab && styles.tabPillTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {selectedTab === 'Collections' && (
            <>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ width: cardWidth, marginBottom: 15 }}
              >
                <View style={[styles.newCollectionBox, { width: cardWidth, height: cardWidth }]}>
                  <View style={styles.plusCircle}>
                    <Text style={styles.plusIcon}>+</Text>
                  </View>
                </View>
                <Text style={styles.newCollectionLabel}>New Collection</Text>
              </TouchableOpacity>

              {collections.map((item) => (
                <CollectionCard
                  name={item.name}
                  description={item.description}
                  imageSource={COLLECTION_IMAGES[item.imageIndex]?.image}
                  id={item.id}
                  key={item.id}
                />
              ))}

              {collections.length === 0 && (
                <Text style={styles.emptyText}>No collections yet</Text>
              )}
            </>
          )}

          {selectedTab === 'Likes' && (
            <>
              {likes.length === 0 ? (
                <Text style={styles.emptyText}>No liked items yet</Text>
              ) : (
                likes.map((item) => (
                    <ProductCard
                      name={item.name}
                      image={item.image}
                      theme={item.theme}
                      colour={item.colour}
                      id={item.id}
                      onUnlike={() => unlikeItem(item.id)}
                    />
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cogButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 6,
    backgroundColor: "#F6F8FA",
    borderRadius: "100%",
  },
  avatarContainer: {
    width: 170,
    height: 170,
    borderRadius: "100%",
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 32,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 24,
    color: '#111111',
  },
  tabRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 25
  },
  tabPill: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: '#F2F2F2',
  },
  tabPillActive: {
    backgroundColor: '#4570FF',
  },
  tabPillText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 14,
    color: '#888888',
  },
  tabPillTextActive: {
    color: '#FFFFFF',
  },

  // Settings modal
  settingsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingsTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 17,
    color: '#111111',
  },
  settingsCancelBtn: {
    minWidth: 60,
  },
  settingsCancelText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 16,
    color: '#666666',
  },
  settingsSaveBtn: {
    backgroundColor: '#4570FF',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  settingsSaveText: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  settingsPreviewSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  largePreviewWrapper: {
    width: 180,
    height: 180,
    borderRadius: "100%",
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    marginBottom: 20,
  },
  largePreview: {
    width: '100%',
    height: '100%',
  },
  settingsLabel: {
    fontFamily: 'Rubik_600SemiBold',
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  settingsInput: {
    width: '100%',
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Rubik_400Regular',
    fontSize: 16,
    color: '#111111',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  settingsInputError: {
    borderColor: '#E53935',
  },
  settingsErrorText: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 13,
    color: '#E53935',
    marginTop: 4,
    textAlign: 'center',
  },
  thumbGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  thumbWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  thumbSelected: {
    borderColor: '#4570FF',
  },
  thumbCheckOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(69,112,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbCheck: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Rubik_700Bold',
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  newCollectionBox: {
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
  newCollectionLabel: {
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
    marginTop: 20,
  },
});