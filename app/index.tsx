import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import 'react-native-svg';
import { Link } from "expo-router";
import { BlurView } from 'expo-blur';
import LatestList from '@/components/LatestList';
import CommunityCard from '@/components/CommunityCard';
import CategoryCard from '@/components/CategoryCard';
import CtaSignup from '@/components/CtaSignup';
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const text = "Find Your Perfect Companion!";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  // Parallax only within the hero section
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollOffset.value * 0.2 }],
  }));

  // Brightness overlay: darkens image as you scroll down
  const brightnessOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [0, 300],       // scroll range
      [0, 0.5],       // overlay opacity range (0 = none, 0.5 = noticeable darkening)
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const categories = [
    { name: "Bunnies", image: require('@/assets/images/bunnies-categories.png') },
    { name: "Bears", image: require('@/assets/images/bears-categories.png') },
    { name: "Amuseables", image: require('@/assets/images/amuseables-categories.png') },
    { name: "Bashfuls", image: require('@/assets/images/bashfuls-categories.png') },
    { name: "Nature", image: require('@/assets/images/nature-categories.png') },
    { name: "Sea Creatures", image: require('@/assets/images/sea-creatures-categories.png') },
  ];

  const { height } = useWindowDimensions();
  const heroHeight = height * 0.75; // Match the hero section height

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },

    hero: {
      height: heroHeight,
      overflow: 'hidden', // contains the image
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      marginBottom: 20,
    },

    heroImageWrapper: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
    },

    heroImage: {
      width: '100%',
      height: '100%'
    },

    // This is what we animate for brightness
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black', // change to 'white' to simulate brightening instead
    },

    blurContainer: {
      position: 'absolute',
      bottom: 20,
      left: 15,
      width: '85%',
      borderRadius: 13,
      padding: 14,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },

    title: {
      fontFamily: 'Rubik_700Bold',
    },

    heroTitle: {
      fontSize: 30,
      color: 'white',
    },

    headingSmall: {
      fontSize: 28,
      marginLeft: 15,
    },

    categoriesList: {
      width: '93%',
      marginTop: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      alignSelf: 'center',
    },

    button: {
      fontFamily: "Rubik_600SemiBold",
      fontSize: 18,
      textAlign: "center",
      color: "white",
      backgroundColor: "#4570FF",
      paddingVertical: 20,
      borderRadius: 4,
      textDecorationLine: "none",
      width: "100%",
      marginHorizontal: "auto",
      marginTop: 5,
    },
  });

  return (
    <View style={{ flex: 1 }}>
    <Animated.ScrollView
      style={styles.container}
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroImageWrapper}>
          <Animated.Image
            source={require('@/assets/images/hero.jpg')}
            style={[styles.heroImage, imageAnimatedStyle]}
            resizeMode="cover"
            accessible
            accessibilityLabel="Two Jellycat hearts arranged in a car at a drive-in theater for Valentine's Day"
          />

          {/* Brightness overlay */}
          <Animated.View
            pointerEvents="none"
            style={[styles.heroOverlay, brightnessOverlayStyle]}
          />
        </View>

        <View
          style={styles.blurContainer}
        >
          <Text style={[styles.title, styles.heroTitle]}>{text}</Text>
        </View>
      </View>

      {/* Rest of the scroll content */}
      <View style={{ marginTop: 51 }}>
        <Text style={[styles.title, styles.headingSmall]}>Latest In</Text>
        <LatestList />
      </View>

      <View style={{ marginTop: 59 }}>
        <CommunityCard />
      </View>

      <View style={{ marginTop: 59 }}>
        <Text style={[styles.title, styles.headingSmall]}>
          Find Jellycats Based on Category:
        </Text>
        <View style={styles.categoriesList}>
          {categories.map((item, index) => (
            <CategoryCard key={index} name={item.name} image={item.image} />
          ))}
        </View>
        <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
          <Link href="/(categories)/all" style={styles.button}>
            <Text>View All</Text>
          </Link>
        </View>
      </View>

      <View>
        <CtaSignup />
      </View>
    </Animated.ScrollView>
    </View>
  );
}
