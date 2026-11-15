import type { ModuleId } from './types';
export type Progress = { v: 1; xp: number; read: string[]; proofs: string[]; exercises: string[]; trained: string[]; cards: string[]; achievements: string[]; last: string };
export const defaults = (): Progress => ({ v: 1, xp: 0, read: [], proofs: [], exercises: [], trained: [], cards: [], achievements: [], last: '' });
const key = (m: ModuleId) => `mathl3:${m}:v1`;
const strs = (x: unknown): string[] => (Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string') : []);

/** Valide une donnée brute : tout champ invalide retombe sur sa valeur par défaut. */
export function sanitize(raw: unknown): Progress {
  const d = defaults();
  if (typeof raw !== 'object' || raw === null) return d;
  const o = raw as Record<string, unknown>;
  const xp = typeof o.xp === 'number' && Number.isFinite(o.xp) && o.xp >= 0 ? Math.floor(o.xp) : 0;
  return { v: 1, xp, read: strs(o.read), proofs: strs(o.proofs), exercises: strs(o.exercises), trained: strs(o.trained), cards: strs(o.cards), achievements: strs(o.achievements), last: typeof o.last === 'string' ? o.last : '' };
}
export function load(m: ModuleId): Progress {
  try {
    const txt = localStorage.getItem(key(m));
    if (!txt) return defaults();
    try { return sanitize(JSON.parse(txt)); }
    catch { try { localStorage.setItem(key(m) + ':corrompu', txt); } catch { /* ignore */ } return defaults(); }
  } catch { return defaults(); }
}
export function save(m: ModuleId, p: Progress): void { try { localStorage.setItem(key(m), JSON.stringify(p)); } catch { /* stockage indisponible */ } }
/** Niveau N atteint à partir de 50·N·(N−1)/2 XP (N=1 : 0 XP, N=2 : 50, N=3 : 150…). */
export const levelOf = (xp: number): number => { let n = 1; while ((50 * (n + 1) * n) / 2 <= xp) n++; return n; };
