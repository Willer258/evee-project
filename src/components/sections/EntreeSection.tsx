'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const COLUMN_CARDS = [
  [
    { h: 'aspect-[3/4]', label: 'nous' },
    { h: 'aspect-[4/5]', label: 'rire' },
    { h: 'aspect-[2/3]', label: 'soleil' },
    { h: 'aspect-[3/4]', label: 'douceur' },
    { h: 'aspect-[4/5]', label: 'toujours' },
    { h: 'aspect-[3/5]', label: 'toi' },
  ],
  [
    { h: 'aspect-[4/5]', label: 'premier' },
    { h: 'aspect-[3/4]', label: 'regard' },
    { h: 'aspect-[3/5]', label: 'plage' },
    { h: 'aspect-[4/5]', label: 'soir' },
    { h: 'aspect-[2/3]', label: 'café' },
    { h: 'aspect-[3/4]', label: 'main' },
  ],
  [
    { h: 'aspect-[2/3]', label: 'secret' },
    { h: 'aspect-[4/5]', label: 'baiser' },
    { h: 'aspect-[3/4]', label: 'nuit' },
    { h: 'aspect-[3/5]', label: 'rêve' },
    { h: 'aspect-[4/5]', label: 'chez nous' },
    { h: 'aspect-[2/3]', label: 'matin' },
  ],
  [
    { h: 'aspect-[3/5]', label: 'voyage' },
    { h: 'aspect-[3/4]', label: 'musique' },
    { h: 'aspect-[4/5]', label: 'silence' },
    { h: 'aspect-[2/3]', label: 'promesse' },
    { h: 'aspect-[3/4]', label: 'demain' },
    { h: 'aspect-[4/5]', label: 'ensemble' },
  ],
  [
    { h: 'aspect-[3/4]', label: 'sourire' },
    { h: 'aspect-[2/3]', label: 'étoiles' },
    { h: 'aspect-[4/5]', label: 'chaleur' },
    { h: 'aspect-[3/5]', label: 'tendresse' },
    { h: 'aspect-[3/4]', label: 'joie' },
    { h: 'aspect-[4/5]', label: 'avenir' },
  ],
  [
    { h: 'aspect-[4/5]', label: 'instant' },
    { h: 'aspect-[3/4]', label: 'lumière' },
    { h: 'aspect-[3/5]', label: 'refuge' },
    { h: 'aspect-[4/5]', label: 'bonheur' },
    { h: 'aspect-[2/3]', label: 'cœur' },
    { h: 'aspect-[3/4]', label: 'infini' },
  ],
];

const COLUMN_SPEEDS = [16, 22, 28, 18, 25, 20];

// Cloud puffs — inspired by CSS 3D Clouds technique (layered textures)
const CLOUD_PUFFS = [
  // Top row — the fluffy crown
  { left: '-8%', top: '-30%', size: 220, rotate: 0, opacity: 0.75 },
  { left: '22%', top: '-40%', size: 280, rotate: 18, opacity: 0.85 },
  { left: '52%', top: '-32%', size: 240, rotate: -12, opacity: 0.7 },
  // Sides
  { left: '-22%', top: '10%', size: 200, rotate: 35, opacity: 0.5 },
  { left: '78%', top: '15%', size: 200, rotate: -28, opacity: 0.5 },
  // Bottom
  { left: '-5%', top: '65%', size: 220, rotate: 12, opacity: 0.55 },
  { left: '35%', top: '75%', size: 260, rotate: -6, opacity: 0.6 },
  { left: '62%', top: '62%', size: 210, rotate: 30, opacity: 0.5 },
  // Inner fill — adds density
  { left: '8%', top: '-10%', size: 180, rotate: 50, opacity: 0.35 },
  { left: '50%', top: '40%', size: 190, rotate: -40, opacity: 0.3 },
];

function PhotoCard({ h, label }: { h: string; label: string }) {
  return (
    <div className="glass-rose rounded-2xl overflow-hidden flex-shrink-0 w-full">
      <div className={`${h} w-full bg-blush/40 flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-rose-soft/8 blur-2xl" />
        <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gold-soft/5 blur-xl" />
        <span className="text-[10px] text-charcoal/20 font-sans font-light uppercase tracking-[0.2em] select-none">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function EntreeSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cols = container.current?.querySelectorAll('.masonry-col');
    if (!cols) return;

    cols.forEach((col, i) => {
      const cards = col.children;
      if (!cards.length) return;

      const halfCount = cards.length / 2;
      let totalHeight = 0;
      for (let j = 0; j < halfCount; j++) {
        totalHeight += (cards[j] as HTMLElement).offsetHeight + 12;
      }

      gsap.to(col, {
        y: -totalHeight,
        duration: totalHeight / (COLUMN_SPEEDS[i] ?? 20),
        ease: 'none',
        repeat: -1,
        modifiers: {
          y: gsap.utils.unitize((y: number) => {
            return parseFloat(String(y)) % totalHeight;
          }),
        },
      });
    });

    // ── Orchestrated hero entrance ──
    const tl = gsap.timeline({ delay: 0.3 });

    // 1. Orbs fade in from nothing
    tl.from('.hero-orb', {
      scale: 0,
      opacity: 0,
      duration: 2,
      stagger: 0.2,
      ease: 'power2.out',
    })

    // 2. Cloud puffs materialize — each one blooms from center
    .from('.cloud-puff', {
      scale: 0,
      opacity: 0,
      duration: 1.2,
      stagger: {
        each: 0.08,
        from: 'center',
      },
      ease: 'back.out(1.4)',
    }, '-=1.2')

    // 3. Title emerges from within the cloud
    .from('.hero-title', {
      opacity: 0,
      y: 30,
      scale: 0.9,
      filter: 'blur(8px)',
      duration: 1.2,
      ease: 'power3.out',
    }, '-=0.4')

    // 4. Gold divider stretches
    .from('.hero-divider', {
      scaleX: 0,
      duration: 0.8,
      ease: 'power2.inOut',
    }, '-=0.5')

    // 5. Subtitle floats up
    .from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.3')

    // 6. Scroll hint appears
    .from('.hero-scroll-hint', {
      opacity: 0,
      y: 10,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.2');

    // ── Orbs breathing loop ──
    gsap.to('.hero-orb', {
      scale: 1.08,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: { each: 1.5 },
    });

    // ── Cloud puffs breathing — each puff drifts subtly ──
    const puffs = container.current?.querySelectorAll('.cloud-puff');
    puffs?.forEach((puff, i) => {
      gsap.to(puff, {
        y: gsap.utils.random(-8, 8),
        x: gsap.utils.random(-5, 5),
        scale: 1 + gsap.utils.random(0.02, 0.08),
        duration: gsap.utils.random(3, 6),
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 3 + i * 0.3, // starts after entrance completes
      });
    });

  }, { scope: container });

  return (
    <section
      ref={container}
      className="section-snap relative flex items-center justify-center overflow-hidden"
    >
      {/* ── Layer 0: Base gradient ── */}
      <div className="absolute inset-0 gradient-romantic" />

      {/* ── Layer 1: Orbes lumineuses ── */}
      <div className="hero-orb orb orb-rose w-[550px] h-[550px] -top-32 -left-32" />
      <div className="hero-orb orb orb-blush w-[450px] h-[450px] bottom-10 -right-24" />
      <div className="hero-orb orb orb-gold w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="hero-orb orb orb-mist w-[400px] h-[400px] top-20 right-10" />

      {/* ── Layer 2: Masonry wall — DIAGONAL, full bleed ── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ transform: 'rotate(-12deg) scale(1.35)', transformOrigin: 'center center' }}
      >
        <div className="flex gap-3 w-full h-full px-1">
          {COLUMN_CARDS.map((cards, colIdx) => (
            <div
              key={colIdx}
              className={`flex-1 overflow-hidden h-full min-w-0 ${colIdx >= 4 ? 'hidden md:block' : ''}`}
            >
              <div className="masonry-col flex flex-col gap-3 will-change-transform">
                {/* Doubled for seamless loop */}
                {[...cards, ...cards].map((card, i) => (
                  <PhotoCard key={i} h={card.h} label={card.label} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Layer 3: Vignette radiale légère — laisse le mur visible ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 50% 45% at 50% 50%, oklch(0.97 0.01 80 / 0.65) 0%, oklch(0.97 0.01 80 / 0.25) 60%, transparent 100%)',
        }}
      />

      {/* ── Layer 4: Gradient fade edges ── */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream/95 to-transparent pointer-events-none z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream/95 to-transparent pointer-events-none z-[2]" />

      {/* ── Layer 5: Grain overlay ── */}
      <div className="grain absolute inset-0 pointer-events-none z-[3]" />

      {/* ── Layer 6: Cloud glass panel ── */}
      <div className="relative z-[4] flex flex-col items-center px-4">
        <div className="hero-glass relative max-w-md w-full scale-[0.7] md:scale-100">
          {/* Cloud texture layers — CSS 3D Clouds technique */}
          {CLOUD_PUFFS.map((puff, i) => (
            <img
              key={i}
              src="/images/cloud.png"
              alt=""
              aria-hidden="true"
              className="cloud-puff"
              style={{
                width: puff.size,
                height: puff.size,
                left: puff.left,
                top: puff.top,
                transform: `rotate(${puff.rotate}deg)`,
                opacity: puff.opacity,
              }}
            />
          ))}

          {/* Text content — floats on the cloud */}
          <div className="relative z-10 px-10 py-14 md:px-16 md:py-16 text-center">
            <h2 className="hero-title font-serif text-5xl md:text-7xl font-light text-charcoal tracking-wide leading-[1.1]">
              Bienvenue
            </h2>

            <div className="hero-divider h-px w-20 mx-auto mt-6 mb-5 bg-gradient-to-r from-transparent via-gold-soft/40 to-transparent" />

            <p className="hero-subtitle font-sans text-base md:text-lg text-charcoal/50 font-light tracking-wide">
              Dans notre petit monde.
            </p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint mt-10 flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-charcoal/15 to-charcoal/5" />
          <span className="text-[10px] text-charcoal/25 font-sans font-light uppercase tracking-[0.3em]">
            scroll
          </span>
        </div>
      </div>
    </section>
  );
}
