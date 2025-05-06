import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Svg, {Path} from 'react-native-svg';
import { Link } from "expo-router";
import { useState, useEffect } from 'react';
import HeartSvg from "./HeartSvg";

interface ProductCardProps {
  name: string;
  image: any; // Replace 'any' with a more specific type if possible, e.g., ImageSourcePropType
  theme: string,
  colour: string
}

const _width  = Dimensions.get('screen').width * 0.435;

const ProductCard = ({ name, image, theme, colour }: ProductCardProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={() => alert("this worked")} style={styles.icon}>
            <HeartSvg />
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
    width: _width,
    display: "flex",
    flexDirection: "column",
    flex: 0.5,
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 13,
  },

  imageWrapper: {
    width: _width,
    height: _width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#EEF0F2",
    borderWidth: 1,
    borderRadius: 13,
  },

  iconWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#F6F8FA",
    borderRadius: 50,
    padding: 5,
    height: 30,
    width: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    width: 20,
    height: 20,
  },

  heart: {
    width: 20,
    height: 20,
  },

  textWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 8,
    width: _width
  },

  tagsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tags: {
    fontSize: 10,
    color: "#747474",
  },

  nameWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontFamily: "Rubik_600SemiBold",
    color: "#333",
  },
})

export default ProductCard;