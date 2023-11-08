import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const CuisineFilter = ({ onApplyFilter, onClose, fetchCuisinesUrl, searchZipcode, getCuisines }) => {
    const [input, setInput] = useState('');
    const [cuisines, setCuisines] = useState([])
    const [filteredCuisines, setFilteredCuisines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { accessToken, refreshToken } = useAuth();

    useEffect(() => {
        const fetchCuisines = async () => {
            console.log("attempting to fetch cuisines")
            if (!accessToken) {
                await refreshToken();
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(fetchCuisinesUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                });
                const data = await response.json();
                console.log('Cuisines loaded into state:', data)
                if (response.ok) {
                    setCuisines(data);
                } else {
                    throw new Error(data.message || "Error fetching cuisines");
                }
            } catch (err) {
                setError(err.toString());
            } finally {
                setLoading(false);
            }
        }
        fetchCuisines();
    }, [accessToken, refreshToken, fetchCuisinesUrl])

    //function to handle the text change in the search bar
    const handleInputChange = (text) => {
        setInput(text);
        const matchedCuisines = cuisines.filter(cuisine => cuisine.name.toLowerCase().startsWith(text.toLowerCase()));
        setFilteredCuisines(matchedCuisines)
        console.log('Filtered Cuisines: ', matchedCuisines)
    }
    // function to handle selecting a cuisine from the dropdown
    const handleSelectCuisine = (cuisine) => {
        onApplyFilter(cuisine.yelp_alias)
        onClose();
    }

    // render the dropdown list of cuisines
    const renderCuisineItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelectCuisine(item)}>
            <Text>{item.name}</Text>
        </TouchableOpacity>
    )
  return (
    <View style={styles.searchContainer}>
        <TextInput
            value={input}
            onChangeText={handleInputChange}
            placeholder="Start typing a cuisine..."
        />
        {filteredCuisines.length > 0 && (
            <FlatList
                data={filteredCuisines}
                renderItem={renderCuisineItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.dropdown}
            />
        )}
    </View>
  )
}


const styles = StyleSheet.create({
    searchContainer: {
      zIndex: 1, // Ensures this view is on top of others
      minHeight: 100, // Adjust as needed to fit content
      // other styles as necessary
    },
    dropdown: {
      position: 'absolute',
      top: '100%', // directly below the TextInput
      left: 0,
      right: 0,
      maxHeight: 200, // adjust this to control how tall the dropdown can be
      backgroundColor: 'white', // or any other background
      zIndex: 2, // ensures the dropdown is above other elements
      // other styles as necessary
    },
    // ... other styles
  });