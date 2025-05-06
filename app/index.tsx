import { ScrollView, View, Text, StyleSheet, Image, FlatList } from 'react-native';
import 'react-native-svg';
import { Link } from "expo-router";
import { BlurView } from 'expo-blur';
import LatestList from '@/components/LatestList';
import CommunityCard from '@/components/CommunityCard';
import CategoryCard from '@/components/CategoryCard';
import CtaSignup from '@/components/CtaSignup';

export default function HomeScreen() {
  const text = "Welcome, Year of the Snake";

  const categories = [
    { name: "Bunnies", image: require('@/assets/images/bunnies-categories.png') },
    { name: "Bears", image: require('@/assets/images/bears-categories.png') },
    { name: "Amuseables", image: require('@/assets/images/amuseables-categories.png') },
    { name: "Bashfuls", image: require('@/assets/images/bashfuls-categories.png') },
    { name: "Nature", image: require('@/assets/images/nature-categories.png') },
    { name: "Sea Creatures", image: require('@/assets/images/sea-creatures-categories.png') },
  ]

  const renderItem = ({ item }) => {
    return (
      <CategoryCard name={item.name} image={item.image} />
    )
  }

  return (
    <ScrollView style={{height: '100%', backgroundColor: "#fff"}} contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.hero}>
        <Image source={require('@/assets/images/year-of-the-snake.png')} style={styles.heroImage} />
        <BlurView style={styles.blurContainer} intensity={100} tint="dark">
          <Text style={[styles.title, styles.heroTitle]}>{text}</Text>
        </BlurView>
      </View>
      <View style={{ marginTop: 51 }}>
        <Text style={[styles.title, styles.headingSmall]}>Latest In</Text>
        <LatestList />
      </View>
      <View style={{ marginTop: 59 }}>
        <CommunityCard />
      </View>
      <View style={{ marginTop: 59 }}>
        <Text style={[styles.title, styles.headingSmall]}>Find Jellycats Based on Category:</Text>
        <View style={styles.categoriesList}>
          <FlatList
            numColumns={2}
            data={categories}
            renderItem={renderItem}
          />
        </View>
        <View style={{paddingHorizontal: 15, marginBottom: 20}}>
          <Link href="/" style={styles.button}>
            <Text>View All</Text>
          </Link>
        </View>
      </View>
      <View>
        <CtaSignup />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  hero: {
    height: 600,
    position: 'relative',
    display: 'flex',
    flex: 1   
  },

  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  
  blurContainer: {
    width: '85%',
    borderRadius: 13,
    position: 'relative',
    marginTop: 'auto',
    marginLeft: 15,
    marginBottom: 20,
    padding: 14,
    boxSizing: 'border-box',
    overflow: 'hidden',
    zIndex: 1,
  },

  title: {
    fontFamily: 'Rubik_700Bold'
  },

  heroTitle: {
    fontSize: 32,
    zIndex: 1,
    color: 'white'
  },

  headingSmall: {
    fontSize: 30,
    marginLeft: 15
  },

  categoriesList: {
    width: '100%',
    marginTop: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
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
    marginTop: 5
  }
});
