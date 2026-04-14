import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import AddExpenseForm from '../../components/AddExpenseForm';
import {
    Colors,
    FontSizes,
    Shadow,
    Spacing,
} from '../../constants/theme';
import { saveExpense } from '../../services/expenseService';
import type { ExpenseStore } from '../../services/expenseStore';
import { useExpenseStore } from '../../services/expenseStore';
import { Expense } from '../../types/types';

export default function AddExpenseScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const router = useRouter();
  const addExpenseToStore = useExpenseStore((state: ExpenseStore) => state.addExpense);

  const handleSave = async (expense: Expense) => {
    try {
      // Save to Firebase
      await saveExpense(expense);

      // Update Zustand store with the new expense (optimistic update already completed)
      addExpenseToStore(expense);

      // Auto-navigate back to project screen
      router.back();
    } catch (err) {
      console.error('Failed to save expense:', err);
      Alert.alert(
        'Error',
        'Failed to save expense. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <Text style={styles.headerSubtitle}>
            Fill in the expense details
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Form ── */}
      <AddExpenseForm
        projectId={projectId ?? ''}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
    ...Shadow.card,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.searchBar,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
