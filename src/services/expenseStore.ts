import { create } from 'zustand';
import { Expense } from '../types/types';


export interface ExpenseStore {
  // State
  allExpenses: Expense[];

  // Actions
  addExpense: (expense: Expense) => void;
  setExpenses: (expenses: Expense[]) => void;
  removeExpense: (expenseId: string) => void;
  getExpensesByProjectId: (projectId: string) => Expense[];
}

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  allExpenses: [],


  addExpense: (expense: Expense) => {
    set((state) => ({
      allExpenses: [...state.allExpenses, expense],
    }));
  },


  setExpenses: (expenses: Expense[]) => {
    set({ allExpenses: expenses.filter((e) => !e.isDeleted) });
  },

  removeExpense: (expenseId: string) => {
    set((state) => ({
      allExpenses: state.allExpenses.filter((e) => e.id !== expenseId),
    }));
  },


  getExpensesByProjectId: (projectId: string) => {
    return get().allExpenses.filter(
      (expense) => expense.projectId === projectId && !expense.isDeleted
    );
  },
}));

export default useExpenseStore;
