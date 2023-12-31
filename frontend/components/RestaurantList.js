import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { useRestaurant } from '../context/RestaurantContext';
import { useNavigation } from '@react-navigation/native';
import RestaurantCard from './RestaurantCard';
import { useReview } from '../context/ReviewContext';
import { useAuth } from '../context/AuthContext';
import { useFriends } from '../context/FriendContext';

export const RestaurantList = ({ location, selectedCuisine }) => {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Restaurant selected by the user
    const { restaurants, loading, error, fetchRestaurantsByCuisine } = useRestaurant();
    const navigation = useNavigation(); // Navigation hook
    const { avatars, refreshAvatars, reviews } = useReview(); // Custom hook to fetch and use friend avatars
    const { accessToken } = useAuth(); // Custom hook to fetch the access token for avatar fetch
    const { friends } = useFriends(); // Custom hook to fetch the friends list
    // Side effect to fetch friend-reviewed restaurants
    useEffect(() => {
        if (selectedCuisine) {
            fetchRestaurantsByCuisine(location, selectedCuisine);
        }
    }, [ selectedCuisine, accessToken, friends, reviews]);

    // Side effect to fetch avatars for each restaurant
    useEffect(() => {
        if (restaurants && Array.isArray(restaurants)) {
                refreshAvatars();
        }
    }, [restaurants, accessToken, friends, reviews]);

    // If the loading state is active (true), display the ActivityIndicator
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    // If there is an error, display the error message
    if (error) {
        return (
            <View>
                <Text>Error: {error.message}</Text>
            </View>
        )
    }


    const handleSelectRestaurant = (restaurant) => {
        setSelectedRestaurant(restaurant);
        navigation.navigate("Restaurant", { restaurant });

        };

    // Function to render the restaurant card
    const renderRestaurantCard = ({ item }) => {
        return (
            <>
            <View style={styles.cardContainer}>
                <RestaurantCard
                    restaurantName={ item.name }
                    imageUrl={item.image_url}
                    rating={item.friend_ratings}
                    friendAvatars={avatars[item.id]}
                    onPress={ () => handleSelectRestaurant(item)}
                    onReviewPress={ () => navigation.navigate("Review", { yelpId: item.id,  restaurantName: item.name  }) }
                    cuisine={item.categories.map((category) => category.title).join(", ")}
                />
            </View>
                 <View style={styles.separator} />
            </>
        )
    }

  return (
    <View>
        <FlatList
            data={restaurants}
            keyExtractor={(item) => item.id}
            renderItem={renderRestaurantCard}
            ListEmptyComponent={<Text>No restaurants</Text>}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    cardContainer : {
        maxWidth: 400,
        alignSelf: 'center',
        width: '90%',
    },
    separator: {
        height: 1.5,
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#739072",
        marginBottom: 30,
    },
});

