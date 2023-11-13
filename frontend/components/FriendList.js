import { View, FlatList, Text } from 'react-native';
import { FriendCard } from './FriendCard';
import { useFriends } from '../context/FriendContext';

export const FriendList = ({ onFollowPress }) => {
    const { friends } = useFriends();
    console.log("Friends in FriendList:", friends); // Add this line to check the friends list

  return (
    <View>
        <Text>Friends List:</Text>
        <FlatList
            data={friends}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <FriendCard
                    username={item.username}
                    profile_picture={item.profile_picture}
                    following={item.following}
                    onFollowPress={onFollowPress}
                />
            )}
        />
    </View>
  )
}
