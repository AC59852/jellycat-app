import { useLocalSearchParams, Link } from 'expo-router';
import { fetch } from 'expo/fetch';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import SearchComponent from '@/components/SearchComponent';
import ProductCard from '@/components/ProductCard';

export default function DetailsScreen() {
  const { query } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (query) {
          response = await fetch(`https://jellycat-category-fetch.austin-caron1.workers.dev/search?q=${query}`);
        } else {
          response = await fetch(`https://jellycat-category-fetch.austin-caron1.workers.dev?category=bunnies`);
        }
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
  }, [query]);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error}</Text>;
  }
  if (!data) {
    return <Text>No data found</Text>;
  }

  const renderItem = ({ item }: { item: { name: string; image: string, theme: string, colour: string } }) => {
    return (
      <Link href={{
        pathname: `/(jellycat)/jellycat/[item]`,
        params: { item: item.name.toLowerCase().split(' ').join('-') },
      }}>
        <ProductCard
          name={item.name}
          image={item.image}
          theme={item.theme}
          colour={item.colour}
          id={item.name.toLowerCase().split(' ').join('-')}
        />
      </Link>
    );
  };

  return (
    <View style={styles.container}>
      {/* add a flatlist using the data grabbed from the fetch and category card */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={{ padding: 15, gap: 14, paddingBottom: 120 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // Adjust spacing between columns
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        style={{ width: '100%' }} // Ensure the FlatList takes full width
        ListHeaderComponent={
          <View>
            <SearchComponent />
            <Text style={{fontSize: 30, fontFamily: 'Rubik_700Bold', width: '90%', textAlign: 'left', marginTop: 32  }}>Search Results For: {query ? query : 'Bunnies'}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
});
