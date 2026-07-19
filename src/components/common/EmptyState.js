/**
 * GumiGenk Journal — EmptyState Component
 * Beautiful empty state with icon and call to action
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';
import AnimatedView from './AnimatedView';

const EmptyState = ({
  icon = 'document-text-outline',
  title = 'No Data Yet',
  subtitle = 'Start by adding your first entry',
  actionLabel,
  onAction,
  style,
}) => {
  const { colors, fontFamily } = useTheme();

  return (
    <AnimatedView animation="fadeScale" style={[styles.container, style]}>
      <View style={[styles.iconContainer, { backgroundColor: colors.accentLight }]}>
        <Ionicons name={icon} size={48} color={colors.accent} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fontFamily.semiBold }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: fontFamily.regular }]}>
        {subtitle}
      </Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="md"
          icon="add-circle-outline"
          style={styles.button}
        />
      )}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  button: {
    marginTop: 24,
  },
});

export default EmptyState;
