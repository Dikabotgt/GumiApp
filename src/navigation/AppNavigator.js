/**
 * GumiGenk Journal — App Navigator
 * Root navigation container
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import BottomTabNavigator from './BottomTabNavigator';

const AppNavigator = () => {
  const { colors, isDark } = useTheme();

  const baseTheme = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    dark: isDark,
    colors: {
      ...baseTheme.colors,
      primary: colors.accent,
      background: 'transparent',
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <RadialGradient id="glowTopLeft" cx="0%" cy="0%" r="70%">
              <Stop offset="0%" stopColor="#3d2c1e" stopOpacity="0.4" />
              <Stop offset="100%" stopColor={colors.background} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="glowBottomRight" cx="100%" cy="100%" r="80%">
              <Stop offset="0%" stopColor="#1a1c3b" stopOpacity="0.3" />
              <Stop offset="100%" stopColor={colors.background} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={colors.background} />
          <Rect width="100%" height="100%" fill="url(#glowTopLeft)" />
          <Rect width="100%" height="100%" fill="url(#glowBottomRight)" />
        </Svg>
      </View>
      <NavigationContainer theme={navigationTheme}>
        <BottomTabNavigator />
      </NavigationContainer>
    </View>
  );
};

export default AppNavigator;
