import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import StarRating from 'react-native-star-rating';


export const Review = () => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleRatingChange = (rating) => {
        setRating(rating);
    };

    const handleCommentChange = (comment) => {
        setComment(comment);
    };

    const handleSubmit = () => {
        
    };

    return (
        <View>
            <Text>Rate your experience:</Text>
            <StarRating
                disabled={false}
                maxStars={5}
                rating={rating}
                selectedStar={handleRatingChange}
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
