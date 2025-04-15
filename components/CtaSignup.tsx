import { View, Text, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function CtaSignup() {

  return (
    <View style={styles.container}>
      <View>
        <Image source={require("../assets/images/bunny-coffee-running.png")} style={styles.image} />
      </View>
      <View style={{ display: "flex", flexDirection: 'column', gap: 13, marginTop: 40 }}>
        <Text style={[styles.text, styles.heading]}>Sign Up for Even More Amazing Perks!</Text>
        <Text style={[styles.text, styles.paragraph]}>Create a wishlist, scan Jellycats from a photo, checklist ones you already own, and so much more!</Text>
      </View>
      <Link href="/" style={styles.button}>
        <Text>Sign Up</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    width: "97%",
    margin: "auto", 
    marginTop: 59,
    marginBottom: 40
  },

  image: {
    width: "100%",
    height: 256,
    objectFit: "cover",
    borderRadius: 13,
  },
  
  text: {
    textAlign: "center",
    margin: "auto"
  },

  heading: {
    fontFamily: "Rubik_700Bold",
    fontSize: 28,
    color: "#121212",
  },

  paragraph: {
    fontFamily: "Rubik_500Medium",
    fontSize: 14,
    width: "85%",
    color: "#121212",
    lineHeight: 18,
  },

  button: {
    fontFamily: "Rubik_600SemiBold",
    fontSize: 18,
    textAlign: "center",
    color: "white",
    backgroundColor: "#4570FF",
    paddingVertical: 21,
    borderRadius: 4,
    textDecorationLine: "none",
    width: "60%",
    marginHorizontal: "auto",
    marginTop: 27
  }

})