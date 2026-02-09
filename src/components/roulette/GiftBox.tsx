'use client';

import { useRef, useCallback, useImperativeHandle, forwardRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import type { GiftType } from '@/types/gifts';

interface GiftBoxProps {
  onOpenComplete: () => void;
}

export interface GiftBoxHandle {
  open: (gift: GiftType) => void;
}

const SPARKLE_COUNT = 8;

const GiftBox = forwardRef<GiftBoxHandle, GiftBoxProps>(
  function GiftBox({ onOpenComplete }, ref) {
    const container = useRef<HTMLDivElement>(null);
    const giftRef = useRef<HTMLDivElement>(null);
    const revealRef = useRef<HTMLDivElement>(null);
    const sparklesRef = useRef<HTMLDivElement>(null);
    const [revealImage, setRevealImage] = useState<string | null>(null);
    const [isOpening, setIsOpening] = useState(false);

    // Idle float animation
    useGSAP(() => {
      if (!giftRef.current) return;

      gsap.to(giftRef.current, {
        y: -8,
        duration: 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, { scope: container });

    const open = useCallback(
      (gift: GiftType) => {
        const giftEl = giftRef.current;
        const revealEl = revealRef.current;
        const sparklesEl = sparklesRef.current;
        if (!giftEl || !revealEl || !sparklesEl) return;

        setIsOpening(true);
        setRevealImage(gift.image);

        // Kill idle animation
        gsap.killTweensOf(giftEl);
        gsap.set(giftEl, { y: 0 });

        const tl = gsap.timeline({
          onComplete: () => {
            onOpenComplete();
          },
        });

        // Phase 1: Shake (1.5s) — oscillation growing in intensity
        tl.to(giftEl, {
          keyframes: [
            { rotation: 3, duration: 0.15 },
            { rotation: -3, duration: 0.15 },
            { rotation: 6, duration: 0.12 },
            { rotation: -6, duration: 0.12 },
            { rotation: 8, duration: 0.1 },
            { rotation: -8, duration: 0.1 },
            { rotation: 10, duration: 0.08 },
            { rotation: -10, duration: 0.08 },
            { rotation: 12, duration: 0.06 },
            { rotation: -12, duration: 0.06 },
            { rotation: 0, duration: 0.08 },
          ],
          ease: 'none',
        });

        // Phase 1b: Sparkles appear during shake
        const sparkles = sparklesEl.querySelectorAll('.sparkle');
        tl.fromTo(
          sparkles,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: 'back.out(2)',
          },
          '-=0.6',
        );

        // Phase 2: Burst — gift scales up and fades out
        tl.to(giftEl, {
          scale: 1.3,
          duration: 0.15,
          ease: 'power2.in',
        });

        tl.to(giftEl, {
          scale: 1.5,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
        });

        // Sparkles burst outward and fade
        tl.to(sparkles, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: 'power2.in',
        }, '-=0.25');

        // Phase 3: Reveal emoji bounces in
        tl.fromTo(
          revealEl,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
          },
          '-=0.1',
        );

        // Pause 1s to see the result, then callback
        tl.to({}, { duration: 1 });
      },
      [onOpenComplete],
    );

    useImperativeHandle(ref, () => ({ open }), [open]);

    // Generate sparkle positions in a circle around the gift
    const sparklePositions = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
      const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
      const radius = 70;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      };
    });

    return (
      <div ref={container} className="relative w-full flex items-center justify-center" style={{ minHeight: 200 }}>
        {/* Sparkles container */}
        <div
          ref={sparklesRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          {sparklePositions.map((pos, i) => (
            <span
              key={i}
              className="sparkle absolute text-xl"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(0)`,
                opacity: 0,
              }}
            >
              ✨
            </span>
          ))}
        </div>

        {/* Gift box */}
        <div
          ref={giftRef}
          className="relative z-10 flex items-center justify-center w-32 h-32 rounded-3xl will-change-transform"
          style={{
            background: 'oklch(0.93 0.03 10 / 0.6)',
            backdropFilter: 'blur(12px) saturate(1.2)',
            border: '1px solid oklch(0.75 0.08 10 / 0.3)',
            boxShadow: '0 0 30px oklch(0.75 0.08 10 / 0.15)',
          }}
        >
          <span className="text-6xl select-none" role="img" aria-label="Cadeau">
            🎁
          </span>
        </div>

        {/* Reveal image (hidden until phase 3) */}
        <div
          ref={revealRef}
          className="absolute z-20 flex items-center justify-center"
          style={{ opacity: 0, transform: 'scale(0)' }}
        >
          {revealImage && (
            <Image
              src={revealImage}
              alt="Cadeau gagné"
              width={160}
              height={160}
              className="select-none"
              style={{ width: 160, height: 160, objectFit: 'contain' }}
              draggable={false}
            />
          )}
        </div>

        {/* Subtle glow behind gift when idle */}
        {!isOpening && (
          <div
            className="absolute z-0 w-36 h-36 rounded-full animate-pulse-glow"
            style={{
              background: 'oklch(0.75 0.08 10 / 0.12)',
              filter: 'blur(20px)',
            }}
          />
        )}
      </div>
    );
  },
);

export default GiftBox;
