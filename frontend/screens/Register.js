import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

export default function Register({ route }) {
  const navigate = useNavigation();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
  });
  const { registrationFlow } = route.params;
  console.log(
    "This is the Register registration flow status: ",
    registrationFlow
  );

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
    if (!formData.location) {
      validationErrors.location = "location is required";
    }
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, you can submit the data to the Context
      navigate.navigate("ChooseAvatar", { registrationFlow, formData });
    } else {
      // Form is not valid, update the errors state
      setErrors(validationErrors);
    }
  };

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "LuckiestGuy-Regular": require("../assets/fonts/LuckiestGuy-Regular.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
        "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // Or some loading component
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends Feed</Text>
      <Text style={styles.subtitle}>Discover new restaurants</Text>
      <Text style={styles.text2}>one friend at a time</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="@Username"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}
      <Text style={styles.username}>
        This is how you’ll appear to your friends on Friends Feed.
      </Text>
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
      <Text style={styles.password}>
        Password must include: 6 to 20 characters
      </Text>

      <TextInput
        style={styles.input}
        placeholder="location Ex: San Francisco, CA"
        value={formData.location}
        onChangeText={(text) => handleChange("location", text)}
      />
      {errors.location && (
        <Text style={styles.errorText}>{errors.location}</Text>
      )}
      <Text style={styles.zipcode}>
        Enter your city and state so we can start showing you recommendations
        nearby.
      </Text>
      <Text style={styles.term}>
        By clicking Continue you are agreeing to out{" "}
        <Text style={styles.boldText}>Terms & Conditions.</Text>
      </Text>
      <Pressable
        android_ripple={{ color: "#3A4D39" }}
        style={styles.buttonText}
        onPress={handleRegistration}
      >
        <Text style={styles.text}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 30,
    // Provides padding but allows for stretching
  },
  title: {
    fontSize: 24,

    marginBottom: 48,
    color: "#3A4D39",
    textAlign: "center",
    fontFamily: "LuckiestGuy-Regular",
  },
  input: {
    height: 55,
    width: "100%", // Allows the input to fill the available space
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  buttonText: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginTop: 70,
    width: "100%", // Full-width button
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    position: "relative",
    bottom: 15,
    color: "red",
    fontSize: 12,
  },
  text: {
    color: "white",
    fontSize: 18,
  },
  text2: {
    position: "relative",
    top: -10,
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
    textAlign: "center",
  },
  username: {
    position: "relative",
    top: -10,
    textAlign: "left",
    width: "100%", // Full-width text
    marginBottom: 10,
    fontSize: 14,
  },
  zipcode: {
    position: "relative",
    top: -10,
    textAlign: "left",
    width: "100%", // Full-width text
    marginBottom: 10,
  },
  password: {
    position: "relative",
    top: -10,
    textAlign: "left",
    width: "100%", // Full-width text
    marginBottom: 30,
  },
  term: {
    position: "relative",
    top: 60,
  },
  boldText: {
    fontWeight: "bold",
  },
});
