import React, { createContext, useContext, useState, useCallback } from 'react';

const ReviewContext = createContext();

export const useReview = () => {
    return useContext(ReviewContext);
}

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);
    const [fetchedRestaurants, setFetchedRestaurants] = useState(new Set());

    const fetchReviews = useCallback(async (restaurantId, accessToken) => {
        if (fetchedRestaurants.has(restaurantId)) {
            return;
        }

        try {
            const response = await fetch(
                `https://colab-test.onrender.com/restaurants/${restaurantId}/friend-reviews`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
                if (response.ok) {
                    const data = await response.json();
                    console.log("These are the reviews", data);
                    setReviews(data);
                    setFetchedRestaurants(prev => new Set(prev.add(restaurantId)));
                }
            } catch (error) {
                console.log(error);
            }
        }, [fetchedRestaurants]);


    return (
        <ReviewContext.Provider value={{ reviews, fetchReviews, fetchedRestaurants }}>
            {children}
        </ReviewContext.Provider>
    )
}