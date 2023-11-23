import { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { Searchbar } from '../components/Searchbar'
import RestaurantCard from '../components/RestaurantCard'
import { useLocation } from '../context/LocationContext'
import { useNavigation } from '@react-navigation/native'

export const SearchRestaurant = () => {
    const [restaurants, setRestaurants] = useState(null)
    const [searchedRestaurant, setSearchedRestaurant] = useState('')
    const { accessToken, userDetails } = useAuth()
    const { searchLocation } = useLocation()
    const navigation = useNavigation()

    // Side effect to fetch a restaurant's details
    useEffect(() => {
        if (searchedRestaurant) {
            fetchRestaurant();
        }
    }, [accessToken, searchedRestaurant, userDetails])

    const fetchRestaurant = async () => {
        try {
            const response = await fetch(`https://colab-test.onrender.com/search_restaurant?name=${searchedRestaurant}&location=${searchLocation}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRestaurants(data.businesses)
            console.log("These are the restaurants: ", data.businesses)
        } catch (error) {
            console.error('There was a problem fetching restaurant details:', error);
        }
    }

    // function to set the searched restaurant
    const handleSearch = (searchedName) => {
        setSearchedRestaurant(searchedName);
    }

    const renderRestaurantCard = ({ item }) => {
        return (
            <RestaurantCard
                restaurantName={item.name}
                imageUrl={item.image_url}
                address={item.location.display_address.join(", ")}
                isIndividual={true}
                onReviewPress={() => navigation.navigate("Review", { yelpId: item.id })}
            />
        )
    }

  return (
    <View style={styles.container}>
        <View style={styles.searchContainer}>
        <Searchbar onSearch={handleSearch} placeholder="Search Restaurant"/>
        </View>
        <View style={styles.listContainer}>
            {restaurants && (
                <FlatList
                    data={restaurants}
                    renderItem={renderRestaurantCard}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text>No restaurants</Text>}
                />
            )}
        </View>
        <Text>SearchRestaurant</Text>
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
    width: '100%',
    padding: 10, // Adjust padding as needed
  },
  listContainer: {
    flex: 1, // Takes the remaining space
    width: '100%',
  },
});
