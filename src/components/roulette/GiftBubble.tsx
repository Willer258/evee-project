'use client';

import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { GiftBubbleIcon } from './GiftIcons';

interface GiftBubbleProps {
  onClick: () => void;
}

export default function GiftBubble({ onClick }: GiftBubbleProps) {
  const container = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [showTooltip, setShowTooltip] = useState(true);

  useGSAP(() => {
    // Bubble entrance with delay — use ref to avoid CSS transition conflict
    if (btnRef.current) {
      gsap.fromTo(btnRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.8, delay: 2, ease: 'elastic.out(1, 0.5)', clearProps: 'transform' },
      );
    }

    // Tooltip entrance
    gsap.from('.gift-tooltip', {
      opacity: 0,
      x: 10,
      duration: 0.5,
      delay: 2.5,
      ease: 'power2.out',
    });
  }, { scope: container });

  // Auto-hide tooltip
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5500); // 2s delay + 3.5s visible
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={container} className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip */}
      {showTooltip && (
        <div className="gift-tooltip glass rounded-xl px-3 py-1.5 font-sans text-xs text-charcoal/60 whitespace-nowrap">
          Un cadeau t&apos;attend...
        </div>
      )}

      {/* Bubble button */}
      <button
        ref={btnRef}
        onClick={onClick}
        className="gift-bubble-btn w-12 h-12 glass-rose rounded-full flex items-center justify-center text-xl animate-pulse-glow cursor-pointer"
        style={{ transform: 'scale(0)' }}
        aria-label="Ouvrir la roulette de cadeaux"
      >
        <GiftBubbleIcon size={24} />
      </button>
    </div>
  );
}
