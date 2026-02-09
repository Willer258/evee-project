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
];

const INTERVAL = 6000; // 6s per video

export default function VideoFinaleSection() {
  const container = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track which video layer is on top
  const setVideoRef = useCallback((el: HTMLVideoElement | null, i: number) => {
    videoRefs.current[i] = el;
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!isInView) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % VIDEOS.length);
    }, INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInView]);

  // Zoom + fade transition
  useEffect(() => {
    const el = container.current;
    if (!el) return;

    const layers = el.querySelectorAll<HTMLElement>('.video-layer');
    layers.forEach((layer, i) => {
      if (i === current) {
        // Incoming — fade in from slightly zoomed out
        gsap.fromTo(layer,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
        );
      } else {
        // Outgoing — zoom in while fading out
        gsap.to(layer, {
          opacity: 0,
          scale: 1.15,
          duration: 1.4,
          ease: 'power2.in',
        });
      }
    });

    // Play current video, pause others
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === current) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [current]);

  // ScrollTrigger — detect when section is in view
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

    // Entrance animation
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

  return (
    <section
      ref={container}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, oklch(0.88 0.06 10) 0%, oklch(0.82 0.06 5) 15%, oklch(0.65 0.06 355) 40%, oklch(0.40 0.05 330) 70%, oklch(0.25 0.04 300) 100%)',
      }}
    >
      {/* Video layers — stacked fullscreen */}
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

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />
      </div>


      {/* Top fade — blends rosé into video */}
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
