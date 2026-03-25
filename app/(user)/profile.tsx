import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import ProductCard from '@/components/ProductCard';
import CollectionCard from '@/components/CollectionCard';
import { File, Paths } from 'expo-file-system';
import { fetch } from 'expo/fetch';
import { Link } from 'expo-router';
import NewCollectionModal from '@/components/NewCollectionModal';
import { COLLECTION_IMAGES } from '@/constants/collectionImages';

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
  items: string[];
  createdAt: string;
}

export default function ProfileScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.430;

  const tabs = ['Collections', 'Likes'] as const;
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]>('Collections');
  const [collections, setCollections] = useState<CollectionProps[]>([]);
  const [likes, setLikes] = useState<LikeProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const loadCollections = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) { setCollections([]); return; }
      const data = JSON.parse(file.textSync()) as CollectionProps[];
      setCollections(data);
    } catch (err) {
      console.error('Error loading collections:', err);
    }
  }, []);

  const loadLikes = useCallback(async () => {
    try {
      const file = new File(Paths.document, 'likes.json');
      if (!file.exists) { setLikes([]); return; }
      const ids = JSON.parse(file.textSync()) as { id: string }[];
      const sanitizedIds = ids.filter(item => typeof item.id === 'string' && item.id.trim() !== '');
      if (sanitizedIds.length === 0) { setLikes([]); return; }
      const queryIds = sanitizedIds.map(i => i.id).join(',');
      const res = await fetch(`https://jellycat-category-fetch.austin-caron1.workers.dev/likes?ids=${queryIds}`);
      const cloudLikes = await res.json();
      setLikes(cloudLikes);
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
      if (selectedTab === 'Collections') {
        loadCollections();
      } else {
        loadLikes();
      }
    }, [selectedTab, loadCollections, loadLikes])
  );

  return (
    <View style={{ flex: 1 }}>
      <NewCollectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={loadCollections}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image />
          <Text style={styles.greeting}>Hello, User Name</Text>

          {/* TABS */}
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)} style={styles.tab}>
                <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
                {selectedTab === tab && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>My {selectedTab}</Text>
        </View>

        {/* GRID */}
        <View style={styles.grid}>

          {/* Collections tab */}
          {selectedTab === 'Collections' && (
            <>
              {/* New Collection button */}
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

              {/* Saved collections */}
              {collections.map((item) => (
                <Link key={item.id} href={{pathname: '/(user)/collections/[id]', params: {id: item.id}}}>
                  <CollectionCard
                    key={item.id}
                    name={item.name}
                    description={item.description}
                    imageSource={COLLECTION_IMAGES[item.imageIndex]?.image}
                  />
                </Link>
              ))}

              {collections.length === 0 && (
                <Text style={styles.emptyText}>No collections yet</Text>
              )}
            </>
          )}

          {/* Likes tab */}
          {selectedTab === 'Likes' && (
            <>
              {likes.length === 0 ? (
                <Text style={styles.emptyText}>No liked items yet</Text>
              ) : (
                likes.map((item) => (
                  <Link
                    key={item.id}
                    href={{
                      pathname: `/(jellycat)/jellycat/[item]`,
                      params: { item: item.name.toLowerCase().split(' ').join('-') },
                    }}
                  >
                    <ProductCard
                      name={item.name}
                      image={item.image}
                      theme={item.theme}
                      colour={item.colour}
                      id={item.id}
                      onUnlike={() => unlikeItem(item.id)}
                    />
                  </Link>
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
    padding: 20,
  },
  greeting: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 24,
    color: '#111111',
    marginTop: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    marginRight: 24,
    paddingBottom: 10,
    position: 'relative',
  },
  tabText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: '#AAAAAA',
  },
  tabTextActive: {
    color: '#111111',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4570FF',
    borderRadius: 2,
  },
  sectionTitle: {
    fontFamily: 'Rubik_700Bold',
    fontSize: 20,
    color: '#111111',
    marginTop: 20,
  },
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
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Rubik_400Regular',
    color: '#AAAAAA',
    fontSize: 15,
    width: '100%',
  },
});