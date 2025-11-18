# 5-Minute Habits

A minimalist React Native mobile app for tracking tiny habits that take just 1-5 minutes each day. Build lasting habits, one small step at a time.

## Features

- ✅ Create habits with custom names, emojis, and durations (1-5 minutes)
- 🔥 Track daily streaks and longest streaks
- 🔔 Set daily reminders with local notifications
- 📱 Simple, clean UI focused on ease of use
- 💾 Persistent storage with AsyncStorage
- 🎯 Complete habits once per day with automatic daily reset

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **Zustand** for state management
- **React Navigation** for navigation
- **Expo Notifications** for local reminders
- **AsyncStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your device

## Project Structure

```
src/
  components/          # Reusable UI components
    HabitCard.tsx
    AddButton.tsx
    EmojiPicker.tsx
    DurationSelector.tsx
  screens/            # Screen components
    HomeScreen.tsx
    AddHabitScreen.tsx
    EditHabitScreen.tsx
    OnboardingScreen.tsx
    SettingsScreen.tsx
  stores/             # Zustand state management
    useHabitsStore.ts
  lib/                # Utility libraries
    date.ts
    streak.ts
    notifications.ts
  utils/              # Helper functions
    storage.ts
  types/              # TypeScript type definitions
    index.ts
  navigation/         # Navigation setup
    AppNavigator.tsx
```

## Key Features Implementation

### Habit Completion
- Each habit can be completed once per day
- Streaks are automatically calculated based on consecutive days
- Daily reset occurs on app launch and when app comes to foreground

### Notifications
- Daily reminders can be set for each habit
- Notifications are scheduled using Expo Notifications
- Notifications are automatically canceled when habits are deleted or reminders are disabled

### Data Persistence
- All habits are stored in AsyncStorage
- Onboarding status is persisted
- Data is automatically loaded on app launch

## Development

The app follows a clean architecture pattern with:
- Separation of concerns (components, screens, stores, utilities)
- Type-safe TypeScript throughout
- Simple, maintainable code structure
- No code duplication

## License

MIT

