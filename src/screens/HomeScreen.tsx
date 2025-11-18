import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useHabitsStore } from '../stores/useHabitsStore';
import { HabitCard } from '../components/HabitCard';
import { AddButton } from '../components/AddButton';
import { CompleteAction } from '../components/swipeActions/CompleteAction';
import { UndoAction } from '../components/swipeActions/UndoAction';
import { useFocusEffect } from '@react-navigation/native';
import { isToday } from '../lib/date';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { habits, loadHabits, completeHabit, undoHabitCompletion, resetDailyCompletion } =
    useHabitsStore();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  useFocusEffect(
    React.useCallback(() => {
      resetDailyCompletion();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  useEffect(() => {
    loadHabits();
  }, []);

  const handleComplete = (id: string) => {
    completeHabit(id);
    // Close swipeable after action
    swipeableRefs.current[id]?.close();
  };

  const handleUndo = (id: string) => {
    undoHabitCompletion(id);
    // Close swipeable after action
    swipeableRefs.current[id]?.close();
  };

  const handleEdit = (habitId: string) => {
    navigation.navigate('EditHabit', { habitId });
  };

  const handleAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  const handleSettings = () => {
    // Settings is in the tab navigator, just switch tabs
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyText}>No habits yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the + button to create your first habit
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {habits.map((habit) => {
            const isCompleted = habit.completedToday;
            const canUndo = isCompleted && isToday(habit.lastCompleted);

            return (
              <Swipeable
                key={habit.id}
                ref={(ref) => {
                  swipeableRefs.current[habit.id] = ref;
                }}
                renderLeftActions={
                  !isCompleted ? () => <CompleteAction /> : undefined
                }
                onSwipeableLeftOpen={() => handleComplete(habit.id)}
                renderRightActions={
                  canUndo ? () => <UndoAction /> : undefined
                }
                onSwipeableRightOpen={() => handleUndo(habit.id)}
              >
                <HabitCard habit={habit} onPress={() => handleEdit(habit.id)} />
              </Swipeable>
            );
          })}
        </ScrollView>
      )}

      <AddButton onPress={handleAddHabit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

