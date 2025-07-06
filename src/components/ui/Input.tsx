import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputStyle = [
    styles.base,
    styles[variant],
    isFocused && styles.focused,
    error && styles.error,
    leftIcon && styles.withLeftIcon,
    rightIcon && styles.withRightIcon,
    style,
  ].filter(Boolean);

  const containerStyle = [
    styles.container,
    error && styles.containerError,
  ].filter(Boolean);

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText].filter(Boolean)}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.margin.md,
  },
  containerError: {
    marginBottom: spacing.margin.sm,
  },
  label: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.margin.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  base: {
    flex: 1,
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    paddingVertical: spacing.padding.sm,
    paddingHorizontal: spacing.padding.md,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  outlined: {
    backgroundColor: colors.white,
  },
  filled: {
    backgroundColor: colors.lightGray,
    borderColor: 'transparent',
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  withLeftIcon: {
    paddingLeft: spacing.padding.sm,
  },
  withRightIcon: {
    paddingRight: spacing.padding.sm,
  },
  leftIcon: {
    position: 'absolute',
    left: spacing.padding.sm,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: spacing.padding.sm,
    zIndex: 1,
  },
  helperText: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.margin.xs,
  },
  errorText: {
    color: colors.error,
  },
}); 