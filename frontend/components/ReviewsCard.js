import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { avatars } from "../assets";
import { useReview } from "../context/ReviewContext";
import { useAuth } from "../context/AuthContext";
import StarRating from "react-native-star-rating-widget";
import Icon from 'react-native-vector-icons/Feather';
import Pencil from 'react-native-vector-icons/SimpleLineIcons';

const ReviewsCard = ({ restaurantId }) => {
  const { reviews } = useReview();
  const { userDetails } = useAuth();
  const restaurantReviews = reviews[restaurantId];

  if (!restaurantReviews || restaurantReviews.length === 0) {
    return<Text> No reviews available</Text>
  }

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
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
              <Text style={styles.username}>@{review.username}</Text>
              <StarRating
                rating={review.rating}
                maxStars={5}
                starSize={20}
                color='black'
                emptyColor='black'
                readOnly={true}
                starStyle={{ marginLeft: -5 }}
              />
              <View style={styles.icons}>
                <Text style={{color: '#787778', width: '90%'}}>{formatDate(review.date)}</Text>
                {review.username === userDetails.username &&
                <View style={{flexDirection: 'row', gap: 10}}>
                  <Icon name="trash-2" size={18} color="red"/>
                  <Pencil name="pencil" size={18} color="#739072"/>
                </View>
                }
              </View>
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
    marginBottom: 2,
  },
  headerRight: {
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icons: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
