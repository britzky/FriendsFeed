import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import Login from "./screens/Login";
import Register from "./screens/Register";


// import RestaurantList from "./screens/RestaurantList";
import RestaurantTile from "./components/RestaurantTile";
import RestaurantList from "./screens/RestaurantList";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import FriendScreen from "./screens/FriendScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="RestaurantList" component={RestaurantList} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="RestaurantTile" component={RestaurantTile} />
          <Stack.Screen name="Friends" component={FriendScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
