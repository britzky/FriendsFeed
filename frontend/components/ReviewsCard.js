import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { avatars } from "../assets";
import { useReview } from "../context/ReviewContext";
import StarRating from "react-native-star-rating-widget";


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
            <View style={styles.headerRight}>
              <Text style={styles.username}>{review.username}</Text>
              <StarRating
                rating={review.rating}
                maxStars={5}
                starSize={20}
                color='black'
                emptyColor='black'
                readOnly={true}
              />
            </View>
          </View>
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
  },
  card: {
    padding: 20,
    borderBottomColor: '#739072',
    borderBottomWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerRight: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
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
