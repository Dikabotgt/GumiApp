/**
 * GumiGenk Journal — Header Component
 * Screen header with optional back button and actions
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const Header = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightActions = [],
  transparent = false,
  style,
}) => {
  const { colors, fontFamily } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent ? 'transparent' : colors.background,
          borderBottomColor: transparent ? 'transparent' : colors.divider,
        },
        style,
      ]}
    >
      <StatusBar
        barStyle={colors.statusBar === 'light' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={styles.content}>
        <View style={styles.left}>
          {showBack && (
            <Pressable
              onPress={onBack}
              style={[styles.backButton, { backgroundColor: colors.pressed }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
            </Pressable>
          )}
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                { color: colors.textPrimary, fontFamily: fontFamily.bold },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.textSecondary, fontFamily: fontFamily.regular },
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {rightActions.length > 0 && (
          <View style={styles.right}>
            {rightActions.map((action, index) => (
              <Pressable
                key={index}
                onPress={action.onPress}
                style={[styles.actionButton, { backgroundColor: colors.pressed }]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={action.icon}
                  size={22}
                  color={action.color || colors.textPrimary}
                />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
