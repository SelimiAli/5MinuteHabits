import { Habit } from '../types';
import { getTodayISO, getYesterdayISO, isToday, isYesterday } from './date';

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

/**
 * Compute streak and lastCompleted after undoing today's completion
 */
export function computeStreakAfterUndo(habit: Habit): { streak: number; lastCompleted: string | null } {
  // Only undo if completed today
  if (!habit.completedToday || !isToday(habit.lastCompleted)) {
    return {
      streak: habit.streak,
      lastCompleted: habit.lastCompleted,
    };
  }

  // If streak > 1, yesterday was completed, so restore to yesterday
  if (habit.streak > 1) {
    const yesterdayISO = getYesterdayISO();
    return {
      streak: habit.streak - 1,
      lastCompleted: yesterdayISO,
    };
  }

  // If streak === 1, today was the first completion, so reset
  return {
    streak: 0,
    lastCompleted: null,
  };
}

