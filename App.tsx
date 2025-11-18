import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppState, AppStateStatus } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useHabitsStore } from './src/stores/useHabitsStore';

export default function App() {
  const { resetDailyCompletion } = useHabitsStore();
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Reset daily completion on app launch
    resetDailyCompletion();

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground, reset daily completion
        resetDailyCompletion();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [resetDailyCompletion]);

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

