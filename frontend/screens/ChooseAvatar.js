import React, { useState, useEffect } from 'react';
import { avatars } from '../assets';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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

    // Side effect to check if accessToken and userDetails are available before setting isLoggedIn to true
    useEffect(() => {
        if (accessToken && userDetails) {
            setIsLoggedIn(true);
        }
    }, [accessToken, userDetails]);

    useEffect(() => {
        const navigateIfReady = async () => {
            const isNewUser = await AsyncStorage.getItem('isNewUser');
            // Check if all necessary conditions are met
            if (isNewUser === 'true' && isLoggedIn) {
                navigation.navigate('Friend', { registrationFlow: true });
                await AsyncStorage.removeItem('isNewUser'); // Optional: Clear isNewUser flag
            }
        };
        navigateIfReady();
    }, [isLoggedIn, navigation, route.params]);

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Friends Feed</Text>
        <Text style={styles.subTitle}>Pick an avatar for your Friends Feed profile.</Text>
        <View style={styles.avatarGrid}>
        {Object.keys(avatars).map((key) => (
            <TouchableOpacity key={key} onPress={() => handleCompleteRegistration(key)}>
                <Image source={avatars[key]} style={styles.avatar} />
            </TouchableOpacity>
        ))}
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 20,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 10,
    },
    subTitle: {
      fontSize: 14,
      color: 'gray',
      marginBottom: 20,
    },
    avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      margin: 10, // Adjust the margin as needed
    },
  });

