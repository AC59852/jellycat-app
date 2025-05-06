import { View, Text, TextInput, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";

const SearchComponent = () => {
  return (
  <View style={styles.container}>
    <View style={styles.imageWrapper}>
      <Link href={"/"} style={styles.backButton}>
        <Image source={require("@/assets/icons/arrow-left.svg")} style={styles.back} />
      </Link>
    </View>
    <View style={styles.searchWrapper}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for Jellycats..."
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

const styles = StyleSheet.create({})

export default SearchComponent;