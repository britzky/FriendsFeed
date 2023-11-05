import { StatusBar } from "expo-status-bar";
import { StyleSheet,} from "react-native";
import { AuthContext } from "./context/AuthContext";
import { AppNavigator } from "./navigation/AppNavigator";
import "react-native-gesture-handler";

global.Buffer = global.Buffer || require('buffer').Buffer;

global.atob = global.atob || function(encoded) {
  return require('buffer').Buffer.from(encoded, 'base64').toString('binary');
};
global.btoa = global.btoa || function(binary) {
  return require('buffer').Buffer.from(binary, 'binary').toString('base64');
};


export default function App() {
  return (
    <AuthContext>
        <AppNavigator style={styles.container} />
        <StatusBar style="auto" />
    </AuthContext>
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
