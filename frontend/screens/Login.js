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
import Eye from "react-native-vector-icons/Ionicons";

const SIGNIN_URL = "https://colab-test.onrender.com/signin";

export default function Login() {
  const {
    isLoggedIn,
    userDetails,
    accessToken,
    setIsLoggedIn,
    setUserDetails,
    setAccessToken,
    setInRegistrationFlow,
  } = useAuth();
  const navigate = useNavigation();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ password: "", username: "" });
  const [authError, setAuthError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setAuthError(null);
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
        } else if (response.status === 400) {
          // Set authentication error message
          setAuthError("Username or password is incorrect");
          setLoading(false);
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
      setInRegistrationFlow(false);
      navigate.navigate("HomeTabs", { screen: "Home" });
    }
  }, [isLoggedIn, navigate]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>
          Discover new restaurants one friend at a time
        </Text>
        <TextInput
          style={styles.input}
          placeholder="@Username"
          value={formData.username}
          onChangeText={(text) => handleChange("username", text)}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.username}</Text>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={!isPasswordVisible}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          {authError !== "" && (
            <Text style={styles.errorText}>{authError}</Text>
          )}
          <Pressable onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Eye
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          </Pressable>
        </View>

        <Pressable
          android_ripple={{ color: "#3A4D39" }}
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.text}>Login</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    width: "90%",
    maxWidth: 400,
    gap: 15,
  },
  input: {
    width: "100%",
    borderColor: "#739072",
    borderWidth: 1,
    paddingLeft: 15,
    paddingTop: 9,
    paddingBottom: 9,
    borderRadius: 5,
    paddingRight: 50,
  },

  button: {
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor: "#739072",
    borderRadius: 5,
    width: "100%", // Full-width button
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    marginBottom: 30,
    marginTop: 5,
    maxWidth: 250,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 0,
    marginBottom: 15,
    padding: 0,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
  eyeIcon: {
    marginLeft: -40,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
