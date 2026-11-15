import { useState } from 'react';
import { load, save, type Progress } from './store';
import type { ModuleId } from './types';
type List = 'read' | 'proofs' | 'exercises' | 'trained' | 'cards';
/** XP accordé une seule fois par élément (pas de farming). */
export const award = (p: Progress, list: List, id: string, xp: number): Progress =>
  p[list].includes(id) ? p : { ...p, [list]: [...p[list], id], xp: p.xp + xp, last: `${list}:${id}` };
export function useProgress(m: ModuleId) {
  const [p, setP] = useState(() => load(m));
  const update = (f: (x: Progress) => Progress) => setP((prev) => { const n = f(prev); save(m, n); queueMicrotask(() => window.dispatchEvent(new Event('mathl3:progress'))); return n; });
  return [p, update] as const;
}
