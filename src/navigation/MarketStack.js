/**
 * GumiGenk Journal — Market Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketScreen from '../screens/market/MarketScreen';

const Stack = createNativeStackNavigator();

const MarketStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Market" component={MarketScreen} />
    </Stack.Navigator>
  );
};

export default MarketStack;
