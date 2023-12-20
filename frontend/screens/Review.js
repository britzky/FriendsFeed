import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import { useRestaurant } from "../context/RestaurantContext";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating-widget";

export const Review = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { accessToken } = useAuth();
  const route = useRoute();
  const { yelpId, restaurantName } = route.params;
  const navigation = useNavigation();
  const { postReview, reviewPosted, resetReviewPosted } = useReview();
  const { refreshRestaurants } = useRestaurant();

  const handleCommentChange = (comment) => {
    setComment(comment);
  };

  const handleSubmit = async () => {
    await postReview(yelpId, rating, comment, accessToken);
    refreshRestaurants();
  };

  useEffect(() => {
    if (reviewPosted) {
      navigation.navigate("Home");
      resetReviewPosted();
    }
  }, [reviewPosted]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
        <Text style={styles.restaurantName}>{restaurantName}</Text>
        <StarRating
          style={styles.rating}
          rating={rating}
          onChange={setRating}
          maxStars={5}
          starSize={32}
          color="black" // or any color you want
          emptyColor="black" // or any other color for empty stars
          enableHalfStar={false}
          starStyle={{ marginLeft: -5 }}
        />
        <Text style={styles.paragraph}>
          Share some details of your experience. Consider food, ambience and
          service.
        </Text>
        </View>
        <TextInput
          style={styles.input}
          multiline={true}
          numberOfLines={4}
          onChangeText={handleCommentChange}
          value={comment}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.text}>Post Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    gap: 15,
  },
  headerContainer: {
    gap: 15,
  },
  restaurantName: {
    fontSize: 20,
    marginLeft: 25,
    fontWeight: "bold",
  },
  rating: {
    marginLeft: 25,
  },
  paragraph: {
    fontSize: 15,
    width: "80%",
    marginLeft: 23,
  },
  input: {
    height: 190,
    width: "90%",
    borderColor: "#739072",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    marginLeft: 20,
  },
  button: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginTop: 70,
    width: "90%",
    alignItems: "center",
    marginTop: 20,
    marginLeft: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});
