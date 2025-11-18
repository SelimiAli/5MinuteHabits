import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface EmojiPickerProps {
  selectedEmoji: string;
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  'Health & Fitness': ['💪', '🧘', '🏃', '🚶', '🏋️', '🧗', '🚴', '🏊', '🧘‍♀️', '🧘‍♂️'],
  'Mind & Learning': ['📚', '🧠', '✍️', '🎯', '💡', '📖', '🎓', '✏️', '🔍', '💭'],
  'Wellness': ['💧', '🌱', '☀️', '🌙', '🕯️', '🧘', '🌸', '🍃', '🌿', '✨'],
  'Productivity': ['✅', '📝', '🗂️', '📊', '⏰', '🎯', '📌', '🔔', '💼', '📋'],
  'Creative': ['🎨', '🎵', '🎬', '📸', '✏️', '🖌️', '🎭', '🎪', '🎤', '🎹'],
  'Social': ['👋', '💬', '📞', '🤝', '❤️', '🙏', '🎉', '🎁', '💝', '🌍'],
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  selectedEmoji,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.triggerText}>
          {selectedEmoji || '😊'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose an Emoji</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.emojiGrid}>
              {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.emojiRow}>
                    {emojis.map((emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[
                          styles.emojiButton,
                          selectedEmoji === emoji && styles.emojiButtonSelected,
                        ]}
                        onPress={() => handleSelect(emoji)}
                      >
                        <Text style={styles.emojiText}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  triggerText: {
    fontSize: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
  emojiGrid: {
    padding: 20,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiButtonSelected: {
    backgroundColor: '#A7F3D0',
  },
  emojiText: {
    fontSize: 28,
  },
});

