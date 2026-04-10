import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../constants/theme';
import { styles } from './AddExpense.styles';

interface DropdownPickerProps {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (value: string) => void;
  error?: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  label,
  value,
  options,
  onSelect,
  error,
  icon,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdown, error ? styles.inputError : null]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon}
          size={18}
          color={value ? Colors.textPrimary : Colors.textTertiary}
          style={styles.fieldIcon}
        />
        <Text
          style={[
            styles.dropdownText,
            !value && styles.placeholder,
          ]}
        >
          {value || `Select ${label.toLowerCase()}`}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={Colors.textTertiary}
        />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options as unknown as string[]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => {
                      onSelect(item);
                      setVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DropdownPicker;
