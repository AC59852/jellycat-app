import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { File, Paths } from 'expo-file-system';
import { fetch } from 'expo/fetch';

interface DataProps {
  name: string;
  image: string;
  theme: string;
  colour: string;
  id: string;
}

export default function ProfileScreen() {
  const tabs = ['Collections', 'Likes'] as const;
  const [selectedTab, setSelectedTab] = useState<typeof tabs[number]>('Collections');

  const [collections, setCollections] = useState<DataProps[]>([]);
  const [likes, setLikes] = useState<DataProps[]>([]);

  // --- Loaders for each file ---
  const loadCollections = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (file.exists) {
        const data = JSON.parse(file.textSync()) as DataProps[];
        setCollections(data);
      }
    } catch (err) {
      console.error('Error loading collections:', err);
    }
  }, []);

  const loadLikes = useCallback(async () => {
  try {
    const file = new File(Paths.document, 'likes.json');
    if (!file.exists) {
      setLikes([]);
      return;
    }

    const ids = JSON.parse(file.textSync()) as { id: string }[];
    if (ids.length === 0) {
      setLikes([]);
      return;
    }

    // Build URL: /likes?ids=a,b,c
    const url = `https://jellycat-category-fetch.austin-caron1.workers.dev/likes?ids=${ids
      .map(i => i.id)
      .join(",")}`;

    const res = await fetch(url);
    const cloudLikes = await res.json();

    setLikes(cloudLikes);

  } catch (err) {
    console.error("Error fetching likes:", err);
  }
}, []);

const unlikeItem = async (id: string) => {
  try {
    const file = new File(Paths.document, "likes.json");

    if (!file.exists) return;

    const raw = file.textSync();
    const arr = JSON.parse(raw);

    const newArr = arr.filter((item: any) => item.id !== id);

    // write new file
    file.write(JSON.stringify(newArr));

    // instantly remove from UI
    setLikes(prev => prev.filter(item => item.id !== id));

  } catch (err) {
    console.error("Error updating likes.json:", err);
  }
};

  // --- Run specific loader when tab changes ---
  useEffect(() => {
    if (selectedTab === 'Collections') {
      loadCollections();
    } else if (selectedTab === 'Likes') {
      loadLikes();
    }
  }, [selectedTab, loadCollections, loadLikes]);

  // Choose which data to show
  const dataToRender =
    selectedTab === 'Collections' ? collections : likes;

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={{ padding: 20 }}>
        <Image />
        <Text>Hello, User Name</Text>

        {/* TABS */}
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text
                style={{
                  marginRight: 20,
                  fontSize: 16,
                  fontWeight: selectedTab === tab ? 'bold' : 'normal',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={{ marginTop: 10, fontSize: 20 }}>
          My {selectedTab}
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={dataToRender}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            image={item.image}
            theme={item.theme}
            colour={item.colour}
            id={item.id}
            key={item.id}
            onUnlike={selectedTab === 'Likes' ? () => unlikeItem(item.id) : undefined}
          />
        )}
        keyExtractor={(item) => item.name}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>
            No items found
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
