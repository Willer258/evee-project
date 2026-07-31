# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projet

**EVEE — Valentine Chibi Experience**
Site one-page immersif, mobile-first, privé. Cadeau émotionnel interactif pour une seule personne (Evee / « Eve »). Français uniquement. Aucun objectif SEO, public ou marketing.

### Règle d'or

> **Si un élément attire plus l'attention que l'émotion qu'il accompagne, il est en trop.**

---

## Commandes

```bash
npm run dev          # Serveur dev (localhost:3000)
npm run build        # Build production
npm start            # Serveur production
npm run lint         # ESLint (Core Web Vitals + TypeScript)
npx tsc --noEmit     # Type-check sans émission
npx shadcn add <x>   # Ajouter un composant shadcn/ui
```

Aucun framework de test configuré.

---

## Stack technique

| Couche        | Technologie                                        |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19 + TS 5          |
| Styles        | Tailwind CSS 4 + shadcn/ui (New York, Lucide)      |
| Animations    | GSAP 3 + @gsap/react + ScrollTrigger               |
| Scroll        | **Lenis** (smooth scroll piloté par le ticker GSAP)|
| Données       | **Firebase Firestore** (roulette à cadeaux uniquement) |
| Audio         | Non implémenté (Howler.js envisagé, jamais installé) |
| Alias         | `@/*` → `./src/*`                                  |

### Variables d'environnement (`.env.local`, non versionné)

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Sans ces clés, la roulette bascule en mode dégradé (fallback `localStorage`), le reste du site fonctionne normalement.

---

## Architecture réelle

```
src/
├── app/
│   ├── layout.tsx              # Fonts (next/font), metadata "Pour toi", lang="fr"
│   ├── page.tsx                # Orchestrateur : loading → lock → content + roulette
│   └── globals.css             # Tailwind + thème shadcn + palette + animations custom
├── components/
│   ├── ui/
│   │   └── circular-gallery.tsx   # Viewer circulaire (utilisé par Souvenirs)
│   ├── lock/
│   │   └── DateLock.tsx        # Verrou narratif (date 03/08/2025)
│   ├── sections/               # 7 sections plein écran (ordre d'affichage)
│   │   ├── EntreeSection.tsx       # Colonnes de photos défilantes (entree/)
│   │   ├── DecouverteSection.tsx   # Narration poétique + sphères photos flottantes (narrative/)
│   │   ├── SouvenirsSection.tsx    # Rangées horizontales défilantes + CircularGallery (souvenirs/)
│   │   ├── ConnexionSection.tsx    # Chapitres mois par mois (timeline gauche/droite)
│   │   ├── IntimiteSection.tsx     # Lettre d'amour (tableau LETTRE)
│   │   ├── ScellementSection.tsx   # Ancrage final (orbes)
│   │   └── VideoFinaleSection.tsx  # Carrousel de 10 vidéos (6 s chacune)
│   └── roulette/               # Roulette à cadeaux (overlay flottant, hors scroll)
│       ├── GiftBubble.tsx      # Bulle flottante d'ouverture
│       ├── RouletteModal.tsx   # Modal principal (phases idle → spinning → reveal → wish/claimed)
│       ├── GiftBox.tsx / GiftReveal.tsx / GiftIcons.tsx / Confetti.tsx
│       └── WishInput.tsx       # Saisie du vœu → lien WhatsApp (⚠ PHONE_NUMBER placeholder)
├── hooks/
│   ├── useGiftRoulette.ts      # État roulette (Firestore + fallback offline)
│   └── useGifts.ts             # ⚠ CODE MORT (wishlist non branchée)
├── lib/
│   ├── firebase.ts             # Init Firebase + export db (Firestore)
│   ├── gift-roulette.ts        # Logique roulette : claims, poids, cooldowns, WhatsApp
│   ├── gifts.ts                # ⚠ CODE MORT (CRUD wishlist, jamais importé)
│   └── utils.ts                # cn() — clsx + tailwind-merge
└── types/
    └── gifts.ts                # GiftType, GiftState, RoulettePhase + GIFT_TYPES (8 cadeaux)

public/
├── images/
│   ├── entree/       # 24 photos (EntreeSection)
│   ├── souvenirs/    # 28 photos (SouvenirsSection)
│   ├── narrative/    # 43 fichiers jpg + mp4 (DecouverteSection, ConnexionSection)
│   ├── gifts/        # 8 PNG (un par cadeau de la roulette)
│   └── cloud.png
└── videos/           # finale-1.mp4 → finale-10.mp4 (VideoFinaleSection)
```

`lib/gifts.ts` + `hooks/useGifts.ts` sont un reliquat d'une wishlist Firestore jamais branchée (aucun import dans l'app). À supprimer ou brancher, ne pas s'en inspirer.

---

## Flux de l'expérience

```
Phase 'loading'
  │  préchargement de ~83 images (entree + souvenirs + narrative)
  │  loader : orbes GSAP + barre de progression + %
  ▼
Phase 'lock' — DateLock (03/08/2025)
  │  3 champs J/M/A, validation continue, pas de bouton
  │  reconnaissance douce → "Oui. C'est ce jour-là."
  │  rideau de transition (curtain fade)
  ▼
Phase 'content' — 7 sections + roulette flottante
  1. Entrée       → colonnes de photos, immersion
  2. Découverte   → narration poétique, sphères photos
  3. Souvenirs    → rangées défilantes + viewer circulaire
  4. Connexion    → chapitres mois par mois (Août → …)
  5. Intimité     → lettre d'amour
  6. Scellement   → ancrage final
  7. Vidéo finale → carrousel de 10 vidéos
  + GiftBubble/RouletteModal en overlay (si pas de cooldown)
```

Les sections sont toutes lazy-loaded (`dynamic(..., { ssr: false })`) et ne se montent qu'après déverrouillage. Les trois phases sont gérées par un state `phase` dans `page.tsx`.

---

## Roulette à cadeaux (Firestore)

- **8 cadeaux** définis dans `types/gifts.ts` (`GIFT_TYPES`) : dessert, dîner, cinéma, poème, massage, bisou, gâterie, vœu — chacun avec `maxClaims` (null = infini), couleur OKLCh, image `public/images/gifts/`.
- **Tirage pondéré** : `GIFT_WEIGHTS` dans `lib/gift-roulette.ts` (bisou 28 → vœu 2).
- **1 spin par semaine**, réinitialisé chaque **lundi 00:00** — état dans Firestore (`app_state/spin_state`) + fallback `localStorage` (`evee_last_spin`).
- **Claims atomiques** via `runTransaction` sur la collection `gift_states` (un doc par cadeau).
- **Vœu** : cooldown propre de 7 jours + envoi via lien WhatsApp (`WishInput.tsx` — ⚠ `PHONE_NUMBER = '33600000000'` est un placeholder à remplacer).
- Firestore indisponible → mode `offline` (localStorage seul), jamais bloquant.

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

Palette intime, chaude, onirique. Définie en variables CSS dans `globals.css` et mappée sur le thème shadcn (`--primary` = rose-deep, `--background` = cream…).

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

### Scroll : Lenis + ScrollTrigger

Le scroll est géré par **Lenis** (instancié dans `page.tsx` à l'entrée en phase `content`), synchronisé avec ScrollTrigger :

```tsx
const lenis = new Lenis({ duration: 1.4, smoothWheel: true, touchMultiplier: 1.5 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

⚠ Les classes `.scroll-container` / `.section-snap` / `.section-no-snap` de `globals.css` sont un **vestige** de l'approche scroll-snap initiale : aucun conteneur snap n'est monté (le body scrolle via Lenis), elles ne servent aujourd'hui qu'au layout `100dvh`. Ne pas réintroduire de scroll-snap sans retirer Lenis.

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

Définies via `@keyframes` dans `globals.css` et exposées via classes Tailwind dans `@theme`.

---

## Conventions de code

### Composants

- `'use client'` obligatoire pour tout composant utilisant GSAP, hooks navigateur, ou interactivité
- Sections = composants autonomes dans `src/components/sections/`
- Chaque section porte son propre `ref` container pour le scope GSAP
- Les sections sont lazy-loaded : `dynamic(() => import(...), { ssr: false })`

### Contenu personnalisable

| Donnée                  | Emplacement réel                                      |
| ----------------------- | ----------------------------------------------------- |
| Date du verrou          | `lock/DateLock.tsx` (`TARGET_DAY/MONTH/YEAR` = 03/08/2025) |
| Narration Découverte    | `DecouverteSection.tsx` (lignes + sphères photos)     |
| Chapitres timeline      | `ConnexionSection.tsx` (tableau `CHAPITRES`)          |
| Lettre d'amour          | `IntimiteSection.tsx` (tableau `LETTRE`)              |
| Cadeaux roulette        | `types/gifts.ts` (`GIFT_TYPES`) + poids dans `lib/gift-roulette.ts` |
| Numéro WhatsApp (vœu)   | `roulette/WishInput.tsx` (`PHONE_NUMBER` — placeholder à remplacer) |
| Photos                  | `public/images/{entree,souvenirs,narrative,gifts}/`   |
| Vidéos finale           | `public/videos/finale-*.mp4` (liste dans `VideoFinaleSection.tsx`) |
| Images préchargées      | `page.tsx` (`PRELOAD_IMAGES` — à synchroniser avec les dossiers) |

⚠ `PRELOAD_IMAGES` dans `page.tsx` liste explicitement les fichiers : toute photo ajoutée/renommée doit y être répercutée.

### Images

- Photos dans `public/images/<section>/`, nommées par convention (`entree-01.jpg`, `souvenir-01.jpg`, `01a.jpg` pour narrative)
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
