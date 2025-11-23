import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

export default function FilterSvg() {
  return (
    <View style={styles.container}>
      <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{width: "100%", height: "100%"}}>
        <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" fill="#7E8283" />
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

{/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg> */}
