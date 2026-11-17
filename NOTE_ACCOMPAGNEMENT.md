# Note d'accompagnement – Mission 2 : Refonte Front-End (Association Marfans)

**SAE S3 26-27 · Association française des syndromes de Marfan, Loeys-Dietz et apparentés**

---

## 1. Objectif du prototype

Ce prototype fonctionnel (HTML5, CSS3, JavaScript vanilla) met en pratique les recommandations de l'audit réalisé lors de la **Mission 1** tout en posant les premières briques d'interface du système d'information modélisé lors de la **Mission 3** (en vue de la connexion Back-End PHP/SQL de la **Mission 4**).

Le prototype couvre deux volets complémentaires :
1. **Volet public (vitrine refondue) :** `index.html`, `la-genetique.html`, `contact.html` + `soutenir.html`.
2. **Volet applicatif interne (préfiguration du SI) :** `login.html`, `espace-benevole.html`, `responsable-ateliers.html`, alimentés par un jeu de données conforme au MCD (`data/mock.json` et `js/data.js`).

---

## 2. Lien direct avec les conclusions de l'audit (Mission 1)

| Constat / Problème identifié en Mission 1 | Choix effectué dans le prototype Mission 2 | Fichiers concernés |
| :--- | :--- | :--- |
| **Absence totale de balise `<h1>`** et pages sans titre explicite | Chaque page possède un `<title>` unique et exactement une balise `<h1>` dès l'ouverture du `<main>`, suivie d'une hiérarchie stricte (`<h2>`, `<h3>`). | Toutes les pages `.html` |
| **Palette incohérente et contrastes insuffisants** (bandeau violet illisible, rouge minuscule sur blanc, blanc sur jaune, boutons de couleurs aléatoires) | Création d'un **Design System** (`variables.css`) validé selon **WCAG 2.1 AA/AAA** : bleu marine `#16325C` (12,77:1), rouge carmin `#A51D36` (7,43:1), violet profond `#4C1D6B` (12,4:1), alertes ambre à texte sombre `#78350F` sur `#FEF3C7`. Boutons unifiés (`btn-primary`, `btn-secondary`, `btn-outline`). | `css/variables.css`, `css/components.css` |
| **Explication de la maladie mal positionnée** sur l'accueil | Présentation immédiate du syndrome de Marfan et du syndrome de Loeys-Dietz dès la section Hero d'entrée de `index.html`, à côté des boutons d'appel au don et d'adhésion. | `index.html` |
| **Contenu illisible au zoom 200 %** et **espaces vides déroulants** | Mise en page fluide (Flexbox, CSS Grid `auto-fit` avec `minmax(min(100%, ...))`), unités relatives `rem` et `clamp()`, suppression des hauteurs fixes vides. | `css/base.css`, `css/pages.css` |
| **Navigation au clavier et focus peu visibles** (*J'adhère*, *Contact*, *Je donne*) | Anneau de focus haute visibilité (`:focus-visible` `3px solid #D97706`), lien d'évitement (« Passer au contenu principal »), indicateur actif `aria-current="page"`. | `css/base.css`, `css/components.css` |
| **Images et icônes sociales sans intitulé accessible** (erreurs WAVE) | Ajout de `role="img"` et `aria-label` / `<title>` sur le logo et les schémas/cartes SVG, et `aria-label` explicites sur chaque lien de réseau social dans le pied de page. | Toutes les pages `.html` |
| **Bug mobile page « La génétique »** (texte parasite + titres vidéo empilés en bas) | Structure sémantique propre sans texte masqué ; chaque vidéo et son titre `<h3>` sont regroupés dans une même carte `.video-card` avec sous-titres et transcription dépliable accessible. | `la-genetique.html`, `js/genetique.js` |
| **Formulaires : erreurs génériques et choix d'options difficiles au clavier** | Onglets ARIA navigables aux flèches, champs natifs (`<select>`, `<fieldset>`/`<legend>`), résumé d'erreurs `role="alert"` et messages d'erreurs explicites et spécifiques à chaque champ (`aria-invalid`, `aria-describedby`). | `contact.html`, `soutenir.html`, `js/forms.js` |

---

## 3. Préparation du futur Système d'Information (Lien Mission 3 & Mission 4)

Les écrans internes du prototype implémentent les principales fonctionnalités et règles de gestion définies dans le dossier de conception de la Mission 3 :
* **Authentification par profil (`F10`, `H2`) :** `login.html` simule `POST /api/auth/login` pour les profils `benevole`, `responsable_ateliers`, `administrateur`, `responsable_formations` et `tresorier`.
* **Espace Bénévole (`F4`, `F7`) :** `espace-benevole.html` permet de filtrer les activités, choisir un rôle (`accueil`, `animation`, `organisation`), indiquer sa disponibilité, confirmer ou se désister, et consulter l'état des formations (validité calculée automatiquement selon `duree_validite_mois`).
* **Synthèse & Gestion Ateliers (`F3`, `F5`, `F8`) :** `responsable-ateliers.html` affiche les alertes accessibles (bénévoles manquants, liste d'attente, annulations avec conservation d'historique et horodatage `date_modification`), permet de créer/modifier une activité et de gérer les inscriptions participants (`inscrit`, `liste_attente` ordonnée par `date_inscription`, promotion automatique en cas d'annulation, ou `frequentation_libre` selon `H4`).

---

## 4. Organisation de l'équipe (5 membres)

* **Membre 1 :** Socle technique, Design System (`variables.css`, `base.css`, `components.css`), Header/Footer accessibles, responsive & zoom 200 %.
* **Membre 2 :** Refonte vitrine (`index.html`, `la-genetique.html`), hiérarchie `<h1>`, SVG accessibles, correction vidéos mobile.
* **Membre 3 :** Formulaires accessibles (`contact.html`, `soutenir.html`, `js/forms.js`) et module d'authentification SI (`login.html`, `js/auth.js`).
* **Membre 4 :** Jeu de données conforme au MCD (`data/mock.json`, `js/data.js`) et Espace Bénévole (`espace-benevole.html`, `js/benevole.js`).
* **Membre 5 :** Espace Responsable des Ateliers (`responsable-ateliers.html`, `js/ateliers.js`), vérifications finales d'accessibilité et rédaction de la présente note.
