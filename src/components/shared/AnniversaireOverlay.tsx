'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import Confetti from '@/components/shared/Confetti';

interface AnniversaireOverlayProps {
  onDone: () => void;
}

interface BulleFete {
  photos: string[];
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  offset: number; // décalage du diaporama, pour désynchroniser les bulles
}

/* Toute la galerie du site — moins les doublons de remplacement et une écartée */
const EXCLUES = new Set([
  '/images/entree/entree-08.jpg',  // doublon de souvenir-23
  '/images/entree/entree-16.jpg',  // doublon de souvenir-13
  '/images/entree/entree-19.jpg',  // doublon de souvenir-01
  '/images/entree/entree-20.jpg',  // doublon de souvenir-24
  '/images/entree/entree-22.jpg',  // écartée
]);

const GALERIE: string[] = [
  ...Array.from({ length: 24 }, (_, i) => `/images/entree/entree-${String(i + 1).padStart(2, '0')}.jpg`),
  ...Array.from({ length: 29 }, (_, i) => `/images/souvenirs/souvenir-${String(i + 1).padStart(2, '0')}.jpg`),
].filter((src) => !EXCLUES.has(src));

/* 8 emplacements — les photos de toute la galerie s'y répartissent en alternance */
const SLOTS = [
  { size: 'w-24 h-24 md:w-48 md:h-48', top: '5%', left: '7%', offset: 0 },
  { size: 'w-24 h-24 md:w-48 md:h-48', top: '4%', right: '8%', offset: 1.4 },
  { size: 'hidden md:block md:w-36 md:h-36', top: '26%', right: '3%', offset: 2.6 },
  { size: 'w-20 h-20 md:w-40 md:h-40', top: '52%', right: '6%', offset: 0.8 },
  { size: 'w-20 h-20 md:w-36 md:h-36', bottom: '6%', right: '24%', offset: 3.4 },
  { size: 'w-24 h-24 md:w-44 md:h-44', bottom: '7%', left: '9%', offset: 2.0 },
  { size: 'hidden md:block md:w-32 md:h-32', top: '55%', left: '4%', offset: 4.2 },
  { size: 'w-16 h-16 md:w-32 md:h-32', top: '27%', left: '5%', offset: 1.0 },
];

const BULLES: BulleFete[] = SLOTS.map((slot, i) => ({
  ...slot,
  photos: GALERIE.filter((_, j) => j % SLOTS.length === i),
}));

const VIDEOS_BULLES = [
  { src: '/images/narrative/bulle-01.mp4', focus: 'center 25%', size: 'w-24 h-24 md:w-40 md:h-40', top: '9%', right: '27%' },
  { src: '/images/narrative/bulle-02.mp4', focus: 'center 25%', size: 'w-20 h-20 md:w-32 md:h-32', bottom: '18%', left: '24%' },
];

/* Une bulle-diaporama : ses photos se succèdent en fondu croisé */
function BulleSouvenir({ bulle }: { bulle: BulleFete }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const imgs = el.querySelectorAll('.bulle-img');
    if (imgs.length < 2) return;

    const cycle = gsap.timeline({ repeat: -1, delay: 2.2 + bulle.offset });
    imgs.forEach((img, i) => {
      const next = imgs[(i + 1) % imgs.length];
      cycle
        .to(img, { opacity: 0, duration: 1.2, ease: 'power2.inOut' }, `+=3.1`)
        .to(next, { opacity: 1, duration: 1.2, ease: 'power2.inOut' }, '<');
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className={`fete-sphere photo-sphere photo-sphere-border ${bulle.size}`}
      style={{
        ...(bulle.top ? { top: bulle.top } : {}),
        ...(bulle.bottom ? { bottom: bulle.bottom } : {}),
        ...(bulle.left ? { left: bulle.left } : {}),
        ...(bulle.right ? { right: bulle.right } : {}),
      }}
    >
      {bulle.photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={192}
          height={192}
          sizes="192px"
          className="bulle-img absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: 'center 28%',
            opacity: i === 0 ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}

export default function AnniversaireOverlay({ onDone }: AnniversaireOverlayProps) {
  const container = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const [etape, setEtape] = useState<'fete' | 'revele'>('fete');
  const [burst, setBurst] = useState(false);

  const finir = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    const tl = gsap.timeline();

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
      // Le cadeau apparaît — et la fête attend qu'elle l'ouvre
      .from('.fete-cadeau', {
        scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(1.7)',
      }, '+=0.4');

    // Chorégraphie des bulles : dérives elliptiques désynchronisées + respiration
    el.querySelectorAll('.fete-sphere').forEach((s, i) => {
      gsap.to(s, {
        x: `+=${gsap.utils.random(-16, 16)}`,
        duration: gsap.utils.random(4, 6),
        yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: 1.2 + i * 0.05,
      });
      gsap.to(s, {
        y: `+=${gsap.utils.random(-18, 18)}`,
        duration: gsap.utils.random(5, 7.5),
        yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: 1.2 + i * 0.07,
      });
      gsap.to(s, {
        scale: 1.035,
        duration: gsap.utils.random(3, 4.5),
        yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: 1.6 + i * 0.1,
      });
    });
  }, { scope: container });

  // ── Elle ouvre le cadeau : burst de confettis, puis la révélation ──
  const handleOuvrir = useCallback(() => {
    const el = container.current;
    if (!el || etape !== 'fete') return;
    setBurst(true);
    gsap.to('.fete-centre', {
      opacity: 0,
      y: -24,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => setEtape('revele'),
    });
  }, [etape]);

  // ── Après la révélation : un toucher n'importe où ouvre le monde ──
  const handleContinuer = useCallback(() => {
    const el = container.current;
    if (!el || etape !== 'revele' || doneRef.current) return;
    gsap.to(el, { opacity: 0, duration: 0.6, ease: 'power2.in', onComplete: finir });
  }, [etape, finir]);

  return (
    <div
      ref={container}
      onClick={handleContinuer}
      className={`fixed inset-0 z-50 overflow-hidden ${etape === 'revele' ? 'cursor-pointer' : ''}`}
      style={{
        background: 'linear-gradient(160deg, var(--cream) 0%, var(--blush) 55%, oklch(0.90 0.05 10) 100%)',
      }}
    >
      <div className="grain absolute inset-0 pointer-events-none z-[5]" />

      {/* Orbes de fête */}
      <div className="fete-orb orb orb-rose w-[520px] h-[520px] -top-24 -left-24" />
      <div className="fete-orb orb orb-gold w-[380px] h-[380px] bottom-8 -right-20" />
      <div className="fete-orb orb orb-blush w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />

      {/* Confettis — à l'entrée, puis à l'ouverture du cadeau */}
      <Confetti />
      {burst && <Confetti />}

      {/* Couronne de bulles-diaporamas */}
      {BULLES.map((b, i) => (
        <BulleSouvenir key={i} bulle={b} />
      ))}
      {VIDEOS_BULLES.map((v, i) => (
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

      {/* Centre — la fête, puis la révélation */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        {etape === 'fete' ? (
          <div key="fete" className="fete-centre flex flex-col items-center">
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

            {/* Le cadeau à ouvrir */}
            <button
              type="button"
              onClick={handleOuvrir}
              className="fete-cadeau pointer-events-auto mt-10 flex flex-col items-center gap-3 cursor-pointer group"
              aria-label="Ouvrir notre cadeau"
            >
              <span
                className="w-16 h-16 md:w-20 md:h-20 glass-gold border-glow relative rounded-full flex items-center justify-center animate-pulse-glow group-hover:scale-110 group-active:scale-95 transition-transform duration-300"
                style={{ color: 'oklch(0.65 0.12 25)' }}
              >
                <svg className="w-7 h-7 md:w-9 md:h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M12 8v13" />
                  <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                  <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
                </svg>
              </span>
              <span className="font-script text-2xl md:text-3xl text-rose-deep drop-shadow-sm">
                Ouvrir notre cadeau
              </span>
            </button>
          </div>
        ) : (
          <div key="revele" className="flex flex-col items-center">
            <p
              className="animate-fade-in-up font-serif text-xs md:text-sm uppercase tracking-[0.4em] font-light"
              style={{ color: 'oklch(0.80 0.10 85)' }}
            >
              Notre cadeau
            </p>
            <p className="animate-fade-in-up font-script text-4xl md:text-6xl text-rose-deep mt-6 leading-relaxed" style={{ animationDelay: '0.3s' }}>
              Une soirée romantique,
            </p>
            <p className="animate-fade-in-up font-script text-4xl md:text-6xl text-rose-deep leading-relaxed" style={{ animationDelay: '0.55s' }}>
              rien que nous deux
            </p>
            <div className="animate-fade-in-up h-px w-16 mt-8 bg-gradient-to-r from-transparent via-gold-soft/60 to-transparent" style={{ animationDelay: '0.9s' }} />
            <p className="animate-fade-in-up font-serif text-base md:text-lg text-charcoal/60 font-light italic mt-6" style={{ animationDelay: '1.2s' }}>
              Prévois ta plus belle robe.
            </p>
            <p className="animate-fade-in-up font-serif text-base md:text-lg text-charcoal/60 font-light italic mt-2" style={{ animationDelay: '1.6s' }}>
              Et accepte-moi, ce soir, comme le faiseur de ta soirée.
            </p>
            <p className="animate-fade-in-up font-sans text-[10px] uppercase tracking-[0.3em] text-charcoal/30 font-light mt-12" style={{ animationDelay: '2.8s' }}>
              touche l&rsquo;écran pour continuer
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
