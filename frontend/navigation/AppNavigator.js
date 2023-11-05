import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../screens/Home';
import { Register } from '../screens/Register';
import { Login } from '../screens/Login'
import { enableScreens } from 'react-native-screens';
import { useAuth } from '../context/AuthProvider';

enableScreens();

const Stack = createStackNavigator();

export const AppNavigator = () => {
    const { isLoggedIn } = useAuth();
  return (
    <NavigationContainer>
        <Stack.Navigator initaialRouteName="Register">
            {isLoggedIn ? (
                <Stack.Screen name="Home" component={Home} />
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Register" component={Register} />
                    <Stack.Screen name="Login" component={Login} />
                </Stack.Group>
            )}
        </Stack.Navigator>
    </NavigationContainer>
  )
}
