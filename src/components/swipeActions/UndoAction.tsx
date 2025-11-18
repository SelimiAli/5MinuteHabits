import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const UndoAction: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Undo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    backgroundColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    borderRadius: 16,
    marginLeft: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

