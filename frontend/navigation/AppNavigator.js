import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Home } from "../screens/Home";
import Register from "../screens/Register";
import Login from "../screens/Login";
import { enableScreens } from "react-native-screens";
import { useAuth } from "../context/AuthContext";
// import RestaurantList from "../components/RestaurantList";
import LandingPage from "../screens/LandingPage";
import RestaurantTile from "../components/RestaurantCard";

enableScreens();

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { isLoggedIn } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RestaurantList">
        {isLoggedIn ? (
          <Stack.Group>
            {/* <Stack.Screen name="RestaurantList" component={RestaurantList} /> */}
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="RestaurantTile" component={RestaurantTile} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
