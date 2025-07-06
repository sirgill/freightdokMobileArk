import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MainNavigator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main App Screen (Placeholder)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MainNavigator; 