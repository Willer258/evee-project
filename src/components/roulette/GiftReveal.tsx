'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { GiftType } from '@/types/gifts';
import { GiftIcon } from './GiftIcons';

interface GiftRevealProps {
  gift: GiftType;
  onClaim: () => void;
}

export default function GiftReveal({ gift, onClaim }: GiftRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.reveal-emoji', {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    })
    .from('.reveal-name', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.3')
    .from('.reveal-desc', {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.2')
    .from('.reveal-btn', {
      opacity: 0,
      scale: 0.8,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.1');
  }, { scope: container });

  return (
    <div ref={container} className="flex flex-col items-center gap-5 py-4">
      <div className="reveal-emoji" role="img" aria-label={gift.name}>
        <GiftIcon giftId={gift.id} size={160} />
      </div>

      <h3 className="reveal-name font-serif text-2xl text-charcoal text-center">
        {gift.name}
      </h3>

      <p className="reveal-desc font-sans text-sm text-charcoal/50 text-center max-w-[240px] leading-relaxed">
        {gift.description}
      </p>

      <button
        onClick={onClaim}
        className="reveal-btn glass-rose rounded-2xl px-8 py-3 font-sans text-sm text-charcoal/80 hover:text-charcoal transition-colors btn-breathe"
      >
        Réclamer mon cadeau
      </button>
    </div>
  );
}
