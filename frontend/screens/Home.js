import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useGetRestaurants } from '../hooks/useGetRestaurants';

export const Home = () => {
  const { userDetails, logout } = useAuth();
  const { restaurants, loading, error } = useGetRestaurants(userDetails?.zipcode);

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


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Restaurants near you</Text>
      <FlatList
        data={restaurants.businesses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.title}>{item.name}</Text>
          </View>
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
