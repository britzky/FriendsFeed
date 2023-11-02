import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const VERIFY_TOKEN = "https://colab-test.onrender.com/verify-token";

export default function VerifyToken() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make an API request to your verify-token route
        const response = await fetch(VERIFY_TOKEN, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer YOUR_JWT_TOKEN',
          },
        });

        if (response.status === 200) {

          const data = await response.json();
          setUserData(data);
        } else {
          // Handle token verification errors, e.g., redirect to sign-in
          const errorData = await response.json();
        console.error(errorData.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View>
      {userData ? (
        <>
          <Text>Logged in as: {userData.logged_in_as}</Text>
          <Text>Profile Picture: {userData.profile_picture}</Text>
        </>
      ) : (
        <Text>Verifying token...</Text>
      )}
    </View>
  );
}