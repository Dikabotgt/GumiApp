/**
 * GumiGenk Journal — Card Component
 * Premium glassmorphic card with shadow and animation
 */

import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Card = ({
  children,
  style,
  variant = 'default', // 'default', 'elevated', 'glass', 'outlined', 'accent'
  onPress,
  disabled = false,
  ...props
}) => {
  const { colors, borderRadius: br, cardShadow } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        friction: 8,
        tension: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.cardElevated,
          ...cardShadow,
        };
      case 'glass':
        return {
          backgroundColor: colors.glass,
          borderWidth: 1,
          borderColor: colors.glassBorder,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'accent':
        return {
          backgroundColor: colors.accentLight,
          borderWidth: 1,
          borderColor: colors.borderAccent,
        };
      default:
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.borderLight,
        };
    }
  };

  const cardStyles = [
    styles.card,
    { borderRadius: br.xl },
    getVariantStyles(),
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Animated.View
          style={[
            ...cardStyles,
            { transform: [{ scale: scaleAnim }] },
            disabled && styles.disabled,
          ]}
          {...props}
        >
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <View style={[...cardStyles, disabled && styles.disabled]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Card;
