'use client';

import { useState, useEffect } from 'react';
import { Gift, subscribeToGifts, markGiftPurchased, unmarkGiftPurchased, addGift } from '@/lib/gifts';

export function useGifts() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = subscribeToGifts((updatedGifts) => {
      setGifts(updatedGifts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const purchaseGift = async (giftId: string, buyerName: string) => {
    try {
      await markGiftPurchased(giftId, buyerName);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const cancelPurchase = async (giftId: string) => {
    try {
      await unmarkGiftPurchased(giftId);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const createGift = async (gift: Omit<Gift, 'id' | 'createdAt' | 'isPurchased'>) => {
    try {
      return await addGift(gift);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Stats
  const availableGifts = gifts.filter(g => !g.isPurchased);
  const purchasedGifts = gifts.filter(g => g.isPurchased);
  const forHim = gifts.filter(g => g.category === 'him');
  const forHer = gifts.filter(g => g.category === 'her');
  const forBoth = gifts.filter(g => g.category === 'both');

  return {
    gifts,
    loading,
    error,
    purchaseGift,
    cancelPurchase,
    createGift,
    availableGifts,
    purchasedGifts,
    forHim,
    forHer,
    forBoth,
  };
}
