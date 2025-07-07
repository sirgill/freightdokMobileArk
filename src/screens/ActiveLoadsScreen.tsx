import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadCard from '../components/loads/LoadCard';
import { colors, spacing, typography } from '../theme';
import { getActiveLoads } from '../services/api';

interface Load {
  _id: string;
  price?: number;
  rate?: number;
  status?: string;
  origin?: string;
  destination?: string;
  pickupDate?: string;
  deliveryDate?: string;
  pickupLocation?: string;
  deliveryLocation?: string;
  pickupDateTime?: string;
  deliveryDateTime?: string;
}

const ActiveLoadsScreen: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLoads = async () => {
    setLoading(true);
    setError(null);
    try {
      const allLoads = await getActiveLoads();
      console.log('Fetched loads:', allLoads.length, 'loads');
      if (allLoads.length > 0) {
        console.log('First load structure:', allLoads[0]);
      }
      
      // Filter out delivered loads
      const activeLoads = allLoads.filter((l: Load) => l.status !== 'Delivered');
      console.log('Active loads after filtering:', activeLoads.length);
      setLoads(activeLoads);
    } catch (err: any) {
      console.error('Error fetching loads:', err);
      setError('Failed to load active loads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLoads();
    setRefreshing(false);
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
        <Text style={styles.retry} onPress={fetchLoads}>Tap to retry</Text>
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
          console.log('Rendering load:', item._id, 'with data:', {
            price: item.price || item.rate,
            status: item.status,
            origin: item.origin || item.pickupLocation,
            destination: item.destination || item.deliveryLocation,
            pickupDate: item.pickupDate || item.pickupDateTime,
            deliveryDate: item.deliveryDate || item.deliveryDateTime
          });
          
          return (
            <LoadCard
              price={item.price || item.rate || 0}
              status={item.status || 'Active'}
              origin={item.origin || item.pickupLocation || 'Unknown'}
              destination={item.destination || item.deliveryLocation || 'Unknown'}
              pickupDate={item.pickupDate || item.pickupDateTime || 'TBD'}
              deliveryDate={item.deliveryDate || item.deliveryDateTime || 'TBD'}
              onPress={() => {}}
            />
          );
        }}
        contentContainerStyle={{ paddingVertical: spacing.padding.md }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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