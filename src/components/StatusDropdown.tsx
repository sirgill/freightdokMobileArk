import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

// Status options matching the web app
export const LOAD_STATUSES = [
  { id: 'loadCheckIn', label: 'Load Check-In' },
  { id: 'pickupCompete', label: 'Pickup Complete' },
  { id: 'arrivedAtDelivery', label: 'Arrived at Delivery' },
  { id: 'arrivedAtPickup', label: 'Arrived at Pickup' },
  { id: 'enRoute', label: 'En Route to Delivery' },
  { id: 'archived', label: 'Archived' },
  { id: 'delivered', label: 'Delivered' },
];

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
  disabled?: boolean;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  onStatusChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find current status object
  const currentStatusObj = LOAD_STATUSES.find(status => status.id === currentStatus) || LOAD_STATUSES[0];

  // Status colors for badges
  const getStatusColor = (statusId: string) => {
    switch (statusId) {
      case 'delivered':
        return colors.success;
      case 'archived':
        return colors.textSecondary;
      case 'loadCheckIn':
      case 'pickupCompete':
      case 'arrivedAtDelivery':
      case 'arrivedAtPickup':
      case 'enRoute':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  const handleStatusSelect = (status: typeof LOAD_STATUSES[0]) => {
    onStatusChange(status.id);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownButton, disabled && styles.disabled]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <View style={styles.dropdownContent}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStatusObj.id) }]}>
            <Text style={styles.statusText}>{currentStatusObj.label}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Select Status</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <MaterialIcons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsContainer}>
              {LOAD_STATUSES.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.option,
                    currentStatus === status.id && styles.selectedOption
                  ]}
                  onPress={() => handleStatusSelect(status)}
                >
                  <View style={[styles.optionBadge, { backgroundColor: getStatusColor(status.id) }]}>
                    <Text style={styles.optionStatusText}>{status.label}</Text>
                  </View>
                  {currentStatus === status.id && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.padding.md,
  },
  disabled: {
    opacity: 0.5,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
    marginRight: spacing.margin.sm,
  },
  statusText: {
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.small,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: spacing.borderRadius.lg,
    width: '80%',
    maxHeight: '70%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.padding.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dropdownTitle: {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  optionsContainer: {
    padding: spacing.padding.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.padding.md,
    borderRadius: spacing.borderRadius.sm,
    marginBottom: spacing.margin.sm,
  },
  selectedOption: {
    backgroundColor: colors.lightGray,
  },
  optionBadge: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flex: 1,
  },
  optionStatusText: {
    color: colors.white,
    fontWeight: typography.fontWeight.medium,
    fontSize: typography.fontSize.small,
    textAlign: 'center',
  },
});

export default StatusDropdown; 