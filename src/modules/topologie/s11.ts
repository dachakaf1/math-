import type { Item } from '../../core/content';
const r = String.raw;
/** Section 1.1 réécrite en LaTeX d'après le cours de Pr. I. Tahiri (numérotation officielle). Coquilles du PDF corrigées (voir CHANGES.md). */
export const S11: Item[] = [
  { id: 'def-1.1.1', kind: 'definition', number: '1.1.1', title: 'Topologie, ouverts, espace topologique', body: r`Soit $E$ un ensemble non vide. Une topologie sur $E$ est une famille $\tau$ de parties de $E$ telle que :
i) $\emptyset\in\tau$ et $E\in\tau$ ;
ii) l'intersection de deux éléments de $\tau$ est un élément de $\tau$ (par récurrence, toute intersection finie) ;
iii) la réunion, finie ou infinie, d'une famille d'éléments de $\tau$ est un élément de $\tau$.
Les éléments de $\tau$ sont les ouverts, et $(E,\tau)$ est un espace topologique.` },
  { id: 'ex-1.1.2', kind: 'exemple', number: '1.1.2', title: 'Topologies classiques', body: r`1. Topologie discrète : $\tau_d=\mathcal P(E)$. Toute partie est ouverte.
2. Topologie grossière : $\tau_g=\{\emptyset,E\}$.
3. Sur $E=\{a,b\}$ : $\tau_1=\{\emptyset,\{a\},E\}$ et $\tau_2=\{\emptyset,\{b\},E\}$ sont des topologies. Pour $\tau_1$ : $\{a\}\cap E=\{a\}$, $\{a\}\cup E=E$, $\{a\}\cup\emptyset=\{a\}$, donc les axiomes ii) et iii) sont vérifiés.
4. Sur $\mathbb R$ : la topologie usuelle $\tau_u$ est formée de $\emptyset$, de $\mathbb R$ et des réunions quelconques d'intervalles $]a,b[$.` },
  { id: 'def-1.1.5', kind: 'definition', number: '1.1.5', title: 'Fermé', body: r`Un fermé de $(E,\tau)$ est une partie de $E$ dont le complémentaire est un ouvert.` },
  { id: 'ex-1.1.6', kind: 'exemple', number: '1.1.6', title: 'Exemples de fermés', body: r`1. Topologie grossière : les fermés sont $\emptyset$ et $E$.
2. Topologie discrète : toute partie est fermée (son complémentaire est une partie, donc un ouvert).
3. Sur $E=\{a,b\}$ : pour $\tau_1=\{\emptyset,\{a\},E\}$ les fermés sont $E,\{b\},\emptyset$ ; pour $\tau_2=\{\emptyset,\{b\},E\}$ ce sont $E,\{a\},\emptyset$.` },
  { id: 'rem-1.1.7', kind: 'remarque', number: '1.1.7', title: 'Stabilité des ouverts et des fermés', body: r`1. Les ouverts sont stables par réunion quelconque et par intersection finie.
2. Les fermés sont stables par intersection quelconque et par réunion finie (passage au complémentaire, lois de De Morgan).
3. « Non ouvert » ne veut pas dire « fermé ». Pour la topologie discrète, toute partie est à la fois ouverte et fermée. Dans $(\mathbb R,\tau_u)$ : $]a,b[$ est ouvert non fermé, $[a,b]$ est fermé non ouvert, $]a,b]$ n'est ni ouvert ni fermé.
4. $\emptyset$ et $E$ sont à la fois ouverts et fermés.
5. Une intersection infinie d'ouverts n'est pas toujours ouverte : dans $\mathbb R$, $\bigcap_{n\geq 1}\left]-\tfrac1n,\tfrac1n\right[=\{0\}$, qui est fermé et non ouvert.
6. Une réunion infinie de fermés n'est pas toujours fermée : $\bigcup_{n\geq 1}\left[\tfrac1n,1\right]=]0,1]$, qui n'est pas fermé.` },
  { id: 'def-1.1.8', kind: 'definition', number: '1.1.8', title: 'Voisinage', body: r`Soit $(E,\tau)$ un espace topologique et $x\in E$. Une partie $U$ de $E$ est un voisinage de $x$ s'il existe un ouvert $W$ tel que $x\in W\subset U$. On note $\mathcal V_x$ l'ensemble des voisinages de $x$.`,
    visual: { kind: 'lab', key: 'voisinage-eps', caption: 'Laboratoire : règle x et ε pour voir quand ]x−ε, x+ε[ reste dans l’ouvert ]0,3[.' } },
  { id: 'ex-boule3d', kind: 'exemple', number: 'illustration', title: 'Une boule ouverte dans l’espace', body: r`Dans $\mathbb R^3$, une boule ouverte est un ouvert. Autour d'un de ses points, un plus petit voisinage reste toujours à l'intérieur.`,
    visual: { kind: 'three', key: 'boule-3d', caption: 'Boule ouverte (translucide) et petit voisinage (halo vert) autour d’un point x. Fais glisser pour tourner.' } },
  { id: 'ex-1.1.9', kind: 'exemple', number: '1.1.9', title: 'Exemples de voisinages', body: r`1. Sur $E=\{a,b\}$ avec $\tau_1=\{\emptyset,\{a\},E\}$ : $\{a\}$ et $E$ sont des voisinages de $a$ ; $E$ est le seul voisinage de $b$ ; $\{b\}$ n'est pas un voisinage de $b$, car aucun ouvert contenant $b$ n'est contenu dans $\{b\}$.
2. Pour la topologie discrète, toute partie qui contient $x$ est un voisinage de $x$ (elle contient l'ouvert $\{x\}$).` },
  { id: 'prop-1.1.10', kind: 'proposition', number: '1.1.10', title: 'Propriétés des voisinages', body: r`Soit $x\in E$.
1. $E\in\mathcal V_x$ (car $E$ est un ouvert contenant $x$).
2. $\emptyset\notin\mathcal V_x$ (elle ne contient pas $x$).
3. Si $V\in\mathcal V_x$ et $V\subset W\subset E$, alors $W\in\mathcal V_x$ (l'ouvert $O$ avec $x\in O\subset V$ vérifie $x\in O\subset W$).
4. Si $V,W\in\mathcal V_x$, alors $V\cap W\in\mathcal V_x$ : avec $x\in O\subset V$ et $x\in O'\subset W$, l'ouvert $O\cap O'$ contient $x$ et est dans $V\cap W$. Par récurrence, toute intersection finie de voisinages de $x$ est un voisinage de $x$.
5. Toute réunion de voisinages de $x$ est un voisinage de $x$ (elle contient l'un d'eux).` },
  { id: 'thm-1.1.11', kind: 'theoreme', number: '1.1.11', title: 'Ouvert et voisinage', body: r`Soit $A\subset E$. Alors $A$ est ouvert si et seulement si $A$ est un voisinage de chacun de ses points.`,
    visual: { kind: 'svg', key: 'union-ouverts', caption: 'A est un voisinage de chacun de ses points : on prend un ouvert O_x ⊂ A autour de chaque x, et leur réunion redonne A.' },
    proof: { origin: 'cours', visualSteps: [0, 1, 2, 2, 3], steps: [
      r`($\Rightarrow$) Si $A$ est ouvert, alors pour tout $x\in A$ on a $x\in A\subset A$ avec $A$ ouvert : $A$ est un voisinage de $x$.`,
      r`($\Leftarrow$) Supposons $A$ voisinage de chacun de ses points et soit $x\in A$. Par définition d'un voisinage, il existe un ouvert $O_x$ tel que $x\in O_x\subset A$.`,
      r`Ceci vaut pour tout $x\in A$ : on obtient une famille d'ouverts $(O_x)_{x\in A}$, tous contenus dans $A$. Donc $\bigcup_{x\in A}O_x\subset A$.`,
      r`Réciproquement, chaque $x\in A$ appartient à $O_x$, donc à la réunion : $A\subset\bigcup_{x\in A}O_x$.`,
      r`D'où $A=\bigcup_{x\in A}O_x$. C'est une réunion d'ouverts, donc un ouvert (axiome iii). $\blacksquare$`] } },
  { id: 'def-1.1.12', kind: 'definition', number: '1.1.12', title: 'Base d\'ouverts, base de voisinages', body: r`Soit $(E,\tau)$ un espace topologique, $x\in E$.
1. Une famille $\mathcal B\subset\tau$ est une base d'ouverts si tout ouvert est réunion d'éléments de $\mathcal B$.
2. Une partie $\mathcal B_x\subset\mathcal V_x$ est une base de voisinages de $x$ (système fondamental) si pour tout $V\in\mathcal V_x$ il existe $b\in\mathcal B_x$ avec $x\in b\subset V$.` },
  { id: 'ex-1.1.13', kind: 'exemple', number: '1.1.13', title: 'Exemples de bases', body: r`1. La topologie discrète a pour base d'ouverts les singletons $\{x\}$.
2. Les intervalles ouverts $]a,b[$ forment une base de la topologie usuelle de $\mathbb R$.
3. Les intervalles $]-\infty,a[$ et $]a,+\infty[$ ne forment pas une base d'ouverts de $\tau_u$ : l'ouvert $]a,b[$ ne contient aucune demi-droite, il ne peut donc pas être une réunion de telles parties.
4. Pour $x\in\mathbb R$, la suite $\left(\left]x-\tfrac1n,x+\tfrac1n\right[\right)_{n\geq 1}$ est une base de voisinages de $x$ : si $V\in\mathcal V_x$, il existe $\varepsilon>0$ avec $]x-\varepsilon,x+\varepsilon[\subset V$, puis $n$ avec $\tfrac1n<\varepsilon$.` },
  { id: 'prop-1.1.14', kind: 'proposition', number: '1.1.14', title: 'Caractérisation d\'une base d\'ouverts', body: r`Soit $\mathcal B\subset\tau$. Alors $\mathcal B$ est une base d'ouverts si et seulement si, pour tout $x\in E$, la famille $\mathcal B_x=\{b\in\mathcal B : x\in b\}$ est une base de voisinages de $x$.`,
    proof: { origin: 'cours', steps: [
      r`($\Rightarrow$) Supposons $\mathcal B$ base d'ouverts. Soit $x\in E$ et $V\in\mathcal V_x$ : il existe un ouvert $W$ avec $x\in W\subset V$.`,
      r`Comme $\mathcal B$ est une base, $W=\bigcup_{i\in I}b_i$ avec $b_i\in\mathcal B$. Puisque $x\in W$, il existe $i_0$ tel que $x\in b_{i_0}$.`,
      r`Ainsi $b_{i_0}\in\mathcal B_x$ et $x\in b_{i_0}\subset W\subset V$ : $\mathcal B_x$ est une base de voisinages de $x$.`,
      r`($\Leftarrow$) Supposons que chaque $\mathcal B_x$ soit une base de voisinages de $x$. Soit $O$ un ouvert et $x\in O$. Alors $O\in\mathcal V_x$, donc il existe $b_x\in\mathcal B_x$ avec $x\in b_x\subset O$.`,
      r`On en déduit $\bigcup_{x\in O}b_x\subset O$, et $O\subset\bigcup_{x\in O}b_x$ car $x\in b_x$. Donc $O=\bigcup_{x\in O}b_x$ est réunion d'éléments de $\mathcal B$ : $\mathcal B$ est une base d'ouverts. $\blacksquare$`] } },
  { id: 'def-1.1.15', kind: 'definition', number: '1.1.15', title: 'Espace séparé (de Hausdorff)', body: r`$(E,\tau)$ est séparé si pour tous $x\neq x'$ dans $E$ il existe $W\in\mathcal V_x$ et $W'\in\mathcal V_{x'}$ tels que $W\cap W'=\emptyset$.` },
  { id: 'ex-1.1.16', kind: 'exemple', number: '1.1.16', title: 'Exemples d\'espaces séparés', body: r`1. L'espace grossier (avec au moins deux points) n'est pas séparé : le seul voisinage d'un point est $E$, et $E\cap E\neq\emptyset$.
2. L'espace discret est séparé : $\{x\}$ et $\{x'\}$ sont des voisinages disjoints.
3. $(\mathbb R,\tau_u)$ est séparé : pour $x\neq x'$, avec $\varepsilon=\tfrac{|x-x'|}{2}$, les intervalles $]x-\varepsilon,x+\varepsilon[$ et $]x'-\varepsilon,x'+\varepsilon[$ sont disjoints.` },
  { id: 'rem-1.1.17', kind: 'remarque', number: '1.1.17', title: 'Séparation par des ouverts', body: r`$(E,\tau)$ est séparé si et seulement si pour tous $x\neq x'$ il existe des ouverts $O,O'$ avec $x\in O$, $x'\in O'$ et $O\cap O'=\emptyset$. (Un ouvert est un voisinage ; et si $W\supset O\ni x$, $W'\supset O'\ni x'$ sont disjoints, alors $O\cap O'\subset W\cap W'=\emptyset$.) Le PDF écrit $W\cap W'$ à cet endroit : c'est une coquille pour $O\cap O'$.` },
  { id: 'prop-1.1.18', kind: 'proposition', number: '1.1.18', title: 'Les singletons sont fermés', body: r`Dans un espace topologique séparé, tout singleton est fermé.`,
    proof: { origin: 'cours', steps: [
      r`Soit $x\in E$. Pour montrer que $\{x\}$ est fermé, il suffit de montrer que son complémentaire $\{x\}^c$ est ouvert.`,
      r`D'après le théorème 1.1.11, il suffit de montrer que $\{x\}^c$ est un voisinage de chacun de ses points. Soit donc $x'\in\{x\}^c$, c'est-à-dire $x'\neq x$.`,
      r`Comme $E$ est séparé, il existe des ouverts disjoints $W\ni x$ et $W'\ni x'$.`,
      r`Comme $W\cap W'=\emptyset$ et $x\in W$, on a $x\notin W'$.`,
      r`Donc $W'\subset\{x\}^c$, avec $W'$ ouvert contenant $x'$ : $\{x\}^c$ est un voisinage de $x'$.`,
      r`Ceci vaut pour tout $x'\neq x$ : $\{x\}^c$ est voisinage de tous ses points, donc ouvert (théorème 1.1.11).`,
      r`Donc $\{x\}$ est fermé. $\blacksquare$`] } },
];
