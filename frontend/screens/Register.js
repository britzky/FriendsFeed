import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";
import Eye from "react-native-vector-icons/Ionicons";

export default function Register() {
  const navigate = useNavigation();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [phone, setPhone] = useState({ phone: "" });

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (name, value) => {
    setPhone((phone) => ({ ...phone, [name]: value }));
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
      navigate.navigate("ChooseAvatar", { formData });
    } else {
      // Form is not valid, update the errors state
      setErrors(validationErrors);
    }
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>Discover new restaurants one friend at a time</Text>
          <TextInput
            style={styles.input}
            placeholder="@ Username"
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}
          <Text style={styles.text}>
            This is how you’ll appear to your friends on Friends Feed.
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry={!isPasswordVisible}
            />
            <Pressable onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Eye
                name={isPasswordVisible ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <Icon name="check" size={16} color="#000" />
          <View>
            <Text style={styles.text}>Password must include:</Text>
            <Text style={styles.text}>
              6 to 20 characters
            </Text>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(text) => handlePhoneChange("phone", text)}
        />
        {errors.username && <Text style={styles.errorText}>{errors.phone}</Text>}
        <TextInput
          style={styles.input}
          placeholder="location Ex: San Francisco, CA"
          value={formData.location}
          onChangeText={(text) => handleChange("location", text)}
        />
        {errors.location && (
          <Text style={styles.errorText}>{errors.location}</Text>
        )}
        <Text style={styles.text}>
          Enter your city and state so we can start showing you recommendations
          nearby.
        </Text>
        <Text style={{marginTop: 26, marginBottom: 27}}>
          By clicking Continue you are agreeing to our <Text style={{fontFamily: 'Roboto-Bold'}}>Terms & Conditions.</Text>
        </Text>
        <Pressable
          android_ripple={{color: "#3A4D39"}}
          style={styles.button}
          onPress={handleRegistration}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
    marginBottom: 13,
    maxWidth: 250,
    alignSelf: 'center'
  },
  input: {
    width: '100%',
    borderColor: '#739072',
    borderWidth: 1,
    paddingLeft: 15,
    paddingTop: 9,
    paddingBottom: 9,
    borderRadius: 5,
    paddingRight: 50,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
  },
  text: {
    textAlign: "left",
    fontFamily: "Roboto-Regular",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: -40,
  },
  button: {
    paddingVertical: 10,
    backgroundColor: "#739072",
    borderRadius: 5,
    width: "100%", // Full-width button
    alignItems: "center",
    marginBottom: 1
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
});
