import { useLocalSearchParams, Link } from 'expo-router';
import { fetch } from 'expo/fetch';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import SearchComponent from '@/components/SearchComponent';
import ProductCard from '@/components/ProductCard';
import SkeletonLoader from '@/components/SkeletonLoader';

interface ItemProps {
  name: string;
  image: string;
  theme: string;
  colour: string;
  id: string;
}

export default function SearchScreen() {
  const { query } = useLocalSearchParams();
  const [data, setData] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const pageTitle = query ? `Results for "${query}"` : 'Bunnies';

  const fetchData = async (cursor?: string) => {
    try {
      let url: string;

      if (query) {
        url = `https://jellycat-category-fetch.austin-caron1.workers.dev/search?q=${query}${cursor ? `&cursor=${cursor}` : ''}`;
      } else {
        const API_VERSION = 'v2';
        url = `https://jellycat-category-fetch.austin-caron1.workers.dev?category=bunnies&v=${API_VERSION}${cursor ? `&cursor=${cursor}` : ''}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      const items = Array.isArray(result) ? result : result.items;
      const filtered = items.filter((item: ItemProps) => item.name && item.image);

      setData(prev => cursor ? [...prev, ...filtered] : filtered);
      setNextCursor(result.nextCursor ?? null);
      setHasMore(result.hasMore ?? false);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setData([]);
    setLoading(true);
    setNextCursor(null);
    setHasMore(false);
    fetchData();
  }, [query]);

  const loadMore = () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    fetchData(nextCursor);
  };

  if (error) return <Text>Error: {error}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
        <SearchComponent />
        <Text style={styles.pageTitle}>{pageTitle}</Text>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <>
            <View style={styles.grid}>
              {data.map((item: ItemProps) => (
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
                  />
                </Link>
              ))}
            </View>
            {hasMore && (
              <TouchableOpacity
                onPress={loadMore}
                disabled={loadingMore}
                style={styles.loadMoreButton}
              >
                <Text style={styles.loadMoreText}>
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 30,
    fontFamily: 'Rubik_700Bold',
    width: '90%',
    textAlign: 'left',
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    padding: 15,
    paddingBottom: 40,
  },
  loadMoreButton: {
    paddingVertical: 24,
    backgroundColor: '#4570FF',
    alignItems: 'center',
    width: '90%',
    marginHorizontal: 'auto',
    borderRadius: 4,
    marginBottom: 100,
  },
  loadMoreText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});