import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';
import { Expense } from '../types/types';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadow,
} from '../constants/theme';

// ───────── Option constants ─────────

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'VND'] as const;

const EXPENSE_TYPES = [
  'Travel',
  'Equipment',
  'Materials',
  'Services',
  'Software/Licenses',
  'Labour costs',
  'Utilities',
  'Miscellaneous',
] as const;

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Bank Transfer',
  'Cheque',
] as const;

const STATUSES: Expense['status'][] = ['Paid', 'Pending', 'Reimbursed'];

// ───────── Props ─────────

interface AddExpenseFormProps {
  projectId: string;
  onSave: (expense: Expense) => Promise<void> | void;
  onCancel: () => void;
}


const formatDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};


interface DropdownProps {
  label: string;
  value: string;
  options: readonly string[];
  onSelect: (value: string) => void;
  error?: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function DropdownPicker({
  label,
  value,
  options,
  onSelect,
  error,
  icon,
}: DropdownProps) {
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
}

// ───────── Main Form Component ─────────

export default function AddExpenseForm({
  projectId,
  onSave,
  onCancel,
}: AddExpenseFormProps) {
  // ── State ──
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [type, setType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [claimant, setClaimant] = useState('');
  const [status, setStatus] = useState<Expense['status']>('Pending');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // ── Date picker handler ──
  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // iOS keeps picker open
    if (selectedDate) setDate(selectedDate);
  };

  // ── Validation ──
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    const parsedAmount = parseFloat(amount);
    if (!amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!currency) newErrors.currency = 'Currency is required';
    if (!type) newErrors.type = 'Expense type is required';
    if (!paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!claimant.trim()) newErrors.claimant = 'Claimant is required';
    if (!status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, currency, type, paymentMethod, claimant, status]);

  const handleSubmit = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const expense: Expense = {
        id: Crypto.randomUUID(),
        projectId,
        date: formatDate(date),
        amount: parseFloat(amount),
        currency,
        type,
        paymentMethod,
        claimant: claimant.trim(),
        status,
      };

      await onSave(expense);
    } catch (err) {
      Alert.alert('Error', 'Failed to save expense. Please try again.');
      console.error('Save expense error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Date ── */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.textPrimary}
              style={styles.fieldIcon}
            />
            <Text style={styles.dropdownText}>{formatDate(date)}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* ── Amount & Currency row ── */}
        <View style={styles.row}>
          <View style={[styles.fieldContainer, { flex: 2 }]}>
            <Text style={styles.label}>Amount</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.amount ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="cash-outline"
                size={18}
                color={Colors.textTertiary}
                style={styles.fieldIcon}
              />
              <TextInput
                style={styles.textInput}
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (errors.amount) {
                    setErrors((prev) => ({ ...prev, amount: '' }));
                  }
                }}
                placeholder="0.00"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="decimal-pad"
              />
            </View>
            {errors.amount ? (
              <Text style={styles.errorText}>{errors.amount}</Text>
            ) : null}
          </View>

          <View style={[styles.fieldContainer, { flex: 1, marginLeft: Spacing.md }]}>
            <DropdownPicker
              label="Currency"
              value={currency}
              options={CURRENCIES}
              onSelect={setCurrency}
              error={errors.currency}
              icon="logo-usd"
            />
          </View>
        </View>

        {/* ── Type ── */}
        <DropdownPicker
          label="Expense Type"
          value={type}
          options={EXPENSE_TYPES}
          onSelect={setType}
          error={errors.type}
          icon="pricetag-outline"
        />

        <DropdownPicker
          label="Payment Method"
          value={paymentMethod}
          options={PAYMENT_METHODS}
          onSelect={setPaymentMethod}
          error={errors.paymentMethod}
          icon="card-outline"
        />

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Claimant</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.claimant ? styles.inputError : null,
            ]}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color={Colors.textTertiary}
              style={styles.fieldIcon}
            />
            <TextInput
              style={styles.textInput}
              value={claimant}
              onChangeText={(text) => {
                setClaimant(text);
                if (errors.claimant) {
                  setErrors((prev) => ({ ...prev, claimant: '' }));
                }
              }}
              placeholder="Enter claimant name"
              placeholderTextColor={Colors.textTertiary}
              maxLength={100}
            />
          </View>
          {errors.claimant ? (
            <Text style={styles.errorText}>{errors.claimant}</Text>
          ) : null}
        </View>

        <DropdownPicker
          label="Status"
          value={status}
          options={STATUSES}
          onSelect={(v) => setStatus(v as Expense['status'])}
          error={errors.status}
          icon="flag-outline"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={saving}
          >
            <Ionicons
              name={saving ? 'hourglass-outline' : 'checkmark-circle-outline'}
              size={20}
              color={Colors.white}
            />
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Expense'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },

  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    height: '100%',
  },
  fieldIcon: {
    marginRight: Spacing.sm,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  dropdownText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  placeholder: {
    color: Colors.textTertiary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxHeight: 380,
    overflow: 'hidden',
    ...Shadow.cardHover,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionSelected: {
    backgroundColor: Colors.primaryLight,
  },
  optionText: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  cancelButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveButton: {
    flex: 2,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.white,
  },
});
