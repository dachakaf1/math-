import type { Item } from '../../core/content';
const r = String.raw;
/** Section 1.4 d'après le cours de Pr. I. Tahiri (numérotation officielle 1.4.1 à 1.4.8 ; l'exercice 1.4.9 est dans les exercices). */
export const S14: Item[] = [
  { id: 'def-1.4.1', kind: 'definition', number: '1.4.1', title: 'Limite d’une application', body: r`Soient $(E,\tau)$ et $(F,\tau')$ deux espaces topologiques, $f:E\to F$ une application, $a\in E$ et $b\in F$. On dit que $f$ tend vers $b$ quand $x$ tend vers $a$ si pour tout voisinage $V$ de $b$ il existe un voisinage $U$ de $a$ tel que $f(U)\subset V$.
Le point $b$ est alors appelé une limite de $f$ en $a$ ; si cette limite est unique, on la note $\lim_{x\to a}f(x)=b$.` },
  { id: 'rem-1.4.2', kind: 'remarque', number: '1.4.2', title: 'Non-unicité de la limite', body: r`Si l'espace d'arrivée $(F,\tau')$ n'est pas séparé, une application peut avoir plusieurs limites en un même point.` },
  { id: 'ex-1.4.3', kind: 'exemple', number: '1.4.3', title: 'Espace d’arrivée grossier', body: r`Si $(F,\tau')$ est l'espace grossier, tout point $b\in F$ est limite de $f$ en $a$ : le seul voisinage de $b$ est $F$, et $f(E)\subset F$.` },
  { id: 'thm-1.4.4', kind: 'theoreme', number: '1.4.4', title: 'Unicité de la limite', body: r`Soient $(E,\tau)$ et $(F,\tau')$ deux espaces topologiques, avec $(F,\tau')$ séparé. Si une application $f:E\to F$ admet une limite en un point, cette limite est unique.`,
    proof: { origin: 'cours', steps: [
      r`Supposons que $f$ admette deux limites $b\neq b'$ en $a\in E$.`,
      r`$F$ étant séparé, il existe $V\in\mathcal V_b$ et $V'\in\mathcal V_{b'}$ avec $V\cap V'=\emptyset$.`,
      r`Comme $f$ tend vers $b$, il existe $U\in\mathcal V_a$ avec $f(U)\subset V$ ; de même il existe $U'\in\mathcal V_a$ avec $f(U')\subset V'$.`,
      r`Alors $f(U\cap U')\subset f(U)\cap f(U')\subset V\cap V'=\emptyset$, donc $f(U\cap U')=\emptyset$.`,
      r`Or $a\in U\cap U'$, donc $f(a)\in f(U\cap U')$ : c'est absurde. $\blacksquare$`] } },
  { id: 'def-1.4.5', kind: 'definition', number: '1.4.5', title: 'Continuité', body: r`Soient $(E,\tau)$ et $(F,\tau')$ deux espaces topologiques et $f:E\to F$ une application.
1. $f$ est continue en $a\in E$ si $f$ tend vers $f(a)$ quand $x$ tend vers $a$.
2. $f$ est continue sur une partie $A$ de $E$ si elle est continue en tout point de $A$.
3. $f$ est continue si elle est continue sur $E$.` },
  { id: 'thm-1.4.6', kind: 'theoreme', number: '1.4.6', title: 'Caractérisations de la continuité', body: r`Soient $(E,\tau)$ et $(F,\tau')$ deux espaces topologiques et $f:E\to F$ une application. Les assertions suivantes sont équivalentes :
a) $f$ est continue.
b) Pour tout ouvert $U\subset F$, $f^{-1}(U)$ est un ouvert de $E$.
c) Pour tout fermé $V\subset F$, $f^{-1}(V)$ est un fermé de $E$.
d) Pour toute partie $A\subset E$, $f(\overline{A})\subset\overline{f(A)}$.`,
    proof: { origin: 'cours', steps: [
      r`On montre a) $\Rightarrow$ d) $\Rightarrow$ c) $\Rightarrow$ b) $\Rightarrow$ a).`,
      r`(a $\Rightarrow$ d) Soit $A\subset E$, $a\in\overline{A}$ et $W\in\mathcal V_{f(a)}$. Par continuité en $a$, il existe $U\in\mathcal V_a$ avec $f(U)\subset W$.`,
      r`Comme $a\in\overline{A}$, $U\cap A\neq\emptyset$, donc $f(U\cap A)\neq\emptyset$. Or $f(U\cap A)\subset f(U)\cap f(A)\subset W\cap f(A)$, donc $W\cap f(A)\neq\emptyset$.`,
      r`Ainsi $f(a)$ est adhérent à $f(A)$ : $f(\overline{A})\subset\overline{f(A)}$.`,
      r`(d $\Rightarrow$ c) Soit $V$ un fermé de $F$ et $W=f^{-1}(V)$. Alors $f(W)\subset V$, donc $\overline{f(W)}\subset\overline{V}=V$.`,
      r`Soit $x\in\overline{W}$ : $f(x)\in f(\overline{W})\subset\overline{f(W)}\subset V$, donc $x\in W$. Ainsi $\overline{W}\subset W$ : $W$ est fermé.`,
      r`(c $\Rightarrow$ b) Soit $U$ un ouvert de $F$. $U^c$ est fermé, donc $f^{-1}(U^c)=E\setminus f^{-1}(U)$ est fermé, c'est-à-dire que $f^{-1}(U)$ est ouvert.`,
      r`(b $\Rightarrow$ a) Soit $x_0\in E$ et $V\in\mathcal V_{f(x_0)}$ : il existe $W\in\tau'$ avec $f(x_0)\in W\subset V$. Posons $U=f^{-1}(W)$ : c'est un ouvert contenant $x_0$ et $f(U)\subset W\subset V$.`,
      r`Donc $f$ est continue en $x_0$, et ce pour tout $x_0$ : $f$ est continue. $\blacksquare$`] } },
  { id: 'cor-1.4.7', kind: 'corollaire', number: '1.4.7', title: 'Composition', body: r`La composée de deux applications continues est continue.`,
    proof: { origin: 'cours', steps: [
      r`Soient $f:E\to F$ et $g:F\to H$ continues, et $V$ un ouvert de $H$. On a $(g\circ f)^{-1}(V)=f^{-1}\big(g^{-1}(V)\big)$.`,
      r`$g$ est continue : $g^{-1}(V)$ est un ouvert de $F$. $f$ est continue : $f^{-1}\big(g^{-1}(V)\big)$ est un ouvert de $E$.`,
      r`L'image réciproque de tout ouvert de $H$ est un ouvert de $E$ : d'après le théorème 1.4.6, $g\circ f$ est continue. $\blacksquare$`] } },
  { id: 'def-1.4.8', kind: 'definition', number: '1.4.8', title: 'Homéomorphisme', body: r`Soient $(E,\tau)$ et $(F,\tau')$ deux espaces topologiques.
1. Une application $f:E\to F$ est un homéomorphisme si elle est bijective et bicontinue ($f$ et $f^{-1}$ sont continues).
2. $E$ et $F$ sont homéomorphes s'il existe un homéomorphisme de $E$ dans $F$.` },
];
