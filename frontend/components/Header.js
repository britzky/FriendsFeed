import React from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import Icon from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

export const Header = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.titleContainer}>
        <Icon name="left" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Friends Feed</Text>
      </View>
      )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 400,
        alignSelf: 'center',
        width: '90%',
        paddingTop: StatusBar.currentHeight,
      },
      title: {
        flexGrow: 1,
        fontSize: 24,
        color: "#739072",
        fontFamily: "LuckiestGuy-Regular",
        textAlign: 'center'
      },

    })
