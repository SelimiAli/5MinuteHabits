import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DurationSelectorProps {
  selectedDuration: 1 | 2 | 3 | 4 | 5;
  onSelect: (duration: 1 | 2 | 3 | 4 | 5) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  onSelect,
}) => {
  const durations: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {durations.map((duration) => (
        <TouchableOpacity
          key={duration}
          style={[
            styles.button,
            selectedDuration === duration && styles.buttonActive,
          ]}
          onPress={() => onSelect(duration)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedDuration === duration && styles.buttonTextActive,
            ]}
          >
            {duration}m
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#A7F3D0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  buttonTextActive: {
    color: '#065F46',
  },
});

