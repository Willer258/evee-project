# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

**EVEE — Valentine Chibi Experience**
Site one-page immersif, mobile-first, privé. Cadeau émotionnel interactif pour une seule personne (Evee). Français uniquement. Aucun objectif SEO, public ou marketing.

### Règle d'or

> **Si un élément attire plus l'attention que l'émotion qu'il accompagne, il est en trop.**

---

## Commandes

```bash
npm run dev          # Serveur dev (localhost:3000, Turbopack)
npm run build        # Build production
npm start            # Serveur production
npm run lint         # ESLint (Core Web Vitals + TypeScript)
npx tsc --noEmit     # Type-check sans émission
npx shadcn add <x>   # Ajouter un composant shadcn/ui
```

Aucun framework de test configuré.

---

## Stack technique

| Couche        | Technologie                                    |
| ------------- | ---------------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19 + TS 5      |
| Styles        | Tailwind CSS 4 + shadcn/ui (New York, Lucide)  |
| Animations    | GSAP 3 + @gsap/react + ScrollTrigger           |
| Audio         | Howler.js (à installer quand nécessaire)       |
| Alias         | `@/*` → `./src/*`                              |

---

## Architecture cible

```
src/
├── app/
│   ├── layout.tsx              # Layout racine (fonts, metadata, lang="fr")
│   ├── page.tsx                # Orchestrateur : verrou → sections
│   └── globals.css             # Tailwind + shadcn theme + animations custom
├── components/
│   ├── ui/                     # shadcn/ui (ne jamais éditer à la main)
│   ├── lock/                   # Système de verrou narratif (date 03/08/2025)
│   ├── sections/               # Les 6 sections plein écran
│   │   ├── EntreeSection.tsx
│   │   ├── DecouverteSection.tsx
│   │   ├── SouvenirsSection.tsx
│   │   ├── ConnexionSection.tsx
│   │   ├── IntimiteSection.tsx
│   │   └── ScellementSection.tsx
│   └── shared/                 # Composants réutilisables (transitions, overlays)
├── hooks/
│   └── use-gsap-scroll.ts      # Hook wrapper GSAP ScrollTrigger
├── lib/
│   └── utils.ts                # cn() — clsx + tailwind-merge
└── types/                      # Types globaux
```

---

## Flux de l'expérience

```
Verrou (date 03/08/2025)
  │  validation continue, pas de bouton
  │  reconnaissance douce → "Oui. C'est ce jour-là."
  ▼
6 sections plein écran (scroll snap)
  1. Entrée      → tableau de photos, début musique
  2. Découverte  → qualités d'Evee, texte progressif
  3. Souvenirs   → galerie photo chronologique
  4. Connexion   → continuité du lien (timeline)
  5. Intimité    → lettre d'amour, calligraphie
  6. Scellement  → ancrage final
```

Les sections ne se montent qu'après déverrouillage.

---

## Design System

### Typographie (3 polices Google Fonts via `next/font`)

| Variable CSS         | Police              | Usage                               |
| -------------------- | ------------------- | ----------------------------------- |
| `--font-serif`       | Cormorant Garamond  | Titres, accroches émotionnelles     |
| `--font-script`      | Great Vibes         | Accents calligraphiques (parcimonie)|
| `--font-sans`        | Plus Jakarta Sans   | Corps de texte, UI                  |

Classe Tailwind : `font-serif`, `font-script`, `font-sans`.
Great Vibes uniquement pour les moments forts (reconnaissance verrou, signature lettre). Jamais en corps de texte.

### Palette de couleurs (OKLCh)

Palette intime, chaude, onirique. Définie en variables CSS dans `globals.css`.

| Token              | Rôle                     | OKLCh                          | Hex approx  |
| ------------------ | ------------------------ | ------------------------------ | ----------- |
| `--rose-soft`      | Accent principal         | `oklch(0.75 0.08 10)`         | #d4919a     |
| `--rose-deep`      | Accent hover / actif     | `oklch(0.55 0.15 10)`         | #b04a5a     |
| `--blush`          | Fond secondaire, glass   | `oklch(0.93 0.03 10)`         | #f5e6e8     |
| `--cream`          | Fond principal           | `oklch(0.97 0.01 80)`         | #faf6f0     |
| `--warm-white`     | Texte sur fond sombre    | `oklch(0.98 0.005 80)`        | #fdfaf5     |
| `--charcoal`       | Texte principal          | `oklch(0.25 0.01 270)`        | #3a3540     |
| `--mist`           | Overlay, brouillard      | `oklch(0.95 0.015 280 / 0.6)` | —           |
| `--gold-soft`      | Détails précieux         | `oklch(0.80 0.10 85)`         | #c9a84c     |

Le fond n'est jamais blanc pur (#fff). Toujours `--cream` ou `--blush`.
Le texte n'est jamais noir pur (#000). Toujours `--charcoal`.

### Glassmorphism

```css
.glass {
  background: oklch(0.97 0.01 80 / 0.4);
  backdrop-filter: blur(16px) saturate(1.2);
  border: 1px solid oklch(1 0 0 / 0.15);
  border-radius: var(--radius-xl);
}
```

Utiliser avec parcimonie. Un seul panneau glass par section maximum.

---

## Patterns GSAP

### Initialisation dans Next.js App Router

Tout composant utilisant GSAP doit avoir `'use client'`.

```tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Section() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Toutes les animations ici — cleanup automatique au unmount
    gsap.from('.element', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.element',
        start: 'top 80%',
      },
    });
  }, { scope: container }); // scope = sélecteurs limités au container

  return <div ref={container}>...</div>;
}
```

### Règles GSAP

- Toujours utiliser `useGSAP` (pas useEffect) — il gère le cleanup automatiquement
- Toujours passer `{ scope: containerRef }` pour éviter les conflits entre sections
- Appeler `ScrollTrigger.refresh()` après le montage initial de toutes les sections
- Un `setTimeout(100)` peut être nécessaire si le DOM n'est pas prêt au mount
- `will-change: transform` sur les éléments animés pour le GPU
- Maximum 1 animation émotionnelle forte par section, suivie d'un temps de respiration

### Scroll Snap + ScrollTrigger

```css
.scroll-container {
  height: 100dvh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.section-snap {
  height: 100dvh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

Utiliser `100dvh` (pas `100vh`) pour le support iOS correct.

### Easings recommandés

| Contexte           | Easing                    |
| ------------------ | ------------------------- |
| Apparition douce   | `power2.out`              |
| Disparition        | `power2.in`               |
| Rebond émotionnel  | `elastic.out(1, 0.5)`     |
| Transition fluide  | `power3.inOut`            |
| Texte qui s'écrit  | `none` (linéaire)         |

---

## Animations custom (globals.css)

```
animate-float         → lévitation douce (translateY oscillant)
animate-pulse-glow    → lueur pulsante sur éléments précieux
animate-shimmer       → reflet glissant (texte doré, bordures)
animate-heartbeat     → battement de cœur subtil
animate-fade-in-up    → entrée par le bas avec fondu
```

Définir via `@keyframes` dans `globals.css` et exposer via classes Tailwind dans `@theme`.

---

## Conventions de code

### Composants

- `'use client'` obligatoire pour tout composant utilisant GSAP, hooks navigateur, ou interactivité
- Sections = composants autonomes dans `src/components/sections/`
- Chaque section reçoit un `ref` pour le scope GSAP
- Les sections sont lazy-loaded : `dynamic(() => import(...), { ssr: false })`

### Contenu personnalisable

| Donnée            | Emplacement                        |
| ----------------- | ---------------------------------- |
| Date du verrou    | `lock/` composant (03/08/2025)     |
| Qualités d'Evee   | `DecouverteSection.tsx` (tableau)  |
| Photos            | `public/images/` + ref dans Souvenirs |
| Lettre d'amour    | `IntimiteSection.tsx`              |
| Musique           | `public/audio/`                    |

### Images

- Photos dans `public/images/`, nommées descriptif (`nous-plage-01.jpg`)
- Optimiser avant commit (max 500KB par photo)
- Utiliser `next/image` avec `sizes` et `placeholder="blur"` quand possible

### Accessibilité minimum

Le site est privé mais reste utilisable :
- Contrastes suffisants (ratio 4.5:1 minimum texte / fond)
- `prefers-reduced-motion` : désactiver les animations GSAP, garder le contenu visible
- Champs du verrou avec `aria-label` explicites

---

## Philosophie de design

### Ce que le site doit faire ressentir

- **Chaleur** — comme entrer dans un espace protégé
- **Reconnaissance** — Evee se sent vue, comprise
- **Lenteur** — le rythme est celui d'une respiration, pas d'un feed
- **Intimité** — chaque mot, chaque photo est là pour une raison

### Ce qu'il ne doit jamais être

- Clinquant ou tape-à-l'œil
- Surchargé d'effets
- Rapide ou stressant
- Générique ou impersonnel

### Timing émotionnel

Chaque section suit ce rythme :
1. **Silence** — l'écran est presque vide (0.5s)
2. **Apparition** — le contenu entre doucement (1-1.5s)
3. **Présence** — le contenu est là, l'utilisatrice lit/regarde
4. **Respiration** — espace avant la section suivante

Ne jamais enchaîner deux animations sans pause.
