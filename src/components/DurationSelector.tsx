import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, borderRadius, spacing } from '../theme/colors';

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
          style={styles.buttonWrapper}
          onPress={() => onSelect(duration)}
          activeOpacity={0.8}
        >
          {selectedDuration === duration ? (
            <LinearGradient
              colors={[colors.primary[400], colors.primary[600]] as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonTextActive}>{duration}m</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.button, styles.buttonInactive]}>
              <Text style={styles.buttonText}>{duration}m</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  buttonWrapper: {
    flex: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  buttonInactive: {
    backgroundColor: colors.gray[100],
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.gray[600],
  },
  buttonTextActive: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
});

