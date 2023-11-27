import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import { FriendProvider } from "./context/FriendContext";
import { ReviewProvider } from "./context/ReviewContext";
import { LocationProvider } from "./context/LocationContext";
import { RestaurantProvider } from "./context/RestaurantContext";
import { AppNavigator } from "./navigation/AppNavigator";
import * as Font from 'expo-font';



global.Buffer = global.Buffer || require('buffer').Buffer;

global.atob = global.atob || function(encoded) {
  return require('buffer').Buffer.from(encoded, 'base64').toString('binary');
};
global.btoa = global.btoa || function(binary) {
  return require('buffer').Buffer.from(binary, 'binary').toString('base64');
};


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'LuckiestGuy-Regular': require('./assets/fonts/LuckiestGuy-Regular.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <ActivityIndicator size='large' />; // Or some loading component
  }

  return (
    <AuthProvider>
      <FriendProvider>
        <ReviewProvider>
          <LocationProvider>
            <RestaurantProvider>
              <AppNavigator style={styles.container} />
            </RestaurantProvider>
          </LocationProvider>
        </ReviewProvider>
        <StatusBar style="auto" />
      </FriendProvider>
    </AuthProvider>
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
