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
import { useReview } from "../context/ReviewContext";

export const TempHome = () => {
  const { userDetails, logout, accessToken, isLoggedIn } = useAuth();
  const [searchZipcode, setSearchZipcode] = useState(null);
  const { restaurants, loading, error, setRestaurants, fetchRestaurants } = useGetRestaurants(searchZipcode, accessToken, isLoggedIn);
  const navigation = useNavigation();
  const { reviews, fetchReviews, fetchedRestaurants } = useReview();
  const [showCuisineFilter, setShowCuisineFilter] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // added for a selected restaurant - Eduardo
  const [isNewUserStatus, setIsNewUserStatus] = useState(null);

  const avatarsArray = reviews.map((review) => review.profile_picture);

  const alreadyFetched = (restaurantId) => {
    return fetchedRestaurants.has(restaurantId);
  }

  // useEffect(() => {
  //   if (restaurants && Array.isArray(restaurants.businesses)) {
  //   restaurants.businesses.forEach((restaurant) => {
  //     if (!alreadyFetched(restaurant.id)) {
  //      fetchReviews(restaurant.id, accessToken);
  //     }
  //   });
  // }
  // }, [restaurants, accessToken, fetchReviews, alreadyFetched]);

  useEffect(() => {
    const getIsNewUserStatus = async () => {
      const isNewUserValue = await AsyncStorage.getItem('isNewUser');
      setIsNewUserStatus(isNewUserValue);
    }
    getIsNewUserStatus();
  }, [])

  useEffect(() => {
    if (userDetails?.user?.zipcode) {
      setSearchZipcode(userDetails.user.zipcode)
    }
  }, [userDetails])

  useEffect(() => {
    if (accessToken) {
      fetchRestaurants();
    }
  }, [accessToken]);

  useEffect(() => {
    const initFetchRestaurants = async () => {
      const isNewUser = await AsyncStorage.getItem('isNewUser');

      const isNewUserCheck = isNewUser !== 'true';
      const isLoggedInCheck = isLoggedIn;
      const userDetailsCheck = userDetails ? true : false;
      const accessTokenCheck = accessToken ? true : false;

      if (isNewUserCheck && isLoggedInCheck && userDetailsCheck && accessTokenCheck) {
        console.log('Fetching restaurants...');
        setSearchZipcode(userDetails.zipcode);
        fetchRestaurants();
      } else {
        console.log('Condition not met for fetching restaurants');
      }
    }

    initFetchRestaurants();
  }, [isLoggedIn, userDetails, accessToken]);

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

    if (error) {
      return <Text>Error fetching restaurants: {error}</Text>;
    }

    if (!userDetails || !accessToken) {
      return <ActivityIndicator size="large" />;
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
              friendAvatars={avatarsArray}
              cuisine={item.categories
                .map((category) => category.title)
                .join(", ")}
            />
          )}
          ListEmptyComponent={<ActivityIndicator size="large" />}
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