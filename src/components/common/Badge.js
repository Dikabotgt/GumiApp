/**
 * GumiGenk Journal — Badge Component
 * Status badges for direction, profit/loss, etc.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Badge = ({
  label,
  variant = 'default', // 'default', 'profit', 'loss', 'buy', 'sell', 'accent', 'warning', 'info'
  size = 'sm', // 'xs', 'sm', 'md'
  style,
}) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'profit':
        return { bg: colors.profitLight, text: colors.profit };
      case 'loss':
        return { bg: colors.lossLight, text: colors.loss };
      case 'buy':
        return { bg: colors.profitLight, text: colors.profit };
      case 'sell':
        return { bg: colors.lossLight, text: colors.loss };
      case 'accent':
        return { bg: colors.accentLight, text: colors.accent };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'info':
        return { bg: colors.infoLight, text: colors.info };
      default:
        return { bg: colors.pressed, text: colors.textSecondary };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return { paddingH: 6, paddingV: 2, fontSize: 10 };
      case 'md':
        return { paddingH: 12, paddingV: 6, fontSize: 13 };
      default:
        return { paddingH: 8, paddingV: 3, fontSize: 11 };
    }
  };

  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyle.bg,
          paddingHorizontal: sizeStyle.paddingH,
          paddingVertical: sizeStyle.paddingV,
          borderRadius: br.full,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: variantStyle.text,
            fontSize: sizeStyle.fontSize,
            fontFamily: fontFamily.semiBold,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Badge;
