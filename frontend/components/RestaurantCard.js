import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const RestaurantCard = ({
  onPress,
  onReviewPress,
  restaurantName,
  imageUrl,
  cuisine,
  rating,
  isIndividual,
  address,
}) => {

  return isIndividual ? (
    <View style={styles.gridItem}>
      <View>
        <Image
          source={{
            uri: imageUrl,
          }}
          style={styles.restaurantImage}
        />
      </View>
      <Text style={styles.title}>{restaurantName}</Text>
      <Text style={styles.icon}>
        <AntDesign name="star" style={styles.icon} />
        <AntDesign name="star" style={styles.icon} />
        <AntDesign name="star" style={styles.icon} />
        <AntDesign name="star" style={styles.icon} />
      </Text>
      <Text style={styles.subTitle}>{rating}</Text>
      <Text style={styles.address}>{address}</Text>
      <Pressable android_ripple={{ color: "#ccc" }} style={styles.review} onPress={onReviewPress}>
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
        <View style={[styles.innerContainer]}>
          <Text style={styles.title}>{restaurantName}</Text>
          <Text style={styles.icon}>
            <AntDesign name="star" style={styles.icon} />
            <AntDesign name="star" style={styles.icon} />
            <AntDesign name="star" style={styles.icon} />
            <AntDesign name="star" style={styles.icon} />
          </Text>
          <Text style={styles.subTitle}>{rating}</Text>
          <Text style={styles.cuisine}>{cuisine}</Text>
        </View>
      </Pressable>
      <Pressable android_ripple={{ color: "#ccc" }} style={styles.review} onPress={onReviewPress}>
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
    // borderRadius: 0,
    // elevation: 4,
    // backgroundColor: "white",
    // shadowColor: "black",
    // shadowOpacity: 0.25,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    marginTop: 25,
    // overflow: Platform.OS === "android" ? "hidden" : "visible",                                   /// COME BACK TO THIS
    borderBottomColor: "#999999", // Light grey color for the divider
    borderBottomWidth: 1, // One pixel bottom border
    marginVertical: 8, // You can adjust vertical margin as needed
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
    fontSize: 18,
    alignItems: "flex-start", // Align items to the start of the cross axis (top for a column, left for a row)
    alignSelf: "stretch",
    marginTop: 5,
  },
  restaurantImage: {
    width: "100%", // or some fixed width
    height: 160, // or some fixed height
    // borderRadius: 8, // if you want rounded corners
  },
  review: {
    paddingHorizontal: 135,
    paddingVertical: 15,
    backgroundColor: "#3d85c6",
    marginVertical: 10,
    padding: 0,
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
    alignItems: "flex-start", // Align items to the start of the cross axis (top for a column, left for a row)
    alignSelf: "stretch",
  },
  cuisine: {
    alignItems: "flex-start", // Align items to the start of the cross axis (top for a column, left for a row)
    alignSelf: "stretch",
  },
  icon2: {
    flexDirection: "row", // Align children horizontally
    alignItems: "center", // Center children vertically in the cross axis
    justifyContent: "center",
    marginTop: 5,
    marginRight: 10,
    color: 'white'
  },

});
