import React from 'react'
import { Button, Image, View, Text } from 'react-native'

export const FriendCard = ({username, profile_picture, following}) => {
  return (
    <View>
        <Text>{username}</Text>
        <Image source={profile_picture} />
        <Button title={following ? "Unfollow" : "Follow"} />
    </View>
  )
}
