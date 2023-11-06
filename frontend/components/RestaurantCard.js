import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";

const RestaurantCard = ({ onPress, restaurantName, imageUrl, cuisine, rating }) => {
  return (
    <View style={styles.gridItem}>
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={({ pressed }) => [
          styles.button,
          pressed ? styles.buttonPressed : null,
        ]}
        onPress={onPress}
      >
        <View>
          <Image
            source={{ uri: imageUrl }}
            style={styles.restaurantImage}
          />

        </View>
        <View style={[styles.innerContainer]}>
          <Text style={styles.title}>{restaurantName}</Text>
          <Text style={styles.subTitle}>{rating}</Text>
          <Text>{cuisine}</Text>
        </View>
      </Pressable>
      <Pressable  android_ripple={{ color: "#ccc" }} style={styles.review} >
        <Text style={styles.text}>Write a Review</Text>
      </Pressable>
    </View>
  );
};
export default RestaurantCard;

const styles = StyleSheet.create({
  gridItem: {
    flex: 1,
    margin: 16,
    height: 310, /// adjust the length of the card
    borderRadius: 0,
    elevation: 4,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
   
  },
  restaurantImage: {
    width: "100%", // or some fixed width
    height: 160, // or some fixed height
    // borderRadius: 8, // if you want rounded corners
  },
  review: {
    backgroundColor: '#3d85c6',
    paddingHorizontal: 118,
    paddingVertical: 15,
    marginVertical: 10,
    padding: 0,
    margin: 0
  },
  text: {
    color: 'white',
    fontSize: 16,
    
  }
});


// fontSize: 16,
//     color: "gray",
//     marginBottom: 70,
//     margin: 0,
//     width: 150,
//     padding: 0,
//     marginTop: 2


//     // Add any other styling you want for the button here, like margin
//     marginVertical: 10,
//     color: 'white',
//     marginTop: 100