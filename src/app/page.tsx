'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const DateLock = dynamic(() => import('@/components/lock/DateLock'), { ssr: false });
const EntreeSection = dynamic(() => import('@/components/sections/EntreeSection'), { ssr: false });
const DecouverteSection = dynamic(() => import('@/components/sections/DecouverteSection'), { ssr: false });
const SouvenirsSection = dynamic(() => import('@/components/sections/SouvenirsSection'), { ssr: false });
const ConnexionSection = dynamic(() => import('@/components/sections/ConnexionSection'), { ssr: false });
const IntimiteSection = dynamic(() => import('@/components/sections/IntimiteSection'), { ssr: false });
const ScellementSection = dynamic(() => import('@/components/sections/ScellementSection'), { ssr: false });
const VideoFinaleSection = dynamic(() => import('@/components/sections/VideoFinaleSection'), { ssr: false });

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  // Lenis smooth scroll + GSAP ScrollTrigger integration
  useEffect(() => {
    if (!unlocked) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      smoothWheel: true,
    });

    // Connect Lenis scroll to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Small delay to let sections mount before refreshing
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
      setReady(true);
    }, 300);

    return () => {
      clearTimeout(timeout);
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, [unlocked]);

  return (
    <>
      {!unlocked && <DateLock onUnlock={handleUnlock} />}

      {unlocked && (
        <div ref={wrapperRef} className="overflow-x-hidden">
          <EntreeSection />
          <DecouverteSection />
          <SouvenirsSection />
          <ConnexionSection />
          <IntimiteSection />
          <ScellementSection />
          <VideoFinaleSection />
        </div>
      )}
    </>
  );
}
