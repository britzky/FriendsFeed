import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Register from "../screens/Register";
import Login from "../screens/Login";
import { enableScreens } from "react-native-screens";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../screens/LandingPage";
import { Friend } from "../screens/Friend";
import Restaurant from "../screens/Restaurant";
import { Review } from "../screens/Review";
import { ChooseAvatar } from "../screens/ChooseAvatar";
import { Home } from "../screens/Home";
import { SearchRestaurant } from "../screens/SearchRestaurant";
import Icon from 'react-native-vector-icons/Feather';
import AntDesign from "react-native-vector-icons/AntDesign";
import Material from "react-native-vector-icons/Ionicons";
import { Keyboard } from 'react-native';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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
      <Tab.Screen name="Home" component={Home} options={{
        tabBarIcon: ({color, size}) => (
          <Icon name="home" color={color} size={size}/>
        ),
        tabBarLabel: () => null,

      }}/>
      <Tab.Screen name="Friend" component={Friend}
      options={{
        tabBarIcon: ({color, size}) => (
          <AntDesign name="addusergroup" color={color} size={size}/>
        ),
        tabBarLabel: () => null
      }}

      />
      <Tab.Screen name="SearchRestaurant" component={SearchRestaurant}
      options={{
        tabBarIcon: ({color, size}) => (
          <Material name="restaurant-outline" color={color} size={size}/>
        ),
        tabBarLabel: () => null
      }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
      </View>
    )
  }
  const initialRouteName = isLoggedIn ? "HomeTabs" : "LandingPage";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        {isLoggedIn ? (
          <Stack.Group>
            <Stack.Screen name="HomeTabs" component={HomeTabs} options={{headerShown: false}} />
            <Stack.Screen name="Restaurant" component={Restaurant} />
            <Stack.Screen name="Review" component={Review} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={Register} options={{ headerTitle: '' }}/>
            <Stack.Screen name="ChooseAvatar" component={ChooseAvatar} options={{ headerTitle: '' }}/>
            <Stack.Screen name="Login" component={Login} options={{ headerTitle: '' }}/>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
