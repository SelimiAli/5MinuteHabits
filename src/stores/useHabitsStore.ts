import { create } from 'zustand';
import { Habit } from '../types';
import {
  loadHabitsFromStorage,
  saveHabitsToStorage,
  loadOnboardingStatus,
  saveOnboardingStatus,
  loadUserFromStorage,
} from '../utils/storage';
import { getTodayISO, isToday } from '../lib/date';
import { checkStreak, computeStreakAfterUndo } from '../lib/streak';
import { scheduleHabitReminder, cancelHabitReminder } from '../lib/notifications';

interface HabitsStore {
  habits: Habit[];
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  
  // Actions
  loadHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'longestStreak' | 'completedToday' | 'lastCompleted'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  completeHabit: (id: string) => Promise<void>;
  undoHabitCompletion: (id: string) => Promise<void>;
  resetDailyCompletion: () => Promise<void>;
  setHasCompletedOnboarding: (value: boolean) => void;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  hasCompletedOnboarding: false,
  isLoading: false,

  loadHabits: async () => {
    set({ isLoading: true });
    try {
      const habits = await loadHabitsFromStorage();
      const hasCompletedOnboarding = await loadOnboardingStatus();
      set({ habits, hasCompletedOnboarding, isLoading: false });
      // Reset daily completion on load
      await get().resetDailyCompletion();
    } catch (error) {
      console.error('Error loading habits:', error);
      set({ isLoading: false });
    }
  },

  addHabit: async (habitData) => {
    // Get current user ID
    const user = await loadUserFromStorage();
    
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      streak: 0,
      longestStreak: 0,
      completedToday: false,
      lastCompleted: null,
      notificationId: undefined,
      userId: user?.id, // Associate habit with current user
    };

    // Schedule notification if reminder is enabled
    if (newHabit.reminderEnabled && newHabit.reminderTime) {
      const notificationId = await scheduleHabitReminder(newHabit);
      if (notificationId) {
        newHabit.notificationId = notificationId;
      }
    }

    const updatedHabits = [...get().habits, newHabit];
    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  updateHabit: async (id, updates) => {
    const habits = get().habits;
    const habitIndex = habits.findIndex((h) => h.id === id);
    
    if (habitIndex === -1) return;

    const updatedHabit = { ...habits[habitIndex], ...updates };

    // Handle notification changes
    const oldHabit = habits[habitIndex];
    const reminderChanged = 
      oldHabit.reminderEnabled !== updatedHabit.reminderEnabled ||
      oldHabit.reminderTime !== updatedHabit.reminderTime;

    if (reminderChanged) {
      // Cancel old notification
      if (oldHabit.notificationId) {
        await cancelHabitReminder(oldHabit.notificationId);
      }

      // Schedule new notification if enabled
      if (updatedHabit.reminderEnabled && updatedHabit.reminderTime) {
        const notificationId = await scheduleHabitReminder(updatedHabit);
        if (notificationId) {
          updatedHabit.notificationId = notificationId;
        } else {
          updatedHabit.notificationId = undefined;
        }
      } else {
        updatedHabit.notificationId = undefined;
      }
    }

    const updatedHabits = [...habits];
    updatedHabits[habitIndex] = updatedHabit;
    
    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  deleteHabit: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    
    // Cancel notification if exists
    if (habit?.notificationId) {
      await cancelHabitReminder(habit.notificationId);
    }

    const updatedHabits = get().habits.filter((h) => h.id !== id);
    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  completeHabit: async (id) => {
    const habits = get().habits;
    const habitIndex = habits.findIndex((h) => h.id === id);
    
    if (habitIndex === -1) return;

    const habit = habits[habitIndex];
    
    // Don't allow completion if already completed today
    if (habit.completedToday || isToday(habit.lastCompleted)) {
      return;
    }

    const todayISO = getTodayISO();
    const { streak, longestStreak } = checkStreak(habit);

    const updatedHabit: Habit = {
      ...habit,
      completedToday: true,
      lastCompleted: todayISO,
      streak,
      longestStreak,
    };

    const updatedHabits = [...habits];
    updatedHabits[habitIndex] = updatedHabit;
    
    // Optimistic update - set state immediately
    set({ habits: updatedHabits });
    
    // Save to storage in background (non-blocking)
    saveHabitsToStorage(updatedHabits).catch((error) => {
      console.error('Error saving habit completion:', error);
    });
  },

  undoHabitCompletion: async (id) => {
    const habits = get().habits;
    const habitIndex = habits.findIndex((h) => h.id === id);
    
    if (habitIndex === -1) return;

    const habit = habits[habitIndex];
    
    // Only allow undo if completed today
    if (!habit.completedToday || !isToday(habit.lastCompleted)) {
      return;
    }

    const { streak, lastCompleted } = computeStreakAfterUndo(habit);

    const updatedHabit: Habit = {
      ...habit,
      completedToday: false,
      lastCompleted,
      streak,
    };

    const updatedHabits = [...habits];
    updatedHabits[habitIndex] = updatedHabit;
    
    // Optimistic update - set state immediately
    set({ habits: updatedHabits });
    
    // Save to storage in background (non-blocking)
    saveHabitsToStorage(updatedHabits).catch((error) => {
      console.error('Error saving undo:', error);
    });
  },

  resetDailyCompletion: async () => {
    const todayISO = getTodayISO();
    const habits = get().habits;
    
    const updatedHabits = habits.map((habit) => {
      // Reset completedToday if lastCompleted is not today
      if (!isToday(habit.lastCompleted)) {
        return {
          ...habit,
          completedToday: false,
        };
      }
      return habit;
    });

    set({ habits: updatedHabits });
    await saveHabitsToStorage(updatedHabits);
  },

  setHasCompletedOnboarding: async (value: boolean) => {
    set({ hasCompletedOnboarding: value });
    await saveOnboardingStatus(value);
  },
}));

