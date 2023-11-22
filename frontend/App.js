import { StatusBar } from "expo-status-bar";
import { StyleSheet,} from "react-native";
import { AuthProvider } from "./context/AuthContext";
import { FriendProvider } from "./context/FriendContext";
import { ReviewProvider } from "./context/ReviewContext";
import { LocationProvider } from "./context/LocationContext";
import { AppNavigator } from "./navigation/AppNavigator";


global.Buffer = global.Buffer || require('buffer').Buffer;

global.atob = global.atob || function(encoded) {
  return require('buffer').Buffer.from(encoded, 'base64').toString('binary');
};
global.btoa = global.btoa || function(binary) {
  return require('buffer').Buffer.from(binary, 'binary').toString('base64');
};


export default function App() {
  return (
    <AuthProvider>
      <FriendProvider>
        <ReviewProvider>
          <LocationProvider>
            <AppNavigator style={styles.container} />
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
