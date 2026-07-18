/**
 * GumiGenk Journal — Button Component
 * Premium button with ripple effect and variants
 */

import React, { useRef } from 'react';
import { 
  StyleSheet, Animated, Pressable, Text, ActivityIndicator, View 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const Button = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
  ...props
}) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.accent,
          text: colors.textInverse,
          border: 'transparent',
        };
      case 'secondary':
        return {
          bg: colors.accentLight,
          text: colors.accent,
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.accent,
          border: colors.accent,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: colors.textPrimary,
          border: 'transparent',
        };
      case 'danger':
        return {
          bg: colors.loss,
          text: '#FFFFFF',
          border: 'transparent',
        };
      default:
        return {
          bg: colors.accent,
          text: colors.textInverse,
          border: 'transparent',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 14 };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: variantStyle.bg,
            borderColor: variantStyle.border,
            borderWidth: variant === 'outline' ? 1.5 : 0,
            paddingVertical: sizeStyle.paddingVertical,
            paddingHorizontal: sizeStyle.paddingHorizontal,
            borderRadius: br.md,
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={variantStyle.text} />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyle.fontSize + 4}
                color={variantStyle.text}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  color: variantStyle.text,
                  fontSize: sizeStyle.fontSize,
                  fontFamily: fontFamily.semiBold,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={sizeStyle.fontSize + 4}
                color={variantStyle.text}
                style={styles.iconRight}
              />
            )}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;
