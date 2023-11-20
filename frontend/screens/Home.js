import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Searchbar } from '../components/Searchbar';
import { CuisineFilter } from '../components/CuisineFilter';
import { RestaurantList } from '../components/RestaurantList';

export const Home = () => {
  const { logout, isLoggedIn, userDetails } = useAuth();
  const [searchZipcode, setSearchZipcode] = useState(userDetails.zipcode);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [showCuisineFilter, setShowCuisineFilter] = useState(false);

  // Side effect to make sure all of the details are loaded
  useEffect(() => {
    if (isLoggedIn && userDetails)
      setSearchZipcode(userDetails.zipcode);
  }, [isLoggedIn])

  //function to pass searched zipcode to the searchbar
  const handleSearch = (searchedZipcode) => {
    setSearchZipcode(searchedZipcode);
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
   if (!isLoggedIn || !searchZipcode) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    )
   }

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <View>
        <Searchbar onSearch={handleSearch} placeholder="Enter Zipcode: 55555" />
      </View>
      <View>
        {showCuisineFilter && (
          <CuisineFilter
            onApplyFilter={handleApplyCuisineFilter}
            onClose={handleCloseFilter}
            fetchCuisinesUrl={'https://colab-test.onrender.com/get-cuisines'}
            searchZipcode={searchZipcode}
          />
        )}
      </View>
      <View>
        <RestaurantList zipcode={searchZipcode} selectedCuisine={selectedCuisine}/>
      </View>
      <View>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

});
