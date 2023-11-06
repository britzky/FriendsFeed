// import {
//   Text,
//   TextInput,
//   StyleSheet,
//   View,
//   Button,
//   Pressable,
//   FlatList,
// } from "react-native";
// import React, { useState } from "react";
// import RestaurantCard from "./RestaurantCard";

// const RestaurantList = () => {
//   const [formData, setFormData] = useState({
//     zipcode: "",
//   });

//   const [errors, setErrors] = useState({});

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const renderRestaurantItem = (item) => {};

//   return (
//     // <View>
//     //   <TextInput
//     //     style={styles.input}
//     //     placeholder="zipcode"
//     //     value={formData.zipcode}
//     //     onChangeText={(text) => handleChange("zipcode", text)}
//     //   />
//     //   {errors.zipcode && <Text style={{ color: "red" }}>{errors.zipcode}</Text>}

//     //   <Pressable
//     //     style={styles.button}
//     //     onPress={() => {
//     //       /* handle button press */
//     //     }}
//     //   >
//     //     <Text style={styles.buttonText}>Submit</Text>
//     //   </Pressable>

//     //   <FlatList data={} keyExtractor={(item) => item.id} />
//     // </View>
//   );
// };
// export default RestaurantList;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//   },
//   input: {
//     height: 40,
//     width: "70%",
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingLeft: 10,
//     marginLeft: 9,
//     flexDirection: "row",
//     marginTop: 15,
//   },
//   button: {
//     padding: 10,
//     backgroundColor: "#007BFF",
//     borderRadius: 5,
//   },
// });
