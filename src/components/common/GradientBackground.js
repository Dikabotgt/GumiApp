import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const GradientBackground = ({ children, style }) => {
  // Dark mode: Deep blue-black to pitch black
  const gradientColors = ['rgba(180, 140, 60, 0.15)', '#0A0A0A', '#0A0A0A'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.4, 1]}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
