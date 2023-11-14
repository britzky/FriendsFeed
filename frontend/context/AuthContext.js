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

    useEffect(() => {
        console.log('Access Token Updated:', accessToken)
    }, [accessToken])

    const checkLoginStatus = useCallback(async () => {
        try{
            const token = await AsyncStorage.getItem('access_token');
            if (token) {
                setAccessToken(token)
            }
            const userDetailsString = await AsyncStorage.getItem('user_details');
            const user = JSON.parse(userDetailsString)

            if (token) {
                // Decode token to check expiration
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    await refreshToken()
                } else {
                    setIsLoggedIn(true);
                }
            }

            if (user) {
                setUserDetails(user);
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
                setAccessToken(data.access_token)
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

    const logout = async () => {
        await AsyncStorage.removeItem('access_token');
        await AsyncStorage.removeItem('user_details');
        setIsLoggedIn(false);
        setUserDetails(null);
    };

    useEffect(() => {
        checkLoginStatus()
    }, [checkLoginStatus]);


  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userDetails, setUserDetails, accessToken, setAccessToken, refreshToken, logout, loading }}>
        {children}
    </AuthContext.Provider>
  )
}
