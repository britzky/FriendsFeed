import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import RestaurantCard from "../components/RestaurantCard";
import ReviewsCard from "../components/ReviewsCard";

const Restaurant = () => {
  const route = useRoute();
  const { restaurant } = route.params;
  const { accessToken } = useAuth();
  const navigation = useNavigation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `https://colab-test.onrender.com/restaurants/${restaurant.id}/friend-reviews`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchReviews();
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
        />
      <View style={styles.reviewsContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20}}>
          <ReviewsCard reviews={reviews} />
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
