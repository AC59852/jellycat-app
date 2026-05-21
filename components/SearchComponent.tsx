import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import BackSvg from "./svgs/BackSvg";
import { useState } from "react";
import FilterSvg from "./svgs/FilterSvg";

interface SearchComponentProps {
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
}

const SearchComponent = ({ onFilterPress, hasActiveFilters }: SearchComponentProps) => {
  const Router = useRouter();
  const [text, setText] = useState("");

  const pushToSearch = (query: string) => {
    return () => {
      if (query.trim().length > 0) {
        Router.push({
          pathname: "/search",
          params: { query: query },
        });
      }
    };
  };

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
          onSubmitEditing={pushToSearch(text)}
          onChangeText={setText}
        />
        <Link href={"/"} style={styles.searchButton}>
          <Image source={require("@/assets/icons/search.svg")} />
        </Link>
      </View>
      <TouchableOpacity style={styles.filterButtonWrapper} onPress={onFilterPress} activeOpacity={0.7}>
        <FilterSvg />
        {hasActiveFilters && <View style={styles.filterDot} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
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

  filterButtonWrapper: {
    width: 17,
    height: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  filterDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4570FF',
  },
});

export default SearchComponent;