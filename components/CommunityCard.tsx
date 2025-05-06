import { Link } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const CommunityCard = () => {
  return (
    <View style={{ width: "97%", height: 252, position: "relative", margin: "auto" }}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../assets/images/bunny-coffee-running.png")}
          style={styles.image}
        />
      </View>
      <View style={{ display: "flex", flexDirection: 'column', justifyContent: "center", alignItems: 'center', height: "100%", gap: 24 }}>
        <Text style={styles.text}>See What the Community is up to!</Text>
        <Link
          href="/"
          style={styles.button}
          >Explore</Link>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  imageWrapper: {
    width: "100%",
    height: 242,
    position: "absolute",
    top: 0,
    left: 0,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 13,
    filter: "brightness(0.60)",
  },

  text: {
    fontFamily: "Rubik_700Bold",
    fontSize: 28,
    width: "95%",
    textAlign: "center",
    color: "white",
  },

  button: {
    fontFamily: "Rubik_600SemiBold",
    fontSize: 16,
    textAlign: "center",
    color: "white",
    backgroundColor: "#4570FF",
    paddingVertical: 12,
    borderRadius: 4,
    textDecorationLine: "none",
    width: "48%",
    marginHorizontal: "auto",
  }
});

export default CommunityCard;