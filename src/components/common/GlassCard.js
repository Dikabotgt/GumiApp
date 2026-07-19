import React, { useRef } from "react";
import { View, StyleSheet, Animated, Pressable, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../../context/ThemeContext";

const GlassCard = ({
  children,
  style,
  variant = "default", // 'default', 'elevated', 'outlined', 'accent'
  onPress,
  disabled = false,
  intensity = 20,
  contentStyle,
  ...props
}) => {
  const { colors, borderRadius: br, cardShadow } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        friction: 6,
        tension: 120,
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
    // For glassmorphism, semi-transparent backgrounds + Android elevation creates a double/messy layer.
    // We remove shadow elevation on Android for glass cards and let BlurView handle the depth.
    const isAndroid = Platform.OS === 'android';
    const shadowStyle = isAndroid ? {} : cardShadow;

    switch (variant) {
      case "elevated":
        return {
          backgroundColor: isAndroid ? "transparent" : "rgba(255, 255, 255, 0.03)",
          ...shadowStyle,
        };
      case "accent":
        return {
          backgroundColor: isAndroid ? "transparent" : "rgba(226, 200, 124, 0.05)",
        };
      case "outlined":
        return {
          backgroundColor: "transparent",
        };
      default:
        return {
          backgroundColor: isAndroid ? "transparent" : "rgba(255, 255, 255, 0.02)",
        };
    }
  };

  const borderStyles = {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.10)",
    borderLeftColor: "rgba(255, 255, 255, 0.10)",
    borderRightColor: "rgba(255, 255, 255, 0.10)",
    borderBottomColor: "rgba(255, 255, 255, 0.10)",
  };

  if (variant === "outlined" || variant === "accent") {
    borderStyles.borderTopColor =
      variant === "accent" ? colors.borderAccent : colors.border;
    borderStyles.borderLeftColor =
      variant === "accent" ? colors.borderAccent : colors.border;
    borderStyles.borderRightColor =
      variant === "accent" ? colors.borderAccent : colors.border;
    borderStyles.borderBottomColor =
      variant === "accent" ? colors.borderAccent : colors.border;
  }

  const containerStyles = [
    styles.container,
    { borderRadius: br.xl },
    borderStyles,
    getVariantStyles(),
    style,
  ];

  const content = (
    <BlurView
      intensity={30}
      tint="dark"
      style={StyleSheet.absoluteFill}
    />
  );

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
            ...containerStyles,
            { transform: [{ scale: scaleAnim }] },
            disabled && styles.disabled,
          ]}
          {...props}
        >
          {content}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <View style={[...containerStyles, disabled && styles.disabled]} {...props}>
      {content}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  content: {
    padding: 20,
    zIndex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default GlassCard;
