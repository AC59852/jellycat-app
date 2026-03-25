import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, Link, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { File, Paths } from 'expo-file-system';
import ProductCard from '@/components/ProductCard';
import AddToCollectionModal from '@/components/AddToCollectionModal';

interface ItemProps {
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
  items: ItemProps[];
  createdAt: string;
}

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.430;

  const [collection, setCollection] = useState<CollectionProps | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadCollection = useCallback(() => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (!file.exists) return;
      const all = JSON.parse(file.textSync()) as CollectionProps[];
      const found = all.find(c => c.id === String(id));
      setCollection(found ?? null);
    } catch (err) {
      console.error('Error loading collection:', err);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      loadCollection();
    }, [loadCollection])
  );

  if (!collection) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Collection not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AddToCollectionModal
        visible={modalVisible}
        collectionId={String(id)}
        onClose={() => setModalVisible(false)}
        onUpdated={loadCollection}
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
        <Text style={styles.title}>{collection.name}</Text>
        {collection.description ? (
          <Text style={styles.description}>{collection.description}</Text>
        ) : null}

        <View style={styles.grid}>
          {/* Add Jellycats card — always first */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ width: cardWidth, marginBottom: 15 }}
          >
            <View style={[styles.addBox, { width: cardWidth, height: cardWidth }]}>
              <View style={styles.plusCircle}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
            </View>
            <Text style={styles.addLabel}>Add Jellycats</Text>
          </TouchableOpacity>

          {/* Collection items */}
          {collection.items.map((item) => (
            <Link
              key={item.id}
              href={{
                pathname: '/(jellycat)/jellycat/[item]',
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

          {collection.items.length === 0 && (
            <Text style={styles.emptyText}>
              Add some Jellycats to get started!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Rubik_700Bold',
    textAlign: 'left',
    marginTop: 32,
    marginBottom: 6,
    paddingHorizontal: 15,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Rubik_400Regular',
    color: '#747474',
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    padding: 15,
    paddingBottom: 100,
  },
  addBox: {
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
  addLabel: {
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
    marginTop: 10,
  },
});