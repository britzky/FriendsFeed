import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  const navigateToRegister = () => {
    navigation.navigate("Register");
  };

  // const navigateToLogin = () => {
  //   navigation.navigate("Login");
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food.Finder</Text>
      <Text style={styles.subtitle}>
        Discover restaurants one friend at a time
      </Text>
      <Image
        source={{
          uri: "https://i.natgeofe.com/k/6f2282df-1c6a-474a-9216-ed97b3dce858/Panda-Bamboo_Panda-Quiz_KIDS_1021.jpg",
        }} // Using a remote placeholder image
        style={styles.logo}
      />
      <Button
        style={styles.buttonText}
        title="Sign-Up"
        onPress={navigateToRegister}
      />

      
      {/* <Button
        title="Already have an account? Login"
        onPress={navigateToLogin}
      /> */}

      <Pressable style={styles.buttonTwo}  onPress={() => navigation.navigate('Login')}>
      <Text>Already have an account? Login</Text>
      </Pressable>
    </View>
  );
};
export default Home;

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
    marginBottom: 20,
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
    color: 'blue',
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    padding: 0,
  },
  loginText: {
    color: "blue",
    marginTop: 15,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
    borderRadius: 10,
  },
});
