import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Rating } from "react-native-ratings";
import { avatars } from "../assets";
import { useReview } from "../context/ReviewContext";

const ReviewsCard = ({ restaurantId }) => {
  const { reviews } = useReview();
  const restaurantReviews = reviews[restaurantId];

  if (!restaurantReviews || restaurantReviews.length === 0) {
    return<Text> No reviews available</Text>
  }

  return (
    <View style={styles.container}>
      {restaurantReviews.map((review) => (
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
  star: {
    marginRight: 4,
    color: 'orange',
  },
  reviewText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C4C4C4',
  },
});
