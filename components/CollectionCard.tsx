import { View, Text, Image, StyleSheet, useWindowDimensions } from "react-native";

interface CollectionCardProps {
  name: string;
  description?: string;
  imageSource: any; // local asset from require()
}

const CollectionCard = ({ name, description, imageSource }: CollectionCardProps) => {
  const { width } = useWindowDimensions();
  const _width = width * 0.430;

  const styles = StyleSheet.create({
    wrapper: {
      width: _width,
      flexDirection: "column",
      marginBottom: 15,
    },
    imageWrapper: {
      width: _width,
      height: _width,
      justifyContent: "center",
      alignItems: "center",
      borderColor: "#EEF0F2",
      borderWidth: 1,
      borderRadius: 13,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    textWrapper: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      marginTop: 8,
      width: _width,
    },
    description: {
      fontSize: 10,
      color: "#747474",
    },
    name: {
      fontSize: 16,
      fontFamily: "Rubik_600SemiBold",
      color: "#333",
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} />
      </View>
      <View style={styles.textWrapper}>
        {description ? <Text style={styles.description}>{description}</Text> : null}
        <Text style={styles.name}>{name}</Text>
      </View>
    </View>
  );
};

export default CollectionCard;