/**
 * GumiGenk Journal — Button Component
 * Premium button with ripple effect and variants
 */

import React, { useRef } from 'react';
import { 
  StyleSheet, Animated, Pressable, Text, ActivityIndicator, View, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
          bg: 'transparent',
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
            borderRadius: 9999, // Perfect pill
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
            ...(variant === 'primary' ? {
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 4,
            } : {})
          },
          fullWidth && styles.fullWidth,
          style,
        ]}
      >
        {variant === 'primary' && (
          <LinearGradient
            colors={['#F9E493', '#DCA83B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              StyleSheet.absoluteFill, 
              { 
                borderRadius: 9999,
                borderWidth: 1,
                borderColor: '#FFF3B3',
              }
            ]}
          />
        )}
        {loading ? (
          <ActivityIndicator size="small" color={variant === 'primary' ? '#2A1B00' : variantStyle.text} />
        ) : (
          <View style={styles.content}>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={sizeStyle.fontSize + 4}
                color={variant === 'primary' ? '#2A1B00' : variantStyle.text}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.text,
                {
                  color: variant === 'primary' ? '#2A1B00' : variantStyle.text,
                  fontSize: sizeStyle.fontSize,
                  fontFamily: fontFamily.bold,
                  letterSpacing: 0.5,
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
  glassOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  premiumGlassOverlay: {
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.9)', // Strong highlight on top edge
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)', // Deep shadow on bottom edge
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.5)',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
  },
});

export default Button;
