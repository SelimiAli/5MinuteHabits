import * as Notifications from 'expo-notifications';
import { Habit } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Schedule a daily reminder for a habit
 */
export async function scheduleHabitReminder(habit: Habit): Promise<string | null> {
  if (!habit.reminderEnabled || !habit.reminderTime) {
    return null;
  }

  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
      return null;
    }

    // Parse reminder time (HH:mm format)
    const [hours, minutes] = habit.reminderTime.split(':').map(Number);

    // Cancel existing notification if any
    if (habit.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(habit.notificationId);
    }

    // Schedule daily repeating notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '5-Minute Habit',
        body: `Time to complete: ${habit.name} ${habit.emoji}`,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
}

/**
 * Cancel a habit reminder notification
 */
export async function cancelHabitReminder(notificationId: string | undefined): Promise<void> {
  if (!notificationId) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
}

