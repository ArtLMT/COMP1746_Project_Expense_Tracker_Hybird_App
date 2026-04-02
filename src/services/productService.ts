import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

const COLLECTION_NAME = "products";

// ➕ Create
export const addProduct = async (product: any) => {
  return await addDoc(collection(db, COLLECTION_NAME), product);
};

// 📥 Read
export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};