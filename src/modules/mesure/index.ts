import type { Flashcard, ModuleContent, Question } from '../../core/content';
import { CH1, EX1 } from './ch1';
import { CH2, EX2 } from './ch2';
const r = String.raw;
/** Démonstrations exigées par le tableau de parité (§9.4) pour les chapitres déjà rédigés. Les chapitres 3 et 4 s'y ajouteront. */
export const PARITY_PROOFS = ['prop-caracterisation-tribu', 'prop-generateurs-borel', 'prop-croissance', 'prop-formule-union', 'prop-continuite-croissante', 'prop-continuite-decroissante', 'prop-sous-additivite', 'prop-fatou-ensembles', 'thm-completion', 'prop-lebesgue-diffuse', 'thm-caracterisation-lebesgue', 'thm-fonction-repartition'];
const flashcards: Flashcard[] = [
  { id: 'fc-mes-tribu', front: 'Les trois axiomes d\'une tribu', back: r`$X\in\mathcal T$ ; stable par complémentaire ; stable par réunion dénombrable.` },
  { id: 'fc-mes-inter', front: 'Pourquoi une tribu est-elle stable par intersection dénombrable ?', back: r`De Morgan : $\bigcap A_n=\left(\bigcup A_n^c\right)^c$.` },
  { id: 'fc-mes-sigma', front: r`Que vaut $\sigma(\{A\})$ ?`, back: r`$\{\emptyset,A,A^c,X\}$.` },
  { id: 'fc-mes-borel', front: 'Définition de la tribu de Borel', back: 'La tribu engendrée par les ouverts de l\'espace topologique.' },
  { id: 'fc-mes-gen', front: r`Quels intervalles engendrent $\mathcal B(\mathbb R)$ ?`, back: r`Les $]a,+\infty[$ (mais aussi les $]a,b]$, $[a,+\infty[$…).` },
  { id: 'fc-mes-mesure', front: 'Définition d\'une mesure positive', back: r`$\mu(\emptyset)=0$ et σ-additivité sur les familles dénombrables disjointes.` },
  { id: 'fc-mes-crois', front: 'Continuité croissante', back: r`Si $(A_n)$ croît, $\mu(\bigcup A_n)=\lim\mu(A_n)$.` },
  { id: 'fc-mes-decr', front: 'Continuité décroissante : quelle hypothèse ?', back: r`Il faut $\mu(B_{n_0})<+\infty$ pour un rang $n_0$.` },
  { id: 'fc-mes-sub', front: 'Sous-additivité', back: r`$\mu(\bigcup A_n)\leq\sum\mu(A_n)$.` },
  { id: 'fc-mes-negl', front: 'Ensemble négligeable', back: r`Partie contenue dans un mesurable $B$ avec $\mu(B)=0$.` },
  { id: 'fc-mes-leb', front: r`Que vaut $\lambda(\{x\})$ ? Pourquoi ?`, back: r`0 : $\{x\}=\bigcap]x-\tfrac1n,x+\tfrac1n[$ et $\tfrac2n\to 0$ (continuité décroissante).` },
  { id: 'fc-mes-stieltjes', front: 'Mesure de Lebesgue–Stieltjes de F', back: r`$\mu_F(]a,b])=F(b)-F(a)$, avec $F$ croissante et continue à droite.` },
];
const quiz: Question[] = [
  { id: 'q-mes-1', q: 'Une tribu est-elle toujours stable par intersection dénombrable ?', options: ['Oui, par De Morgan', 'Non', 'Seulement si elle est finie'], answer: 0, explain: r`$\bigcap A_n=\left(\bigcup A_n^c\right)^c$ : complémentaire, réunion, complémentaire.` },
  { id: 'q-mes-2', q: r`Quelle est la plus petite tribu contenant $A\subset X$ ?`, options: [r`$\{\emptyset,A,X\}$`, r`$\{\emptyset,A,A^c,X\}$`, r`$\mathcal P(X)$`], answer: 1, explain: r`Il faut le complémentaire $A^c$ : on obtient $\{\emptyset,A,A^c,X\}$.` },
  { id: 'q-mes-3', q: 'La réunion de deux tribus est-elle toujours une tribu ?', options: ['Oui', 'Non'], answer: 1, explain: r`Contre-exemple : sur $\{1,2,3\}$, $\sigma(\{1\})\cup\sigma(\{2\})$ ne contient pas $\{1,2\}$.` },
  { id: 'q-mes-4', q: 'Que vaut μ(∅) pour une mesure positive ?', options: ['0', '1', '+∞'], answer: 0, explain: r`C'est un axiome : $\mu(\emptyset)=0$.` },
  { id: 'q-mes-5', q: 'La continuité décroissante peut-elle échouer ?', options: ['Jamais', 'Oui, si aucun μ(B_n) n\'est fini'], answer: 1, explain: r`Comptage sur $\mathbb N$, $B_n=\{n,n+1,\dots\}$ : $\mu(\bigcap B_n)=0$ mais $\mu(B_n)=+\infty$.` },
  { id: 'q-mes-6', q: r`Que vaut $\lambda(\mathbb Q)$ ?`, options: ['0', '1', '+∞'], answer: 0, explain: r`$\mathbb Q$ est dénombrable : réunion dénombrable de singletons de mesure 0.` },
  { id: 'q-mes-7', q: r`Pour $\delta_a$, l'ensemble $\{a\}^c$ est-il négligeable ?`, options: ['Oui', 'Non'], answer: 0, explain: r`$\delta_a(\{a\}^c)=0$ : tout sauf $a$ est négligeable.` },
  { id: 'q-mes-8', q: 'Une fonction de répartition F est…', options: ['croissante et continue à droite', 'strictement croissante et continue', 'décroissante'], answer: 0, explain: r`Les sauts de $F$ correspondent aux masses ponctuelles, d'où la continuité à droite seulement.` },
];
export const mesure: ModuleContent = {
  chapters: [CH1, CH2], exercises: [...EX1, ...EX2], flashcards, quiz, parityProofs: PARITY_PROOFS, parityGaps: [],
};
