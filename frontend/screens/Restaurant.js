import { useEffect } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import RestaurantCard from "../components/RestaurantCard";
import ReviewsCard from "../components/ReviewsCard";

const Restaurant = () => {

  const route = useRoute();
  const { restaurant } = route.params;
  const { accessToken } = useAuth();
  const { fetchReviews, refreshAvatars, avatars } = useReview();
  const navigation = useNavigation();

  useEffect(() => {
    fetchReviews(restaurant.id, accessToken);
    refreshAvatars();
  }, [restaurant.id, accessToken]);

  return (
      <View style={styles.container}>
        <View style={styles.restaurantContainer}>
          <RestaurantCard
            restaurantName={restaurant.name}
            imageUrl={restaurant.image_url}
            cuisine={restaurant.categories.map(category => category.title).join(", ")}
            rating={restaurant.rating}
            address={restaurant.location.display_address.join(", ")}
            onReviewPress={() => navigation.navigate("Review", { yelpId: restaurant.id, restaurantName: restaurant.name })}
            isIndividual={true}
            friendAvatars={avatars[restaurant.id]}
          />
        </View>
        <View style={styles.separator} />
        <Text style={{marginLeft: 20, fontFamily: 'Roboto-Bold', fontSize: 18}}>Your Friends Reviews</Text>
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
    paddingTop: 38,
  },
  restaurantContainer: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
  },
  separator: {
    height: 1,
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#739072",
    marginTop: 50,
    marginBottom: 20,
},
  reviewsContainer: {
    flex: .5,
  },
});
