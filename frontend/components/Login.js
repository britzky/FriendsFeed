import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SIGNIN_URL = "https://colab-test.onrender.com/signin";

export default function MyForm() {
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
            'Alert Title',
            'You are successfully logged in',
            [
              {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
              },
            ],
            { cancelable: false }
          );
          // Registration was successful, navigate to the user's dashboard or login screen
          // navigation.navigate("Dashboard"); // Adjust the screen name as needed
          const data = await response.json();
          console.log("Login successful:", data)
          setIsLoggedIn(true);
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
    <View>
      <Text>Login</Text>
      {isLoggedIn ? (
        <Text>Your logged in</Text>
      ) : (
        <>
          <TextInput
            placeholder="username"
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
          />
          {errors.email && (
            <Text style={{ color: "red" }}>{errors.username}</Text>
          )}

          <TextInput
            placeholder="email"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && <Text style={{ color: "red" }}>{errors.email}</Text>}

          <TextInput
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
          />
          {errors.password && (
            <Text style={{ color: "red" }}>{errors.password}</Text>
          )}

          <Button title="Submit" onPress={handleSubmit} />
        </>
      )}
    </View>
  );
}
