'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHAPITRES = [
  {
    mois: 'Août',
    titre: 'Le commencement',
    texte: 'Pas de précipitation. Juste une évidence douce, comme un soleil qui se lève sans prévenir.',
    side: 'left' as const,
  },
  {
    mois: 'Septembre',
    titre: 'Les mises en place',
    texte: 'Les premières habitudes. San Pedro, les anniversaires célébrés ensemble. On posait les fondations sans le savoir.',
    side: 'right' as const,
  },
  {
    mois: 'Octobre',
    titre: 'Les soirées simples',
    texte: 'Manger ensemble, se faire plaisir, rire pour rien. Le bonheur tenait dans un quotidien à deux.',
    side: 'left' as const,
  },
  {
    mois: 'Novembre',
    titre: 'Les repères',
    texte: 'Ce qui était nouveau devenait familier. Les habitudes tenaient. Une stabilité rassurante, chaleureuse.',
    side: 'right' as const,
  },
  {
    mois: 'Décembre',
    titre: 'La projection',
    texte: 'L\'envie douce de construire. Une nouvelle année à imaginer ensemble, sans forcer, avec confiance.',
    side: 'left' as const,
  },
  {
    mois: 'Janvier',
    titre: 'Le vrai départ',
    texte: 'Nouvelle énergie, nouvelles sorties. On commençait l\'année côte à côte, et ça semblait naturel.',
    side: 'right' as const,
  },
  {
    mois: 'Février',
    titre: 'Six mois',
    texte: 'Six mois de nous. La Saint-Valentin arrive sans pression, juste avec une intention ouverte. Et tout ce chemin parcouru.',
    side: 'left' as const,
  },
  {
    mois: 'Mars',
    titre: 'Les premières fractures',
    texte: 'Quelque chose s’est mis à se troubler. Les questions sont arrivées sans prévenir. La douceur restait — le doute aussi.',
    side: 'right' as const,
  },
  {
    mois: 'Avril',
    titre: 'Le retrait',
    texte: 'On a posé les choses. On s’est éloignés un temps. Pas par colère — par épuisement de ne pas se rejoindre.',
    side: 'left' as const,
  },
  {
    mois: 'Mai',
    titre: 'Le retour',
    texte: 'Le manque a parlé plus fort que les peurs. On s’est retrouvés — pas pour effacer, pour continuer. Cette fois, on savait ce qu’on choisissait.',
    side: 'right' as const,
  },
  {
    mois: 'Juin',
    titre: 'La reconstruction',
    texte: 'Réapprendre le quotidien, pierre par pierre. Les mêmes gestes qu’avant, posés plus doucement, plus sûrement.',
    side: 'left' as const,
  },
  {
    mois: 'Juillet',
    titre: 'Les ajustements',
    texte: 'Marcher à deux, ça s’apprend : parfois, on s’est marché sur les pieds. Alors on s’est parlé, pour ajuster le pas. Et une règle simple est restée — quand ça déborde, on demande de l’aide.',
    side: 'right' as const,
  },
  {
    mois: 'Août',
    titre: 'Un an',
    texte: 'Douze mois. Un orage traversé. Et nous, toujours là. Le 3 août n’est plus seulement le jour où tout a commencé — c’est le jour où tout continue.',
    side: 'left' as const,
  },
  {
    mois: 'Et après…',
    titre: 'Les prochains chapitres',
    texte: 'La suite n’est pas encore écrite — et c’est ce qui est beau. D’autres voyages, d’autres fous rires, des projets qui prennent racine. Cette fois, on écrit à deux mains.',
    side: 'right' as const,
  },
];

export default function ConnexionSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    const pinEl = el.querySelector<HTMLElement>('.chapitres-pin');
    const track = el.querySelector<HTMLElement>('.chapitres-track');
    if (!pinEl || !track) return;

    const distance = () => track.scrollWidth - window.innerWidth;

    // ── Scroll vertical → traversée horizontale (pin + scrub) ──
    // Une seule timeline scrubée : le track défile ET le fil se remplit en parallèle.
    const traversee = gsap.timeline({
      scrollTrigger: {
        trigger: pinEl,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    traversee.to(track, { x: () => -distance(), ease: 'none' }, 0);

    const filProgress = track.querySelector('.fil-progress');
    if (filProgress) {
      traversee.fromTo(
        filProgress,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', transformOrigin: 'left center' },
        0,
      );
    }

    // ── Intro — apparaît à l'approche de la section ──
    const intro = el.querySelector('.chapitres-intro-content');
    if (intro) {
      gsap.from(intro, {
        opacity: 0, y: 30, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 20%', scrub: 1 },
      });
    }

    // ── Chaque panneau s'anime à son entrée dans le viewport horizontal ──
    el.querySelectorAll<HTMLElement>('.chapitre-panel').forEach((panel) => {
      const up = panel.dataset.pos === 'up';
      const dot = panel.querySelector('.chapitre-dot-inner');
      const branch = panel.querySelector('.chapitre-branch');
      const card = panel.querySelector('.chapitre-card');

      if (dot) {
        gsap.from(dot, {
          scale: 0, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: traversee, start: 'left 85%', end: 'left 62%', scrub: 1 },
        });
      }
      if (branch) {
        gsap.from(branch, {
          scaleY: 0, opacity: 0, ease: 'none',
          transformOrigin: up ? 'bottom center' : 'top center',
          scrollTrigger: { trigger: panel, containerAnimation: traversee, start: 'left 82%', end: 'left 58%', scrub: 1 },
        });
      }
      if (card) {
        gsap.from(card, {
          opacity: 0, y: up ? -34 : 34, filter: 'blur(4px)', ease: 'none',
          scrollTrigger: { trigger: panel, containerAnimation: traversee, start: 'left 80%', end: 'left 48%', scrub: 1 },
        });
      }
    });

    // ── Infini final ──
    const heart = el.querySelector('.fil-heart-inner');
    if (heart) {
      gsap.from(heart, {
        scale: 0, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: el.querySelector('.chapitre-panel-final'), containerAnimation: traversee, start: 'left 78%', end: 'left 40%', scrub: 1 },
      });
    }
  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative overflow-hidden"
    >
      {/* Fond — transition douce vers la section suivante */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, var(--cream) 0%, var(--blush) 40%, oklch(0.92 0.04 10) 100%)',
        }}
      />
      <div className="absolute inset-0 grain pointer-events-none z-10" />

      {/* Conteneur pinné : 1 écran, le contenu défile horizontalement */}
      <div className="chapitres-pin relative h-[100dvh] overflow-hidden">
        {/* Orbes — dans le pin pour accompagner toute la traversée */}
        <div className="orb orb-mist w-[450px] h-[450px] top-10 -right-32 opacity-40" />
        <div className="orb orb-gold w-[200px] h-[200px] bottom-16 -left-16 opacity-20" />
        <div className="orb orb-rose w-[350px] h-[350px] top-[40%] left-1/2 -translate-x-1/2 opacity-10" />
        <div className="orb orb-mist w-[300px] h-[300px] bottom-10 right-10 opacity-25" />

        {/* Track horizontal */}
        <div className="chapitres-track relative flex items-stretch h-full w-max will-change-transform z-20">
          {/* Fil doré horizontal — fond, puis progression qui se remplit */}
          <div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: 'oklch(0.80 0.10 85 / 0.15)' }}
          />
          <div
            className="fil-progress absolute left-0 right-0 top-1/2 h-px"
            style={{
              background: 'linear-gradient(90deg, oklch(0.80 0.10 85 / 0.6), oklch(0.80 0.10 85 / 0.35))',
              boxShadow: '0 0 10px oklch(0.80 0.10 85 / 0.25)',
              transform: 'scaleX(0)',
            }}
          />

          {/* Panneau d'intro */}
          <div className="relative shrink-0 w-[86vw] md:w-[560px] h-full flex items-center">
            <div className="chapitres-intro-content relative z-10 flex flex-col px-8 md:px-16">
              <h2 className="chapitres-title font-serif text-4xl md:text-6xl font-light text-charcoal">
                Nos chapitres
              </h2>
              <p className="chapitres-subtitle font-sans text-sm text-charcoal/40 font-light mt-3">
                Chaque mois a écrit un peu de nous.
              </p>
              <div className="flex items-center gap-3 mt-6 text-charcoal/30">
                <div className="w-10 h-px bg-gold-soft/40" />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-light">
                  continue de faire défiler
                </span>
                <span className="animate-drift-x font-sans text-xs text-charcoal/40" aria-hidden="true">
                  →
                </span>
              </div>
            </div>
          </div>

          {/* Panneaux chapitres — cartes alternées au-dessus / en-dessous du fil */}
          {CHAPITRES.map((ch, i) => {
            const up = ch.side === 'left';
            return (
              <div
                key={i}
                data-pos={up ? 'up' : 'down'}
                className="chapitre-panel relative shrink-0 w-[78vw] sm:w-[420px] md:w-[440px] h-full"
              >
                {/* Numéro du mois en filigrane — profondeur éditoriale */}
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 -translate-x-1/2 font-serif font-light select-none pointer-events-none text-[110px] md:text-[170px] leading-none text-charcoal/[0.05] ${
                    up ? 'top-[56%]' : 'bottom-[56%]'
                  }`}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Dot doré sur le fil */}
                <div className="chapitre-dot absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 z-10">
                  <div
                    className="chapitre-dot-inner w-3 h-3 rounded-full"
                    style={{
                      background: 'oklch(0.80 0.10 85)',
                      boxShadow: '0 0 10px oklch(0.80 0.10 85 / 0.5), 0 0 3px oklch(0.80 0.10 85 / 0.3)',
                    }}
                  />
                </div>

                {/* Branche verticale vers la carte */}
                <div
                  className={`chapitre-branch absolute left-[calc(50%-0.5px)] w-px h-8 md:h-10 ${
                    up ? 'bottom-[calc(50%+0.75rem)]' : 'top-[calc(50%+0.75rem)]'
                  }`}
                  style={{ background: 'oklch(0.80 0.10 85 / 0.3)' }}
                />

                {/* Carte */}
                <div
                  className={`chapitre-card absolute left-[6%] w-[88%] ${
                    up
                      ? 'bottom-[calc(50%+3.5rem)] md:bottom-[calc(50%+4rem)]'
                      : 'top-[calc(50%+3.5rem)] md:top-[calc(50%+4rem)]'
                  }`}
                >
                  <div className="glass rounded-2xl px-5 py-5 md:px-6 md:py-6">
                    {/* Mois */}
                    <span
                      className="font-sans text-[10px] uppercase tracking-[0.2em] font-semibold"
                      style={{ color: 'oklch(0.80 0.10 85)' }}
                    >
                      {ch.mois}
                    </span>

                    {/* Titre */}
                    <h3 className="font-serif text-lg md:text-xl text-charcoal font-light mt-1.5 leading-snug">
                      {ch.titre}
                    </h3>

                    {/* Séparateur */}
                    <div
                      className="w-8 h-px my-3"
                      style={{ background: 'oklch(0.80 0.10 85 / 0.35)' }}
                    />

                    {/* Texte */}
                    <p className="font-sans text-[13px] md:text-sm text-charcoal/55 font-light leading-relaxed">
                      {ch.texte}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Terminaison — infini doré */}
          <div className="chapitre-panel-final relative shrink-0 w-[60vw] md:w-[420px] h-full">
            <div
              className="fil-heart absolute left-1/2 top-1/2 -ml-4 -mt-4 z-10"
              style={{ color: 'oklch(0.80 0.10 85)' }}
            >
              <svg className="fil-heart-inner w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
