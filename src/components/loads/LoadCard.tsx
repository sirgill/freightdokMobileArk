import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';
import { useNavigation } from '@react-navigation/native';

export interface LoadCardProps {
  price: number | string;
  status: string;
  origin: string;
  destination: string;
  pickupDate?: string;
  deliveryDate?: string;
  equipmentType?: string;
  referenceNumber?: string;
  carrierName?: string;
  onPress?: () => void;
}

const statusColors: Record<string, string> = {
  Delivered: colors.success,
  Active: colors.primary,
  Processing: colors.warning,
  Scheduled: colors.textSecondary,
  default: colors.primary,
};

export const LoadCard: React.FC<LoadCardProps & { load?: any }> = ({
  price,
  status,
  origin,
  destination,
  pickupDate,
  deliveryDate,
  equipmentType,
  referenceNumber,
  carrierName,
  onPress,
  load,
}) => {
  const navigation = useNavigation();
  const statusColor = statusColors[status] || statusColors.default;

  const handlePress = () => {
    if (onPress) {onPress();}
    else if (load) {navigation.navigate('LoadDetails', { load });}
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.price}>${price}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      <View style={styles.routeRow}>
        <View style={styles.routeCol}>
          <FontAwesome5 name="dot-circle" size={16} color={colors.primary} style={styles.icon} />
          <Text style={styles.city}>{origin || 'Unknown'}</Text>
          <Text style={styles.label}>Pickup</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={14} color={colors.textMuted} style={styles.iconSmall} />
            <Text style={styles.date}>{pickupDate || 'TBD'}</Text>
          </View>
        </View>
        <View style={styles.routeArrow}>
          <MaterialIcons name="arrow-forward" size={24} color={colors.primary} />
        </View>
        <View style={styles.routeCol}>
          <FontAwesome5 name="map-marker-alt" size={16} color={colors.primary} style={styles.icon} />
          <Text style={styles.city}>{destination || 'Unknown'}</Text>
          <Text style={styles.label}>Drop</Text>
          <View style={styles.infoRow}>
            <MaterialIcons name="calendar-today" size={14} color={colors.textMuted} style={styles.iconSmall} />
            <Text style={styles.date}>{deliveryDate || 'TBD'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.detailsRow}>
        {equipmentType && (
          <View style={styles.detailItem}>
            <FontAwesome5 name="truck" size={14} color={colors.textSecondary} style={styles.iconSmall} />
            <Text style={styles.detailText}>{equipmentType}</Text>
          </View>
        )}
        {referenceNumber && (
          <View style={styles.detailItem}>
            <MaterialIcons name="confirmation-number" size={14} color={colors.textSecondary} style={styles.iconSmall} />
            <Text style={styles.detailText}>Load # {referenceNumber}</Text>
          </View>
        )}
        {carrierName && (
          <View style={styles.detailItem}>
            <MaterialIcons name="local-shipping" size={14} color={colors.textSecondary} style={styles.iconSmall} />
            <Text style={styles.detailText}>{carrierName}</Text>
          </View>
        )}
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
    marginBottom: spacing.margin.sm,
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
  icon: {
    marginBottom: 2,
  },
  iconSmall: {
    marginRight: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.margin.sm,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 2,
  },
  detailText: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
  },
});

export default LoadCard;
