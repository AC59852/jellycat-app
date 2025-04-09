import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Link } from "expo-router";

interface CategoryCardProps {
  name: string;
  image: any; // Replace 'any' with a more specific type if possible, e.g., ImageSourcePropType
}

const _width  = Dimensions.get('screen').width * 0.44

const CategoryCard = ({ name, image }: CategoryCardProps) => {
  return (
    <Link href={{
      pathname: `/(categories)/[id]`, // Use the correct path for your app
      params: { id: name.toLowerCase() }, // Pass the category name as a parameter
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

const styles = StyleSheet.create({

  categoryCard: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    flex: 0.5,
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
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  }

});

export default CategoryCard;