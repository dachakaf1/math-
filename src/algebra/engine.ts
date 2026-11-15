// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
export type GroupId = "Z2" | "Z3" | "Z4" | "Z5" | "Z6" | "Z7" | "Z8" | "Z11" | "Z12" | "K4" | "S3" | "D4" | "U8" | "U10";

export interface GroupSpec {
  id: GroupId;
  name: string;
  tex: string;
  elements: string[];
  op: (a: number, b: number) => number;
  identity: number;
  abelian: boolean;
  kind: "cyclic" | "klein" | "symmetric" | "dihedral" | "units";
  description: string;
}

const mod = (a: number, n: number) => ((a % n) + n) % n;
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const phi = (n: number) => { let c = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) c++; return c; };
export const isPrime = (n: number) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
export const divisors = (n: number) => { const d: number[] = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
export const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

function cyclic(n: number): GroupSpec {
  return {
    id: `Z${n}` as GroupId, name: `ℤ/${n}ℤ`, tex: `\\mathbb{Z}/${n}\\mathbb{Z}`, kind: "cyclic", abelian: true,
    elements: Array.from({ length: n }, (_, i) => `\\bar{${i}}`),
    op: (a, b) => mod(a + b, n), identity: 0,
    description: `Groupe cyclique additif d'ordre ${n}, engendré par \\bar{1}.`,
  };
}

// S3 elements as permutations of [0,1,2] in one-line notation index
export const S3_PERMS: number[][] = [
  [0, 1, 2], [1, 2, 0], [2, 0, 1], [1, 0, 2], [0, 2, 1], [2, 1, 0],
];
export const S3_NAMES = ["e", "(123)", "(132)", "(12)", "(23)", "(13)"];
export function composePerm(p: number[], q: number[]): number[] { return p.map((_, i) => p[q[i]]); }
export function permIndex(p: number[]): number { return S3_PERMS.findIndex((q) => q.every((v, i) => v === p[i])); }

const S3: GroupSpec = {
  id: "S3", name: "S₃", tex: "S_3", kind: "symmetric", abelian: false,
  elements: S3_NAMES, op: (a, b) => permIndex(composePerm(S3_PERMS[a], S3_PERMS[b])), identity: 0,
  description: "Groupe symétrique sur 3 lettres, d'ordre 6, non abélien.",
};
const K4: GroupSpec = {
  id: "K4", name: "V₄ (Klein)", tex: "V_4", kind: "klein", abelian: true,
  elements: ["e", "a", "b", "c"], op: (a, b) => a === 0 ? b : b === 0 ? a : a === b ? 0 : 3 - (a + b) + 3, identity: 0,
  description: "Groupe de Klein : tout élément non neutre est d'ordre 2.",
};
// fix K4 op: xor on 2 bits
K4.op = (a, b) => a ^ b;

// D4 = symmetries of square: r^k s^e, encoded k + 4e (e=0 rotation, e=1 reflection)
const D4: GroupSpec = {
  id: "D4", name: "D₄", tex: "D_4", kind: "dihedral", abelian: false,
  elements: ["e", "r", "r²", "r³", "s", "rs", "r²s", "r³s"],
  op: (a, b) => {
    const ka = a % 4, ea = Math.floor(a / 4), kb = b % 4, eb = Math.floor(b / 4);
    const k = ea === 0 ? mod(ka + kb, 4) : mod(ka - kb, 4);
    return k + 4 * ((ea + eb) % 2);
  },
  identity: 0,
  description: "Groupe diédral du carré, d'ordre 8 : rotations et symétries.",
};
function units(n: number): GroupSpec {
  const els: number[] = []; for (let k = 1; k < n; k++) if (gcd(k, n) === 1) els.push(k);
  return {
    id: `U${n}` as GroupId, name: `(ℤ/${n}ℤ)×`, tex: `(\\mathbb{Z}/${n}\\mathbb{Z})^{\\times}`, kind: "units", abelian: true,
    elements: els.map((k) => `\\bar{${k}}`), op: (a, b) => els.indexOf(mod(els[a] * els[b], n)), identity: els.indexOf(1),
    description: `Groupe des unités modulo ${n}, d'ordre φ(${n}) = ${els.length}.`,
  };
}

export const GROUPS: Record<GroupId, GroupSpec> = {
  Z2: cyclic(2), Z3: cyclic(3), Z4: cyclic(4), Z5: cyclic(5), Z6: cyclic(6), Z7: cyclic(7), Z8: cyclic(8), Z11: cyclic(11), Z12: cyclic(12),
  K4, S3, D4, U8: units(8), U10: units(10),
};
export const GROUP_IDS = Object.keys(GROUPS) as GroupId[];

export function cayleyTable(g: GroupSpec): number[][] {
  return g.elements.map((_, i) => g.elements.map((__, j) => g.op(i, j)));
}
export function inverseOf(g: GroupSpec, a: number): number {
  return g.elements.findIndex((_, x) => g.op(a, x) === g.identity && g.op(x, a) === g.identity);
}
export function powerOf(g: GroupSpec, a: number, m: number): number {
  if (m === 0) return g.identity;
  if (m < 0) return powerOf(g, inverseOf(g, a), -m);
  let r = g.identity; for (let i = 0; i < m; i++) r = g.op(r, a); return r;
}
export function orderOf(g: GroupSpec, a: number): number {
  let x = a, n = 1;
  while (x !== g.identity && n <= g.elements.length + 1) { x = g.op(x, a); n++; }
  return n;
}
export function generatedBy(g: GroupSpec, gens: number[]): number[] {
  const set = new Set<number>([g.identity, ...gens]);
  let changed = true;
  while (changed) {
    changed = false;
    const arr = [...set];
    for (const a of arr) for (const b of arr) {
      const p = g.op(a, b); if (!set.has(p)) { set.add(p); changed = true; }
      const inv = inverseOf(g, a); if (!set.has(inv)) { set.add(inv); changed = true; }
    }
  }
  return [...set].sort((a, b) => a - b);
}
export function isSubgroup(g: GroupSpec, subset: number[]): boolean {
  if (!subset.length) return false;
  const s = new Set(subset);
  if (!s.has(g.identity)) return false;
  for (const a of subset) for (const b of subset) if (!s.has(g.op(a, inverseOf(g, b)))) return false;
  return true;
}
export function allSubgroups(g: GroupSpec): number[][] {
  const n = g.elements.length; const out: number[][] = [];
  for (let mask = 1; mask < 1 << n; mask++) {
    const sub: number[] = []; for (let i = 0; i < n; i++) if (mask & (1 << i)) sub.push(i);
    if (isSubgroup(g, sub)) out.push(sub);
  }
  return out.sort((a, b) => a.length - b.length);
}
export function centerOf(g: GroupSpec): number[] {
  return g.elements.map((_, x) => x).filter((x) => g.elements.every((_, y) => g.op(x, y) === g.op(y, x)));
}
export function conjugacyClasses(g: GroupSpec): number[][] {
  const seen = new Set<number>(); const classes: number[][] = [];
  for (let a = 0; a < g.elements.length; a++) {
    if (seen.has(a)) continue;
    const cls = new Set<number>();
    for (let x = 0; x < g.elements.length; x++) cls.add(g.op(g.op(x, a), inverseOf(g, x)));
    cls.forEach((c) => seen.add(c));
    classes.push([...cls].sort((p, q) => p - q));
  }
  return classes;
}
export function leftCoset(g: GroupSpec, H: number[], x: number): number[] {
  return [...new Set(H.map((h) => g.op(x, h)))].sort((a, b) => a - b);
}
export function rightCoset(g: GroupSpec, H: number[], x: number): number[] {
  return [...new Set(H.map((h) => g.op(h, x)))].sort((a, b) => a - b);
}
export function cosets(g: GroupSpec, H: number[]): number[][] {
  const seen = new Set<number>(); const out: number[][] = [];
  for (let x = 0; x < g.elements.length; x++) {
    if (seen.has(x)) continue;
    const c = leftCoset(g, H, x); c.forEach((e) => seen.add(e)); out.push(c);
  }
  return out;
}
export function isNormal(g: GroupSpec, H: number[]): boolean {
  if (!isSubgroup(g, H)) return false;
  const key = (s: number[]) => [...s].sort((a, b) => a - b).join(",");
  for (let x = 0; x < g.elements.length; x++) if (key(leftCoset(g, H, x)) !== key(rightCoset(g, H, x))) return false;
  return true;
}
export function generatorsOf(g: GroupSpec): number[] {
  return g.elements.map((_, i) => i).filter((i) => generatedBy(g, [i]).length === g.elements.length);
}
export interface GroupReport {
  closure: boolean; associativity: boolean; identity: boolean; inverses: boolean; abelian: boolean;
  isGroup: boolean; orders: number[]; center: number[]; classes: number[][]; subgroups: number[][]; generators: number[];
}
export function analyzeGroup(g: GroupSpec): GroupReport {
  const n = g.elements.length; const t = cayleyTable(g);
  const closure = t.every((row) => row.every((v) => v >= 0 && v < n));
  let associativity = true;
  outer: for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let c = 0; c < n; c++) if (g.op(g.op(a, b), c) !== g.op(a, g.op(b, c))) { associativity = false; break outer; }
  const identity = t[g.identity].every((v, i) => v === i) && t.every((row) => row[g.identity] === g.identity);
  const inverses = g.elements.every((_, a) => inverseOf(g, a) >= 0);
  const abelian = t.every((row, i) => row.every((v, j) => v === t[j][i]));
  return { closure, associativity, identity, inverses, abelian, isGroup: closure && associativity && identity && inverses, orders: g.elements.map((_, i) => orderOf(g, i)), center: centerOf(g), classes: conjugacyClasses(g), subgroups: allSubgroups(g), generators: generatorsOf(g) };
}

// ---------- Permutations ----------
export function permCycles(p: number[]): number[][] {
  const seen = new Set<number>(); const cycles: number[][] = [];
  for (let i = 0; i < p.length; i++) {
    if (seen.has(i)) continue;
    const c: number[] = []; let x = i;
    while (!seen.has(x)) { seen.add(x); c.push(x); x = p[x]; }
    if (c.length > 1) cycles.push(c);
  }
  return cycles;
}
export function inversions(p: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) if (p[i] > p[j]) out.push([i, j]);
  return out;
}
export function signature(p: number[]): 1 | -1 { return inversions(p).length % 2 === 0 ? 1 : -1; }
export function support(p: number[]): number[] { return p.map((v, i) => (v !== i ? i : -1)).filter((i) => i >= 0); }
export function orbits(p: number[]): number[][] {
  const seen = new Set<number>(); const out: number[][] = [];
  for (let i = 0; i < p.length; i++) {
    if (seen.has(i)) continue;
    const o: number[] = []; let x = i;
    while (!seen.has(x)) { seen.add(x); o.push(x); x = p[x]; }
    out.push(o);
  }
  return out;
}
export function inversePerm(p: number[]): number[] { const q: number[] = []; p.forEach((v, i) => { q[v] = i; }); return q; }
export function permToCyclesTex(p: number[]): string {
  const c = permCycles(p); if (!c.length) return "e";
  return c.map((cy) => `(${cy.map((i) => i + 1).join("\\,")})`).join("");
}
export function randomPerm(n: number): number[] {
  const p = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  return p;
}
export function transposition(n: number, i: number, j: number): number[] { const p = Array.from({ length: n }, (_, k) => k); [p[i], p[j]] = [p[j], p[i]]; return p; }

// ---------- Rings Z/nZ ----------
export interface RingReport {
  n: number; units: number[]; zeroDivisors: number[]; ideals: number[][]; isField: boolean; isDomain: boolean; prime: boolean;
  maximalIdeals: number[][]; primeIdeals: number[][];
}
export function analyzeRing(n: number): RingReport {
  const units: number[] = [], zeroDivisors: number[] = [];
  for (let a = 0; a < n; a++) {
    if (gcd(a, n) === 1 && a !== 0) units.push(a);
    else if (a !== 0) zeroDivisors.push(a);
  }
  const ideals: number[][] = [];
  for (const d of divisors(n)) { const I: number[] = []; for (let k = 0; k < n; k += d) I.push(k); ideals.push(I); }
  const prime = isPrime(n);
  const maximalIdeals = ideals.filter((I) => I.length > 1 && isPrime(n / I.length) && I.length !== n);
  const primeIdeals = ideals.filter((I) => I.length !== n && isPrime(n / I.length));
  // ideal dZ/nZ has quotient Z/dZ ; field iff d prime ; domain iff d prime ; {0} prime iff n prime
  return { n, units, zeroDivisors, ideals, isField: prime, isDomain: prime, prime, maximalIdeals, primeIdeals };
}
export function ringTable(n: number, op: "+" | "×"): number[][] {
  return Array.from({ length: n }, (_, a) => Array.from({ length: n }, (__, b) => (op === "+" ? mod(a + b, n) : mod(a * b, n))));
}
export function idealGenerated(n: number, a: number): number[] { const d = gcd(a, n); const I: number[] = []; for (let k = 0; k < n; k += d) I.push(k); return I; }

// ---------- Relations ----------
export type RelationMatrix = boolean[][];
export function relationProps(R: RelationMatrix) {
  const n = R.length;
  const reflexive = R.every((row, i) => row[i]);
  const symmetric = R.every((row, i) => row.every((v, j) => !v || R[j][i]));
  const antisymmetric = R.every((row, i) => row.every((v, j) => !v || i === j || !R[j][i]));
  let transitive = true;
  outer: for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) if (R[i][j] && R[j][k] && !R[i][k]) { transitive = false; break outer; }
  return { reflexive, symmetric, antisymmetric, transitive, order: reflexive && antisymmetric && transitive, equivalence: reflexive && symmetric && transitive };
}
export function equivalenceClasses(R: RelationMatrix): number[][] {
  const n = R.length; const seen = new Set<number>(); const out: number[][] = [];
  for (let i = 0; i < n; i++) { if (seen.has(i)) continue; const c: number[] = []; for (let j = 0; j < n; j++) if (R[i][j] && R[j][i]) { c.push(j); seen.add(j); } out.push(c); }
  return out;
}
export const RELATION_EXAMPLES: Record<string, { name: string; R: RelationMatrix; set: string[] }> = {
  leq: { name: "≤ sur {1,2,3}", set: ["1", "2", "3"], R: [[true, true, true], [false, true, true], [false, false, true]] },
  lt: { name: "< sur {1,2,3}", set: ["1", "2", "3"], R: [[false, true, true], [false, false, true], [false, false, false]] },
  parity: { name: "même parité sur {1..6}", set: ["1", "2", "3", "4", "5", "6"], R: Array.from({ length: 6 }, (_, i) => Array.from({ length: 6 }, (__, j) => (i % 2) === (j % 2))) },
  divides: { name: "divisibilité sur {1,2,3,4,6}", set: ["1", "2", "3", "4", "6"], R: [1, 2, 3, 4, 6].map((a) => [1, 2, 3, 4, 6].map((b) => b % a === 0)) },
  mod3: { name: "congruence mod 3 sur {0..8}", set: Array.from({ length: 9 }, (_, i) => String(i)), R: Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (__, j) => i % 3 === j % 3)) },
};

export const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(3));
