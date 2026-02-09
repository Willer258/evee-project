'use client';

import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import { useGiftRoulette } from '@/hooks/useGiftRoulette';
import GiftBox, { type GiftBoxHandle } from './GiftBox';
import GiftReveal from './GiftReveal';
import WishInput from './WishInput';
import Confetti from './Confetti';
import { GiftIcon } from './GiftIcons';

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RouletteModal({ isOpen, onClose }: RouletteModalProps) {
  const container = useRef<HTMLDivElement>(null);
  const boxRef = useRef<GiftBoxHandle>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const {
    phase,
    currentGift,
    available,
    loading,
    error,
    spin,
    claim,
    reset,
    setReveal,
    setWish,
    spinCooldown,
    onCooldown,
  } = useGiftRoulette();

  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Entrance animation
  useGSAP(() => {
    if (!isOpen || !container.current) return;

    gsap.from('.modal-backdrop', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
    });

    gsap.from('.modal-panel', {
      scale: 0.9,
      opacity: 0,
      y: 30,
      duration: 0.5,
      ease: 'power3.out',
      delay: 0.1,
    });
  }, { scope: container, dependencies: [isOpen] });

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        reset();
        setShowConfetti(false);
        onClose();
      },
    });

    tl.to('.modal-panel', {
      scale: 0.95,
      opacity: 0,
      y: 20,
      duration: 0.25,
      ease: 'power2.in',
    }).to('.modal-backdrop', {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    }, '-=0.1');
  };

  const handleOpen = () => {
    const gift = spin();
    if (gift && boxRef.current) {
      boxRef.current.open(gift);
    }
  };

  const handleOpenComplete = () => {
    setReveal();
  };

  const handleClaim = async () => {
    if (currentGift?.id === 'voeu') {
      setWish();
      return;
    }

    const success = await claim();
    if (success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleWishSubmit = async () => {
    await claim();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handlePlayAgain = () => {
    reset();
  };

  if (!isOpen) return null;

  return (
    <div ref={container} className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div
        className="modal-backdrop absolute inset-0"
        style={{ background: 'oklch(0.25 0.01 270 / 0.3)', backdropFilter: 'blur(4px)' }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="modal-panel glass border-glow rounded-3xl max-w-sm w-full p-6 relative pointer-events-auto">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-charcoal/30 hover:text-charcoal/60 transition-colors"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <div className="w-8 h-8 border-2 border-rose-soft/30 border-t-rose-soft rounded-full animate-spin" />
              <p className="font-sans text-sm text-charcoal/40">Chargement...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex flex-col items-center gap-4 py-12">
              <p className="font-sans text-sm text-charcoal/50 text-center">{error}</p>
            </div>
          )}

          {/* Idle: show gift box + open button */}
          {!loading && !error && (phase === 'idle' || phase === 'spinning') && (
            <>
              {onCooldown && phase !== 'spinning' ? (
                <div className="flex flex-col items-center gap-5 py-4">
                  <GiftIcon giftId="voeu" size={64} />
                  <h3 className="font-serif text-xl text-charcoal text-center">
                    Patience...
                  </h3>
                  <p className="font-sans text-sm text-charcoal/50 text-center max-w-[240px] leading-relaxed">
                    Reviens dans {spinCooldown} jour{spinCooldown > 1 ? 's' : ''} pour un nouveau cadeau.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <h2 className="font-serif text-2xl text-charcoal">Un cadeau pour toi</h2>
                  <p className="font-sans text-sm text-charcoal/50">
                    Découvre ce qui t&apos;attend.
                  </p>

                  <GiftBox
                    ref={boxRef}
                    onOpenComplete={handleOpenComplete}
                  />

                  <button
                    onClick={handleOpen}
                    disabled={phase === 'spinning' || available.length === 0}
                    className="glass-rose rounded-2xl px-8 py-3 font-sans text-sm text-charcoal/80 hover:text-charcoal transition-colors btn-breathe disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {phase === 'spinning' ? 'Patience...' : 'Ouvrir mon cadeau'}
                  </button>

                  {available.length === 0 && (
                    <p className="font-sans text-xs text-charcoal/40 text-center">
                      Tous les cadeaux ont été réclamés !
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Reveal */}
          {!loading && !error && phase === 'reveal' && currentGift && (
            <GiftReveal gift={currentGift} onClaim={handleClaim} />
          )}

          {/* Wish input */}
          {!loading && !error && phase === 'wish' && (
            <WishInput onSubmit={handleWishSubmit} />
          )}

          {/* Claimed */}
          {!loading && !error && phase === 'claimed' && currentGift && (
            <div className="flex flex-col items-center gap-5 py-4">
              <GiftIcon giftId={currentGift.id} size={160} />
              <h3 className="font-serif text-xl text-charcoal text-center">
                C&apos;est noté !
              </h3>
              <p className="font-sans text-sm text-charcoal/50 text-center">
                Ton cadeau t&apos;attend...
              </p>
              <p className="font-sans text-xs text-charcoal/35 text-center">
                Reviens lundi prochain pour un nouveau tour.
              </p>
              <button
                onClick={handleClose}
                className="glass-rose rounded-2xl px-8 py-3 font-sans text-sm text-charcoal/80 hover:text-charcoal transition-colors btn-breathe"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}
    </div>
  );
}
