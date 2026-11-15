import { visualMeta } from './visuals/keys';
import { allItems, type ModuleContent } from './content';
/** Renvoie la liste des problèmes (vide = contenu valide). */
export function validate(name: string, c: ModuleContent): string[] {
  const e: string[] = []; const seen = new Set<string>();
  const uniq = (id: string) => { if (seen.has(id)) e.push(`${name}: id dupliqué ${id}`); seen.add(id); };
  const items = allItems(c);
  c.chapters.forEach((ch) => uniq(ch.id)); items.forEach((i) => { uniq(i.id); if (i.proof && i.proof.steps.length < 2) e.push(`${name}: preuve de ${i.id} < 2 étapes`);
    const m = i.visual ? visualMeta(i.visual.key) : undefined;
    if (i.visual && !m) e.push(`${name}: ${i.id} schéma inconnu ${i.visual.key}`);
    const vs = i.proof?.visualSteps;
    if (vs) { if (!m) e.push(`${name}: ${i.id} visualSteps sans schéma`); else if (vs.length !== i.proof!.steps.length || vs.some((n) => n < 0 || n >= m.steps)) e.push(`${name}: ${i.id} visualSteps invalides`); }
    if (i.visual && !i.visual.caption) e.push(`${name}: ${i.id} schéma sans légende`); });
  c.exercises.forEach((x) => { uniq(x.id); if (!x.solution.length) e.push(`${name}: ${x.id} sans solution`); x.uses.forEach((u) => { if (!items.some((i) => i.id === u)) e.push(`${name}: ${x.id} renvoie à ${u} inconnu`); }); });
  (c.parityProofs ?? []).forEach((id) => { const it = items.find((i) => i.id === id); if (!it) e.push(`${name}: parité : ${id} absent`); else if (!it.proof) e.push(`${name}: parité : démonstration manquante pour ${id}`); });
  c.flashcards.forEach((f) => uniq(f.id));
  c.quiz.forEach((q) => { uniq(q.id); if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) e.push(`${name}: ${q.id} bonne réponse invalide`); });
  return e;
}
