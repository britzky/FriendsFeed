
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food.Finder</Text>
        <Text style={styles.subtitle}>Discover new restaurants one friend at a time</Text>
    </View>
  )
}
export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Adjust the color to match your screenshot
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'brown', // Replace with the actual color code you want
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loginText: {
    color: 'blue',
    marginTop: 15,
  }
});