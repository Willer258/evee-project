'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const TARGET_DAY = '03';
const TARGET_MONTH = '08';
const TARGET_YEAR = '2025';

interface DateLockProps {
  onUnlock: () => void;
}

export default function DateLock({ onUnlock }: DateLockProps) {
  const container = useRef<HTMLDivElement>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Orbes flottantes
    tl.from('.lock-orb', {
      scale: 0,
      opacity: 0,
      duration: 2,
      stagger: 0.3,
      ease: 'power2.out',
    })
      .from('.lock-glass-panel', { opacity: 0, scale: 0.95, y: 20, duration: 1 }, '-=1.5')
      .from('.lock-title', { opacity: 0, y: 30, duration: 1 }, '-=0.8')
      .from('.lock-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4')
      .from('.lock-input-group', { opacity: 0, y: 15, duration: 0.8 }, '-=0.3')
      .from('.lock-hint', { opacity: 0, duration: 1 }, '-=0.2');
  }, { scope: container });

  const handleInput = useCallback(
    (
      value: string,
      setter: (v: string) => void,
      maxLength: number,
      nextRef?: React.RefObject<HTMLInputElement | null>,
    ) => {
      const cleaned = value.replace(/\D/g, '').slice(0, maxLength);
      setter(cleaned);
      if (cleaned.length === maxLength && nextRef?.current) {
        nextRef.current.focus();
      }
    },
    [],
  );

  useEffect(() => {
    if (day === TARGET_DAY && month === TARGET_MONTH && year === TARGET_YEAR) {
      setUnlocked(true);
    }
  }, [day, month, year]);

  useEffect(() => {
    if (!unlocked || !container.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => onUnlock(),
    });

    tl.to('.lock-input-group, .lock-hint, .lock-subtitle', {
      opacity: 0,
      y: -10,
      duration: 0.5,
      stagger: 0.1,
    })
      .to('.lock-title', { opacity: 0, y: -20, duration: 0.4 }, '-=0.2')
      .to('.lock-glass-panel', {
        opacity: 0,
        scale: 0.98,
        duration: 0.4,
      }, '-=0.1')
      .fromTo(
        '.lock-recognition',
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2 },
        '-=0.1',
      )
      .to('.lock-orb', {
        scale: 1.5,
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
      }, '-=1')
      .to('.lock-recognition', { opacity: 0, duration: 0.8, delay: 1.8 })
      .to(container.current, { opacity: 0, duration: 0.6 });
  }, [unlocked, onUnlock]);

  return (
    <div
      ref={container}
      className="fixed inset-0 z-50 flex items-center justify-center gradient-romantic grain overflow-hidden"
    >
      {/* Orbes lumineuses flottantes */}
      <div className="lock-orb orb orb-rose w-[500px] h-[500px] top-[10%] left-[10%] animate-float" />
      <div className="lock-orb orb orb-blush w-[400px] h-[400px] bottom-[15%] right-[5%] animate-float" style={{ animationDelay: '-2s' }} />
      <div className="lock-orb orb orb-gold w-[300px] h-[300px] top-[50%] right-[20%] animate-float" style={{ animationDelay: '-4s' }} />
      <div className="lock-orb orb orb-mist w-[350px] h-[350px] bottom-[30%] left-[15%] animate-float" style={{ animationDelay: '-3s' }} />

      {/* Panneau glass central */}
      <div className="lock-glass-panel glass rounded-3xl p-8 md:p-12 mx-4 max-w-sm w-full relative z-10">
        <div className="flex flex-col items-center gap-7 text-center">
          <h1 className="lock-title font-serif text-3xl md:text-4xl font-light tracking-wide text-charcoal leading-tight">
            Un souvenir<br />nous lie
          </h1>

          <p className="lock-subtitle font-sans text-sm md:text-base text-charcoal/50 font-light max-w-xs">
            Tu sais quelle date a tout changé.
          </p>

          {/* Inputs dans un sous-panneau glass-rose */}
          <div className="lock-input-group glass-rose rounded-2xl px-6 py-5 w-full">
            <div className="flex items-center justify-center gap-3">
              <input
                ref={dayRef}
                type="text"
                inputMode="numeric"
                aria-label="Jour"
                placeholder="JJ"
                value={day}
                onChange={(e) => handleInput(e.target.value, setDay, 2, monthRef)}
                className="w-14 h-14 md:w-16 md:h-16 text-center text-xl md:text-2xl font-serif font-light rounded-xl bg-warm-white/50 border border-white/20 text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-rose-soft/40 focus:bg-warm-white/70 transition-all duration-300"
              />
              <span className="text-xl text-charcoal/20 font-light">/</span>
              <input
                ref={monthRef}
                type="text"
                inputMode="numeric"
                aria-label="Mois"
                placeholder="MM"
                value={month}
                onChange={(e) => handleInput(e.target.value, setMonth, 2, yearRef)}
                className="w-14 h-14 md:w-16 md:h-16 text-center text-xl md:text-2xl font-serif font-light rounded-xl bg-warm-white/50 border border-white/20 text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-rose-soft/40 focus:bg-warm-white/70 transition-all duration-300"
              />
              <span className="text-xl text-charcoal/20 font-light">/</span>
              <input
                ref={yearRef}
                type="text"
                inputMode="numeric"
                aria-label="Année"
                placeholder="AAAA"
                value={year}
                onChange={(e) => handleInput(e.target.value, setYear, 4)}
                className="w-20 h-14 md:w-24 md:h-16 text-center text-xl md:text-2xl font-serif font-light rounded-xl bg-warm-white/50 border border-white/20 text-charcoal placeholder:text-charcoal/20 focus:outline-none focus:ring-2 focus:ring-rose-soft/40 focus:bg-warm-white/70 transition-all duration-300"
              />
            </div>
          </div>

          <p className="lock-hint text-xs text-charcoal/25 font-light tracking-wide">
            Le jour où tout a commencé
          </p>
        </div>
      </div>

      {/* Recognition message */}
      <p className="lock-recognition absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-4xl md:text-5xl text-rose-deep opacity-0 whitespace-nowrap z-20 drop-shadow-sm">
        Oui. C&apos;est ce jour-là.
      </p>
    </div>
  );
}
