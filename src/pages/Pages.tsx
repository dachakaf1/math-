import { useState } from 'react';
import Rich from '../core/Rich';
import ProofTrainer from './ProofTrainer';
import type { Pool } from '../core/trainer';
import VisualFrame from '../core/visuals/VisualFrame';
import { KIND, allItems, stats, type Item, type ModuleContent, type Origin } from '../core/content';
import { award, useProgress } from '../core/progress';
import { levelOf } from '../core/store';
import type { ModuleId } from '../core/types';
type P = { module: ModuleId; c: ModuleContent };
const ORIGIN: Record<Origin, string> = { cours: 'Preuve du cours', ajoutee: 'Démonstration ajoutée', admise: 'Admise dans le cours' };

/** Chapitre contenant une notion (pour les liens exercice ↔ cours). */
const chapterOf = (c: ModuleContent, id: string) => c.chapters.find((ch) => ch.sections.some((sec) => sec.items.some((i) => i.id === id)));

function Proof({ item, module, pool, onStep }: { item: Item; module: ModuleId; pool: Pool; onStep: (n: number, focus?: string) => void }) {
  const [p, up] = useProgress(module); const [step, setStep] = useState(-1); const [train, setTrain] = useState(false);
  const pr = item.proof!; const last = pr.steps.length - 1;
  const go = (n: number) => { setStep(n); onStep(pr.visualSteps?.[n] ?? 0, pr.focus?.[n]); if (n === last) up((p) => award(p, 'proofs', item.id, 5)); };
  if (train) return <ProofTrainer id={item.id} steps={pr.steps} pool={pool} trained={p.trained.includes(item.id)} onDone={() => up((x) => award(x, 'trained', item.id, 8))} onClose={() => setTrain(false)} />;
  if (step < 0) return <div className="row"><button className="btn sm" onClick={() => go(0)}>Voir la démonstration</button><button className="btn sm ghost" onClick={() => setTrain(true)}>S’entraîner</button></div>;
  return (<div className="proof"><span className="badge on">{ORIGIN[pr.origin]}</span>
    <div aria-live="polite"><strong>Étape {step + 1}/{pr.steps.length}</strong>
      {pr.steps.slice(0, step + 1).map((s, i) => <div key={i} className={i === step ? 'cur' : 'old'}><Rich text={s} /></div>)}</div>
    <div className="row"><button className="btn sm" disabled={step === 0} onClick={() => go(step - 1)}>Précédent</button>
      <button className="btn sm" disabled={step === last} onClick={() => go(step + 1)}>Suivant</button>
      <button className="btn sm ghost" onClick={() => setTrain(true)}>S’entraîner</button><button className="btn sm ghost" onClick={() => setStep(-1)}>Fermer</button></div></div>);
}
export function Course({ module, c, chapter }: P & { chapter?: string }) {
  const [p, up] = useProgress(module); const [vs, setVs] = useState<Record<string, number>>({}); const [fc, setFc] = useState<Record<string, string | undefined>>({});
  const pool: Pool = allItems(c).flatMap((x) => (x.proof ? x.proof.steps.map((text) => ({ from: x.id, text })) : []));
  const ch = c.chapters.find((x) => x.id === chapter) ?? c.chapters[0];
  if (!ch) return <Empty t="Aucun chapitre pour l’instant" />;
  return (<div className="layout"><nav className="toc" aria-label="Sommaire">{c.chapters.map((x) => <a key={x.id} href={`#/${module}/cours/${x.id}`} aria-current={x.id === ch.id ? 'page' : undefined}>{x.id}. {x.title}</a>)}</nav>
    <article><h2>{ch.id}. {ch.title}</h2><p className="stat">{ch.summary}</p>
      {ch.sections.map((s) => <section key={s.id}><h3>{/^\d/.test(s.id) ? `${s.id} ` : `${s.id} — `}{s.title}</h3>{s.items.map((i) => (
        <div key={i.id} className={`notion ${i.kind}`} id={i.id}><div className="lab">{KIND[i.kind]} {i.number}</div><h4>{i.title}</h4><Rich text={i.body} />
          {i.example && <div className="extra example"><strong>Exemple.</strong> <Rich text={i.example} /></div>}
          
          {i.correction && <div className="extra correction"><strong>Correction du cahier.</strong> <Rich text={i.correction} /></div>}
          {i.visual && <VisualFrame v={i.visual} step={i.proof ? vs[i.id] ?? 0 : undefined} focus={fc[i.id]} />}
          {i.proof && <Proof item={i} module={module} pool={pool} onStep={(n, f) => { setVs({ ...vs, [i.id]: n }); setFc({ ...fc, [i.id]: f }); }} />}
          {c.exercises.some((x) => x.uses.includes(i.id)) && <a className="btn sm ghost" href={`#/${module}/exos`}>Exercices liés ({c.exercises.filter((x) => x.uses.includes(i.id)).length})</a>}
          <button className="btn sm ghost" disabled={p.read.includes(i.id)} onClick={() => up((x) => award(x, 'read', i.id, 2))}>{p.read.includes(i.id) ? 'Lu ✓' : 'Marquer comme lu'}</button></div>))}</section>)}</article></div>);
}
export function Exercises({ module, c }: P) {
  const [p, up] = useProgress(module); const [open, setOpen] = useState<Record<string, number>>({});
  if (!c.exercises.length) return <Empty t="Aucun exercice pour l’instant" />;
  return (<div className="list">{c.exercises.map((x) => { const n = open[x.id] ?? 0; const done = p.exercises.includes(x.id); return (
    <div key={x.id} className="notion"><div className="lab">Niveau {x.level} · {done ? 'réussi' : 'non réussi'}{x.origin === 'ajoutee' ? ' · corrigé à relire' : ''}</div>
      {x.title && <h4><Rich text={x.title} /></h4>}<Rich text={x.statement} />
      {x.uses.map((u) => { const ch = chapterOf(c, u); const it = ch && allItems(c).find((i) => i.id === u); return ch && it ? <p key={u} className="stat">Notion du cours : <a className="it" href={`#/${module}/cours/${ch.id}`}>{KIND[it.kind]} {it.number} · {it.title}</a></p> : null; })}
      {x.correction && <div className="extra correction"><strong>Correction du cahier.</strong> <Rich text={x.correction} /></div>}{x.hint && <details><summary>Indice</summary><Rich text={x.hint} /></details>}
      {n > 0 && x.solution.slice(0, n).map((s, i) => <div key={i} className="old"><Rich text={s} /></div>)}
      <div className="row">{n < x.solution.length && <button className="btn sm" onClick={() => setOpen({ ...open, [x.id]: n + 1 })}>{n ? 'Étape suivante' : 'Voir la solution'}</button>}
        <button className="btn sm ghost" disabled={done} onClick={() => up((q) => award(q, 'exercises', x.id, 5 + 5 * x.level))}>{done ? 'Réussi ✓' : 'Marquer réussi'}</button></div></div>); })}</div>);
}
export function Cards({ module, c }: P) {
  const [p, up] = useProgress(module); const [i, setI] = useState(0); const [flip, setFlip] = useState(false);
  const f = c.flashcards[i]; if (!f) return <Empty t="Aucune carte pour l’instant" />;
  const next = () => { setFlip(false); setI((i + 1) % c.flashcards.length); };
  return (<div className="list"><p className="stat">Carte {i + 1}/{c.flashcards.length} · {p.cards.length} maîtrisée(s)</p>
    <button className="fcard" onClick={() => setFlip(!flip)} aria-label="Retourner la carte"><Rich text={flip ? f.back : f.front} /></button>
    <div className="row"><button className="btn sm" onClick={() => { up((q) => award(q, 'cards', f.id, 3)); next(); }}>Je savais</button><button className="btn sm ghost" onClick={next}>À revoir</button></div></div>);
}
export function Quiz({ c }: P) {
  const [i, setI] = useState(0); const [pick, setPick] = useState<number | null>(null); const [score, setScore] = useState(0);
  if (!c.quiz.length) return <Empty t="Aucune question pour l’instant" />;
  const q = c.quiz[i];
  if (!q) return (<div className="empty"><h2>Terminé : {score}/{c.quiz.length}</h2><button className="btn" onClick={() => { setI(0); setPick(null); setScore(0); }}>Recommencer</button></div>);
  return (<div className="list"><p className="stat">Question {i + 1}/{c.quiz.length}</p><h3>{q.q}</h3>
    {q.options.map((o, k) => <button key={k} className={'opt' + (pick !== null ? (k === q.answer ? ' ok' : k === pick ? ' ko' : '') : '')} disabled={pick !== null} onClick={() => { setPick(k); if (k === q.answer) setScore(score + 1); }}>{o}{pick !== null && k === q.answer ? ' ✓' : ''}</button>)}
    {pick !== null && <><p>{q.explain}</p><button className="btn sm" onClick={() => { setI(i + 1); setPick(null); }}>Suite</button></>}</div>);
}
export function Profile({ module, c }: P) {
  const [p] = useProgress(module); const s = stats(c); const L = levelOf(p.xp);
  const row = (n: string, a: number, b: number) => <li key={n}>{n} : {a}/{b}</li>;
  return (<div className="list"><h2>Niveau {L}</h2><p className="stat">{p.xp} XP · prochain niveau à {(50 * (L + 1) * L) / 2} XP</p>
    <ul>{row('Notions lues', p.read.length, s.items)}{row('Démonstrations terminées', p.proofs.length, s.proofs)}{row('Démonstrations travaillées (entraînement)', p.trained.length, s.proofs)}{row('Exercices réussis', p.exercises.length, s.exercises)}{row('Cartes maîtrisées', p.cards.length, s.cards)}</ul></div>);
}
export const Empty = ({ t }: { t: string }) => <div className="empty"><h2>{t}</h2><p>Cette section se remplit avec les données du module ou à une phase ultérieure (jeux et labos : phases 3 et 7).</p></div>;
export { allItems };
