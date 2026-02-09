export interface GiftType {
  id: string;
  name: string;
  image: string; // path in /images/gifts/
  maxClaims: number | null; // null = infinite
  color: string; // OKLCh color
  description: string;
}

export interface GiftState {
  giftId: string;
  claimedCount: number;
  lastClaimedAt: Date | null;
  claims: Date[];
}

export type RoulettePhase = 'idle' | 'spinning' | 'reveal' | 'wish' | 'claimed';

export const GIFT_TYPES: GiftType[] = [
  {
    id: 'dessert',
    name: 'Un dessert',
    image: '/images/gifts/dessert.png',
    maxClaims: 5,
    color: 'oklch(0.82 0.08 30)',
    description: 'Un dessert rien que pour toi, choisi avec amour.',
  },
  {
    id: 'diner',
    name: 'Un dîner au restaurant',
    image: '/images/gifts/diner.png',
    maxClaims: 3,
    color: 'oklch(0.75 0.10 10)',
    description: 'Une soirée au restaurant, juste nous deux.',
  },
  {
    id: 'cinema',
    name: 'Une soirée cinéma',
    image: '/images/gifts/cinema.png',
    maxClaims: 1,
    color: 'oklch(0.70 0.06 280)',
    description: 'Pop-corn, grand écran, et toi contre moi.',
  },
  {
    id: 'poeme',
    name: 'Un poème personnalisé',
    image: '/images/gifts/poeme.png',
    maxClaims: 10,
    color: 'oklch(0.80 0.10 85)',
    description: 'Des mots écrits rien que pour toi.',
  },
  {
    id: 'massage',
    name: 'Un massage',
    image: '/images/gifts/massage.png',
    maxClaims: 10,
    color: 'oklch(0.85 0.05 160)',
    description: 'Un moment de détente, entre mes mains.',
  },
  {
    id: 'bisou',
    name: 'Un bisou',
    image: '/images/gifts/bisou.png',
    maxClaims: null,
    color: 'oklch(0.72 0.12 10)',
    description: 'Un bisou tendre, là, maintenant.',
  },
  {
    id: 'gaterie',
    name: 'Une gâterie',
    image: '/images/gifts/gaterie.png',
    maxClaims: null,
    color: 'oklch(0.78 0.07 50)',
    description: 'Une petite surprise rien que pour toi...',
  },
  {
    id: 'voeu',
    name: 'Un vœu',
    image: '/images/gifts/voeu.png',
    maxClaims: 1,
    color: 'oklch(0.85 0.10 85)',
    description: 'Fais un vœu... et il se réalisera.',
  },
];
