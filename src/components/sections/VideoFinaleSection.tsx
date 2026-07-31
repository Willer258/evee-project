'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VIDEOS = [
  '/videos/finale-1.mp4',
  '/videos/finale-2.mp4',
  '/videos/finale-3.mp4',
  '/videos/finale-4.mp4',
  '/videos/finale-5.mp4',
  '/videos/finale-6.mp4',
  '/videos/finale-7.mp4',
  '/videos/finale-8.mp4',
  '/videos/finale-9.mp4',
  '/videos/finale-10.mp4',
  '/videos/finale-11.mp4',
  '/videos/finale-12.mp4',
  '/videos/finale-13.mp4',
  '/videos/finale-14.mp4',
  '/videos/finale-15.mp4',
  '/videos/finale-16.mp4',
  '/videos/finale-17.mp4',
  '/videos/finale-18.mp4',
];

const VIDEO_MS = 6000;   // 6s par vidéo
const FINALE_MS = 8000;  // la carte finale respire plus longtemps
const FINALE_INDEX = VIDEOS.length; // index virtuel de la carte de conclusion

/* Une seule phrase, déroulée sur tout le cycle */
const PHRASES = [
  { from: 0, text: 'Un an de nous.' },
  { from: 5, text: 'Chaque éclat de rire,' },
  { from: 10, text: 'chaque instant volé,' },
  { from: 14, text: 'et tous ceux qui viennent.' },
];

function phraseIndexFor(video: number): number {
  let idx = 0;
  PHRASES.forEach((p, i) => {
    if (video >= p.from) idx = i;
  });
  return idx;
}

export default function VideoFinaleSection() {
  const container = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const setVideoRef = useCallback((el: HTMLVideoElement | null, i: number) => {
    videoRefs.current[i] = el;
  }, []);

  const goTo = useCallback((dir: 1 | -1) => {
    setCurrent((prev) => (prev + dir + FINALE_INDEX + 1) % (FINALE_INDEX + 1));
  }, []);

  // ── Avance automatique (timeout par item → un tap manuel remet le compteur à zéro)
  useEffect(() => {
    if (!isInView) return;
    const delay = current === FINALE_INDEX ? FINALE_MS : VIDEO_MS;
    const id = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % (FINALE_INDEX + 1));
    }, delay);
    return () => clearTimeout(id);
  }, [current, isInView]);

  // ── Transitions entre couches (crossfade + ken burns continu)
  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const layers = el.querySelectorAll<HTMLElement>('.video-layer');
    const finaleCard = el.querySelector<HTMLElement>('.finale-card');

    if (current === FINALE_INDEX) {
      // Conclusion — tout fond vers la carte
      layers.forEach((layer) => {
        gsap.killTweensOf(layer);
        gsap.to(layer, { opacity: 0, scale: 1.1, duration: 1.6, ease: 'power2.inOut' });
      });
      if (finaleCard) {
        gsap.killTweensOf(finaleCard);
        gsap.fromTo(finaleCard,
          { opacity: 0 },
          { opacity: 1, duration: 1.8, ease: 'power2.inOut' },
        );
        gsap.fromTo(finaleCard.querySelectorAll('.finale-card-item'),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 1.1, stagger: 0.35, delay: 0.7, ease: 'power2.out' },
        );
      }
      videoRefs.current.forEach((v) => v?.pause());
    } else {
      if (finaleCard) gsap.to(finaleCard, { opacity: 0, duration: 0.8, ease: 'power2.in' });

      layers.forEach((layer, i) => {
        gsap.killTweensOf(layer);
        if (i === current) {
          // Entrant : dézoom d'accueil puis dérive lente (ken burns)
          const tl = gsap.timeline();
          tl.fromTo(layer,
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1.01, duration: 1.4, ease: 'power2.out' },
          ).to(layer, { scale: 1.055, duration: 5, ease: 'sine.inOut' });
        } else {
          gsap.to(layer, { opacity: 0, scale: 1.12, duration: 1.4, ease: 'power2.in' });
        }
      });

      // Lecture de l'actif, pause des autres, préchargement du suivant
      videoRefs.current.forEach((video, i) => {
        if (!video) return;
        if (i === current) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
      const next = videoRefs.current[(current + 1) % VIDEOS.length];
      if (next && next.preload !== 'auto') next.preload = 'auto';
    }

    // Fil de progression — se remplit sur la durée de la vidéo courante
    const bar = progressRef.current;
    if (bar) {
      gsap.killTweensOf(bar);
      if (current === FINALE_INDEX || !isInView) {
        gsap.to(bar, { scaleX: 0, opacity: 0, duration: 0.4, ease: 'power2.in' });
      } else {
        gsap.set(bar, { opacity: 1 });
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: VIDEO_MS / 1000, ease: 'none' });
      }
    }
  }, [current, isInView]);

  // ── Visibilité de la section
  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => setIsInView(true),
      onLeave: () => setIsInView(false),
      onEnterBack: () => setIsInView(true),
      onLeaveBack: () => setIsInView(false),
    });

    gsap.from('.video-section-content', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 70%',
        end: 'top 30%',
        scrub: 1,
      },
    });
  }, { scope: container });

  const phraseIdx = current === FINALE_INDEX ? -1 : phraseIndexFor(current);

  return (
    <section
      ref={container}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, oklch(0.88 0.06 10) 0%, oklch(0.82 0.06 5) 15%, oklch(0.65 0.06 355) 40%, oklch(0.40 0.05 330) 70%, oklch(0.25 0.04 300) 100%)',
      }}
    >
      {/* Couches vidéo empilées plein écran */}
      <div className="video-section-content absolute inset-0">
        {VIDEOS.map((src, i) => (
          <div
            key={i}
            className="video-layer absolute inset-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <video
              ref={(el) => setVideoRef(el, i)}
              src={src}
              muted
              playsInline
              loop
              preload="none"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Voile sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>

      {/* ── Carte de conclusion — le point final du site ── */}
      <div
        className="finale-card absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6 opacity-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, oklch(0.45 0.06 340) 0%, oklch(0.30 0.05 320) 55%, oklch(0.22 0.04 300) 100%)',
        }}
      >
        <div className="orb orb-rose w-[400px] h-[400px] top-[12%] -left-24 opacity-25" />
        <div className="orb orb-gold w-[280px] h-[280px] bottom-[18%] -right-16 opacity-20" />

        <p className="finale-card-item font-serif text-4xl md:text-6xl font-light tracking-[0.08em] text-warm-white/95">
          03.08.2025
        </p>
        <div className="finale-card-item h-px w-16 bg-gradient-to-r from-transparent via-gold-soft/60 to-transparent" />
        <p className="finale-card-item font-script text-3xl md:text-4xl text-gold-soft drop-shadow-sm">
          et tous les jours d&rsquo;après…
        </p>
      </div>

      {/* ── Phrase narrative — se déroule au fil des vidéos ── */}
      {phraseIdx >= 0 && (
        <p
          key={phraseIdx}
          className="animate-fade-in-up absolute bottom-[12%] inset-x-0 z-20 text-center px-8 font-script text-3xl md:text-4xl text-warm-white/90 pointer-events-none"
          style={{ textShadow: '0 2px 18px oklch(0.20 0.04 300 / 0.55)', animationDelay: '0.5s' }}
        >
          {PHRASES[phraseIdx].text}
        </p>
      )}

      {/* ── Fil de progression doré ── */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] z-20 pointer-events-none">
        <div
          ref={progressRef}
          className="h-full w-full origin-left"
          style={{ background: 'oklch(0.80 0.10 85 / 0.45)', transform: 'scaleX(0)' }}
        />
      </div>

      {/* ── Zones de navigation silencieuses (tap gauche / droite) ── */}
      <button
        type="button"
        aria-label="Vidéo précédente"
        onClick={() => goTo(-1)}
        className="absolute inset-y-0 left-0 w-[35%] z-[15] cursor-pointer"
      />
      <button
        type="button"
        aria-label="Vidéo suivante"
        onClick={() => goTo(1)}
        className="absolute inset-y-0 right-0 w-[65%] z-[15] cursor-pointer"
      />

      {/* Fondu rosé en haut — raccord avec Scellement */}
      <div
        className="absolute inset-x-0 top-0 h-[40%] pointer-events-none z-20"
        style={{
          background: 'linear-gradient(180deg, oklch(0.88 0.06 10) 0%, oklch(0.88 0.06 10 / 0.6) 40%, transparent 100%)',
        }}
      />

      {/* Grain */}
      <div className="grain absolute inset-0 pointer-events-none z-30" />
    </section>
  );
}
