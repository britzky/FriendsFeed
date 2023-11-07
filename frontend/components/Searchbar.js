import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export const Searchbar = ({onSearch, placeholder}) => {
    const [input, setInput] = useState('');

    const handleSearch = () => {
        //Make sure the input has no empty spaces before submitting
        if (input.trim()) {
            onSearch(input.trim())
        }
    }

  return (
    <View style={styles.container}>
        <Entypo name="magnifying-glass" size={24} color="black" />
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={input}
            onChangeText={setInput}
            autoCapitalize='none'
            autoCorrect={false}
            returnKeyType='search'
            onSubmitEditing={handleSearch}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
      },
      input: {
        flex: 1,
        marginLeft: 10,
        padding: 10,
        borderWidth: 0,
      },
  });