/**
 * firestoreService.ts
 *
 * Sync-aware Firestore operations for the React Native (Expo) app.
 * Shares the same Firestore database with the Native Android (Kotlin) app.
 *
 * Sync Strategy:
 *  - Soft Delete  : Never call deleteDoc(). Use softDeleteDocument() instead.
 *  - Conflict Res : Last-Write-Wins (LWW) based on `updated_at` (Unix ms timestamp).
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  DocumentData,
  Query,
  WithFieldValue,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Expense, Project, SyncMetadata } from '../types/types';

export async function getActiveDocuments<T extends SyncMetadata>(
  collectionName: string,
  baseQuery?: Query<DocumentData>
): Promise<(T & { id: string })[]> {
  const q = baseQuery ?? query(collection(db, collectionName));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as T),
    }))
    .filter((record) => !record.isDeleted);
}


export async function getActiveProjects(): Promise<Project[]> {
  return getActiveDocuments<Project>('projects');
}


export async function getActiveExpensesByProject(projectId: string): Promise<Expense[]> {
  // Only the projectId filter goes to Firestore; isDeleted is filtered client-side
  const projectExpensesQuery = query(
    collection(db, 'expenses'),
    where('projectId', '==', projectId)
  );
  return getActiveDocuments<Expense>('expenses', projectExpensesQuery);
}

export type LWWResult =
  | 'UPDATED'          // Write was accepted and applied
  | 'STALE_REJECTED'   // Incoming data is older than Cloud — write discarded
  | 'DELETED_BLOCKED'  // Cloud document is soft-deleted; incoming write blocked
  | 'NOT_FOUND';       // Document does not exist in Firestore

export async function updateDocumentWithLWW(
  collectionName: string,
  documentId: string,
  incomingData: Partial<SyncMetadata> & { updated_at: number } & WithFieldValue<DocumentData>
): Promise<LWWResult> {
  const docRef = doc(db, collectionName, documentId);

  // ── Step 1: Fetch current state from Cloud ──────────────────────────────
  const currentSnap = await getDoc(docRef);

  if (!currentSnap.exists()) {
    console.warn(`[LWW] Document "${collectionName}/${documentId}" not found. Aborting.`);
    return 'NOT_FOUND';
  }

  const currentData = currentSnap.data() as SyncMetadata;
  const currentUpdatedAt: number = currentData.updated_at ?? 0;
  const currentIsDeleted: boolean = currentData.isDeleted ?? false;
  const incomingUpdatedAt: number = incomingData.updated_at;
  const incomingIsDeleted: boolean | undefined = incomingData.isDeleted as boolean | undefined;

  // ── Step 2: Tombstone guard ─────────────────────────────────────────────
  // If Cloud document is soft-deleted, only allow a restore (isDeleted: false)
  if (currentIsDeleted && incomingIsDeleted !== false) {
    console.warn(
      `[LWW] "${collectionName}/${documentId}" is a tombstone in Cloud. ` +
      'Write blocked. To restore, pass isDeleted: false.'
    );
    return 'DELETED_BLOCKED';
  }

  // ── Step 3: Timestamp comparison (LWW gate) ─────────────────────────────
  if (incomingUpdatedAt <= currentUpdatedAt) {
    console.info(
      `[LWW] "${collectionName}/${documentId}" — incoming updated_at (${incomingUpdatedAt}) ` +
      `is not newer than Cloud (${currentUpdatedAt}). Write rejected as stale.`
    );
    return 'STALE_REJECTED';
  }

  // ── Step 4: All checks passed — apply the update ────────────────────────
  await updateDoc(docRef, incomingData);
  console.info(
    `[LWW] "${collectionName}/${documentId}" updated. ` +
    `Cloud ts: ${currentUpdatedAt} → New ts: ${incomingUpdatedAt}`
  );
  return 'UPDATED';
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — SOFT DELETE
// ─────────────────────────────────────────────────────────────────────────────
export async function softDeleteDocument(
  collectionName: string,
  documentId: string
): Promise<number> {
  const docRef = doc(db, collectionName, documentId);
  const deletedAt = Date.now(); // Mirrors System.currentTimeMillis() on Android

  await updateDoc(docRef, {
    isDeleted: true,
    updated_at: deletedAt,
  });

  console.info(
    `[SoftDelete] "${collectionName}/${documentId}" marked as deleted at ${deletedAt}.`
  );

  return deletedAt;
}
