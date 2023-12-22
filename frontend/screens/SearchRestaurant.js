import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Searchbar } from "../components/Searchbar";
import RestaurantCard from "../components/RestaurantCard";
import { useLocation } from "../context/LocationContext";
import { useNavigation } from "@react-navigation/native";

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
      <>
      <View style={styles.cardContainer}>
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
      </View>
      <View style={styles.separator} />
      </>
    );
  };

  return (
    <View style={{flex: 1, paddingTop: 38}}>
      <View style={styles.container}>
        <Text style={styles.header}>Restaurants to review</Text>
        <View>
          <Searchbar onSearch={handleSearch} placeholder="Search Restaurant" />
        </View>
        <Text style={styles.paragraph}>
          Restaurants you want to review will appear here.
        </Text>
          </View>
        <View style={styles.listContainer}>
          {restaurants && (
            <>
            <FlatList
              data={restaurants}
              renderItem={renderRestaurantCard}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={<Text>No restaurants</Text>}
            />
            </>
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
    width: "90%",
    alignSelf: "center",
    },
  listContainer: {
    flex: 1,
    marginTop: 20,
    width: "100%",
  },
  cardContainer: {
    maxWidth: 400,
    alignSelf: "center",
    width: "90%",
  },
  paragraph: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    },
  header: {
    fontFamily: "LuckiestGuy-Regular",
    color: "#739072",
    fontSize: 25,
    marginBottom: 20,
    alignContent: 'flex-start',
    },
    separator: {
      height: 1.5,
      width: "100%",
      maxWidth: 400,
      backgroundColor: "#739072",
      marginBottom: 30,
  },
});
