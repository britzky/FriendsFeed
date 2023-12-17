import React, { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../context/AuthContext";
import { Home } from '../screens/Home';
import { SearchRestaurant } from '../screens/SearchRestaurant';
import { Friend } from '../screens/Friend';
import { Header } from "../components/Header";
import { GlobalStack } from "./GlobalStack";
import Icon from 'react-native-vector-icons/Feather';
import AntDesign from "react-native-vector-icons/AntDesign";
import Material from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export const Navbar = () => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const { inRegistrationFlow } = useAuth();

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // Keyboard is open
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // Keyboard is closed
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#739072',
                tabBarStyle: { display: keyboardVisible ? 'none' : 'flex' },
            }}
        >
            <Tab.Screen name="GlobalStack" component={GlobalStack} options={{ tabBarButton: () => null, headerShown: false }} />
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                tabBarIcon: ({color, size}) => (
                    <Icon name="home" color={color} size={size}/>
                ),
                tabBarLabel: () => null,
                headerShown: false,
                headerTitle: ''
                }}
            />
            <Tab.Screen
                name="Friend"
                component={Friend}
                options={{
                tabBarIcon: ({color, size}) => (
                    <AntDesign name="addusergroup" color={color} size={size}/>
                ),
                tabBarLabel: () => null,
                headerShown: inRegistrationFlow,
                header: inRegistrationFlow ? () => <Header /> : undefined
                }}
            />
            <Tab.Screen
                name="SearchRestaurant"
                component={SearchRestaurant}
                options={{
                tabBarIcon: ({color, size}) => (
                    <Material name="restaurant-outline" color={color} size={size}/>
                ),
                tabBarLabel: () => null,
                headerShown: false
                }}
            />
        </Tab.Navigator>
  )
}
