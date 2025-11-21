import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useHabitsStore } from '../stores/useHabitsStore';
import { HabitCard } from '../components/HabitCard';
import { AddButton } from '../components/AddButton';
import { CompleteAction } from '../components/swipeActions/CompleteAction';
import { UndoAction } from '../components/swipeActions/UndoAction';
import { useFocusEffect } from '@react-navigation/native';
import { isToday } from '../lib/date';
import { playCompletionSound, initializeSound } from '../lib/sound';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { habits, loadHabits, completeHabit, undoHabitCompletion, resetDailyCompletion } =
    useHabitsStore();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadHabits();
    resetDailyCompletion();
    setRefreshing(false);
  }, [loadHabits, resetDailyCompletion]);

  useFocusEffect(
    React.useCallback(() => {
      resetDailyCompletion();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  useEffect(() => {
    loadHabits();
    initializeSound();
  }, []);

  const handleComplete = (id: string) => {
    completeHabit(id);
    playCompletionSound();
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
    <ScreenContainer style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <MaterialCommunityIcons name="cog" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#065F46"
            colors={['#065F46']}
          />
        }
        alwaysBounceVertical={true}
      >
        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={64}
                color="#D1D5DB"
              />
            </View>
            <Text style={styles.emptyText}>No habits yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create your first habit
            </Text>
          </View>
        ) : (
          habits.map((habit) => {
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
          })
        )}
      </ScrollView>

      <AddButton onPress={handleAddHabit} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconContainer: {
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

