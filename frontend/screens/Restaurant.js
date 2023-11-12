import { View, StyleSheet } from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import ReviewsCard from "../components/ReviewsCard";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";

const Restaurant = () => {
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [friendsReviews, setFriendsReviews] = useState([]);
  const { accessToken } = useAuth();
  const route = useRoute();
  const { yelpId } = route.params;


  // fetch restaurant details using the yelpId
  useEffect(() => {
    const fetchRestaurantDetails = async (yelpId) => {
      try {
        const response = await fetch(`https://colab-test.onrender.com/restaurants/${yelpId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        data = await response.json();
        setRestaurantDetails(data)
        console.log("This is the restaurant details: ", data)
      }
      catch (error) {
        console.error('There was a problem fetching restaurant details:', error);
      }
    }
    fetchRestaurantDetails(yelpId);
  }, [yelpId, accessToken])

  //fetch friends reviews
  useEffect(() => {
    const fetchFriendsReviews = async (yelpId) => {
      try {
        const response = await fetch(`https://colab-test.onrender.com/restaurants/${yelpId}/friend-reviews'`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFriendsReviews(data)
        console.log("This is the friends reviews: ", data)
      } catch (error) {
        console.error('There was a problem fetching friends reviews:', error);
      }
    }
    if (restaurantDetails) {
      fetchFriendsReviews(restaurantDetails.id);
    }
  }, [yelpId, accessToken])

  console.log("This is the yelpId: ", yelpId)
  return (
    <View style={styles.container}>
      {restaurantDetails && (
        <RestaurantCard
          restaurantName={restaurantDetails.name}
          imageUrl={restaurantDetails.image_url}
          rating=""
          address={restaurantDetails.location.display_address.join(", ")}
          isIndividual={true}
          onPress=""
        />
      )
        }

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
