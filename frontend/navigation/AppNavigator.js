import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../screens/Home";
import Register from "../screens/Register";
import Login from "../screens/Login";
import { enableScreens } from "react-native-screens";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../screens/LandingPage";
import { Friend } from "../screens/Friend";
import Restaurant from "../screens/Restaurant";
import { Review } from "../screens/Review";
import { ChooseAvatar } from "../screens/ChooseAvatar";

enableScreens();

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
      </View>
    )
  }
  const initialRouteName = isLoggedIn ? "Home" : "LandingPage";

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        {isLoggedIn ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Friend" component={Friend} />
            <Stack.Screen name="Restaurant" component={Restaurant} />
            <Stack.Screen name="Review" component={Review} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="ChooseAvatar" component={ChooseAvatar} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
