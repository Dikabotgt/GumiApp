/**
 * GumiGenk Journal — Bottom Tab Navigator
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './CustomTabBar';

// Import stack navigators
import JournalStack from './JournalStack';
import MarketStack from './MarketStack';
import DashboardStack from './DashboardStack';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Tab.Screen name="JournalTab" component={JournalStack} />
      <Tab.Screen name="MarketTab" component={MarketStack} />
      <Tab.Screen name="DashboardTab" component={DashboardStack} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
