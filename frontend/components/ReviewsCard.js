import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { avatars } from "../assets";

const ReviewsCard = ({ reviews }) => {
  return (
    <View style={styles.container}>
      {reviews.map((review) => (
        <View key={review.id} style={styles.card}>
          <View style={styles.header}>
            <Image
              style={styles.avatar}
              source={avatars[review.profile_picture]}
            />
            <Text style={styles.username}>{review.username}</Text>
          </View>
          <Rating
            style={styles.rating}
            imageSize={20}
            readonly
            startingValue={review.rating}
          />
          <Text style={styles.reviewText}>{review.comment}</Text>
        </View>
      ))}
    </View>
  );
};

export default ReviewsCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // Assuming a light grey background similar to the image
  },
  card: {
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // Add space between the header and the review text
  },
  username: {
    position: "relative",
    left: 10,
    bottom: 10,
    fontSize: 16,
   
    
  },
  rating: {
    position: "relative", // Use absolute positioning to place the rating on the right
  // Align to the top of the header
    right: 85,
    bottom: 20 // Align to the right of the card
  },
  date: {
    fontSize: 12,
    color: "#a9a9a9", // A lighter grey for the date to differentiate it from the main text
    marginBottom: 10, // Add space between the date and the review text
  },
  reviewText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5, // Make it perfectly round
    backgroundColor: "#C4C4C4",
  },
});
