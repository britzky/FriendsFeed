import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

// Your component code
const ReviewsCard = ({ username, review, avatarUrl }) => {
  // Generate stars based on rating
  const stars = Array(5).fill(<AntDesign name="star" style={styles.star} />);

  const comments = "Optimus Prime: Autobots, our courage and strength will lead us to victory against the Decepticons. We must fight not just for ourselves, but for the peace of all worlds."

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.rating}>{stars}</View>
      <Text style={styles.reviewText}>{comments}</Text>
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
