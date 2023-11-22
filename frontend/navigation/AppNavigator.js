import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TempHome } from "../screens/TempHome";
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

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Friend" component={Friend} />
      <Tab.Screen name="TempHome" component={TempHome}  />
      <Tab.Screen name="SearchRestaurant" component={SearchRestaurant} />
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
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ChooseAvatar" component={ChooseAvatar} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
