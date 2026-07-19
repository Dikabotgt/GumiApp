/**
 * GumiGenk Journal — Skeleton Loading Component
 * Shimmer effect for loading states
 */

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const { colors } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
};

/**
 * Skeleton card for loading states
 */
export const SkeletonCard = ({ style }) => {
  const { colors, borderRadius: br } = useTheme();
  
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderRadius: br.lg }, style]}>
      <View style={styles.cardHeader}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.cardHeaderText}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <Skeleton width="100%" height={12} style={{ marginTop: 12 }} />
      <Skeleton width="80%" height={12} style={{ marginTop: 8 }} />
      <View style={styles.cardFooter}>
        <Skeleton width="30%" height={24} borderRadius={12} />
        <Skeleton width="25%" height={14} />
      </View>
    </View>
  );
};

/**
 * Skeleton stat card
 */
export const SkeletonStat = ({ style }) => {
  const { colors, borderRadius: br } = useTheme();
  
  return (
    <View style={[styles.stat, { backgroundColor: colors.card, borderRadius: br.lg }, style]}>
      <Skeleton width={24} height={24} borderRadius={12} />
      <Skeleton width="60%" height={12} style={{ marginTop: 10 }} />
      <Skeleton width="80%" height={20} style={{ marginTop: 6 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  stat: {
    padding: 16,
    flex: 1,
  },
});

export default Skeleton;
