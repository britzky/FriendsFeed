import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';
import AsyncStorage from "@react-native-async-storage/async-storage";

const REGISTER_URL = "https://colab-test.onrender.com/register";


export default function Register() {
  const { setIsLoggedIn, setUserDetails } = useAuth();
  const navigate = useNavigation()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    zipcode: "",
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

    if (!formData.email) {
      validationErrors.email = "email is required";
    }

    if (!formData.zipcode) {
      validationErrors.zipcode = "zipcode is required";
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

          body: JSON.stringify(formData),
        });
        console.log(formData);
        if (response.status === 201) {
          // Registration was successful, navigate to the user's dashboard or login screen
          const data = await response.json();
          console.log("Registration successful", data);
          await AsyncStorage.setItem('access_token', data.access_token)
          await AsyncStorage.setItem('user_details', JSON.stringify(data.user))

          setIsLoggedIn(true);
          setUserDetails(data.user);
          navigate.navigate("Home");
        } else {
          // Handle registration errors here
          console.log("Registration failed", response.status);
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
      <Text style={styles.subtitle}>Discover restaurants one friend at a time</Text>
      <TextInput
      style={styles.input}
        placeholder="email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email}</Text>
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
      <TextInput
      style={styles.input}
        placeholder="username"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}

      <TextInput
       style={styles.input}
        placeholder="zipcode"
        value={formData.zipcode}
        onChangeText={(text) => handleChange("zipcode", text)}
      />
      {errors.zipcode && (
        <Text style={styles.errorText}>{errors.zipcode}</Text>
      )}



      <Button style={styles.buttonText} title="Sign-Up" onPress={handleRegistration} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFF',
  width: '100%', // Ensure it's 100% of the parent
  paddingHorizontal: 20,

  },
  title: {
    fontSize: 30, // was 24, now larger
  fontWeight: 'bold',
  marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 13, // Adjust the font size as needed
    marginTop: 0, // Reduced top margin to bring it closer to the input field
    marginBottom: 15,
    padding: 0, // Add bottom margin for spacing before the next input
  },
});
