'use client';

import Image from 'next/image';
import { GIFT_TYPES } from '@/types/gifts';

interface IconProps {
  size?: number;
  className?: string;
}

/* ── Map des images par ID ── */
const IMAGE_MAP: Record<string, string> = Object.fromEntries(
  GIFT_TYPES.map((g) => [g.id, g.image]),
);

export function GiftIcon({ giftId, size = 32, className }: IconProps & { giftId: string }) {
  const src = IMAGE_MAP[giftId];
  if (!src) return null;
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      draggable={false}
    />
  );
}

export function GiftBubbleIcon({ size = 24, className }: IconProps) {
  return (
    <span
      className={className}
      style={{ fontSize: size * 0.75, lineHeight: 1, display: 'inline-block', width: size, height: size, textAlign: 'center' }}
      role="img"
      aria-label="Cadeau"
    >
      🎁
    </span>
  );
}
