// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { Camera, Dices, Download, Grid3X3, RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { analyzeGroup, analyzeRing, cayleyTable, cosets, generatedBy, GROUPS, GROUP_IDS, inversions, isNormal, orderOf, permToCyclesTex, randomPerm, ringTable, signature, transposition, type GroupId } from "../engine";
import { Badge, Btn, Range, TeX, Toggle } from "../ui";
import { box, disposeObject, glowSphere, line, makeLabel, makeParticles, makeRenderer, PALETTE, setupLights } from "./common";
import { playSound } from "../sound";

export type LabMode = "cayley" | "cyclic" | "cosets" | "perm" | "ring";
export interface LabParams {
  group: GroupId; mode: LabMode; highlight: number; power: number; height: number; opacity: number; speed: number; light: number; lightAngle: number;
  wireframe: boolean; guides: boolean; autoRotate: boolean; colorBy: "value" | "order" | "coset"; n: number; ringN: number; perm: number[];
}
export const DEFAULT_PARAMS: LabParams = {
  group: "Z6", mode: "cayley", highlight: 1, power: 1, height: 1.0, opacity: 0.82, speed: 0.6, light: 1, lightAngle: 35,
  wireframe: false, guides: true, autoRotate: true, colorBy: "value", n: 5, ringN: 6, perm: [1, 2, 3, 4, 0],
};

const plainLabel = (g: GroupId, i: number) => {
  const s = GROUPS[g];
  return s.elements[i].replace(/\\bar\{(\d+)\}/, "$1").replace(/[{}\\]/g, "");
};

class AlgebraEngine {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  controls: OrbitControls;
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  root = new THREE.Group();
  content = new THREE.Group();
  guides = new THREE.Group();
  particles: THREE.Points;
  lights: ReturnType<typeof setupLights>;
  params: LabParams = { ...DEFAULT_PARAMS };
  anim: ((t: number) => void)[] = [];
  time = 0; last = 0; disposed = false;
  fit = 0;
  resizeObs: ResizeObserver;

  constructor(public container: HTMLElement) {
    this.renderer = makeRenderer(container);
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.55, 0.75);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());
    this.scene.fog = new THREE.FogExp2(PALETTE.bg, 0.05);
    this.camera.position.set(3.6, 3, 4.2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.75, 0);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 2.2; this.controls.maxDistance = 12; this.controls.maxPolarAngle = Math.PI * 0.49;
    this.controls.autoRotateSpeed = 0.6; this.controls.saveState();
    this.lights = setupLights(this.scene, 1);
    this.particles = makeParticles(260, 10); this.scene.add(this.particles);
    this.scene.add(this.root); this.root.add(this.content, this.guides);
    this.buildGuides(); this.rebuild();
    this.resizeObs = new ResizeObserver(() => this.resize()); this.resizeObs.observe(container); this.resize();
    this.renderer.setAnimationLoop((now) => this.tick(now));
  }
  resize() {
    const w = this.container.clientWidth, h = this.container.clientHeight; if (!w || !h) return;
    const aspect = w / h; this.camera.aspect = aspect; this.camera.updateProjectionMatrix();
    const fit = Math.min(1.7, Math.max(0.85, 1.18 / aspect));
    if (this.fit && Math.abs(fit - this.fit) > 1e-3) { const off = this.camera.position.clone().sub(this.controls.target).multiplyScalar(fit / this.fit); this.camera.position.copy(this.controls.target).add(off); }
    else if (!this.fit) { this.camera.position.copy(this.controls.target).add(new THREE.Vector3(3.4, 2.2, 4.2).multiplyScalar(fit)); }
    this.fit = fit; this.controls.maxDistance = 12 * fit; this.controls.update();
    this.renderer.setSize(w, h, false); this.composer.setSize(w, h);
  }
  buildGuides() {
    disposeObject(this.guides); this.guides.clear();
    const grid = new THREE.GridHelper(4, 16, PALETTE.lapis, PALETTE.ink);
    (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = 0.35;
    this.guides.add(grid);
    this.guides.add(line([new THREE.Vector3(-2.2, 0, 0), new THREE.Vector3(2.4, 0, 0)], PALETTE.gold, 0.8));
    this.guides.add(line([new THREE.Vector3(0, 0, -2.2), new THREE.Vector3(0, 0, 2.4)], PALETTE.magenta, 0.8));
    this.guides.add(line([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2.6, 0)], PALETTE.turquoise, 0.8));
  }
  setParams(p: LabParams) {
    const rebuild = JSON.stringify({ ...p, speed: 0, light: 0, lightAngle: 0, autoRotate: false, guides: false }) !== JSON.stringify({ ...this.params, speed: 0, light: 0, lightAngle: 0, autoRotate: false, guides: false });
    this.params = { ...p };
    this.controls.autoRotate = p.autoRotate; this.controls.autoRotateSpeed = 0.6 * p.speed;
    this.lights.setIntensity(p.light);
    const a = (p.lightAngle * Math.PI) / 180;
    this.lights.key.position.set(Math.cos(a) * 5, 6, Math.sin(a) * 5);
    this.lights.rim.position.set(-Math.cos(a) * 4, 3, -Math.sin(a) * 4);
    this.guides.visible = p.guides;
    if (rebuild) this.rebuild();
  }
  clear() { disposeObject(this.content); this.content.clear(); this.anim = []; }
  colorFor(v: number, n: number, i: number, j: number): THREE.Color {
    const g = GROUPS[this.params.group]; const c = new THREE.Color();
    if (this.params.colorBy === "order") { const o = orderOf(g, v); c.setHSL(0.62 - Math.min(o, 8) * 0.07, 0.85, 0.5); }
    else if (this.params.colorBy === "coset") { const H = generatedBy(g, [this.params.highlight]); const cs = cosets(g, H); const k = cs.findIndex((cl) => cl.includes(v)); c.setHSL((k / Math.max(1, cs.length)) * 0.9, 0.8, 0.5); }
    else c.setHSL(0.6 - (v / Math.max(1, n - 1)) * 0.55, 0.85, 0.45 + (v / Math.max(1, n)) * 0.15);
    if (i === this.params.highlight || j === this.params.highlight) c.offsetHSL(0, 0, 0.12);
    return c;
  }
  rebuild() {
    this.clear();
    const p = this.params; const g = GROUPS[p.group]; const n = g.elements.length;
    if (p.mode === "cayley" || p.mode === "ring") {
      const isRing = p.mode === "ring"; const N = isRing ? p.ringN : n;
      const table = isRing ? ringTable(N, "×") : cayleyTable(g);
      const cell = 3.2 / N; const H = p.height * 1.35;
      const geo = new THREE.BoxGeometry(cell * 0.86, 1, cell * 0.86);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x101a33, emissiveIntensity: 0.4, roughness: 0.35, metalness: 0.3, transparent: true, opacity: p.opacity, wireframe: p.wireframe });
      const inst = new THREE.InstancedMesh(geo, mat, N * N);
      const m = new THREE.Matrix4(); let idx = 0;
      const ring = isRing ? analyzeRing(N) : null;
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        const v = table[i][j]; const h = Math.max(0.04, ((v + 1) / N) * H);
        m.compose(new THREE.Vector3(-1.6 + (i + 0.5) * cell, h / 2, -1.6 + (j + 0.5) * cell), new THREE.Quaternion(), new THREE.Vector3(1, h, 1));
        inst.setMatrixAt(idx, m);
        let c: THREE.Color;
        if (isRing) { c = new THREE.Color(v === 0 ? PALETTE.red : ring!.units.includes(i) && ring!.units.includes(j) ? PALETTE.emerald : PALETTE.lapis); if (i === p.highlight % N || j === p.highlight % N) c.offsetHSL(0, 0, 0.12); }
        else c = this.colorFor(v, N, i, j);
        inst.setColorAt(idx, c); idx++;
      }
      inst.instanceMatrix.needsUpdate = true; if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
      this.content.add(inst);
      for (let i = 0; i < N; i++) {
        const l1 = makeLabel(isRing ? String(i) : plainLabel(p.group, i), "#f3ead8", 0.42); l1.position.set(-1.6 + (i + 0.5) * cell, 0.05, 1.85); this.content.add(l1);
        const l2 = makeLabel(isRing ? String(i) : plainLabel(p.group, i), "#f3ead8", 0.42); l2.position.set(-1.85, 0.05, -1.6 + (i + 0.5) * cell); this.content.add(l2);
      }
      const title = makeLabel(isRing ? `(ℤ/${N}ℤ, ×)` : g.name, "#ffb547", 0.7); title.position.set(0, H + 0.5, 0); this.content.add(title);
      if (!isRing) {
        const idRow = box(3.3, 0.02, cell, PALETTE.gold, 0.35); idRow.position.set(0, 0.01, -1.6 + (g.identity + 0.5) * cell); this.content.add(idRow);
        const idCol = box(cell, 0.02, 3.3, PALETTE.gold, 0.35); idCol.position.set(-1.6 + (g.identity + 0.5) * cell, 0.01, 0); this.content.add(idCol);
      } else if (ring) {
        const I = ring.ideals.find((id) => id.includes(p.highlight % N) && id.length === Math.max(...ring.ideals.filter((x) => x.includes(p.highlight % N)).map((x) => x.length))) ?? [0];
        // highlight ideal generated by highlight: smallest ideal containing it
        const gen = ring.ideals.filter((id) => id.includes(p.highlight % N)).sort((a, b) => a.length - b.length)[0] ?? I;
        gen.forEach((a) => { const marker = box(cell * 0.9, 0.03, 3.3, PALETTE.emerald, 0.25); marker.position.set(-1.6 + (a + 0.5) * cell, 0.02, 0); this.content.add(marker); });
      }
    } else if (p.mode === "cyclic" || p.mode === "cosets") {
      const R = 1.6; const H = generatedBy(g, [p.highlight]); const cs = cosets(g, H);
      const ring = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 96 }, (_, i) => new THREE.Vector3(Math.cos(i / 96 * Math.PI * 2) * R, 0.02, Math.sin(i / 96 * Math.PI * 2) * R))), new THREE.LineBasicMaterial({ color: PALETTE.cool, transparent: true, opacity: 0.4 }));
      this.content.add(ring);
      const nodes: THREE.Group[] = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2; const x = Math.cos(a) * R, z = Math.sin(a) * R;
        const k = cs.findIndex((cl) => cl.includes(i)); const inH = H.includes(i);
        const col = p.mode === "cosets" ? new THREE.Color().setHSL((k / cs.length) * 0.9, 0.85, 0.55) : new THREE.Color(inH ? PALETTE.emerald : PALETTE.cool);
        const s = glowSphere(i === g.identity ? 0.13 : 0.09, col.getHex(), 0.2); s.position.set(x, 0.15 + (p.mode === "cosets" ? k * 0.25 * p.height : 0), z); this.content.add(s); nodes.push(s);
        const l = makeLabel(plainLabel(p.group, i), inH ? "#3ddc97" : "#f3ead8", 0.45); l.position.set(x * 1.2, s.position.y + 0.25, z * 1.2); this.content.add(l);
        if (p.mode === "cosets") { const stem = line([new THREE.Vector3(x, 0, z), new THREE.Vector3(x, s.position.y, z)], col.getHex(), 0.5, true); this.content.add(stem); }
      }
      // orbit path of highlight powers
      const path: THREE.Vector3[] = []; let x = g.identity; const steps = Math.min(orderOf(g, p.highlight), n);
      for (let k = 0; k <= steps; k++) { const a = (x / n) * Math.PI * 2 - Math.PI / 2; path.push(new THREE.Vector3(Math.cos(a) * R, 0.2, Math.sin(a) * R)); x = g.op(x, p.highlight); }
      if (path.length > 1) this.content.add(line(path, PALETTE.gold, 0.9));
      const token = glowSphere(0.08, PALETTE.gold, 0.35); this.content.add(token);
      const curve = new THREE.CatmullRomCurve3(path.slice(0, -1).length > 1 ? path.slice(0, -1) : path, true);
      this.anim.push((t) => { const u = (t * 0.15 * p.power) % 1; token.position.copy(curve.getPoint(u)); token.position.y = 0.25; nodes.forEach((nd, i) => { nd.scale.setScalar(i === Math.floor(u * n) ? 1.3 : 1); }); });
      const title = makeLabel(p.mode === "cosets" ? `${cs.length} classes · |H|=${H.length}${isNormal(g, H) ? " · normal" : ""}` : `⟨${plainLabel(p.group, p.highlight)}⟩ · ordre ${orderOf(g, p.highlight)}`, "#ffb547", 0.65); title.position.set(0, 1.6 * p.height + 0.4, 0); this.content.add(title);
    } else if (p.mode === "perm") {
      const perm = p.perm; const N = perm.length; const inv = inversions(perm); const eps = signature(perm);
      const topY = 1.8 * p.height, botY = 0.1; const xs = (i: number) => -1.5 + (i / (N - 1)) * 3;
      for (let i = 0; i < N; i++) {
        const start = new THREE.Vector3(xs(i), topY, 0), end = new THREE.Vector3(xs(perm[i]), botY, 0);
        const mid1 = new THREE.Vector3(xs(i), topY * 0.6, 0.25), mid2 = new THREE.Vector3(xs(perm[i]), topY * 0.4, -0.25);
        const curve = new THREE.CubicBezierCurve3(start, mid1, mid2, end);
        const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 40, 0.035, 8, false), new THREE.MeshStandardMaterial({ color: eps === 1 ? PALETTE.emerald : PALETTE.magenta, emissive: eps === 1 ? 0x0a4a2a : 0x4a0a2a, emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.4, transparent: true, opacity: p.opacity }));
        this.content.add(tube);
        const a = glowSphere(0.07, PALETTE.gold, 0.25); a.position.copy(start); this.content.add(a);
        const b = glowSphere(0.07, PALETTE.turquoise, 0.25); b.position.copy(end); this.content.add(b);
        const l1 = makeLabel(String(i + 1), "#ffb547", 0.45); l1.position.set(xs(i), topY + 0.25, 0); this.content.add(l1);
        const l2 = makeLabel(String(i + 1), "#39d0d8", 0.45); l2.position.set(xs(i), botY - 0.25, 0); this.content.add(l2);
        const dot = glowSphere(0.05, PALETTE.warm, 0.3); this.content.add(dot);
        this.anim.push((t) => { dot.position.copy(curve.getPoint((t * 0.2 * p.power + i * 0.13) % 1)); });
      }
      inv.forEach(([i, j]) => { const y = topY * 0.5; const x = (xs(i) + xs(j)) / 2 + (xs(perm[i]) + xs(perm[j])) / 2; const c = glowSphere(0.05, PALETTE.red, 0.4); c.position.set(x / 2, y, 0.3); this.content.add(c); });
      const title = makeLabel(`I=${inv.length}  ε=${eps > 0 ? "+1" : "−1"}`, eps > 0 ? "#3ddc97" : "#ff5fa2", 0.7); title.position.set(0, topY + 0.7, 0); this.content.add(title);
    }
  }
  tick(now: number) {
    if (this.disposed) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    this.time += dt * this.params.speed;
    this.controls.update(dt);
    this.particles.rotation.y = this.time * 0.03; this.particles.position.y = Math.sin(this.time * 0.4) * 0.05;
    this.anim.forEach((f) => f(this.time));
    this.composer.render();
  }
  resetCamera() { this.controls.reset(); this.fit = 0; this.resize(); }
  exportPNG() {
    this.composer.render();
    const name = `jabr-${this.params.group}-${this.params.mode}.png`;
    this.renderer.domElement.toBlob((blob) => { if (!blob) return; const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = name; a.style.display = "none"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000); }, "image/png");
  }
  dispose() { this.disposed = true; this.renderer.setAnimationLoop(null); this.resizeObs.disconnect(); this.controls.dispose(); this.composer.passes.forEach((p) => (p as unknown as { dispose?: () => void }).dispose?.()); this.composer.dispose(); disposeObject(this.scene); this.renderer.dispose(); this.renderer.forceContextLoss(); this.renderer.domElement.remove(); }
}

export default function AlgebraLab({ initial, compact = false }: { initial?: Partial<LabParams>; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const engine = useRef<AlgebraEngine | null>(null);
  const [params, setParams] = useState<LabParams>({ ...DEFAULT_PARAMS, ...initial });
  const [failed, setFailed] = useState(false);
  const pref = useRef(params); pref.current = params;
  useEffect(() => { if (!ref.current) return; let e: AlgebraEngine | null = null; try { e = new AlgebraEngine(ref.current); e.setParams(pref.current); engine.current = e; } catch { setFailed(true); } return () => { e?.dispose(); engine.current = null; }; }, []);
  useEffect(() => { engine.current?.setParams(params); }, [params]);
  const update = (patch: Partial<LabParams>) => setParams((p) => ({ ...p, ...patch }));
  const g = GROUPS[params.group];
  const report = useMemo(() => analyzeGroup(g), [g]);
  const ring = useMemo(() => analyzeRing(params.ringN), [params.ringN]);
  const H = useMemo(() => generatedBy(g, [params.highlight % g.elements.length]), [g, params.highlight]);
  const permInfo = useMemo(() => ({ inv: inversions(params.perm).length, eps: signature(params.perm) }), [params.perm]);
  const randomize = () => { playSound("click"); update({ group: GROUP_IDS[Math.floor(Math.random() * GROUP_IDS.length)], highlight: Math.floor(Math.random() * 6), perm: randomPerm(params.n), ringN: 2 + Math.floor(Math.random() * 11) }); };

  return (
    <div className={`jb-lab ${compact ? "jb-lab-compact" : ""}`}>
      <div className="jb-lab-stage">
        <div ref={ref} className="jb-lab-canvas" aria-label="Laboratoire 3D d'algèbre : glisser pour orbiter, molette pour zoomer" />
        {failed && <div className="jb-webgl-fallback"><Grid3X3 size={32} /><p>WebGL indisponible. Les calculs et contrôles restent actifs.</p></div>}
        <div className="jb-hud">
          {params.mode === "perm" ? (
            <>
              <div className="jb-hud-main"><span>PERMUTATION σ ∈ S{params.n}</span><strong>{permInfo.eps > 0 ? "+1" : "−1"}</strong></div>
              <div className="jb-hud-row"><span>inversions I(σ)</span><b>{permInfo.inv}</b></div>
              <div className="jb-hud-row"><span>cycles</span><b className="jb-hud-tex"><TeX tex={permToCyclesTex(params.perm)} /></b></div>
              <div className="jb-hud-row"><span>parité</span><b className={permInfo.eps > 0 ? "ok" : "warn"}>{permInfo.eps > 0 ? "paire" : "impaire"}</b></div>
            </>
          ) : params.mode === "ring" ? (
            <>
              <div className="jb-hud-main"><span>ℤ/{params.ringN}ℤ · ×</span><strong>{ring.isField ? "corps" : ring.isDomain ? "intègre" : "anneau"}</strong></div>
              <div className="jb-hud-row"><span>unités</span><b>{ring.units.length}</b></div>
              <div className="jb-hud-row"><span>diviseurs de 0</span><b className={ring.zeroDivisors.length ? "warn" : "ok"}>{ring.zeroDivisors.length}</b></div>
              <div className="jb-hud-row"><span>idéaux</span><b>{ring.ideals.length}</b></div>
            </>
          ) : (
            <>
              <div className="jb-hud-main"><span>{g.name} · |G|</span><strong>{g.elements.length}</strong></div>
              <div className="jb-hud-row"><span>abélien</span><b className={report.abelian ? "ok" : "warn"}>{report.abelian ? "oui" : "non"}</b></div>
              <div className="jb-hud-row"><span>ordre de x</span><b>{orderOf(g, params.highlight % g.elements.length)}</b></div>
              <div className="jb-hud-row"><span>|⟨x⟩|</span><b>{H.length}</b></div>
              <div className="jb-hud-row"><span>⟨x⟩ normal</span><b className={isNormal(g, H) ? "ok" : "warn"}>{isNormal(g, H) ? "oui" : "non"}</b></div>
              <div className="jb-hud-row"><span>classes / centre</span><b>{report.classes.length} / {report.center.length}</b></div>
            </>
          )}
        </div>
        <div className="jb-lab-legend">
          <span><i style={{ background: "#4f7cff" }} /> valeurs</span>
          <span><i style={{ background: "#ffb547" }} /> neutre / orbite</span>
          <span><i style={{ background: "#3ddc97" }} /> ⟨x⟩ / unités</span>
          <span><i style={{ background: "#ff5c5c" }} /> diviseurs de 0</span>
          <span><i style={{ background: "#ff5fa2" }} /> impair</span>
        </div>
        <div className="jb-lab-formula"><TeX tex={params.mode === "perm" ? `\\varepsilon(\\sigma)=(-1)^{I(\\sigma)}` : params.mode === "ring" ? `\\bar a\\cdot\\bar b=\\overline{ab}` : params.mode === "cosets" ? `G/H,\\quad \\bar x\\cdot\\bar y=\\overline{xy}` : params.mode === "cyclic" ? `\\langle x\\rangle=\\{x^k\\}` : `(g,h)\\mapsto g\\star h`} /></div>
      </div>

      <aside className="jb-lab-controls" aria-label="Réglages du laboratoire 3D">
        <div className="jb-controls-head"><Sparkles size={16} /><span>CONTRÔLES EN DIRECT</span><Badge color="gold">3D</Badge></div>
        <label className="jb-field"><span>Groupe</span>
          <select value={params.group} onChange={(e) => update({ group: e.target.value as GroupId, highlight: 0 })}>{GROUP_IDS.map((id) => <option key={id} value={id}>{GROUPS[id].name}</option>)}</select>
        </label>
        <div className="jb-field"><span>Visualisation</span>
          <div className="jb-segment jb-segment-wrap">{(["cayley", "cyclic", "cosets", "perm", "ring"] as LabMode[]).map((m) => <button key={m} type="button" aria-pressed={params.mode === m} onClick={() => { playSound("click"); update({ mode: m }); }}>{m === "cayley" ? "Cayley" : m === "cyclic" ? "Cyclique" : m === "cosets" ? "Classes" : m === "perm" ? "Tresses" : "Anneau"}</button>)}</div>
        </div>
        {params.mode !== "perm" && params.mode !== "ring" && (
          <label className="jb-field"><span>Élément x mis en évidence</span>
            <select value={params.highlight % g.elements.length} onChange={(e) => update({ highlight: Number(e.target.value) })}>{g.elements.map((_, i) => <option key={i} value={i}>{plainLabel(params.group, i)} · ordre {orderOf(g, i)}</option>)}</select>
          </label>
        )}
        {params.mode === "ring" && <Range label="n (anneau ℤ/nℤ)" value={params.ringN} min={2} max={12} onChange={(v) => update({ ringN: v, highlight: 0 })} />}
        {params.mode === "ring" && <Range label="Générateur d'idéal a" value={params.highlight % params.ringN} min={0} max={params.ringN - 1} onChange={(v) => update({ highlight: v })} />}
        {params.mode === "perm" && <Range label="Taille n" value={params.n} min={3} max={8} onChange={(v) => update({ n: v, perm: randomPerm(v) })} />}
        {(params.mode === "cyclic" || params.mode === "perm") && <Range label="Vitesse du parcours" value={params.power} min={0.2} max={3} step={0.1} onChange={(v) => update({ power: v })} format={(v) => `${v.toFixed(1)}×`} />}
        {params.mode === "cayley" && <div className="jb-field"><span>Couleur par</span><div className="jb-segment">{(["value", "order", "coset"] as const).map((c) => <button key={c} type="button" aria-pressed={params.colorBy === c} onClick={() => update({ colorBy: c })}>{c === "value" ? "Valeur" : c === "order" ? "Ordre" : "Classe"}</button>)}</div></div>}
        <Range label="Hauteur / échelle" value={params.height} min={0.4} max={2.2} step={0.05} onChange={(v) => update({ height: v })} format={(v) => `${v.toFixed(2)}×`} />
        <Range label="Opacité" value={params.opacity} min={0.15} max={1} step={0.01} onChange={(v) => update({ opacity: v })} format={(v) => `${Math.round(v * 100)}%`} />
        <Range label="Vitesse / orbite" value={params.speed} min={0} max={2} step={0.05} onChange={(v) => update({ speed: v })} format={(v) => `${v.toFixed(2)}×`} />
        <Range label="Lumière" value={params.light} min={0.3} max={2} step={0.05} onChange={(v) => update({ light: v })} format={(v) => `${v.toFixed(2)}×`} />
        <Range label="Direction lumière" value={params.lightAngle} min={0} max={360} step={5} onChange={(v) => update({ lightAngle: v })} format={(v) => `${v}°`} />
        <div className="jb-toggle-grid">
          <Toggle label="Filaire" checked={params.wireframe} onChange={(v) => update({ wireframe: v })} />
          <Toggle label="Repères" checked={params.guides} onChange={(v) => update({ guides: v })} />
          <Toggle label="Orbite auto" checked={params.autoRotate} onChange={(v) => update({ autoRotate: v })} />
        </div>
        {params.mode === "perm" && <div className="jb-controls-actions">
          <Btn size="sm" variant="ghost" onClick={() => { playSound("click"); update({ perm: randomPerm(params.n) }); }}><Shuffle size={14} /> Nouvelle σ</Btn>
          <Btn size="sm" variant="ghost" onClick={() => { playSound("click"); update({ perm: transposition(params.n, 0, 1) }); }}>τ=[1,2]</Btn>
        </div>}
        <div className="jb-controls-actions">
          <Btn size="sm" variant="ghost" onClick={() => engine.current?.resetCamera()}><Camera size={14} /> Recadrer</Btn>
          <Btn size="sm" variant="ghost" onClick={randomize}><Dices size={14} /> Aléatoire</Btn>
          <Btn size="sm" variant="ghost" onClick={() => { playSound("click"); setParams({ ...DEFAULT_PARAMS }); engine.current?.resetCamera(); }}><RotateCcw size={14} /> Reset</Btn>
          <Btn size="sm" variant="outline" onClick={() => { playSound("ok"); engine.current?.exportPNG(); }}><Download size={14} /> PNG</Btn>
        </div>
        <div className="jb-controls-note"><Grid3X3 size={13} /><span>{params.mode === "cayley" ? "Table de Cayley : hauteur = valeur du produit. Ligne/colonne dorée = neutre." : params.mode === "cyclic" ? "Les puissances de x parcourent ⟨x⟩ ; vert = éléments engendrés." : params.mode === "cosets" ? "Chaque couleur = une classe xH ; hauteur = indice de classe." : params.mode === "perm" ? "Tresses : croisements = inversions ; vert pair, rose impair." : "Table × de ℤ/nℤ ; rouge = 0, vert = unités, bande = idéal (a)."}</span></div>
      </aside>
    </div>
  );
}
