import type { ModuleContent } from '../../core/content';
import { S11 } from './s11';
import { S12 } from './s12';
import { S13 } from './s13';
import { S14 } from './s14';
import { EXTRA_EXERCISES, EXTRA_CARDS, EXTRA_QUIZ } from './extra13';
import { SECTIONS, EXERCISES, FLASHCARDS, QUIZ } from './ch1.gen';
// Les sections 1.1 à 1.4 sont rédigées à la main en LaTeX (s11 à s14). ch1.gen.ts ne fournit plus que la structure et les exercices, cartes et QCM déjà portés.
const HAND: Record<string, typeof S11> = { '1.1': S11, '1.2': S12, '1.3': S13, '1.4': S14 };
const sections = SECTIONS.map((s) => { const h = HAND[s.id]; return h ? { ...s, items: h } : s; });
/** Démonstrations exigées par le tableau de parité (§9.4) pour le chapitre 1. */
export const PARITY_PROOFS = ['thm-1.1.11', 'prop-1.1.14', 'prop-1.1.18', 'prop-1.2.3', 'prop-1.2.4', 'prop-1.3.1', 'prop-1.3.5', 'thm-1.4.4', 'thm-1.4.6', 'cor-1.4.7'];
export const topologie: ModuleContent = {
  chapters: [{ id: '1', title: 'Espaces topologiques', summary: 'Topologies, ouverts, fermés, voisinages, adhérence, continuité.', sections }],
  parityGaps: ['prop-1.1.10'], exercises: [...EXERCISES, ...EXTRA_EXERCISES], flashcards: [...FLASHCARDS, ...EXTRA_CARDS], quiz: [...QUIZ, ...EXTRA_QUIZ], parityProofs: PARITY_PROOFS,
};
