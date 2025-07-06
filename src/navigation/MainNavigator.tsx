import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabParamList } from './types';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens for now
const OpenBoardScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>OpenBoard Screen</Text>
    <Text style={styles.subtext}>Browse available loads</Text>
  </View>
);

const MyLoadsScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>My Loads Screen</Text>
    <Text style={styles.subtext}>All your loads</Text>
  </View>
);

const ActiveScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Active Screen</Text>
    <Text style={styles.subtext}>Currently active loads</Text>
  </View>
);

const DeliveredScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Delivered Screen</Text>
    <Text style={styles.subtext}>Completed loads</Text>
  </View>
);

const AccountScreen = () => (
  <View style={styles.screen}>
    <Text style={styles.text}>Account Screen</Text>
    <Text style={styles.subtext}>Profile and settings</Text>
  </View>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="OpenBoard"
        component={OpenBoardScreen}
        options={{
          tabBarLabel: 'OpenBoard',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>📦</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MyLoads"
        component={MyLoadsScreen}
        options={{
          tabBarLabel: 'My Loads',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>🚛</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Active"
        component={ActiveScreen}
        options={{
          tabBarLabel: 'Active',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>⚡</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Delivered"
        component={DeliveredScreen}
        options={{
          tabBarLabel: 'Delivered',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>✅</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
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
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  },
  tabLabel: {
    fontSize: typography.fontSize.small,
    fontWeight: typography.fontWeight.medium,
  },
  tabIcon: {
    marginBottom: 2,
  },
});

export default MainNavigator; 