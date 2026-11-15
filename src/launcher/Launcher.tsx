import { MODULES, CONTENT, HERO } from '../core/modules';
import { stats } from '../core/content';
import { load } from '../core/store';
import { Topbar, useProgressTick } from '../core/ui';
import Hero3D from '../core/visuals/Hero3D';
import type { ModuleId } from '../core/types';

const Motif = ({ id }: { id: ModuleId }) => {
  const s = { fill: 'none', stroke: 'var(--primary)', strokeWidth: 2.5 } as const;
  return (<svg viewBox="0 0 200 110" role="img" aria-label={`Motif du module ${id}`}>
    {id === 'topologie' && (<g><circle cx="100" cy="55" r="40" {...s} /><circle cx="100" cy="55" r="22" {...s} strokeDasharray="5 5" className="pulse" /><circle cx="100" cy="55" r="4" fill="#fff" /></g>)}
    {id === 'mesure' && (<g {...s}><path d="M20 95h30V75h30V50h30V30h30V15h30" /><path d="M20 95h160" opacity=".4" /><rect x="80" y="50" width="30" height="45" fill="var(--primary)" opacity=".2" className="pulse" /></g>)}
    {id === 'algebre' && (<g><circle cx="100" cy="55" r="38" {...s} opacity=".4" />{[0, 120, 240].map((a) => { const r = ((a - 90) * Math.PI) / 180; return <circle key={a} cx={100 + 38 * Math.cos(r)} cy={55 + 38 * Math.sin(r)} r="7" fill="var(--primary)" className="pulse" />; })}</g>)}
  </svg>);
};
export default function Launcher() {
  useProgressTick();
  const xp = MODULES.reduce((t, m) => t + load(m.id).xp, 0); const t = HERO.topologie;
  return (<div data-module="topologie"><Topbar title="Math L3" xp={xp} />
    <main className="wrap">
      <section className="hero"><div><div className="eyebrow">Licence 3 · Semestre 5</div>
        <h1>Math L3</h1><h2>Les maths de L3, <em className="it">en voyant.</em></h2>
        <p>Trois modules de cours, avec démonstrations pas à pas et schémas animés. Ta progression reste sur cet appareil. Réalisé par Iliass Errouifi.</p>
        <div className="acts"><a className="btn" href="#/topologie/cours">Explorer le cours →</a><a className="btn ghost" href="#/topologie">Ouvrir la Topologie</a></div></div>
        <Hero3D shape={t.shape} line={t.line} fill={t.fill} /></section>
      <section className="sec"><div className="eyebrow">Modules</div><h2>Choisis ton <em className="it">espace.</em></h2></section>
      <div className="grid">
        {MODULES.map((m) => { const p = load(m.id); const s = stats(CONTENT[m.id]!); return (
          <a key={m.id} href={`#/${m.id}`} data-module={m.id} className="card">
            <span className={'badge' + (m.status === 'actif' ? ' on' : '')}>{m.status === 'actif' ? 'Disponible' : 'En préparation'}</span>
            <Motif id={m.id} /><h2>{m.title}</h2><p>{m.tagline}</p>
            <span className="stat">{`${s.chapters} chapitre(s) · ${s.items} notions · ${s.proofs} preuves · ${s.exercises} exercices`} · {p.xp} XP</span>
            <span className="go">{p.last ? 'Reprendre →' : 'Ouvrir le module →'}</span></a>); })}
      </div></main></div>);
}
