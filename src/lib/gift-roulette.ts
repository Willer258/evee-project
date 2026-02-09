import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { GIFT_TYPES, type GiftState, type GiftType } from '@/types/gifts';

const COLLECTION = 'gift_states';

/* ── Firestore helpers ── */

function stateFromDoc(data: Record<string, unknown>): GiftState {
  return {
    giftId: data.giftId as string,
    claimedCount: (data.claimedCount as number) ?? 0,
    lastClaimedAt: data.lastClaimedAt
      ? (data.lastClaimedAt as Timestamp).toDate()
      : null,
    claims: ((data.claims as Timestamp[]) ?? []).map((t) => t.toDate()),
  };
}

/* ── Initialize ── */
export async function initializeGiftStates(): Promise<void> {
  const promises = GIFT_TYPES.map(async (gift) => {
    const ref = doc(db, COLLECTION, gift.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        giftId: gift.id,
        claimedCount: 0,
        lastClaimedAt: null,
        claims: [],
      });
    }
  });
  await Promise.all(promises);
}

/* ── Realtime listener ── */
export function subscribeToGiftStates(
  callback: (states: Map<string, GiftState>) => void,
): () => void {
  const colRef = collection(db, COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    const map = new Map<string, GiftState>();
    snapshot.forEach((docSnap) => {
      map.set(docSnap.id, stateFromDoc(docSnap.data()));
    });
    callback(map);
  });
}

/* ── Claim a gift (atomic) ── */
export async function claimGift(giftId: string): Promise<boolean> {
  const gift = GIFT_TYPES.find((g) => g.id === giftId);
  if (!gift) return false;

  const ref = doc(db, COLLECTION, giftId);

  try {
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);
      const data = snap.exists() ? snap.data() : { claimedCount: 0, claims: [] };
      const currentCount = (data.claimedCount as number) ?? 0;

      // Check max claims
      if (gift.maxClaims !== null && currentCount >= gift.maxClaims) {
        throw new Error('Gift exhausted');
      }

      // Check wish cooldown (7 days)
      if (giftId === 'voeu') {
        const claims = (data.claims as Timestamp[]) ?? [];
        if (claims.length > 0) {
          const lastClaim = claims[claims.length - 1].toDate();
          const daysSince = (Date.now() - lastClaim.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSince < 7) {
            throw new Error('Wish on cooldown');
          }
        }
      }

      const now = Timestamp.now();
      transaction.update(ref, {
        claimedCount: currentCount + 1,
        lastClaimedAt: now,
        claims: [...((data.claims as Timestamp[]) ?? []), now],
      });
    });
    return true;
  } catch {
    return false;
  }
}

/* ── Available gifts (not exhausted, not on cooldown) ── */
export function getAvailableGifts(
  states: Map<string, GiftState>,
): GiftType[] {
  return GIFT_TYPES.filter((gift) => {
    const state = states.get(gift.id);
    if (!state) return true;

    // Check max claims
    if (gift.maxClaims !== null && state.claimedCount >= gift.maxClaims) {
      return false;
    }

    // Check wish cooldown
    if (gift.id === 'voeu' && state.lastClaimedAt) {
      const daysSince =
        (Date.now() - state.lastClaimedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return false;
    }

    return true;
  });
}

/* ── Wish cooldown check ── */
export function isWishOnCooldown(states: Map<string, GiftState>): boolean {
  const wishState = states.get('voeu');
  if (!wishState?.lastClaimedAt) return false;
  const daysSince =
    (Date.now() - wishState.lastClaimedAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince < 7;
}

/* ── WhatsApp link for wish ── */
export function generateWhatsAppLink(wish: string, phone: string): string {
  const text = encodeURIComponent(`✨ Mon vœu : ${wish}`);
  return `https://wa.me/${phone}?text=${text}`;
}

/* ── Poids par cadeau (plus le poids est élevé, plus c'est fréquent) ── */
const GIFT_WEIGHTS: Record<string, number> = {
  bisou: 28,
  gaterie: 22,
  massage: 17,
  poeme: 14,
  dessert: 5,
  voeu: 2,
  diner: 7,
  cinema: 5,
};

/* ── Pick random gift from available (weighted) ── */
export function pickRandomGift(available: GiftType[]): GiftType {
  const weights = available.map((g) => GIFT_WEIGHTS[g.id] ?? 10);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < available.length; i++) {
    random -= weights[i];
    if (random <= 0) return available[i];
  }

  return available[available.length - 1];
}

/* ── Spin cooldown (déverrouillable chaque lundi) ── */
const SPIN_DOC = 'spin_state';
const SPIN_COLLECTION = 'app_state';
const SPIN_FALLBACK_KEY = 'evee_last_spin';

/** Retourne le lundi 00:00 de cette semaine */
export function getThisMonday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=dim, 1=lun, ..., 6=sam
  const diff = day === 0 ? 6 : day - 1; // jours depuis lundi
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/** Retourne le prochain lundi 00:00 */
export function getNextMonday(): Date {
  const monday = getThisMonday();
  monday.setDate(monday.getDate() + 7);
  return monday;
}

/** Jours restants avant prochain lundi */
export function getDaysUntilMonday(): number {
  const next = getNextMonday();
  const diff = next.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Vérifie si lastSpin est dans la semaine courante (après ce lundi) */
export function hasSpunThisWeek(lastSpin: Date | null): boolean {
  if (!lastSpin) return false;
  return lastSpin.getTime() >= getThisMonday().getTime();
}

/** Écoute l'état du spin dans Firestore */
export function subscribeToSpinState(
  callback: (lastSpin: Date | null) => void,
): () => void {
  const ref = doc(db, SPIN_COLLECTION, SPIN_DOC);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      const ts = data.lastSpinAt as Timestamp | null;
      callback(ts ? ts.toDate() : null);
    } else {
      callback(null);
    }
  });
}

/** Enregistre un spin dans Firestore + localStorage fallback */
export async function recordSpin(): Promise<void> {
  // localStorage fallback
  try {
    localStorage.setItem(SPIN_FALLBACK_KEY, new Date().toISOString());
  } catch { /* ignore */ }

  // Firestore
  try {
    const ref = doc(db, SPIN_COLLECTION, SPIN_DOC);
    await setDoc(ref, { lastSpinAt: Timestamp.now() }, { merge: true });
  } catch { /* Firestore unavailable */ }
}

/** Lecture locale (fallback quand Firestore est offline) */
export function getLocalLastSpin(): Date | null {
  try {
    const stored = localStorage.getItem(SPIN_FALLBACK_KEY);
    if (!stored) return null;
    const date = new Date(stored);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/** Check cooldown via localStorage (pour page.tsx qui n'a pas encore Firestore) */
export function isSpinOnCooldown(): boolean {
  return hasSpunThisWeek(getLocalLastSpin());
}

/** Nombre de jours restants via localStorage */
export function getSpinCooldownDays(): number {
  if (!isSpinOnCooldown()) return 0;
  return getDaysUntilMonday();
}
