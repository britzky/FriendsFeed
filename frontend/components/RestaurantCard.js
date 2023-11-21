import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { avatars } from "../assets";
import { Rating } from "react-native-ratings";


const windowWidth = Dimensions.get('window').width;

const isLargeScreen = windowWidth > 600;
const isMediumScreen = windowWidth > 400 && windowWidth <= 600;
const isSmallScreen = windowWidth <= 400;

const RestaurantCard = ({
  onPress, onReviewPress, restaurantName, imageUrl, cuisine, rating,
  isIndividual, address, friendAvatars
}) => {

  //Turn friend rating into stars
  const ratingComponent = (
    <Rating
      readonly
      startingValue={rating}
      imageSize={20}
      style={styles.icon2}
    />
  )

  return isIndividual ? (
    <View style={styles.gridItem}>
      <View>
        <Image source={{ uri: imageUrl,}} style={styles.restaurantImage} />
      </View>
      <View>
        {friendAvatars && friendAvatars.map((avatar, index) => (
          <Image
            key={index}
            source={avatars[avatar]}
            style={styles.avatar}
          />
        ))}
      </View>
      <Text style={styles.title}>{restaurantName}</Text>
      {ratingComponent}
      <Text style={styles.address}>{address}</Text>
      <Pressable android_ripple={{ color: "#3A4D39" }} style={styles.review} onPress={onReviewPress}>
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
        <View style={styles.avatarContainer}>
        {friendAvatars && friendAvatars.map((avatar, index) => (
          <Image
            key={index}
            source={avatars[avatar]}
            style={styles.avatar}
          />
        ))}
        </View>
        <View style={[styles.innerContainer]}>
          <Text style={styles.title}>{restaurantName}</Text>
          {ratingComponent}
          <Text style={styles.cuisine}>{cuisine}</Text>
        </View>
      </Pressable>
      <Pressable android_ripple={{ color: "#3A4D39" }} style={styles.review} onPress={onReviewPress}>
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
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 10
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
    color: 'white'
  },
  friends: {
    alignItems: "flex-start",
    alignSelf: "stretch",
    fontSize: 16,
    fontFamily: "Roboto"
  },
  avatar: {
    height: 50,
    width: 50,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Add additional styling as needed, e.g., padding or margin
  },

});