'use client';

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  type CSSProperties,
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CircularGalleryItem {
  src: string;
  caption?: string;
}

interface CircularGalleryProps {
  images: CircularGalleryItem[];
  autoplay?: boolean;
  intervalMs?: number;
  onImageClick?: (index: number) => void;
  className?: string;
  initialIndex?: number;
}

/* Responsive gap between active image and the two neighbours — based on viewport width */
function calculateGap(width: number) {
  const minWidth = 320;
  const maxWidth = 1100;
  const minGap = 64;
  const maxGap = 210;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return maxGap;
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export function CircularGallery({
  images,
  autoplay = true,
  intervalMs = 4500,
  onImageClick,
  className,
  initialIndex = 0,
}: CircularGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [containerWidth, setContainerWidth] = useState(800);
  const stageRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const length = useMemo(() => images.length, [images]);

  /* Responsive width tracking */
  useEffect(() => {
    function handleResize() {
      setContainerWidth(window.innerWidth);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Autoplay */
  useEffect(() => {
    if (!autoplay || length < 2) return;
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % length);
    }, intervalMs);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, intervalMs, length]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % length);
    stopAutoplay();
  }, [length, stopAutoplay]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + length) % length);
    stopAutoplay();
  }, [length, stopAutoplay]);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handlePrev, handleNext]);

  /* Touch swipe */
  const touchStart = useRef(0);
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const delta = touchStart.current - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 40) (delta > 0 ? handleNext : handlePrev)();
    },
    [handleNext, handlePrev],
  );

  /* Per-image transform (active centre + left + right + hidden rest) */
  function getImageStyle(index: number): CSSProperties {
    const gap = calculateGap(containerWidth);
    const stickUp = gap * 0.35;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + length) % length === index;
    const isRight = (activeIndex + 1) % length === index;
    const transition =
      'transform 0.9s cubic-bezier(.32,1.3,.28,1), opacity 0.7s ease, filter 0.7s ease';

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translate3d(0,0,0) scale(1) rotateY(0deg)',
        filter: 'none',
        transition,
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.45,
        pointerEvents: 'auto',
        transform: `translate3d(-${gap}px, -${stickUp}px, 0) scale(0.8) rotateY(24deg)`,
        filter: 'blur(1.5px)',
        transition,
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.45,
        pointerEvents: 'auto',
        transform: `translate3d(${gap}px, -${stickUp}px, 0) scale(0.8) rotateY(-24deg)`,
        filter: 'blur(1.5px)',
        transition,
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translate3d(0,0,0) scale(0.78) rotateY(0deg)',
      filter: 'blur(3px)',
      transition,
    };
  }

  const activeCaption = images[activeIndex]?.caption;

  return (
    <div className={`flex flex-col items-center gap-6 md:gap-8 w-full ${className ?? ''}`}>
      <div
        ref={stageRef}
        className="relative w-full max-w-[340px] md:max-w-[380px] aspect-[3/4]"
        style={{ perspective: '1100px' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Halo doré pulsant derrière la carte active */}
        <div
          aria-hidden="true"
          className="absolute -inset-10 animate-pulse-glow pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 55% at 50% 50%, oklch(0.80 0.10 85 / 0.30) 0%, oklch(0.75 0.08 10 / 0.14) 50%, transparent 75%)',
            filter: 'blur(24px)',
            zIndex: 0,
          }}
        />
        {images.map((img, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onImageClick?.(index)}
            tabIndex={index === activeIndex ? 0 : -1}
            aria-label={`Souvenir ${index + 1} sur ${length}`}
            aria-hidden={index !== activeIndex}
            className="absolute inset-0 overflow-hidden rounded-3xl will-change-transform cursor-pointer"
            style={{
              ...getImageStyle(index),
              boxShadow:
                '0 22px 60px oklch(0.15 0.04 320 / 0.50), 0 6px 18px oklch(0.15 0.04 320 / 0.35)',
              border: '1px solid oklch(1 0 0 / 0.30)',
            }}
          >
            <img
              src={img.src}
              alt=""
              loading={index === activeIndex || Math.abs(index - activeIndex) <= 2 ? 'eager' : 'lazy'}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 md:gap-5">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Souvenir précédent"
          className="w-11 h-11 rounded-full flex items-center justify-center text-warm-white/70 hover:text-warm-white active:scale-95 transition-all duration-200"
          style={{
            background: 'oklch(1 0 0 / 0.10)',
            border: '1px solid oklch(1 0 0 / 0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <span className="font-sans text-xs tracking-wider text-warm-white/65 tabular-nums min-w-[3.5rem] text-center">
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="mx-1 text-warm-white/30">/</span>
          {String(length).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Souvenir suivant"
          className="w-11 h-11 rounded-full flex items-center justify-center text-warm-white/70 hover:text-warm-white active:scale-95 transition-all duration-200"
          style={{
            background: 'oklch(1 0 0 / 0.10)',
            border: '1px solid oklch(1 0 0 / 0.18)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>

      {activeCaption && (
        <p
          key={activeIndex}
          className="font-serif italic text-sm md:text-base text-charcoal/55 font-light text-center max-w-xs animate-[fadeInUp_0.6s_ease]"
        >
          {activeCaption}
        </p>
      )}
    </div>
  );
}

export default CircularGallery;
