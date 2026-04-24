
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  getActiveExpensesByProject,
  getActiveProjects,
} from './firestoreService';
import { Expense, Project } from '../types/types';


export const getProjects = (): Promise<Project[]> => getActiveProjects();

export const getExpenses = async (): Promise<Expense[]> => {

  const { getActiveDocuments } = await import('./firestoreService');
  return getActiveDocuments<Expense>('expenses');
};

export const saveExpense = async (expense: Expense): Promise<void> => {
  const docRef = doc(db, 'expenses', expense.id);
  await setDoc(docRef, {
    ...expense,
    isDeleted: expense.isDeleted ?? false,
    updated_at: expense.updated_at ?? Date.now(),
  });
};