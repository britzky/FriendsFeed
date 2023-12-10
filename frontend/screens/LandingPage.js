import { View, Text, StyleSheet, Pressable, ImageBackground, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import image from "../assets/Landing_Page.jpeg";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const { setInRegistrationFlow } = useAuth();
  const navigate = useNavigation();

  return (
    <View style={{flex: 1}}>
      <ImageBackground source={image} style={{flex: 1}}>
        <View style={styles.mainContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Friends Feed</Text>
              <Text style={styles.subtitle}>Discover new restaurants one friend at a time</Text>
            </View>
          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#3A4D39" }}
              style={styles.button}
              onPress={() => {
                setInRegistrationFlow(true);
                navigate.navigate("Register");
              }}
            >
              <Text style={styles.signUpText}>Sign-up</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setInRegistrationFlow(true); // Use the function from the hook
                navigate.navigate("Login");
              }}
            >
              <Text>
                Already have an account? <Text style={{fontFamily: 'Roboto-Bold'}}>Log In</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
export default LandingPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center'
  },
  header: {
    alignSelf: 'center',
    maxWidth: 250
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 40,
    fontFamily: 'LuckiestGuy-Regular',
    color: '#064e3b',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    backgroundColor: "#739072",
    borderRadius: 5,
    maxWidth: 300,
    width: "85%",
    alignItems: "center",
    marginBottom: 20,
  },
  signUpText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
});
