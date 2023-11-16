import React from 'react';
import { avatars } from '../assets';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const ChooseAvatar = () => {
    const { userDetails, setIsLoggedIn } = useAuth();
    const navigation = useNavigation();

    const handleCompleteRegistration = async (selectedAvatar) => {
        const completedUserDetails = { ...userDetails, profile_picture: selectedAvatar };
        navigation.navigate('');

        try {
            const response = await fetch('https://colab-test.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(completedUserDetails)
            });

            if (response.ok) {
                const data = await response.json()
                await AsyncStorage.setItem('access_token', data.access_token)
                await AsyncStorage.setItem('user_details', JSON.stringify(data.user))
                setIsLoggedIn(true);
            } else {
                console.error('Registration failed with status: ', response.status)
            }
            } catch (error) {
                console.error(error);
            }
            console.log("Completed userDetails: ", completedUserDetails)
        }

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

