import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ReviewContext = createContext();

export const useReview = () => {
    return useContext(ReviewContext);
}

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState({}); // fetch all reviews for the restaurant selected
    const [avatars, setAvatars] = useState({}); // fetch all avatars for friends who have reviewed the restaurant
    const [fetchedRestaurants, setFetchedRestaurants] = useState(new Set()); // To track fetched restaurants


    const fetchReviews = useCallback(async (restaurantId, accessToken) => {
        console.log(`Fetching reviews for restaurant ${restaurantId}`)
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
                    setReviews(prevReviews => ({ ...prevReviews, [restaurantId]: data }));
                    setFetchedRestaurants(prev => {
                        console.log(`Current fetched restaurants before update: ${Array.from(prev).join(', ')}`);
                        const newSet = new Set(prev);
                        newSet.add(restaurantId);
                        return newSet;
                    });
                } else {
                    console.log("Error fetching reviews:", response.status, await response.text());
                }
            } catch (error) {
                console.log("Caught an error fetching reviews: ", error);
            }
        }, [fetchedRestaurants]);

        const fetchAvatars = useCallback(async (restaurantId, accessToken) => {
            if (fetchedRestaurants.has(restaurantId)) {
                return;
            }
            try {
                const response = await fetch(
                    `https://colab-test.onrender.com/restaurants/${restaurantId}/friend-avatars`,
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
                    setAvatars(prevAvatars => ({ ...prevAvatars, [restaurantId]: data }));
                    setFetchedRestaurants(prev => new Set(prev.add(restaurantId)));
                } else {
                    console.log("Error fetching avatars:", response.status, await response.text());
                }

            } catch (error) {
                console.log(error);
            }
        }, [fetchedRestaurants]);

        const contextValue = useMemo(() => ({
            reviews, avatars, fetchReviews, fetchAvatars
        }), [reviews, avatars, fetchReviews, fetchAvatars]);


    return (
        <ReviewContext.Provider value={contextValue}>
            {children}
        </ReviewContext.Provider>
    )
}