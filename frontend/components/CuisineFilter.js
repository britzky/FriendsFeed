import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Entypo } from "@expo/vector-icons";
import { useAuth } from '../context/AuthContext';

export const CuisineFilter = ({ onApplyFilter, onClose, fetchCuisinesUrl }) => {
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
        <View style={styles.searchSection}>
            <Entypo name="magnifying-glass" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
            style={styles.input}
            value={input}
            onChangeText={handleInputChange}
            placeholder="Start typing a cuisine..."
        />
        </View>
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
        zIndex: 1,
        width: '100%',
        height: 250, // Take up the full width of the parent
        paddingHorizontal: 10, // Add some padding on the sides
      },
      searchSection: {
        flexDirection: 'row', // Aligns the icon and text input in a row
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#739072',
        borderRadius: 20,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
      },
      searchIcon: {
        padding: 10,
      },
      input: {
        flex: 1, // Takes up all available space
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0, // No padding on the left, the icon serves this purpose
        backgroundColor: 'white',
        color: '#424242',
        borderRadius: 20, // Rounds the corners
      },
      dropdown: {
        position: 'absolute',
        top: 50, // Position below the search bar, adjust to match the height of the search bar
        left: 10,
        right: 10,
        maxHeight: 200,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        zIndex: 2,
      },
  });