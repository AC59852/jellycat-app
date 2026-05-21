import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions, Pressable } from "react-native";
import { useState, useEffect } from 'react';
import { File, Paths } from 'expo-file-system';
import HeartSvg from "./HeartSvg";
import { Link } from "expo-router";

interface ProductCardProps {
  name: string;
  image: string;
  theme: string;
  colour: string;
  id: string;
  onUnlike?: () => void;
}

const ProductCard = ({ name, image, theme, colour, id, onUnlike }: ProductCardProps) => {
  const { width } = useWindowDimensions();
  const _width = width * 0.430;
  const [isLiked, setIsLiked] = useState(false);

  // Load liked state from file once when component mounts
  useEffect(() => {
    try {
      const file = new File(Paths.document, 'likes.json');
      if (file.exists) {
        const json = JSON.parse(file.textSync()) as { id: string }[];

        const liked = json.some(item => item.id === id);
        setIsLiked(liked);
      }
    } catch (err) {
      console.error('Error reading likes:', err);
    }
  }, []);

  // Toggle like and write to file
  const toggleLike = () => {
    try {
      const file = new File(Paths.document, 'likes.json');
      let likes: { id: string }[] = [];

      // Load existing likes file
      if (file.exists) {
        likes = JSON.parse(file.textSync());
      }

      if (!isLiked) {
        // LIKE the product
        likes.push({ id });
        file.write(JSON.stringify(likes));
        setIsLiked(true);
      } else {
        // UNLIKE the product
        likes = likes.filter((item) => item.id !== id);
        file.write(JSON.stringify(likes));
        setIsLiked(false);
      }
    } catch (err) {
      console.error('Error writing like file:', err);
    }
  };

  const styles = StyleSheet.create({
  wrapper: {
    width: _width,
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 13,
  },

  imageWrapper: {
    width: _width,
    height: _width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#EEF0F2",
    borderWidth: 1,
    borderRadius: 13,
  },

  iconWrapper: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#F6F8FA",
    borderRadius: 50,
    padding: 5,
    height: 30,
    width: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    width: 20,
    height: 20,
  },

  heart: {
    width: 20,
    height: 20,
  },

  textWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 8,
    width: _width
  },

  tagsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tags: {
    fontSize: 10,
    color: "#747474",
  },

  nameWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 16,
    fontFamily: "Rubik_600SemiBold",
    color: "#333",
  },
})

  return (
      <Link
        href={{
          pathname: `/(jellycat)/jellycat/[item]`,
          params: { item: id },
        }}
        asChild
      >
        <Pressable style={styles.wrapper}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMethod="resize"
              resizeMode="cover"
            />
            {/* Like Button */}
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={() => { toggleLike(); if (onUnlike) onUnlike(); }} style={styles.icon}>
                <HeartSvg filled={isLiked} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Text */}
          <View style={styles.textWrapper}>
            <Text style={styles.tags}>{theme}, {colour}</Text>
            <Text style={styles.name} numberOfLines={2}>
              {name}
            </Text>
          </View>
        </Pressable>
      </Link>
  );
};

export default ProductCard;