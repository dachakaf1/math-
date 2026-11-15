import Rich from '../core/Rich';
import Hero3D from '../core/visuals/Hero3D';
import { HERO } from '../core/modules';
import { stats, type ModuleContent } from '../core/content';
import { levelOf } from '../core/store';
import { load } from '../core/store';
import type { ModuleId } from '../core/types';
const floor = (n: number) => (50 * n * (n - 1)) / 2;
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);
export default function ModuleHome({ module, c }: { module: ModuleId; c: ModuleContent }) {
  const h = HERO[module]; const s = stats(c); const p = load(module); const L = levelOf(p.xp);
  const next = floor(L + 1); const bar = (v: number) => <div className="pb"><i style={{ width: `${Math.min(100, v)}%` }} /></div>;
  const tiles: [string, string, string, string][] = [
    ['§', 'Cours', 'cours', `${s.chapters} chapitre(s) · ${s.items} notions · ${s.proofs} démonstrations pas à pas`],
    ['⬡', 'Labos', 'labs', 'Manipule les paramètres et vois la notion bouger (bientôt).'],
    ['◆', 'Jeux', 'jeux', 'Construis, associe, retiens : des jeux propres au module (bientôt).'],
    ['✎', 'Exercices', 'exos', `${s.exercises} exercices corrigés, indice et solution étape par étape.`],
    ['▤', 'Flashcards', 'cartes', `${s.cards} cartes pour réviser les définitions.`],
    ['?', 'QCM', 'quiz', `${s.quiz} questions avec explication après chaque réponse.`]];
  return (<main className="wrap">
    <section className="hero"><div>
      <div className="eyebrow">{h.name}</div><h1>{h.name}</h1>
      <h2>{h.sub} <em className="it">{h.it}</em></h2>
      <p>Explore les concepts et les démonstrations du cours grâce à des schémas et des modèles 3D interactifs. Réalisé par Iliass Errouifi.</p>
      <div className="acts"><a className="btn" href={`#/${module}/cours`}>Explorer le cours →</a><a className="btn ghost" href={`#/${module}/jeux`}>▷ Découvrir les jeux</a></div></div>
      <Hero3D shape={h.shape} line={h.line} fill={h.fill} /></section>
    <div className="keys">{h.keys.map((k, i) => <div key={k.tag} className="key glass"><span className="ghostnum" aria-hidden="true">{'i'.repeat(i + 1)}</span>
      <div className="eyebrow">{k.tag}</div><div className="k"><Rich text={k.tex} /></div><div className="d">{k.text}</div></div>)}</div>
    <section className="prog glass" aria-label="Ta progression">
      <div><div className="eyebrow" style={{ color: 'var(--muted)' }}>Ta progression</div><div className="big">Niv. <i>{L}</i></div>{bar(pct(p.xp - floor(L), next - floor(L)))}<div className="stat" style={{ marginTop: 8 }}>{p.xp} / {next} XP</div></div>
      <div><div className="m">Cours lu</div><div className="v">{pct(p.read.length, s.items)}%</div>{bar(pct(p.read.length, s.items))}</div>
      <div><div className="m">Démonstrations</div><div className="v">{p.proofs.length}/{s.proofs}</div>{bar(pct(p.proofs.length, s.proofs))}</div>
      <div><div className="m">Flashcards maîtrisées</div><div className="v">{p.cards.length}/{s.cards}</div>{bar(pct(p.cards.length, s.cards))}</div></section>
    <section className="sec"><div className="eyebrow">Plateforme</div><h2>Tout pour maîtriser <em className="it">{h.sym}</em></h2></section>
    <div className="tiles">{tiles.map(([ic, name, tab, d]) => <a key={tab} href={`#/${module}/${tab}`} className="tile"><span className="ic" aria-hidden="true">{ic}</span><h3>{name}</h3><p>{d}</p></a>)}</div>
  </main>);
}
