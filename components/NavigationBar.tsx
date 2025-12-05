import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { Link, usePathname } from 'expo-router';

export default function NavigationBar() {
  const pathname = usePathname();

  // alert(pathname);

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbarWrapper}>
        {/* Blur layer */}
       

        {/* Dark overlay on top of blur */}
        <View style={styles.overlay} />

        {/* Content */}
        <Link href='/'>
          <View style={[styles.navIcon, pathname === '/' && {filter: "brightness(1)", backgroundColor: '#4570FF'}]}>
            <Image source={require('../assets/icons/homeIcon.png')} style={{width: 24, height: 26}} />
          </View>
        </Link>

        <Link href='/search'>
          <View style={[styles.navIcon, (pathname.startsWith('/jellycat') || pathname.startsWith('/category') || pathname.startsWith('/search')) && {filter: "brightness(1)", backgroundColor: '#4570FF'}]}>
            <Image source={require('../assets/icons/searchIcon.png')} style={{width: 24, height: 26}} />
          </View>
        </Link>

        <Link href='/'>
          <View style={styles.navIcon}>
            <Image source={require('../assets/icons/homeIcon.png')} style={{width: 24, height: 26}} />
          </View>
        </Link>

        <Link href='/profile'>
          <View style={styles.navIcon}>
            <Image source={require('../assets/icons/homeIcon.png')} style={{width: 24, height: 26,}} />
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: 'center',
    backgroundColor: "transparent",
    zIndex: 1000,
  },

  navbarWrapper: {
    height: 65,
    borderRadius: 300,
    overflow: 'hidden',        // <-- this is the key
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    paddingHorizontal: 30,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)', // darken the blur
  },

  navIcon: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 46,
  height: 46,
  borderRadius: 3000,
  filter: "brightness(0.7)"
},
});
