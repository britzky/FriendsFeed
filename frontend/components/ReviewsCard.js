import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";

const ReviewsCard = ({ reviews }) => {
  return (
    <View>
      {reviews.map((review) => (
        <View key={review.id} style={styles.card}>
          <View style={styles.header}>
            <Text>{review.username}</Text>
          </View>
          <Rating
            imageSize={20}
            readonly
            startingValue={review.rating}
          />
          <Text>{review.comment}</Text>
        </View>
      ))}
    </View>
  );
};

export default ReviewsCard;


const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
      margin: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      marginLeft: 10,
      fontWeight: 'bold',
    },
    rating: {
      flexDirection: 'row',
      marginTop: 4,
    },
    star: {
      marginRight: 4,
      color: 'orange', // Or any color that matches the star rating color
    },
    reviewText: {
      marginTop: 8,
      fontSize: 16,
      lineHeight: 24, // This adjusts the line-height for better readability
    },
    avatar: {
      width: 40, // Adjust to match the design
      height: 40, // Adjust to match the design
      borderRadius: 20, // Half the width and height to make it a circle
      backgroundColor: '#C4C4C4', // Placeholder color
    },
  });
