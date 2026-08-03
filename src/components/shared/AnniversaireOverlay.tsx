'use client';

import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Confetti from '@/components/roulette/Confetti';

interface AnniversaireOverlayProps {
  onDone: () => void;
}

interface SouvenirFete {
  src: string;
  focus?: string;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

/* Couronne de souvenirs autour du message — tous préchargés par le loader */
const PHOTOS: SouvenirFete[] = [
  { src: '/images/entree/entree-01.jpg', focus: 'center 30%', size: 'w-20 h-20 md:w-32 md:h-32', top: '6%', left: '8%' },
  { src: '/images/entree/entree-07.jpg', focus: 'center 30%', size: 'w-16 h-16 md:w-28 md:h-28', top: '5%', right: '10%' },
  { src: '/images/souvenirs/souvenir-03.jpg', focus: 'center 20%', size: 'w-14 h-14 md:w-24 md:h-24', top: '22%', right: '4%' },
  { src: '/images/entree/entree-12.jpg', focus: 'center 25%', size: 'hidden md:block md:w-28 md:h-28', top: '48%', right: '6%' },
  { src: '/images/souvenirs/souvenir-28.jpg', focus: 'center 30%', size: 'w-16 h-16 md:w-32 md:h-32', bottom: '14%', right: '9%' },
  { src: '/images/souvenirs/souvenir-29.jpg', focus: 'center 25%', size: 'w-14 h-14 md:w-24 md:h-24', bottom: '5%', right: '28%' },
  { src: '/images/entree/entree-17.jpg', focus: 'center 25%', size: 'w-20 h-20 md:w-32 md:h-32', bottom: '7%', left: '10%' },
  { src: '/images/souvenirs/souvenir-13.jpg', focus: 'center 25%', size: 'hidden md:block md:w-24 md:h-24', bottom: '32%', left: '4%' },
  { src: '/images/entree/entree-04.jpg', focus: 'center 25%', size: 'w-14 h-14 md:w-24 md:h-24', top: '30%', left: '5%' },
  { src: '/images/entree/entree-24.jpg', focus: 'center 25%', size: 'hidden md:block md:w-20 md:h-20', top: '12%', left: '30%' },
];

const VIDEOS: SouvenirFete[] = [
  { src: '/images/narrative/bulle-01.mp4', focus: 'center 25%', size: 'w-20 h-20 md:w-36 md:h-36', top: '10%', right: '27%' },
  { src: '/images/narrative/bulle-02.mp4', focus: 'center 25%', size: 'w-16 h-16 md:w-28 md:h-28', bottom: '20%', left: '22%' },
];

export default function AnniversaireOverlay({ onDone }: AnniversaireOverlayProps) {
  const container = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const finir = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    const tl = gsap.timeline({ onComplete: finir });

    tl.from('.fete-orb', {
      scale: 0, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power2.out',
    })
      .from('.fete-sphere', {
        scale: 0, opacity: 0, duration: 1.1,
        stagger: { each: 0.09, from: 'random' },
        ease: 'back.out(1.6)',
      }, '-=0.6')
      .from('.fete-un-an', {
        opacity: 0, y: 34, filter: 'blur(8px)', duration: 0.9, ease: 'power3.out',
      }, '-=0.5')
      .from('.fete-message', {
        opacity: 0, y: 24, filter: 'blur(6px)', duration: 1.0, ease: 'power3.out',
      }, '-=0.3')
      .from('.fete-dates', {
        opacity: 0, y: 14, duration: 0.7, ease: 'power2.out',
      }, '-=0.4')
      .to({}, { duration: 3.4 }) // respiration — le temps de regarder
      .to(el, { opacity: 0, duration: 0.9, ease: 'power2.in' });

    // Flottement doux des souvenirs
    el.querySelectorAll('.fete-sphere').forEach((s, i) => {
      gsap.to(s, {
        y: `+=${gsap.utils.random(-8, 8)}`,
        duration: gsap.utils.random(2.5, 4),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.5 + i * 0.05,
      });
    });
  }, { scope: container });

  // Un tap n'importe où écourte la fête — elle ne doit jamais se sentir bloquée
  const handleSkip = useCallback(() => {
    const el = container.current;
    if (!el || doneRef.current) return;
    gsap.killTweensOf(el);
    gsap.to(el, { opacity: 0, duration: 0.45, ease: 'power2.in', onComplete: finir });
  }, [finir]);

  return (
    <div
      ref={container}
      onClick={handleSkip}
      className="fixed inset-0 z-50 overflow-hidden cursor-pointer"
      style={{
        background: 'linear-gradient(160deg, var(--cream) 0%, var(--blush) 55%, oklch(0.90 0.05 10) 100%)',
      }}
    >
      <div className="grain absolute inset-0 pointer-events-none z-[5]" />

      {/* Orbes de fête */}
      <div className="fete-orb orb orb-rose w-[520px] h-[520px] -top-24 -left-24" />
      <div className="fete-orb orb orb-gold w-[380px] h-[380px] bottom-8 -right-20" />
      <div className="fete-orb orb orb-blush w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />

      {/* Confettis — cœurs roses et éclats dorés */}
      <Confetti />

      {/* Couronne de souvenirs */}
      {PHOTOS.map((p, i) => (
        <div
          key={`p-${i}`}
          className={`fete-sphere photo-sphere photo-sphere-border ${p.size}`}
          style={{
            ...(p.top ? { top: p.top } : {}),
            ...(p.bottom ? { bottom: p.bottom } : {}),
            ...(p.left ? { left: p.left } : {}),
            ...(p.right ? { right: p.right } : {}),
          }}
        >
          <Image
            src={p.src}
            alt=""
            width={128}
            height={128}
            sizes="128px"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: p.focus ?? 'center 30%' }}
          />
        </div>
      ))}
      {VIDEOS.map((v, i) => (
        <div
          key={`v-${i}`}
          className={`fete-sphere photo-sphere photo-sphere-border ${v.size}`}
          style={{
            ...(v.top ? { top: v.top } : {}),
            ...(v.bottom ? { bottom: v.bottom } : {}),
            ...(v.left ? { left: v.left } : {}),
            ...(v.right ? { right: v.right } : {}),
          }}
        >
          <video
            src={v.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: v.focus ?? 'center 30%' }}
          />
        </div>
      ))}

      {/* Message central */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <p className="fete-un-an font-serif text-5xl md:text-7xl font-light text-charcoal tracking-wide">
          Un an
        </p>
        <p className="fete-message font-script text-3xl md:text-5xl text-rose-deep mt-5 leading-relaxed drop-shadow-sm">
          Joyeux anniversaire, mon amour
        </p>
        <div className="fete-dates flex items-center gap-3 mt-7 font-sans text-xs md:text-sm text-charcoal/45 font-light tracking-[0.2em] tabular-nums">
          <span>03.08.2025</span>
          <span className="inline-block w-8 h-px bg-gold-soft/50" />
          <span>03.08.2026</span>
        </div>
      </div>
    </div>
  );
}
