import { View } from "react-native";

const FriendScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const validationErrors = {};
    if (!formData.username) {
      validationErrors.username = "username is required";
    }
  };
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="@BritzkyDog"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.username}</Text>}
    </View>
  );
};
export default FriendScreen;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF',
    },
    input: {
      height: 40,
      width: '70%',
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingLeft: 10, 
      marginLeft: 9,
      flexDirection: 'row',
      marginTop: 15,
      
    },
    button: {
      padding: 10,
      backgroundColor: '#007BFF',
      borderRadius: 5,
    },
  });
  
