import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Habit } from '../types';
import { colors, shadows, borderRadius, spacing } from '../theme/colors';

interface HabitCardProps {
  habit: Habit;
  onPress: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onPress }) => {
  const isCompleted = habit.completedToday;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCompleted) {
      // Smooth scale and fade animation on completion
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.05,
            useNativeDriver: true,
            friction: 3,
            tension: 40,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 40,
          }),
        ]),
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animation when uncompleted
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 5,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isCompleted, scaleAnim, fadeAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: fadeAnim,
      }}
    >
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={isCompleted ? ['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.05)'] : ['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, isCompleted && styles.cardCompleted]}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <LinearGradient
                colors={[habit.iconColor || colors.primary[600], habit.iconColor || colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconContainer}
              >
                <MaterialCommunityIcons
                  name={(habit.icon || 'check-circle') as any}
                  size={32}
                  color={colors.white}
                />
              </LinearGradient>
              <View style={styles.info}>
                <Text style={styles.name}>{habit.name}</Text>
                <View style={styles.meta}>
                  <View style={styles.durationBadge}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color={colors.primary[600]}
                    />
                    <Text style={styles.duration}>{habit.duration}m</Text>
                  </View>
                  <View style={styles.streakContainer}>
                    <MaterialCommunityIcons
                      name="fire"
                      size={18}
                      color={colors.accent[600]}
                    />
                    <Text style={styles.streak}>
                      {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {isCompleted && (
              <View style={styles.completedContainer}>
                <LinearGradient
                  colors={[colors.primary[400], colors.primary[500]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.completedBadge}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color={colors.white}
                  />
                  <Text style={styles.completedText}>Done</Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardCompleted: {
    borderColor: colors.primary[200],
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
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.md,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
    letterSpacing: -0.3,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  duration: {
    fontSize: 13,
    color: colors.primary[700],
    fontWeight: '600',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent[50],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  streak: {
    fontSize: 13,
    color: colors.accent[700],
    fontWeight: '600',
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  completedText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
});

