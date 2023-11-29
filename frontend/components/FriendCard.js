import { Image, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useFriends } from "../context/FriendContext";
import { useAuth } from "../context/AuthContext";
import { avatars } from "../assets";

const windowWidth = Dimensions.get("window").width;

const isLargeScreen = windowWidth > 600;
const isMediumScreen = windowWidth > 400 && windowWidth <= 600;
const isSmallScreen = windowWidth <= 400;

export const FriendCard = ({ username, profile_picture, following, onFollowChange }) => {
  const { unfollowFriend, followFriend } = useFriends();
  const avatarImage = avatars[profile_picture];
  const { userDetails } = useAuth();

  const handleButtonPress = () => {
    if (following) {
      unfollowFriend(username);
    } else {
      followFriend(username);
    }
    onFollowChange();
  };

    // Check if userDetails is not null before accessing username
    const isCurrentUser = userDetails && username === userDetails.username;

  return (
    <View style={styles.cardContainer}>
      <Image style={styles.image} source={avatarImage} />
      <Text style={styles.name}>{username}</Text>
      {!isCurrentUser && (
        <TouchableOpacity
          android_ripple={{ color: "#3A4D39" }}
          style={styles.button}
          onPress={handleButtonPress}
        >
        <Text style={styles.text}>{following ? "Unfollow" : "Follow"}</Text>
      </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes it a circle
    marginRight: 10, // Makes it a circle
    paddingRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    color: "black",
    fontSize: 16
  },
  button: {
    paddingHorizontal: isSmallScreen ? 100 : isMediumScreen ? 15 : 200,
    paddingVertical: 8,
    backgroundColor: "#739072",

    padding: 0,
    borderRadius: 10,
  },
  text: {
    color: "white",
  },
});
