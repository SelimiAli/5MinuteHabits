import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useHabitsStore } from '../stores/useHabitsStore';
import { colors, shadows, borderRadius, spacing, gradients } from '../theme/colors';

interface OnboardingScreenProps {
  navigation: any;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  navigation,
}) => {
  const { setHasCompletedOnboarding } = useHabitsStore();

  const handleGetStarted = async () => {
    await setHasCompletedOnboarding(true);
    navigation.replace('MainTabs');
  };

  return (
    <LinearGradient
      colors={gradients.background as any}
      style={{ flex: 1 }}
    >
      <ScreenContainer style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.contentInner}>
            <LinearGradient
              colors={[colors.primary[400], colors.primary[600]] as any}
              style={styles.iconContainer}
            >
              <MaterialCommunityIcons
                name="timer-outline"
                size={64}
                color={colors.white}
              />
            </LinearGradient>
            <Text style={styles.title}>5-Minute Habits</Text>
            <Text style={styles.subtitle}>
              Build lasting habits, one small step at a time
            </Text>

            <View style={styles.features}>
              <View style={styles.feature}>
                <LinearGradient
                  colors={[colors.primary[100], colors.primary[50]] as any}
                  style={styles.featureIconContainer}
                >
                  <MaterialCommunityIcons
                    name="bullseye-arrow"
                    size={32}
                    color={colors.primary[600]}
                  />
                </LinearGradient>
                <Text style={styles.featureText}>
                  Track tiny habits that take just 1-5 minutes
                </Text>
              </View>
              <View style={styles.feature}>
                <LinearGradient
                  colors={[colors.accent[100], colors.accent[50]] as any}
                  style={styles.featureIconContainer}
                >
                  <MaterialCommunityIcons
                    name="fire"
                    size={32}
                    color={colors.accent[600]}
                  />
                </LinearGradient>
                <Text style={styles.featureText}>
                  Build streaks and watch your progress grow
                </Text>
              </View>
              <View style={styles.feature}>
                <LinearGradient
                  colors={[colors.secondary[100], colors.secondary[50]] as any}
                  style={styles.featureIconContainer}
                >
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={32}
                    color={colors.secondary[600]}
                  />
                </LinearGradient>
                <Text style={styles.featureText}>
                  Set reminders to never miss a day
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.buttonWrapper}
              onPress={handleGetStarted}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[colors.primary[500], colors.primary[700]] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentInner: {
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'center',
    ...shadows.xl,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: spacing.md,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 26,
    fontWeight: '500',
  },
  features: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    ...shadows.sm,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
    fontWeight: '500',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.lg,
  },
  button: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
});

