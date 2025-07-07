import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export interface LoadCardProps {
  price: number | string;
  status: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  onPress?: () => void;
}

const statusColors: Record<string, string> = {
  Delivered: colors.success,
  Active: colors.primary,
  Processing: colors.warning,
  Scheduled: colors.textSecondary,
  default: colors.primary,
};

export const LoadCard: React.FC<LoadCardProps> = ({
  price,
  status,
  origin,
  destination,
  pickupDate,
  deliveryDate,
  onPress,
}) => {
  const statusColor = statusColors[status] || statusColors.default;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.price}>${price}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}> 
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <View style={styles.routeRow}>
        <View style={styles.routeCol}>
          <Text style={styles.city}>{origin}</Text>
          <Text style={styles.label}>Pickup</Text>
          <Text style={styles.date}>{pickupDate}</Text>
        </View>
        <View style={styles.routeArrow}>
          <Text style={styles.arrow}>→</Text>
        </View>
        <View style={styles.routeCol}>
          <Text style={styles.city}>{destination}</Text>
          <Text style={styles.label}>Drop</Text>
          <Text style={styles.date}>{deliveryDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    marginVertical: spacing.margin.sm,
    marginHorizontal: spacing.margin.md,
    padding: spacing.padding.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.margin.md,
  },
  price: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.small,
    textTransform: 'capitalize',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeCol: {
    flex: 1,
    alignItems: 'center',
  },
  city: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  label: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: typography.fontSize.small,
    color: colors.textMuted,
  },
  routeArrow: {
    paddingHorizontal: spacing.padding.md,
  },
  arrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});

export default LoadCard; 