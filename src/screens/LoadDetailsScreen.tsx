import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { parseISO, isValid, format } from 'date-fns';
import StatusDropdown from '../components/StatusDropdown';
import { updateLoadStatus } from '../services/api';
import { LOAD_STATUSES } from '../components/StatusDropdown';

// Define the expected route params
interface LoadDetailsScreenRouteParams {
  load: any;
}

// Status progression for smart suggestions
const STATUS_PROGRESSION = {
  loadCheckIn: ['arrivedAtPickup', 'pickupCompete'],
  arrivedAtPickup: ['pickupCompete'],
  pickupCompete: ['enRoute'],
  enRoute: ['arrivedAtDelivery'],
  arrivedAtDelivery: ['delivered'],
  delivered: [],
  archived: [],
};

const LoadDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, LoadDetailsScreenRouteParams>, string>>();
  const { load } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentLoad, setCurrentLoad] = useState(load);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Helper to format dates consistently
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    const d = parseISO(dateStr);
    if (!isValid(d)) return 'TBD';
    return format(d, 'MM/dd/yyyy h:mm a');
  };

  // Helper to format dates only (no time)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'TBD';
    const d = parseISO(dateStr);
    if (!isValid(d)) return 'TBD';
    return format(d, 'MM/dd/yyyy');
  };

  // Extract location data
  const getLocation = (loc: any, cityKey = 'city', stateKey = 'stateCode') => {
    if (!loc) return { city: 'Unknown', state: '' };
    if (typeof loc === 'string') return { city: loc, state: '' };
    return {
      city: loc[cityKey] || 'Unknown',
      state: loc[stateKey] || ''
    };
  };

  // Origin and destination
  let origin = getLocation(currentLoad.origin);
  if (origin.city === 'Unknown') origin = getLocation(currentLoad.pickupLocation);
  if (origin.city === 'Unknown' && currentLoad.pickup && Array.isArray(currentLoad.pickup) && currentLoad.pickup[0]) {
    origin = getLocation(currentLoad.pickup[0], 'pickupCity', 'pickupState');
  }

  let destination = getLocation(currentLoad.destination);
  if (destination.city === 'Unknown') destination = getLocation(currentLoad.deliveryLocation);
  if (destination.city === 'Unknown' && currentLoad.drop && Array.isArray(currentLoad.drop) && currentLoad.drop[0]) {
    destination = getLocation(currentLoad.drop[0], 'dropCity', 'dropState');
  }

  // Extract pickup and drop details for display
  const pickupDetails = currentLoad.pickup && Array.isArray(currentLoad.pickup) && currentLoad.pickup[0] ? currentLoad.pickup[0] : null;
  const dropDetails = currentLoad.drop && Array.isArray(currentLoad.drop) && currentLoad.drop[0] ? currentLoad.drop[0] : null;

  // Helper to format address components
  const formatAddress = (details: any, type: 'pickup' | 'drop') => {
    if (!details) return null;
    
    const name = type === 'pickup' ? details.shipperName : details.receiverName;
    const address = type === 'pickup' ? details.pickupAddress : details.dropAddress;
    const city = type === 'pickup' ? details.pickupCity : details.dropCity;
    const state = type === 'pickup' ? details.pickupState : details.dropState;
    const zip = type === 'pickup' ? details.pickupZip : details.dropZip;
    
    return {
      name: name || '—',
      address: address || '—',
      cityStateZip: [city, state, zip].filter(Boolean).join(', ') || '—'
    };
  };

  const pickupAddress = formatAddress(pickupDetails, 'pickup');
  const dropAddress = formatAddress(dropDetails, 'drop');

  // Dates
  const pickupDate = formatDateTime(currentLoad.pickUpByDate || currentLoad.pickupDate || (currentLoad.pickup && Array.isArray(currentLoad.pickup) && currentLoad.pickup[0]?.pickupDate) || currentLoad.pickupDateTime || '');
  const deliveryDate = formatDateTime(currentLoad.deliverBy || currentLoad.deliveryDate || (currentLoad.drop && Array.isArray(currentLoad.drop) && currentLoad.drop[0]?.dropDate) || currentLoad.deliveryDateTime || '');

  // Equipment
  const equipmentType = (currentLoad.equipment && currentLoad.equipment.modes ? currentLoad.equipment.modes.join(', ') : '') + (currentLoad.equipment && currentLoad.equipment.length && currentLoad.equipment.length.standard ? `, ${currentLoad.equipment.length.standard}ft` : '');

  // Price and status
  const price = currentLoad.rate || currentLoad.price || 0;
  const status = currentLoad.status || 'Active';
  const brokerName = currentLoad.brokerage || currentLoad.company || '—';
  const loadNumber = currentLoad.loadNumber || currentLoad.referenceNumber || currentLoad._id;

  // Status colors - updated to match web app status IDs
  const statusColors: Record<string, string> = {
    delivered: colors.success,
    archived: colors.textSecondary,
    loadCheckIn: colors.primary,
    pickupCompete: colors.primary,
    arrivedAtDelivery: colors.primary,
    arrivedAtPickup: colors.primary,
    enRoute: colors.primary,
    // Fallback for any other statuses
    Active: colors.primary,
    Processing: colors.warning,
    Scheduled: colors.textSecondary,
    default: colors.primary,
  };

  const statusColor = statusColors[status] || statusColors.default;

  // Get suggested next statuses
  const suggestedStatuses = STATUS_PROGRESSION[status as keyof typeof STATUS_PROGRESSION] || [];

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === status) {
      return; // No change needed
    }

    setIsUpdating(true);
    
    try {
      // Optimistic update - update UI immediately
      const updatedLoad = { ...currentLoad, status: newStatus };
      setCurrentLoad(updatedLoad);
      
      // Make API call
      const result = await updateLoadStatus(currentLoad._id, newStatus);
      
      if (result.success) {
        // Success - UI is already updated
        Alert.alert('Success', 'Status updated successfully');
        setShowStatusDropdown(false);
      } else {
        // Revert optimistic update on failure
        setCurrentLoad(load);
        Alert.alert('Error', result.message || 'Failed to update status');
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setCurrentLoad(load);
      Alert.alert('Error', error.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickStatusUpdate = async (newStatus: string) => {
    await handleStatusUpdate(newStatus);
  };

  const getStatusLabel = (statusId: string) => {
    const statusMap: Record<string, string> = {
      loadCheckIn: 'Load Check-In',
      pickupCompete: 'Pickup Complete',
      arrivedAtDelivery: 'Arrived at Delivery',
      arrivedAtPickup: 'Arrived at Pickup',
      enRoute: 'En Route to Delivery',
      archived: 'Archived',
      delivered: 'Delivered',
    };
    return statusMap[statusId] || statusId;
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Main Card */}
        <View style={styles.mainCard}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.loadNumber}>Load #{loadNumber}</Text>
          </View>

          {/* Price Section - Prominent Display */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Rate</Text>
            <Text style={styles.price}>${price.toLocaleString()}</Text>
          </View>

          {/* Status Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <TouchableOpacity
              style={[styles.statusBadge, { backgroundColor: statusColor }]}
              onPress={() => setShowStatusDropdown((prev) => !prev)}
              disabled={isUpdating}
            >
              <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
              <MaterialIcons name={showStatusDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={16} color={colors.white} style={styles.statusArrow} />
            </TouchableOpacity>
            {showStatusDropdown && (
              <View style={styles.inlineDropdown}>
                {LOAD_STATUSES.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.dropdownOption, status === option.id && styles.selectedDropdownOption]}
                    onPress={async () => {
                      await handleStatusUpdate(option.id);
                      setShowStatusDropdown(false);
                    }}
                    disabled={isUpdating}
                  >
                    <Text style={[styles.dropdownOptionText, status === option.id && styles.selectedDropdownOptionText]}>{option.label}</Text>
                    {status === option.id && (
                      <MaterialIcons name="check" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text style={styles.lastUpdatedText}>
              Last updated: {currentLoad.updatedAt ? formatDateTime(currentLoad.updatedAt) : 'N/A'}
            </Text>
          </View>

          {/* Quick Status Actions */}
          {suggestedStatuses.length > 0 && (
            <View style={styles.quickActionsSection}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsContainer}>
                {suggestedStatuses.map((suggestedStatus) => (
                  <TouchableOpacity
                    key={suggestedStatus}
                    style={[styles.quickActionButton, { backgroundColor: statusColors[suggestedStatus] || colors.primary }]}
                    onPress={() => handleQuickStatusUpdate(suggestedStatus)}
                    disabled={isUpdating}
                  >
                    <Text style={styles.quickActionText}>{getStatusLabel(suggestedStatus)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Route Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route</Text>
            <View style={styles.routeContainer}>
              <View style={styles.routePointAligned}>
                <FontAwesome5 name="dot-circle" size={16} color={colors.primary} style={styles.routeIcon} />
                <View style={styles.routeTextAligned}>
                  <Text style={styles.routeLabel}>Pickup</Text>
                  {pickupAddress && (
                    <View style={styles.addressDetails}>
                      <Text style={styles.addressName}>{pickupAddress.name}</Text>
                      <Text style={styles.addressStreet}>{pickupAddress.address}</Text>
                      <Text style={styles.addressCityStateZip}>{pickupAddress.cityStateZip}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.routeArrowAligned}>
                <MaterialIcons name="arrow-forward" size={28} color={colors.primary} />
              </View>
              <View style={styles.routePointAligned}>
                <FontAwesome5 name="map-marker-alt" size={16} color={colors.primary} style={styles.routeIcon} />
                <View style={styles.routeTextAligned}>
                  <Text style={styles.routeLabel}>Delivery</Text>
                  {dropAddress && (
                    <View style={styles.addressDetails}>
                      <Text style={styles.addressName}>{dropAddress.name}</Text>
                      <Text style={styles.addressStreet}>{dropAddress.address}</Text>
                      <Text style={styles.addressCityStateZip}>{dropAddress.cityStateZip}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Dates Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.dateRow}>
              <MaterialIcons name="schedule" size={16} color={colors.textSecondary} style={styles.dateIcon} />
              <View style={styles.dateText}>
                <Text style={styles.dateLabel}>Pickup</Text>
                <Text style={styles.dateValue}>{pickupDate}</Text>
              </View>
            </View>
            <View style={styles.dateRow}>
              <MaterialIcons name="event" size={16} color={colors.textSecondary} style={styles.dateIcon} />
              <View style={styles.dateText}>
                <Text style={styles.dateLabel}>Delivery</Text>
                <Text style={styles.dateValue}>{deliveryDate}</Text>
              </View>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <MaterialIcons name="business" size={16} color={colors.textSecondary} style={styles.detailIcon} />
              <View style={styles.detailText}>
                <Text style={styles.detailLabel}>Broker</Text>
                <Text style={styles.detailValue}>{brokerName}</Text>
              </View>
            </View>
            {equipmentType && (
              <View style={styles.detailRow}>
                <FontAwesome5 name="truck" size={16} color={colors.textSecondary} style={styles.detailIcon} />
                <View style={styles.detailText}>
                  <Text style={styles.detailLabel}>Equipment</Text>
                  <Text style={styles.detailValue}>{equipmentType}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.padding.lg,
  },
  mainCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
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
    marginBottom: spacing.margin.lg,
  },
  loadNumber: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginRight: spacing.margin.md,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: spacing.margin.lg,
    paddingVertical: spacing.padding.lg,
    backgroundColor: colors.lightGray,
    borderRadius: spacing.borderRadius.md,
  },
  priceLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    marginBottom: spacing.margin.xs,
  },
  price: {
    fontSize: 32,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.margin.lg,
    paddingTop: spacing.padding.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.margin.md,
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.small,
    textTransform: 'capitalize',
    marginRight: 4,
  },
  statusArrow: {
    marginLeft: 2,
  },
  quickActionsSection: {
    marginBottom: spacing.margin.lg,
    paddingBottom: spacing.padding.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.margin.sm,
  },
  quickActionButton: {
    borderRadius: spacing.borderRadius.md,
    paddingHorizontal: spacing.padding.md,
    paddingVertical: spacing.padding.sm,
    minWidth: 120,
    alignItems: 'center',
  },
  quickActionText: {
    color: colors.white,
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    marginBottom: spacing.margin.md,
  },
  routePointAligned: {
    flex: 1,
    alignItems: 'center',
    minWidth: 140,
    maxWidth: 180,
  },
  routeTextAligned: {
    alignItems: 'center',
    width: '100%',
  },
  routeArrowAligned: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.padding.lg,
    marginTop: 18,
  },
  routeIcon: {
    marginBottom: spacing.margin.sm,
  },
  routeLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.margin.md,
  },
  dateIcon: {
    marginRight: spacing.margin.sm,
  },
  dateText: {
    flex: 1,
  },
  dateLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.margin.md,
  },
  detailIcon: {
    marginRight: spacing.margin.sm,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  lastUpdatedText: {
    marginTop: spacing.margin.xs,
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
  },
  inlineDropdown: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.md,
    marginTop: spacing.margin.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 10,
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.padding.sm,
    paddingHorizontal: spacing.padding.md,
  },
  selectedDropdownOption: {
    backgroundColor: colors.lightGray,
  },
  dropdownOptionText: {
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
  },
  selectedDropdownOptionText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  addressDetails: {
    marginTop: spacing.margin.sm,
    alignItems: 'center',
  },
  addressName: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
    textAlign: 'center',
  },
  addressStreet: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    marginBottom: 2,
    textAlign: 'center',
  },
  addressCityStateZip: {
    fontSize: typography.fontSize.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoadDetailsScreen;
