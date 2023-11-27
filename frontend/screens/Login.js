import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SIGNIN_URL = "https://colab-test.onrender.com/signin";

export default function Login() {
  const { isLoggedIn, userDetails, accessToken, setIsLoggedIn, setUserDetails, setAccessToken } = useAuth();
  const navigate = useNavigation();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    username: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
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
        if (response.ok) {
          const data = await response.json();
          await AsyncStorage.setItem("access_token", data.access_token);
          await AsyncStorage.setItem("refresh_token", data.refresh_token);
          await AsyncStorage.setItem("user_details", JSON.stringify(data.user));
          setUserDetails(data.user);
          setAccessToken(data.access_token);
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

  // Side effect to check if accessToken and userDetails are available before setting isLoggedIn to true
  useEffect(() => {
    if (accessToken && userDetails) {
      setIsLoggedIn(true);
    }
  }, [accessToken, userDetails]);

  // Side effect to navigate to Home screen if user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate.navigate("HomeTabs", { screen: "Home" });
    }
  }, [isLoggedIn, navigate])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends Feed</Text>
      <Text style={styles.subtitle}>Discover new restaurants</Text>
      <Text style={styles.text2}>one friend at a time</Text>
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

      <Pressable android_ripple={{ color: "#3A4D39" }} style={styles.buttonText} onPress={handleSubmit} disabled={loading}>
        {loading ?
          <ActivityIndicator size="small" color="#fff" />:
          <Text style={styles.text}>Login</Text>
        }
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    width: "100%",

  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    padding: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    paddingHorizontal: 155,
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginVertical: 10,
    color: "white",
    marginTop: 30,

  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 0,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 0,
    marginBottom: 15,
    padding: 0,
  },
  text2: {
    fontSize: 16,
    color: "#000",
    marginBottom: 30,
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

