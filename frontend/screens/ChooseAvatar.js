import React, { useState, useEffect } from "react";
import { avatars } from "../assets";
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export const ChooseAvatar = ({ route }) => {
  const {
    userDetails,
    setIsLoggedIn,
    isLoggedIn,
    setUserDetails,
    setAccessToken,
    accessToken,
  } = useAuth();
  const navigation = useNavigation();
  const { registrationFlow, formData } = route.params;
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleCompleteRegistration = async () => {
    if (!selectedAvatar) {
      alert("Please select an avatar");
      setLoading(false)
      return;
    }
    setLoading(true);
    const completedUserDetails = {
      ...formData,
      profile_picture: selectedAvatar,
    };

    try {
      const response = await fetch("https://colab-test.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completedUserDetails),
      });
      const data = await response.json();

      if (response.ok) {
        console.log("Registration completed successfully:", data);
        await AsyncStorage.setItem("user_details", JSON.stringify(data));
        await AsyncStorage.setItem("access_token", data.access_token);
        await AsyncStorage.setItem("refresh_token", data.refresh_token);
        setUserDetails(data.user);
        setAccessToken(data.access_token);
        await AsyncStorage.setItem("isNewUser", "true");
        setLoading(false)
      } else {
        console.error("Error completing registration:", data);
      }
    } catch (error) {
      console.error("Error completing registration:", error);
    }
  };

  // Side effect to check if accessToken and userDetails are available before setting isLoggedIn to true
  useEffect(() => {
    if (accessToken && userDetails) {
      setIsLoggedIn(true);
    }
  }, [accessToken, userDetails]);

  useEffect(() => {
    const navigateIfReady = async () => {
      const isNewUser = await AsyncStorage.getItem("isNewUser");
      // Check if all necessary conditions are met
      if (isNewUser === "true" && isLoggedIn) {
        navigation.navigate("Friend", { registrationFlow: true });
        await AsyncStorage.removeItem("isNewUser"); // Optional: Clear isNewUser flag
      }
    };
    navigateIfReady();
  }, [isLoggedIn, navigation, route.params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends Feed</Text>
      <Text style={styles.subTitle}>
        Pick an avatar for your Friends Feed profile.
      </Text>
      <View style={styles.avatarGrid}>
        {Object.keys(avatars).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => handleSelectAvatar(key)}
            style={selectedAvatar === key ? styles.selectedAvatar : null}
          >
            <Image source={avatars[key]} style={styles.avatar} />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.subTitle2}>
        Invite 10 friends to Friends Feed to unlock these special Avatars!
      </Text>
      <Pressable
        android_ripple={{ color: "#3A4D39" }}
        style={styles.buttonText}
      >
        <Text style={styles.text}>Copy Invite Link</Text>
      </Pressable>
      <Pressable
        android_ripple={{ color: "#3A4D39" }}
        style={styles.continueButton}
        onPress={handleCompleteRegistration}
        disabled={loading}
      >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={styles.textButton}>Continue</Text>
      )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 50,
  },
  subTitle: {
    fontSize: 18,
    color: "black",
    marginBottom: 20,
    width: "61%",
    textAlign: "center",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 10, // Adjust the margin as needed
  },
  subTitle2: {
    fontSize: 18,
    color: "black",
    marginTop: 50,
    width: "82%",
    textAlign: "center",
  },
  buttonText: {
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    borderStyle: "solid",
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    color: "#739072",
  },
  continueButton: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginTop: 70,
    width: "80%", // Full-width button
    alignItems: "center",
    marginTop: 130,
  },
  textButton: {
    color: "white",
    fontSize: 18,
  },
  selectedAvatar: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    paddingBottom: 5,
  },
});
