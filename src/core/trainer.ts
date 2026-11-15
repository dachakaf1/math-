/** Logique des « démonstrations à compléter » : deux exercices générés automatiquement à partir des étapes de chaque preuve. */
export type Pool = { from: string; text: string }[];
const hash = (s: string) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed: number) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
/** Mélange reproductible : le même exercice donne toujours le même mélange (pas de scintillement à l'affichage). */
export function shuffle<T>(a: T[], seed: string): T[] {
  const r = rng(hash(seed)); const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j]!, b[i]!]; }
  return b;
}
export type Choice = { options: string[]; answer: number };
/** « Quelle est l'étape suivante ? » pour l'étape k (k ≥ 1). Leurres : étapes à venir de la même preuve, puis étapes d'autres preuves, puis étapes déjà vues. */
export function choiceFor(id: string, steps: string[], k: number, pool: Pool): Choice {
  const right = steps[k]!; const used = new Set([right]); const decoys: string[] = [];
  const candidates = [...steps.slice(k + 1), ...shuffle(pool.filter((p) => p.from !== id).map((p) => p.text), id + k), ...steps.slice(0, k)];
  for (const t of candidates) { if (decoys.length === 2) break; if (!used.has(t)) { used.add(t); decoys.push(t); } }
  const options = shuffle([right, ...decoys], `${id}:${k}`);
  return { options, answer: options.indexOf(right) };
}
/** Ordre de départ des étapes (au moins la moitié des étapes déplacées, jamais déjà correct). */
export function scramble(id: string, n: number, round = 0): number[] {
  const id0 = Array.from({ length: n }, (_, i) => i);
  for (let t = 0; t < 8; t++) { const p = shuffle(id0, `${id}#${round}#${t}`); if (n < 2 || p.filter((v, i) => v !== i).length >= Math.min(n, Math.ceil(n / 2) + 1)) return p; }
  return [...id0].reverse();
}
