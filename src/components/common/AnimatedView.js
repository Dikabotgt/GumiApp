/**
 * GumiGenk Journal — AnimatedView Component
 * Reusable animation wrapper supporting fade, slide, scale
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedView = ({
  children,
  animation = 'fadeSlideUp', // 'fade', 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'scale', 'fadeSlideUp', 'fadeScale'
  delay = 0,
  duration = 400,
  style,
  ...props
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Set initial values based on animation type
    switch (animation) {
      case 'fade':
        opacity.setValue(0);
        break;
      case 'slideUp':
        opacity.setValue(1);
        translateY.setValue(30);
        break;
      case 'slideDown':
        opacity.setValue(1);
        translateY.setValue(-30);
        break;
      case 'slideLeft':
        opacity.setValue(1);
        translateX.setValue(30);
        break;
      case 'slideRight':
        opacity.setValue(1);
        translateX.setValue(-30);
        break;
      case 'scale':
        opacity.setValue(1);
        scale.setValue(0.9);
        break;
      case 'fadeSlideUp':
        opacity.setValue(0);
        translateY.setValue(20);
        break;
      case 'fadeScale':
        opacity.setValue(0);
        scale.setValue(0.95);
        break;
      default:
        opacity.setValue(0);
    }

    const animations = [];

    // Opacity animation
    if (['fade', 'fadeSlideUp', 'fadeScale'].includes(animation)) {
      animations.push(
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    // TranslateY animation
    if (['slideUp', 'slideDown', 'fadeSlideUp'].includes(animation)) {
      animations.push(
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    // TranslateX animation
    if (['slideLeft', 'slideRight'].includes(animation)) {
      animations.push(
        Animated.timing(translateX, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    // Scale animation
    if (['scale', 'fadeScale'].includes(animation)) {
      animations.push(
        Animated.spring(scale, {
          toValue: 1,
          delay,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [animation, delay, duration]);

  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [
            { translateY },
            { translateX },
            { scale },
          ],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedView;
