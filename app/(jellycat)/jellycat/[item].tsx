import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button } from "react-native";
import { fetch } from "expo/fetch";
import { useEffect, useState } from "react";
import HeartSvg from "@/components/HeartSvg";

const JellycatDetailsScreen = () => {
  const { item } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: data.image }} style={styles.image} />
          <TouchableOpacity onPress={() => alert("this worked")} style={styles.icon}>
            <HeartSvg />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.description}>{data.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: "auto",
    width: '90%'
  },

  imageWrapper: {
    position: 'relative',
    marginTop: 60,
  },

  image: {
    width: '100%',
    height: 338,
  },

  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  title: {
    fontSize: 34,
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

  icon: {
    backgroundColor: "#F6F8FA",
    borderRadius: 50,
    padding: 7,
    height: 40,
    width: 40,
    position: 'absolute',
    top: 20,
    right: 10,
  },
});

export default JellycatDetailsScreen;