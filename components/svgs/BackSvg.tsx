import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function HeartSvg() {
  return (
    <View style={styles.container}>
      <Svg width="20" height="20" viewBox="0 0 15 15" fill="none" style={{width: "100%", height: "100%"}}>
        <Path d="M8.48144 13.04L7.83105 13.6904C7.55566 13.9658 7.11035 13.9658 6.83789 13.6904L1.14258 7.99805C0.867188 7.72266 0.867188 7.27734 1.14258 7.00488L6.83789 1.30957C7.11328 1.03418 7.55859 1.03418 7.83105 1.30957L8.48144 1.95996C8.75976 2.23828 8.75391 2.69238 8.46973 2.96484L4.93945 6.32813H13.3594C13.749 6.32813 14.0625 6.6416 14.0625 7.03125V7.96875C14.0625 8.3584 13.749 8.67188 13.3594 8.67188H4.93945L8.46973 12.0352C8.75684 12.3076 8.76269 12.7617 8.48144 13.04Z" fill="#7E8283" />
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
