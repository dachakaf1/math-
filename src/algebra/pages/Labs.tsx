// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
import { useMemo, useState } from "react";
import { Atom, Network, Shuffle, Sigma } from "lucide-react";
import AlgebraLab from "../three/AlgebraLab";
import { Badge, Btn, Card, Range, RichMath, SectionTitle, TeX } from "../ui";
import { allSubgroups, analyzeGroup, analyzeRing, composePerm, cosets, equivalenceClasses, generatedBy, GROUPS, GROUP_IDS, inversions, isNormal, isSubgroup, orbits, permToCyclesTex, randomPerm, RELATION_EXAMPLES, relationProps, signature, type GroupId } from "../engine";

function SubgroupLab() {
  const [gid, setGid] = useState<GroupId>("S3");
  const g = GROUPS[gid]; const report = useMemo(() => analyzeGroup(g), [g]);
  const [sel, setSel] = useState<number[]>([0, 1]);
  const H = useMemo(() => generatedBy(g, sel), [g, sel]);
  const cs = useMemo(() => cosets(g, H), [g, H]);
  const toggle = (i: number) => setSel((s) => s.includes(i) ? s.filter((x) => x !== i) : [...s, i]);
  return (
    <Card className="jb-lab-card">
      <div className="jb-lab-head"><Network size={18} /><h3>Sous-groupes & classes</h3><Badge color="lapis">{g.name}</Badge></div>
      <label className="jb-field"><span>Groupe</span><select value={gid} onChange={(e) => { setGid(e.target.value as GroupId); setSel([0]); }}>{GROUP_IDS.map((id) => <option key={id} value={id}>{GROUPS[id].name}</option>)}</select></label>
      <p className="jb-lab-desc">Choisis des générateurs ; le sous-groupe engendré, ses classes et la normalité sont calculés en direct.</p>
      <div className="jb-subset-grid" style={{ gridTemplateColumns: `repeat(${Math.min(g.elements.length, 6)}, 1fr)` }}>{g.elements.map((e, i) => <button key={i} className={sel.includes(i) ? "on" : ""} onClick={() => toggle(i)}><TeX tex={e} /></button>)}</div>
      <div className="jb-lab-result">
        <div><span>⟨S⟩</span><b>{H.length} éléments · {isSubgroup(g, H) ? "sous-groupe" : "—"}</b></div>
        <div className="jb-chips">{H.map((i) => <span key={i} className="seed"><TeX tex={g.elements[i]} /></span>)}</div>
        <div><span>Classes à gauche</span><b>{cs.length} · indice [G:H] = {cs.length}</b></div>
        <div className="jb-chips">{cs.map((c, k) => <span key={k} className={k === 0 ? "seed" : "comp"}>{c.map((i) => g.elements[i].replace(/\\bar\{(\d+)\}/, "$1")).join(",")}</span>)}</div>
        <div className={`jb-axiom ${isNormal(g, H) ? "ok" : "bad"}`}>{isNormal(g, H) ? "✓ H est normal : G/H existe" : "✗ H n'est pas normal : pas de groupe quotient"}</div>
        <div className="jb-lab-atoms"><span>Tous les sous-groupes :</span>{allSubgroups(g).map((s, i) => <Badge key={i} color={s.length === H.length && s.every((x) => H.includes(x)) ? "gold" : "slate"}>{s.length}</Badge>)}</div>
        <div className="jb-lab-atoms"><span>Centre |Z(G)| = {report.center.length}</span><span>Classes de conjugaison : {report.classes.length}</span></div>
      </div>
    </Card>
  );
}

function RelationLab() {
  const [key, setKey] = useState("mod3");
  const ex = RELATION_EXAMPLES[key]; const props = relationProps(ex.R); const classes = props.equivalence ? equivalenceClasses(ex.R) : [];
  return (
    <Card className="jb-lab-card">
      <div className="jb-lab-head"><Sigma size={18} /><h3>Relations</h3><Badge color="gold">{ex.name}</Badge></div>
      <div className="jb-segment jb-segment-wrap">{Object.entries(RELATION_EXAMPLES).map(([k, v]) => <button key={k} aria-pressed={key === k} onClick={() => setKey(k)}>{v.name.split(" ")[0]}</button>)}</div>
      <div className="jb-relation-matrix" style={{ gridTemplateColumns: `repeat(${ex.set.length + 1}, 1fr)` }}>
        <span />{ex.set.map((s) => <span key={s} className="head">{s}</span>)}
        {ex.R.map((row, i) => [<span key={`r${i}`} className="head">{ex.set[i]}</span>, ...row.map((v, j) => <span key={`${i}-${j}`} className={v ? "on" : ""}>{v ? "●" : ""}</span>)])}
      </div>
      <div className="jb-axiom-list">{[["réflexive", props.reflexive], ["symétrique", props.symmetric], ["anti-sym.", props.antisymmetric], ["transitive", props.transitive]].map(([l, v]) => <span key={String(l)} className={v ? "ok" : "bad"}>{v ? "✓" : "✗"} {String(l)}</span>)}</div>
      <div className={`jb-axiom ${props.order ? "ok" : props.equivalence ? "ok" : "bad"}`}>{props.order ? "Relation d'ordre" : props.equivalence ? "Relation d'équivalence" : "Ni ordre ni équivalence"}</div>
      {classes.length > 0 && <div className="jb-chips">{classes.map((c, i) => <span key={i} className="seed">{c.map((j) => ex.set[j]).join(",")}</span>)}</div>}
    </Card>
  );
}

function PermLab() {
  const [n, setN] = useState(6);
  const [a, setA] = useState(() => randomPerm(6)); const [b, setB] = useState(() => randomPerm(6));
  const ab = composePerm(a, b), ba = composePerm(b, a);
  const regen = (k: number) => { setN(k); setA(randomPerm(k)); setB(randomPerm(k)); };
  const row = (p: number[]) => p.map((x) => x + 1).join(" ");
  return (
    <Card className="jb-lab-card">
      <div className="jb-lab-head"><Shuffle size={18} /><h3>Permutations</h3><Badge color="magenta">S{n}</Badge></div>
      <Range label="n" value={n} min={3} max={8} onChange={regen} />
      <div className="jb-perm-rows">
        <div><span>σ₁</span><code>{row(a)}</code><TeX tex={permToCyclesTex(a)} /><b>I={inversions(a).length} ε={signature(a) > 0 ? "+1" : "−1"}</b></div>
        <div><span>σ₂</span><code>{row(b)}</code><TeX tex={permToCyclesTex(b)} /><b>I={inversions(b).length} ε={signature(b) > 0 ? "+1" : "−1"}</b></div>
        <div className="hl"><span>σ₁∘σ₂</span><code>{row(ab)}</code><TeX tex={permToCyclesTex(ab)} /><b>ε={signature(ab) > 0 ? "+1" : "−1"}</b></div>
        <div className="hl"><span>σ₂∘σ₁</span><code>{row(ba)}</code><TeX tex={permToCyclesTex(ba)} /><b>{ab.every((v, i) => v === ba[i]) ? "commutent" : "≠ σ₁∘σ₂"}</b></div>
      </div>
      <div className="jb-lab-atoms"><span>Orbites de σ₁∘σ₂ :</span>{orbits(ab).map((o, i) => <Badge key={i} color="turquoise">{o.map((x) => x + 1).join(",")}</Badge>)}</div>
      <div className="jb-lab-actions"><Btn size="sm" variant="ghost" onClick={() => regen(n)}><Shuffle size={14} /> Tirer σ₁, σ₂</Btn></div>
    </Card>
  );
}

function RingLab() {
  const [n, setN] = useState(12); const r = useMemo(() => analyzeRing(n), [n]);
  const [a, setA] = useState(4);
  const ideal = r.ideals.filter((I) => I.includes(a % n)).sort((x, y) => x.length - y.length)[0] ?? [0];
  return (
    <Card className="jb-lab-card">
      <div className="jb-lab-head"><Atom size={18} /><h3>Anneaux ℤ/nℤ</h3><Badge color="emerald">{r.isField ? "corps" : r.isDomain ? "intègre" : "avec diviseurs de 0"}</Badge></div>
      <Range label="n" value={n} min={2} max={24} onChange={(v) => { setN(v); setA((x) => x % v); }} />
      <Range label="a (idéal engendré)" value={a % n} min={0} max={n - 1} onChange={setA} />
      <div className="jb-lab-metrics"><div><span>unités</span><b>{r.units.length}</b></div><div><span>diviseurs de 0</span><b className={r.zeroDivisors.length ? "" : "hl"}>{r.zeroDivisors.length}</b></div><div><span>idéaux</span><b>{r.ideals.length}</b></div></div>
      <div className="jb-lab-result">
        <div><span>U(ℤ/{n}ℤ)</span><b>{r.units.join(", ") || "∅"}</b></div>
        <div><span>Idéal (a) = ({a % n})</span><b>{ideal.join(", ")}</b></div>
        <div><span>Quotient ℤ/{n}ℤ / (a)</span><b>≃ ℤ/{n / ideal.length}ℤ</b></div>
        <div className={`jb-axiom ${r.isField ? "ok" : "bad"}`}>{r.isField ? `✓ ${n} premier : corps, (${a % n || n}) maximal` : r.ideals.some((I) => I.length > 1 && I.length < n && Number.isInteger(n / I.length) && r.primeIdeals.includes(I)) ? "Idéaux premiers ⇔ quotient intègre" : "Pas un corps"}</div>
      </div>
    </Card>
  );
}

export default function Labs() {
  return (
    <div className="jb-labs">
      <SectionTitle kicker="Laboratoires" title={<>Manipuler les <em>structures</em></>} sub="Tous les paramètres sont appliqués en direct. Glisse pour orbiter, molette pour zoomer." />
      <AlgebraLab />
      <div className="jb-lab-grid"><SubgroupLab /><RelationLab /><PermLab /><RingLab /></div>
      <div className="jb-lab-footer"><RichMath text="Rappel : $H\\trianglelefteq G \\iff xH=Hx\\ \\forall x \\iff G/H$ est un groupe ; $M$ maximal $\\iff A/M$ corps ; $P$ premier $\\iff A/P$ intègre." /></div>
    </div>
  );
}
