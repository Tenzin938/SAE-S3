# MARFANS — SAE S3 26-27 (Mission 2 : Refonte Front-End)

Prototype Front-End (**HTML5, CSS3, JavaScript**) réalisé pour l'**Association Marfans** (Association française des syndromes de Marfan, Loeys-Dietz et apparentés) dans le cadre de la **Mission 2** de la SAE S3, en cohérence avec :
- **Mission 1 :** Audit d'accessibilité et d'ergonomie du site existant (WAVE, Contrast Checker, navigation clavier).
- **Mission 3 :** Modélisation du système d'information (MCD, dictionnaire de données et catalogue d'API REST).
- **Mission 4 (à venir) :** Connexion au Back-End PHP et à la base de données relationnelle.

---

## 🎯 Objectifs du projet

- **Refondre la vitrine publique** en corrigeant les problèmes relevés lors de l'audit (hiérarchie `<h1>`, contrastes WCAG, explication de la maladie dès l'accueil, médias et formulaires accessibles).
- **Préfigurer le système d'information interne** avec des écrans fonctionnels pour les bénévoles (`F4`, `F7`), la connexion par profil (`F10`) et le responsable des ateliers (`F3`, `F5`, `F8`).
- **Garantir une navigation 100 % accessible** au clavier et lisible jusqu'à 200 % de zoom sans défilement horizontal.

---

## 🎨 Identité visuelle (Design System)

La palette unifiée est définie dans `css/variables.css` et validée selon les critères **WCAG 2.1 AA/AAA** :

| Rôle | Couleur | Contraste / Usage |
| :--- | :--- | :--- |
| Bleu marine institutionnel (`--color-primary`) | `#16325C` | Navigation, titres, bandeau d'accueil (12,77:1 sur blanc) |
| Rouge carmin accessible (`--color-accent`) | `#A51D36` | Actions principales (*Je donne*, page active) (7,43:1) |
| Violet profond (`--color-secondary`) | `#4C1D6B` | Barre de session interne SI (12,4:1 avec texte blanc) |
| Texte principal (`--color-text`) | `#1E293B` | Corps de texte (> 13:1 sur blanc) |
| Fond de page (`--color-bg`) | `#F8FAFC` | Arrière-plan général |
| Anneau de focus (`--focus-ring-color`) | `#D97706` | Contour haute visibilité pour la navigation au clavier |

---

## 🛠️ Technologies utilisées

- **HTML5 sémantique** : structure des pages (`header`, `nav`, `main`, `section`, `footer`, attributs ARIA).
- **CSS3 modulaire** : Design System (`variables.css`), grille fluide responsive (Flexbox / Grid), sans dégradés ni imbrications superflues.
- **JavaScript (vanilla)** : onglets ARIA, validation détaillée des formulaires, filtres dynamiques, modales accessibles et simulation du SI avec persistance `localStorage`.
- **Git & GitHub** : gestion de versions par branches et commits atomiques pour le suivi du projet.

---

## 📁 Structure du projet

```text
.
├── index.html                 # Accueil refondu (maladie dès l'entrée, CTAs unifiés, aperçu activités)
├── la-genetique.html          # Vulgarisation FBN1, vidéos sous-titrées + transcriptions, carte centres
├── contact.html               # Formulaire de contact accessible et coordonnées
├── soutenir.html              # Adhésion et Don en onglets ARIA (?onglet=adhesion | ?onglet=don)
├── login.html                 # Connexion simulée au SI (F10) avec comptes de démonstration
├── espace-benevole.html       # Espace personnel bénévole (F4, F7) : disponibilités & formations
├── responsable-ateliers.html  # Synthèse & alertes (F8), gestion activités (F3) et inscriptions (F5)
├── css/
│   ├── variables.css          # Palette WCAG, typographie fluide, rayons harmonisés
│   ├── base.css               # Reset, lien d'évitement, focus-visible, tableaux
│   ├── components.css         # Header, footer, boutons, cartes, badges d'alerte, modales
│   └── pages.css              # Mises en page spécifiques (hero, vidéos, filtres, KPIs)
├── js/
│   ├── data.js                # Données conformes au MCD Mission 3 et règles métier simulées
│   ├── layout.js              # Menu mobile accessible et barre de session
│   ├── accueil.js             # Aperçu dynamique des prochaines activités
│   ├── genetique.js           # Transcriptions vidéos et sélecteur de centres
│   ├── forms.js               # Onglets ARIA et validation explicite par champ
│   ├── auth.js                # Simulation de connexion par profil_acces
│   ├── benevole.js            # Filtres, disponibilités et calcul de validité des formations
│   └── ateliers.js            # Alertes, CRUD activités, inscriptions et liste d'attente
├── data/
│   └── mock.json              # Jeu de données de référence conforme au dictionnaire Mission 3
└── NOTE_ACCOMPAGNEMENT.md     # Note d'accompagnement attendue sur Moodle
```

---

## 🚀 Lancer le projet

1. Cloner le dépôt GitHub ou ouvrir le dossier dans Visual Studio Code.
2. Lancer un serveur local (ou utiliser l'extension **Live Server** de VS Code) :

```bash
python3 -m http.server 8080
```

3. Ouvrir `http://localhost:8080/index.html` (ou ouvrir directement `index.html` dans un navigateur).

---

## ♿ Accessibilité et bonnes pratiques

- Un seul `<h1>` par page et hiérarchie de titres stricte (`<h2>`, `<h3>`).
- Lien d'évitement (*Passer au contenu principal*) et navigation 100 % utilisable au clavier (`Tab`, `Flèches`, `Entrée`, `Échap`).
- Icônes SVG accompagnées d'intitulés explicites (`aria-label` ou texte visible).
- Badges d'alerte associant toujours icône + texte (jamais la couleur seule).
- Formulaires avec `<label>` liés, champs obligatoires indiqués et messages d'erreur spécifiques par champ (`aria-invalid`, `aria-describedby`, `aria-live`).

---

## 👥 Collaboration Git

Chaque membre travaille sur sa branche dédiée avec de petits commits réguliers pour faciliter le suivi :

```bash
git pull
# ... modifications ...
git add .
git commit -m "feat: description courte et claire"
git push
