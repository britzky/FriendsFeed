import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import image from "../assets/Landing_Page.jpeg";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as Font from 'expo-font';

const LandingPage = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const navigate = useNavigation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'LuckiestGuy-Regular': require('../assets/fonts/LuckiestGuy-Regular.ttf'),
        'Roboto-Bold': require('../assets/fonts/Roboto-Bold.ttf'),
        'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
        'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or some loading component
  }

  


  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <Text style={styles.title}>Friends Finder</Text>
        <Text style={styles.subtitle}>Discover new restaurants</Text>
        <Text style={styles.text2}>one friend at a time</Text>

        <Pressable
          android_ripple={{ color: "#3A4D39" }}
          style={styles.buttonText}
          onPress={() =>
            navigate.navigate("Register", { registrationFlow: true })
          }
        >
          <Text style={styles.text}>Sign-up</Text>
        </Pressable>
        <Pressable
          style={styles.buttonTwo}
          onPress={() => navigate.navigate("Login")}
        >
          <Text style={{ fontSize: 15, fontWeight: 400, marginLeft: 60, fontFamily: 'Roboto-Regular' }}>
            Already have an account? Login
          </Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};
export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    color: "#3A4D39",
    marginLeft: 65,
    fontFamily: 'LuckiestGuy-Regular'
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 0,
    margin: 0,
    width: 180,
    padding: 0,
    marginLeft: 110,
    fontFamily: 'Roboto-Regular'
  },
  button: {
    backgroundColor: "brown",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    height: 10,
  },
  buttonTwo: {
    backgroundColor: "brown",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "transparent",

    margin: 20,
  },
  buttonText: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,

    width: "85%", // Full-width button
    alignItems: "center",
    marginTop: 50,
    marginLeft: 35,
  },
  loginText: {
    color: "blue",
    marginTop: 15,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 80,
    borderRadius: 10,
    margin: 30,
  },
  text: {
    color: "white",
    fontSize: 20,
  },
  subTitle2: {
    margin: 10,
  },
  text2: {
    fontSize: 16,
    color: "#000",
    marginBottom: 20,
    margin: 0,
    width: 150,
    padding: 0,
    marginTop: 2,
    marginLeft: 125,
  },
  image: {
    justifyContent: "center",
    flex: 1,
    width: null, // Set width to null
    height: null, // Set height to null
    resizeMode: "cover",
  },
});
