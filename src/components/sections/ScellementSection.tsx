'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

      {/* Panneau glass central */}
      <div className="scellement-glass glass border-glow rounded-3xl p-10 md:p-14 relative z-10 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Heart avec glow animé */}
          <div className="scellement-heart relative">
            <span className="text-5xl md:text-6xl animate-heartbeat inline-block">❤️</span>
            <div className="absolute inset-0 w-full h-full rounded-full bg-rose-soft/20 blur-xl animate-pulse-glow -z-10" />
          </div>

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
    </section>
  );
}
