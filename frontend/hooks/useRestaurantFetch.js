import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useRestaurantFetch = () => {
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
    return { restaurants, loading, error, fetchFriendReviewedRestaurants, fetchRestaurantsByCuisine}
}