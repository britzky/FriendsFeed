import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../context/AuthContext';

export default function Register({ route }) {
  const { setUserDetails } = useAuth();
  const navigate = useNavigation()
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    zipcode: "",
  });
  const { registrationFlow } = route.params;
  console.log("This is the Register registration flow status: ", registrationFlow)

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistration = () => {

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
      // Form is valid, you can submit the data to the Context
          setUserDetails(formData);
          navigate.navigate("ChooseAvatar", { registrationFlow });
        } else {
      // Form is not valid, update the errors state
      setErrors(validationErrors);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food.Finder</Text>
      <Text style={styles.subtitle}>
        Discover new restaurants
      </Text>
      <Text style={styles.text2}>
         one friend at a time
      </Text>
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
      <Pressable android_ripple={{ color: "#3A4D39" }} style={styles.buttonText} onPress={handleRegistration}>
          <Text style={styles.text}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFF',
  width: '100%', 
  paddingHorizontal: 20,
  gap: 8,
  

  },
  title: {
    fontSize: 30,
  fontWeight: 'bold',
  marginBottom: 20,
  },
  input: {
    height:55,
    width: '90%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    gap: 10,
    flexShrink: 0


  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    
    paddingHorizontal: 150,
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginVertical: 10,
    color: "white",
    marginTop: 180
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 0,
    margin: 0,
    width: 180,
    padding: 0,
    fontFamily: "Roboto",
  },
  errorText: {
    color: "red",
    fontSize: 12, // Reduce font size
   
 
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  text2: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
    margin: 0,
    width: 150,
    padding: 0,
    marginTop: 2,
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    color: "#3A4D39",
  },
});

