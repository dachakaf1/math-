import { useState } from 'react';
import Rich from '../core/Rich';
import { choiceFor, scramble, type Pool } from '../core/trainer';
type Props = { id: string; steps: string[]; pool: Pool; trained: boolean; onDone: () => void; onClose: () => void };

function Choose({ id, steps, pool, onDone }: Pick<Props, 'id' | 'steps' | 'pool' | 'onDone'>) {
  const [k, setK] = useState(1); const [pick, setPick] = useState<number | null>(null); const [score, setScore] = useState(0); const total = steps.length - 1;
  if (k > total) return (<div aria-live="polite"><p><strong>Terminé : {score}/{total} étapes trouvées.</strong></p><button className="btn sm" onClick={() => { setK(1); setPick(null); setScore(0); }}>Recommencer</button></div>);
  const q = choiceFor(id, steps, k, pool);
  const next = () => { if (k === total) onDone(); setK(k + 1); setPick(null); };
  return (<div><p className="stat">Question {k}/{total} · étapes déjà établies :</p>
    {steps.slice(0, k).map((s, i) => <div key={i} className="old"><Rich text={s} /></div>)}
    <p><strong>Quelle est l’étape suivante ?</strong></p>
    {q.options.map((o, i) => <button key={i} className={'opt' + (pick !== null ? (i === q.answer ? ' ok' : i === pick ? ' ko' : '') : '')} disabled={pick !== null} onClick={() => { setPick(i); if (i === q.answer) setScore(score + 1); }}><Rich text={o} /></button>)}
    {pick !== null && <div aria-live="polite"><p>{pick === q.answer ? 'Correct.' : 'Pas tout à fait : la bonne étape est celle marquée ✓.'}</p><button className="btn sm" onClick={next}>{k === total ? 'Terminer' : 'Suite'}</button></div>}</div>);
}
function Order({ id, steps, onDone }: Pick<Props, 'id' | 'steps' | 'onDone'>) {
  const [round, setRound] = useState(0); const [ord, setOrd] = useState(() => scramble(id, steps.length)); const [checked, setChecked] = useState(false);
  const good = ord.every((v, i) => v === i);
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= ord.length) return; const n = [...ord]; [n[i], n[j]] = [n[j]!, n[i]!]; setOrd(n); setChecked(false); };
  return (<div><p><strong>Remets les étapes de la démonstration dans l’ordre.</strong></p>
    {ord.map((v, i) => (<div key={v} data-idx={v} className={'ord' + (checked ? (v === i ? ' ok' : ' ko') : '')}>
      <div className="row" style={{ flexDirection: 'column' }}><button className="btn sm ghost" aria-label={`Monter l’étape en position ${i + 1}`} disabled={i === 0} onClick={() => move(i, -1)}>↑</button><button className="btn sm ghost" aria-label={`Descendre l’étape en position ${i + 1}`} disabled={i === ord.length - 1} onClick={() => move(i, 1)}>↓</button></div>
      <div style={{ flex: 1 }}><strong>{i + 1}.</strong> <Rich text={steps[v]!} />{checked && <span>{v === i ? ' ✓ bien placée' : ' ✗ mal placée'}</span>}</div></div>))}
    <div className="row"><button className="btn sm" onClick={() => { setChecked(true); if (good) onDone(); }}>Vérifier</button>
      <button className="btn sm ghost" onClick={() => { setRound(round + 1); setOrd(scramble(id, steps.length, round + 1)); setChecked(false); }}>Mélanger à nouveau</button></div>
    <p aria-live="polite">{checked ? (good ? 'Bravo : l’ordre est correct.' : 'Pas encore : corrige les étapes marquées ✗.') : ''}</p></div>);
}
export default function ProofTrainer({ id, steps, pool, trained, onDone, onClose }: Props) {
  const [mode, setMode] = useState<'menu' | 'choix' | 'ordre'>('menu');
  return (<div className="proof"><strong>S’entraîner sur cette démonstration</strong> {trained && <span className="badge on">déjà travaillée</span>}
    {mode === 'menu' && <div className="row"><button className="btn sm" onClick={() => setMode('choix')}>Choisir l’étape suivante</button><button className="btn sm" onClick={() => setMode('ordre')}>Remettre dans l’ordre</button></div>}
    {mode === 'choix' && <Choose id={id} steps={steps} pool={pool} onDone={onDone} />}
    {mode === 'ordre' && <Order id={id} steps={steps} onDone={onDone} />}
    <div className="row">{mode !== 'menu' && <button className="btn sm ghost" onClick={() => setMode('menu')}>Changer d’exercice</button>}<button className="btn sm ghost" onClick={onClose}>Fermer</button></div>
    <p className="stat">{trained ? 'XP déjà obtenu pour cette démonstration.' : '8 XP, une seule fois, quand tu termines une série.'}</p></div>);
}
