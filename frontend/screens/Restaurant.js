import { View, Text, StyleSheet } from "react-native";
// import RestaurantDetailsCard from "../components/RestaurantDetailsCard";
import RestaurantCard from "../components/RestaurantCard";
import { useGetRestaurants } from "../hooks/useGetRestaurants";
import ReviewsCard from "../components/ReviewsCard";
import { useState } from "react";

const Restaurant = () => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);

  const { restaurants, setRestaurants } = useGetRestaurants();

  return (
    <View style={styles.container}>
      <RestaurantCard
        restaurantName="CHillis"
        imageUrl="https://cdn.britannica.com/66/218266-050-77C3D624/Cookie-Monster-Sesame-Street-2016.jpg"
        cuisine="tacos"
        rating=""
        address="102 place st"
        isIndividual={true}
        onPress=""
      />

      <ReviewsCard />
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
