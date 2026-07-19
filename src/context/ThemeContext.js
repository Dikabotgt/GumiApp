/**
 * GumiGenk Journal — Theme Context
 * Provides dark/light theme switching with persistence
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { darkColors } from '../theme/colors';
import { textStyles, fontFamily, fontSize } from '../theme/typography';
import { spacing, borderRadius } from '../theme/spacing';
import { shadows, cardShadow, glowShadow } from '../theme/shadows';

const THEME_STORAGE_KEY = '@gumiGenk_theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const colors = darkColors;

  const theme = {
    colors,
    textStyles,
    fontFamily,
    fontSize,
    spacing,
    borderRadius,
    shadows,
    cardShadow: cardShadow(),
    glowShadow,
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
