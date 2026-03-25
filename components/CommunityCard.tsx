import { Link } from "expo-router";
import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";

const CommunityCard = () => {
  return (
    <ImageBackground
      source={require("../assets/images/bunny-coffee-running.png")}
      style={styles.card}
      imageStyle={styles.image}
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>See What the Community is up to!</Text>
        <Link href="/" style={styles.button}>Coming Soon!</Link>
      </View>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  card: {
    width: "97%",
    aspectRatio: 1.5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  image: {
    borderRadius: 13,
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
  },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: 13,
  justifyContent: "center",
  alignItems: "center",
  gap: 24,
},
});

export default CommunityCard;