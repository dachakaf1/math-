// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Maximize2, Pause, Play, RotateCcw, X } from "lucide-react";
import type { SceneKind } from "../../modules/algebre/source/course";
import { box, circle, disposeObject, glowSphere, line, makeLabel, makeParticles, makeRenderer, PALETTE, setupLights, sphere } from "./common";

const FOCUS_LABELS: Record<string, string> = {
  reflexive: "réflexivité", symmetric: "symétrie", transitive: "transitivité", classes: "classes", identity: "neutre", unique: "unicité", inverse: "inverse", closure: "stabilité", stable: "stable", fail: "échec", trivial: "cas trivial", outside: "hors de H", intersection: "intersection", union: "réunion", partition: "partition", size: "taille |H|", formula: "formule", distinct: "distincts", cycle: "cycle", order: "ordre", coprime: "premiers entre eux", triangle: "U₃", generators: "générateurs", group: "groupe", multiples: "multiples", generator: "générateur", infinite: "infini", pm1: "±1", lagrange: "Lagrange", whole: "G entier", subgroups: "sous-groupes", image: "image", preimage: "image réciproque", injective: "injectivité", first: "f d'abord", second: "puis g", kernel: "noyau", morphism: "morphisme", sigma: "σ", tau: "τ", decompose: "décomposition", cycles: "cycles", transpositions: "transpositions", odd: "impair", product: "produit", nonabelian: "non abélien", forward: "⇒", backward: "⇐", normal: "normal", welldefined: "bien défini", projection: "projection", bijective: "bijective", surjective: "surjective", subgroup: "sous-groupe", lattice: "réseau", bezout: "Bézout", domain: "intègre", zerodiv: "diviseurs de 0", polynomial: "polynômes", never: "jamais corps", absorb: "absorption", unit: "unité",
};

type Parts = Map<string, THREE.Object3D[]>;
interface Built { group: THREE.Group; parts: Parts; tick: (t: number) => void }
function add(parts: Parts, ...args: (string | THREE.Object3D)[]) {
  const names: string[] = []; const objs: THREE.Object3D[] = [];
  for (const a of args) { if (typeof a === "string") names.push(a); else objs.push(a); }
  for (const n of names) parts.set(n, [...(parts.get(n) ?? []), ...objs]);
  return objs;
}
function label(text: string, x: number, y: number, z: number, color = "#f3ead8", s = 0.5) { const l = makeLabel(text, color, s); l.position.set(x, y, z); return l; }
function arrow(a: THREE.Vector3, b: THREE.Vector3, color: number, dashed = false) {
  const l = line([a, b], color, 0.85, dashed);
  const dir = b.clone().sub(a).normalize(); const head = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 10), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
  head.position.copy(b.clone().sub(dir.clone().multiplyScalar(0.1))); head.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  const g = new THREE.Group(); g.add(l, head); return g;
}
function nodesOnCircle(n: number, r: number, y = 0): THREE.Vector3[] { return Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2 - Math.PI / 2; return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r); }); }

function buildGraph(kind: SceneKind): Built {
  const g = new THREE.Group(); const parts: Parts = new Map(); const ticks: ((t: number) => void)[] = [];
  if (kind === "hierarchy") {
    const levels = [["Magma", "LCI"], ["Semi-groupe", "+ associative"], ["Monoïde", "+ neutre"], ["Groupe", "+ inverses"], ["Abélien", "+ commutatif"]];
    levels.forEach(([a, b], i) => { const bx = box(2.2 - i * 0.25, 0.28, 0.9, [PALETTE.cool, PALETTE.lapis, PALETTE.turquoise, PALETTE.emerald, PALETTE.gold][i], 0.55); bx.position.set(0, i * 0.42, 0); g.add(bx); g.add(label(a, 0, i * 0.42 + 0.28, 0.5, "#f3ead8", 0.45)); g.add(label(b, 1.5, i * 0.42, 0, "#9aa7c7", 0.35)); add(parts, i === 3 ? "group" : i === 0 ? "closure" : "stable", bx); if (i < 4) g.add(arrow(new THREE.Vector3(0, i * 0.42 + 0.15, 0), new THREE.Vector3(0, (i + 1) * 0.42 - 0.15, 0), PALETTE.gold)); });
    add(parts, "identity", ...g.children.slice(6, 9)); add(parts, "inverse", ...g.children.slice(9, 12)); add(parts, "fail", g.children[0]);
  } else if (kind === "lci") {
    const E = sphere(1.1, PALETTE.lapis, 0.1, true); E.position.set(1.2, 0.6, 0); g.add(E); g.add(label("E", 1.2, 1.9, 0, "#4f7cff"));
    const ExE = sphere(1.0, PALETTE.magenta, 0.1, true); ExE.position.set(-1.4, 0.6, 0); g.add(ExE); g.add(label("E×E", -1.4, 1.9, 0, "#ff5fa2"));
    const p1 = glowSphere(0.08, PALETTE.gold); p1.position.set(-1.6, 0.8, 0.3); const p2 = glowSphere(0.08, PALETTE.gold); p2.position.set(-1.2, 0.4, -0.3); const out = glowSphere(0.1, PALETTE.emerald); out.position.set(1.2, 0.6, 0);
    g.add(p1, p2, out); g.add(arrow(p1.position, out.position, PALETTE.gold)); g.add(arrow(p2.position, out.position, PALETTE.gold)); g.add(label("⋆", 0, 1.1, 0, "#ffb547", 0.7));
    add(parts, "closure", out, E); add(parts, "stable", out); const t0 = performance.now(); ticks.push((t) => { out.scale.setScalar(1 + 0.15 * Math.sin((t - t0) / 400)); });
  } else if (kind === "partition" || kind === "orbits" || kind === "conjugacy") {
    const cols = [PALETTE.lapis, PALETTE.gold, PALETTE.emerald, PALETTE.magenta];
    const clusters = kind === "orbits" ? [[0, 1, 3], [2, 4, 6], [5]] : [[0, 1, 2], [3, 4], [5, 6]];
    clusters.forEach((cl, k) => {
      const cx = -1.4 + k * 1.4; const shell = sphere(0.6, cols[k], 0.12, true); shell.position.set(cx, 0.5, 0); g.add(shell); add(parts, "classes", "partition", shell);
      cl.forEach((i, j) => { const p = glowSphere(0.07, cols[k]); p.position.set(cx + Math.cos(j * 2.1) * 0.3, 0.5 + Math.sin(j * 2.1) * 0.3, 0.1); g.add(p); g.add(label(String(i + 1), p.position.x, p.position.y + 0.18, 0.1, "#f3ead8", 0.35)); add(parts, "classes", p); if (cl.length > 1) { const q = cl[(j + 1) % cl.length]; const a = j * 2.1, b = ((j + 1) % cl.length) * 2.1; g.add(arrow(new THREE.Vector3(cx + Math.cos(a) * 0.3, 0.5 + Math.sin(a) * 0.3, 0.1), new THREE.Vector3(cx + Math.cos(b) * 0.3, 0.5 + Math.sin(b) * 0.3, 0.1), cols[k])); void q; } });
    });
    add(parts, "sigma", ...g.children.filter((_, i) => i % 3 === 0)); add(parts, "tau", ...g.children.filter((_, i) => i % 3 === 1));
  } else {
    // relations
    const pts = nodesOnCircle(3, 1.2, 0.3); const names = ["a", "b", "c"];
    pts.forEach((p, i) => { const s = glowSphere(0.1, PALETTE.gold); s.position.copy(p); g.add(s); g.add(label(names[i], p.x * 1.25, p.y + 0.25, p.z * 1.25, "#ffb547", 0.5)); add(parts, "nodes", s); });
    const loops = pts.map((p) => { const c = circle(0.18, PALETTE.emerald, 0.9, 32); c.position.set(p.x, p.y + 0.25, p.z); g.add(c); return c; }); add(parts, "reflexive", ...loops);
    const ab = arrow(pts[0], pts[1], PALETTE.lapis); const ba = arrow(pts[1].clone().add(new THREE.Vector3(0, 0.12, 0)), pts[0].clone().add(new THREE.Vector3(0, 0.12, 0)), PALETTE.magenta); g.add(ab, ba); add(parts, "symmetric", ba); add(parts, "transitive", ab);
    const bc = arrow(pts[1], pts[2], PALETTE.lapis); const ac = arrow(pts[0].clone().add(new THREE.Vector3(0, 0.35, 0)), pts[2].clone().add(new THREE.Vector3(0, 0.35, 0)), PALETTE.gold, true); g.add(bc, ac); add(parts, "transitive", bc, ac);
    g.add(label("a→b→c ⇒ a→c", 0, 1.6, 0, "#ffb547", 0.5));
    const t0 = performance.now(); ticks.push((t) => { const k = Math.sin((t - t0) / 600) > 0; (ac.children[0] as THREE.Line).visible = true; ac.scale.setScalar(k ? 1 : 0.98); });
  }
  return { group: g, parts, tick: (t) => ticks.forEach((f) => f(t)) };
}

function buildGroup(kind: SceneKind): Built {
  const g = new THREE.Group(); const parts: Parts = new Map(); const ticks: ((t: number) => void)[] = [];
  if (kind === "cayley") {
    const N = 3; const cell = 0.7;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { const v = (i + j) % N; const h = 0.2 + v * 0.4; const b = box(cell * 0.85, h, cell * 0.85, [PALETTE.lapis, PALETTE.turquoise, PALETTE.gold][v], 0.75); b.position.set(-0.7 + i * cell, h / 2, -0.7 + j * cell); g.add(b); add(parts, v === 0 ? "identity" : "inverse", b); }
    for (let i = 0; i < N; i++) { g.add(label(String(i), -0.7 + i * cell, 0.05, 0.8, "#f3ead8", 0.4)); g.add(label(String(i), -1.15, 0.05, -0.7 + i * cell, "#f3ead8", 0.4)); }
    g.add(label("ℤ/3ℤ , +", 0, 1.6, 0, "#ffb547", 0.6));
  } else if (kind === "subgroup" || kind === "intersection" || kind === "generated" || kind === "subring") {
    const G = sphere(1.5, PALETTE.cool, 0.07, true); g.add(G); g.add(label("G", -1.6, 1.4, 0, "#9aa7c7")); add(parts, "whole", G);
    const H = sphere(0.8, kind === "subring" ? PALETTE.emerald : PALETTE.lapis, 0.3); H.position.set(-0.3, 0, 0); g.add(H); add(parts, "H", "subgroup", "stable", H);
    if (kind === "intersection") { const K = sphere(0.8, PALETTE.magenta, 0.3); K.position.set(0.5, 0, 0); g.add(K); const I = sphere(0.35, PALETTE.gold, 0.6); I.position.set(0.1, 0, 0); g.add(I); add(parts, "intersection", I); add(parts, "union", H, K); }
    if (kind === "generated") { [1.0, 1.25].forEach((r) => { const s = sphere(r, PALETTE.turquoise, 0.08, true); g.add(s); add(parts, "generated", s); }); }
    const e = glowSphere(0.09, PALETTE.gold); e.position.set(-0.3, 0, 0.6); g.add(e); g.add(label("e", -0.3, 0.25, 0.6, "#ffb547", 0.45)); add(parts, "identity", e);
    const x = glowSphere(0.07, PALETTE.emerald); x.position.set(-0.7, 0.3, 0.3); const y = glowSphere(0.07, PALETTE.emerald); y.position.set(0.1, -0.3, 0.3); g.add(x, y); g.add(label("x", -0.7, 0.55, 0.3, "#3ddc97", 0.4)); g.add(label("y", 0.1, -0.05, 0.3, "#3ddc97", 0.4)); add(parts, "stable", x, y);
    const z = glowSphere(0.07, PALETTE.red); z.position.set(1.1, 0.6, 0.2); g.add(z); g.add(label("z∉H", 1.1, 0.85, 0.2, "#ff5c5c", 0.4)); add(parts, "outside", "fail", z);
    const t0 = performance.now(); ticks.push((t) => { H.scale.setScalar(1 + 0.03 * Math.sin((t - t0) / 700)); });
  } else if (kind === "lagrange" || kind === "cosets" || kind === "quotient" || kind === "ringquotient") {
    const cols = [PALETTE.lapis, PALETTE.gold, PALETTE.emerald, PALETTE.magenta];
    for (let k = 0; k < 4; k++) for (let j = 0; j < 3; j++) { const b = box(0.4, 0.4, 0.4, cols[k], 0.7); b.position.set(-1.2 + k * 0.8, 0.25 + (kind === "quotient" || kind === "ringquotient" ? 0 : j * 0.45), -0.45 + j * 0.45); g.add(b); add(parts, "partition", "size", b); if (j === 0) add(parts, "classes", b); }
    g.add(label(kind === "quotient" || kind === "ringquotient" ? "G → G/H : chaque classe → un point" : "|G| = 4 × 3 = 12", 0, 1.9, 0, "#ffb547", 0.55));
    if (kind === "quotient" || kind === "ringquotient") { for (let k = 0; k < 4; k++) { const p = glowSphere(0.14, cols[k]); p.position.set(-1.2 + k * 0.8, 1.2, 0); g.add(p); add(parts, "projection", p); g.add(arrow(new THREE.Vector3(-1.2 + k * 0.8, 0.5, 0), new THREE.Vector3(-1.2 + k * 0.8, 1.0, 0), cols[k], true)); } add(parts, "welldefined", ...g.children.slice(-8)); }
    add(parts, "formula", ...g.children.slice(0, 12));
  } else if (kind === "cyclic" || kind === "euler" || kind === "prime" || kind === "cycle") {
    const n = kind === "cycle" ? 4 : kind === "prime" ? 11 : 6; const R = 1.4; const pts = nodesOnCircle(n, R, 0.2);
    g.add(circle(R, PALETTE.cool, 0.4));
    const coprime = (k: number) => { const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a; return gcd(k, n) === 1; };
    pts.forEach((p, i) => { const col = kind === "euler" ? (coprime(i) ? PALETTE.emerald : PALETTE.cool) : kind === "prime" ? (i === 0 ? PALETTE.gold : PALETTE.emerald) : (i % 2 === 0 ? PALETTE.lapis : PALETTE.turquoise); const s = glowSphere(0.09, col); s.position.copy(p); g.add(s); g.add(label(kind === "cycle" ? String(i + 1) : String(i), p.x * 1.2, p.y + 0.2, p.z * 1.2, "#f3ead8", 0.4)); add(parts, "coprime", "generators", "subgroups", s); });
    const step = kind === "prime" ? 3 : 1; const path: THREE.Vector3[] = []; let x = 0; for (let k = 0; k <= n; k++) { path.push(pts[x].clone()); x = (x + step) % n; }
    g.add(line(path, PALETTE.gold, 0.9)); add(parts, "cycle", "order", "lagrange", "whole", g.children[g.children.length - 1]);
    const token = glowSphere(0.08, PALETTE.gold, 0.4); g.add(token); const curve = new THREE.CatmullRomCurve3(path.slice(0, -1), true);
    const t0 = performance.now(); ticks.push((t) => { token.position.copy(curve.getPoint(((t - t0) / 4000) % 1)); token.position.y = 0.3; });
    g.add(label(kind === "euler" ? "φ(6)=2 : 1 et 5" : kind === "prime" ? "ℤ/11 : saut de 3 visite tout" : kind === "cycle" ? "(1,2,3,4)" : "⟨x⟩ : les puissances tournent", 0, 1.4, 0, "#ffb547", 0.5));
    add(parts, "distinct", ...g.children.slice(1, n + 1)); add(parts, "infinite", g.children[0]); add(parts, "pm1", token); add(parts, "triangle", ...g.children.slice(1, 4)); add(parts, "generator", token); add(parts, "multiples", ...g.children.slice(1, n + 1));
  } else if (kind === "center" || kind === "normal") {
    const G = sphere(1.5, PALETTE.cool, 0.07, true); g.add(G);
    const Z = sphere(0.55, PALETTE.gold, 0.4); g.add(Z); add(parts, "kernel", "normal", Z); g.add(label(kind === "center" ? "Z(G)" : "H ⊴ G", 0, 0.9, 0, "#ffb547", 0.6));
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const p = glowSphere(0.07, PALETTE.lapis); p.position.set(Math.cos(a) * 1.1, Math.sin(a) * 1.1, 0); g.add(p); const q = p.position.clone().multiplyScalar(0.4); g.add(arrow(p.position, q, PALETTE.magenta, true)); add(parts, "morphism", p); }
    const t0 = performance.now(); ticks.push((t) => { Z.scale.setScalar(1 + 0.05 * Math.sin((t - t0) / 500)); });
  } else if (kind === "product" || kind === "internal") {
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const b = box(0.45, 0.2 + (i + j) * 0.12, 0.45, i === 0 ? PALETTE.gold : j === 0 ? PALETTE.magenta : PALETTE.lapis, 0.7); b.position.set(-0.7 + i * 0.7, (0.2 + (i + j) * 0.12) / 2, -0.7 + j * 0.7); g.add(b); add(parts, i === 0 ? "kernel" : j === 0 ? "image" : "morphism", b); }
    g.add(label(kind === "internal" ? "G = HK, H∩K={e}" : "G₁ × G₂", 0, 1.5, 0, "#ffb547", 0.6)); add(parts, "unique", ...g.children.slice(0, 3)); add(parts, "cardinal", ...g.children.slice(0, 9)); add(parts, "exchange", ...g.children.slice(0, 9));
  }
  return { group: g, parts, tick: (t) => ticks.forEach((f) => f(t)) };
}

function buildMap(kind: SceneKind): Built {
  const g = new THREE.Group(); const parts: Parts = new Map(); const ticks: ((t: number) => void)[] = [];
  const three = kind === "composition" || kind === "universal" || kind === "iso1";
  const xs = three ? [-1.8, 0, 1.8] : [-1.3, 1.3]; const names = three ? ["G", "G'", "G''"] : ["G", "G'"]; const cols = [PALETTE.lapis, PALETTE.gold, PALETTE.emerald];
  const domains = xs.map((x, i) => { const s = sphere(0.65, cols[i], 0.16, true); s.position.set(x, 0.5, 0); g.add(s); g.add(label(kind === "iso1" && i === 1 ? "G/Ker f" : names[i], x, -0.4, 0, "#" + cols[i].toString(16).padStart(6, "0"), 0.55)); return s; });
  add(parts, "first", domains[0]); add(parts, "second", domains[three ? 2 : 1]); if (three) add(parts, "morphism", domains[1]);
  const ker = sphere(0.25, PALETTE.magenta, 0.5); ker.position.set(xs[0] - 0.15, 0.5, 0.2); g.add(ker); add(parts, "kernel", ker); g.add(label("Ker f", xs[0] - 0.15, 1.0, 0.2, "#ff5fa2", 0.4));
  const e2 = glowSphere(0.08, PALETTE.gold); e2.position.set(xs[three ? 2 : 1], 0.5, 0.3); g.add(e2); add(parts, "identity", e2); g.add(label("e'", xs[three ? 2 : 1] + 0.2, 0.75, 0.3, "#ffb547", 0.4));
  const im = sphere(0.35, PALETTE.emerald, 0.35); im.position.set(xs[three ? 2 : 1] + 0.1, 0.4, -0.1); g.add(im); add(parts, "image", "bijective", "surjective", im);
  for (let i = 0; i < xs.length - 1; i++) {
    const a = new THREE.Vector3(xs[i] + 0.65, 0.7, 0), b = new THREE.Vector3(xs[i + 1] - 0.65, 0.7, 0); const mid = a.clone().add(b).multiplyScalar(0.5).add(new THREE.Vector3(0, 0.5, 0));
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b); g.add(line(curve.getPoints(30), PALETTE.gold, 0.85, true)); g.add(label(i === 0 ? "f" : "g", mid.x, mid.y + 0.2, 0, "#ffb547", 0.5));
    const dot = glowSphere(0.06, PALETTE.warm, 0.4); g.add(dot); const t0 = performance.now(); ticks.push((t) => { dot.position.copy(curve.getPoint(((t - t0) / 1600 + i * 0.5) % 1)); });
    add(parts, i === 0 ? "first" : "second", dot);
  }
  if (kind === "iso") { (domains[1] as THREE.Mesh).material = (domains[0].material as THREE.Material).clone(); g.add(label("≃", 0, 1.5, 0, "#3ddc97", 0.8)); add(parts, "injective", ...domains); }
  if (kind === "universal") { g.add(arrow(new THREE.Vector3(-1.8, 1.2, 0), new THREE.Vector3(1.8, 1.2, 0), PALETTE.magenta, true)); g.add(label("f = φ∘p", 0, 1.9, 0, "#ff5fa2", 0.5)); add(parts, "unique", ...g.children.slice(-2)); add(parts, "welldefined", ker); }
  if (kind === "iso1") { g.add(label("φ(x̄)=f(x)", 0.9, 1.6, 0, "#3ddc97", 0.5)); add(parts, "welldefined", ker); }
  if (kind === "inner") { g.add(label("σₓ(g)=xgx⁻¹", 0, 1.6, 0, "#ffb547", 0.55)); }
  if (kind === "ringmorph") { g.add(label("f(x+y)=f(x)+f(y), f(xy)=f(x)f(y)", 0, 1.6, 0, "#ffb547", 0.45)); }
  add(parts, "preimage", domains[0]);
  return { group: g, parts, tick: (t) => ticks.forEach((f) => f(t)) };
}

function buildPerm(kind: SceneKind): Built {
  const g = new THREE.Group(); const parts: Parts = new Map(); const ticks: ((t: number) => void)[] = [];
  if (kind === "cycle" || kind === "transposition") {
    const n = kind === "cycle" ? 4 : 4; const pts = nodesOnCircle(n, 1.2, 0.3);
    pts.forEach((p, i) => { const s = glowSphere(0.1, kind === "transposition" && (i === 1 || i === 3) ? PALETTE.magenta : PALETTE.lapis); s.position.copy(p); g.add(s); g.add(label(String(i + 1), p.x * 1.25, p.y + 0.2, p.z * 1.25, "#f3ead8", 0.5)); add(parts, "decompose", "cycles", s); });
    if (kind === "cycle") { for (let i = 0; i < n; i++) g.add(arrow(pts[i], pts[(i + 1) % n], PALETTE.gold)); const token = glowSphere(0.08, PALETTE.gold, 0.4); g.add(token); const curve = new THREE.CatmullRomCurve3(pts, true); const t0 = performance.now(); ticks.push((t) => token.position.copy(curve.getPoint(((t - t0) / 3000) % 1))); add(parts, "transpositions", token); }
    else { g.add(arrow(pts[1], pts[3], PALETTE.magenta)); g.add(arrow(pts[3].clone().add(new THREE.Vector3(0, 0.15, 0)), pts[1].clone().add(new THREE.Vector3(0, 0.15, 0)), PALETTE.magenta)); g.add(label("τ²=Id", 0, 1.5, 0, "#ff5fa2", 0.6)); }
  } else {
    const perm = kind === "inversions" ? [1, 2, 3, 4, 0, 5, 6] : kind === "signature" ? [1, 0, 2, 3, 4] : [4, 0, 1, 2, 3]; const N = perm.length; const xs = (i: number) => -1.5 + (i / (N - 1)) * 3; const top = 1.6, bot = 0.1;
    const eps = (() => { let c = 0; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (perm[i] > perm[j]) c++; return c % 2 ? -1 : 1; })();
    for (let i = 0; i < N; i++) {
      const a = new THREE.Vector3(xs(i), top, 0), b = new THREE.Vector3(xs(perm[i]), bot, 0); const curve = new THREE.CubicBezierCurve3(a, new THREE.Vector3(xs(i), top * 0.6, 0.2), new THREE.Vector3(xs(perm[i]), top * 0.4, -0.2), b);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.03, 8, false), new THREE.MeshStandardMaterial({ color: eps > 0 ? PALETTE.emerald : PALETTE.magenta, emissive: eps > 0 ? 0x0a4a2a : 0x4a0a2a, emissiveIntensity: 0.5, transparent: true, opacity: 0.85 })); g.add(tube); add(parts, "first", "decompose", tube);
      const s1 = glowSphere(0.06, PALETTE.gold); s1.position.copy(a); const s2 = glowSphere(0.06, PALETTE.turquoise); s2.position.copy(b); g.add(s1, s2); g.add(label(String(i + 1), xs(i), top + 0.2, 0, "#ffb547", 0.4)); g.add(label(String(i + 1), xs(i), bot - 0.2, 0, "#39d0d8", 0.4));
      const dot = glowSphere(0.045, PALETTE.warm, 0.4); g.add(dot); const t0 = performance.now(); ticks.push((t) => dot.position.copy(curve.getPoint(((t - t0) / 2000 + i * 0.1) % 1))); add(parts, "second", dot);
    }
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (perm[i] > perm[j]) { const c = glowSphere(0.05, PALETTE.red, 0.5); c.position.set((xs(i) + xs(j) + xs(perm[i]) + xs(perm[j])) / 4, top * 0.5, 0.3); g.add(c); add(parts, "odd", "product", c); }
    g.add(label(kind === "signature" ? `ε = ${eps > 0 ? "+1" : "−1"}` : kind === "inversions" ? "croisements = inversions" : "σ₁∘σ₂ ≠ σ₂∘σ₁", 0, top + 0.6, 0, eps > 0 ? "#3ddc97" : "#ff5fa2", 0.55)); add(parts, "morphism", ...g.children.slice(-1)); add(parts, "nonabelian", ...g.children.slice(-1));
  }
  return { group: g, parts, tick: (t) => ticks.forEach((f) => f(t)) };
}

function buildRing(kind: SceneKind): Built {
  const g = new THREE.Group(); const parts: Parts = new Map(); const ticks: ((t: number) => void)[] = [];
  if (kind === "gauss") {
    for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) { const unit = Math.abs(a) + Math.abs(b) === 1; const p = glowSphere(0.06, unit ? PALETTE.gold : PALETTE.emerald, 0.2); p.position.set(a * 0.55, b * 0.55 + 0.5, 0); g.add(p); add(parts, "lattice", "subgroup", p); if (unit) add(parts, "product", p); }
    g.add(line([new THREE.Vector3(-1.5, 0.5, 0), new THREE.Vector3(1.5, 0.5, 0)], PALETTE.cool, 0.6)); g.add(line([new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 2, 0)], PALETTE.cool, 0.6));
    g.add(label("ℤ[i] : réseau entier", 0, 2.1, 0, "#3ddc97", 0.55));
  } else if (kind === "ideal" || kind === "maximal") {
    const A = sphere(1.5, PALETTE.cool, 0.07, true); g.add(A); g.add(label("A", -1.6, 1.5, 0, "#9aa7c7"));
    const I = sphere(0.7, PALETTE.emerald, 0.3); I.position.set(-0.3, 0.4, 0); g.add(I); add(parts, "absorb", "unit", I); g.add(label(kind === "maximal" ? "M maximal" : "I idéal", -0.3, 1.3, 0, "#3ddc97", 0.5));
    const x = glowSphere(0.07, PALETTE.gold); x.position.set(-0.5, 0.4, 0.4); const a = glowSphere(0.07, PALETTE.magenta); a.position.set(1.1, 1.0, 0.2); const ax = glowSphere(0.08, PALETTE.emerald); ax.position.set(0.1, 0.2, 0.4); g.add(x, a, ax);
    g.add(label("x∈I", -0.5, 0.65, 0.4, "#ffb547", 0.4)); g.add(label("a∈A", 1.1, 1.25, 0.2, "#ff5fa2", 0.4)); g.add(label("ax∈I", 0.1, 0.45, 0.4, "#3ddc97", 0.4)); g.add(arrow(a.position, ax.position, PALETTE.gold)); add(parts, "absorb", x, ax);
    if (kind === "maximal") { const chain = [0.3, 0.7, 1.5].map((r, i) => { const s = sphere(r, [PALETTE.emerald, PALETTE.lapis, PALETTE.cool][i], 0.08, true); g.add(s); return s; }); add(parts, "whole", chain[2]); g.add(label("A/M corps · A/P intègre", 0, 1.9, 0, "#ffb547", 0.5)); }
  } else if (kind === "polynomial") {
    const degs = [1, 2, 3, 2, 5]; degs.forEach((d, i) => { const b = box(0.4, d * 0.3, 0.4, i === 4 ? PALETTE.gold : PALETTE.lapis, 0.7); b.position.set(-1.2 + i * 0.6, d * 0.15, 0); g.add(b); add(parts, "polynomial", b); }); g.add(label("deg(PQ) ≤ deg P + deg Q", 0, 1.9, 0, "#ffb547", 0.5)); add(parts, "never", ...g.children.slice(-1));
  } else {
    // ring / field / domain / units / subring
    const N = 6; const cell = 0.42;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const v = (i * j) % N; const zero = v === 0 && i !== 0 && j !== 0; const unit = [1, 5].includes(i) && [1, 5].includes(j);
      const col = zero ? PALETTE.red : kind === "field" ? PALETTE.emerald : unit || kind === "units" && [1, 5].includes(v) ? PALETTE.gold : PALETTE.lapis;
      const b = box(cell * 0.85, 0.12 + v * 0.12, cell * 0.85, col, 0.75); b.position.set(-1.05 + i * cell, (0.12 + v * 0.12) / 2, -1.05 + j * cell); g.add(b); add(parts, zero ? "zerodiv" : "domain", b); if (unit) add(parts, "unit", "bezout", b);
    }
    g.add(label(kind === "field" ? "corps : tout ≠0 inversible" : kind === "domain" ? "intègre : xy=0 ⇒ x=0 ou y=0" : kind === "units" ? "U(A) : les inversibles" : "ℤ/6ℤ : 2̄·3̄=0̄", 0, 1.5, 0, "#ffb547", 0.5));
    add(parts, "subgroup", ...g.children.slice(0, 6)); add(parts, "product", ...g.children.slice(0, 36));
    const t0 = performance.now(); ticks.push((t) => { g.rotation.y = Math.sin((t - t0) / 3000) * 0.1; });
  }
  return { group: g, parts, tick: (t) => ticks.forEach((f) => f(t)) };
}

function build(kind: SceneKind): Built {
  if (["relations", "partition", "lci", "hierarchy", "orbits", "conjugacy"].includes(kind)) return buildGraph(kind);
  if (["morphism", "kernel", "composition", "iso", "inner", "iso1", "universal", "ringmorph"].includes(kind)) return buildMap(kind);
  if (["perm", "cycle", "transposition", "inversions", "signature"].includes(kind)) return buildPerm(kind);
  if (["ring", "subring", "gauss", "units", "field", "domain", "ideal", "ringquotient", "maximal", "polynomial"].includes(kind)) return buildRing(kind);
  return buildGroup(kind);
}

export default function MiniScene({ kind, focus, title, height = 250 }: { kind: SceneKind; focus?: string; title: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(() => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState(false);
  const focusRef = useRef(focus); focusRef.current = focus;
  const playingRef = useRef(playing); playingRef.current = playing;
  const controlsRef = useRef<OrbitControls | null>(null);
  useEffect(() => { const el = ref.current; if (!el) return; if (!("IntersectionObserver" in window)) { setVisible(true); return; } const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" }); obs.observe(el); return () => obs.disconnect(); }, []);
  useEffect(() => {
    const el = ref.current; if (!el || !visible) return;
    let renderer: THREE.WebGLRenderer; try { renderer = makeRenderer(el); } catch { setFailed(true); return; }
    const scene = new THREE.Scene(); scene.fog = new THREE.FogExp2(PALETTE.bg, 0.06);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100); camera.position.set(0.5, 1.6, 4.8);
    const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = 0.07; controls.autoRotate = true; controls.autoRotateSpeed = 0.5; controls.minDistance = 2.5; controls.maxDistance = 9; controls.target.set(0, 0.5, 0); controls.saveState(); controlsRef.current = controls;
    setupLights(scene, 1.1); const particles = makeParticles(120, 7); scene.add(particles);
    const built = build(kind); scene.add(built.group);
    const materials: { mat: THREE.Material; base: number; names: string[] }[] = [];
    built.parts.forEach((objs, name) => objs.forEach((o) => o.traverse((c) => { const m = (c as THREE.Mesh).material as THREE.Material | undefined; if (m && "opacity" in m) materials.push({ mat: m, base: (m as THREE.MeshStandardMaterial).opacity ?? 1, names: [name] }); })));
    const resize = () => { const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h, false); };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    let time = 0;
    renderer.setAnimationLoop((now) => { const dt = 0.016; if (playingRef.current) time += dt; controls.autoRotate = playingRef.current; controls.update(dt); if (playingRef.current) built.tick(now); particles.rotation.y = time * 0.02; const f = focusRef.current; materials.forEach(({ mat, base, names }) => { const target = !f || names.includes(f) ? base : base * 0.15; const cur = (mat as THREE.MeshStandardMaterial).opacity; (mat as THREE.MeshStandardMaterial).opacity = cur + (target - cur) * 0.12; }); renderer.render(scene, camera); });
    return () => { renderer.setAnimationLoop(null); ro.disconnect(); controls.dispose(); disposeObject(scene); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); controlsRef.current = null; };
  }, [visible, kind, expanded]);
  useEffect(() => { if (!expanded) return; const old = document.body.style.overflow; document.body.style.overflow = "hidden"; const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); }; window.addEventListener("keydown", onKey); return () => { document.body.style.overflow = old; window.removeEventListener("keydown", onKey); }; }, [expanded]);
  const canvas = (
    <div className={`jb-mini ${expanded ? "jb-mini-expanded" : ""}`} style={{ height: expanded ? "min(70vh,620px)" : height }}>
      <div ref={ref} className="jb-mini-canvas" role="img" aria-label={`Schéma 3D : ${title}`} />
      {failed && <div className="jb-mini-fallback">Schéma 3D indisponible — le texte reste accessible.</div>}
      <div className="jb-mini-toolbar">
        <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Lecture"}>{playing ? <Pause size={13} /> : <Play size={13} />}</button>
        <button type="button" onClick={() => controlsRef.current?.reset()} aria-label="Recadrer"><RotateCcw size={13} /></button>
        <button type="button" onClick={() => setExpanded((e) => !e)} aria-label={expanded ? "Fermer" : "Agrandir"}>{expanded ? <X size={13} /> : <Maximize2 size={13} />}</button>
      </div>
      <div className="jb-mini-hint">glisser · molette</div>
      {focus && <div className="jb-mini-focus">{FOCUS_LABELS[focus] ?? focus}</div>}
    </div>
  );
  if (!expanded) return canvas;
  return (
    <>
      <button type="button" className="jb-mini-placeholder" onClick={() => setExpanded(false)}>Schéma ouvert en grand</button>
      <div className="jb-mini-overlay" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => { if (e.target === e.currentTarget) setExpanded(false); }}>
        <div className="jb-mini-modal"><div className="jb-mini-modal-head"><h4>{title}</h4><button type="button" onClick={() => setExpanded(false)} aria-label="Fermer"><X size={18} /></button></div>{canvas}</div>
      </div>
    </>
  );
}
