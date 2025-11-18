import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CompleteAction: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Complete</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    backgroundColor: '#86EFAC',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    borderRadius: 16,
    marginRight: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

