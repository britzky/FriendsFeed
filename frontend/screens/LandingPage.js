import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const isLargeScreen = windowWidth > 600;

const LandingPage = () => {
  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food.Finder</Text>
      <Text style={styles.subtitle}>
        Discover new restaurants
      </Text>
      <Text style={styles.text2}>
         one friend at a time
      </Text>
      <Image
        source={{
          uri: "https://i.natgeofe.com/k/6f2282df-1c6a-474a-9216-ed97b3dce858/Panda-Bamboo_Panda-Quiz_KIDS_1021.jpg",
        }} // Using a remote placeholder image
        style={styles.logo}
      />
      <Pressable style={styles.buttonText} onPress={() => navigate.navigate("Register")}>
        <Text style={styles.text} >Sign-up</Text>
      </Pressable>
      <Pressable style={styles.buttonTwo} onPress={() => navigate.navigate("Login")}>
        <Text style={{fontSize: 15}}>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
};
export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 30, // was 24, now larger
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 0,
    margin: 0,
    width: 180,
    padding: 0
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
    color: "blue",
    margin: 20,
  },
  buttonText: {
    paddingHorizontal: isLargeScreen ? 150 : 80, // Add horizontal padding to make the button wider
    paddingVertical: 15, // Add vertical padding for height
    backgroundColor: '#3d85c6', // Your desired background color
    borderRadius: 5, // Rounded corners
    // Add any other styling you want for the button here, like margin
    marginVertical: 10,
    color: 'white',
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
    margin: 30
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  subTitle2: {
    margin: 10,
  },
  text2: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    margin: 0,
    width: 150,
    padding: 0,
    marginTop: 2
  }
});
