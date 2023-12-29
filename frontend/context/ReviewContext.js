import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useRestaurant } from './RestaurantContext';

const ReviewContext = createContext();

export const useReview = () => {
    return useContext(ReviewContext);
}

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState({}); // fetch all reviews for the restaurant selected
    const [avatars, setAvatars] = useState({}); // fetch all avatars for friends who have reviewed the restaurant
    const [fetchedRestaurants, setFetchedRestaurants] = useState(new Set()); // To track fetched restaurants
    const [reviewPosted, setReviewPosted] = useState(false); // To track if a review has been posted
    const { accessToken } = useAuth();
    const { restaurants } = useRestaurant();

    // extract the restaurantId from the restaurant object
    const restaurantIds = useMemo(() => restaurants.map(restaurant => restaurant.id), [restaurants]);
    console.log("These are the restaurantIds: ", restaurantIds);

    // fetch all friend-reviews for the restaurant selected
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

        // fetch all friend-avatars for the restaurant selected
        const fetchAvatars = useCallback(async (restaurantIds) => {
            console.log("Fetching avatars for restaurantIds: ", restaurantIds)
            if (restaurantIds.length === 0) {
                return;
            }
            try {
                const queryString = restaurantIds.map(id => `restaurant_ids=${encodeURIComponent(id)}`).join('&');
                const url = `https://colab-test.onrender.com/restaurants/friend-avatars?${queryString}`
                console.log("Fetching avatars from URL: ", url)
                const response = await fetch(url,
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
                    setAvatars(prevAvatars => ({
                        ...prevAvatars,
                        ...data //
                    }));
                    setFetchedRestaurants(new Set([...Array.from(fetchedRestaurants), ...restaurantIds]));
                } else {
                    console.log("Error fetching avatars:", response.status, await response.text());
                }

            } catch (error) {
                console.log(error);
            }
        }, [fetchedRestaurants, restaurantIds]);

        const postReview = useCallback(async (restaurantId, rating, comment, accessToken) => {
            try {
                const response = await fetch(
                    "https://colab-test.onrender.com/review/create",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            yelp_restaurant_id: restaurantId,
                            rating,
                            comment,
                        }),
                    }
                );
                const result = await response.json();
                console.log("This is the review being sent to the backend", result);
                if (response.ok) {
                    setReviewPosted(true);
                }
            } catch (error) {
                console.error("Error posting review", error);
            }
        }, []);


        const deleteReview = useCallback(async (reviewsId, accessToken) => {
            try {
              const response = await fetch(`https://colab-test.onrender.com/reviews/${reviewsId}/delete`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              });
          
              if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`Error ${response.status}: ${errorBody.message}`);
              }
          
              return await response.json();
            } catch (error) {
              console.error('Error deleting review:', error.message);
              throw error;
            }
          }, [accessToken]);



        

        //function to reset the reviewPosted state
        const resetReviewPosted = useCallback(() => {
            setReviewPosted(false);
        }, []);

        // function to rerun the fetchAvatars function when restaurantIds change
        const refreshAvatars = useCallback(() => {
            setFetchedRestaurants(new Set());
            fetchAvatars(restaurantIds);
        }, [fetchAvatars]);

        const contextValue = useMemo(() => ({
            reviews, avatars, fetchReviews, fetchAvatars, postReview,
            reviewPosted, resetReviewPosted, refreshAvatars, deleteReview
        }), [reviews, avatars, fetchReviews, fetchAvatars, postReview,
            reviewPosted, resetReviewPosted, refreshAvatars, deleteReview]);


    return (
        <ReviewContext.Provider value={contextValue}>
            {children}
        </ReviewContext.Provider>
    )
}