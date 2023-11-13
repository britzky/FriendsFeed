import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';
// import StarRating from 'react-native-star-rating';


export const Review = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { accessToken } = useAuth();

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
                    rating,
                    comment
                })
            });

            const result = await response.json();
            console.log("This is the review being sent to the backend", result);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View>
            <Text>Rate your experience:</Text>
            {/* <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                selectedStar={handleRatingChange}
            /> */}
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
