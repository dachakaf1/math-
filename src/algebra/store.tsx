import { useCallback, useState, type ReactNode } from 'react';
import { load, save } from '../core/store';
/** Passerelle : les jeux de Jabr écrivent dans la progression Math L3 du module Algèbre (clé mathl3:algebre:v1). */
const SK = 'mathl3:algebre:scores';
const readScores = (): Record<string, number> => { try { const o = JSON.parse(localStorage.getItem(SK) || '{}'); return typeof o === 'object' && o ? o : {}; } catch { return {}; } };
let toastFn: (t: string) => void = () => {};
export function useJabrStore() {
  const [scores, setScores] = useState(readScores);
  const setScore = useCallback((game: string, score: number) => {
    const cur = readScores()[game] ?? 0; if (score <= cur) return;
    const n = { ...readScores(), [game]: score }; try { localStorage.setItem(SK, JSON.stringify(n)); } catch { /* ignore */ }
    const p = load('algebre'); save('algebre', { ...p, xp: p.xp + (score - cur) }); setScores(n);
    window.dispatchEvent(new Event('mathl3:progress'));
  }, []);
  const toast = useCallback((text: string) => toastFn(text), []);
  return { scores, setScore, toast, sound: true } as const;
}
export function JabrProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<string | null>(null);
  toastFn = (x) => { setT(x); window.setTimeout(() => setT(null), 2200); };
  return <>{children}{t && <div className="jb-toast ok" role="status" style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>{t}</div>}</>;
}
