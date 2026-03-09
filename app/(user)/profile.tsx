import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
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

  const loadCollections = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) { setCollections([]); return; }
      const data = JSON.parse(file.textSync()) as DataProps[];
      setCollections(data);
    } catch (err) {
      console.error('Error loading collections:', err);
    }
  }, []);

  const loadLikes = useCallback(async () => {
    try {
      const file = new File(Paths.document, "likes.json");
      if (!file.exists) { setLikes([]); return; }
      const ids = JSON.parse(file.textSync()) as { id: string }[];
      const sanitizedIds = ids.filter(item => typeof item.id === 'string' && item.id.trim() !== '');
      if (sanitizedIds.length === 0) { setLikes([]); return; }
      const queryIds = ids.map(i => i.id).join(",");
      const res = await fetch(`https://jellycat-category-fetch.austin-caron1.workers.dev/likes?ids=${queryIds}`);
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
      const arr = JSON.parse(file.textSync());
      file.write(JSON.stringify(arr.filter((item: any) => item.id !== id)));
      setLikes(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Error updating likes.json:", err);
    }
  };

  useEffect(() => {
    if (selectedTab === 'Collections') {
      loadCollections();
    } else {
      loadLikes();
    }
  }, [selectedTab, loadCollections, loadLikes]);

  const dataToRender = selectedTab === 'Collections' ? collections : likes;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={{ padding: 20 }}>
          <Image />
          <Text>Hello, User Name</Text>

          {/* TABS */}
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
                <Text style={{ marginRight: 20, fontSize: 16, fontWeight: selectedTab === tab ? 'bold' : 'normal' }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ marginTop: 10, fontSize: 20 }}>My {selectedTab}</Text>
        </View>

        {/* GRID */}
        {dataToRender.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No items found</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 14, paddingHorizontal: 15, paddingBottom: 100 }}>
            {dataToRender.map((item) => (
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
                  onUnlike={selectedTab === 'Likes' ? () => unlikeItem(item.id) : undefined}
                />
              </Link>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}