# Journal des changements
## Module Mesure et intégration — chapitres 1 et 2
- Module activé : 2 chapitres (tribus ; mesures positives), 29 notions, 18 démonstrations, 11 exercices corrigés, 12 cartes, 8 questions de QCM.
- Source : « Théorie générale de la mesure » (cours détaillé) ; les preuves sont celles du PDF. Marquées « démonstration ajoutée » (à relire) : intersection de tribus, additivité finie, fonction de répartition (ii et iii) ; marquées « admise dans le cours » : existence de λ, réciproque de Lebesgue–Stieltjes.
- Exercices : 2 du PDF (image réciproque, image directe) + 9 nouveaux marqués « à relire » (réunion de tribus, tribu trace, autre générateur de B(R), Dirac, différence, dénombrables, finitude, combinaison de Dirac, Borel–Cantelli).
- Reste à faire : chapitres 3 (fonctions mesurables) et 4 (intégrale, Fatou, convergence dominée), schémas animés, labos, jeux.
## Démonstrations à compléter
- Bouton « S’entraîner » sur chaque démonstration (34 preuves) : (1) choisir l’étape suivante parmi 3 propositions, (2) remettre les étapes dans l’ordre (boutons ↑ ↓).
- Leurres générés automatiquement : étapes à venir de la même preuve, puis étapes d’autres preuves ; mélanges reproductibles.
- 8 XP une seule fois par démonstration (champ `trained` dans la sauvegarde) ; ligne « Démonstrations travaillées » sur le profil.
- Tests : chaque étape de chaque preuve donne une question valide ; l'ordre de départ n'est jamais correct.
## 6.2 + 6.4 (import Jabr) — Algèbre : schémas 3D, laboratoire, jeux ; darija retirée
- Darija supprimée de tout le projet (données, types, interface, recherche, styles) : explications en français uniquement.
- Chaque notion d'Algèbre (71) a maintenant un schéma 3D interactif (scène Jabr) ; l'élément mis en avant suit l'étape de la démonstration.
- Onglet Labos d'Algèbre : laboratoire 3D (table de Cayley, orbites cycliques, classes, tresses de permutations, anneaux ℤ/nℤ) avec contrôles en direct.
- Onglet Jeux d'Algèbre : jeux de Jabr ; les scores alimentent l'XP du module (passerelle src/algebra/store.tsx).
- Tailwind (utilitaires seulement, sans reset) et lucide-react ajoutés pour le code repris de Jabr ; ce code est marqué @ts-nocheck (à typer strictement plus tard). Chargé à la demande.
- Pas encore fait : flashcards et QCM d'Algèbre, 6 démonstrations manquantes, détail des preuves courtes.
## 6.1 + 6.3 (import) — module Structures algébriques : cours Jabr intégré
Source : le projet « Jabr — Structures algébriques » (cours, charh bdarija, preuves, corrections du cahier, exercices).
- Cours réorganisé selon le cahier des charges (§9.3) : 0 Rappels · 1 Groupes · 2 Groupe quotient · 3 Anneaux et corps. Les numéros du cahier manuscrit (I.1, III.3, VII.5…) sont conservés.
- 71 notions, 20 démonstrations pas à pas, 71 charh bdarija (repliés par défaut), 5 corrections du cahier signalées en violet (3 sur des notions, 2 sur des exercices), 24 exercices corrigés avec indice, charh bdarija et lien vers la notion du cours.
- Les 13 « exercices » du cours (boîtes rouges) sont dans la page Exercices (ils étaient en double dans le cours).
- Toutes les démonstrations portent le badge « démonstration ajoutée » : elles n'ont pas encore été relues contre les manuscrits (Démos).
- Nouveau tableau de parité automatique (test) : les théorèmes et propositions sans démonstration doivent être déclarés. Algèbre : sg-cyclique, isomorphisme, automorphismes, parite-decomposition, ideal-operations, iso-anneaux. Topologie : prop-1.1.10.
- Nouveau test : chaque exercice renvoie à une notion existante.
- Pas encore fait : schémas 3D (6.2), flashcards, QCM, jeux, labos (6.4) ; suite du chapitre Anneaux (polynômes, idéaux premiers et maximaux).
## 4.1d — sections 1.3 et 1.4 en LaTeX (chapitre 1 terminé)
Source : cours de Pr. Tahiri 2024/2025 (numérotation officielle conservée).
- Section 1.3 : 9 notions (1.3.1 à 1.3.9), dont 1.3.3, 1.3.6 et 1.3.8 qui manquaient.
- Section 1.4 : 8 notions (1.4.1 à 1.4.8), dont 1.4.2 et 1.4.3 qui manquaient. L'exercice 1.4.9 est dans les exercices.
- Preuves ajoutées (badge « démonstration ajoutée », à relire) : 1.3.6 (la topologie quotient est une topologie) et 1.3.8 (la topologie produit est une topologie), que le cours énonce sans preuve.
- Nouveaux exercices corrigés : 1.3.a, 1.3.b, 1.4.9b ; 4 flashcards et 3 questions de QCM.
- Nouveau test : toutes les formules LaTeX du contenu doivent compiler. Le test des compteurs ne contient plus de chiffres écrits en dur.
Coquilles et erreurs du PDF corrigées (à confirmer auprès de Pr. Tahiri) :
- Proposition 1.3.5 : le PDF intervertit les sens (⇒) et (⇐) ; réordonné.
- Proposition 1.3.6 : le PDF écrit « U ⊂ E » au lieu de « U ⊂ Ê ».
- Théorème 1.4.6, (d⇒c) : le PDF écrit « W ∈ W » au lieu de « W̄ ⊂ W ».
- Exercice 1.4.9, question 2 : l'hypothèse « f bijective » manque dans l'énoncé ; sans elle la réciproque est fausse (contre-exemple donné dans la solution de l'exercice 1.4.9b).
## Refonte du design (style « Topologia »)
- Thème nuit violette, cartes en verre, titres Instrument Serif avec italique dégradé, particules reliées, polices embarquées (Instrument Serif, Inter).
- Barre du haut : logo IE, pastilles de navigation, recherche Ctrl+K, anneau de niveau, filet dégradé.
- Accueil de chaque module : forme 3D (tore, colonnes en escalier, cristal) avec pause/zoom/réinitialiser/plein écran, cartes d'axiomes, progression, tuiles.
- Niveau mis à jour en direct (événement mathl3:progress).

## 4.1b — section 1.1 réécrite en LaTeX
Coquilles du PDF corrigées dans le texte (à confirmer auprès de Pr. Tahiri) :
- Remarque 1.1.7 : « ]1/n, 1/n[ » corrigé en ]−1/n, 1/n[ ; « [−1/n, 1] » corrigé en [1/n, 1].
- Remarque 1.1.17 : « W ∩ W′ » corrigé en « O ∩ O′ ».
Notions ajoutées (absentes du portage) : 1.1.6, 1.1.9, 1.1.10, 1.1.13, 1.1.16, 1.1.17.
## 4.1 — chapitre 1 porté de l'ancien projet (1.2 à 1.4 encore en texte condensé)

## 4.1c — section 1.2 réécrite en LaTeX
Preuves ajoutées (marquées « démonstration ajoutée », à relire) : 1.2.5 et 1.2.6 (le PDF les énonce sans preuve). Propriété 1.2.5–6 scindée en 1.2.5 et 1.2.6. Ajout de contre-exemples pour les inclusions strictes de 1.2.6.
