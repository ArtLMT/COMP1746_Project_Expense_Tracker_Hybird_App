import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';
import { Colors } from '../constants/theme';
import { styles } from './AddExpense.styles';

interface FormInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  containerStyle?: ViewStyle;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  icon,
  error,
  containerStyle,
  ...rest
}) => {
  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          error ? styles.inputError : null,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={Colors.textTertiary}
          style={styles.fieldIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholderTextColor={Colors.textTertiary}
          {...rest}
        />
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

export default FormInput;
