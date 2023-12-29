import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from "../screens/Register";
import Login from "../screens/Login";
import { enableScreens } from "react-native-screens";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../screens/LandingPage";
import { ChooseAvatar } from "../screens/ChooseAvatar";
import { Header } from "../components/Header";
import { Navbar } from "./Navbar";
import { Friend } from "../screens/Friend";

enableScreens();

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { loading, inRegistrationFlow, isLoggedIn, setInRegistrationFlow } = useAuth();

  useEffect(() => {
    if(!isLoggedIn) {
      setInRegistrationFlow(true);
    }
  }, [isLoggedIn])

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" />
      </View>
    )
  }

  console.log("isLoggedIn:", isLoggedIn, "inRegistrationFlow:", inRegistrationFlow);

  const initialRouteName = isLoggedIn ? (inRegistrationFlow ? "Navbar" : "LandingPage") : "LandingPage";
  console.log("initialRouteName:", initialRouteName);


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        {!inRegistrationFlow ? (
          <Stack.Screen name="Navbar" component={Navbar} options={{headerShown: false}} />
        ) : (
          <Stack.Group>
            <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }}/>
            <Stack.Screen name="Register" component={Register} options={{ header: () => <Header /> }}/>
            <Stack.Screen name="ChooseAvatar" component={ChooseAvatar} options={{ header: () => <Header /> }}/>
            <Stack.Screen name="Friend" component={Friend} options={{ header: () => <Header /> }}/>
            <Stack.Screen name="Login" component={Login} options={{ header: () => <Header />  }}/>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
