# Math L3 — plateforme d'étude (Topologie ch.1 ; Algèbre avec 3D, labo et jeux)

Trois modules (Topologie, Mesure et intégration, Structures algébriques) dans une seule application React.

## Commandes
- `npm install` puis `npm run dev` : développement
- `npm test` : tests (routeur, sauvegarde corrompue, niveaux)
- `npm run build` : site (dossier `dist/`), vérifie TypeScript strict
- `STANDALONE=1 npx vite build --outDir dist-standalone` : un seul fichier HTML, utilisable hors ligne

## Contenu de la phase 1
- Routeur à hash (`#/topologie/cours/2.1`), adresse inconnue renvoyée vers un écran valide
- Progression locale, une clé par module (`mathl3:<module>:v1`), validée champ par champ
- ErrorBoundary, thèmes de couleur par module, accueil à 3 cartes, coquille de module avec 7 onglets
- Hors phase 1 (prévu plus tard) : ESLint/Prettier, polices et KaTeX embarqués (phase 8), contenu (phase 2)
