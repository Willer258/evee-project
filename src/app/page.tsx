'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import GiftBubble from '@/components/roulette/GiftBubble';
import RouletteModal from '@/components/roulette/RouletteModal';
import { isSpinOnCooldown } from '@/lib/gift-roulette';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const DateLock = dynamic(() => import('@/components/lock/DateLock'), { ssr: false });
const EntreeSection = dynamic(() => import('@/components/sections/EntreeSection'), { ssr: false });
const DecouverteSection = dynamic(() => import('@/components/sections/DecouverteSection'), { ssr: false });
const SouvenirsSection = dynamic(() => import('@/components/sections/SouvenirsSection'), { ssr: false });
const ConnexionSection = dynamic(() => import('@/components/sections/ConnexionSection'), { ssr: false });
const IntimiteSection = dynamic(() => import('@/components/sections/IntimiteSection'), { ssr: false });
const ScellementSection = dynamic(() => import('@/components/sections/ScellementSection'), { ssr: false });
const VideoFinaleSection = dynamic(() => import('@/components/sections/VideoFinaleSection'), { ssr: false });

/* ── Images à précharger ── */
const PRELOAD_IMAGES = [
  '/images/cloud.png',
  ...Array.from({ length: 24 }, (_, i) => `/images/entree/entree-${String(i + 1).padStart(2, '0')}.jpg`),
  ...Array.from({ length: 28 }, (_, i) => `/images/souvenirs/souvenir-${String(i + 1).padStart(2, '0')}.jpg`),
  ...[
    '01a', '01b', '01c', '02a', '02b', '02c', '03a', '03b', '03c',
    '04b', '05a', '05b', '05c', '06a', '06b', '07a', '07b',
    '08a', '08b', '08c', '09a', '09b', '09c', '10a', '10b', '10c',
    '11a', '11b', '11c', '12b', 'finale-hero',
  ].map((n) => `/images/narrative/${n}.jpg`),
];

function preloadAllImages(onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve) => {
    const total = PRELOAD_IMAGES.length;
    let loaded = 0;
    if (total === 0) { resolve(); return; }
    PRELOAD_IMAGES.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        loaded++;
        onProgress(Math.round((loaded / total) * 100));
        if (loaded >= total) resolve();
      };
      img.src = src;
    });
  });
}

export default function Home() {
  const [phase, setPhase] = useState<'loading' | 'lock' | 'content'>('loading');
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  // ── Animations du loader ──
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    // Orbes apparaissent
    gsap.from('.loader-orb', {
      scale: 0,
      opacity: 0,
      duration: 2,
      stagger: 0.3,
      ease: 'power2.out',
    });

    // Texte fade-in
    gsap.from('.loader-text', {
      opacity: 0,
      y: 20,
      filter: 'blur(6px)',
      duration: 1.2,
      delay: 0.5,
      ease: 'power2.out',
    });

    // Barre et pourcentage
    gsap.from('.loader-bar-wrap', {
      opacity: 0,
      scaleX: 0,
      duration: 0.8,
      delay: 0.8,
      ease: 'power2.out',
    });

    // Respiration douce des orbes
    gsap.to('.loader-orb', {
      scale: 1.1,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.8 },
    });
  }, []);

  // ── Préchargement ──
  useEffect(() => {
    if (phase !== 'loading') return; // skip if not in loading phase
    preloadAllImages((pct) => setProgress(pct)).then(() => {
      setTimeout(() => {
        const el = loaderRef.current;
        if (!el) { setPhase('lock'); return; }

        const tl = gsap.timeline({
          onComplete: () => setPhase('lock'),
        });

        // Texte et barre disparaissent
        tl.to('.loader-text, .loader-bar-wrap, .loader-pct', {
          opacity: 0,
          y: -15,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.in',
        })
        // Orbes s'expansent et s'estompent
        .to('.loader-orb', {
          scale: 2,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power2.in',
        }, '-=0.3')
        // Fond fade out
        .to(el, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.in',
        }, '-=0.5');
      }, 600);
    });
  }, []);

  // ── Transition lock → content ──
  const handleUnlock = useCallback(() => {
    const curtain = curtainRef.current;
    if (!curtain) { setPhase('content'); return; }

    // Rideau blanc se ferme puis s'ouvre sur le contenu
    const tl = gsap.timeline({
      onComplete: () => setPhase('content'),
    });

    tl.fromTo(curtain,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.in' },
    )
    .to(curtain, {
      opacity: 0,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
    });
  }, []);

  // ── Check bubble visibility based on cooldown ──
  useEffect(() => {
    if (phase === 'content') {
      setShowBubble(!isSpinOnCooldown());
    }
  }, [phase, isRouletteOpen]);

  // ── Lenis smooth scroll ──
  useEffect(() => {
    if (phase !== 'content') return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
      setReady(true);
    }, 300);

    return () => {
      clearTimeout(timeout);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, [phase]);

  return (
    <>
      {/* ── Écran de chargement ── */}
      {phase === 'loading' && (
        <div
          ref={loaderRef}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 overflow-hidden"
          style={{ background: 'oklch(0.97 0.01 80)' }}
        >
          <div className="grain absolute inset-0 pointer-events-none" />

          {/* Orbes ambiantes */}
          <div className="loader-orb orb orb-rose w-[400px] h-[400px] top-[15%] left-[10%]" />
          <div className="loader-orb orb orb-blush w-[300px] h-[300px] bottom-[20%] right-[10%]" />
          <div className="loader-orb orb orb-gold w-[200px] h-[200px] top-[50%] right-[25%]" />

          {/* Texte */}
          <p className="loader-text font-serif text-lg md:text-xl text-charcoal/50 font-light text-center leading-relaxed max-w-xs relative z-10">
            Eve, quelque chose t&apos;attend<br />
            derrière cette porte...
          </p>

          {/* Barre de progression */}
          <div className="loader-bar-wrap w-48 h-px relative overflow-hidden rounded-full z-10" style={{ background: 'oklch(0.90 0.03 10)' }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, oklch(0.75 0.08 10), oklch(0.80 0.10 85))',
              }}
            />
          </div>

          <span className="loader-pct font-sans text-xs text-charcoal/25 font-light relative z-10">
            {progress}%
          </span>
        </div>
      )}

      {/* ── Rideau de transition ── */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[60] pointer-events-none opacity-0"
        style={{ background: 'oklch(0.97 0.01 80)' }}
      />

      {/* ── DateLock ── */}
      {phase === 'lock' && <DateLock onUnlock={handleUnlock} />}

      {/* ── Contenu ── */}
      {phase === 'content' && (
        <>
          <div ref={wrapperRef} className="overflow-x-hidden">
            <EntreeSection />
            <DecouverteSection />
            <SouvenirsSection />
            <ConnexionSection />
            <IntimiteSection />
            <ScellementSection />
            <VideoFinaleSection />
          </div>
          {/* Bulle + modal flottantes, hors du scroll */}
          {showBubble && <GiftBubble onClick={() => setIsRouletteOpen(true)} />}
          <RouletteModal isOpen={isRouletteOpen} onClose={() => setIsRouletteOpen(false)} />
        </>
      )}
    </>
  );
}
