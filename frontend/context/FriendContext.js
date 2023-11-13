import React, { createContext, useState, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';


export const FriendContext = createContext();

export const useFriends = () => {
    return useContext(FriendContext);
};

export const FriendProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const { accessToken } = useAuth();

    const fetchFriends = useCallback(async (accessToken) => {
        try {
            const response = await fetch('https://colab-test.onrender.com/friends', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json()
            console.log("Freched Friends data: ", data)
            setFriends(data)
        } catch (error) {
            console.error('There was a problem fetching friends:', error);
        }
    }, [accessToken]);

    const followFriend = async (username) => {
        try {
            const response = await fetch('https://colab-test.onrender.com/follow-friend', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friend_username: username }),
            })
            console.log("Following friend request body:", JSON.stringify({ friend_username: username }));

            const data = await response.json();

            if (!response.ok) {
                console.error('Error following friend:', data);
                throw new Error(data.message || 'Error following friend');
            }

            await fetchFriends(accessToken);
        } catch (error) {
            console.error('Error following friend:', error);
        }

    }

    const unfollowFriend = async (username) => {
        try {
            const response = await fetch('https://colab-test.onrender.com/remove-friend', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friend_username: username }),
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error unfollowing friend');
            }

            await fetchFriends(accessToken);
        } catch (error) {
            console.error('Error unfollowing friend:', error);
        }

    }

    const updateFriends = (newFriends) => {
        setFriends(newFriends)
    }
    return (
        <FriendContext.Provider value={{ friends, fetchFriends, updateFriends, followFriend, unfollowFriend }}>
            {children}
        </FriendContext.Provider>
    )
}