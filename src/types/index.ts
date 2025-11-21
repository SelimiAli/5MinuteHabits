export type Habit = {
  id: string;
  name: string;
  emoji: string; // Kept for backward compatibility, will be deprecated
  icon?: string; // MaterialCommunityIcons icon name
  iconColor?: string; // Hex color for the icon
  duration: 1 | 2 | 3 | 4 | 5;
  reminderEnabled: boolean;
  reminderTime?: string; // "HH:mm"
  notificationId?: string; // optional, from Expo Notifications
  streak: number;
  longestStreak: number;
  completedToday: boolean;
  lastCompleted: string | null; // ISO string (YYYY-MM-DD)
};

