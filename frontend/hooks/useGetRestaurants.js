import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the base url
const BASE_URL = 'https://colab-test.onrender.com'

export const useGetRestaurants = (zipcode) => {
    const { accessToken, refreshToken, isLoggedIn } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define a function to fetch restaurants
        const fetchRestaurants = async () => {
            // handle case where no zipcode is provided
            if (!zipcode || !isLoggedIn) return;

            setLoading(true)

            try {
                let response = await fetchRestaurantFromAPI(accessToken);

                if (response.status === 401) {
                    //Attempt to refresh the token
                    await refreshToken();
                    // Re-fetch after refreshing the token
                    response = await fetchRestaurantFromAPI(accessToken);
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

        fetchRestaurants();
    }, [zipcode, accessToken, refreshToken])

    const fetchRestaurantFromAPI = async (token) => {
        return await fetch (`${BASE_URL}/restaurants?zipcode=${zipcode}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

  return { restaurants, loading, error };

}
