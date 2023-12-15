import React, { useState, useEffect, useCallback } from "react";
import { View, Modal, Text, ActivityIndicator, StyleSheet, Pressable, TouchableWithoutFeedback } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Searchbar } from "../components/Searchbar";
import { CuisineFilter } from "../components/CuisineFilter";
import { RestaurantList } from "../components/RestaurantList";
import { RatingsDropdown } from "../components/RatingsDropdown";
import { useLocation } from "../context/LocationContext";
import { useRestaurant } from "../context/RestaurantContext";
import Icon from "react-native-vector-icons/MaterialIcons";

export const Home = () => {
  const { logout, isLoggedIn, userDetails, loading, accessToken } = useAuth();
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const { setSearchLocation, searchLocation } = useLocation();
  const [selectedRating, setSelectedRating] = useState(null);
  const { fetchRestaurantsByFriendRating, fetchFriendReviewedRestaurants, } = useRestaurant();
  const navigation = useNavigation();

  // Side effect to make sure all of the details are loaded
  useEffect(() => {
    if (isLoggedIn && userDetails) setSearchLocation(userDetails.location);
  }, [isLoggedIn, userDetails]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      // Reset filters when leaving the Home screen
      setSelectedCuisine(null);
      // Add any other filter resets here
    });

    return unsubscribe; // Clean up the listener when the component unmounts
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchFriendReviewedRestaurants(searchLocation);
    }, [searchLocation])
  );

  //function to pass searched zipcode to the searchbar
  const handleSearch = (searchedLocation) => {
    setSearchLocation(searchedLocation);
  };

  //function to pass selected cuisine to the cuisine filter
  const handleApplyCuisineFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
    setModalVisible(false);
  };

  // function to logout
  const handleLogout = async () => {
    await logout();
  };

  //function to filter restaurants by rating
  const handleRatingSelection = (rating) => {
    fetchRestaurantsByFriendRating(rating);
    setShowRatingDropdown(false);
  };

  const resetFilter = () => {
    setSelectedRating(null); // Reset the selected rating
    fetchFriendReviewedRestaurants(); // Fetch all restaurants without filtering by rating
    setShowRatingDropdown(!showRatingDropdown);
  };

  if (loading || !accessToken || !userDetails || !searchLocation) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Friends Reviews</Text>
          <Searchbar
            onSearch={handleSearch}
            placeholder="Search Location (ex: Brooklyn, NY)"
          />
          <View style={styles.ButtonContainer}>
            <Pressable
              style={styles.filterButton}
              android_ripple={{ color: "#3A4D39" }}
              onPress={() => setShowRatingDropdown(!showRatingDropdown)}
            >
              <Text style={styles.text}>Ratings</Text>
              <Icon name="keyboard-arrow-down" size={24} />
            </Pressable>
            <Pressable
              style={styles.filterButton}
              android_ripple={{ color: "#3A4D39" }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.text}>Cuisines</Text>
              <Icon name="keyboard-arrow-down" size={24} />
            </Pressable>
          </View>
          {showRatingDropdown && (
          <View style={styles.dropdownContainer}>
            <RatingsDropdown
              onRatingSelect={handleRatingSelection}
              resetFilter={resetFilter}
            />
          </View>
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <CuisineFilter
                    onApplyFilter={handleApplyCuisineFilter}
                    onClose={() => setModalVisible(false)}
                    fetchCuisinesUrl={
                      "https://colab-test.onrender.com/get-cuisines"
                    }
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <View style={styles.RestaurantListContainer}>
          <RestaurantList
            location={searchLocation}
            selectedCuisine={selectedCuisine}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 38,
    width: "90%",
    alignSelf: "center",
  },
  headerContainer: {
    marginBottom: 10,
  },
  header: {
    fontFamily: "LuckiestGuy-Regular",
    color: "#739072",
    fontSize: 25,
    marginBottom: 10,
  },
  ButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15
  },
  filterButton: {
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 2,
    borderRadius: 10,
    borderWidth: 2.5,
    borderColor: "#4F6F52",
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
  dropdownContainer: {
    position: "absolute",
    top: "95%",
    zIndex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    borderWidth: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  RestaurantListContainer: {
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  logout: {
    position: "relative",
    bottom: 50,
  },
  logoutText: {
    fontFamily: "LuckiestGuy-Regular",
    fontSize: 20,
  },
});
