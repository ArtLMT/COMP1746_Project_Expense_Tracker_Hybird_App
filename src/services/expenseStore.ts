import { create } from 'zustand';
import { Expense } from '../types/types';

/**
 * Global expense store using Zustand
 * Single source of truth for all expense data
 * No re-fetching from Firebase after adding an expense
 */

export interface ExpenseStore {
  // State
  allExpenses: Expense[];

  // Actions
  addExpense: (expense: Expense) => void;
  setExpenses: (expenses: Expense[]) => void;
  getExpensesByProjectId: (projectId: string) => Expense[];
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  allExpenses: [],

  /**
   * Add a new expense to the store (immutable update)
   * Used after successful Firebase save
   */
  addExpense: (expense: Expense) => {
    set((state) => ({
      allExpenses: [...state.allExpenses, expense],
    }));
  },

  /**
   * Set/replace all expenses (initial load from Firebase)
   * Used when app starts or screen mounts
   */
  setExpenses: (expenses: Expense[]) => {
    set({ allExpenses: expenses });
  },

  /**
   * Get all expenses for a specific project
   * Derived from allExpenses
   */
  getExpensesByProjectId: (projectId: string) => {
    return get().allExpenses.filter((expense) => expense.projectId === projectId);
  },
}));

export default useExpenseStore;
