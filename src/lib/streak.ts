import { Habit } from '../types';
import { getTodayISO, isToday, isYesterday } from './date';

/**
 * Compute new streak based on last completion date
 */
export function computeNewStreak(habit: Habit, todayISO: string): number {
  if (!habit.lastCompleted) {
    return 1;
  }

  if (isToday(habit.lastCompleted)) {
    // Already completed today, don't increment
    return habit.streak;
  }

  if (isYesterday(habit.lastCompleted)) {
    // Completed yesterday, increment streak
    return habit.streak + 1;
  }

  // Gap in completion, reset to 1
  return 1;
}

/**
 * Check and update streak for a habit
 */
export function checkStreak(habit: Habit): { streak: number; longestStreak: number } {
  const todayISO = getTodayISO();
  const newStreak = computeNewStreak(habit, todayISO);
  const newLongestStreak = Math.max(habit.longestStreak, newStreak);

  return {
    streak: newStreak,
    longestStreak: newLongestStreak,
  };
}

