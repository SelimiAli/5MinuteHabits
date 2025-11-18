import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useHabitsStore } from '../stores/useHabitsStore';

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  const { habits, setHasCompletedOnboarding } = useHabitsStore();

  const handleGetStarted = () => {
    if (habits.length === 0) {
      navigation.navigate('AddHabit', { isFirstHabit: true });
    } else {
      setHasCompletedOnboarding(true);
      navigation.replace('MainTabs');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>⏱️</Text>
        <Text style={styles.title}>5-Minute Habits</Text>
        <Text style={styles.subtitle}>
          Build lasting habits, one small step at a time
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <Text style={styles.featureText}>
              Track tiny habits that take just 1-5 minutes
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🔥</Text>
            <Text style={styles.featureText}>
              Build streaks and watch your progress grow
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🔔</Text>
            <Text style={styles.featureText}>
              Set reminders to never miss a day
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 26,
  },
  features: {
    width: '100%',
    marginBottom: 48,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#A7F3D0',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065F46',
  },
});

