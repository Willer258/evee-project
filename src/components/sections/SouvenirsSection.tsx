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
      { id: 'a1', w: 220, src: '/images/souvenirs/souvenir-01.jpg' },
      { id: 'a2', w: 170, src: '/images/souvenirs/souvenir-02.jpg' },
      { id: 'a3', w: 260, src: '/images/souvenirs/souvenir-03.jpg' },
      { id: 'a4', w: 190, src: '/images/souvenirs/souvenir-04.jpg' },
      { id: 'a5', w: 210, src: '/images/souvenirs/souvenir-05.jpg' },
      { id: 'a6', w: 240, src: '/images/souvenirs/souvenir-06.jpg' },
      { id: 'a7', w: 180, src: '/images/souvenirs/souvenir-07.jpg' },
    ],
  },
  {
    direction: 'right' as const,
    speed: 28,
    cards: [
      { id: 'b1', w: 190, src: '/images/souvenirs/souvenir-08.jpg' },
      { id: 'b2', w: 250, src: '/images/souvenirs/souvenir-09.jpg' },
      { id: 'b3', w: 170, src: '/images/souvenirs/souvenir-10.jpg' },
      { id: 'b4', w: 230, src: '/images/souvenirs/souvenir-11.jpg' },
      { id: 'b5', w: 200, src: '/images/souvenirs/souvenir-12.jpg' },
      { id: 'b6', w: 180, src: '/images/souvenirs/souvenir-13.jpg' },
      { id: 'b7', w: 220, src: '/images/souvenirs/souvenir-14.jpg' },
    ],
  },
  {
    direction: 'left' as const,
    speed: 32,
    cards: [
      { id: 'c1', w: 260, src: '/images/souvenirs/souvenir-15.jpg' },
      { id: 'c2', w: 180, src: '/images/souvenirs/souvenir-16.jpg' },
      { id: 'c3', w: 210, src: '/images/souvenirs/souvenir-17.jpg' },
      { id: 'c4', w: 170, src: '/images/souvenirs/souvenir-18.jpg' },
      { id: 'c5', w: 240, src: '/images/souvenirs/souvenir-19.jpg' },
      { id: 'c6', w: 200, src: '/images/souvenirs/souvenir-20.jpg' },
      { id: 'c7', w: 190, src: '/images/souvenirs/souvenir-21.jpg' },
    ],
  },
  {
    direction: 'right' as const,
    speed: 25,
    cards: [
      { id: 'd1', w: 200, src: '/images/souvenirs/souvenir-22.jpg' },
      { id: 'd2', w: 170, src: '/images/souvenirs/souvenir-23.jpg' },
      { id: 'd3', w: 240, src: '/images/souvenirs/souvenir-24.jpg' },
      { id: 'd4', w: 220, src: '/images/souvenirs/souvenir-25.jpg' },
      { id: 'd5', w: 190, src: '/images/souvenirs/souvenir-26.jpg' },
      { id: 'd6', w: 260, src: '/images/souvenirs/souvenir-27.jpg' },
      { id: 'd7', w: 180, src: '/images/souvenirs/souvenir-28.jpg' },
    ],
  },
];

interface PhotoCardProps {
  w: number;
  src: string;
  index: number;
  onClick: () => void;
}

function PhotoCard({ w, src, onClick }: PhotoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl overflow-hidden relative flex-shrink-0 cursor-pointer group h-full"
      style={{ width: w }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
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
        <div className="aspect-[3/4] md:aspect-[4/3] rounded-3xl overflow-hidden relative bg-charcoal/40">
          <img
            src={card.src}
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ border: '1px solid oklch(1 0 0 / 0.2)' }}
          />
        </div>

        {/* Counter */}
        <div className="mt-4 flex items-center justify-center px-1">
          <span className="font-sans text-xs text-warm-white/40">
            {current + 1} / {ALL_CARDS.length}
          </span>
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
        <div className="masonry-grid absolute inset-0 z-0 flex flex-col gap-3 py-3 overflow-hidden">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="masonry-row overflow-hidden flex-1"
              data-direction={row.direction}
              data-speed={row.speed}
            >
              <div className="masonry-inner flex gap-3 w-max h-full">
                {/* Rendu 2x pour boucle infinie seamless */}
                {[0, 1].map((copy) =>
                  row.cards.map((card) => {
                    const idx = globalIndex++;
                    return (
                      <PhotoCard
                        key={`${card.id}-${copy}`}
                        w={card.w}
                        src={card.src}
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
          <a
            href="https://photos.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="souvenirs-subtitle mt-8 font-sans text-sm text-charcoal/60 font-light tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:text-charcoal/80 hover:scale-105 inline-block pointer-events-auto"
            style={{
              background: 'oklch(0.97 0.01 80 / 0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid oklch(0.80 0.10 85 / 0.25)',
            }}
          >
            Voir plus
          </a>
        </div>
      </section>

      {/* Photo viewer slider */}
      {viewerIndex !== null && (
        <PhotoViewer initialIndex={viewerIndex} onClose={handleClose} />
      )}
    </>
  );
}
