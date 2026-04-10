import { useMemo } from 'react';
import { Expense } from '../types/types';

export function useExpenseTotal(expenses: Expense[]): number {
  return useMemo(
    () => expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0),
    [expenses]
  );
}


export function calculateBudgetPercentage(
  totalExpense: number,
  budget: number
): number {
  if (budget <= 0) return 0;
  return Math.max(0, (totalExpense / budget) * 100);
}
