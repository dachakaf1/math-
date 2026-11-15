import { describe, it, expect } from 'vitest';
import { CONTENT } from './modules';
import { validate } from './validate';
import katex from 'katex';
import { stats, allItems, missingProofs } from './content';
describe('contenu', () => {
  for (const [name, c] of Object.entries(CONTENT)) it(`${name} est valide`, () => expect(validate(name, c)).toEqual([]));
  it('compteurs calculés à partir des données', () => { const c = CONTENT.topologie!; const st = stats(c); expect(st.items).toBe(allItems(c).length); expect(st.proofs).toBe(allItems(c).filter((i) => i.proof).length); expect(st.exercises).toBe(c.exercises.length); expect(st.proofs).toBeGreaterThanOrEqual(c.parityProofs!.length); });
  it('parité topologie : les 10 démonstrations du cours sont présentes', () => { const c = CONTENT.topologie!; expect(c.parityProofs?.length).toBe(10); expect(validate('t', c)).toEqual([]); });
  it('validateur détecte les erreurs', () => {
    const bad = { chapters: [], exercises: [{ id: 'x', chapter: '1', level: 1 as const, statement: '', solution: [], uses: ['nope'], origin: 'cours' as const }], flashcards: [], quiz: [{ id: 'q', q: '', options: ['a'], answer: 3, explain: '' }] };
    expect(validate('t', bad).length).toBe(3);
  });
  it('toutes les formules LaTeX compilent', () => {
    const bad: string[] = [];
    const check = (where: string, t: string) => { for (const line of t.split('\n')) for (const m of line.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/)) { if (!m.startsWith('$') || m.length < 2) continue; const d = m.startsWith('$$'); try { katex.renderToString(d ? m.slice(2, -2) : m.slice(1, -1), { throwOnError: true }); } catch (e) { bad.push(`${where}: ${m} -> ${(e as Error).message}`); } } };
    for (const [name, c] of Object.entries(CONTENT)) {
      allItems(c).forEach((i) => { check(`${name}/${i.id}`, [i.title, i.body, i.example ?? '', i.correction ?? ''].join('\n')); i.proof?.steps.forEach((x, k) => check(`${name}/${i.id}#${k}`, x)); });
      c.exercises.forEach((x) => { check(`${x.id}`, [x.title ?? '', x.statement, x.hint ?? '', x.correction ?? ''].join('\n')); x.solution.forEach((y, k) => check(`${x.id}#${k}`, y)); });
      c.flashcards.forEach((f) => check(f.id, f.front + '\n' + f.back)); c.quiz.forEach((q) => check(q.id, q.q + '\n' + q.options.join('\n') + '\n' + q.explain));
    }
    expect(bad).toEqual([]);
  });
  it('tableau de parité : aucune démonstration manquante non déclarée', () => {
    for (const [name, c] of Object.entries(CONTENT)) {
      const gaps = missingProofs(c); const declared = c.parityGaps ?? [];
      expect(gaps.filter((g) => !declared.includes(g)), `${name} : sans démonstration et non déclarés`).toEqual([]);
      expect(declared.filter((g) => !gaps.includes(g)), `${name} : déclarés mais démontrés ou inexistants (retire-les)`).toEqual([]);
    }
  });
  it('chaque exercice renvoie à une notion existante', () => {
    for (const [name, c] of Object.entries(CONTENT)) { const ids = allItems(c).map((i) => i.id); c.exercises.forEach((x) => { expect(x.uses.length, `${name}/${x.id}`).toBeGreaterThan(0); x.uses.forEach((u) => expect(ids, `${name}/${x.id} -> ${u}`).toContain(u)); }); }
  });
});
