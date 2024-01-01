import { useState, useEffect } from "react";
import { View, Pressable, Text, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Searchbar } from "../components/Searchbar";
import { FriendCard } from "../components/FriendCard";
import { useFriends } from "../context/FriendContext";
import { FriendList } from "../components/FriendList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";


export const Friend = () => {
  const [friend, setFriend] = useState(null);
  const [username, setUsername] = useState("");
  const { accessToken, setInRegistrationFlow, inRegistrationFlow } = useAuth();
  const { fetchFriends } = useFriends();
  const navigation = useNavigation();

  //fetch the friend list
  useEffect(() => {
    if (accessToken) {
      fetchFriends(accessToken);
    }
  }, [fetchFriends, accessToken]);

  // Fetch the user name
  useEffect(() => {
    if (username && accessToken) {
      const fetchFriendDetails = async () => {
        try {
          const response = await fetch(
            `https://colab-test.onrender.com/find-friend/${username}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setFriend([data]);
          console.log("This is the friend: ", data);
        } catch (error) {
          console.error("There was a problem fetching friend details:", error);
        }
      };
      fetchFriendDetails();
    }
  }, [username, accessToken]);

  // function to set the searched username
  const handleSearch = (searchedUsername) => {
    setUsername(searchedUsername);
  };

  // navigate to home
  const navigateToHome = async () => {
    const isNewUser = await AsyncStorage.getItem("isNewUser");
    if (isNewUser === "true") {
      await AsyncStorage.removeItem("isNewUser");
    }
    setInRegistrationFlow(false);
    navigation.navigate("Home");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContainer}>
          {!inRegistrationFlow && (
            <Text style={styles.header}>Add Friends</Text>
          )}
          {inRegistrationFlow && (
            <View style={styles.headerContainer}>
              <Text style={styles.paragraph}>
                Add friends so you can start seeing reviews right away. This is
                what makes Friends Feed so great!
              </Text>
            </View>
          )}
          <View style={styles.searchbarContainer}>
            <Searchbar
            style={styles.searchbar}
              onSearch={handleSearch}
              placeholder="Search @Username or phone number"
            />
          </View>
          <Text style={styles.subTitle}>Your friends will appear here.</Text>
          {friend &&
            friend.map(
              (item) =>
                item.following === false && (
                  <FriendCard
                    key={item.id.toString()}
                    username={item.username}
                    profile_picture={item.profile_picture}
                    following={item.following}
                    onFollowChange={() => setFriend(null)}
                  />
                )
            )}
          <View>
            <FriendList />
          </View>
        </View>
      </ScrollView>
      {inRegistrationFlow && (
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{ color: "#3A4D39" }}
            style={styles.signUpButton}
            onPress={navigateToHome}
          >
            <Text style={styles.textButton}>Sign Up</Text>
          </Pressable>
          <Pressable style={styles.skip} onPress={navigateToHome}>
            <Text style={styles.text}>Skip for now</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    color: "#739072",
    fontFamily: "LuckiestGuy-Regular",
    marginBottom: 25,
  },
  paragraph: {
    width: "85%",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 20,
    fontSize: 18,
    fontFamily: "Roboto-Medium",
  },
  subTitle: {
    fontSize: 16,
    color: "black",
    marginTop: 13,
    width: "65%",
    textAlign: "center",
    alignSelf: "flex-start",
  },
  signUpButton: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  textButton: {
    color: "white",
    fontSize: 18,
  },
  skip: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerContainer: {
    fontSize: 22,
    color: "#739072",
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  header: {
    fontFamily: "LuckiestGuy-Regular",
    color: "#739072",
    fontSize: 25,
    marginBottom: 10,
    marginLeft: 20
  },
  searchbarContainer: {
    flex: 1,
    alignSelf: 'center',
    width: '90%'
  },
  scrollViewContent: {
    justifyContent: "flex-start",
  },
});
