import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import BackSvg from "./svgs/BackSvg.tsx";
import { useState } from "react";

const SearchComponent = () => {
  return (
  <View style={styles.container}>
    <View style={styles.imageWrapper}>
      <Link href={"/"} style={styles.backButton}>
        <BackSvg />
      </Link>
    </View>
    <View style={styles.searchWrapper}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        placeholderTextColor="#A0A0A0"
      />
      <Link href={"/"} style={styles.searchButton}>
        <Image source={require("@/assets/icons/search.svg")} style={styles.search} />
      </Link>
    </View>
    <View style={styles.filterWrapper}>
      <Image source={require("@/assets/icons/filter.svg")} style={styles.filterButton} />
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: "blue",
    width: "90%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imageWrapper: {
    width: 25,
    height: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    width: 25,
    height: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  searchWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }
})

export default SearchComponent;