import {useEffect, useState} from "react";
import { View, Text, Image, FlatList, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

const LatestList = () => {
  const [data, setData] = useState<Array<{ title: string; image: string }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jellycat-category-fetch.austin-caron1.workers.dev/recents');
        const result = await response.json();
        setData(result);

        console.log("Fetched latest items:", result);
      } catch (error) {
        console.error("Error fetching latest items:", error);
      }
    };

    fetchData();
  }, []);

  const styles = StyleSheet.create({
  container: {
    width: '100%', // Ensure the FlatList takes full width
    marginTop: 12,
    paddingBottom: 16,
  },

  imageWrapper: {
    width: '100%',
    height: 194,
    boxShadow: '0px 6px 10px -4px rgba(0, 0, 0, 0.25)',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEF0F2',
    borderRadius: 13,
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 13,
  },

  text: {
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    marginTop: 14,
    textAlign: 'center',
  }
});

  return (
    <FlatList
      data={data}
      horizontal={true}
      style={styles.container}
      contentContainerStyle={{ gap: 14, paddingLeft: 15, paddingRight: 15 }} // Adjust paddingLeft here
      keyExtractor={(item) => item.title}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: `/(jellycat)/jellycat/[item]`,
            params: { item: item.title.toLowerCase().split(' ').join('-') },
          }}
          asChild
        >
          <Pressable style={{ width: 163 }}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
            </View>

            <Text
              style={styles.text}
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
};

export default LatestList;