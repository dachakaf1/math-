export type Origin = 'cours' | 'ajoutee' | 'admise';
export type Item = {
  id: string; kind: 'definition' | 'theoreme' | 'proposition' | 'corollaire' | 'exemple' | 'remarque';
  number: string; title: string; body: string; // texte + LaTeX ($...$ et $$...$$)
  proof?: { origin: Origin; steps: string[]; visualSteps?: number[]; focus?: (string | undefined)[] }; // focus[i] = élément 3D mis en avant à l'étape i ; visualSteps[i] = état du schéma pour l'étape i
  visual?: { kind: 'svg' | 'three' | 'lab'; key: string; caption: string };
  example?: string; correction?: string; // exemple associé ; correction d'une erreur du cours manuscrit
};
export type Chapter = { id: string; title: string; summary: string; sections: { id: string; title: string; items: Item[] }[] };
export type Exercise = { id: string; chapter: string; level: 1 | 2 | 3; title?: string; correction?: string; statement: string; hint?: string; solution: string[]; uses: string[]; origin: Origin };
export type Flashcard = { id: string; front: string; back: string };
export type Question = { id: string; q: string; options: string[]; answer: number; explain: string };
export type ModuleContent = { chapters: Chapter[]; exercises: Exercise[]; flashcards: Flashcard[]; quiz: Question[]; parityProofs?: string[]; parityGaps?: string[] /* théorèmes, propositions ou corollaires sans démonstration, déclarés */ };
export const KIND: Record<Item['kind'], string> = { definition: 'Définition', theoreme: 'Théorème', proposition: 'Proposition', corollaire: 'Corollaire', exemple: 'Exemple', remarque: 'Remarque' };
export const allItems = (c: ModuleContent): Item[] => c.chapters.flatMap((ch) => ch.sections.flatMap((s) => s.items));
/** Théorèmes, propositions et corollaires sans démonstration (tableau de parité, §9.4). */
export const missingProofs = (c: ModuleContent): string[] => allItems(c).filter((i) => ['theoreme', 'proposition', 'corollaire'].includes(i.kind) && !i.proof).map((i) => i.id);
/** Tous les compteurs affichés viennent d'ici, jamais écrits en dur. */
export const stats = (c: ModuleContent) => { const it = allItems(c); return { chapters: c.chapters.length, items: it.length, proofs: it.filter((i) => i.proof).length, exercises: c.exercises.length, cards: c.flashcards.length, quiz: c.quiz.length }; };
