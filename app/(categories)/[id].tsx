import { useLocalSearchParams } from 'expo-router';
import { fetch } from 'expo/fetch';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import CategoryCard from '@/components/CategoryCard';
import SearchComponent from '@/components/SearchComponent';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jellycat-category-fetch.austin-caron1.workers.dev?category=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error}</Text>;
  }
  if (!data) {
    return <Text>No data found</Text>;
  }

  const renderItem = ({ item }: { item: { name: string; image: string } }) => {
    return (
      <CategoryCard name={item.name} image={{ uri: item.image }} />
    );
  };

  return (
    <View style={styles.container}>
      <SearchComponent />
      {/* add a flatlist using the data grabbed from the fetch and category card */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={{ padding: 15, gap: 14 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Adjust spacing between columns
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
