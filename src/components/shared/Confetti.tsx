'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const PARTICLE_COUNT = 30;
const COLORS = [
  'oklch(0.75 0.08 10)',   // rose-soft
  'oklch(0.80 0.10 85)',   // gold-soft
  'oklch(0.93 0.03 10)',   // blush
  'oklch(0.72 0.12 10)',   // rose vif
  'oklch(0.85 0.10 85)',   // or clair
];

export default function Confetti() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    const particles = el.querySelectorAll('.confetti-particle');
    particles.forEach((p) => {
      const startX = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 60;

      gsap.set(p, {
        x: `${startX}vw`,
        y: -20,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.8,
      });

      gsap.to(p, {
        y: '110vh',
        x: `${endX}vw`,
        rotation: `+=${360 + Math.random() * 720}`,
        duration: 2.5 + Math.random() * 2,
        ease: 'power1.in',
        delay: Math.random() * 0.8,
      });
    });

    // Fade out entire container
    gsap.to(el, {
      opacity: 0,
      duration: 0.6,
      delay: 3.5,
      ease: 'power2.in',
    });
  }, { scope: container });

  return (
    <div
      ref={container}
      className="fixed inset-0 pointer-events-none z-[80]"
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const color = COLORS[i % COLORS.length];
        const size = 6 + Math.random() * 8;
        const isHeart = i % 5 === 0;

        return (
          <div
            key={i}
            className="confetti-particle absolute"
            style={{
              width: isHeart ? size + 4 : size,
              height: isHeart ? size + 4 : size,
            }}
          >
            {isHeart ? (
              <svg viewBox="0 0 16 16" width={size + 4} height={size + 4} fill="none">
                <path d="M8 14C5 11 2 9 2 6c0-2 1.5-3.5 3.5-3.5C6.8 2.5 7.6 3 8 4c.4-1 1.2-1.5 2.5-1.5C12.5 2.5 14 4 14 6c0 3-3 5-6 8z" fill={color} />
              </svg>
            ) : (
              <div style={{ width: size, height: size, background: color, borderRadius: '2px' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
