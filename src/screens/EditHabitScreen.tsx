import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useHabitsStore } from '../stores/useHabitsStore';
import { EmojiPicker } from '../components/EmojiPicker';
import { DurationSelector } from '../components/DurationSelector';
import DateTimePicker from '@react-native-community/datetimepicker';

interface EditHabitScreenProps {
  navigation: any;
  route: any;
}

export const EditHabitScreen: React.FC<EditHabitScreenProps> = ({
  navigation,
  route,
}) => {
  const { habitId } = route.params;
  const { habits, updateHabit, deleteHabit } = useHabitsStore();

  const habit = habits.find((h) => h.id === habitId);

  const [name, setName] = useState(habit?.name || '');
  const [emoji, setEmoji] = useState(habit?.emoji || '😊');
  const [duration, setDuration] = useState<1 | 2 | 3 | 4 | 5>(
    habit?.duration || 5
  );
  const [reminderEnabled, setReminderEnabled] = useState(
    habit?.reminderEnabled || false
  );
  const [reminderTime, setReminderTime] = useState(() => {
    if (habit?.reminderTime) {
      const [hours, minutes] = habit.reminderTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      return date;
    }
    return new Date();
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (!habit) {
      navigation.goBack();
    }
  }, [habit, navigation]);

  if (!habit) {
    return null;
  }

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      alert('Please enter a habit name');
      return;
    }

    if (name.length > 40) {
      alert('Habit name must be 40 characters or less');
      return;
    }

    const timeString = reminderEnabled
      ? `${String(reminderTime.getHours()).padStart(2, '0')}:${String(
          reminderTime.getMinutes()
        ).padStart(2, '0')}`
      : undefined;

    await updateHabit(habitId, {
      name: name.trim(),
      emoji,
      duration,
      reminderEnabled,
      reminderTime: timeString,
    });

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Navigate back first to avoid rendering issues
            navigation.goBack();
            // Delete habit after navigation
            setTimeout(() => {
              deleteHabit(habitId);
            }, 100);
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        alwaysBounceVertical={true}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Habit</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

      <View style={styles.form}>
        <Text style={styles.label}>Habit Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Drink water, Read, Meditate"
          value={name}
          onChangeText={setName}
          maxLength={40}
        />
        <Text style={styles.charCount}>{name.length}/40</Text>

        <Text style={styles.label}>Emoji</Text>
        <View style={styles.emojiContainer}>
          <EmojiPicker selectedEmoji={emoji} onSelect={setEmoji} />
        </View>

        <Text style={styles.label}>Duration</Text>
        <DurationSelector
          selectedDuration={duration}
          onSelect={setDuration}
        />

        <View style={styles.reminderSection}>
          <View style={styles.reminderRow}>
            <Text style={styles.label}>Daily Reminder</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: '#D1D5DB', true: '#A7F3D0' }}
              thumbColor={reminderEnabled ? '#065F46' : '#F3F4F6'}
            />
          </View>

          {reminderEnabled && (
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timePickerText}>
                {formatTime(reminderTime)}
              </Text>
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              is24Hour={false}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  setReminderTime(selectedTime);
                }
              }}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>Delete Habit</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  emojiContainer: {
    alignItems: 'center',
  },
  reminderSection: {
    marginTop: 8,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timePickerButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  timePickerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  deleteButton: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});

