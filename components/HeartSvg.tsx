import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function HeartSvg() {
  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 24 24" fill="none" style={{width: "100%", height: "100%"}}>
        <Path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
          a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78
          1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="none"
          stroke={"#94ADFF"}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
