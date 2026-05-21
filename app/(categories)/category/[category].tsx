import { useLocalSearchParams, Link } from 'expo-router';
import { fetch } from 'expo/fetch';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useMemo } from 'react';
import SearchComponent from '@/components/SearchComponent';
import ProductCard from '@/components/ProductCard';
import SkeletonLoader from '@/components/SkeletonLoader';
import FilterModal, { FilterState, DEFAULT_FILTERS } from '@/components/FilterModal';

interface ItemProps {
  name: string;
  image: string;
  theme: string;
  colour: string;
  id: string;
  size?: string;
}

export default function DetailsScreen() {
  const { category, query } = useLocalSearchParams();

  const [data, setData] = useState<ItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const formattedCategory = category
    ? String(category)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char: string) => char.toUpperCase())
    : '';

  const pageTitle = query 
    ? `Results for "${query}" in ${formattedCategory}`
    : formattedCategory;

  const fetchData = async (cursor?: string) => {
    try {
      let url: string;

      if (query) {
        // Search within the category
        url = `https://jellycat-category-fetch.austin-caron1.workers.dev/search?q=${query}&category=${category}${
          cursor ? `&cursor=${cursor}` : ''
        }`;
      } else {
        // Fetch category data
        const API_VERSION = 'v2';
        url = `https://jellycat-category-fetch.austin-caron1.workers.dev?category=${category}&v=${API_VERSION}${
          cursor ? `&cursor=${cursor}` : ''
        }`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      const items = Array.isArray(result) ? result : result.items;

      const filtered = items
        .filter((item: ItemProps) => item.name && item.image)
        .map((item: any) => ({
          ...item,
          theme: item.theme ?? item.category ?? null,
          colour: item.colour ?? item.color ?? null
        }));

      setData((prev) => (cursor ? [...prev, ...filtered] : filtered));
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
  }, [category, query]);

  const loadMore = () => {
    if (!hasMore || loadingMore || !nextCursor) return;
    setLoadingMore(true);
    fetchData(nextCursor);
  };

  const normalizeColour = (colour?: string): string[] => {
    if (!colour) return [];

    const c = colour.toLowerCase();

    const map: Record<string, string[]> = {
      red: ['red'],
      blue: ['blue'],
      green: ['green'],
      yellow: ['yellow'],
      orange: ['orange'],
      brown: ['brown', 'beige', 'tan'],
      white: ['white', 'cream', 'ivory'],
      gray: ['gray', 'grey', 'silver'],
      black: ['black'],
      pink: ['pink'],
      purple: ['purple', 'lilac'],
    };

    return Object.entries(map)
      .filter(([key, values]) =>
        values.some(v => c.includes(v))
      )
      .map(([key]) => key);
  };

  // Client-side filtering
  const filteredData = useMemo(() => {
    let result = [...data];

    if (activeFilters.category) {
      result = result.filter(item =>
        item.theme?.toLowerCase() === activeFilters.category!.toLowerCase()
      );
    }

    if (activeFilters.sizes.length > 0) {
      result = result.filter(item =>
        activeFilters.sizes.some(s =>
          item.name?.toLowerCase().includes(s.toLowerCase()) ||
          item.size?.toLowerCase() === s.toLowerCase()
        )
      );
    }

    if (activeFilters.colours.length > 0) {
      result = result.filter(item => {
        const normalized = normalizeColour(item.colour);

        return activeFilters.colours.some(c =>
          normalized.includes(c.toLowerCase())
        );
      });
    }

    if (activeFilters.sort === 'A - Z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (activeFilters.sort === 'Z - A') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [data, activeFilters]);

  const hasActiveFilters =
    activeFilters.category !== null ||
    activeFilters.sort !== null ||
    activeFilters.sizes.length > 0 ||
    activeFilters.colours.length > 0;

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
      >
        <SearchComponent onFilterPress={() => setFilterVisible(true)} hasActiveFilters={hasActiveFilters} />

        <Text style={styles.pageTitle}>{pageTitle}</Text>

        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <>
            <View style={[styles.grid, { paddingBottom: hasMore ? 40 : 120 }]}>
              {filteredData.map((item: ItemProps) => (
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

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setActiveFilters}
        initial={activeFilters}
      />
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
  },

  loadMoreButton: {
    paddingVertical: 24,
    backgroundColor: '#4570FF',
    alignItems: 'center',
    width: '90%',
    marginHorizontal: 'auto',
    borderRadius: 4,
    marginBottom: 120,
  },

  loadMoreText: {
    fontFamily: 'Rubik_500Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});