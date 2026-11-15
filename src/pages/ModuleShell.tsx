import { useEffect, useState } from 'react';
import { CONTENT, HERO, getModule } from '../core/modules';
import { TABS, type ModuleId, type TabId } from '../core/types';
import { load } from '../core/store';
import { allItems, KIND } from '../core/content';
import { Topbar, useProgressTick } from '../core/ui';
import { lazy, Suspense } from 'react';
import { Course, Exercises, Cards, Quiz, Profile, Empty } from './Pages';
import ModuleHome from './ModuleHome';

const AlgPages = lazy(() => import('../algebra/AlgPages')); // labos et jeux 3D de l'Algèbre, chargés à la demande
const ICON: Record<TabId, string> = { cours: '§', labs: '⬡', jeux: '◆', exos: '✎', cartes: '▤', quiz: '?', profil: '♛' };
function Search({ module, onClose }: { module: ModuleId; onClose: () => void }) {
  const [q, setQ] = useState(''); const c = CONTENT[module]!;
  const hits = allItems(c).filter((i) => (i.title + i.number + i.body).toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  return (<div className="modal" role="dialog" aria-label="Recherche" onClick={onClose}><div className="box" onClick={(e) => e.stopPropagation()}>
    <input autoFocus placeholder="Chercher une notion…" value={q} onChange={(e) => setQ(e.target.value)} />
    {hits.map((i) => <a key={i.id} href={`#/${module}/cours/${c.chapters.find((ch) => ch.sections.some((s) => s.items.includes(i)))?.id}`} onClick={onClose}>{KIND[i.kind]} {i.number} · {i.title}</a>)}
    {!hits.length && <p className="stat">Aucun résultat.</p>}</div></div>);
}
export default function ModuleShell({ module, tab, rest }: { module: ModuleId; tab: TabId | null; rest: string[] }) {
  useProgressTick();
  const m = getModule(module)!; const c = CONTENT[module]!; const p = load(module);
  const [find, setFind] = useState(false);
  useEffect(() => { const f = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setFind((v) => !v); } if (e.key === 'Escape') setFind(false); }; window.addEventListener('keydown', f); return () => window.removeEventListener('keydown', f); }, []);
  const soon = m.status === 'bientot';
  const body = tab === null ? <ModuleHome module={module} c={c} /> : <div className="wrap">{soon ? <Empty t="Module en préparation" />
    : tab === 'cours' ? <Course module={module} c={c} chapter={rest[0]} /> : tab === 'exos' ? <Exercises module={module} c={c} />
    : tab === 'cartes' ? <Cards module={module} c={c} /> : tab === 'quiz' ? <Quiz module={module} c={c} />
    : module === 'algebre' && (tab === 'labs' || tab === 'jeux') ? <Suspense fallback={<Empty t="Chargement…" />}><AlgPages page={tab} /></Suspense>
    : tab === 'profil' ? <Profile module={module} c={c} /> : <Empty t={TABS.find(([id]) => id === tab)![1] + ' : bientôt'} />}</div>;
  const nav = (<nav className="pills" aria-label="Sections du module"><a href={`#/${module}`} aria-current={tab === null ? 'page' : undefined}><i aria-hidden="true">⌂</i>Accueil</a>
    {TABS.map(([id, name]) => <a key={id} href={`#/${module}/${id}`} aria-current={id === tab ? 'page' : undefined}><i aria-hidden="true">{ICON[id]}</i>{name}</a>)}</nav>);
  return (<div data-module={module}><Topbar title={HERO[module].name} nav={nav} xp={p.xp} onSearch={() => setFind(true)} />
    <main key={(tab ?? 'home') + rest.join('/')}>{body}</main>{find && <Search module={module} onClose={() => setFind(false)} />}</div>);
}
