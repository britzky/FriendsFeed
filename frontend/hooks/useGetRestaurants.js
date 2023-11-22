import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base url
const BASE_URL = 'https://colab-test.onrender.com'

export const useGetRestaurants = (location) => {
    const { accessToken, setAccessToken, refreshToken, isLoggedIn } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Define a function to fetch restaurants
    const fetchRestaurants = async () => {
        // handle case where no zipcode is provided
        if (!location || !isLoggedIn || !accessToken) {
            return;
        }

        setLoading(true)
        let currentToken = accessToken || await AsyncStorage.getItem('access_token');

        try {
            let response = await fetchRestaurantFromAPI(currentToken);

            if (response.status === 401) {
                //Attempt to refresh the token
                newToken = await refreshToken();
                if (newToken) {
                    currentToken = newToken;
                    setAccessToken(newToken);
                    await AsyncStorage.setItem('access_token', newToken)
                    // Re-fetch after refreshing the token

                    response = await fetchRestaurantFromAPI(currentToken);
                } else {
                    throw new Error('Authenticatiion failed');
                    }
                }

                if (response.ok) {
                    const data = await response.json();
                    setRestaurants(data);
                    setLoading(false);
                } else {
                    throw new Error('Failed to fetch restaurants');
                }
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }
        const fetchRestaurantFromAPI = async (token) => {
            return await fetch (`${BASE_URL}/restaurants?location=${location}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        }

    useEffect(() => {
        if (location && accessToken && isLoggedIn) {
        fetchRestaurants();
        }
    }, [location, accessToken, isLoggedIn])


  return { restaurants, setRestaurants, loading, error, fetchRestaurants };

}
