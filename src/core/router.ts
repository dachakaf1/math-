import { useEffect, useState } from 'react';
import { TABS, type ModuleId, type TabId } from './types';
import { getModule } from './modules';

export type Route =
  | { kind: 'home' }
  | { kind: 'module'; module: ModuleId; tab: TabId | null; rest: string[] };

/** Analyse pure d'un hash. Toute adresse inconnue renvoie vers un écran valide. */
export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const m = parts[0] ? getModule(parts[0]) : undefined;
  if (!m) return { kind: 'home' };
  const tab = TABS.find(([id]) => id === parts[1])?.[0] ?? null;
  return { kind: 'module', module: m.id, tab, rest: tab ? parts.slice(2) : [] };
}
export const go = (path: string) => { location.hash = '#/' + path; };

export function useRoute(): Route {
  const [r, setR] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const f = () => setR(parseHash(location.hash));
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return r;
}
