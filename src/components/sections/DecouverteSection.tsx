'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────
   Types
   ────────────────────────────────────────── */

type LineStyle = 'serif' | 'sans-italic' | 'script' | 'serif-bold';

interface NarrativeLine {
  text: string;
  style?: LineStyle;
}

interface PhotoSphereData {
  src: string;
  alt: string;
  size: string;          // Tailwind: 'w-18 h-18 md:w-36 md:h-36'
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

interface SphereData {
  size: string;           // Tailwind: 'water-sphere-sm' etc.
  variant?: 'gold';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

interface Verse {
  lines: NarrativeLine[];
  accent?: 'title' | 'script-finale';
  photos: PhotoSphereData[];
  spheres: SphereData[];
}

/* ──────────────────────────────────────────
   12 vers — 3 photo-sphères + sphères ambiantes
   ────────────────────────────────────────── */

const VERSES: Verse[] = [
  // 1 — Douce
  {
    accent: 'title',
    lines: [
      { text: 'Quand tu es là...', style: 'serif' },
      { text: 'mon visage sourit sans y penser.', style: 'serif' },
      { text: 'Comme si mon soleil venait de se lever.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/01a.jpg', alt: 'Sourire', size: 'w-20 h-20 md:w-40 md:h-40', top: '8%', left: '6%' },
      { src: '/images/narrative/01b.jpg', alt: 'Regard', size: 'w-16 h-16 md:w-32 md:h-32', top: '12%', right: '10%' },
      { src: '/images/narrative/01c.jpg', alt: 'Nous', size: 'w-24 h-24 md:w-44 md:h-44', bottom: '10%', right: '20%' },
    ],
    spheres: [
      { size: 'water-sphere-lg', top: '5%', right: '35%' },
      { size: 'water-sphere-md', variant: 'gold', bottom: '15%', left: '5%' },
      { size: 'water-sphere-sm', bottom: '30%', right: '8%' },
      { size: 'water-sphere-xl', top: '55%', left: '2%' },
    ],
  },
  // 2 — Tendre
  {
    lines: [
      { text: 'Tu fais taire la solitude.', style: 'serif' },
      { text: 'Tu chasses même la lassitude.', style: 'serif' },
      { text: 'Rien qu\u2019en étant là,', style: 'serif' },
      { text: 'sans même un éclat.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/02a.jpg', alt: 'Présence', size: 'w-18 h-18 md:w-36 md:h-36', top: '10%', left: '15%' },
      { src: '/images/narrative/02b.jpg', alt: 'Douceur', size: 'w-24 h-24 md:w-44 md:h-44', bottom: '8%', left: '8%' },
      { src: '/images/narrative/02c.jpg', alt: 'Silence', size: 'w-16 h-16 md:w-28 md:h-28', top: '20%', right: '8%' },
    ],
    spheres: [
      { size: 'water-sphere-lg', variant: 'gold', top: '60%', right: '4%' },
      { size: 'water-sphere-md', bottom: '5%', right: '30%' },
      { size: 'water-sphere-sm', top: '5%', left: '40%' },
    ],
  },
  // 3 — Sensuelle
  {
    lines: [
      { text: 'Tes gestes, tes habitudes...', style: 'serif' },
      { text: 'ta main qui replace une mèche avec douceur,', style: 'sans-italic' },
      { text: 'tes ongles vérifiés pendant des heures,', style: 'sans-italic' },
      { text: 'tes bras croisés, plein de pudeur.', style: 'sans-italic' },
    ],
    photos: [
      { src: '/images/narrative/03a.jpg', alt: 'Gestes', size: 'w-24 h-24 md:w-44 md:h-44', top: '6%', right: '6%' },
      { src: '/images/narrative/03b.jpg', alt: 'Mains', size: 'w-28 h-28 md:w-32 md:h-32', bottom: '12%', right: '15%' },
      { src: '/images/narrative/03c.jpg', alt: 'Tendresse', size: 'w-32 h-32 md:w-36 md:h-36', bottom: '8%', left: '6%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', top: '10%', left: '3%' },
      { size: 'water-sphere-md', top: '50%', right: '3%' },
      { size: 'water-sphere-sm', variant: 'gold', bottom: '25%', left: '20%' },
    ],
  },
  // 4 — Intense
  {
    lines: [
      { text: 'J\u2019y vais.', style: 'serif-bold' },
      { text: 'Je plonge, sans filet.', style: 'serif-bold' },
      { text: 'C\u2019est plus fort que tout ce que je sais.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/04a.jpg', alt: 'Intensité', size: 'w-20 h-20 md:w-40 md:h-40', top: '8%', left: '8%' },
      { src: '/images/narrative/04b.jpg', alt: 'Passion', size: 'w-18 h-18 md:w-36 md:h-36', top: '15%', right: '5%' },
      { src: '/images/narrative/04c.jpg', alt: 'Force', size: 'w-24 h-24 md:w-44 md:h-44', bottom: '6%', left: '20%' },
    ],
    spheres: [
      { size: 'water-sphere-lg', variant: 'gold', bottom: '10%', right: '5%' },
      { size: 'water-sphere-md', top: '55%', left: '3%' },
      { size: 'water-sphere-sm', top: '5%', right: '30%' },
    ],
  },
  // 5 — Taquine
  {
    lines: [
      { text: 'Tu boudes.', style: 'sans-italic' },
      { text: 'Tes yeux au ciel, ta moue rebelle.', style: 'sans-italic' },
      { text: 'Ta manière de répondre à côté...', style: 'sans-italic' },
      { text: 'Tout ça me plaît, faut l\u2019avouer.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/05a.jpg', alt: 'Moue', size: 'w-24 h-24 md:w-44 md:h-44', top: '5%', left: '5%' },
      { src: '/images/narrative/05b.jpg', alt: 'Yeux', size: 'w-16 h-16 md:w-32 md:h-32', bottom: '15%', left: '12%' },
      { src: '/images/narrative/05c.jpg', alt: 'Sourire', size: 'w-18 h-18 md:w-36 md:h-36', top: '12%', right: '8%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', bottom: '5%', right: '3%' },
      { size: 'water-sphere-md', top: '40%', left: '2%' },
      { size: 'water-sphere-sm', variant: 'gold', top: '8%', right: '35%' },
    ],
  },
  // 6 — Tendre
  {
    lines: [
      { text: 'Même là,', style: 'serif' },
      { text: 'j\u2019ai envie de te prendre dans mes bras.', style: 'serif' },
      { text: 'Te garder contre moi,', style: 'serif' },
      { text: 'malgré tout, malgré toi.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/06a.jpg', alt: 'Câlin', size: 'w-20 h-20 md:w-40 md:h-40', top: '10%', right: '6%' },
      { src: '/images/narrative/06b.jpg', alt: 'Bras', size: 'w-18 h-18 md:w-36 md:h-36', bottom: '10%', left: '5%' },
      { src: '/images/narrative/06c.jpg', alt: 'Ensemble', size: 'w-24 h-24 md:w-44 md:h-44', bottom: '8%', right: '18%' },
    ],
    spheres: [
      { size: 'water-sphere-lg', top: '5%', left: '3%' },
      { size: 'water-sphere-md', variant: 'gold', top: '60%', right: '3%' },
      { size: 'water-sphere-sm', bottom: '20%', left: '30%' },
    ],
  },
  // 7 — Profonde
  {
    lines: [
      { text: 'Derrière \u00AB\u00A0il m\u2019emmerde\u00A0\u00BB...', style: 'sans-italic' },
      { text: 'il y a un c\u0153ur qui se perd.', style: 'serif' },
      { text: 'Une émotion, une vraie.', style: 'serif' },
      { text: 'Que tu caches \u2014 mais que je sais.', style: 'script' },
    ],
    photos: [
      { src: '/images/narrative/07a.jpg', alt: 'Coeur', size: 'w-18 h-18 md:w-36 md:h-36', top: '6%', left: '10%' },
      { src: '/images/narrative/07b.jpg', alt: 'Émotion', size: 'w-24 h-24 md:w-44 md:h-44', top: '10%', right: '5%' },
      { src: '/images/narrative/07c.jpg', alt: 'Vérité', size: 'w-16 h-16 md:w-28 md:h-28', bottom: '12%', left: '8%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', variant: 'gold', bottom: '5%', right: '5%' },
      { size: 'water-sphere-md', top: '50%', left: '2%' },
      { size: 'water-sphere-sm', top: '3%', left: '40%' },
    ],
  },
  // 8 — Intime
  {
    lines: [
      { text: 'Ça me rapproche.', style: 'serif' },
      { text: 'De ton visage, de tes doigts.', style: 'sans-italic' },
      { text: 'De tes mains posées sur moi.', style: 'sans-italic' },
      { text: 'De ta chaleur, tout près de toi.', style: 'sans-italic' },
    ],
    photos: [
      { src: '/images/narrative/08a.jpg', alt: 'Visage', size: 'w-24 h-24 md:w-44 md:h-44', top: '8%', left: '5%' },
      { src: '/images/narrative/08b.jpg', alt: 'Mains', size: 'w-28 h-28 md:w-32 md:h-32', bottom: '10%', right: '8%' },
      { src: '/images/narrative/08c.jpg', alt: 'Chaleur', size: 'w-32 h-32 md:w-36 md:h-36', bottom: '15%', left: '15%' },
    ],
    spheres: [
      { size: 'water-sphere-lg', top: '5%', right: '4%' },
      { size: 'water-sphere-md', variant: 'gold', top: '55%', right: '2%' },
      { size: 'water-sphere-sm', bottom: '5%', left: '3%' },
    ],
  },
  // 9 — Douce
  {
    lines: [
      { text: 'Une sérénité qui m\u2019envahit.', style: 'serif' },
      { text: 'Une chaleur qui m\u2019adoucit.', style: 'serif' },
      { text: 'La tienne.', style: 'serif' },
      { text: 'Celle qui fait que je reviens.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/09a.jpg', alt: 'Sérénité', size: 'w-20 h-20 md:w-40 md:h-40', top: '6%', right: '10%' },
      { src: '/images/narrative/09b.jpg', alt: 'Chaleur', size: 'w-24 h-24 md:w-44 md:h-44', bottom: '6%', left: '8%' },
      { src: '/images/narrative/09c.jpg', alt: 'Retour', size: 'w-16 h-16 md:w-28 md:h-28', top: '15%', left: '5%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', variant: 'gold', bottom: '10%', right: '3%' },
      { size: 'water-sphere-md', top: '45%', left: '2%' },
      { size: 'water-sphere-sm', top: '5%', right: '38%' },
    ],
  },
  // 10 — Mélancolique
  {
    lines: [
      { text: 'Quand je m\u2019éloigne...', style: 'serif' },
      { text: 'c\u2019est un manque doux qui m\u2019accompagne.', style: 'serif' },
      { text: 'Un silence un peu lourd,', style: 'serif' },
      { text: 'en attendant ton retour.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/10a.jpg', alt: 'Distance', size: 'w-18 h-18 md:w-36 md:h-36', top: '10%', left: '8%' },
      { src: '/images/narrative/10b.jpg', alt: 'Manque', size: 'w-20 h-20 md:w-40 md:h-40', top: '8%', right: '6%' },
      { src: '/images/narrative/10c.jpg', alt: 'Attente', size: 'w-24 h-24 md:w-44 md:h-44', bottom: '8%', left: '20%' },
    ],
    spheres: [
      { size: 'water-sphere-lg', bottom: '8%', right: '4%' },
      { size: 'water-sphere-md', top: '50%', left: '3%' },
      { size: 'water-sphere-sm', variant: 'gold', top: '3%', left: '35%' },
    ],
  },
  // 11 — Généreuse
  {
    lines: [
      { text: 'T\u2019offrir ma présence.', style: 'serif' },
      { text: 'Mon énergie, mon essence.', style: 'serif' },
      { text: 'Tout ce que j\u2019ai, sans compter.', style: 'serif' },
      { text: 'Tout ce que je suis, pour toi, entier.', style: 'serif' },
    ],
    photos: [
      { src: '/images/narrative/11a.jpg', alt: 'Don', size: 'w-24 h-24 md:w-44 md:h-44', top: '5%', left: '5%' },
      { src: '/images/narrative/11b.jpg', alt: 'Énergie', size: 'w-16 h-16 md:w-32 md:h-32', bottom: '12%', right: '6%' },
      { src: '/images/narrative/11c.jpg', alt: 'Ensemble', size: 'w-18 h-18 md:w-36 md:h-36', top: '15%', right: '8%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', bottom: '5%', left: '3%' },
      { size: 'water-sphere-md', variant: 'gold', top: '55%', right: '2%' },
      { size: 'water-sphere-sm', top: '8%', right: '35%' },
    ],
  },
  // 12 — Finale
  {
    accent: 'script-finale',
    lines: [
      { text: 'Je suis là.', style: 'script' },
      { text: 'Et je reste.', style: 'script' },
      { text: 'Toujours.', style: 'script' },
    ],
    photos: [
      { src: '/images/narrative/12a.jpg', alt: 'Promesse', size: 'w-20 h-20 md:w-40 md:h-40', top: '8%', left: '10%' },
      { src: '/images/narrative/12b.jpg', alt: 'Toujours', size: 'w-24 h-24 md:w-48 md:h-48', bottom: '10%', right: '8%' },
      { src: '/images/narrative/12c.jpg', alt: 'Nous', size: 'w-18 h-18 md:w-36 md:h-36', top: '12%', right: '12%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', variant: 'gold', top: '5%', right: '3%' },
      { size: 'water-sphere-lg', bottom: '8%', left: '3%' },
      { size: 'water-sphere-md', top: '45%', left: '5%' },
      { size: 'water-sphere-sm', bottom: '25%', right: '25%' },
    ],
  },
];

/* ──────────────────────────────────────────
   Line styling
   ────────────────────────────────────────── */

function lineClass(style: LineStyle, isFirst: boolean, accent?: Verse['accent']): string {
  const base = 'verse-line will-change-transform';

  if (isFirst && accent === 'title')
    return `${base} font-serif text-2xl md:text-3xl text-charcoal/90 font-light tracking-wide`;
  if (accent === 'script-finale')
    return `${base} font-script text-3xl md:text-4xl text-rose-deep`;

  switch (style) {
    case 'serif':
      return `${base} font-serif text-xl md:text-2xl text-charcoal/80 font-light`;
    case 'serif-bold':
      return `${base} font-serif text-xl md:text-2xl text-charcoal/90 font-medium tracking-wide`;
    case 'sans-italic':
      return `${base} font-sans text-lg md:text-xl text-charcoal/60 font-light italic`;
    case 'script':
      return `${base} font-script text-2xl md:text-3xl text-rose-deep`;
    default:
      return `${base} font-serif text-xl md:text-2xl text-charcoal/80 font-light`;
  }
}

/* ──────────────────────────────────────────
   PhotoSphere — photo dans une sphère d'eau
   ────────────────────────────────────────── */

function PhotoSphere({ data }: { data: PhotoSphereData }) {
  const usePlaceholder = true; // TODO: false quand photos prêtes

  return (
    <div
      className={`photo-sphere photo-sphere-border ${data.size}`}
      style={{
        ...(data.top ? { top: data.top } : {}),
        ...(data.bottom ? { bottom: data.bottom } : {}),
        ...(data.left ? { left: data.left } : {}),
        ...(data.right ? { right: data.right } : {}),
      }}
    >
      {usePlaceholder ? (
        <div className="absolute inset-0 flex items-center justify-center bg-blush/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-1 text-charcoal/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="font-sans text-[9px] leading-tight text-center px-1">{data.alt}</span>
          </div>
        </div>
      ) : (
        <Image
          src={data.src}
          alt={data.alt}
          width={176}
          height={176}
          className="absolute inset-0 w-full h-full object-cover"
          sizes="176px"
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   VerseBlock — un vers avec photos et sphères
   ────────────────────────────────────────── */

function VerseBlock({ verse, index }: { verse: Verse; index: number }) {
  return (
    <div className="verse relative py-20 md:py-36 flex items-center justify-center px-5 md:px-6 overflow-hidden">
      {/* Photo-sphères — 3 par vers */}
      {verse.photos.map((photo, i) => (
        <PhotoSphere key={i} data={photo} />
      ))}

      {/* Sphères d'eau ambiantes */}
      {verse.spheres.map((sphere, i) => (
        <div
          key={`s-${i}`}
          className={`water-sphere ${sphere.size}${sphere.variant === 'gold' ? ' water-sphere-gold' : ''}`}
          style={{
            ...(sphere.top ? { top: sphere.top } : {}),
            ...(sphere.bottom ? { bottom: sphere.bottom } : {}),
            ...(sphere.left ? { left: sphere.left } : {}),
            ...(sphere.right ? { right: sphere.right } : {}),
          }}
        />
      ))}

      {/* Texte centré */}
      <div className="relative z-10 flex flex-col items-center gap-3 md:gap-4 max-w-md text-center">
        {verse.lines.map((line, i) => (
          <p key={i} className={lineClass(line.style ?? 'serif', i === 0, verse.accent)}>
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   DecouverteSection — scroll continu + finale cascade
   ────────────────────────────────────────── */

export default function DecouverteSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    /* ═══════════════════════════════════════════
       VERS — scrub animations liées au scroll
       ═══════════════════════════════════════════ */
    el.querySelectorAll('.verse').forEach((verse, idx) => {
      const lines = verse.querySelectorAll('.verse-line');
      const photos = verse.querySelectorAll('.photo-sphere');
      const spheres = verse.querySelectorAll('.water-sphere');

      // Texte — scrub doux, chaque ligne arrive progressivement
      if (lines.length) {
        gsap.from(lines, {
          opacity: 0,
          y: 50,
          filter: 'blur(6px)',
          transformOrigin: 'center center',
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: verse,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        });
      }

      // Photo-sphères — apparition douce
      if (photos.length) {
        gsap.from(photos, {
          scale: 0.3,
          opacity: 0,
          stagger: { each: 0.08, from: 'random' },
          ease: 'none',
          scrollTrigger: {
            trigger: verse,
            start: 'top 80%',
            end: 'top 35%',
            scrub: 1.2,
          },
        });
      }

      // Sphères d'eau
      if (spheres.length) {
        gsap.from(spheres, {
          scale: 0,
          opacity: 0,
          stagger: { each: 0.05, from: 'random' },
          ease: 'none',
          scrollTrigger: {
            trigger: verse,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1.5,
          },
        });
      }
    });

    // Flottement doux des sphères (ambiante, pas liée au scroll)
    el.querySelectorAll('.water-sphere, .photo-sphere').forEach((sphere, i) => {
      gsap.to(sphere, {
        y: `+=${gsap.utils.random(-10, 10)}`,
        x: `+=${gsap.utils.random(-6, 6)}`,
        duration: gsap.utils.random(3, 5),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.06,
      });
    });

    // ═══ FINALE : photo reveal (style Radiance) ═══
    const finale = el.querySelector('.finale-section');
    if (finale) {
      const photoReveal = finale.querySelector('.photo-reveal');
      const finaleText = finale.querySelector('.finale-text');
      const orbs = finale.querySelectorAll('.finale-orb');

      // Photo commence petite avec rounded corners, s'ouvre en plein écran
      if (photoReveal) {
        gsap.fromTo(photoReveal, {
          clipPath: 'inset(30% 25% 30% 25% round 1.5rem)',
          scale: 0.85,
        }, {
          clipPath: 'inset(0% 0% 0% 0% round 0rem)',
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: finale,
            start: 'top 80%',
            end: 'top 0%',
            scrub: 1,
          },
        });
      }

      // Texte apparaît pendant le reveal
      if (finaleText) {
        gsap.from(finaleText, {
          opacity: 0,
          y: 40,
          filter: 'blur(8px)',
          ease: 'none',
          scrollTrigger: {
            trigger: finale,
            start: 'top 40%',
            end: 'top 10%',
            scrub: 1,
          },
        });
      }

      // Orbes
      gsap.from(orbs, {
        opacity: 0,
        scale: 0.4,
        stagger: 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: finale,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
      });
    }
  }, { scope: container });

  return (
    <div ref={container} className="gradient-romantic grain relative">

      {/* 12 vers — flux continu */}
      {VERSES.map((verse, i) => (
        <VerseBlock key={i} verse={verse} index={i} />
      ))}

      {/* Finale : photo reveal (style Radiance) + texte par-dessus */}
      <div className="finale-section relative min-h-[100dvh] overflow-hidden">
        {/* Photo qui s'ouvre — clip-path animé par scroll */}
        <div
          className="photo-reveal absolute inset-0 z-0"
          style={{ clipPath: 'inset(30% 25% 30% 25% round 1.5rem)' }}
        >
          {/* TODO: remplacer par <Image> quand la photo est prête */}
          <div className="absolute inset-0 bg-gradient-to-br from-blush via-rose-soft/30 to-cream flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <span className="font-sans text-sm text-charcoal tracking-widest uppercase">Notre photo</span>
            </div>
          </div>
        </div>

        {/* Orbes derrière le texte */}
        <div className="finale-orb orb orb-rose absolute w-72 h-72 -top-20 right-1/4 opacity-30" />
        <div className="finale-orb orb orb-gold absolute w-48 h-48 bottom-10 -left-12 opacity-25" />

        {/* Texte centré par-dessus */}
        <div className="finale-text relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-6">
          <p className="font-script text-3xl md:text-5xl text-warm-white drop-shadow-lg leading-relaxed">
            Notre histoire continue...
          </p>
          <div className="w-12 h-px mt-5 bg-warm-white/40" />
          <p className="font-serif text-lg md:text-xl text-warm-white/70 font-light mt-4 max-w-sm drop-shadow-md">
            Chaque jour avec toi est une page que j&apos;ai envie d&apos;écrire.
          </p>
        </div>
      </div>
    </div>
  );
}
