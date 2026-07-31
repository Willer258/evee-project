'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function ScellementSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top center',
        toggleActions: 'play none none reverse',
      },
    });

    tl.from('.scellement-orb', {
      scale: 0,
      opacity: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.out',
    })
      .from('.scellement-glass', {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 1,
        ease: 'power2.out',
      }, '-=1')
      .from('.scellement-heart', {
        opacity: 0,
        scale: 0.3,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      }, '-=0.6')
      .from('.scellement-title', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
      }, '-=0.6')
      .from('.scellement-subtitle', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.4');
  }, { scope: container });

  return (
    <section
      ref={container}
      className="section-snap relative flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Fond — raccord avec IntimiteSection puis dégradé vers un rosé profond final */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, oklch(0.91 0.04 10) 0%, oklch(0.90 0.05 10) 40%, oklch(0.88 0.06 10) 100%)',
        }}
      />
      <div className="absolute inset-0 grain" />

      {/* Multiple orbes convergentes */}
      <div className="scellement-orb orb orb-rose w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" />
      <div className="scellement-orb orb orb-gold w-[350px] h-[350px] top-1/3 left-1/4 animate-float" style={{ animationDelay: '-2s' }} />
      <div className="scellement-orb orb orb-blush w-[400px] h-[400px] bottom-1/4 right-1/4 animate-float" style={{ animationDelay: '-4s' }} />
      <div className="scellement-orb orb orb-mist w-[300px] h-[300px] top-1/4 right-1/3 animate-float" style={{ animationDelay: '-1s' }} />

      {/* Définition SVG du masque cœur — partagée entre les couches */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="scellement-heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.88 C0.5,0.88 0.04,0.58 0.04,0.28 C0.04,0.10 0.18,0.03 0.30,0.03 C0.40,0.03 0.47,0.09 0.50,0.17 C0.53,0.09 0.60,0.03 0.70,0.03 C0.82,0.03 0.96,0.10 0.96,0.28 C0.96,0.58 0.50,0.88 0.50,0.88 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Bloc central : cœur en débord + panneau glass */}
      <div className="relative z-10 max-w-sm w-full mx-4">
        {/* Cœur — chibi nous-deux, en retrait au-dessus du panneau */}
        <div className="scellement-heart relative mx-auto w-44 h-44 md:w-52 md:h-52 -mb-16 md:-mb-20 z-20">
          {/* Halo doré généreux, pulsant */}
          <div
            className="absolute -inset-12 rounded-full blur-3xl animate-pulse-glow -z-10"
            style={{
              background:
                'radial-gradient(circle, oklch(0.80 0.10 85 / 0.50) 0%, oklch(0.75 0.08 10 / 0.25) 45%, transparent 75%)',
            }}
            aria-hidden="true"
          />

          {/* Wrapper flottant + drop-shadow qui épouse le cœur — et il bat */}
          <div
            className="relative w-full h-full animate-float"
            style={{
              filter:
                'drop-shadow(0 18px 36px oklch(0.55 0.15 10 / 0.32)) drop-shadow(0 6px 14px oklch(0.55 0.15 10 / 0.22))',
            }}
          >
            <div className="relative w-full h-full animate-heartbeat">
            {/* Liseré doré : cœur légèrement plus grand en arrière-plan */}
            <div
              className="absolute -inset-[2px]"
              style={{
                clipPath: 'url(#scellement-heart-clip)',
                background:
                  'linear-gradient(135deg, oklch(0.85 0.10 85) 0%, oklch(0.80 0.10 85) 50%, oklch(0.65 0.12 25) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Cœur image */}
            <div
              className="relative w-full h-full"
              style={{ clipPath: 'url(#scellement-heart-clip)' }}
            >
              <Image
                src="/images/gifts/voeu.png"
                alt="Toi et moi, chibi"
                fill
                sizes="(max-width: 768px) 176px, 208px"
                className="object-cover"
                style={{ objectPosition: 'center 30%' }}
                priority={false}
              />
              {/* Voile lumineux : highlight diagonale + douce vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, oklch(1 0 0 / 0.20) 0%, transparent 35%, transparent 65%, oklch(0.55 0.15 10 / 0.18) 100%)',
                }}
                aria-hidden="true"
              />
              {/* Halo central très subtil */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 55% at 50% 45%, oklch(1 0 0 / 0.10) 0%, transparent 70%)',
                }}
                aria-hidden="true"
              />
            </div>
            </div>
          </div>
        </div>

        {/* Panneau glass — padding-top élargi pour accueillir la pointe du cœur */}
        <div className="scellement-glass glass border-glow rounded-3xl px-8 md:px-12 pt-24 md:pt-28 pb-10 md:pb-14 relative">
          <div className="flex flex-col items-center gap-5 text-center">
            <h2 className="scellement-title font-serif text-4xl md:text-5xl font-light text-charcoal">
              Toi et moi
            </h2>

            {/* Séparateur doré */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-soft/40 to-transparent" />

            <p className="scellement-subtitle font-sans text-lg text-charcoal/50 font-light max-w-xs leading-relaxed">
              Eve, aujourd&apos;hui, demain, et tous les jours d&apos;après.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
