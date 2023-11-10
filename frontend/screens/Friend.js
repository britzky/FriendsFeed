import { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Searchbar } from '../components/Searchbar';
import { FriendCard } from '../components/FriendCard';

export const Friend = () => {
  const [friend, setFriend] = useState(null);
  const [username, setUsername] = useState('');
  const { accessToken } = useAuth();

  // Fetch the user name
  useEffect(() => {
    if (username) {
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
  return (
    <View>
        <Searchbar onSearch={handleSearch} placeholder="Search for a friend."/>
        <FlatList
          data={friend}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <FriendCard
              username={item.username}
              profile_picture={item.profile_picture}
              following={item.following}
            />
          )}
        />
    </View>
  )
}
