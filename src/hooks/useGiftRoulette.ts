'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { GiftType, GiftState, RoulettePhase } from '@/types/gifts';
import { GIFT_TYPES } from '@/types/gifts';
import {
  initializeGiftStates,
  subscribeToGiftStates,
  subscribeToSpinState,
  claimGift,
  getAvailableGifts,
  pickRandomGift,
  recordSpin,
  hasSpunThisWeek,
  getDaysUntilMonday,
  getLocalLastSpin,
} from '@/lib/gift-roulette';

export function useGiftRoulette() {
  const [states, setStates] = useState<Map<string, GiftState>>(new Map());
  const [phase, setPhase] = useState<RoulettePhase>('idle');
  const [currentGift, setCurrentGift] = useState<GiftType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [lastSpin, setLastSpin] = useState<Date | null>(null);
  const initialized = useRef(false);

  const onCooldown = hasSpunThisWeek(lastSpin);
  const spinCooldown = onCooldown ? getDaysUntilMonday() : 0;

  // Initialize Firestore + subscribe
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let unsubGifts: (() => void) | undefined;
    let unsubSpin: (() => void) | undefined;

    const setup = async () => {
      try {
        await initializeGiftStates();

        unsubGifts = subscribeToGiftStates((newStates) => {
          setStates(newStates);
          setLoading(false);
        });

        unsubSpin = subscribeToSpinState((date) => {
          setLastSpin(date);
        });
      } catch {
        // Firestore unavailable — fall back to local mode
        setOffline(true);
        setLastSpin(getLocalLastSpin());
        setLoading(false);
      }
    };

    // Timeout safety
    const timeout = setTimeout(() => {
      if (loading) {
        setOffline(true);
        setLastSpin(getLocalLastSpin());
        setLoading(false);
      }
    }, 10000);

    setup();

    return () => {
      clearTimeout(timeout);
      unsubGifts?.();
      unsubSpin?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When offline, all gifts are available; when online, filter by Firestore state
  const available = offline ? GIFT_TYPES : getAvailableGifts(states);

  const spin = useCallback((): GiftType | null => {
    if (available.length === 0 || onCooldown) return null;
    const gift = pickRandomGift(available);
    setCurrentGift(gift);
    setPhase('spinning');
    recordSpin();
    setLastSpin(new Date());
    return gift;
  }, [available, onCooldown]);

  const claim = useCallback(async (): Promise<boolean> => {
    if (!currentGift) return false;

    if (offline) {
      setPhase('claimed');
      return true;
    }

    const success = await claimGift(currentGift.id);
    if (success) {
      setPhase('claimed');
    }
    return success;
  }, [currentGift, offline]);

  const reset = useCallback(() => {
    setPhase('idle');
    setCurrentGift(null);
  }, []);

  const setReveal = useCallback(() => setPhase('reveal'), []);
  const setWish = useCallback(() => setPhase('wish'), []);

  return {
    states,
    phase,
    currentGift,
    available,
    loading,
    error,
    spin,
    claim,
    reset,
    setReveal,
    setWish,
    spinCooldown,
    onCooldown,
  };
}
