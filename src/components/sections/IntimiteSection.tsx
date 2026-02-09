'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LETTRE = [
  { text: 'Eve, ma reine,', style: 'signature' },
  { text: '', style: 'break' },
  { text: 'Si tu lis ces mots, c\u2019est que tu as trouvé le chemin jusqu\u2019ici.', style: 'line' },
  { text: 'Ce petit espace, je l\u2019ai construit pour toi. Rien que pour toi.', style: 'line' },
  { text: '', style: 'break' },
  { text: 'Chaque jour à tes côtés est un cadeau que je ne savais pas possible.', style: 'line' },
  { text: 'Tu as cette façon de rendre le monde plus doux, plus vrai.', style: 'line' },
  { text: '', style: 'break' },
  { text: 'Je ne suis pas parfait, et je ne le serai jamais.', style: 'line' },
  { text: 'Mais ce que je ressens pour toi \u2014 ça, c\u2019est la chose la plus vraie que je connaisse.', style: 'line' },
  { text: '', style: 'break' },
  { text: 'Merci d\u2019être toi, Eve.', style: 'line' },
  { text: 'Merci d\u2019être là.', style: 'line' },
  { text: '', style: 'break' },
  { text: 'Avec tout mon amour,', style: 'closing' },
  { text: 'Asura ton chaton 🐱', style: 'signature' },
];

// Compact cloud mass — tightly packed to form one solid shape
const CLOUD_PUFFS = [
  // ── Row 1 — top crown (tight overlap) ──
  { x: -5, y: -5, size: 280, rotate: 0, opacity: 0.95 },
  { x: 25, y: -12, size: 320, rotate: 10, opacity: 1 },
  { x: 55, y: -8, size: 300, rotate: -6, opacity: 0.95 },
  { x: 80, y: -3, size: 260, rotate: 14, opacity: 0.9 },
  // ── Row 2 ──
  { x: -10, y: 12, size: 260, rotate: 20, opacity: 0.9 },
  { x: 15, y: 10, size: 300, rotate: -15, opacity: 0.95 },
  { x: 45, y: 8, size: 320, rotate: 30, opacity: 1 },
  { x: 72, y: 14, size: 280, rotate: -22, opacity: 0.9 },
  // ── Row 3 ──
  { x: -8, y: 30, size: 270, rotate: -25, opacity: 0.9 },
  { x: 20, y: 28, size: 290, rotate: 40, opacity: 0.95 },
  { x: 50, y: 26, size: 310, rotate: -10, opacity: 1 },
  { x: 76, y: 32, size: 260, rotate: 35, opacity: 0.9 },
  // ── Row 4 ──
  { x: -6, y: 48, size: 280, rotate: 15, opacity: 0.9 },
  { x: 22, y: 45, size: 300, rotate: -35, opacity: 0.95 },
  { x: 48, y: 46, size: 290, rotate: 25, opacity: 1 },
  { x: 74, y: 50, size: 270, rotate: -18, opacity: 0.9 },
  // ── Row 5 ──
  { x: -10, y: 65, size: 260, rotate: -30, opacity: 0.9 },
  { x: 18, y: 62, size: 290, rotate: 20, opacity: 0.95 },
  { x: 46, y: 64, size: 310, rotate: -45, opacity: 1 },
  { x: 72, y: 68, size: 270, rotate: 12, opacity: 0.9 },
  // ── Row 6 — bottom base ──
  { x: -5, y: 82, size: 280, rotate: 8, opacity: 0.95 },
  { x: 25, y: 85, size: 320, rotate: -14, opacity: 1 },
  { x: 55, y: 83, size: 300, rotate: 22, opacity: 0.95 },
  { x: 80, y: 80, size: 260, rotate: -8, opacity: 0.9 },
];

export default function IntimiteSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    // ── Entrance — scrub-linked so it always works ──
    gsap.from('.intimite-cloud', {
      scale: 0.3,
      opacity: 0,
      stagger: { each: 0.02, from: 'center' },
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      },
    });

    gsap.from('.intimite-title', {
      opacity: 0, y: 25, filter: 'blur(6px)', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 70%', end: 'top 35%', scrub: 1 },
    });

    gsap.from('.intimite-divider', {
      scaleX: 0, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 65%', end: 'top 35%', scrub: 1 },
    });

    gsap.from('.lettre-line', {
      opacity: 0, y: 10, stagger: 0.03, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 55%', end: 'top 15%', scrub: 1 },
    });

    gsap.from('.lettre-signature', {
      opacity: 0, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 40%', end: 'top 10%', scrub: 1 },
    });

    // ── Cloud breathing — très doux, presque endormi ──
    el.querySelectorAll<HTMLElement>('.intimite-cloud').forEach((puff, i) => {
      gsap.to(puff, {
        scale: 1.03,
        duration: 5 + (i % 4) * 1.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: (i % 6) * 0.8,
      });
    });
  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative"
    >
      {/* ── Fond — rosé continu, raccord haut (Connexion) et bas (Scellement) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, oklch(0.92 0.04 10) 0%, oklch(0.90 0.05 10) 50%, oklch(0.91 0.04 10) 100%)',
        }}
      />
      <div className="grain absolute inset-0 pointer-events-none z-[3]" />

      {/* ── Orbes ── */}
      <div className="orb orb-rose w-[500px] h-[500px] top-10 left-1/2 -translate-x-1/2 opacity-30" />
      <div className="orb orb-mist w-[350px] h-[350px] bottom-20 -left-20 opacity-20" />
      <div className="orb orb-gold w-[250px] h-[250px] top-1/3 -right-16 opacity-15" />

      {/* ── Contenu ── */}
      <div className="relative z-10 flex flex-col items-center px-4 py-20 md:py-28 min-h-screen justify-center">
        {/* Cloud mass + letter */}
        <div className="cloud-mass relative w-full max-w-[340px] md:max-w-[520px]">
          {/* ── Compact cloud layer ── */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            {CLOUD_PUFFS.map((puff, i) => (
              <img
                key={i}
                src="/images/cloud.png"
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="intimite-cloud absolute will-change-transform"
                style={{
                  width: `clamp(${puff.size * 0.55}px, ${puff.size * 0.15}vw + ${puff.size * 0.35}px, ${puff.size}px)`,
                  height: `clamp(${puff.size * 0.55}px, ${puff.size * 0.15}vw + ${puff.size * 0.35}px, ${puff.size}px)`,
                  left: `${puff.x}%`,
                  top: `${puff.y}%`,
                  transform: `rotate(${puff.rotate}deg)`,
                  opacity: puff.opacity,
                }}
              />
            ))}
          </div>

          {/* ── Letter on top of clouds ── */}
          <div className="relative z-10 px-8 py-14 md:px-16 md:py-20 text-center">
            <h2 className="intimite-title font-script text-4xl md:text-5xl text-rose-deep drop-shadow-sm">
              Pour toi, Eve
            </h2>

            <div className="intimite-divider h-px w-16 mx-auto mt-5 mb-8 bg-gradient-to-r from-transparent via-gold-soft/40 to-transparent" />

            <div className="flex flex-col gap-0.5">
              {LETTRE.map((item, i) => {
                if (item.style === 'break') {
                  return <div key={i} className="lettre-line h-4" />;
                }
                if (item.style === 'signature') {
                  return (
                    <p
                      key={i}
                      className="lettre-signature font-script text-xl md:text-2xl text-rose-deep mt-1"
                    >
                      {item.text}
                    </p>
                  );
                }
                if (item.style === 'closing') {
                  return (
                    <p
                      key={i}
                      className="lettre-signature font-serif text-base md:text-lg text-charcoal/60 font-light italic mt-2"
                    >
                      {item.text}
                    </p>
                  );
                }
                return (
                  <p
                    key={i}
                    className="lettre-line font-serif text-sm md:text-base text-charcoal/70 font-light leading-relaxed"
                  >
                    {item.text}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
