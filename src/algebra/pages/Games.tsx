// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
import { useEffect, useMemo, useState } from "react";
import { Check, Gamepad2, RotateCcw, Timer, Trophy, X } from "lucide-react";
import { Badge, Btn, Card, Progress, RichMath, SectionTitle, TeX } from "../ui";
import { analyzeRing, generatedBy, gcd, GROUPS, inversions, isSubgroup, randomPerm, signature, type GroupId } from "../engine";
import { useJabrStore } from "../store";
import { playSound } from "../sound";

const plain = (g: GroupId, i: number) => GROUPS[g].elements[i].replace(/\\bar\{(\d+)\}/, "$1").replace(/[{}\\]/g, "");

function CayleyGame() {
  const { setScore, toast } = useStore();
  const [round, setRound] = useState(0); const [score, setLocal] = useState(0);
  const q = useMemo(() => { const ids: GroupId[] = ["Z5", "Z6", "Z7", "S3", "K4", "D4", "U8"]; const g = GROUPS[ids[round % ids.length]]; const a = Math.floor(Math.random() * g.elements.length), b = Math.floor(Math.random() * g.elements.length); const ans = g.op(a, b); const choices = [...new Set([ans, (ans + 1) % g.elements.length, (ans + 2) % g.elements.length, g.identity])].slice(0, 4).sort(() => Math.random() - 0.5); return { g, a, b, ans, choices }; }, [round]);
  const pick = (v: number) => { if (v === q.ans) { const pts = 20; setLocal((s) => s + pts); setScore("cayley", score + pts); playSound("ok"); toast(`Correct : ${plain(q.g.id, q.a)} ⋆ ${plain(q.g.id, q.b)} = ${plain(q.g.id, q.ans)}`); } else { playSound("bad"); toast(`Non : ${plain(q.g.id, q.ans)}`, "warn"); } setRound((r) => r + 1); };
  return (
    <Card className="jb-game">
      <div className="jb-game-head"><h3>Table de Cayley</h3><Badge color="lapis">{q.g.name} · Q{round + 1}</Badge><span className="jb-game-score"><Trophy size={14} /> {score}</span></div>
      <p>Dans <TeX tex={q.g.tex} />, calcule <TeX tex={`${q.g.elements[q.a]} \\star ${q.g.elements[q.b]}`} />.</p>
      <div className="jb-choices">{q.choices.map((c, i) => <button key={i} onClick={() => pick(c)}><TeX tex={q.g.elements[c]} /></button>)}</div>
    </Card>
  );
}

function SubgroupGame() {
  const { setScore, toast } = useStore();
  const [level, setLevel] = useState(0); const [score, setLocal] = useState(0);
  const g = GROUPS[level % 2 === 0 ? "Z12" : "S3"]; const n = g.elements.length;
  const seed = level % 2 === 0 ? [4] : [1];
  const target = useMemo(() => generatedBy(g, seed), [g, seed]);
  const [sel, setSel] = useState<Set<number>>(new Set([g.identity]));
  const toggle = (i: number) => { playSound("click"); setSel((s) => { const x = new Set(s); if (x.has(i)) x.delete(i); else x.add(i); return x; }); };
  const sub = isSubgroup(g, [...sel]); const exact = sel.size === target.length && target.every((t) => sel.has(t));
  const validate = () => { if (exact) { const pts = 40 + level * 10; setLocal((s) => s + pts); setScore("subgroup", score + pts); playSound("ok"); toast(`Sous-groupe exact ! +${pts} XP`); setLevel((l) => l + 1); setSel(new Set([g.identity])); } else { playSound("bad"); toast(sub ? "Sous-groupe valide, mais pas le plus petit contenant le générateur." : "Pas un sous-groupe : vérifie neutre et xy⁻¹.", "warn"); } };
  return (
    <Card className="jb-game">
      <div className="jb-game-head"><h3>Chasseur de sous-groupes</h3><Badge color="emerald">{g.name} · Niveau {level + 1}</Badge><span className="jb-game-score"><Trophy size={14} /> {score}</span></div>
      <p>Construis le <b>plus petit sous-groupe</b> contenant <TeX tex={g.elements[seed[0]]} /> dans <TeX tex={g.tex} />.</p>
      <div className="jb-subset-grid" style={{ gridTemplateColumns: `repeat(${Math.min(n, 6)}, 1fr)` }}>{g.elements.map((_, i) => <button key={i} className={sel.has(i) ? "on" : ""} onClick={() => toggle(i)}><TeX tex={g.elements[i]} /></button>)}</div>
      <div className="jb-axiom-list"><span className={sel.has(g.identity) ? "ok" : "bad"}>{sel.has(g.identity) ? "✓" : "✗"} e ∈ H</span><span className={sub ? "ok" : "bad"}>{sub ? "✓" : "✗"} sous-groupe</span><span className={exact ? "ok" : ""}>{exact ? "✓ minimal" : `${sel.size}/${target.length} attendus`}</span></div>
      <div className="jb-game-actions"><Btn onClick={validate}>Valider</Btn><Btn variant="ghost" onClick={() => setSel(new Set([g.identity]))}><RotateCcw size={14} /> Vider</Btn></div>
    </Card>
  );
}

function GeneratorGame() {
  const { setScore, toast } = useStore();
  const [round, setRound] = useState(0); const [score, setLocal] = useState(0);
  const q = useMemo(() => { const ns = [6, 8, 9, 10, 12, 15]; const n = ns[round % ns.length]; const k = 1 + Math.floor(Math.random() * (n - 1)); const ans = gcd(k, n) === 1; return { n, k, ans }; }, [round]);
  const pick = (v: boolean) => { if (v === q.ans) { const pts = 15; setLocal((s) => s + pts); setScore("generators", score + pts); playSound("ok"); toast(`Oui : gcd(${q.k},${q.n})=${gcd(q.k, q.n)}`); } else { playSound("bad"); toast(`gcd(${q.k},${q.n})=${gcd(q.k, q.n)} ⇒ ${q.ans ? "générateur" : "pas générateur"}`, "warn"); } setRound((r) => r + 1); };
  return (
    <Card className="jb-game">
      <div className="jb-game-head"><h3>Générateurs</h3><Badge color="gold">ℤ/{q.n}ℤ · Q{round + 1}</Badge><span className="jb-game-score"><Trophy size={14} /> {score}</span></div>
      <p><TeX tex={`\\bar{${q.k}}`} /> engendre-t-il <TeX tex={`\\mathbb{Z}/${q.n}\\mathbb{Z}`} /> ?</p>
      <div className="jb-tf-actions"><Btn variant="success" onClick={() => pick(true)}><Check size={16} /> Oui</Btn><Btn variant="danger" onClick={() => pick(false)}><X size={16} /> Non</Btn></div>
    </Card>
  );
}

function SignatureGame() {
  const { setScore, toast } = useStore();
  const [round, setRound] = useState(0); const [score, setLocal] = useState(0);
  const perm = useMemo(() => randomPerm(5), [round]);
  const I = inversions(perm).length; const eps = signature(perm);
  const choices = useMemo(() => [...new Set([I, I + 1, Math.max(0, I - 1), I + 2])].sort(() => Math.random() - 0.5), [I]);
  const pick = (v: number) => { if (v === I) { const pts = 25 + (eps < 0 ? 5 : 0); setLocal((s) => s + pts); setScore("signature", score + pts); playSound("ok"); toast(`I=${I}, ε=${eps > 0 ? "+1" : "−1"} (${eps > 0 ? "paire" : "impaire"})`); } else { playSound("bad"); toast(`I(σ)=${I}`, "warn"); } setRound((r) => r + 1); };
  return (
    <Card className="jb-game">
      <div className="jb-game-head"><h3>Signature</h3><Badge color="magenta">S₅ · Q{round + 1}</Badge><span className="jb-game-score"><Trophy size={14} /> {score}</span></div>
      <p>Combien d'inversions pour <TeX tex={`\\sigma=\\begin{pmatrix}1&2&3&4&5\\\\${perm.map((p) => p + 1).join("&")}\\end{pmatrix}`} /> ?</p>
      <svg viewBox="0 0 320 120" className="jb-game-braid">{perm.map((p, i) => { const x1 = 30 + i * 65, x2 = 30 + p * 65; return <path key={i} d={`M${x1},15 C${x1},60 ${x2},60 ${x2},105`} fill="none" stroke={eps > 0 ? "#3ddc97" : "#ff5fa2"} strokeWidth="3" />; })}{perm.map((_, i) => <g key={i}><text x={30 + i * 65} y="10" fill="#ffb547" fontSize="11" textAnchor="middle">{i + 1}</text><text x={30 + i * 65} y="118" fill="#39d0d8" fontSize="11" textAnchor="middle">{i + 1}</text></g>)}</svg>
      <div className="jb-choices">{choices.map((c, i) => <button key={i} onClick={() => pick(c)}>{c}</button>)}</div>
    </Card>
  );
}

const TF = [
  { s: "Un groupe d'ordre premier est cyclique.", v: true }, { s: "La réunion de deux sous-groupes est toujours un sous-groupe.", v: false }, { s: "Le noyau d'un morphisme de groupes est un sous-groupe normal.", v: true }, { s: "S₃ est abélien.", v: false }, { s: "Toute transposition a signature −1.", v: true }, { s: "ℤ/6ℤ est un corps.", v: false }, { s: "Un idéal contenant 1 est l'anneau entier.", v: true }, { s: "A[X] est un corps si A est un corps.", v: false }, { s: "Deux permutations à supports disjoints commutent.", v: true }, { s: "H est normal ssi xH=Hx pour tout x.", v: true }, { s: "φ(12)=6.", v: false }, { s: "Le centre Z(G) est un sous-groupe.", v: true }, { s: "ℤ[i] est un sous-anneau de ℂ.", v: true }, { s: "Dans ℤ, {0} est un idéal maximal.", v: false },
];
function TrueFalse() {
  const { setScore, toast } = useStore();
  const [i, setI] = useState(0); const [score, setLocal] = useState(0); const [streak, setStreak] = useState(0); const [time, setTime] = useState(8); const [running, setRunning] = useState(true);
  useEffect(() => { if (!running) return; const t = setInterval(() => setTime((x) => x - 1), 1000); return () => clearInterval(t); }, [running]);
  useEffect(() => { if (time <= 0 && running) { setRunning(false); playSound("bad"); toast(`Temps écoulé ! Score ${score}`); setScore("vraifaux", score); } }, [time, running, score, setScore, toast]);
  const answer = (v: boolean) => { if (!running) return; if (TF[i % TF.length].v === v) { const pts = 10 + streak * 2; setLocal((s) => s + pts); setStreak((s) => s + 1); playSound("ok"); } else { setStreak(0); playSound("bad"); } setI((x) => x + 1); setTime(8); };
  const restart = () => { setI(0); setLocal(0); setStreak(0); setTime(8); setRunning(true); };
  return (
    <Card className="jb-game">
      <div className="jb-game-head"><h3>Vrai / Faux chrono</h3><Badge color="turquoise"><Timer size={12} /> {time}s</Badge><span className="jb-game-score"><Trophy size={14} /> {score}</span></div>
      <Progress value={(time / 8) * 100} color={time <= 3 ? "#ff5c5c" : "#39d0d8"} />
      <div className="jb-tf-statement">{running ? TF[i % TF.length].s : "Partie terminée."}</div>
      <div className="jb-tf-actions">{running ? <><Btn variant="success" onClick={() => answer(true)}><Check size={16} /> Vrai</Btn><Btn variant="danger" onClick={() => answer(false)}><X size={16} /> Faux</Btn></> : <Btn onClick={restart}><RotateCcw size={14} /> Rejouer</Btn>}</div>
      <div className="jb-game-meta">Série : {streak} · Question {i + 1}</div>
    </Card>
  );
}

const useStore = useJabrStore;

export default function Games() {
  const [tab, setTab] = useState("cayley");
  const { scores } = useJabrStore();
  const tabs = [["cayley", "Cayley"], ["subgroup", "Sous-groupes"], ["generators", "Générateurs"], ["signature", "Signature"], ["vraifaux", "Vrai/Faux"]];
  const ring = analyzeRing(6);
  return (
    <div className="jb-games">
      <SectionTitle kicker="Jeux" title={<>Le <em>dojo</em> des structures</>} sub="Cinq boucles courtes, feedback immédiat, XP et records sauvegardés." right={<Badge color="gold"><Gamepad2 size={12} /> {Object.values(scores).reduce((a, b) => a + b, 0)} XP jeux</Badge>} />
      <div className="jb-game-tabs">{tabs.map(([k, l]) => <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{l}{scores[k] ? <small>{scores[k]}</small> : null}</button>)}</div>
      {tab === "cayley" && <CayleyGame />}{tab === "subgroup" && <SubgroupGame />}{tab === "generators" && <GeneratorGame />}{tab === "signature" && <SignatureGame />}{tab === "vraifaux" && <TrueFalse />}
      <div className="jb-game-foot"><RichMath text={`Rappel du jour : dans $\\mathbb{Z}/6\\mathbb{Z}$, $U(A)=\\{${ring.units.join(",")}\\}$ et les diviseurs de zéro sont $\\{${ring.zeroDivisors.join(",")}\\}$.`} /></div>
    </div>
  );
}
