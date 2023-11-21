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
    <View>
      {restaurantReviews.map((review) => (
        <View key={review.id} style={styles.card}>
          <View style={styles.header}>
            <Text>{review.username}</Text>
            <Image source={avatars[review.profile_picture]}/>
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
    color: 'orange',
  },
  reviewText: {
    marginTop: 8,
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
