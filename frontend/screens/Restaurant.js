import { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import RestaurantCard from "../components/RestaurantCard";
import ReviewsCard from "../components/ReviewsCard";

const Restaurant = () => {
  const route = useRoute();
  const { restaurant } = route.params;
  const { accessToken } = useAuth();
  const { fetchReviews, fetchAvatars, avatars } = useReview();
  const navigation = useNavigation();

  useEffect(() => {
    fetchReviews(restaurant.id, accessToken);
    fetchAvatars(restaurant.id, accessToken);
  }, [restaurant.id, accessToken]);

  return (
      <View style={styles.container}>
        <RestaurantCard
          restaurantName={restaurant.name}
          imageUrl={restaurant.image_url}
          cuisine={restaurant.categories.map(category => category.title).join(", ")}
          rating={restaurant.rating}
          address={restaurant.location.display_address.join(", ")}
          onReviewPress={() => navigation.navigate("Review", { yelpID: restaurant.id })}
          isIndividual={true}
          friendAvatars={avatars[restaurant.id]}
        />
      <View style={styles.reviewsContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20}}>
          <ReviewsCard restaurantId={restaurant.id} />
        </ScrollView>
      </View>
    </View>
  );
};
export default Restaurant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: 'white',
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
  reviewsContainer: {
    paddingTop: 20,
    flex: 1,
  },
});
