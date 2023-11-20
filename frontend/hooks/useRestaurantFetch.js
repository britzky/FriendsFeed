import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useRestaurantFetch = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { accessToken } = useAuth();

    const fetchFriendReviewedRestaurants = async (zipcode) => {
        try {
            setLoading(true);
            const response = await fetch(`https://colab-test.onrender.com/restaurants/friend-reviewed?zipcode=${zipcode}`, {
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
                setError(new Error('Failed to fetch data'));
            }
        } catch (err) {
            setError(err);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchRestaurantsByCuisine = async (zipcode, cuisine) => {
        try {
            setLoading(true);
            const response = await fetch(`https://colab-test.onrender.com/restaurants-cuisine?zipcode=${zipcode}&cuisine=${cuisine}`, {
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
                setError(new Error('Failed to fetch data'));
            }
        } catch (err) {
            setError(err);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    return { restaurants, loading, error, fetchFriendReviewedRestaurants, fetchRestaurantsByCuisine}
}