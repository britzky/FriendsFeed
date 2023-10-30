import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MyForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Perform validation here and set errors if necessary
    const validationErrors = {};
    if (!formData.username) {
      validationErrors.username = 'username is required';
    }
    if (!formData.password) {
      validationErrors.password = 'Password is required';
    }

    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, you can submit the data or take any other action here
      // For example, send the data to an API
    } else {
      // Form is not valid, update the errors state
      setErrors(validationErrors);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput
        placeholder="username"
        value={formData.username}
        onChangeText={(text) => handleChange('username', text)}
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password}</Text>}

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}