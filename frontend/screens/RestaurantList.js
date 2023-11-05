import { Text, TextInput, StyleSheet, View, Button, Pressable, FlatList } from "react-native";
import React, { useState } from "react";
import RestaurantTile from "../components/RestaurantTile";

import {CATEGORIES} from '../data/dummy-data.js'


const restaurants = [
  { id: '1', name: 'Restaurant 1' },
  { id: '2', name: 'Restaurant 2' },
  // ... more items
];

const RestaurantList = ({navigation}) => {``



  const [formData, setFormData] = useState({
    zipcode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

 
  const renderRestaurantItem = (item) => {
    
  }

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="zipcode"
        value={formData.zipcode}
        onChangeText={(text) => handleChange("zipcode", text)}
      />
      {errors.zipcode && <Text style={{ color: "red" }}>{errors.zipcode}</Text>}

      <Pressable style={styles.button} onPress={() => {/* handle button press */}}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
      
      <FlatList
      data={CATEGORIES}
      keyExtractor={(item) => item.id}
      
      
      />
    
    </View>
  );
};
export default RestaurantList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  input: {
    height: 40,
    width: '70%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10, 
    marginLeft: 9,
    flexDirection: 'row',
    marginTop: 15,
    
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
});
