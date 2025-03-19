import { View, Text, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';

export default function HomeScreen() {
  const text = "Welcome, Year of the Snake";
  return (
    <View>
      <View style={styles.hero}>
        <Image source={require('../assets/images/year-of-the-snake.png')} style={styles.heroImage} />
          <BlurView style={styles.blurContainer} intensity={100} tint="dark" experimentalBlurMethod='dimezisBlurView' blurReductionFactor={8}>
            <Text style={{
                fontFamily: 'Rubik_700Bold',
                fontSize: 32,
                zIndex: 1,
                color: 'white'
              }}>{text}</Text>
          </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  hero: {
    height: '85%',
    position: 'relative',
    display: 'flex',   
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
  }
});
