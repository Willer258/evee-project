'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const PAPILLONS = [
  { size: 26, color: 'oklch(0.72 0.12 10)', left: '12%', delay: 0 },
  { size: 20, color: 'oklch(0.80 0.10 85)', left: '32%', delay: 4 },
  { size: 30, color: 'oklch(0.75 0.08 10)', left: '58%', delay: 8 },
  { size: 18, color: 'oklch(0.85 0.10 85)', left: '76%', delay: 2 },
  { size: 24, color: 'oklch(0.70 0.10 350)', left: '88%', delay: 6 },
];

const PETALES = [
  { size: 10, left: '8%', delay: 0 },
  { size: 8, left: '22%', delay: 3 },
  { size: 12, left: '38%', delay: 7 },
  { size: 9, left: '52%', delay: 1.5 },
  { size: 11, left: '66%', delay: 5 },
  { size: 8, left: '81%', delay: 9 },
  { size: 10, left: '93%', delay: 4 },
];

/* Papillons qui volettent et pétales qui tombent — vie ambiante de la fête */
export default function Papillons() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    // Battement d'ailes — rapide, sinusoïdal
    el.querySelectorAll('.papillon-ailes').forEach((ailes, i) => {
      gsap.to(ailes, {
        scaleX: 0.35,
        duration: 0.16,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.05,
      });
    });

    // Vol — montée lente en traversée sinueuse, en boucle
    el.querySelectorAll<HTMLElement>('.papillon').forEach((p, i) => {
      const monter = () => {
        gsap.fromTo(
          p,
          { y: 0, opacity: 0 },
          {
            y: -(window.innerHeight + 160),
            opacity: 1,
            duration: gsap.utils.random(20, 30),
            ease: 'none',
            delay: i === 0 ? 0 : 0,
            onComplete: monter,
          },
        );
      };
      gsap.delayedCall(PAPILLONS[i]?.delay ?? i * 3, monter);

      // dérive latérale sinueuse
      gsap.to(p, {
        x: `+=${gsap.utils.random(-70, 70)}`,
        duration: gsap.utils.random(2.5, 4),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      // inclinaison douce
      gsap.to(p, {
        rotation: gsap.utils.random(-18, 18),
        duration: gsap.utils.random(2, 3.5),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });

    // Pétales — chute lente tournoyante, en boucle
    el.querySelectorAll<HTMLElement>('.petale').forEach((pt, i) => {
      const tomber = () => {
        gsap.fromTo(
          pt,
          { y: -40, opacity: 0 },
          {
            y: window.innerHeight + 60,
            opacity: 0.9,
            duration: gsap.utils.random(13, 22),
            ease: 'none',
            onComplete: tomber,
          },
        );
      };
      gsap.delayedCall(PETALES[i]?.delay ?? i * 2, tomber);

      gsap.to(pt, {
        x: `+=${gsap.utils.random(-50, 50)}`,
        duration: gsap.utils.random(3, 5),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
      gsap.to(pt, {
        rotation: `+=${gsap.utils.random(180, 420)}`,
        duration: gsap.utils.random(6, 10),
        repeat: -1,
        ease: 'none',
      });
    });
  }, { scope: container });

  return (
    <div
      ref={container}
      className="absolute inset-0 pointer-events-none z-[4] overflow-hidden"
      aria-hidden="true"
    >
      {PAPILLONS.map((pap, i) => (
        <div
          key={`pap-${i}`}
          className="papillon absolute opacity-0"
          style={{ left: pap.left, bottom: -60, width: pap.size, height: pap.size }}
        >
          <svg
            className="papillon-ailes w-full h-full"
            viewBox="0 0 24 24"
            fill={pap.color}
            style={{ filter: `drop-shadow(0 2px 6px ${pap.color.replace(')', ' / 0.35)')})` }}
          >
            {/* Aile gauche */}
            <path d="M11.2 12c-2.4-3.4-5.2-5.2-7.4-4.6-2.3.6-2.4 3.4-.6 5.1 1.3 1.2 3.2 1.6 4.8 1.2-1.5.8-2.3 2.4-1.7 3.8.7 1.6 2.9 1.7 4.2.4.8-.8 1-2 .7-3.9z" />
            {/* Aile droite */}
            <path d="M12.8 12c2.4-3.4 5.2-5.2 7.4-4.6 2.3.6 2.4 3.4.6 5.1-1.3 1.2-3.2 1.6-4.8 1.2 1.5.8 2.3 2.4 1.7 3.8-.7 1.6-2.9 1.7-4.2.4-.8-.8-1-2-.7-3.9z" />
            {/* Corps */}
            <ellipse cx="12" cy="12.5" rx="0.9" ry="3.4" fill="oklch(0.35 0.03 300)" />
          </svg>
        </div>
      ))}

      {PETALES.map((pet, i) => (
        <div
          key={`pet-${i}`}
          className="petale absolute opacity-0"
          style={{
            left: pet.left,
            top: -40,
            width: pet.size,
            height: pet.size * 1.4,
            background: 'linear-gradient(160deg, oklch(0.88 0.06 10), oklch(0.78 0.09 10))',
            borderRadius: '50% 50% 50% 4px',
            boxShadow: '0 1px 4px oklch(0.75 0.08 10 / 0.3)',
          }}
        />
      ))}
    </div>
  );
}
