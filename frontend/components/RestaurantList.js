import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useRestaurantFetch } from '../hooks/useRestaurantFetch';
import { useNavigation } from '@react-navigation/native';
import RestaurantCard from './RestaurantCard';
import { useReview } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendContext';

export const RestaurantList = ({ location, selectedCuisine }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Restaurant selected by the user
    const { restaurants, loading, error, fetchFriendReviewedRestaurants, fetchRestaurantsByCuisine } = useRestaurantFetch(); // Custom hook to fetch restaurants with loading and error states
    const navigation = useNavigation(); // Navigation hook
    const { avatars, fetchAvatars } = useReview(); // Custom hook to fetch and use friend avatars
    const { accessToken } = useAuth(); // Custom hook to fetch the access token for avatar fetch
    const { friends } = useFriends(); // Custom hook to fetch the friends list

    console.log("Initial States - Restaurants:", restaurants, "Loading:", loading, "Error:", error);


    // Side effect to fetch friend-reviewed restaurants
    useEffect(() => {
        if (selectedCuisine) {
            fetchRestaurantsByCuisine(location, selectedCuisine);
        } else {
            fetchFriendReviewedRestaurants(location);
        }
        console.log("Updated States - Restaurants:", restaurants, "Loading:", loading, "Error:", error);

    }, [location, selectedCuisine, accessToken, friends]);

    // Side effect to fetch avatars for each restaurant
    useEffect(() => {
        if (restaurants && Array.isArray(restaurants)) {
            restaurants.forEach((restaurant) => {
                fetchAvatars(restaurant.id, accessToken);
            });
        }
    }, [restaurants, accessToken]);

    // If the loading state is active (true), display the ActivityIndicator
    if (loading) {
        return (
            <View style={ styles.centered }>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    // If there is an error, display the error message
    if (error) {
        return (
            <View style={ styles.centered }>
                <Text>Error: {error.message}</Text>
            </View>
        )
    }

    // ALso added this function (handleSelectedRestaurant--- EDuardo
    const handleSelectRestaurant = (restaurant) => {
        setSelectedRestaurant(restaurant);
        navigation.navigate("Restaurant", { restaurant });

        };

    // Function to render the restaurant card
    const renderRestaurantCard = ({ item }) => {
        return (
            <RestaurantCard
                restaurantName={ item.name }
                imageUrl={item.image_url}
                rating={item.friend_ratings}
                friendAvatars={avatars[item.id]}
                onPress={ () => handleSelectRestaurant(item)}
                onReviewPress={ () => navigation.navigate("Review", { yelpId: item.id }) }
                cuisine={item.categories.map((category) => category.title).join(", ")}
            />
        )
    }

  return (
      <View style={styles.container}>
            <FlatList
              data={restaurants}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderRestaurantCard}
              ListEmptyComponent={<Text>No restaurants</Text>}
            />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
