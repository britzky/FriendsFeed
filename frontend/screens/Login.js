import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SIGNIN_URL = "https://colab-test.onrender.com/signin";

export default function Login() {
  const { isLoggedIn, setIsLoggedIn, setUserDetails } = useAuth();
  const navigate = useNavigation();
  const [formData, setFormData] = useState({
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // Perform validation here and set errors if necessary
    const validationErrors = {};
    if (!formData.username) {
      validationErrors.username = "username is required";
    }
    if (!formData.password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(SIGNIN_URL, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        });
        console.log(formData);
        if (response.ok) {
          Alert.alert("Alert Title", "You are successfully logged in");
          const data = await response.json();
          console.log("Login successful:", data);
          await AsyncStorage.setItem("access_token", data.access_token);
          await AsyncStorage.setItem("refresh_token", data.refresh_token);
          await AsyncStorage.setItem("user_details", JSON.stringify(data.user));
          setIsLoggedIn(true);
          setUserDetails(data.user);
          navigate.navigate("Home");
        } else {
          console.log("Login Failed:", response.status);
        }
      } catch (error) {
        // Handle network or server errors here
        console.error("An error occurred:", error);
      }
    } else {
      // Form is not valid, update the errors state
      setErrors(validationErrors);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food.Finder</Text>
      <Text style={styles.subtitle}>Discover new restaurants</Text>
      <Text style={styles.text2}>one friend at a time</Text>
      {isLoggedIn ? (
        <Text>Your logged in</Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="username"
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <Pressable style={styles.buttonText} onPress={handleSubmit}>
            <Text style={styles.text}>Login</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "100%", // Ensure it's 100% of the parent
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30, // was 24, now larger
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    paddingHorizontal: 118, // Add horizontal padding to make the button wider
    paddingVertical: 15, // Add vertical padding for height
    backgroundColor: "#3d85c6", // Your desired background color
    borderRadius: 5, // Rounded corners
    // Add any other styling you want for the button here, like margin
    marginVertical: 10,
    color: "white",
    marginTop: 100,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 0,
  },
  errorText: {
    color: "red",
    fontSize: 13, // Adjust the font size as needed
    marginTop: 0, // Reduced top margin to bring it closer to the input field
    marginBottom: 15,
    padding: 0, // Add bottom margin for spacing before the next input
  },
  text2: {
    fontSize: 16,
    color: "gray",
    marginBottom: 70,
    margin: 0,
    width: 150,
    padding: 0,
    marginTop: 2,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
