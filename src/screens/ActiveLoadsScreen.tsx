import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadCard from '../components/loads/LoadCard';
import { colors, spacing, typography } from '../theme';
import { getActiveLoads } from '../services/api';

interface Load {
  _id: string;
  price: number;
  status: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
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
      // Filter out delivered loads
      const activeLoads = allLoads.filter((l: Load) => l.status !== 'Delivered');
      setLoads(activeLoads);
    } catch (err: any) {
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
        renderItem={({ item }) => (
          <LoadCard
            price={item.price}
            status={item.status}
            origin={item.origin}
            destination={item.destination}
            pickupDate={item.pickupDate}
            deliveryDate={item.deliveryDate}
            onPress={() => {}}
          />
        )}
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