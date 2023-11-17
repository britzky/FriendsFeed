import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useGetRestaurants } from "../hooks/useGetRestaurants";
import RestaurantCard from "../components/RestaurantCard";
import { Searchbar } from "../components/Searchbar";
import { useNavigation } from "@react-navigation/native";
import { CuisineFilter } from '../components/CuisineFilter';
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Home = () => {
  const { userDetails, logout, accessToken, isLoggedIn } = useAuth();
  const [searchZipcode, setSearchZipcode] = useState(userDetails?.zipcode);
  const { restaurants, loading, error, setRestaurants, fetchRestaurants } = useGetRestaurants(searchZipcode, accessToken, isLoggedIn);
  const navigation = useNavigation();
  const [showCuisineFilter, setShowCuisineFilter] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // added for a selected restaurant - Eduardo
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    console.log('Initial States:', { isLoggedIn, userDetails, accessToken });
  }, []);

  useEffect(() => {
    const checkNewUser = async () => {
      const isNewUser = await AsyncStorage.getItem('isNewUser');
      console.log('Checking New User Status:', isNewUser);
      console.log('Current states:', { isLoggedIn, userDetails, accessToken });
      if (isNewUser !== 'true' && isLoggedIn && userDetails?.zipcode && accessToken) {
        console.log('All data available, fetching restaurants...');
        setSearchZipcode(userDetails.zipcode);
        fetchRestaurants();
      } else {
        console.log('Conditions not met for fetching restaurants:', {
          isNewUser,
          isLoggedIn,
          userDetails,
          accessToken
        });
      }
    }
    checkNewUser();
  }, [isLoggedIn, userDetails, accessToken]);

  useEffect(() => {
    if (!loading && restaurants) {
      setFetching(false)
    }
  }, [loading, restaurants])

  useEffect(() => {
    const getRestaurants = async () => {
      if (!selectedCuisine || !searchZipcode) {
        return;
      }
      try {
        const response = await fetch(
          `https://colab-test.onrender.com/restaurants-cuisine?zipcode=${searchZipcode}&cuisine=${selectedCuisine}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
          );

          if (response.ok) {
            const data = await response.json();
            setRestaurants(data)
            console.log("Fetched filtered restaurants", data)
          } else {
            throw new Error(data.error || "Failed to fetch");
          }
        } catch (error) {
          console.error('Error fetching filtered restaurants', error)
        }
      }

      getRestaurants();

    }, [selectedCuisine, searchZipcode, accessToken, setRestaurants])

    // if (!isLoggedIn || !searchZipcode || !accessToken || fetching) {
    //   console.log('Spinner active due to missing data', { isLoggedIn, searchZipcode, accessToken });
    //   return <ActivityIndicator size="large" />;
    // }

    if (error) {
      return <Text>Error fetching restaurants: {error}</Text>;
    }


    // ALso added this function (handleSelectedRestaurant--- EDuardo
    const handleSelectRestaurant = (restaurant) => {
      setSelectedRestaurant(restaurant);
      navigation.navigate("Restaurant", { restaurant });

    };

  const handleSubmit = async () => {
    await logout();
  };

  const handlePress = () => {
    navigation.navigate("Friend");
  };

  const handleSearch = (newZipcode) => {
    setSearchZipcode(newZipcode);
  };

  const handleOpenFilter = () => {
    setShowCuisineFilter(true)
  }

  const handleApplyCuisineFilter = (cuisineAlias) => {
    setSelectedCuisine(cuisineAlias)
  }

  const handleCloseFilter = () => {
    setShowCuisineFilter(false)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpenFilter}>
        <Text>Filter by Cuisine</Text>
      </TouchableOpacity>
      {showCuisineFilter && (
        <CuisineFilter
          onApplyFilter={handleApplyCuisineFilter}
          onClose={handleCloseFilter}
          fetchCuisinesUrl={'https://colab-test.onrender.com/get-cuisines'}
          searchZipcode={searchZipcode}
        />
      )}
      <View style={styles.headerContainer}>
        <Searchbar onSearch={handleSearch} placeholder="Enter Zipcode: 55555" />
        <TouchableOpacity onPress={handlePress}>
          <AntDesign style={styles.icon} name="adduser" />
        </TouchableOpacity>
      </View>
        <FlatList
          data={restaurants.businesses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <RestaurantCard
              onPress={() => handleSelectRestaurant(item)} // ADDED by eduardo
              onReviewPress={() => navigation.navigate("Review", { yelpId: item.id })}
              restaurantName={item.name}
              imageUrl={item.image_url}
              cuisine={item.categories
                .map((category) => category.title)
                .join(", ")}
            />
          )}
          ListEmptyComponent={<Text>No restaurants found for this zipcode.</Text>}
        />
      <Button title="logout" onPress={handleSubmit} />
    </View>
  );
};

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