'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lignes horizontales — alternance gauche / droite
// Chaque ligne a des cartes de largeurs variées pour l'effet masonry
const ROWS = [
  {
    direction: 'left' as const,
    speed: 35,
    cards: [
      { id: 'a1', w: 220, h: 150, label: 'Premier regard' },
      { id: 'a2', w: 170, h: 150, label: 'Fou rire' },
      { id: 'a3', w: 260, h: 150, label: 'Coucher de soleil' },
      { id: 'a4', w: 190, h: 150, label: 'Main dans la main' },
      { id: 'a5', w: 210, h: 150, label: 'Notre chanson' },
      { id: 'a6', w: 240, h: 150, label: 'Danse lente' },
      { id: 'a7', w: 180, h: 150, label: 'Étoiles' },
    ],
  },
  {
    direction: 'right' as const,
    speed: 28,
    cards: [
      { id: 'b1', w: 190, h: 160, label: 'Balade en ville' },
      { id: 'b2', w: 250, h: 160, label: 'Éclat de rire' },
      { id: 'b3', w: 170, h: 160, label: 'Café du matin' },
      { id: 'b4', w: 230, h: 160, label: 'Pluie ensemble' },
      { id: 'b5', w: 200, h: 160, label: 'Secret partagé' },
      { id: 'b6', w: 180, h: 160, label: 'Nuit étoilée' },
      { id: 'b7', w: 220, h: 160, label: 'Tendresse' },
    ],
  },
  {
    direction: 'left' as const,
    speed: 32,
    cards: [
      { id: 'c1', w: 260, h: 140, label: 'Voyage' },
      { id: 'c2', w: 180, h: 140, label: 'Cuisine à deux' },
      { id: 'c3', w: 210, h: 140, label: 'Câlin du soir' },
      { id: 'c4', w: 170, h: 140, label: 'Surprise' },
      { id: 'c5', w: 240, h: 140, label: 'Plage dorée' },
      { id: 'c6', w: 200, h: 140, label: 'Promesse' },
      { id: 'c7', w: 190, h: 140, label: 'Bonheur' },
    ],
  },
  {
    direction: 'right' as const,
    speed: 25,
    cards: [
      { id: 'd1', w: 200, h: 155, label: 'Regard complice' },
      { id: 'd2', w: 170, h: 155, label: 'Matin paresseux' },
      { id: 'd3', w: 240, h: 155, label: 'Fête à deux' },
      { id: 'd4', w: 220, h: 155, label: 'Silence doux' },
      { id: 'd5', w: 190, h: 155, label: 'Premier "je t\'aime"' },
      { id: 'd6', w: 260, h: 155, label: 'Pour toujours' },
      { id: 'd7', w: 180, h: 155, label: 'Chaleur' },
    ],
  },
];

// Couleurs stables par index (pas de Math.random dans le render)
const CARD_HUES = [
  350, 15, 30, 5, 340, 20, 355, 10, 25, 0, 345, 35, 8, 18, 330,
  12, 28, 3, 22, 338, 16, 348, 6, 32, 14, 342, 26, 2, 20, 336,
];

interface PhotoCardProps {
  w: number;
  h: number;
  label: string;
  index: number;
  onClick: () => void;
}

function PhotoCard({ w, h, label, index, onClick }: PhotoCardProps) {
  const hue = CARD_HUES[index % CARD_HUES.length];

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer group"
      style={{ width: w, height: h }}
    >
      {/* Placeholder gradient vertical */}
      <div
        className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{
          background: `linear-gradient(180deg,
            oklch(0.88 0.05 ${hue} / 0.5),
            oklch(0.93 0.03 ${hue + 40} / 0.35))`,
        }}
      />
      {/* Glass overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
        style={{
          background: 'oklch(1 0 0 / 0.15)',
          backdropFilter: 'blur(1px)',
        }}
      />
      {/* Photo icon placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-8 h-8 text-charcoal/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      {/* Label */}
      <div className="absolute inset-0 flex items-end p-3">
        <span className="font-sans text-[11px] text-charcoal/35 font-light tracking-wide">
          {label}
        </span>
      </div>
      {/* Bordure */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-hover:shadow-lg"
        style={{ border: '1px solid oklch(1 0 0 / 0.2)' }}
      />
    </button>
  );
}

// Liste plate de toutes les cartes pour le slider
const ALL_CARDS = ROWS.flatMap((row) => row.cards);

// Slider viewer avec navigation
function PhotoViewer({
  initialIndex,
  onClose,
}: {
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const overlayRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const card = ALL_CARDS[current];

  // Animation d'ouverture
  useEffect(() => {
    const overlay = overlayRef.current;
    const slide = slideRef.current;
    if (!overlay || !slide) return;

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(slide,
      { scale: 0.85, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)', delay: 0.08 },
    );
  }, []);

  // Animation de transition entre slides
  const animateToSlide = useCallback((nextIndex: number, direction: number) => {
    const slide = slideRef.current;
    if (!slide) return;

    gsap.to(slide, {
      x: -direction * 60,
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setCurrent(nextIndex);
        gsap.fromTo(slide,
          { x: direction * 60, opacity: 0, scale: 0.95 },
          { x: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' },
        );
      },
    });
  }, []);

  const goNext = useCallback(() => {
    const next = (current + 1) % ALL_CARDS.length;
    animateToSlide(next, 1);
  }, [current, animateToSlide]);

  const goPrev = useCallback(() => {
    const prev = (current - 1 + ALL_CARDS.length) % ALL_CARDS.length;
    animateToSlide(prev, -1);
  }, [current, animateToSlide]);

  // Fermeture animée
  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    const slide = slideRef.current;

    const tl = gsap.timeline({
      onComplete: onClose,
    });

    if (slide) {
      tl.to(slide, { scale: 0.85, opacity: 0, y: 20, duration: 0.25, ease: 'power2.in' }, 0);
    }
    if (overlay) {
      tl.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.05);
    }
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleClose, goNext, goPrev]);

  // Touch swipe
  const touchStart = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  }, [goNext, goPrev]);

  const hue = CARD_HUES[current % CARD_HUES.length];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-md" />

      {/* Slide content */}
      <div
        ref={slideRef}
        className="relative z-10 w-[88vw] max-w-xl"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Photo card */}
        <div className="aspect-[4/3] rounded-3xl overflow-hidden relative">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg,
                oklch(0.88 0.06 ${hue} / 0.6),
                oklch(0.92 0.04 ${hue + 30} / 0.4))`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg className="w-14 h-14 text-charcoal/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: '1px solid oklch(1 0 0 / 0.2)' }}
          />
        </div>

        {/* Label + counter */}
        <div className="mt-4 flex items-center justify-between px-1">
          <p className="font-serif text-lg text-warm-white/80 font-light">{card.label}</p>
          <span className="font-sans text-xs text-warm-white/40">
            {current + 1} / {ALL_CARDS.length}
          </span>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-1.5 mt-4">
          {ALL_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => animateToSlide(i, i > current ? 1 : -1)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: i === current
                  ? 'oklch(0.80 0.10 85)'
                  : 'oklch(1 0 0 / 0.2)',
                transform: i === current ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-warm-white/60 hover:text-warm-white transition-colors"
        style={{ background: 'oklch(0.25 0.01 270 / 0.4)', backdropFilter: 'blur(8px)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-warm-white/60 hover:text-warm-white transition-colors"
        style={{ background: 'oklch(0.25 0.01 270 / 0.4)', backdropFilter: 'blur(8px)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-warm-white/60 hover:text-warm-white transition-colors"
        style={{ background: 'oklch(0.25 0.01 270 / 0.4)', backdropFilter: 'blur(8px)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function SouvenirsSection() {
  const container = useRef<HTMLElement>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const handleCardClick = useCallback((cardId: string) => {
    const idx = ALL_CARDS.findIndex((c) => c.id === cardId);
    if (idx !== -1) setViewerIndex(idx);
  }, []);

  const handleClose = useCallback(() => {
    setViewerIndex(null);
  }, []);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    // Titre + sous-titre scrub
    const title = el.querySelector('.souvenirs-title');
    const subtitle = el.querySelector('.souvenirs-subtitle');

    if (title) {
      gsap.from(title, {
        opacity: 0, y: 40, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 30%', scrub: 1 },
      });
    }
    if (subtitle) {
      gsap.from(subtitle, {
        opacity: 0, y: 25, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 60%', end: 'top 25%', scrub: 1 },
      });
    }

    // Animation infinie des lignes horizontales
    el.querySelectorAll<HTMLElement>('.masonry-row').forEach((row) => {
      const inner = row.querySelector<HTMLElement>('.masonry-inner');
      if (!inner) return;

      const direction = row.dataset.direction;
      const speed = parseFloat(row.dataset.speed || '30');

      // Les cartes sont déjà dupliquées en React (2x dans le JSX)
      const totalWidth = inner.scrollWidth / 2;

      if (direction === 'left') {
        gsap.set(inner, { x: 0 });
        gsap.to(inner, {
          x: -totalWidth,
          duration: speed,
          ease: 'none',
          repeat: -1,
        });
      } else {
        gsap.set(inner, { x: -totalWidth });
        gsap.to(inner, {
          x: 0,
          duration: speed,
          ease: 'none',
          repeat: -1,
        });
      }
    });

    // Fade-in du grid entier
    const grid = el.querySelector('.masonry-grid');
    if (grid) {
      gsap.from(grid, {
        opacity: 0, scale: 0.97, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 40%', scrub: 1 },
      });
    }
  }, { scope: container });

  let globalIndex = 0;

  return (
    <>
      <section
        ref={container}
        className="relative min-h-[100dvh] overflow-hidden"
      >
        {/* Fond */}
        <div className="absolute inset-0 gradient-romantic" />

        {/* Grain */}
        <div className="absolute inset-0 grain pointer-events-none z-30" />

        {/* Masonry grid horizontal */}
        <div className="masonry-grid absolute inset-0 z-0 flex flex-col justify-center gap-3 overflow-hidden">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="masonry-row overflow-hidden"
              data-direction={row.direction}
              data-speed={row.speed}
            >
              <div className="masonry-inner flex gap-3 w-max">
                {/* Rendu 2x pour boucle infinie seamless */}
                {[0, 1].map((copy) =>
                  row.cards.map((card) => {
                    const idx = globalIndex++;
                    return (
                      <PhotoCard
                        key={`${card.id}-${copy}`}
                        w={card.w}
                        h={card.h}
                        label={card.label}
                        index={idx}
                        onClick={() => handleCardClick(card.id)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Voile central pour lisibilité du titre */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 50% 50%,
              oklch(0.97 0.01 80 / 0.88) 0%,
              oklch(0.97 0.01 80 / 0.35) 55%,
              oklch(0.97 0.01 80 / 0.05) 100%)`,
          }}
        />

        {/* Titre centré par-dessus */}
        <div className="relative z-20 min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center pointer-events-none">
          <h2 className="souvenirs-title font-serif text-4xl md:text-6xl font-light text-charcoal drop-shadow-sm">
            Nos souvenirs
          </h2>
          <div className="w-10 h-px bg-gold-soft/50 mt-5 mb-4" />
          <p className="souvenirs-subtitle font-sans text-base text-charcoal/50 font-light max-w-xs">
            Le temps suspendu...
          </p>
        </div>
      </section>

      {/* Photo viewer slider */}
      {viewerIndex !== null && (
        <PhotoViewer initialIndex={viewerIndex} onClose={handleClose} />
      )}
    </>
  );
}
