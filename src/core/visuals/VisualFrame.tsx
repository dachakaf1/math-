import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { visualMeta } from './keys';
import { UnionOuverts, VoisinageEps, Boule2D } from './Schemas';
const Scene3D = lazy(() => import('./Scene3D'));
const AlgScene = lazy(() => import('../../algebra/AlgScene')); // scènes 3D de l'Algèbre (Jabr) // Three.js n'est téléchargé que si une scène 3D apparaît à l'écran
export type VisualRef = { kind: 'svg' | 'three' | 'lab'; key: string; caption: string };
export default function VisualFrame({ v, step, focus }: { v: VisualRef; step?: number; focus?: string }) {
  const meta = visualMeta(v.key); const [own, setOwn] = useState(0); const [seen, setSeen] = useState(false); const [fail, setFail] = useState(false);
  const box = useRef<HTMLElement>(null); const onFail = useCallback(() => setFail(true), []);
  useEffect(() => { const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setSeen(true); io.disconnect(); } }); if (box.current) io.observe(box.current); return () => io.disconnect(); }, []);
  if (!meta) return <p role="alert">Schéma inconnu : {v.key}</p>;
  const s = Math.min(step ?? own, meta.steps - 1);
  return (<figure ref={box} className="fig" data-visual={v.key} data-step={s}>
    {v.key.startsWith('alg-') && (seen ? <Suspense fallback={<div className="skel">Chargement de la scène 3D…</div>}><AlgScene scene={v.key.slice(4)} focus={focus} title={v.caption} /></Suspense> : <div className="skel" />)}
    {v.key === 'union-ouverts' && <UnionOuverts step={s} />}{v.key === 'voisinage-eps' && <VoisinageEps />}
    {v.key === 'boule-3d' && (fail ? <Boule2D step={s} /> : seen ? <Suspense fallback={<div className="skel">Chargement de la scène 3D…</div>}><Scene3D step={s} onFail={onFail} /></Suspense> : <div className="skel" />)}
    <figcaption>{v.caption}</figcaption>
    {step === undefined && meta.steps > 1 && v.kind !== 'lab' && <div className="row">{Array.from({ length: meta.steps }, (_, i) => <button key={i} className={'btn sm' + (i === s ? '' : ' ghost')} onClick={() => setOwn(i)}>État {i + 1}</button>)}</div>}
  </figure>);
}
