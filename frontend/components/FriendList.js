import { View, FlatList, Text } from "react-native";
import { FriendCard } from "./FriendCard";
import { useFriends } from "../context/FriendContext";

export const FriendList = () => {
  const { friends } = useFriends();

  return (
    <View>
      {friends.map((item) => (
        <FriendCard
          key={item.id.toString()}
          username={item.username}
          profile_picture={item.profile_picture}
          following={item.following}
          onFollowChange={() => {}}
        />
      ))}
    </View>
  );
};
