import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import LatestList from '@/components/LatestList';
import CommunityCard from '@/components/CommunityCard';

export default function HomeScreen() {
  const text = "Welcome, Year of the Snake";

  return (
    <ScrollView style={{height: '100%', backgroundColor: "#fff"}} contentContainerStyle={{flexGrow: 1}}>
      <View style={styles.hero}>
        <Image source={require('../assets/images/year-of-the-snake.png')} style={styles.heroImage} />
        <BlurView style={styles.blurContainer} intensity={100} tint="dark">
          <Text style={[styles.title, styles.heroTitle]}>{text}</Text>
        </BlurView>
      </View>
      <View style={{ marginTop: 51 }}>
        <Text style={[styles.title, styles.headingSmall]}>Latest In</Text>
        <LatestList />
      </View>
      <View style={{ marginTop: 51 }}>
        <CommunityCard />
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
  }
});
