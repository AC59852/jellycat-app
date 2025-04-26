import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";
import { useState, useEffect } from 'react';

interface ProductCardProps {
  name: string;
  image: any; // Replace 'any' with a more specific type if possible, e.g., ImageSourcePropType
  theme: string,
  colour: string
}

const _width  = Dimensions.get('screen').width * 0.44;

const ProductCard = ({ name, image, theme, colour }: ProductCardProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} />
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => alert("this worked")} style={styles.icon}>
            <Image style={styles.heart}/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textWrapper}>
        <View style={styles.tagsWrapper}>
          <Text style={styles.tags}>{theme}, {colour}</Text>
        </View>
        <View style={styles.nameWrapper}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    flex: 0.5,
    marginBottom: _width * 0.1,
  },

  image: {
    width: _width,
    height: _width,
    objectFit: "cover",
    borderRadius: 13,
  },
})

export default ProductCard;