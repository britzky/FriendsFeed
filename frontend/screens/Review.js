import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useReview } from "../context/ReviewContext";
import { useRestaurant } from "../context/RestaurantContext";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating-widget";


const windowWidth = Dimensions.get('window').width;

const isLargeScreen = windowWidth > 600;
const isMediumScreen = windowWidth > 400 && windowWidth <= 600;
const isSmallScreen = windowWidth <= 400;

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
  }

  useEffect(() => {
    if (reviewPosted) {
      navigation.navigate("Home");
      resetReviewPosted();
    }
  }, [reviewPosted])



  return (
    <View style={styles.container}>
      <Text style={styles.restaurantName}>{restaurantName}</Text>
      <StarRating
      style={styles.rating}
        rating={rating}
        onChange={setRating}
        maxStars={5}
        starSize={32}
        color='black' // or any color you want
        emptyColor='black' // or any other color for empty stars
        enableHalfStar={false}
      />
      <Text style={styles.paragraph}>Share some details of your experience. Consider food, ambience and service.</Text>
      <TextInput
        style={styles.input}
        multiline={true}
        numberOfLines={4}
        onChangeText={handleCommentChange}
        value={comment}
      />
      <TouchableOpacity style={styles.review} onPress={handleSubmit}>
        <Text style={styles.text}>Post Review</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    backgroundColor: "#FFFF",
    flex: 1,
    justifyContent: 'flex-start', // Adjust vertical alignment
    alignItems: 'stretch',        // Adjust horizontal alignment
   
  
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 190,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 15,
   
    paddingLeft: 10,
    borderRadius: 8,
    marginLeft: 20,
  },
  button: {
    padding: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    paddingHorizontal: 155,
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginVertical: 10,
    color: "white",
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 0,
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 0,
    marginBottom: 15,
    padding: 0,
  },
  text2: {
    fontSize: 16,
    color: "#000",
    marginBottom: 30,
    margin: 0,
    width: 150,
    padding: 0,
    marginTop: 2,
  },
  text: {
    color: "white",
    fontSize: 16,
    marginLeft:8
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
    flexDirection: 'row',
    alignContent: 'flex-end',
    marginLeft: 15,
    marginTop: 15,
   
    backgroundColor: "#fff",
  },
  review: {
    paddingVertical: 15,
    backgroundColor: "#739072",
    borderRadius: 5,
    marginTop: 70,
    width: "90%", // Full-width button
    alignItems: "center",
    marginTop: 20,
    marginLeft: 20

    // paddingHorizontal: isSmallScreen ? 100 : isMediumScreen ? 20 : 200,
    // paddingVertical: 15,
    // backgroundColor: "#739072",
    // marginVertical: 30,

    // borderRadius: 10
  },
  paragraph: {
   fontSize: 15,
   width: '80%',
   marginLeft: 23,
   marginTop: 20

  },
  restaurantName: {
    fontSize: 18,
    marginLeft: 25,
    fontWeight: "bold",
  }
});
