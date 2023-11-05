import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SIGNIN_URL = "https://colab-test.onrender.com/signin";

export default function Login() {
  const navigate = useNavigation()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (data) => {
    // Perform validation here and set errors if necessary
    const validationErrors = {};
    if (!formData.username) {
      validationErrors.username = "username is required";
    }
    if (!formData.password) {
      validationErrors.password = "Password is required";
    }
    if (!formData.email) {
      validationErrors.email = "email is required";
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
          Alert.alert(
            "Alert Title",
            "You are successfully logged in",
            [
              {
                text: "OK",
                onPress: () => console.log("OK Pressed"),
              },
            ],
            { cancelable: false }
          );
          // Registration was successful, navigate to the user's dashboard or login screen
          // navigation.navigate("Dashboard"); // Adjust the screen name as needed
          const data = await response.json();
          console.log("Login successful:", data);
          setIsLoggedIn(true);
          navigate.navigate("RestaurantList"); 
        } else {
          // Handle registration errors here
          const errorData = await response.json();
          console.error(errorData.message);
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
      <Text style={styles.title}>Food.Finder.</Text>
      <Text style={styles.subtitle}>
        Discover restaurants one friend at a time
      </Text>
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
            placeholder="email"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

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

          <Button title="Login" onPress={handleSubmit} />
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
    fontSize: 24,
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
    color: "white",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20, // was 16, now larger
    color: "gray",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 13, // Adjust the font size as needed
    marginTop: 0, // Reduced top margin to bring it closer to the input field
    marginBottom: 15,
    padding: 0, // Add bottom margin for spacing before the next input
  },
});
