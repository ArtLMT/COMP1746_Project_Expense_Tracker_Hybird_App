import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

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