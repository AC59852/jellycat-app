import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function SkeletonCard() {
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.430;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth * 1.5, cardWidth * 1.5],
  });

  const Shimmer = () => (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        { transform: [{ translateX }] },
      ]}
    >
      <LinearGradient
        colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      {/* Image box */}
      <View style={[styles.block, { width: cardWidth, height: cardWidth, borderRadius: 13 }]}>
        <Shimmer />
      </View>
      {/* Tag line */}
      <View style={[styles.block, { width: cardWidth * 0.48, height: 11, borderRadius: 6, marginTop: 10 }]}>
        <Shimmer />
      </View>
      {/* Name line */}
      <View style={[styles.block, { width: cardWidth * 0.72, height: 16, borderRadius: 6, marginTop: 7 }]}>
        <Shimmer />
      </View>
    </View>
  );
}

interface SkeletonLoaderProps {
  count?: number;
}

export default function SkeletonLoader({ count = 6 }: SkeletonLoaderProps) {
  return (
    <View style={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    padding: 15,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'column',
  },
  block: {
    backgroundColor: '#EBEBEB',
    overflow: 'hidden',
  },
});