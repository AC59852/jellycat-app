import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import BackSvg from "./svgs/BackSvg";
import { useState } from "react";
import FilterSvg from "./svgs/FilterSvg";

const SearchComponent = () => {
  const Router = useRouter();

  return (
  <View style={styles.container}>
    <View style={styles.imageWrapper}>
      <TouchableOpacity style={styles.backButton} onPress={() => Router.back()}>
        <BackSvg />
      </TouchableOpacity>
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
    <View style={styles.imageWrapper}>
      <FilterSvg />
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    // backgroundColor: "blue",
    width: "95%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 17,
    alignItems: "center",
    alignSelf: "center",
  },

  imageWrapper: {
    width: 17,
    height: 17,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  backButton: {
    width: 17,
    height: 17,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  searchWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F8FA",
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 288,
    borderColor: '#EEF0F2',
    borderWidth: 1,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 8,
    textAlignVertical: 'center',
    marginHorizontal: 'auto',
    fontFamily: 'Rubik_400Regular',
    fontSize: 14,
    color: '#000000',
  },

  searchButton: {
    marginLeft: 8,
  },

  searchIcon: {
    width: 16,
    height: 16,
    resizeMode: "contain",
  },
})

export default SearchComponent;