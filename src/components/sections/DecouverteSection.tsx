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
  srcs?: string[];       // pool de la série — la sphère devient un diaporama en fondu
  alt: string;
  focus?: string;        // object-position — où est le visage (défaut: 'center 30%')
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

interface ChapterMeta {
  roman: string;        // I, II, III
  title: string;        // titre du chapitre
}

interface Verse {
  chapter: ChapterMeta;
  lines: NarrativeLine[];
  accent?: 'title' | 'script-finale';
  photos: PhotoSphereData[];
  spheres: SphereData[];
}

/* ──────────────────────────────────────────
   12 vers — 3 photo-sphères + sphères ambiantes
   ────────────────────────────────────────── */

const VERSES: Verse[] = [
  // 1 — Tout ce qui a été (et qui reste vrai)
  {
    chapter: { roman: 'I', title: 'Tout ce qui a été' },
    accent: 'title',
    lines: [
      { text: 'Eve, depuis que tu es là...', style: 'serif' },
      { text: 'mon quotidien a pris un goût qu’il n’avait pas.', style: 'serif' },
      { text: 'Tes repas, tes gestes, ta voix —', style: 'serif' },
      { text: 'loin des miens, tu as posé un chez-moi sans bruit, sans calcul.', style: 'serif' },
      { text: 'Ton corps contre le mien la nuit,', style: 'sans-italic' },
      { text: 'ta respiration qui apaise tout.', style: 'sans-italic' },
      { text: 'Quand on dormait, j’avais l’illusion d’un début de famille —', style: 'sans-italic' },
      { text: 'oui, oui, une part de moi imaginait déjà nos enfants. Vas-y, moque-toi.', style: 'sans-italic' },
      { text: 'Je t’aime, vraiment, sans moitié.', style: 'serif-bold' },
      { text: 'Je voulais construire, prendre le temps, durer.', style: 'serif' },
    ],
    photos: [
      // Diagonale de lecture : héro vidéo haut-gauche → vidéo bas-droite
      { src: '/images/narrative/bulle-01.mp4', focus: 'center 25%', alt: 'Toi', size: 'w-24 h-24 md:w-52 md:h-52', top: '9%', left: '5%' },
      { src: '/images/narrative/01d.mp4', focus: 'center 25%', alt: 'Moment', size: 'w-20 h-20 md:w-40 md:h-40', bottom: '10%', right: '5%' },
      { src: '/images/narrative/01a.jpg', srcs: ['/images/narrative/01a.jpg', '/images/narrative/01b.jpg', '/images/narrative/01c.jpg'], focus: 'center 25%', alt: 'Sourire', size: 'hidden md:block md:w-32 md:h-32', top: '30%', right: '7%' },
      { src: '/images/narrative/02b.jpg', srcs: ['/images/narrative/02b.jpg', '/images/narrative/02a.jpg', '/images/narrative/02c.jpg'], focus: 'center 20%', alt: 'Douceur', size: 'hidden md:block md:w-32 md:h-32', bottom: '30%', left: '7%' },
      { src: '/images/narrative/03a.jpg', srcs: ['/images/narrative/03a.jpg', '/images/narrative/03c.jpg'], focus: 'center 35%', alt: 'Gestes', size: 'w-14 h-14 md:w-24 md:h-24', top: '7%', right: '22%' },
      { src: '/images/narrative/04b.jpg', focus: 'center 25%', alt: 'Nous', size: 'w-14 h-14 md:w-24 md:h-24', bottom: '7%', left: '24%' },
      { src: '/images/narrative/05c.jpg', srcs: ['/images/narrative/05c.jpg', '/images/narrative/05a.jpg', '/images/narrative/05b.jpg'], focus: 'center 30%', alt: 'Sourire', size: 'hidden md:block md:w-20 md:h-20', top: '46%', left: '3%' },
    ],
    spheres: [
      { size: 'water-sphere-lg', top: '20%', right: '30%' },
      { size: 'water-sphere-md', variant: 'gold', top: '55%', left: '38%' },
      { size: 'water-sphere-sm', bottom: '15%', right: '30%' },
      { size: 'water-sphere-xl', bottom: '5%', left: '2%' },
    ],
  },
  // 2 — L'orage (traversé)
  {
    chapter: { roman: 'II', title: 'L’orage' },
    lines: [
      { text: 'Il y a eu des nœuds.', style: 'sans-italic' },
      { text: 'Tes peurs, les miennes,', style: 'sans-italic' },
      { text: 'ce qu’on portait chacun sans réussir à le dénouer.', style: 'sans-italic' },
      { text: 'Un jour, ça a blessé plus que ça ne rassurait —', style: 'sans-italic' },
      { text: 'pas par ta faute, pas par la mienne.', style: 'serif' },
      { text: 'Deux personnes qui s’aiment ne se rejoignent pas toujours.', style: 'serif' },
      { text: 'Alors on a posé les choses.', style: 'serif' },
      { text: 'Pas un cri, pas un drame —', style: 'serif' },
      { text: 'juste un pas en arrière, fatigué et tendre.', style: 'serif' },
      { text: 'Et dans ce silence-là, une évidence :', style: 'sans-italic' },
      { text: 'loin de toi, rien n’avait la même couleur.', style: 'sans-italic' },
    ],
    photos: [
      // Miroir du chapitre I — l'orage inverse la diagonale
      { src: '/images/narrative/bulle-02.mp4', focus: 'center 25%', alt: 'Ta douceur', size: 'w-24 h-24 md:w-52 md:h-52', top: '9%', right: '5%' },
      { src: '/images/narrative/06c.mp4', focus: 'center 30%', alt: 'Ensemble', size: 'w-20 h-20 md:w-40 md:h-40', bottom: '10%', left: '5%' },
      { src: '/images/narrative/06a.jpg', srcs: ['/images/narrative/06a.jpg', '/images/narrative/06b.jpg'], focus: 'center 30%', alt: 'Câlin', size: 'hidden md:block md:w-32 md:h-32', top: '30%', left: '7%' },
      { src: '/images/narrative/09b.jpg', srcs: ['/images/narrative/09b.jpg', '/images/narrative/09a.jpg', '/images/narrative/09c.jpg'], focus: 'center 18%', alt: 'Chaleur', size: 'hidden md:block md:w-32 md:h-32', bottom: '30%', right: '7%' },
      { src: '/images/narrative/07a.jpg', srcs: ['/images/narrative/07a.jpg', '/images/narrative/07b.jpg'], focus: 'center 20%', alt: 'Coeur', size: 'w-14 h-14 md:w-24 md:h-24', top: '7%', left: '22%' },
      { src: '/images/narrative/08a.jpg', srcs: ['/images/narrative/08a.jpg', '/images/narrative/08b.jpg', '/images/narrative/08c.jpg'], focus: 'center 30%', alt: 'Visage', size: 'w-14 h-14 md:w-24 md:h-24', bottom: '7%', right: '24%' },
      { src: '/images/narrative/10a.jpg', srcs: ['/images/narrative/10a.jpg', '/images/narrative/10b.jpg', '/images/narrative/10c.jpg'], focus: 'center 25%', alt: 'Distance', size: 'hidden md:block md:w-20 md:h-20', top: '46%', right: '3%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', top: '15%', left: '38%' },
      { size: 'water-sphere-md', variant: 'gold', top: '50%', right: '32%' },
      { size: 'water-sphere-sm', top: '60%', left: '4%' },
      { size: 'water-sphere-lg', bottom: '5%', right: '2%' },
    ],
  },
  // 3 — Ce qu'on a choisi
  {
    chapter: { roman: 'III', title: 'Ce qu’on a choisi' },
    lines: [
      { text: 'L’avenir, un temps, je ne le voyais plus.', style: 'serif' },
      { text: 'Puis on est revenus l’un vers l’autre.', style: 'serif' },
      { text: 'Pas pour effacer l’orage — pour ce qu’il nous a appris.', style: 'serif' },
      { text: 'On s’est choisis une deuxième fois,', style: 'sans-italic' },
      { text: 'et une deuxième fois, c’est les yeux ouverts.', style: 'sans-italic' },
      { text: 'Un an déjà. Un an seulement.', style: 'serif' },
      { text: 'Ce qui a plié n’a pas rompu.', style: 'serif-bold' },
      { text: 'Eve, tu comptes, aujourd’hui plus qu’hier.', style: 'script' },
      { text: 'Et je t’aime, encore et toujours.', style: 'script' },
    ],
    photos: [
      // Symétrie retrouvée — elle et lui face à face, le reste en écho
      { src: '/images/narrative/bulle-03.mp4', focus: 'center 22%', alt: 'Toi qui racontes', size: 'hidden md:block md:w-44 md:h-44', top: '26%', left: '4%' },
      { src: '/images/narrative/12b.jpg', focus: 'center 25%', alt: 'Toujours', size: 'hidden md:block md:w-44 md:h-44', top: '26%', right: '4%' },
      { src: '/images/narrative/11a.jpg', focus: '40% center', alt: 'Don', size: 'w-14 h-14 md:w-28 md:h-28', top: '7%', left: '18%' },
      { src: '/images/narrative/11b.jpg', focus: '25% center', alt: 'Énergie', size: 'w-14 h-14 md:w-28 md:h-28', top: '7%', right: '18%' },
      { src: '/images/narrative/11c.jpg', focus: '40% center', alt: 'Ensemble', size: 'hidden md:block md:w-24 md:h-24', bottom: '30%', left: '20%' },
      { src: '/images/narrative/12c.mp4', focus: 'center 18%', alt: 'Nous', size: 'w-18 h-18 md:w-36 md:h-36', bottom: '9%', left: '6%' },
      { src: '/images/narrative/12a.mp4', focus: 'center 18%', alt: 'Promesse', size: 'w-18 h-18 md:w-36 md:h-36', bottom: '9%', right: '6%' },
    ],
    spheres: [
      { size: 'water-sphere-xl', variant: 'gold', top: '20%', right: '32%' },
      { size: 'water-sphere-lg', bottom: '20%', left: '32%' },
      { size: 'water-sphere-md', top: '55%', left: '2%' },
      { size: 'water-sphere-sm', bottom: '5%', right: '38%' },
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
  const ref = useRef<HTMLDivElement>(null);
  const isVideo = data.src.endsWith('.mp4');
  const pool = data.srcs ?? [data.src];

  // Diaporama en fondu croisé — chaque sphère fait tourner sa série de souvenirs
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const imgs = el.querySelectorAll('.sphere-img');
    if (imgs.length < 2) return;

    const cycle = gsap.timeline({ repeat: -1, delay: gsap.utils.random(1, 4) });
    imgs.forEach((img, i) => {
      const next = imgs[(i + 1) % imgs.length];
      cycle
        .to(img, { opacity: 0, duration: 1.3, ease: 'power2.inOut' }, '+=3.4')
        .to(next, { opacity: 1, duration: 1.3, ease: 'power2.inOut' }, '<');
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className={`photo-sphere photo-sphere-border ${data.size}`}
      style={{
        ...(data.top ? { top: data.top } : {}),
        ...(data.bottom ? { bottom: data.bottom } : {}),
        ...(data.left ? { left: data.left } : {}),
        ...(data.right ? { right: data.right } : {}),
      }}
    >
      {isVideo ? (
        <video
          src={data.src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: data.focus ?? 'center 30%' }}
        />
      ) : (
        pool.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={data.alt}
            width={176}
            height={176}
            loading="lazy"
            className="sphere-img absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: data.focus ?? 'center 30%', opacity: i === 0 ? 1 : 0 }}
            sizes="176px"
          />
        ))
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   VerseBlock — un vers avec photos et sphères
   ────────────────────────────────────────── */

function VerseBlock({ verse, index }: { verse: Verse; index: number }) {
  return (
    <div
      className="verse relative py-32 md:py-56 flex items-center justify-center px-5 md:px-6 overflow-hidden min-h-[80vh]"
      data-chapter={index + 1}
    >
      {/* Photo-sphères */}
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

      {/* Texte centré, précédé d'un en-tête chapitre minimal */}
      <div className="relative z-10 flex flex-col items-center gap-3 md:gap-4 max-w-md text-center">
        <div className="chapter-header flex flex-col items-center mb-4 md:mb-6">
          <span
            className="chapter-roman font-serif text-xs md:text-sm tracking-[0.4em] uppercase font-light"
            style={{ color: 'oklch(0.80 0.10 85)' }}
          >
            Chapitre&nbsp;{verse.chapter.roman}
          </span>
          <h3 className="chapter-title font-serif text-xl md:text-2xl text-charcoal/75 font-light italic mt-2 leading-tight">
            {verse.chapter.title}
          </h3>
          <span
            className="chapter-divider mt-3 block h-px w-10"
            style={{ background: 'oklch(0.80 0.10 85 / 0.45)' }}
          />
        </div>

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

    // Parallaxe de profondeur + traversée diagonale — les bulles voyagent au fil du scroll
    el.querySelectorAll('.verse').forEach((verse) => {
      verse.querySelectorAll<HTMLElement>('.photo-sphere').forEach((photo) => {
        const depth = gsap.utils.clamp(0.25, 1, 90 / (photo.offsetWidth || 90));
        const versLInterieur = photo.style.left ? 1 : -1;
        gsap.to(photo, {
          yPercent: -22 * depth,
          xPercent: versLInterieur * 12 * depth,
          ease: 'none',
          scrollTrigger: {
            trigger: verse,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        });
      });
    });

    // ── En-tête de chapitre — apparition douce avec les lignes ──
    el.querySelectorAll('.verse').forEach((verse) => {
      const header = verse.querySelector('.chapter-header');
      if (header) {
        gsap.from(header, {
          opacity: 0, y: 25, filter: 'blur(4px)', ease: 'none',
          scrollTrigger: { trigger: verse, start: 'top 88%', end: 'top 55%', scrub: 1 },
        });
      }
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

      {/* 3 chapitres — parcours de lecture */}
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
          <img
            src="/images/narrative/finale-hero.jpg"
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '22% center' }}
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Orbes derrière le texte */}
        <div className="finale-orb orb orb-rose absolute w-72 h-72 -top-20 right-1/4 opacity-30" />
        <div className="finale-orb orb orb-gold absolute w-48 h-48 bottom-10 -left-12 opacity-25" />

        {/* Texte centré par-dessus — scrim local pour rester lisible sur photo claire */}
        <div className="finale-text relative z-10 min-h-[100dvh] flex flex-col items-center justify-center text-center px-6">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[46%] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 50% 50%, oklch(0.22 0.05 320 / 0.55) 0%, oklch(0.22 0.05 320 / 0.30) 55%, transparent 78%)',
            }}
          />
          <p
            className="relative font-serif text-base md:text-lg text-warm-white/85 font-light italic max-w-sm"
            style={{ textShadow: '0 2px 14px oklch(0.15 0.04 300 / 0.8)' }}
          >
            — Fin du parcours —
          </p>
          <p
            className="relative font-script text-4xl md:text-6xl text-warm-white leading-relaxed mt-4"
            style={{ textShadow: '0 3px 22px oklch(0.15 0.04 300 / 0.85)' }}
          >
            Eve, je t&apos;aime, encore.
          </p>
          <div className="relative w-12 h-px mt-6 bg-warm-white/50" />
          <p
            className="relative font-script text-2xl md:text-3xl text-warm-white/90 mt-4"
            style={{ textShadow: '0 2px 16px oklch(0.15 0.04 300 / 0.8)' }}
          >
            — Asura
          </p>
        </div>
      </div>
    </div>
  );
}
