import React, { useState, useEffect } from "react";
import { avatars } from "../assets";
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/SimpleLineIcons";

const images = {
  image1: require("../assets/Cupcake.png"),
  image2: require("../assets/Coffee.png"),
  image3: require("../assets/Hamburger.png"),
};

export const ChooseAvatar = ({ route }) => {
  const { registerUser } = useAuth();
  const navigation = useNavigation();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const { formData } = route.params;

  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleCompleteRegistration = async () => {
    if (!selectedAvatar) {
      alert("Please select an avatar");
      setLoading(false);
      return;
    }
    setLoading(true);
    const completedUserDetails = {
      ...formData,
      profile_picture: selectedAvatar,
    };
    setTimeout(async () => {
      try {
        console.log("Completed user details:", completedUserDetails);
        await registerUser(completedUserDetails);
        navigation.navigate("Friend")
      } catch (error) {
        console.error("Error completing registration:", error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  // // Side effect to check if accessToken and userDetails are available before setting isLoggedIn to true
  // useEffect(() => {
  //   if (accessToken && userDetails) {
  //     setIsLoggedIn(true);
  //   }
  // }, [accessToken, userDetails]);

  // useEffect(() => {
  //   const navigateIfReady = async () => {
  //     const isNewUser = await AsyncStorage.getItem("isNewUser");
  //     if (isNewUser === "true" && isLoggedIn) {
  //       navigation.navigate("Friend");
  //       console.log("Navigating to Friend screen")
  //       await AsyncStorage.removeItem("isNewUser");
  //     }
  //   };
  //   navigateIfReady();
  // }, [isLoggedIn, navigation, route.params]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.subTitle}>
          Pick an avatar for your Friends Feed profile.
        </Text>
        <View style={styles.avatarGrid}>
          {Object.keys(avatars).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleSelectAvatar(key)}
            >
              <Image source={avatars[key]} style={[styles.avatar, selectedAvatar === key && styles.selectedAvatar]} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.secondSubTitle}>
          Invite 10 friends to Friends Feed to unlock these special Avatars!
        </Text>
        <Pressable
          android_ripple={{ color: "#3A4D39" }}
          style={styles.buttonText}
        >
          <Text style={styles.text}>Copy Invite Link</Text>
        </Pressable>
        <View style={styles.container2}>
          {Object.keys(images).map((key) => (
            <View key={key} style={styles.imageContainer}>
              <Image source={images[key]} style={styles.image} blurRadius={25} />
              <Icon name="lock" size={28} color="#000" style={styles.icon} />
            </View>
          ))}
        </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontFamily: "LuckiestGuy-Regular",
    color: "#739072",
  },
  subTitle: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
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
    margin: 10,
  },
  selectedAvatar: {
    borderWidth: 4,
    borderColor: "#739072",
    borderRadius: 40,
  },
  secondSubTitle: {
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
    marginTop: 80,
    marginBottom: 1,
  },
  textButton: {
    color: "white",
    fontSize: 18,
  },
  imageContainer: {
    margin: 5,
    borderRadius: 40,
    width: 80,
    height: 80,
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "relative",
    top: 40,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  icon: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -12,
    marginTop: -12,
  },
});
