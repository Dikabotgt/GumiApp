/**
 * GumiGenk Journal — Settings Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import CalculatorHubScreen from '../screens/calculator/CalculatorHubScreen';
import CalculatorDetailScreen from '../screens/calculator/CalculatorDetailScreen';
import AboutScreen from '../screens/settings/AboutScreen';

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="CalculatorHub" component={CalculatorHubScreen} />
      <Stack.Screen name="CalculatorDetail" component={CalculatorDetailScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export default SettingsStack;
