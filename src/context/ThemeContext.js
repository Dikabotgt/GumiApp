/**
 * GumiGenk Journal — Theme Context
 * Provides dark/light theme switching with persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkColors, lightColors } from '../theme/colors';
import { textStyles, fontFamily, fontSize } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { shadows, cardShadow, glowShadow } from '../theme/shadows';

const THEME_STORAGE_KEY = '@gumiGenk_theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (saved !== null) {
          setIsDark(saved === 'dark');
        } else {
          setIsDark(systemScheme === 'dark' || systemScheme === null);
        }
      } catch (e) {
        // fallback to dark
        setIsDark(true);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = useCallback(async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newIsDark ? 'dark' : 'light');
    } catch (e) {
      // silent fail
    }
  }, [isDark]);

  const setTheme = useCallback(async (mode) => {
    const dark = mode === 'dark';
    setIsDark(dark);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      // silent fail
    }
  }, []);

  const colors = isDark ? darkColors : lightColors;

  const theme = {
    isDark,
    colors,
    textStyles,
    fontFamily,
    fontSize,
    spacing,
    borderRadius,
    shadows,
    cardShadow: cardShadow(isDark),
    glowShadow,
    toggleTheme,
    setTheme,
    isLoaded,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
