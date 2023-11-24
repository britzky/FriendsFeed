import React, { useState, useContext, createContext } from 'react'
import { useAuth } from '../context/AuthContext'

const RestaurantContext = createContext()

export const useRestaurant = () => {
    return useContext(RestaurantContext)
}

export const RestaurantProvider = ({ children }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { accessToken } = useAuth();

    const fetchFriendReviewedRestaurants = async (location) => {
        try {
            setLoading(true);
            setRestaurants([]);
            const response = await fetch(`https://colab-test.onrender.com/restaurants/friend-reviewed?location=${location}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': "application/json",
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
                console.log("Friend reviewed restaurants", data);
            } else {
                const errorText = await response.text();
                setError(new Error(`Failed to fetch data: ${errorText}`));
            }
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchRestaurantsByCuisine = async (location, cuisine) => {
        try {
            setLoading(true);
            setRestaurants([]);
            const response = await fetch(`https://colab-test.onrender.com/restaurants-cuisine?location=${location}&cuisine=${cuisine}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': "application/json",
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRestaurants(data);
            } else {
                const errorText = await response.text();
                setError(new Error(`Failed to fetch data: ${errorText}`));
            }
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // function to pass selected rating to the ratings dropdown
    const fetchRestaurantsByFriendRating = async (rating) => {
        try {
            setLoading(true);
            setRestaurants([]);
            const response = await fetch(`https://colab-test.onrender.com/restaurants-by-friend-rating?rating=${rating}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            console.log('These are the restaurants', data);
            setRestaurants(data);
        } else {
            console.log('Error fetching restaurants:', response.status, await response.text());
        }
        } catch (error) {
        console.error('Error fetching restaurants:', error);
        } finally {
            setLoading(false);
        }
    }

    const contextValue = {
        restaurants,
        loading,
        error,
        fetchFriendReviewedRestaurants,
        fetchRestaurantsByCuisine,
        fetchRestaurantsByFriendRating,
    };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  )
}

