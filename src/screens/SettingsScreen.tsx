import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  useColorScheme,
} from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  loadDailyReminderTime,
  saveDailyReminderTime,
} from '../utils/storage';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [reminderTime, setReminderTime] = useState<Date>(() => {
    const defaultTime = new Date();
    defaultTime.setHours(8, 0);
    return defaultTime;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadReminderTime();
  }, []);

  const loadReminderTime = async () => {
    const savedTime = await loadDailyReminderTime();
    if (savedTime) {
      const [hours, minutes] = savedTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      setReminderTime(date);
    }
  };

  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setReminderTime(selectedTime);
      const timeString = `${String(selectedTime.getHours()).padStart(2, '0')}:${String(
        selectedTime.getMinutes()
      ).padStart(2, '0')}`;
      await saveDailyReminderTime(timeString);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = String(minutes).padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const textColor = isDark ? '#F9FAFB' : '#111827';
  const secondaryTextColor = isDark ? '#D1D5DB' : '#374151';
  const backgroundColor = isDark ? '#1F2937' : '#FFFFFF';
  const containerBackgroundColor = isDark ? '#111827' : '#F9FAFB';
  const borderColor = isDark ? '#374151' : '#E5E7EB';
  const sectionTitleColor = isDark ? '#9CA3AF' : '#6B7280';

  return (
    <ScreenContainer
      style={[styles.container, { backgroundColor: containerBackgroundColor }]}
      edges={['top']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>
            Notifications
          </Text>
          <TouchableOpacity
            style={[styles.reminderRow, { backgroundColor, borderColor }]}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.reminderLabel, { color: textColor }]}>
              Daily Reminder
            </Text>
            <Text style={[styles.reminderTime, { color: textColor }]}>
              {formatTime(reminderTime)}
            </Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>About</Text>
          <View style={[styles.infoCard, { backgroundColor, borderColor }]}>
            <Text style={[styles.infoTitle, { color: textColor }]}>
              5-Minute Habits
            </Text>
            <Text style={[styles.infoVersion, { color: secondaryTextColor }]}>
              Version 1.0.0
            </Text>
            <Text style={[styles.infoDescription, { color: secondaryTextColor }]}>
              A minimalist app for tracking tiny habits that take just 1-5 minutes
              each day. Build lasting habits, one small step at a time.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>
            How It Works
          </Text>
          <View style={[styles.infoCard, { backgroundColor, borderColor }]}>
            <Text style={[styles.infoText, { color: secondaryTextColor }]}>
              • Create habits that take 1-5 minutes{'\n'}
              • Complete each habit once per day{'\n'}
              • Build streaks to stay motivated{'\n'}
              • Set reminders to never miss a day
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingBottom: 40,
  },
  header: {
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
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  infoText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
});

