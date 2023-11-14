import { View, StyleSheet } from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import ReviewsCard from "../components/ReviewsCard";

import { useNavigation, useRoute } from "@react-navigation/native";

const Restaurant = () => {
  const route = useRoute();
  const { restaurant } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <RestaurantCard
        restaurantName={restaurant.name}
        imageUrl={restaurant.image_url}
        cuisine={restaurant.categories.map(category => category.title).join(", ")}
        rating={restaurant.rating}
        address={restaurant.location.display_address.join(", ")}
        isIndividual={true}
      />
      <ReviewsCard  />
    </View>
  );
};
export default Restaurant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listItem: {
    padding: 10,
    fontSize: 18,
  },
  title: {
    fontSize: 18,
  },
  icon: {
    fontSize: 40,
    color: "green",
    marginLeft: 30,
  },
  headerContainer: {
    flexDirection: "row", // This aligns the Searchbar and the icon next to each other
    alignItems: "center",
  },
});
