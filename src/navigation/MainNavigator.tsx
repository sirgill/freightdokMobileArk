import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { colors, typography } from '../theme';
import ActiveLoadsScreen from '../screens/ActiveLoadsScreen';
import LoadDetailsScreen from '../screens/LoadDetailsScreen';
import DeliveredLoadsScreen from '../screens/DeliveredLoadsScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens for now
const OpenBoardScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>OpenBoard Screen</Text>
    <Text style={styles.subtext}>Browse available loads</Text>
  </View>
);

const ActiveScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Active Loads Screen</Text>
    <Text style={styles.subtext}>Currently active loads</Text>
  </View>
);

const DeliveredScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Delivered Screen</Text>
    <Text style={styles.subtext}>Completed loads</Text>
  </View>
);

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }} edges={['bottom', 'left', 'right']}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: [
            styles.tabBar,
            { paddingBottom: Math.max(insets.bottom, 8), height: 60 + insets.bottom },
          ],
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="OpenBoard"
          component={OpenBoardScreen}
          options={{
            tabBarLabel: 'OpenBoard',
          }}
        />
        <Tab.Screen
          name="Active"
          component={ActiveLoadsScreen}
          options={{
            tabBarLabel: 'Active',
          }}
        />
        <Tab.Screen
          name="Delivered"
          component={DeliveredLoadsScreen}
          options={{
            tabBarLabel: 'Delivered',
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarLabel: 'Account',
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: typography.fontSize.title,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtext: {
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
  },
  tabBar: {
    backgroundColor: colors.white,
    borderTopColor: colors.borderLight,
    borderTopWidth: 1,
    paddingTop: 8,
    height: 60,
  },
  tabLabel: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'capitalize',
    letterSpacing: 0.5,
  },
});

export default MainNavigator;
