import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

export interface Gift {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  link?: string;
  isPurchased: boolean;
  purchasedBy?: string;
  purchasedAt?: Date;
  createdAt: Date;
  category?: 'him' | 'her' | 'both';
}

const COLLECTION_NAME = 'gifts';

// Get all gifts
export async function getGifts(): Promise<Gift[]> {
  const giftsRef = collection(db, COLLECTION_NAME);
  const q = query(giftsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    purchasedAt: doc.data().purchasedAt?.toDate(),
  })) as Gift[];
}

// Subscribe to gifts (real-time)
export function subscribeToGifts(callback: (gifts: Gift[]) => void) {
  const giftsRef = collection(db, COLLECTION_NAME);
  const q = query(giftsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const gifts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      purchasedAt: doc.data().purchasedAt?.toDate(),
    })) as Gift[];
    callback(gifts);
  });
}

// Add a new gift
export async function addGift(gift: Omit<Gift, 'id' | 'createdAt' | 'isPurchased'>): Promise<string> {
  const giftsRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(giftsRef, {
    ...gift,
    isPurchased: false,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

// Mark gift as purchased
export async function markGiftPurchased(giftId: string, purchasedBy: string): Promise<void> {
  const giftRef = doc(db, COLLECTION_NAME, giftId);
  await updateDoc(giftRef, {
    isPurchased: true,
    purchasedBy,
    purchasedAt: Timestamp.now(),
  });
}

// Unmark gift (cancel purchase)
export async function unmarkGiftPurchased(giftId: string): Promise<void> {
  const giftRef = doc(db, COLLECTION_NAME, giftId);
  await updateDoc(giftRef, {
    isPurchased: false,
    purchasedBy: null,
    purchasedAt: null,
  });
}

// Delete a gift
export async function deleteGift(giftId: string): Promise<void> {
  const giftRef = doc(db, COLLECTION_NAME, giftId);
  await deleteDoc(giftRef);
}

// Update a gift
export async function updateGift(giftId: string, data: Partial<Gift>): Promise<void> {
  const giftRef = doc(db, COLLECTION_NAME, giftId);
  await updateDoc(giftRef, data);
}
