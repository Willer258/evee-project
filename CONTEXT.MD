# 📘 DOCUMENT DE CONCEPTION — PROJET *EVEE (valentine-chibi)*

## 1. Présentation générale

### Nom du projet

**EVEE — Valentine Chibi Experience**

### Nature

Site web **one-page immersif**, **mobile-first**, **privé**, conçu comme **cadeau émotionnel interactif** pour une seule personne (Evee).

### Langue

* Français uniquement

### Audience

* Une seule utilisatrice
* Accès volontairement restreint
* Aucun objectif public, SEO ou marketing

---

## 2. Intention & vision

### Intention principale

Créer un **refuge émotionnel interactif** qui raconte une histoire d’amour à travers une expérience progressive, douce et immersive.

Le site ne cherche pas à impressionner techniquement, mais à :

* faire ressentir
* rassurer
* marquer un instant précis dans le temps

---

### Positionnement émotionnel

| Axe         | Direction                      |
| ----------- | ------------------------------ |
| Ton         | Intime, sincère                |
| Rythme      | Lent, respirant                |
| Interaction | Douce, non intrusive           |
| Narration   | Progressive                    |
| Finalité    | Laisser une trace émotionnelle |

---

## 3. Expérience utilisateur globale

### Principes clés

* Mobile-first prioritaire
* Scroll vertical avec **scroll snap plein écran**
* Une seule narration, pas de navigation classique
* Aucun lien sortant
* Musique optionnelle, jamais forcée

L’utilisatrice ne visite pas un site :
👉 elle **entre dans un espace**.

---

## 4. Système de verrouillage (entrée)

### Concept

L’accès au site est protégé par un **verrou narratif basé sur une date symbolique** :
📅 **03 / 08 / 2025**
(date où la relation a été décidée)

Ce verrou :

* n’est pas un mot de passe classique
* fait partie intégrante de l’expérience
* repose sur la **reconnaissance**, pas sur l’erreur

### Fonctionnement

* 3 champs : Jour / Mois / Année
* Validation continue (pas de bouton)
* Aucun message d’erreur brutal
* Reconnaissance douce lorsque la date est correcte

Texte affiché lors de la reconnaissance :

> *« Oui. C’est ce jour-là. »*

---

## 5. Structure du site (sections)

Le site est composé de **7 sections plein écran**, montées uniquement après déverrouillage, précédées d'un **écran de chargement** (préchargement des photos, orbes, barre de progression).

| Ordre | Section      | Rôle                            |
| ----- | ------------ | ------------------------------- |
| 1     | Entrée       | Passage vers le monde intérieur |
| 2     | Découverte   | Mise en valeur d’Evee           |
| 3     | Souvenirs    | Mémoire partagée                |
| 4     | Connexion    | Continuité du lien              |
| 5     | Intimité     | Lettre d’amour                  |
| 6     | Scellement   | Ancrage final                   |
| 7     | Vidéo finale | Carrousel de vidéos souvenirs   |

S'ajoute une **roulette à cadeaux** flottante (bulle + modal), hors du flux de scroll — voir §5.6.

---

### 5.1 Entrée

* Tableau photo avec plein de photos de de nous
* Ambiance calme
* Début de la musique

Objectif :
👉 faire sentir que l’on quitte le monde extérieur.

---

### 5.2 Découverte
* Comment je la vois ?
* Liste de qualités sincères
* Apparition progressive du texte
* Animations discrètes (shy / happy) avec des photos coulissantes des photos de nous qui apparaissent ca et la 

Objectif :
👉 Evee se sent vue et reconnue.

---

### 5.3 Souvenirs

* Galerie photo limitée (qualité > quantité) chronologique
* Transitions douces
* Accent sur les moments vécus, pas esthétiques

Objectif :
👉 ancrer l’amour dans le réel.


### 5.4 Connexion

* Timeline narrative en chapitres, mois par mois (Août → …)
* Alternance gauche / droite
* Poésie courte par chapitre

Objectif :
👉 montrer la continuité du lien, fondation après fondation.

---

### 5.5 Intimité

* Lettre d’amour
* Effet calligraphique
* Aucun élément distrayant

Objectif :
👉 moment de vulnérabilité et de vérité.

---

### 5.6 Scellement, vidéo finale & roulette

* **Scellement** : ancrage final, orbes lumineuses
* **Vidéo finale** : carrousel de 10 vidéos (6 s chacune)
* **Roulette à cadeaux** : bulle flottante → modal de tirage
  * 8 cadeaux pondérés (bisou, gâterie, massage, poème, dîner, dessert, cinéma, vœu)
  * 1 tirage par semaine, réinitialisé chaque lundi
  * état partagé via Firestore (fallback localStorage hors ligne)
  * le vœu s'envoie par lien WhatsApp

Objectif :
👉 prolonger l'expérience dans le réel, semaine après semaine.


## 6. Direction artistique

### Style visuel

* Romantisme moderne
* Ambiance onirique
* Glassmorphism subtil
* Lumières douces, jamais agressives

### Personnages

* Chibi 3D (Wilfried & Evee)
* États émotionnels normalisés :

  * idle
  * shy
  * happy
  * love
  * pout

Les personnages accompagnent, ils ne dominent jamais.

---

## 7. Son & animation

### Musique

* **Non implémentée à ce jour** (Howler.js envisagé, jamais installé)
* Si ajoutée : démarrage progressif, volume modéré, toujours optionnelle

### Animations

* Peu nombreuses mais intentionnelles
* Une animation émotionnelle forte max par écran
* Toujours suivie d’un temps de respiration

---

## 8. Contraintes techniques

* Mobile-first obligatoire
* Front-end Next.js — pas de backend applicatif
* **Exception** : la roulette à cadeaux s'appuie sur **Firebase Firestore** (clés dans `.env.local`), avec fallback localStorage — jamais bloquant pour le reste du site
* Scroll fluide via **Lenis** (le scroll snap initial a été abandonné)
* Pas d’accès direct aux sections sans le verrou
* Code clair, structuré, maintenable

---

## 9. Règle d’or du projet

> **Si un élément attire plus l’attention que l’émotion qu’il accompagne, il est en trop.**

---

### Résultat attendu

Un site :

* cohérent
* intime
* immersif
* émotionnellement juste

Un objet numérique qui devient un **souvenir vivant**.
