/**
 * GumiGenk Journal — App Entry Point
 * Premium Trading Journal Application
 */

import React, { useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { useFonts, 
  Inter_300Light,
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import {
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { TradeProvider } from './src/context/TradeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { colors, isLoaded: themeLoaded } = useTheme();

  if (!themeLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: '#090A0E' }]}>
        <ActivityIndicator size="large" color="#C99853" />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={colors.statusBar === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <AppNavigator />
    </>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: '#090A0E' }]}>
        <ActivityIndicator size="large" color="#C99853" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <TradeProvider>
          <AppContent />
        </TradeProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
