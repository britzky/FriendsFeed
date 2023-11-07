import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useGetRestaurants } from '../hooks/useGetRestaurants';
import RestaurantCard from '../components/RestaurantCard';
import { Searchbar } from '../components/Searchbar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const Home = () => {
  const { userDetails, logout } = useAuth();
  const [searchZipcode, setSearchZipcode] = useState(userDetails?.zipcode);
  const { restaurants, loading, error } = useGetRestaurants(searchZipcode);
  const navigation = useNavigation();

  useEffect(() => {
    if (userDetails?.zipcode) {
      setSearchZipcode(userDetails.zipcode)
    }
  }, [userDetails?.zipcode])

  if (loading) {
    return <ActivityIndicator size="large" />
  }

  if (error) {
    return <Text>Error fetching restaurants: {error}</Text>
  }

  const handleSubmit = async () => {
    await logout()
  }

  console.log("Restaurants: ", restaurants)

  const handlePress = () => {
    navigation.navigate('Friend')
  }
  const handleSearch = (newZipcode) => {
    setSearchZipcode(newZipcode)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Searchbar
          onSearch={handleSearch}
          placeholder="Enter Zipcode: 55555"
        />
        <TouchableOpacity
          onPress={handlePress}
        >
          <Ionicons name="person-add-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={restaurants.businesses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurantName={item.name}
            imageUrl={item.image_url}
            cuisine={item.categories.map((category) => category.title).join(', ')}
          />
        )}
        ListEmptyComponent={<Text>No restaurants found for this zipcode.</Text>}
      />
      <Button title="logout" onPress={handleSubmit} />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listItem: {
    padding: 10,
    fontSize: 18,
  },
  title: {
    fontSize: 18,
  },
});
