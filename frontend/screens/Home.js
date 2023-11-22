import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Searchbar } from '../components/Searchbar';
import { CuisineFilter } from '../components/CuisineFilter';
import { RestaurantList } from '../components/RestaurantList';

export const Home = () => {
  const { logout, isLoggedIn, userDetails, loading, accessToken } = useAuth();
  const [searchLocation, setSearchLocation] = useState(userDetails?.location || "");
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [showCuisineFilter, setShowCuisineFilter] = useState(false);

  console.log("Initial searchLocation:", searchLocation);
  console.log("Initial selectedCuisine:", selectedCuisine);
  console.log("Initial showCuisineFilter:", showCuisineFilter);

  // Side effect to make sure all of the details are loaded
  useEffect(() => {
    if (isLoggedIn && userDetails)
      setSearchLocation(userDetails.location);
  }, [isLoggedIn, userDetails])

  //function to pass searched zipcode to the searchbar
  const handleSearch = (searchedLocation) => {
    setSearchLocation(searchedLocation);
  }

  //function to pass selected cuisine to the cuisine filter
  const handleApplyCuisineFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
  }

  //function to close the cuisine filter
  const handleCloseFilter = () => {
    setShowCuisineFilter(false);
  }

  //function to open the cuisine filter
  const handleOpenFilter = () => {
    setShowCuisineFilter(true);
  }

  // function to logout
  const handleLogout = async () => {
    await logout();
  }
   if (loading || !accessToken || !userDetails || !searchLocation) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    )
   }

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <View style={styles.searchContainer}>
        <Searchbar onSearch={handleSearch} placeholder="Search Location (ex: Brooklyn, NY)" />
      </View>
      <View>
        {showCuisineFilter && (
          <CuisineFilter
            onApplyFilter={handleApplyCuisineFilter}
            onClose={handleCloseFilter}
            fetchCuisinesUrl={'https://colab-test.onrender.com/get-cuisines'}
          />
        )}
      </View>
      <View style={styles.RestaurantListContainer}>
        <RestaurantList location={searchLocation} selectedCuisine={selectedCuisine}/>
      </View>
      <View>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    width: '50%',
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  RestaurantListContainer: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
