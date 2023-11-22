import { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { Searchbar } from '../components/Searchbar'
import RestaurantCard from '../components/RestaurantCard'

export const SearchRestaurant = () => {
    const [restaurant, setRestaurant] = useState(null)
    const [searchedRestaurant, setSearchedRestaurant] = useState('')
    const { accessToken, userDetails } = useAuth()

    // Side effect to fetch a restaurant's details
    useEffect(() => {
        if (searchedRestaurant) {
            fetchRestaurant();
        }
    }, [accessToken, searchedRestaurant, userDetails])

    const fetchRestaurant = async () => {
        const restaurantName = searchedRestaurant
        const zipcode = userDetails.zipcode
        try {
            const response = await fetch(`https://colab-test.onrender.com/search_restaurant?name=${restaurantName}&zipcode=${zipcode}`, {
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
            setRestaurant(data)
            console.log("This is the restaurant: ", data)
        } catch (error) {
            console.error('There was a problem fetching restaurant details:', error);
        }
    }

    // function to set the searched restaurant
    const handleSearch = (searchedName) => {
        setSearchedRestaurant(searchedName);
    }

  return (
    <View>
        <View>
        <Searchbar onSearch={handleSearch} placeholder="Search Restaurant"/>
        </View>
        <View>
            {restaurant && (
                <RestaurantCard
                    restaurantName={restaurant.buisnesses.name}
                    address={restaurant.buisnesses.location.display_address.join(", ")}
                />
            )}
        </View>
        <Text>SearchRestaurant</Text>
    </View>
  )
}
