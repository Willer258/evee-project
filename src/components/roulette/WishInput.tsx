'use client';

import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { generateWhatsAppLink } from '@/lib/gift-roulette';
import { GiftIcon } from './GiftIcons';

interface WishInputProps {
  onSubmit: () => void;
}

const PHONE_NUMBER = '33600000000'; // Replace with actual number

export default function WishInput({ onSubmit }: WishInputProps) {
  const [wish, setWish] = useState('');
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.wish-content', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out',
    });
  }, { scope: container });

  const handleSubmit = () => {
    if (!wish.trim()) return;
    const link = generateWhatsAppLink(wish.trim(), PHONE_NUMBER);
    window.open(link, '_blank');
    onSubmit();
  };

  return (
    <div ref={container} className="flex flex-col items-center gap-5 py-4">
      <div className="wish-content" role="img" aria-label="Un vœu">
        <GiftIcon giftId="voeu" size={64} />
      </div>

      <h3 className="wish-content font-serif text-2xl text-charcoal text-center">
        Fais un vœu
      </h3>

      <p className="wish-content font-sans text-sm text-charcoal/50 text-center max-w-[240px] leading-relaxed">
        Écris ton souhait, il m&apos;arrivera par magie.
      </p>

      <textarea
        value={wish}
        onChange={(e) => setWish(e.target.value)}
        placeholder="Mon vœu..."
        className="wish-content w-full max-w-[260px] h-24 p-3 rounded-xl bg-cream/60 border border-rose-soft/20 font-sans text-sm text-charcoal placeholder:text-charcoal/30 resize-none focus:outline-none focus:border-rose-soft/40 transition-colors"
        aria-label="Écris ton vœu"
        maxLength={300}
      />

      <button
        onClick={handleSubmit}
        disabled={!wish.trim()}
        className="wish-content glass-rose rounded-2xl px-8 py-3 font-sans text-sm text-charcoal/80 hover:text-charcoal transition-colors btn-breathe disabled:opacity-40 disabled:pointer-events-none"
      >
        Envoyer mon vœu
      </button>
    </div>
  );
}
