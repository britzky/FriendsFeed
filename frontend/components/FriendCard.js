import { Image, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useFriends } from "../context/FriendContext";
import { useAuth } from "../context/AuthContext";
import { avatars } from "../assets";

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
      <Image style={styles.avatar} source={avatarImage} />
      <Text style={styles.username}>{username}</Text>
      {!isCurrentUser && (
        <TouchableOpacity
          android_ripple={{ color: "#3A4D39" }}
          style={styles.followButton}
          onPress={handleButtonPress}
        >
        <Text style={styles.buttonText}>{following ? "Unfollow" : "Follow"}</Text>
      </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Half of width and height to create a circle
    marginRight: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  followButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#739072',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});