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
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { HabitCard } from '../components/HabitCard';
import { AddButton } from '../components/AddButton';
import { useHabitsStore } from '../stores/useHabitsStore';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { CompleteAction } from '../components/swipeActions/CompleteAction';
import { UndoAction } from '../components/swipeActions/UndoAction';
import { colors, shadows, borderRadius, spacing, gradients } from '../theme/colors';
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
    swipeableRefs.current[id]?.close();
  };

  const handleUndo = (id: string) => {
    undoHabitCompletion(id);
    swipeableRefs.current[id]?.close();
  };

  const handleEdit = (habitId: string) => {
    navigation.navigate('EditHabit', { habitId });
  };

  const handleAddHabit = () => {
    navigation.navigate('AddHabit');
  };

  return (
    <LinearGradient
      colors={gradients.background as any}
      style={{ flex: 1 }}
    >
      <ScreenContainer style={styles.container}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)'] as any}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Your Habits</Text>
              <Text style={styles.subtitle}>
                {habits.filter(h => h.completedToday).length} of {habits.length} completed today
              </Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <LinearGradient
                colors={[colors.primary[500], colors.primary[600]] as any}
                style={styles.settingsGradient}
              >
                <MaterialCommunityIcons name="cog" size={22} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary[600]}
              colors={[colors.primary[600]]}
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
                  color={colors.primary[400]}
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    ...shadows.md,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.gray[900],
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray[600],
    fontWeight: '500',
  },
  settingsButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  settingsGradient: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
    backgroundColor: colors.primary[50],
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
});
