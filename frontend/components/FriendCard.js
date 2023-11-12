import { Button, Image, View, Text, StyleSheet } from 'react-native'
import { useFriends } from '../context/FriendContext';

export const FriendCard = ({username, profile_picture, following, onFollowChange}) => {
  const { unfollowFriend, followFriend } = useFriends();

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
        <Image  style={styles.image} source={profile_picture} />
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
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25, // Makes it a circle
  },
  name: {
    marginLeft: 10,
    flex: 1,
    color: "black",
  },
  button: {
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
  },
});
