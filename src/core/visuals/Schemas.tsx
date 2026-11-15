import { useState } from 'react';
import { Frame, Dot, Txt, T } from './svg';
const LIME = '#B8F34A';
const PTS: [number, number][] = [[90, 100], [160, 65], [215, 120], [150, 130]];
/** Théorème 1.1.11 : A = réunion des O_x. États : 0 A et points · 1 un O_x par point · 2 O_x ⊂ A · 3 réunion = A. */
export function UnionOuverts({ step }: { step: number }) {
  return (<Frame label="Une partie A, quatre de ses points, et autour de chaque point un ouvert contenu dans A dont la réunion redonne A.">
    <ellipse cx="160" cy="100" rx="130" ry="75" fill="var(--primary)" fillOpacity={step === 3 ? 0.4 : 0.15} stroke="var(--primary)" strokeWidth="2.5" style={{ transition: T }} />
    <Txt x={30} y={30} c="var(--primary)">A</Txt>
    {PTS.map(([x, y], i) => (<g key={i}>
      <circle cx={x} cy={y} r="30" fill="none" strokeWidth="2" strokeDasharray="6 4" stroke={step === 1 ? LIME : 'var(--secondary)'} style={{ transition: T }} opacity={step >= 1 ? 1 : 0} />
      <Dot x={x} y={y} name="x" /></g>))}
    <Txt x={30} y={190}>{['A et quelques points x', 'un ouvert O_x (pointillés) autour de chaque x', 'chaque O_x est contenu dans A', 'A = réunion des O_x : A est ouvert'][step]}</Txt>
  </Frame>);
}
/** Labo : l'intervalle ]x−ε, x+ε[ est-il contenu dans l'ouvert O = ]0, 3[ ? */
export function VoisinageEps() {
  const [x, setX] = useState(1.2); const [e, setE] = useState(1.5);
  const px = (v: number) => 20 + (v + 1) * 56; const ok = x - e >= 0 && x + e <= 3;
  return (<div><Frame label={`Droite réelle, ouvert ]0,3[, point x=${x} et intervalle de rayon ${e}.`} h={110}>
    <line x1="10" x2="310" y1="70" y2="70" stroke="var(--muted)" />
    <rect x={px(0)} y="55" width={px(3) - px(0)} height="30" fill="var(--primary)" fillOpacity=".18" stroke="var(--primary)" strokeWidth="2.5" />
    <Txt x={px(0) - 6} y={102} c="var(--primary)">0</Txt><Txt x={px(3) - 3} y={102} c="var(--primary)">3</Txt>
    <rect x={px(x - e)} y="40" width={2 * e * 56} height="14" fill="none" strokeWidth="2.5" strokeDasharray="6 4" stroke={ok ? LIME : '#F08AA0'} />
    <Dot x={px(x)} y={70} name="x" /></Frame>
    <label className="lab">x = {x.toFixed(1)} <input type="range" min="0.1" max="2.9" step="0.1" value={x} onChange={(ev) => setX(+ev.target.value)} aria-label="Position de x" /></label>{' '}
    <label className="lab">ε = {e.toFixed(1)} <input type="range" min="0.1" max="2" step="0.1" value={e} onChange={(ev) => setE(+ev.target.value)} aria-label="Rayon epsilon" /></label>
    <p aria-live="polite">{ok ? ']x−ε, x+ε[ ⊂ ]0,3[ : oui (trait plein vert).' : ']x−ε, x+ε[ ⊄ ]0,3[ : non (trait rose pointillé). Réduis ε.'} Pour tout x de ]0,3[, un ε convient : c’est ce que veut dire « ouvert ».</p></div>);
}
/** Version 2D de secours de la scène 3D (pas de WebGL). */
export function Boule2D({ step }: { step: number }) {
  return (<Frame label="Boule ouverte autour d’un point, avec un petit voisinage contenu dedans (vue 2D)."><circle cx="160" cy="100" r="80" fill="var(--primary)" fillOpacity=".2" stroke="var(--primary)" strokeWidth="2.5" />
    {step === 1 && <circle cx="185" cy="85" r="28" fill={LIME} fillOpacity=".3" stroke={LIME} strokeDasharray="6 4" />}<Dot x={185} y={85} name="x" /></Frame>);
}
