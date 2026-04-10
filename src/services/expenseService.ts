import { db } from "../firebase/config";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { Expense } from "../types/types";
import * as Crypto from 'expo-crypto';

export const getProjects = async () => {
  const snapshot = await getDocs(collection(db, "projects"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getExpenses = async () => {
  const snapshot = await getDocs(collection(db, "expenses"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const saveExpense = async (expense: Expense): Promise<void> => {
  const uuid = Crypto.randomUUID();
  const docRef = doc(db, "expenses", uuid);

  await setDoc(docRef, {
    ...expense,
    id: uuid 
  });
};