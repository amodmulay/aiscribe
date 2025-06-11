"use server";

import { firestore } from 'firebase-admin';
import { auth as adminAuth, app as adminApp, initializeAdminApp } from '@/lib/firebase-admin'; // Assuming firebase-admin setup
import { db } from '@/lib/firebase'; // client-side db for types, but admin for writes
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import type { HistoryEntry } from '@/types';

// Initialize Firebase Admin SDK if not already initialized
// This is a simplified way to ensure admin app is initialized. 
// In a real app, you'd likely have a more robust initialization strategy.
initializeAdminApp();


export async function addHistoryEntryAction(
  userId: string,
  data: Omit<HistoryEntry, 'id' | 'userId' | 'createdAt'>
): Promise<string | null> {
  if (!userId) {
    console.error("User not authenticated to add history");
    return null;
  }
  try {
    const historyCollection = collection(db, 'userHistory');
    const docRef = await addDoc(historyCollection, {
      ...data,
      userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding history entry: ", error);
    return null;
  }
}

export async function getUserHistoryAction(userId: string): Promise<HistoryEntry[]> {
   if (!userId) {
    console.error("User not authenticated to fetch history");
    return [];
  }
  try {
    const historyCollection = collection(db, 'userHistory');
    const q = query(historyCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const history: HistoryEntry[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().getTime() || Date.now(),
      } as HistoryEntry);
    });
    return history;
  } catch (error) {
    console.error("Error fetching user history: ", error);
    return [];
  }
}

export async function deleteHistoryEntryAction(userId: string, itemId: string): Promise<boolean> {
   if (!userId) {
    console.error("User not authenticated to delete history");
    return false;
  }
  try {
    const itemDocRef = doc(db, 'userHistory', itemId);
    // Optional: You might want to verify ownership again before deleting, 
    // though Firestore rules should handle this.
    // const itemSnap = await getDoc(itemDocRef);
    // if (itemSnap.exists() && itemSnap.data().userId === userId) {
    //   await deleteDoc(itemDocRef);
    // } else { throw new Error("Item not found or permission denied"); }
    await deleteDoc(itemDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting history entry: ", error);
    return false;
  }
}
