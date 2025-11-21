import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../types';

const HABITS_STORAGE_KEY = 'habits';
const ONBOARDING_STORAGE_KEY = 'hasCompletedOnboarding';

export async function loadHabitsFromStorage(): Promise<Habit[]> {
  try {
    const data = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading habits from storage:', error);
    return [];
  }
}

export async function saveHabitsToStorage(habits: Habit[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits to storage:', error);
  }
}

export async function loadOnboardingStatus(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    return data === 'true';
  } catch (error) {
    console.error('Error loading onboarding status:', error);
    return false;
  }
}

export async function saveOnboardingStatus(completed: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, String(completed));
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
}

const DAILY_REMINDER_TIME_KEY = 'dailyReminderTime';

export async function loadDailyReminderTime(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(DAILY_REMINDER_TIME_KEY);
  } catch (error) {
    console.error('Error loading daily reminder time:', error);
    return null;
  }
}

export async function saveDailyReminderTime(time: string): Promise<void> {
  try {
    await AsyncStorage.setItem(DAILY_REMINDER_TIME_KEY, time);
  } catch (error) {
    console.error('Error saving daily reminder time:', error);
  }
}

