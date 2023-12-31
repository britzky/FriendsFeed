import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
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
          color="black"
          emptyColor="black"
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
          selectionColor="black"
        />
        <Pressable
          android_ripple={{ color: "#3A4D39" }}
          style={styles.reviewButton}
          onPress={handleSubmit}
        >
          <Text style={styles.text}>Post Review</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    gap: 15,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 190,
    width: "90%",
    borderColor: "#739072",
    borderWidth: 1.5,
    alignSelf: "center",
    borderRadius: 8,
    textAlignVertical: "top",
    paddingLeft: 5,
    paddingTop: 10,
    fontSize: 16,
    marginTop: 15,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 0,
    marginBottom: 15,
    padding: 0,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
  buttonText: {
    paddingHorizontal: 155,
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginVertical: 5,
    color: "white",
  },
  rating: {
    marginLeft: 25,
  },
  review: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginTop: 70,
    width: "90%", 
    alignItems: "center",
    marginTop: 20,
    marginLeft: 20,
  },
  paragraph: {
    fontSize: 15,
    width: "80%",
    marginLeft: 23,
  },
  restaurantName: {
    fontSize: 20,
    marginLeft: 25,
    fontWeight: "bold",
  },
  headerContainer: {
    gap: 15,
  },
  reviewButton: {
    marginTop: 30,
    paddingVertical: 16,
    backgroundColor: "#739072",
    borderRadius: 5,
    width: "90%", // Full-width button
    alignItems: "center",
    alignSelf: "center",
  },
});
