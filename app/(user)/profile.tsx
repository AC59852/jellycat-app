import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { File, Paths } from 'expo-file-system';
import { fetch } from 'expo/fetch';
import { Link } from 'expo-router';

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

  // -----------------------------
  // LOAD COLLECTIONS
  // -----------------------------
  const loadCollections = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');

      if (!file.exists) {
        setCollections([]);
        return;
      }

      const data = JSON.parse(file.textSync()) as DataProps[];
      setCollections(data);

    } catch (err) {
      console.error('Error loading collections:', err);
    }
  }, []);

  // -----------------------------
  // LOAD LIKES FROM Cloudflare
  // -----------------------------
  const loadLikes = useCallback(async () => {
    try {
      const file = new File(Paths.document, "likes.json");

      if (!file.exists) {
        setLikes([]);
        return;
      }

      // read the saved local data
      const ids = JSON.parse(file.textSync()) as { id: string }[];

      // sanitize the array
      const sanitizedIds = ids.filter(item => typeof item.id === 'string' && item.id.trim() !== '');

      if (sanitizedIds.length === 0) {
        setLikes([]);
        return;
      }

      // Build query using comma separated ids
      const queryIds = ids.map(i => i.id).join(",");
      const url = `https://jellycat-category-fetch.austin-caron1.workers.dev/likes?ids=${queryIds}`;

      const res = await fetch(url);
      const text = await res.text(); // get raw for debugging
      console.log("Likes fetch response:", text);

      // parse JSON result
      const cloudLikes = JSON.parse(text);
      setLikes(cloudLikes);

    } catch (err) {
      console.error("Error fetching likes:", err);
    }
  }, []);

  // -----------------------------
  // UNLIKE LOCAL + REMOVE FROM UI
  // -----------------------------
  const unlikeItem = async (id: string) => {
    try {
      const file = new File(Paths.document, "likes.json");

      if (!file.exists) return;

      const arr = JSON.parse(file.textSync());
      const newArr = arr.filter((item: any) => item.id !== id);

      // write updated array
      file.write(JSON.stringify(newArr));

      // remove instantly from UI
      setLikes(prev => prev.filter(item => item.id !== id));

    } catch (err) {
      console.error("Error updating likes.json:", err);
    }
  };

  // -----------------------------
  // LOAD DATA WHEN TAB SWITCHES
  // -----------------------------
  useEffect(() => {
    if (selectedTab === 'Collections') {
      loadCollections();
    } else {
      loadLikes();
    }
  }, [selectedTab, loadCollections, loadLikes]);

  // Choose which list to show
  const dataToRender =
    selectedTab === 'Collections' ? collections : likes;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <View style={{ flex: 1 }}>

      {/* HEADER */}
      <View style={{ padding: 20 }}>
        <Image />
        <Text>Hello, User Name</Text>

        {/* TABS */}
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
            >
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
          <Link href={{
            pathname: `/(jellycat)/jellycat/[item]`,
            params: { item: item.name.toLowerCase().split(' ').join('-') },
          }}>
            <ProductCard
              name={item.name}
              image={item.image}
              theme={item.theme}
              colour={item.colour}
              id={item.id}
              key={item.id}
              onUnlike={selectedTab === 'Likes' ? () => unlikeItem(item.id) : undefined}
            />
          </Link>
        )}
        keyExtractor={(item) => item.id}
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
