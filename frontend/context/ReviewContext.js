import React, { createContext, useContext, useState } from 'react';

const ReviewContext = createContext();

export const useReview = () => {
    return useContext(ReviewContext);
}

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]); // fetch all reviews for the restaurant selected
    const [avatars, setAvatars] = useState([]); // fetch all avatars for friends who have reviewed the restaurant
    const [fetchedRestaurants, setFetchedRestaurants] = useState(new Set());

    const fetchReviews = async (restaurantId, accessToken) => {
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
        };

        const fetchAvatars = async (restaurantId, accessToken) => {
            // Avoid fetching avatars for the same restaurant twice
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
                    console.log("These are the avatars", data);
                    setAvatars(prevAvatars => ({
                        ...prevAvatars,
                        [restaurantId]: data,
                    }));
                    //Update the fetchedRestaurants to avoid fetching avatars for the same restaurant twice
                    setFetchedRestaurants(prev => new Set(prev.add(restaurantId)));
                } else {
                    console.log("Error fetching avatars:", response.status, await response.text());
                }

            } catch (error) {
                console.log(error);
            }
        }


    return (
        <ReviewContext.Provider value={{ reviews, avatars, fetchReviews, fetchAvatars, fetchedRestaurants }}>
            {children}
        </ReviewContext.Provider>
    )
}