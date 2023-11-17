import { useState, useEffect } from 'react';
import { View, FlatList, Pressable, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Searchbar } from '../components/Searchbar';
import { FriendCard } from '../components/FriendCard';
import { useFriends } from '../context/FriendContext';
import { FriendList } from '../components/FriendList';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Friend = ({ route }) => {
  const [friend, setFriend] = useState(null);
  const [username, setUsername] = useState('');
  const { accessToken, waitForAuthDetails } = useAuth();
  const { fetchFriends } = useFriends();
  const { registrationFlow } = route.params || {};
  const navigation = useNavigation();

  useEffect(() => {
    if(accessToken) {
      fetchFriends(accessToken);
    }
  }, [fetchFriends, accessToken]);

  // Fetch the user name
  useEffect(() => {
    if (username && accessToken) {
      const fetchFriendDetails = async () => {
        try {
          const response = await fetch(`https://colab-test.onrender.com/find-friend/${username}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setFriend([data])
          console.log("This is the friend: ", data)
        } catch (error) {
          console.error('There was a problem fetching friend details:', error);
        }

      }
      fetchFriendDetails();
    };
  }, [username, accessToken])

  const handleSearch = (searchedUsername) => {
    setUsername(searchedUsername);
  }

  const navigateToHome = async () => {
    const isNewUser = await AsyncStorage.getItem('isNewUser');
    if (isNewUser === 'true') {
      await AsyncStorage.removeItem('isNewUser');
    }
    await waitForAuthDetails();
    navigation.navigate('Home');
  }


  return (
    <View>
        <Searchbar onSearch={handleSearch} placeholder="Search for a friend."/>
        <FlatList
          data={friend}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            !item.following && (
              <FriendCard
                username={item.username}
                profile_picture={item.profile_picture}
                following={item.following}
                onFollowChange={() => setFriend(null)}
              />
            )
          )}
        />
        <View>
          <FriendList />
        </View>
        {registrationFlow ? (
          <View>
            <Pressable onPress={navigateToHome}>
              <Text>Sign Up</Text>
            </Pressable>
            <Pressable onPress={navigateToHome}>
              <Text>Skip for now</Text>
            </Pressable>
          </View>
        ): null}
    </View>
  )
}
