import { View, StyleSheet, TouchableOpacity, Image, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Link, usePathname } from 'expo-router';

export default function NavigationBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.navbarContainer, { bottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.navbarWrapper}>
        <View style={styles.overlay} />
        <Link href='/' asChild style={[styles.navIcon, pathname === '/' && { backgroundColor: '#4570FF', opacity: 1 }]}>
          <Pressable>
            <Image source={require('../assets/icons/homeIcon.png')} style={{ width: 24, height: 26 }} />
          </Pressable>
        </Link>
        <Link href='/search' asChild style={[styles.navIcon, (pathname.startsWith('/jellycat') || pathname.startsWith('/category') || pathname.startsWith('/search')) && { backgroundColor: '#4570FF', opacity: 1 }]}>
          <Pressable>
            <Image source={require('../assets/icons/searchIcon.png')} style={{ width: 26, height: 26 }} />
          </Pressable>
        </Link>
        <Link href='/profile' asChild style={[styles.navIcon, pathname === '/profile' && { backgroundColor: '#4570FF', opacity: 1 }]}>
          <Pressable>
            <Image source={require('../assets/icons/profileIcon.png')} style={{ width: 34, height: 34 }} />
          </Pressable>
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
    bottom: 10,
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
  opacity: 0.5,
},

active: {
  backgroundColor: '#4570FF',
  opacity: 1,
}
});
