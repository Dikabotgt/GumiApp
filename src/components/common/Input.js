/**
 * GumiGenk Journal — Input Component
 * Styled text input with label, error, and variants
 */

import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helper,
  icon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  editable = true,
  style,
  inputStyle,
  ...props
}) => {
  const { colors, fontFamily, borderRadius: br } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? colors.loss : colors.border,
      error ? colors.loss : colors.accent,
    ],
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: colors.textSecondary, fontFamily: fontFamily.medium }]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.card,
            borderRadius: br.md,
            borderColor,
            borderWidth: 1.5,
          },
          multiline && { minHeight: numberOfLines * 24 + 24 },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? colors.accent : colors.textTertiary}
            style={styles.icon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          editable={editable}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              fontFamily: fontFamily.regular,
            },
            multiline && styles.multiline,
            inputStyle,
          ]}
          {...props}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.textTertiary}
            />
          </Pressable>
        )}
      </Animated.View>
      {error && (
        <Text style={[styles.error, { color: colors.loss, fontFamily: fontFamily.regular }]}>
          {error}
        </Text>
      )}
      {helper && !error && (
        <Text style={[styles.helper, { color: colors.textTertiary, fontFamily: fontFamily.regular }]}>
          {helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  icon: {
    marginRight: 10,
  },
  rightIcon: {
    padding: 4,
    marginLeft: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  multiline: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  helper: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
});

export default Input;
