/**
 * GumiGenk Journal — Custom Bottom Tab Bar
 * Premium animated tab bar with glassmorphic background
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TAB_ITEMS = [
  { name: 'JournalTab', label: 'Journal', icon: 'document-text', iconOutline: 'document-text-outline' },
  { name: 'MarketTab', label: 'Market', icon: 'trending-up', iconOutline: 'trending-up-outline' },
  { name: 'DashboardTab', label: 'Dashboard', icon: 'grid', iconOutline: 'grid-outline' },
  { name: 'SettingsTab', label: 'Settings', icon: 'settings', iconOutline: 'settings-outline' },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { colors, fontFamily } = useTheme();
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const tabWidth = (SCREEN_WIDTH - 32) / TAB_ITEMS.length;

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: state.index * tabWidth,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  return (
    <View style={[styles.container, { backgroundColor: colors.tabBar, borderTopColor: colors.border }]}>

      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = TAB_ITEMS[index];

        if (!tab) return null;

        const scaleAnim = useRef(new Animated.Value(1)).current;

        const onPress = () => {
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 0.9,
              duration: 80,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 5,
              tension: 100,
              useNativeDriver: true,
            }),
          ]).start();

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <Animated.View
              style={[
                styles.tabContent,
                { transform: [{ scale: scaleAnim }] },
              ]}
            >
              <Ionicons
                name={isFocused ? tab.icon : tab.iconOutline}
                size={22}
                color={isFocused ? colors.tabActive : colors.tabInactive}
              />
              <Text
                style={[
                  styles.label,
                  {
                    color: isFocused ? colors.tabActive : colors.tabInactive,
                    fontFamily: isFocused ? fontFamily.semiBold : fontFamily.medium,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Animated.View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingBottom: 28,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 4,
    height: 48,
    borderRadius: 14,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default CustomTabBar;
