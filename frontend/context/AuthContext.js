import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext()

export const useAuth = () => {

    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [accessToken, setAccessToken] = useState(null)
    const [loading, setLoading] = useState(true);
    const [inRegistrationFlow, setInRegistrationFlow] = useState(false);

    useEffect(() => {
        checkLoginStatus()
    }, [checkLoginStatus]);

    useEffect(() => {
        console.log('Access Token Updated:', accessToken)
        console.log('User Details Updated:', userDetails)
        console.log('Is Logged In Updated:', isLoggedIn)
        console.log('inRegistrationFlow Updated:', inRegistrationFlow)
    }, [accessToken, userDetails, isLoggedIn, inRegistrationFlow])

    const checkServerReadiness = async () => {
        try {
            const response = await fetch('https://colab-test.onrender.com/health');
            return response.ok;
        } catch (error) {
            return false
        }
    }

    const checkLoginStatus = useCallback(async () => {
        let attempts = 0;
        const maxAttempts = 5;
        const attemptDelay = 15000;

        const attemptFetch = async () => {
            const isReady = await checkServerReadiness();
            if (isReady) {
                await checkLoginInfo();
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    await new Promise(resolve => setTimeout(resolve, attemptDelay));
                    await attemptFetch();
                } else {
                    setLoading(false);
                }
            }
        };
        await attemptFetch();
    }, [refreshToken])

    const checkLoginInfo = useCallback(async () => {
        try{
            const token = await AsyncStorage.getItem('access_token');
            if (token) {
                // Decode token to check expiration
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    await refreshToken()
                } else {
                    setAccessToken(token);
                    const userDetailsString = await AsyncStorage.getItem('user_details');
                    const user = JSON.parse(userDetailsString)
                    if (user) {
                        setUserDetails(user);
                        setIsLoggedIn(true);
                    }
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error retrieving login info from AsyncStorage: ', error)
            setLoading(false);
        }

    }, [refreshToken])

    const refreshToken = async () => {
        try {
            const refreshToken = await AsyncStorage.getItem('refresh_token')
            const response = await fetch('https://colab-test.onrender.com/token-refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                await AsyncStorage.setItem('access_token', data.access_token);
                await AsyncStorage.setItem('user_details', JSON.stringify(data.user));
                setAccessToken(data.access_token);
                setUserDetails(data.user); // Update user details in context
                setIsLoggedIn(true);
            } else {
                // If the refresh token is also expired or not valid
                logout()
            }
        } catch (error) {
            console.log("An error occurred during token refresh: ", error)
            logout();
        }
    };

    const registerUser = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch("https://colab-test.onrender.com/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const data = await response.json();
                AsyncStorage.setItem('user_details', JSON.stringify(data.user));
                AsyncStorage.setItem('access_token', data.access_token);
                AsyncStorage.setItem('refresh_token', data.refresh_token);
                setUserDetails(data.user);
                setAccessToken(data.access_token);

            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error("Error registering user:", error);
            setLoading(false);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const loginUser = async (username, password) => {
        const credentials = {
            username: username,
            password: password
        }
        setLoading(true);
        try {
            const response = await fetch("https://colab-test.onrender.com/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (response.ok) {
                AsyncStorage.setItem('user_details', JSON.stringify(data.user));
                AsyncStorage.setItem('access_token', data.access_token);
                AsyncStorage.setItem('refresh_token', data.refresh_token);
                setUserDetails(data.user);
                setAccessToken(data.access_token);
            } else {
                setLoading(false);
                throw new Error(data.message);
            }
        } catch (error) {
            setLoading(false);
            throw error;
        }
    }

    const logout = async () => {
        await AsyncStorage.clear(); // Clear all AsyncStorage data
        console.log("AsyncStorage after clear: ", await AsyncStorage.getAllKeys()); // This should return an empty array
        setInRegistrationFlow(true);
        setIsLoggedIn(false);
        setUserDetails(null);
        setAccessToken(null);
    };

    const contextValue = {
         isLoggedIn,
         setIsLoggedIn,
         userDetails,
         setUserDetails,
         accessToken,
         setAccessToken,
         refreshToken,
         logout,
         loading,
         inRegistrationFlow,
         setInRegistrationFlow,
         registerUser,
         loginUser,
    }

  return (
    <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>
  )
}
