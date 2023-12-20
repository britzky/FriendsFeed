import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import { avatars } from "../assets";
import StarRating from "react-native-star-rating-widget";

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
      color="black"
      emptyColor="black"
      enableHalfStar={true}
      enableSwiping={false}
      starStyle={{ marginRight: -5 }}
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
        {friendAvatars &&
          friendAvatars.slice(0, MAX_AVATARS_DISPLAYED).map((avatar, index) => (
            <View style={styles.avatarContainer}>
            <Image
            key={index}
            source={avatars[avatar]}
            style={[
              styles.avatar,
              { marginLeft: index === 0 ? 0 : -10 } // Adjust -10 to control overlap
            ]}
            />
        <Text style={styles.overall}>Friend’s Overall Rating</Text>
      </View>
        ))}
      <View>
        <Text>{rating && ratingComponent}</Text>
      </View>
      <Text style={styles.address}>{address}</Text>
      <Pressable
        android_ripple={{ color: "#3A4D39" }}
        style={styles.reviewButton}
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
                style={[
                  styles.avatar,
                  { marginLeft: index === 0 ? 0 : -10 }
                ]}
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
        style={styles.reviewButton}
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
    width: '100%'
  },
  restaurantImage: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  avatarContainer: {
    flexDirection: "row",
  },
  avatar: {
    height: 25,
    width: 25,
  },
  overall: {
    marginLeft: 5,
    fontSize: 16,
    fontStyle: "italic",
  },
  address: {
    fontSize: 16
  },
  reviewButton: {
    paddingHorizontal: 100,
    paddingVertical: 15,
    backgroundColor: "#739072",
    marginVertical: 30,
    borderRadius: 10,
    width: '100%'
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  cuisine: {
    marginTop: 5,
    fontSize: 16,
  },
  rating: {
    marginRight: 300,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'flex-start',
  },
  buttonPressed: {
    opacity: 0.5,
  },
});
