# EVEE — Valentine Chibi Experience

Site one-page immersif, mobile-first et **privé** : un cadeau émotionnel interactif pour une seule personne (Evee). Français uniquement, aucun objectif public ou SEO.

L'accès est protégé par un verrou narratif (une date symbolique), qui ouvre sur 7 sections plein écran (photos, souvenirs, lettre, vidéos) et une roulette à cadeaux hebdomadaire.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · GSAP 3 + ScrollTrigger · Lenis · Firebase Firestore (roulette uniquement)

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

La roulette à cadeaux nécessite un `.env.local` avec les clés Firebase (`NEXT_PUBLIC_FIREBASE_*`) ; sans elles, elle bascule en mode local (localStorage) et le reste du site fonctionne normalement.

```bash
npm run build      # build production
npm run lint       # ESLint
npx tsc --noEmit   # type-check
```

## Documentation

- `CONTEXT.MD` — document de conception (intention, expérience, direction artistique)
- `CLAUDE.md` — architecture réelle, design system, patterns GSAP, conventions
