import { Button, Image, View, Text, StyleSheet } from 'react-native'
import { useFriends } from '../context/FriendContext';
import { avatars } from '../assets';

export const FriendCard = ({username, profile_picture, following, onFollowChange}) => {
  const { unfollowFriend, followFriend } = useFriends();
  const avatarImage = avatars[profile_picture];

  const handleButtonPress = () => {
    if (following) {
      unfollowFriend(username);
    } else {
      followFriend(username);
    }
    onFollowChange();
  };

  return (
    <View style={styles.cardContainer}>
        <Text style={styles.name}>{username}</Text>
        <Image  style={styles.image} source={avatarImage} />
        <Button
          style={styles.button}
          title={following ? "Unfollow" : "Follow"}
          onPress={handleButtonPress}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start", // Adjusted to align items to the start
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 5,
    borderBottomColor: "#eee",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes it a circle
    marginRight: 10,// Makes it a circle
  },
  name: {
  
    flex: 1,
    color: "black",
  },
  button: {
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
  },
});
