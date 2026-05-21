import CategoryCard from '@/components/CategoryCard';
import SearchComponent from '@/components/SearchComponent';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function AllCategoriesScreen() {
  const categories = [
    { name: "Bunnies", image: require('@/assets/images/bunnies-categories.png') },
    { name: "Bears", image: require('@/assets/images/bears-categories.png') },
    { name: "Amuseables", image: require('@/assets/images/amuseables-categories.png') },
    { name: "Bashfuls", image: require('@/assets/images/bashfuls-categories.png') },
    { name: "Nature", image: require('@/assets/images/nature-categories.png') },
    { name: "Sea Creatures", image: require('@/assets/images/sea-creatures-categories.png') },
    { name: "Accessories", image: require('@/assets/images/accessories-categories.jpg') },
    { name: "Around the Home", image: require('@/assets/images/around-the-home-categories.jpg') },
    { name: "Baby", image: require('@/assets/images/baby-categories.jpg') },
    { name: "Bashful Bunnies", image: require('@/assets/images/bashful-bunnies-categories.jpg') },
    { name: "Birds", image: require('@/assets/images/birds-categories.jpg') },
    { name: "Blossoms", image: require('@/assets/images/blossoms-categories.jpg') },
    { name: "Bugs", image: require('@/assets/images/bugs-categories.jpg') },
    { name: "Cats", image: require('@/assets/images/cats-categories.jpg') },
    { name: "Cordy Roy", image: require('@/assets/images/cordy-roy-categories.jpg') },
    { name: "Desert", image: require('@/assets/images/desert-categories.jpg') },
    { name: "Dinosaurs", image: require('@/assets/images/dinosaurs-categories.jpg') },
    { name: "Dogs", image: require('@/assets/images/dogs-categories.jpg') },
    { name: "Farmyard", image: require('@/assets/images/farmyard-categories.jpg') },
    { name: "Food", image: require('@/assets/images/food-categories.jpg') },
    { name: "Freshwater Animals", image: require('@/assets/images/freshwater-animals-categories.jpg') },
    { name: "Fuddlewuddle", image: require('@/assets/images/fuddlewuddle-categories.jpg') },
    { name: "Halloween", image: require('@/assets/images/halloween-categories.jpg') },
    { name: "Jungle", image: require('@/assets/images/jungle-categories.jpg') },
    { name: "Mythical Creatures", image: require('@/assets/images/mythical-creatures-categories.jpg') },
    { name: "Little Critters", image: require('@/assets/images/little-critters-categories.jpg') },
    { name: "Reptiles", image: require('@/assets/images/reptiles-categories.jpg') },
    { name: "Seaside", image: require('@/assets/images/seaside-categories.jpg') },
    { name: "Space", image: require('@/assets/images/space-categories.jpg') },
    { name: "Special Edition Bunnies", image: require('@/assets/images/special-edition-bunnies-categories.jpg') },
    { name: "Sports", image: require('@/assets/images/sports-categories.jpg') },
    { name: "Summer", image: require('@/assets/images/summer-categories.jpg') },
    { name: "Valentines Day", image: require('@/assets/images/valentines-day-categories.jpg') },
    { name: "Winter", image: require('@/assets/images/winter-categories.jpg') },
    { name: "Woodland", image: require('@/assets/images/woodland-categories.jpg') },
  ];

  // order the categories alphabetically by name
  categories.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SafeAreaView style={{paddingVertical: 30, flex: 1, alignItems: 'center'}}>
      <ScrollView>
      <View style={{marginTop: -40, width: '100%', paddingHorizontal: 15, marginBottom: 40}}>
        <SearchComponent />
      </View>
        <Text style={{ fontSize: 30, fontFamily: 'Rubik_700Bold', width: '90%', textAlign: 'left', marginBottom: 32, marginLeft: 5 }}>Categories</Text>
        <View style={[styles.categoriesList]}>
            {categories.map((item, index) => (
              <CategoryCard key={index} name={item.name} image={item.image} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  categoriesList: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 14,
    paddingBottom: 40,
    gap: 14,
  },
});