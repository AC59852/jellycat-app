import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import data from "@/assets/jellycat-data.json";

const LatestList = () => {
  return (
    <FlatList
      data={data}
      horizontal={true}
      style={styles.container}
      contentContainerStyle={{ gap: 14, paddingLeft: 15, paddingRight: 15 }} // Adjust paddingLeft here
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <View style={{ width: 163 }}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
            />
          </View>
          <View style={{display: 'flex', justifyContent: 'center' }}>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%', // Ensure the FlatList takes full width
    marginTop: 12
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

export default LatestList;