import { View, Text, StyleSheet, Pressable, ImageBackground, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import image from "../assets/Landing_Page.jpeg";


const windowWidth = Dimensions.get('window').width;

const isLargeScreen = windowWidth > 600;
const isMediumScreen = windowWidth > 400 && windowWidth <= 600;
const isSmallScreen = windowWidth <= 400;

const LandingPage = () => {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <Text style={styles.title}>Friends Feed</Text>
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
          <Text style={styles.underTitle}>
            Already have an account? <Text style={styles.bold}>Login</Text>
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
    fontSize: isSmallScreen ? 20 : isMediumScreen ? 40 : 100, 
    marginBottom: 20,
    color: "#3A4D39",
    marginLeft: 65,
    fontFamily: 'LuckiestGuy-Regular'
  },
  subtitle: {
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 16 : 30, 
    color: "#000",
    marginBottom: 0,
    margin: 0,
    width: 180,
    padding: 0,
    marginLeft: isSmallScreen ? 10 : isMediumScreen ? 110 : 300, 
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
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 20 : 40, 
  },
  subTitle2: {
    margin: 10,
  },
  text2: {
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 16 : 30, 
    color: "#000",
    marginBottom: 20,
    margin: 0,
    width: 150,
    padding: 0,
    marginTop: 2,
    marginLeft: isSmallScreen ? 10 : isMediumScreen ? 125 : 300, 
  },
  image: {
    justifyContent: "center",
    flex: 1,
    width: null, // Set width to null
    height: null, // Set height to null
    resizeMode: "cover",
  },
  bold: {
    fontWeight: "bold",
  },
  underTitle: {
    fontSize: isSmallScreen ? 8 : isMediumScreen ? 15 : 30, 
    marginLeft: 60, 
    fontFamily: 'Roboto-Regular' 

  }
});
