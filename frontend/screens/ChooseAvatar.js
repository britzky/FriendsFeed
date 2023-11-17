import React, { useState, useEffect } from 'react';
import { avatars } from '../assets';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const ChooseAvatar = ({ route }) => {
    const { userDetails, setIsLoggedIn, isLoggedIn, setUserDetails, setAccessToken, accessToken } = useAuth();
    const navigation = useNavigation();
    const { registrationFlow } = route.params;
    console.log("This is the ChooseAvatar registration flow status: ", registrationFlow)

    const handleCompleteRegistration = async (selectedAvatar) => {
        const completedUserDetails = { ...userDetails, profile_picture: selectedAvatar };

        try {
            const response = await fetch('https://colab-test.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(completedUserDetails)
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Registration completed successfully:', data);
                await AsyncStorage.setItem('user_details', JSON.stringify(data));
                await AsyncStorage.setItem('access_token', data.access_token);
                await AsyncStorage.setItem('refresh_token', data.refresh_token);
                setIsLoggedIn(true);
                setUserDetails(data.user);
                setAccessToken(data.access_token);
                await AsyncStorage.setItem('isNewUser', 'true');
            } else {
                console.error('Error completing registration:', data);
            }
        } catch (error) {
            console.error('Error completing registration:', error);
        }
    }

    useEffect(() => {
        const navigateIfReady = async () => {
            const isNewUser = await AsyncStorage.getItem('isNewUser');
            // Check if all necessary conditions are met
            if (isNewUser === 'true' && isLoggedIn && userDetails && accessToken && route.params?.registrationFlow) {
                navigation.navigate('Friend', { registrationFlow: true });
                await AsyncStorage.removeItem('isNewUser'); // Optional: Clear isNewUser flag
            }
        };
        navigateIfReady();
    }, [isLoggedIn, userDetails, accessToken, navigation, route.params]);

  return (
    <View>
        <Text>Pick an avatar for your Friends Feed profile.</Text>
        {Object.keys(avatars).map((key) => (
            <TouchableOpacity key={key} onPress={() => handleCompleteRegistration(key)}>
                <Image source={avatars[key]} style={{width: 100, height: 100}} />
            </TouchableOpacity>
        ))}
    </View>
  )
}

