# EVEE — Valentine Chibi Experience

Site one-page immersif, mobile-first et **privé** : un cadeau émotionnel interactif pour une seule personne (Evee). Français uniquement, aucun objectif public ou SEO.

L'accès est protégé par un verrou narratif (une date symbolique), qui ouvre sur une fête d'anniversaire (confettis, souvenirs, révélation d'une soirée romantique) puis 7 sections plein écran (photos, poème, souvenirs, timeline, lettre, vidéos).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 · GSAP 3 + ScrollTrigger · Lenis — 100 % front-end statique

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000
```

Musique de fond optionnelle : déposer votre chanson dans `public/audio/musique.mp3` — tout s'active automatiquement (démarrage au déverrouillage, bouton ♪).

```bash
npm run build      # build production
npm run lint       # ESLint
npx tsc --noEmit   # type-check
```

## Documentation

- `CONTEXT.MD` — document de conception (intention, expérience, direction artistique)
- `CLAUDE.md` — architecture réelle, design system, patterns GSAP, conventions
