import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LoadCard from '../components/loads/LoadCard';
import { colors, spacing, typography } from '../theme';
import { getActiveLoads } from '../services/api';
import { parseISO, isValid, format } from 'date-fns';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

interface Load {
  _id: string;
  price?: number;
  rate?: number;
  status?: string;
  origin?: string | { city?: string; stateCode?: string };
  destination?: string | { city?: string; stateCode?: string };
  pickupDate?: string;
  deliveryDate?: string;
  pickupLocation?: string | { city?: string; stateCode?: string };
  deliveryLocation?: string | { city?: string; stateCode?: string };
  pickupDateTime?: string;
  deliveryDateTime?: string;
  pickup?: Array<{ pickupCity?: string; pickupState?: string; pickupDate?: string; pickupReference?: string }>;
  drop?: Array<{ dropCity?: string; dropState?: string; dropDate?: string; dropReference?: string }>;
  pickUpByDate?: string;
  deliverBy?: string;
  equipment?: { modes?: string[]; length?: { standard?: string } };
  loadNumber?: string;
  referenceNumber?: string;
  brokerage?: string;
  company?: string;
}

const ActiveLoadsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchLoads = async (page = 1, append = false) => {
    if (append) setIsFetchingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const allLoads = await getActiveLoads(page);
      console.log('Fetched loads from API:', allLoads.loads.length, 'loads. IDs:', allLoads.loads.map((l: Load) => l._id));
      // Filter out delivered loads
      let activeLoads = allLoads.loads.filter((l: Load) => l.status !== 'Delivered');
      console.log('Loads after filtering out Delivered:', activeLoads.length, 'loads. IDs:', activeLoads.map((l: Load) => l._id));
      // Sort by most recent pickup date first (descending)
      activeLoads = activeLoads.sort((a: Load, b: Load) => {
        const getPickup = (l: Load) => l.pickUpByDate || l.pickupDate || (l.pickup && Array.isArray(l.pickup) && l.pickup[0]?.pickupDate) || l.pickupDateTime || '';
        const dateA = parseISO(getPickup(a));
        const dateB = parseISO(getPickup(b));
        if (!isValid(dateA) && !isValid(dateB)) return 0;
        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;
        return dateB.getTime() - dateA.getTime(); // Descending order
      });
      if (append) setLoads(prev => [...prev, ...activeLoads]);
      else setLoads(activeLoads);
      setCurrentPage(allLoads.currentPage || page);
      setTotalPages(allLoads.totalPages || 1);
    } catch (err: any) {
      setError('Failed to load active loads.');
    } finally {
      if (append) setIsFetchingMore(false);
      else setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads(1);
  }, []);

  // Refresh loads when screen comes into focus (e.g., returning from LoadDetailsScreen)
  useFocusEffect(
    React.useCallback(() => {
      fetchLoads(1);
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLoads(1);
    setRefreshing(false);
  };

  const handleEndReached = () => {
    if (!isFetchingMore && currentPage < totalPages) {
      fetchLoads(currentPage + 1, true);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.retry} onPress={() => fetchLoads(1)}>Tap to retry</Text>
      </SafeAreaView>
    );
  }

  if (loads.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>No active loads found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={loads}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          // Helper to extract city/state from string or object
          const getCityState = (loc: any, cityKey = 'city', stateKey = 'stateCode') => {
            if (!loc) {return { city: 'Unknown', state: '' };}
            if (typeof loc === 'string') {return { city: loc, state: '' };}
            return {
              city: loc[cityKey] || 'Unknown',
              state: loc[stateKey] || '',
            };
          };

          // Origin
          let origin = getCityState(item.origin);
          if (origin.city === 'Unknown') {origin = getCityState(item.pickupLocation);}
          if (origin.city === 'Unknown' && item.pickup && Array.isArray(item.pickup) && item.pickup[0]) {
            origin = getCityState(item.pickup[0], 'pickupCity', 'pickupState');
          }

          // Destination
          let destination = getCityState(item.destination);
          if (destination.city === 'Unknown') {destination = getCityState(item.deliveryLocation);}
          if (destination.city === 'Unknown' && item.drop && Array.isArray(item.drop) && item.drop[0]) {
            destination = getCityState(item.drop[0], 'dropCity', 'dropState');
          }

          // Dates (format to MM/DD/YYYY, remove time)
          const formatDate = (dateStr: string) => {
            if (!dateStr) {return 'TBD';}
            const d = parseISO(dateStr);
            if (!isValid(d)) {return 'TBD';}
            return format(d, 'MM/dd/yyyy');
          };
          const pickupDate = formatDate(item.pickUpByDate || item.pickupDate || (item.pickup && Array.isArray(item.pickup) && item.pickup[0]?.pickupDate) || item.pickupDateTime || '');
          const deliveryDate = formatDate(item.deliverBy || item.deliveryDate || (item.drop && Array.isArray(item.drop) && item.drop[0]?.dropDate) || item.deliveryDateTime || '');

          // Equipment
          const equipmentType = (item.equipment && item.equipment.modes ? item.equipment.modes.join(', ') : '') + (item.equipment && item.equipment.length && item.equipment.length.standard ? `, ${item.equipment.length.standard}ft` : '');

          // Reference/Load Number
          const referenceNumber = item.loadNumber || item.referenceNumber || (item.pickup && Array.isArray(item.pickup) && item.pickup[0]?.pickupReference) || (item.drop && Array.isArray(item.drop) && item.drop[0]?.dropReference) || '';

          // Price/Rate
          const price = item.rate || item.price || 0;
          const status = item.status || 'Active';
          const carrierName = item.brokerage || item.company || '';

          return (
            <LoadCard
              price={price}
              status={status}
              origin={origin.city + (origin.state ? ', ' + origin.state : '')}
              destination={destination.city + (destination.state ? ', ' + destination.state : '')}
              pickupDate={pickupDate}
              deliveryDate={deliveryDate}
              equipmentType={equipmentType}
              referenceNumber={referenceNumber}
              carrierName={carrierName}
              load={item}
              onPress={() => navigation.navigate('LoadDetails', { load: item })}
            />
          );
        }}
        contentContainerStyle={{ paddingVertical: spacing.padding.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color={colors.primary} style={{ margin: 16 }} /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
    marginTop: 40,
  },
  retry: {
    color: colors.primary,
    fontSize: typography.fontSize.small,
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  empty: {
    color: colors.textSecondary,
    fontSize: typography.fontSize.body,
    textAlign: 'center',
    marginTop: 40,
  },
});

export default ActiveLoadsScreen;
