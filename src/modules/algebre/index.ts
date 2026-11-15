import type { Chapter, Exercise, Item, ModuleContent } from '../../core/content';
import { CHAPTERS, type CourseItem } from './source/course';
import { EXERCISES } from './source/exercises';

/** Structures algébriques : le cours « Jabr » (cahier + corrections), organisé selon le cahier des charges (§9.3) :
 *  0 Rappels · 1 Groupes · 2 Groupe quotient · 3 Anneaux et corps. Les exercices du cours (boîtes rouges) sont dans les exercices. */
const KIND: Record<string, Item['kind'] | undefined> = { 'Définition': 'definition', 'Théorème': 'theoreme', 'Proposition': 'proposition', 'Exemple': 'exemple', 'Remarque': 'remarque' };
type Plan = { id: string; title: string; summary: string; from: 0 | 1 | 2; roman: string[] };
const PLAN: Plan[] = [
  { id: '0', title: 'Rappels', summary: 'Ensembles, relations (ordre, équivalence), lois de composition interne.', from: 0, roman: ['I', 'II'] },
  { id: '1', title: 'Groupes', summary: 'Sous-groupes, Lagrange, groupes cycliques, indicatrice d’Euler, morphismes, produits, groupe symétrique.', from: 0, roman: ['III', 'IV', 'V', 'VI', 'VII'] },
  { id: '2', title: 'Groupe quotient', summary: 'Conjugaison, sous-groupes normaux, classes modulo H, théorèmes d’isomorphisme.', from: 1, roman: ['I', 'II'] },
  { id: '3', title: 'Anneaux et corps', summary: 'Anneaux, sous-anneaux, unités, corps, idéaux, anneau quotient.', from: 2, roman: ['I'] },
];
const rootOf = (s: string) => s.split(' — ')[0]!;
const toItem = (i: CourseItem): Item => {
  const it: Item = { id: i.id, kind: KIND[i.kind]!, number: i.ref, title: i.title, body: i.statement };
  if (i.example) it.example = i.example;
  if (i.correction) it.correction = i.correction;
  it.visual = { kind: 'three', key: 'alg-' + i.scene, caption: `Schéma 3D : ${i.title}. Fais glisser pour tourner ; les éléments s’allument au fil de la démonstration.` };
  if (i.proof) it.proof = { origin: 'ajoutee', steps: i.proof.map((p) => p.text), focus: i.proof.map((p) => p.focus) };
  return it;
};
const chapters: Chapter[] = PLAN.map((pl) => ({
  id: pl.id, title: pl.title, summary: pl.summary,
  sections: pl.roman.map((rm) => {
    const src = CHAPTERS[pl.from]!; const sec = src.sections.find((s) => rootOf(s) === rm)!;
    return { id: rm, title: sec.split(' — ').slice(1).join(' — '), items: src.items.filter((i) => i.section === sec && KIND[i.kind]).map(toItem) };
  }),
}));
// Chapitre du nouveau plan pour un exercice du cours (chapitre d'origine + numéro de section romain).
const planOf = (from: number, number: string) => PLAN.find((p) => p.from === from && p.roman.includes(number.split('.')[0]!))!;
const sourceItemFor = (from: number, number: string): string => {
  const items = CHAPTERS[from]!.items.filter((i) => i.kind !== 'Exercice');
  const hit = items.find((i) => i.ref === number) ?? items.find((i) => i.ref.startsWith(number + '.')) ?? items.find((i) => i.ref.split('.')[0] === number.split('.')[0]);
  return hit!.id;
};
// Les corrections du cahier portées par les « exercices » du cours (ex-hk, ex-zpz…) sont rattachées à l'exercice correspondant (e-hk, e-zpz…).
const corrOf = (id: string) => CHAPTERS.flatMap((c) => c.items).find((i) => i.kind === 'Exercice' && i.id === 'ex-' + id.slice(2))?.correction;
const exercises: Exercise[] = EXERCISES.map((e) => ({
  id: e.id, chapter: planOf(e.chapter, e.number).id, level: e.level, title: e.title, statement: e.statement, hint: e.hint, solution: e.solution,
  uses: [sourceItemFor(e.chapter, e.number)], origin: 'ajoutee' as const, ...(corrOf(e.id) ? { correction: corrOf(e.id)! } : {}),
}));
/** Démonstrations exigées (§9.4) qui existent déjà. */
export const PARITY_PROOFS = ['lagrange', 'generateur-cyclique', 'image-noyau', 'iso1', 'universelle', 'groupe-quotient'];
/** Théorèmes et propositions encore sans démonstration (tableau de parité §9.4) : à rédiger en 6.1b d'après les Démos manuscrites. */
export const PARITY_GAPS = ['sg-cyclique', 'isomorphisme', 'automorphismes', 'parite-decomposition', 'ideal-operations', 'iso-anneaux'];
export const algebre: ModuleContent = { chapters, exercises, flashcards: [], quiz: [], parityProofs: PARITY_PROOFS, parityGaps: PARITY_GAPS };
