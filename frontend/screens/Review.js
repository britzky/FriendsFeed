import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';


export const Review = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { accessToken } = useAuth();
    const route = useRoute();
    const { yelpId } = route.params;
    const navigation = useNavigation();

    const handleRatingChange = (rating) => {
        setRating(rating);
    };

    const handleCommentChange = (comment) => {
        setComment(comment);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('https://colab-test.onrender.com/review/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    yelp_restaurant_id: yelpId,
                    rating,
                    comment
                })
            });

            const result = await response.json();
            console.log("This is the review being sent to the backend", result);
            if (response.ok) {
                navigation.goBack();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <Text>Rate your experience:</Text>
            <Rating
                showRating
                onFinishRating={handleRatingChange}
                style={{ paddingVertical: 10 }}
            />
            <Text>Leave a comment:</Text>
            <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={handleCommentChange}
                value={comment}
            />
            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
};
