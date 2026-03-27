import React from "react";
import { View, Text, Image, StyleSheet, useWindowDimensions, Pressable } from "react-native";
import { Link } from "expo-router";

interface CategoryCardProps {
  name: string;
  image: any; // Replace 'any' with a more specific type if possible, e.g., ImageSourcePropType
}

const CategoryCard = ({ name, image }: CategoryCardProps) => {
  const { width } = useWindowDimensions();
  const _width = (width - 43) / 2;

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
    <Link
      href={{
        pathname: `/(categories)/category/[category]`,
        params: { category: name.toLowerCase().split(' ').join('-') },
      }}
      asChild
    >
      <Pressable style={{ width: _width, marginBottom: _width * 0.1 }}>
        <Image
          source={image}
          style={{
            width: _width,
            height: _width,
            borderRadius: 13,
          }}
        />
        <Text
          style={{
            fontFamily: "Rubik_700Bold",
            fontSize: 18,
            textAlign: "center",
            marginTop: 14,
          }}
          allowFontScaling={false}
        >
          {name}
        </Text>
      </Pressable>
    </Link>
  );
}

export default CategoryCard;