/**
 * GumiGenk Journal — Shadow System
 * Elevation presets with optional glow effects
 */

import { Platform } from 'react-native';

export const createShadow = (elevation, color = '#000000', opacity = 0.25) => {
  if (Platform.OS === 'android') {
    return { elevation };
  }
  
  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height: Math.ceil(elevation / 2),
    },
    shadowOpacity: opacity,
    shadowRadius: elevation,
  };
};

export const shadows = {
  none: createShadow(0),
  sm: createShadow(2, '#000000', 0.1),
  md: createShadow(4, '#000000', 0.15),
  lg: createShadow(8, '#000000', 0.2),
  xl: createShadow(12, '#000000', 0.25),
  '2xl': createShadow(16, '#000000', 0.3),
};

export const glowShadow = (color, intensity = 0.4) => {
  if (Platform.OS === 'android') {
    return { elevation: 8 };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: intensity,
    shadowRadius: 12,
  };
};

export const cardShadow = (isDark) => {
  if (isDark) {
    return createShadow(6, '#000000', 0.4);
  }
  return createShadow(4, '#000000', 0.08);
};
