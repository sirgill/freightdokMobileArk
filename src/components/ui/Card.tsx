import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'small' | 'medium' | 'large' | 'none';
  borderRadius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = 'medium',
  borderRadius = 'md',
}) => {
  const cardStyle = [
    styles.base,
    styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}` as keyof typeof styles],
    styles[`borderRadius${borderRadius.charAt(0).toUpperCase() + borderRadius.slice(1)}` as keyof typeof styles],
    shadow !== 'none' && styles[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}` as keyof typeof styles],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  // Padding variants
  paddingXs: {
    padding: spacing.padding.xs,
  },
  paddingSm: {
    padding: spacing.padding.sm,
  },
  paddingMd: {
    padding: spacing.padding.md,
  },
  paddingLg: {
    padding: spacing.padding.lg,
  },
  paddingXl: {
    padding: spacing.padding.xl,
  },
  
  // Border radius variants
  borderRadiusXs: {
    borderRadius: spacing.borderRadius.xs,
  },
  borderRadiusSm: {
    borderRadius: spacing.borderRadius.sm,
  },
  borderRadiusMd: {
    borderRadius: spacing.borderRadius.md,
  },
  borderRadiusLg: {
    borderRadius: spacing.borderRadius.lg,
  },
  borderRadiusXl: {
    borderRadius: spacing.borderRadius.xl,
  },
  
  // Shadow variants
  shadowSmall: {
    ...spacing.shadows.small,
  },
  shadowMedium: {
    ...spacing.shadows.medium,
  },
  shadowLarge: {
    ...spacing.shadows.large,
  },
}); 