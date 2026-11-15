import { describe, it, expect } from 'vitest';
import { CONTENT } from './modules';
import { allItems } from './content';
import { choiceFor, scramble, type Pool } from './trainer';
describe('démonstrations à compléter', () => {
  for (const [name, c] of Object.entries(CONTENT)) {
    const proofs = allItems(c).filter((i) => i.proof);
    const pool: Pool = proofs.flatMap((i) => i.proof!.steps.map((text) => ({ from: i.id, text })));
    it(`${name} : chaque étape donne une question valide (bonne réponse unique, leurres distincts)`, () => {
      for (const i of proofs) for (let k = 1; k < i.proof!.steps.length; k++) {
        const q = choiceFor(i.id, i.proof!.steps, k, pool);
        expect(q.options.length, `${i.id} étape ${k}`).toBeGreaterThanOrEqual(2);
        expect(new Set(q.options).size).toBe(q.options.length);
        expect(q.options[q.answer]).toBe(i.proof!.steps[k]);
      }
    });
    it(`${name} : l'ordre de départ n'est jamais déjà correct`, () => {
      for (const i of proofs) { const p = scramble(i.id, i.proof!.steps.length); expect([...p].sort((a, b) => a - b)).toEqual(p.map((_, k) => k)); expect(p.some((v, k) => v !== k)).toBe(true); }
    });
  }
  it('mélange reproductible', () => { expect(scramble('x', 6)).toEqual(scramble('x', 6)); });
});
