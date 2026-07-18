/**
 * GumiGenk Journal — Journal Stack Navigator
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import JournalScreen from '../screens/journal/JournalScreen';
import AddTradeScreen from '../screens/journal/AddTradeScreen';
import TradeDetailScreen from '../screens/journal/TradeDetailScreen';

const Stack = createNativeStackNavigator();

const JournalStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="AddTrade" component={AddTradeScreen} />
      <Stack.Screen name="TradeDetail" component={TradeDetailScreen} />
    </Stack.Navigator>
  );
};

export default JournalStack;
