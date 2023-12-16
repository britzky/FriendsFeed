import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

export const Searchbar = ({ onSearch, placeholder }) => {
  const [input, setInput] = useState("");

  const handleSearch = () => {

    if (input.trim()) {
      onSearch(input.trim());
      setInput('')
    }
  };

  return (
    <View style={styles.container}>
      <Entypo style={styles.icon} name="magnifying-glass" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        
        value={input}
        onChangeText={setInput}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#739072",
    borderRadius: 10,
    backgroundColor: "#e8e8e8e8",
    width: '100%',
    
  },
  input: {
    marginLeft: 10,
    padding: 8,
    paddingHorizontal: 5,
    width: '100%',
   
   
  },
  icon: {
    fontSize: 27,
    color: "#739072",
    marginLeft: 10,
   
  },
});
