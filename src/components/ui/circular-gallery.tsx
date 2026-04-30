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

/* Responsive gap between active image and the two neighbours */
function calculateGap(width: number) {
  const minWidth = 320;
  const maxWidth = 800;
  const minGap = 38;
  const maxGap = 80;
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
      if (stageRef.current) setContainerWidth(stageRef.current.offsetWidth);
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
    const stickUp = gap * 0.55;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + length) % length === index;
    const isRight = (activeIndex + 1) % length === index;
    const transition =
      'transform 0.85s cubic-bezier(.4,2,.3,1), opacity 0.7s ease';

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translate3d(0,0,0) scale(1) rotateY(0deg)',
        transition,
      };
    }
    if (isLeft) {
      return {
        zIndex: 2,
        opacity: 0.92,
        pointerEvents: 'auto',
        transform: `translate3d(-${gap}px, -${stickUp}px, 0) scale(0.86) rotateY(18deg)`,
        transition,
      };
    }
    if (isRight) {
      return {
        zIndex: 2,
        opacity: 0.92,
        pointerEvents: 'auto',
        transform: `translate3d(${gap}px, -${stickUp}px, 0) scale(0.86) rotateY(-18deg)`,
        transition,
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translate3d(0,0,0) scale(0.78) rotateY(0deg)',
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
                '0 14px 40px oklch(0.55 0.15 10 / 0.18), 0 4px 14px oklch(0.55 0.15 10 / 0.12)',
              border: '1px solid oklch(1 0 0 / 0.25)',
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
          className="glass-rose w-11 h-11 rounded-full flex items-center justify-center text-charcoal/55 hover:text-charcoal transition-colors"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>

        <span className="font-sans text-xs tracking-wider text-charcoal/45 tabular-nums min-w-[3.5rem] text-center">
          {String(activeIndex + 1).padStart(2, '0')}
          <span className="mx-1 text-charcoal/25">/</span>
          {String(length).padStart(2, '0')}
        </span>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Souvenir suivant"
          className="glass-rose w-11 h-11 rounded-full flex items-center justify-center text-charcoal/55 hover:text-charcoal transition-colors"
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
