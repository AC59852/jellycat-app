import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { File, Paths } from 'expo-file-system';
import { fetch } from "expo/fetch";
import { useEffect, useState } from "react";
import HeartSvg from "@/components/HeartSvg";
import BackSvg from "@/components/svgs/BackSvg";
import { SafeAreaView } from "react-native-safe-area-context";
import NewCollectionModal from "@/components/NewCollectionModal";
import SelectCollectionModal from "@/components/SelectCollectionModal";

interface Collection {
  id: string;
  name: string;
  description: string;
  imageIndex: number;
  items: any[];
  createdAt: string;
}

const JellycatDetailsScreen = () => {
  const { item } = useLocalSearchParams();
  const Router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // Modal states
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [showSelectCollectionModal, setShowSelectCollectionModal] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Load liked state from file once when component mounts
  useEffect(() => {
    try {
      const file = new File(Paths.document, 'likes.json');
      if (file.exists) {
        const json = JSON.parse(file.textSync()) as { id: string }[];

        const liked = json.some(likedItem => likedItem.id === item);
        setIsLiked(liked);
      }
    } catch (err) {
      console.error('Error reading likes:', err);
    }
  }, []);

  // Toggle like and write to file
  const toggleLike = () => {
    try {
      const file = new File(Paths.document, 'likes.json');
      let likes: { id: string }[] = [];

      // Load existing likes file
      if (file.exists) {
        likes = JSON.parse(file.textSync());
      }

      if (!isLiked) {
        // LIKE the product
        likes.push({ id: item as string });
        file.write(JSON.stringify(likes));
        setIsLiked(true);
      } else {
        // UNLIKE the product
        likes = likes.filter((likedItem) => likedItem.id !== item);
        file.write(JSON.stringify(likes));
        setIsLiked(false);
      }
    } catch (err) {
      console.error('Error writing like file:', err);
    }
  };

  // Load collections from file
  const loadCollections = () => {
    try {
      const file = new File(Paths.document, 'collection.json');
      if (file.exists) {
        const collectionList = JSON.parse(file.textSync()) as Collection[];
        setCollections(collectionList);
        return collectionList;
      }
      return [];
    } catch (err) {
      console.error('Error loading collections:', err);
      return [];
    }
  };

  // Handle "Add to Collection" button press
  const handleAddToCollection = () => {
    const loadedCollections = loadCollections();
    
    if (loadedCollections.length === 0) {
      // No collections exist - show new collection modal
      setShowNewCollectionModal(true);
    } else {
      // Collections exist - show collection selector
      setShowSelectCollectionModal(true);
    }
  };

  // Handle new collection created
  const handleCollectionCreated = () => {
    setShowNewCollectionModal(false);
    setShowSelectCollectionModal(true);
  };

  // Handle modal close/updates
  const handleCollectionAdded = () => {
    setShowSelectCollectionModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://jellycat-category-fetch.austin-caron1.workers.dev/product?id=${item}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // trim the description where the instance of "I am", or "My name is" is found and past it
        const description = result.description as string;
        const trimIndex = description.indexOf("I am") !== -1 ? description.indexOf("I am") : description.indexOf("My name is");
        if (trimIndex !== -1) {
          result.description = description.substring(0, trimIndex).trim();
        }

        setData(result);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [item]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  if (!data) {
    return <Text>No data found</Text>;
  }

  return (
    <>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.wrapper}>
            <TouchableOpacity style={styles.backButton} onPress={() => Router.back()}>
              <BackSvg />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { toggleLike(); }} style={styles.icon}>
              <HeartSvg filled={isLiked} />
            </TouchableOpacity>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: data.image }} style={styles.image} />
            </View>
            <Text style={styles.title}>{data.name}</Text>
            <Text style={styles.description}>{data.description}</Text>

            {/* Button pinned to bottom */}
            <TouchableOpacity onPress={handleAddToCollection} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add to My Collection</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.moreInfoWrapper}>
            <Text style={[styles.title, styles.titleSmall]}>More Info</Text>
            {/* colours, release date, and category in a horizontal row each with a title and then their descriptor */}
            <View style={{ flexDirection: 'row', marginTop: 20, gap: 25, marginBottom: 80 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Rubik_500Medium', fontSize: 16, color: '#333333' }}>Colours</Text>
                <Text style={{ fontFamily: 'Rubik_400Regular', fontSize: 14, color: '#666666', marginTop: 4 }}>{data.colour}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Rubik_500Medium', fontSize: 16, color: '#333333' }}>Release Date</Text>
                <Text style={{ fontFamily: 'Rubik_400Regular', fontSize: 14, color: '#666666', marginTop: 4 }}>{data.releaseDate}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Rubik_500Medium', fontSize: 16, color: '#333333' }}>Category</Text>
                <Text style={{ fontFamily: 'Rubik_400Regular', fontSize: 14, color: '#666666', marginTop: 4 }}>{data.theme}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* New Collection Modal - shown when user has no collections */}
      <NewCollectionModal
        visible={showNewCollectionModal}
        onClose={() => setShowNewCollectionModal(false)}
        onCreated={handleCollectionCreated}
      />

      {/* Select Collection Modal - tap to add item to collection */}
      <SelectCollectionModal
        visible={showSelectCollectionModal}
        itemData={data}
        onClose={() => setShowSelectCollectionModal(false)}
        onAdded={handleCollectionAdded}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    margin: 'auto'
  },

  scrollContent: {
    flexGrow: 1, // makes scroll fill remaining height
  },

  wrapper: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
  },

  imageWrapper: {
    position: 'relative',
    height: 338,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  title: {
    fontSize: 32,
    fontFamily: 'Rubik_700Bold',
    marginTop: 20,
    color: '#333333',
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Rubik_400Regular',
    marginTop: 12,
    color: '#666666',
  },

  titleSmall: {
    fontSize: 26
  },

  icon: {
    backgroundColor: "#F6F8FA",
    borderRadius: 50,
    padding: 7,
    height: 40,
    width: 40,
    position: 'absolute',
    top: 25,
    right: 10,
    zIndex: 10,
  },

  addButton: {          
    backgroundColor: '#4570FF',
    paddingVertical: 24,
    borderRadius: 4,
    width: '100%',
    marginTop: 28,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Rubik_500Medium',
  },

  moreInfoWrapper: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 40,
  },

  backButton: {
    width: 24,
    height: 24,
    marginTop: 25,
  },
});


export default JellycatDetailsScreen;