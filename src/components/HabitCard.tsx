import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const isCompleted = habit.completedToday;

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{habit.emoji}</Text>
          <View style={styles.info}>
            <Text style={styles.name}>{habit.name}</Text>
            <View style={styles.meta}>
              <Text style={styles.duration}>{habit.duration}m</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.streak}>
                🔥 {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>
        </View>

        {isCompleted && (
          <View style={styles.completedContainer}>
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completed</Text>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardCompleted: {
    backgroundColor: '#F0FDF4',
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 40,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duration: {
    fontSize: 14,
    color: '#6B7280',
  },
  separator: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  streak: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: '#86EFAC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
});

