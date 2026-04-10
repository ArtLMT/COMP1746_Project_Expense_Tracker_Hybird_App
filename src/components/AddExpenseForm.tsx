import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAddExpenseLogic } from '../hooks/useAddExpenseLogic';
import { Expense } from '../types/types';
import { styles } from './AddExpense.styles';
import { DropdownPicker } from './DropdownPicker';
import { FormInput } from './FormInput';

interface AddExpenseFormProps {
  projectId: string;
  onSave: (expense: Expense) => Promise<void> | void;
  onCancel: () => void;
}

export default function AddExpenseForm({
  projectId,
  onSave,
  onCancel,
}: AddExpenseFormProps) {
  const logic = useAddExpenseLogic({
    projectId,
    onSave: async (expense) => {
      try {
        await onSave(expense);
      } catch (err) {
        Alert.alert('Error', 'Failed to save expense. Please try again.');
        throw err;
      }
    },
    onCancel,
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    logic.setShowDatePicker(Platform.OS === 'ios');
    logic.onDateChange(event, selectedDate);
  };

  const handleAmountChange = (text: string) => {
    logic.setAmount(text);
    if (logic.errors.amount) {
      logic.setErrors({ ...logic.errors, amount: '' });
    }
  };

  const handleClaimantChange = (text: string) => {
    logic.setClaimant(text);
    if (logic.errors.claimant) {
      logic.setErrors({ ...logic.errors, claimant: '' });
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
            onPress={() => logic.setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#333"
              style={styles.fieldIcon}
            />
            <Text style={styles.dropdownText}>{logic.formatDate(logic.date)}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {logic.showDatePicker && (
          <DateTimePicker
            value={logic.date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* ── Amount & Currency Row ── */}
        <View style={styles.row}>
          <View style={[styles.fieldContainer, { flex: 2 }]}>
            <FormInput
              label="Amount"
              icon="cash-outline"
              value={logic.amount}
              onChangeText={handleAmountChange}
              placeholder="0.00"
              keyboardType="decimal-pad"
              error={logic.errors.amount}
            />
          </View>
          <View style={[styles.fieldContainer, { flex: 1, marginLeft: 16 }]}>
            <DropdownPicker
              label="Currency"
              value={logic.currency}
              options={logic.currencies}
              onSelect={logic.setCurrency}
              error={logic.errors.currency}
              icon="logo-usd"
            />
          </View>
        </View>

        {/* ── Expense Type & Payment Method ── */}
        <DropdownPicker
          label="Expense Type"
          value={logic.type}
          options={logic.expenseTypes}
          onSelect={logic.setType}
          error={logic.errors.type}
          icon="pricetag-outline"
        />

        <DropdownPicker
          label="Payment Method"
          value={logic.paymentMethod}
          options={logic.paymentMethods}
          onSelect={logic.setPaymentMethod}
          error={logic.errors.paymentMethod}
          icon="card-outline"
        />

        {/* ── Claimant ── */}
        <FormInput
          label="Claimant"
          icon="person-outline"
          value={logic.claimant}
          onChangeText={handleClaimantChange}
          placeholder="Enter claimant name"
          maxLength={100}
          error={logic.errors.claimant}
        />

        {/* ── Status ── */}
        <DropdownPicker
          label="Status"
          value={logic.status}
          options={logic.statuses}
          onSelect={(v) => logic.setStatus(v as Expense['status'])}
          error={logic.errors.status}
          icon="flag-outline"
        />

        {/* ── Action Buttons ── */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, logic.saving && styles.saveButtonDisabled]}
            onPress={logic.handleSubmit}
            activeOpacity={0.8}
            disabled={logic.saving}
          >
            <Ionicons
              name={logic.saving ? 'hourglass-outline' : 'checkmark-circle-outline'}
              size={20}
              color="white"
            />
            <Text style={styles.saveButtonText}>
              {logic.saving ? 'Saving...' : 'Save Expense'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
