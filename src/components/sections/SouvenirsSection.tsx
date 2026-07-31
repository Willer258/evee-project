'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CircularGallery } from '@/components/ui/circular-gallery';

gsap.registerPlugin(ScrollTrigger);

// Lignes horizontales — alternance gauche / droite
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
      { id: 'd8', w: 210, src: '/images/souvenirs/souvenir-29.jpg' },
    ],
  },
];

const ALL_CARDS = ROWS.flatMap((row) => row.cards);
const GALLERY_IMAGES = ALL_CARDS.map((c) => ({ src: c.src }));

interface PhotoCardProps {
  w: number;
  src: string;
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
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-hover:shadow-lg"
        style={{ border: '1px solid oklch(1 0 0 / 0.2)' }}
      />
    </button>
  );
}

/* ──────────────────────────────────────────
   GalleryViewer — overlay plein écran avec carrousel circulaire 3D
   ────────────────────────────────────────── */

function GalleryViewer({
  initialIndex,
  onClose,
}: {
  initialIndex: number;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;
    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
    gsap.fromTo(
      panel,
      { scale: 0.9, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.08 },
    );
  }, []);

  const handleClose = useCallback(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    const tl = gsap.timeline({ onComplete: onClose });
    if (panel) tl.to(panel, { scale: 0.95, opacity: 0, y: 12, duration: 0.25, ease: 'power2.in' }, 0);
    if (overlay) tl.to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.05);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
      onClick={handleClose}
    >
      {/* Voile rosé profond — le monde du site, pas une lightbox */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'oklch(0.28 0.04 340 / 0.92)' }}
      />

      {/* Orbes oniriques */}
      <div className="orb orb-rose w-[420px] h-[420px] top-[8%] -left-28 opacity-25" />
      <div className="orb orb-gold w-[300px] h-[300px] bottom-[12%] -right-20 opacity-20" />
      <div className="orb orb-mist w-[260px] h-[260px] top-[55%] left-[6%] opacity-15" />

      {/* Vignette douce */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, oklch(0.20 0.03 320 / 0.45) 100%)',
        }}
      />
      <div className="grain absolute inset-0 pointer-events-none" />

      {/* Panneau carrousel */}
      <div
        ref={panelRef}
        className="relative z-10 flex flex-col items-center gap-5 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CircularGallery
          images={GALLERY_IMAGES}
          initialIndex={initialIndex}
          autoplay
          intervalMs={5000}
        />
        <p className="font-script text-2xl md:text-3xl text-warm-white/55 drop-shadow-sm">
          Le temps suspendu
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        aria-label="Fermer la galerie"
        className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center text-warm-white/65 hover:text-warm-white active:scale-95 transition-all duration-200"
        style={{ background: 'oklch(0.25 0.01 270 / 0.45)', backdropFilter: 'blur(8px)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────
   Section principale
   ────────────────────────────────────────── */

export default function SouvenirsSection() {
  const container = useRef<HTMLElement>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const marqueeCleanup = useRef<(() => void) | null>(null);

  useEffect(() => () => marqueeCleanup.current?.(), []);

  const handleCardClick = useCallback((cardId: string) => {
    const idx = ALL_CARDS.findIndex((c) => c.id === cardId);
    if (idx !== -1) setViewerIndex(idx);
  }, []);

  const handleVoirPlus = useCallback(() => {
    setViewerIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setViewerIndex(null);
  }, []);

  useGSAP(
    () => {
      const el = container.current;
      if (!el) return;

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

      const marqueeTweens: gsap.core.Tween[] = [];
      el.querySelectorAll<HTMLElement>('.masonry-row').forEach((row) => {
        const inner = row.querySelector<HTMLElement>('.masonry-inner');
        if (!inner) return;

        const direction = row.dataset.direction;
        const speed = parseFloat(row.dataset.speed || '30');
        const totalWidth = inner.scrollWidth / 2;

        if (direction === 'left') {
          gsap.set(inner, { x: 0 });
          marqueeTweens.push(gsap.to(inner, { x: -totalWidth, duration: speed, ease: 'none', repeat: -1 }));
        } else {
          gsap.set(inner, { x: -totalWidth });
          marqueeTweens.push(gsap.to(inner, { x: 0, duration: speed, ease: 'none', repeat: -1 }));
        }
      });

      // Les rangées répondent à la vitesse du scroll — accélèrent, puis se calment
      let marqueeBoost = 1;
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          marqueeBoost = gsap.utils.clamp(1, 3.2, 1 + Math.abs(self.getVelocity()) / 1200);
        },
      });
      const smoothMarquee = () => {
        marqueeTweens.forEach((t) => {
          t.timeScale(gsap.utils.interpolate(t.timeScale(), marqueeBoost, 0.08));
        });
        marqueeBoost += (1 - marqueeBoost) * 0.04;
      };
      gsap.ticker.add(smoothMarquee);
      marqueeCleanup.current = () => gsap.ticker.remove(smoothMarquee);

      const grid = el.querySelector('.masonry-grid');
      if (grid) {
        gsap.from(grid, {
          opacity: 0, scale: 0.97, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 40%', scrub: 1 },
        });
      }
    },
    { scope: container },
  );

  let globalIndex = 0;

  return (
    <>
      <section ref={container} className="relative min-h-[100dvh] overflow-hidden">
        {/* Fond */}
        <div className="absolute inset-0 gradient-romantic" />

        {/* Grain */}
        <div className="absolute inset-0 grain pointer-events-none z-30" />

        {/* Masonry grid horizontal — défilement continu en bandes */}
        <div className="masonry-grid absolute inset-0 z-0 flex flex-col gap-3 py-3 overflow-hidden">
          {ROWS.map((row, i) => (
            <div
              key={i}
              className="masonry-row overflow-hidden flex-1"
              data-direction={row.direction}
              data-speed={row.speed}
            >
              <div className="masonry-inner flex gap-3 w-max h-full">
                {[0, 1].map((copy) =>
                  row.cards.map((card) => {
                    const idx = globalIndex++;
                    return (
                      <PhotoCard
                        key={`${card.id}-${copy}-${idx}`}
                        w={card.w}
                        src={card.src}
                        onClick={() => handleCardClick(card.id)}
                      />
                    );
                  }),
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
          <button
            type="button"
            onClick={handleVoirPlus}
            className="souvenirs-subtitle mt-8 font-sans text-sm text-charcoal/60 font-light tracking-wide px-6 py-2.5 rounded-full transition-all duration-300 hover:text-charcoal/80 hover:scale-105 active:scale-[0.97] inline-block pointer-events-auto cursor-pointer"
            style={{
              background: 'oklch(0.97 0.01 80 / 0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid oklch(0.80 0.10 85 / 0.25)',
            }}
          >
            Voir plus
          </button>
        </div>
      </section>

      {/* Viewer plein écran : carrousel circulaire 3D */}
      {viewerIndex !== null && <GalleryViewer initialIndex={viewerIndex} onClose={handleClose} />}
    </>
  );
}
