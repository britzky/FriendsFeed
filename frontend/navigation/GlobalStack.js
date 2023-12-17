import { createStackNavigator } from '@react-navigation/stack';
import { Home } from '../screens/Home';
import { Friend } from '../screens/Friend';
import { SearchRestaurant } from '../screens/SearchRestaurant';
import Restaurant from '../screens/Restaurant';
import { Review } from '../screens/Review';

export const GlobalStack = () => {

    const GlobalStack = createStackNavigator();

  return (
    <GlobalStack.Navigator>
        <GlobalStack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <GlobalStack.Screen name="Friend" component={Friend} options={{headerShown: false}} />
        <GlobalStack.Screen name="SearchRestaurant" component={SearchRestaurant} options={{headerShown: false}} />
        <GlobalStack.Screen name="Restaurant" component={Restaurant} options={{headerShown: false}} />
        <GlobalStack.Screen name="Review" component={Review} options={{headerShown: false}} />
    </GlobalStack.Navigator>

  )
}
