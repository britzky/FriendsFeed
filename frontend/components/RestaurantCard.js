import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { avatars } from "../assets";
import StarRating from "react-native-star-rating-widget";

const windowWidth = Dimensions.get("window").width;

const isLargeScreen = windowWidth > 600;
const isMediumScreen = windowWidth > 400 && windowWidth <= 600;
const isSmallScreen = windowWidth <= 400;

const RestaurantCard = ({
  onPress,
  onReviewPress,
  restaurantName,
  imageUrl,
  cuisine,
  rating,
  isIndividual,
  address,
  friendAvatars,
}) => {
  //Turn friend rating into stars
  const ratingComponent = (
    <StarRating
      rating={rating}
      maxStars={5}
      starSize={20}
      color="black" // or any color you want
      emptyColor="black" // or any other color for empty stars
      enableHalfStar={true}
      enableSwiping={false}
      starStyle={{ margin: 1 }}
    />
  );

  const MAX_AVATARS_DISPLAYED = 3;

  return isIndividual ? (
    <View style={styles.gridItem}>
      {imageUrl && (
        <View>
          <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
        </View>
      )}
      <Text style={styles.title}>{restaurantName}</Text>

      <View style={styles.avatarContainer}>
        {friendAvatars &&
          friendAvatars.slice(0, MAX_AVATARS_DISPLAYED).map((avatar, index) => (
            <Image
            key={index}
            source={avatars[avatar]}
            style={[styles.avatar, { marginLeft: index * -7 }]}
            />
            ))}
            <Text style={styles.overall}>Friend’s Overall Rating</Text>
      </View>
      
      
      <Text style={styles.rating2}>{rating && ratingComponent}</Text>
      <Text style={styles.address}>{address}</Text>
      <Pressable
        android_ripple={{ color: "#3A4D39" }}
        style={styles.review}
        onPress={onReviewPress}
      >
        <Text style={styles.text}>Write a Review</Text>
      </Pressable>
    </View>
  ) : (
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
          <Image source={{ uri: imageUrl }} style={styles.restaurantImage} />
        </View>
        <Text style={styles.title}>{restaurantName}</Text>
        <View style={styles.avatarContainer}>
          {friendAvatars &&
            friendAvatars.slice(0, MAX_AVATARS_DISPLAYED).map((avatar, index) => (
              <Image
                key={index}
                source={avatars[avatar]}
                style={[styles.avatar, { marginLeft: index * -7 }]}
              />
            ))}
          <Text style={styles.overall}>Friend’s Overall Rating</Text>
        </View>
        <View style={[styles.innerContainer]}>
          <Text style={styles.rating}>{rating && ratingComponent}</Text>
          <Text style={styles.cuisine}>{cuisine}</Text>
        </View>
      </Pressable>
      <Pressable
        android_ripple={{ color: "#3A4D39" }}
        style={styles.review}
        onPress={onReviewPress}
      >
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
    marginTop: 25,
    marginBottom: 20,
    borderBottomColor: "#999999",
    borderBottomWidth: 1,
    marginVertical: 8,
    alignSelf: "stretch",
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  innerContainer: {
    flex: 1,
   
    borderRadius: 8,
    justifyContent: "center",
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    alignItems: "flex-start",
    alignSelf: "stretch",
    marginBottom: 4,
  },
  restaurantImage: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  review: {
    paddingHorizontal: isSmallScreen ? 100 : isMediumScreen ? 135 : 200,
    paddingVertical: 15,
    backgroundColor: "#739072",
    marginVertical: 30,
    padding: 0,
    borderRadius: 10,
  },
  text: {
    color: "white",
    fontSize: 16,
    alignItems: "flex-start",
    alignSelf: "stretch",
  },

  icon: {
    color: "#f1c232",
    fontSize: 18,
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  cuisine: {
    marginTop: 10,
    alignItems: "flex-start",
    alignSelf: "stretch",
    fontSize: 16,
  },
  icon2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginRight: 10,
  },
  friends: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  avatar: {
    height: 25,
    width: 25,
  },
  avatarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // Add additional styling as needed, e.g., padding or margin
  },
  rating: {
    flex: 1,
    marginRight: 300,
  },
  overall: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    left: 40,
    fontSize: 16,
    fontStyle: "italic",
  },
  address: {
    marginTop: 7,
    fontSize: 16
  },
  rating2: {
    marginTop: 8
  }
});
