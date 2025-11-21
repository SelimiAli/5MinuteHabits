import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IconPickerProps {
  selectedIcon: string;
  selectedColor: string;
  onSelect: (icon: string, color: string) => void;
}

const ICON_CATEGORIES = {
  'Health & Fitness': [
    'dumbbell',
    'yoga',
    'run',
    'walk',
    'bike',
    'swim',
    'heart-pulse',
    'meditation',
    'stretching',
    'weight-lifter',
  ],
  'Mind & Learning': [
    'book-open-variant',
    'brain',
    'pencil',
    'bullseye-arrow',
    'lightbulb-on',
    'school',
    'notebook',
    'magnify',
    'head-lightbulb',
    'book-education',
  ],
  'Wellness': [
    'water',
    'sprout',
    'white-balance-sunny',
    'weather-night',
    'candle',
    'spa',
    'flower',
    'leaf',
    'nature',
    'sparkles',
  ],
  'Productivity': [
    'check-circle',
    'clipboard-text',
    'folder-open',
    'chart-line',
    'clock-outline',
    'target',
    'pin',
    'bell',
    'briefcase',
    'format-list-checks',
  ],
  'Creative': [
    'palette',
    'music',
    'movie',
    'camera',
    'draw',
    'brush',
    'drama-masks',
    'microphone',
    'piano',
    'guitar-acoustic',
  ],
  'Social & Life': [
    'hand-wave',
    'message-text',
    'phone',
    'handshake',
    'heart',
    'hands-pray',
    'party-popper',
    'gift',
    'home-heart',
    'earth',
  ],
};

const ICON_COLORS = [
  { name: 'Green', value: '#065F46' },
  { name: 'Blue', value: '#1E40AF' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Pink', value: '#DB2777' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Teal', value: '#0F766E' },
  { name: 'Indigo', value: '#4F46E5' },
];

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  selectedColor,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [tempIcon, setTempIcon] = useState(selectedIcon);
  const [tempColor, setTempColor] = useState(selectedColor);

  const handleConfirm = () => {
    onSelect(tempIcon, tempColor);
    setModalVisible(false);
  };

  const handleOpen = () => {
    setTempIcon(selectedIcon);
    setTempColor(selectedColor);
    setModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity style={styles.trigger} onPress={handleOpen}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: selectedColor + '20' },
          ]}
        >
          <MaterialCommunityIcons
            name={selectedIcon as any}
            size={40}
            color={selectedColor}
          />
        </View>
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
              <Text style={styles.modalTitle}>Choose Icon & Color</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
              {/* Color Picker */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Color</Text>
                <View style={styles.colorRow}>
                  {ICON_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color.value}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color.value },
                        tempColor === color.value && styles.colorButtonSelected,
                      ]}
                      onPress={() => setTempColor(color.value)}
                    >
                      {tempColor === color.value && (
                        <MaterialCommunityIcons
                          name="check"
                          size={20}
                          color="#FFFFFF"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Icon Categories */}
              {Object.entries(ICON_CATEGORIES).map(([category, icons]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.iconRow}>
                    {icons.map((icon) => (
                      <TouchableOpacity
                        key={icon}
                        style={[
                          styles.iconButton,
                          tempIcon === icon && styles.iconButtonSelected,
                        ]}
                        onPress={() => setTempIcon(icon)}
                      >
                        <MaterialCommunityIcons
                          name={icon as any}
                          size={28}
                          color={tempIcon === icon ? tempColor : '#6B7280'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    alignItems: 'center',
    marginVertical: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    maxHeight: '85%',
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
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
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
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#065F46',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
