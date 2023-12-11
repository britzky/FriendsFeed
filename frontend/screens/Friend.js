import { useState, useEffect } from "react";
import { View, FlatList, Pressable, Text, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Searchbar } from "../components/Searchbar";
import { FriendCard } from "../components/FriendCard";
import { useFriends } from "../context/FriendContext";
import { FriendList } from "../components/FriendList";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Friend = ({ route }) => {
  const [friend, setFriend] = useState(null);
  const [username, setUsername] = useState("");
  const { accessToken, isLoggedIn, setInRegistrationFlow, inRegistrationFlow } =
    useAuth();
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
    if (isLoggedIn) {
      navigation.navigate("HomeTabs", { screen: "Home" });
      setInRegistrationFlow(false);
    }
  };

  return (
    <View style={styles.container}>
      {!inRegistrationFlow && <Text style={styles.header}>Add Friends</Text>}

      {inRegistrationFlow && (
        <>
          <Text style={styles.title}>Friends Feed</Text>
          <Text style={styles.paragraph}>
            Add friends so you can start seeing reviews right away. This is what
            makes Friends Feed so great!
          </Text>
        </>
      )}

      <Searchbar
        onSearch={handleSearch}
        placeholder="Search @Username or phone number"
      />
      <Text style={styles.subTitle}>Your friends will appear here.</Text>
      <FlatList
        data={friend}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) =>
          !item.following && (
            <FriendCard
              username={item.username}
              profile_picture={item.profile_picture}
              following={item.following}
              onFollowChange={() => setFriend(null)}
            />
          )
        }
      />
      <View>
        <FriendList />
      </View>
      {/* {inRegistrationFlow && (
        <>
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
        </>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 50,
    textAlign: "center",
    color: "#739072",
    fontFamily: "LuckiestGuy-Regular",
  },
  paragraph: {
    width: "85%",
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 20,
    fontSize: 18,
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
  subTitle: {
    fontSize: 16,
    color: "black",
    marginTop: 13,
    width: "60%",
    textAlign: "center",
  },

  signUpButton: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginTop: 70,
    width: "90%", // Full-width button
    alignItems: "center",
    marginTop: 290,
    alignSelf: "center",
  },
  textButton: {
    color: "white",
    fontSize: 18,
  },
  skip: {
    justifyContent: "center", // Center vertically in a flex container
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontStyle: "italic",
    justifyContent: "center", // Center vertically in a flex container
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    position: "relative",
    marginTop: 70,
    fontFamily: "LuckiestGuy-Regular",
    color: "#739072",
    fontSize: 25,

    marginTop: 10,

    marginBottom: 20,
    alignContent: "flex-start",
    marginLeft: 12,
  },
});
