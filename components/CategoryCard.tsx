import React from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions } from "react-native";
import { Link } from "expo-router";

interface CategoryCardProps {
  name: string;
  image: any; // Replace 'any' with a more specific type if possible, e.g., ImageSourcePropType
}

const CategoryCard = ({ name, image }: CategoryCardProps) => {
  const { width } = useWindowDimensions();
  const _width = width * 0.45;

  const styles = StyleSheet.create({

  categoryCard: {
    width: _width,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: _width * 0.1,
  },

  categoryImg: {
    width: _width,
    height: _width,
    objectFit: "cover",
    borderRadius: 13,
  },

  heading: {
    fontFamily: "Rubik_700Bold",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  }

});

  return (
    <Link href={{
      pathname: `/(categories)/category/[category]`, // Use the correct path for your app
      params: { category: name.toLowerCase().split(' ').join('-') }, // Pass the category name as a parameter
    }} style={styles.categoryCard}>
      <View style={{ width: "100%"}}>
        <Image source={image} style={styles.categoryImg} />
      </View>
      <View style={{width: "100%"}}>
        <Text style={styles.heading}>{name}</Text>
      </View>
    </Link>
  );
}

export default CategoryCard;