import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import api from "./api";

const REGISTER_URL = "https://colab-test.onrender.com/register";

export default function MyForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration = async (data) => {
    // Perform validation here and set errors if necessary
    const validationErrors = {};
    if (!formData.username) {
      validationErrors.username = "username is required";
    }
    if (!formData.password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, you can submit the data to the API
      try {
        // const response = await api.post(REGISTER_URL, userData); // Assuming your API utility handles the request

        const response = await fetch(REGISTER_URL, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
         
        });

        if (response.status === 201) {
          // Registration was successful, navigate to the user's dashboard or login screen
          // navigation.navigate("Dashboard"); // Adjust the screen name as needed
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
      <Text>Register</Text>
      <TextInput
        placeholder="username"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      {errors.username && (
        <Text style={{ color: "red" }}>{errors.username}</Text>
      )}

      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />
      {errors.password && (
        <Text style={{ color: "red" }}>{errors.password}</Text>
      )}

      <Button title="Submit" onPress={handleRegistration} />
    </View>
  );
}
