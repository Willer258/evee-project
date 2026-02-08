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
    mois: 'Et après\u2009…',
    titre: 'La suite s\u2019écrit encore',
    texte: 'Ce n\u2019est que le début. D\u2019autres mois, d\u2019autres souvenirs, d\u2019autres chapitres à vivre ensemble. L\u2019histoire continue.',
    side: 'right' as const,
  },
];

export default function ConnexionSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = container.current;
    if (!el) return;

    // Titre + sous-titre
    const title = el.querySelector('.chapitres-title');
    const subtitle = el.querySelector('.chapitres-subtitle');
    if (title) {
      gsap.from(title, {
        opacity: 0, y: 35, filter: 'blur(6px)', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 40%', scrub: 1 },
      });
    }
    if (subtitle) {
      gsap.from(subtitle, {
        opacity: 0, y: 20, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 68%', end: 'top 35%', scrub: 1 },
      });
    }

    // Fil doré qui se déroule
    const fil = el.querySelector<HTMLElement>('.fil-dore');
    if (fil) {
      gsap.fromTo(fil,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el.querySelector('.chapitres-timeline'),
            start: 'top 70%',
            end: 'bottom 50%',
            scrub: 1.2,
          },
        },
      );
    }

    // Chaque chapitre
    el.querySelectorAll<HTMLElement>('.chapitre-item').forEach((item) => {
      const isLeft = item.dataset.side === 'left';
      const dot = item.querySelector('.chapitre-dot');
      const card = item.querySelector('.chapitre-card');
      const branch = item.querySelector('.chapitre-branch');

      if (dot) {
        gsap.from(dot, {
          scale: 0, opacity: 0, ease: 'none',
          scrollTrigger: { trigger: item, start: 'top 78%', end: 'top 60%', scrub: 1 },
        });
      }
      if (branch) {
        gsap.from(branch, {
          scaleX: 0, opacity: 0, ease: 'none',
          transformOrigin: isLeft ? 'right center' : 'left center',
          scrollTrigger: { trigger: item, start: 'top 76%', end: 'top 58%', scrub: 1 },
        });
      }
      if (card) {
        gsap.from(card, {
          opacity: 0,
          x: isLeft ? -40 : 40,
          filter: 'blur(4px)',
          ease: 'none',
          scrollTrigger: { trigger: item, start: 'top 74%', end: 'top 50%', scrub: 1 },
        });
      }
    });

    // Coeur final
    const heart = el.querySelector('.fil-heart');
    if (heart) {
      gsap.from(heart, {
        scale: 0, opacity: 0, ease: 'none',
        scrollTrigger: {
          trigger: heart,
          start: 'top 85%',
          end: 'top 65%',
          scrub: 1,
        },
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

      {/* Orbes */}
      <div className="orb orb-mist w-[450px] h-[450px] top-10 -right-32 opacity-40" />
      <div className="orb orb-gold w-[200px] h-[200px] bottom-40 -left-16 opacity-20" />
      <div className="orb orb-rose w-[350px] h-[350px] top-[40%] left-1/2 -translate-x-1/2 opacity-10" />
      <div className="orb orb-mist w-[300px] h-[300px] bottom-10 right-10 opacity-25" />

      {/* Contenu */}
      <div className="relative z-20 flex flex-col items-center pt-24 pb-32 px-5">
        {/* Titre */}
        <h2 className="chapitres-title font-serif text-4xl md:text-6xl font-light text-charcoal text-center">
          Nos chapitres
        </h2>
        <p className="chapitres-subtitle font-sans text-sm text-charcoal/40 font-light mt-3 mb-20 md:mb-28">
          Chaque mois a écrit un peu de nous.
        </p>

        {/* Timeline */}
        <div className="chapitres-timeline relative w-full max-w-2xl">
          {/* Fil doré central */}
          <div
            className="fil-dore absolute top-0 bottom-0 w-px left-6 md:left-1/2 md:-translate-x-1/2"
            style={{
              background: 'linear-gradient(180deg, oklch(0.80 0.10 85 / 0.5), oklch(0.80 0.10 85 / 0.35), oklch(0.80 0.10 85 / 0.15))',
              transformOrigin: 'top',
              boxShadow: '0 0 10px oklch(0.80 0.10 85 / 0.2)',
            }}
          />

          {/* Chapitres */}
          <div className="flex flex-col gap-14 md:gap-20">
            {CHAPITRES.map((ch, i) => (
              <div
                key={i}
                className="chapitre-item relative"
                data-side={ch.side}
              >
                {/* Dot doré */}
                <div
                  className="chapitre-dot absolute left-6 md:left-1/2 -translate-x-1/2 top-5 z-10"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: 'oklch(0.80 0.10 85)',
                      boxShadow: '0 0 10px oklch(0.80 0.10 85 / 0.5), 0 0 3px oklch(0.80 0.10 85 / 0.3)',
                    }}
                  />
                </div>

                {/* Branche horizontale (desktop) */}
                <div
                  className={`chapitre-branch hidden md:block absolute top-[23px] h-px ${
                    ch.side === 'left'
                      ? 'right-[50%] w-[40px]'
                      : 'left-[50%] w-[40px]'
                  }`}
                  style={{ background: 'oklch(0.80 0.10 85 / 0.25)' }}
                />

                {/* Card — mobile: toujours à droite du fil, desktop: alternance */}
                <div
                  className={`chapitre-card relative ml-14 md:ml-0 ${
                    ch.side === 'left'
                      ? 'md:mr-auto md:pr-0 md:w-[calc(50%-55px)] md:text-right'
                      : 'md:ml-auto md:pl-0 md:w-[calc(50%-55px)] md:ml-[calc(50%+55px)]'
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
                      className={`w-8 h-px my-3 ${ch.side === 'left' ? 'md:ml-auto' : ''}`}
                      style={{ background: 'oklch(0.80 0.10 85 / 0.35)' }}
                    />

                    {/* Texte */}
                    <p className="font-sans text-[13px] md:text-sm text-charcoal/55 font-light leading-relaxed">
                      {ch.texte}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Terminaison — infini doré */}
          <div className="fil-heart absolute left-6 md:left-1/2 -translate-x-1/2 -bottom-10 z-10">
            <div
              className="flex items-center justify-center"
              style={{ color: 'oklch(0.80 0.10 85)' }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
