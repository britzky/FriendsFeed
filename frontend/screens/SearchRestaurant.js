import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Searchbar } from "../components/Searchbar";
import RestaurantCard from "../components/RestaurantCard";
import { useLocation } from "../context/LocationContext";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating-widget";

export const SearchRestaurant = () => {
  const [restaurants, setRestaurants] = useState(null);
  const [searchedRestaurant, setSearchedRestaurant] = useState("");
  const { accessToken, userDetails, logout } = useAuth();
  const { searchLocation } = useLocation();
  const navigation = useNavigation();

  // Side effect to fetch a restaurant's details
  useEffect(() => {
    if (searchedRestaurant) {
      fetchRestaurant();
    }
  }, [accessToken, searchedRestaurant, userDetails]);

  const fetchRestaurant = async () => {
    try {
      const response = await fetch(
        `https://colab-test.onrender.com/search_restaurant?name=${searchedRestaurant}&location=${searchLocation}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRestaurants(data.businesses);
      console.log("These are the restaurants: ", data.businesses);
    } catch (error) {
      console.error("There was a problem fetching restaurant details:", error);
    }
  };

  // function to set the searched restaurant
  const handleSearch = (searchedName) => {
    setSearchedRestaurant(searchedName);
  };

  const renderRestaurantCard = ({ item }) => {
    return (
      <RestaurantCard
        restaurantName={item.name}
        imageUrl={item.image_url}
        address={item.location.display_address.join(", ")}
        isIndividual={true}
        onReviewPress={() =>
          navigation.navigate("Review", {
            yelpId: item.id,
            restaurantName: item.name,
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Restaurants to review</Text>
      <View style={styles.searchContainer}>
        <Searchbar onSearch={handleSearch} placeholder="Search Restaurant" />
      </View>
      <Text style={styles.paragraph}>
        Restaurants you want to review will appear here.
      </Text>
      <View style={styles.listContainer}>
        {restaurants && (
          <FlatList
            data={restaurants}
            renderItem={renderRestaurantCard}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={<Text>No restaurants</Text>}
          />
        )}
        <View>
          <Pressable onPress={() => logout()}>
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    backgroundColor: "white",
  },
  searchContainer: {
    width: "100%",
    padding: 10, // Adjust padding as needed
  },
  listContainer: {
    flex: 1, // Takes the remaining space
    width: "100%",
  },
  paragraph: {
    fontSize: 18,
    width: 300,
    textAlign: "left",
    marginRight: 70
  },
  header: {
  position: 'relative',
    fontFamily: "LuckiestGuy-Regular",
    color: "#739072",
    fontSize: 25,
    right: 45,

    marginTop: 10,

    marginBottom: 20,
    alignContent: 'flex-start',
    marginLeft: 12,

    }
});
