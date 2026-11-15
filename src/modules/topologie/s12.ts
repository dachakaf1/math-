import type { Item } from '../../core/content';
const r = String.raw;
/** Section 1.2 d'après le cours de Pr. I. Tahiri. Notation : \mathring{A} = intérieur, \overline{A} = adhérence. */
export const S12: Item[] = [
  { id: 'def-1.2.1', kind: 'definition', number: '1.2.1', title: 'Points et parties remarquables', body: r`Soient $(E,\tau)$ un espace topologique, $A$ une partie non vide de $E$ et $a\in E$.
1. $a$ est intérieur à $A$ si $A$ est un voisinage de $a$. L'ensemble de ces points est l'intérieur de $A$, noté $\mathring{A}$.
2. $a$ est adhérent à $A$ si tout voisinage de $a$ rencontre $A$ : $\forall V\in\mathcal V_a,\ V\cap A\neq\emptyset$. L'ensemble de ces points est l'adhérence (ou fermeture) de $A$, notée $\overline{A}$.
3. $a$ est un point d'accumulation de $A$ si $\forall V\in\mathcal V_a,\ V\cap(A\setminus\{a\})\neq\emptyset$.
4. $a$ est un point isolé de $A$ si $a\in A$ et il existe $V\in\mathcal V_a$ tel que $V\cap A=\{a\}$.
5. La frontière de $A$ est $\partial A=\overline{A}\setminus\mathring{A}$.` },
  { id: 'ex-1.2.2', kind: 'exemple', number: '1.2.2', title: 'Calculs d\'intérieur, d\'adhérence, de frontière', body: r`1. $E=\{a,b\}$, $\tau_1=\{\emptyset,\{a\},E\}$, $A=\{b\}$ : aucun ouvert non vide n'est contenu dans $\{b\}$, donc $\mathring{A}=\emptyset$. Le voisinage $\{a\}$ de $a$ ne rencontre pas $A$, donc $a\notin\overline{A}$ et $\overline{A}=\{b\}$. Le seul voisinage de $b$ est $E$ et $E\cap(A\setminus\{b\})=\emptyset$ : $A$ n'a aucun point d'accumulation. Enfin $\partial A=\{b\}$ et $b$ est un point isolé de $A$.
2. $(E,\tau_d)$ et $A\neq\emptyset$ : $\mathring{A}=A$, $\overline{A}=A$, $\partial A=\emptyset$, et tous les points de $A$ sont isolés.
3. $(\mathbb R,\tau_u)$ et $A=]a,b]$ avec $a<b$ : $\mathring{A}=]a,b[$, $\overline{A}=[a,b]$, $\partial A=\{a,b\}$. L'ensemble des points d'accumulation est $[a,b]$ et il n'y a aucun point isolé.` },
  { id: 'prop-1.2.3', kind: 'proposition', number: '1.2.3', title: 'Intérieur et adhérence', body: r`Soit $A$ une partie de $E$.
1. $\mathring{A}\subset A$.
2. $\mathring{A}$ est un ouvert.
3. $\mathring{A}$ est le plus grand ouvert contenu dans $A$ : $\mathring{A}=\bigcup_{O\subset A,\ O\text{ ouvert}}O$.
4. $A\subset\overline{A}$.
5. $(\overline{A})^c$ est l'intérieur de $A^c$ et $\overline{A}$ est un fermé.
6. $\overline{A}$ est le plus petit fermé contenant $A$ : $\overline{A}=\bigcap_{A\subset F,\ F\text{ fermé}}F$.`,
    proof: { origin: 'cours', steps: [
      r`1. Si $a\in\mathring{A}$, alors $A$ est un voisinage de $a$ : il existe un ouvert $O$ avec $a\in O\subset A$. En particulier $a\in A$.`,
      r`2. Soit $a\in\mathring{A}$ et $W$ un ouvert tel que $a\in W\subset A$. Pour tout $x\in W$, $A$ contient l'ouvert $W$ qui contient $x$ : $A$ est un voisinage de $x$, donc $x\in\mathring{A}$. Ainsi $W\subset\mathring{A}$ et $\mathring{A}$ est un voisinage de $a$.`,
      r`Comme $\mathring{A}$ est voisinage de chacun de ses points, c'est un ouvert (théorème 1.1.11).`,
      r`3. Soit $U$ un ouvert contenu dans $A$ et $x\in U$. Alors $x\in U\subset A$, donc $A$ est un voisinage de $x$ et $x\in\mathring{A}$ : $U\subset\mathring{A}$. Avec 1. et 2., $\mathring{A}$ est le plus grand ouvert inclus dans $A$.`,
      r`4. Si $a\in A$, tout voisinage $V$ de $a$ contient $a$, donc $V\cap A\ni a$ n'est pas vide : $a\in\overline{A}$.`,
      r`5. $x\notin\overline{A}\iff\exists V\in\mathcal V_x,\ V\cap A=\emptyset\iff\exists V\in\mathcal V_x,\ V\subset A^c\iff x$ est intérieur à $A^c$. Donc $(\overline{A})^c$ est l'intérieur de $A^c$, qui est un ouvert d'après 2. : $\overline{A}$ est fermé.`,
      r`6. Soit $F$ un fermé contenant $A$. Alors $F^c$ est un ouvert contenu dans $A^c$, donc (par 3.) $F^c\subset$ intérieur de $A^c$ $=(\overline{A})^c$, d'où $\overline{A}\subset F$. Avec 4. et 5., $\overline{A}$ est le plus petit fermé contenant $A$. $\blacksquare$`] } },
  { id: 'prop-1.2.4', kind: 'proposition', number: '1.2.4', title: 'Frontière, monotonie, dualité', body: r`Soient $A,B$ deux parties de $E$.
1. $\partial A=\overline{A}\cap\overline{A^c}$.
2. Si $A\subset B$, alors $\mathring{A}\subset\mathring{B}$ et $\overline{A}\subset\overline{B}$.
3. $\mathring{A}=E\setminus\overline{A^c}$ et $\overline{A}=E\setminus\mathring{(A^c)}$.`,
    proof: { origin: 'cours', steps: [
      r`3. D'après la proposition 1.2.3 (5) appliquée à $A^c$ : $(\overline{A^c})^c=$ intérieur de $(A^c)^c=\mathring{A}$, donc $\mathring{A}=E\setminus\overline{A^c}$. Appliquée à $A$ : $(\overline{A})^c=$ intérieur de $A^c$, donc $\overline{A}=E\setminus\mathring{(A^c)}$.`,
      r`2. Si $A\subset B$ : $\mathring{A}$ est un ouvert contenu dans $A\subset B$, donc contenu dans $\mathring{B}$ (plus grand ouvert inclus dans $B$).`,
      r`De même, $\overline{B}$ est un fermé qui contient $B\supset A$, donc il contient $\overline{A}$ (plus petit fermé contenant $A$).`,
      r`1. Par définition, $\partial A=\overline{A}\setminus\mathring{A}=\overline{A}\cap(\mathring{A})^c$. D'après 3., $(\mathring{A})^c=\overline{A^c}$. Donc $\partial A=\overline{A}\cap\overline{A^c}$. $\blacksquare$`] } },
  { id: 'prop-1.2.5', kind: 'proposition', number: '1.2.5', title: 'Caractérisation des ouverts et des fermés', body: r`Soient $U,F$ deux parties de $E$.
1. $U$ est ouvert si et seulement si $\mathring{U}=U$.
2. $F$ est fermé si et seulement si $\overline{F}=F$.`,
    proof: { origin: 'ajoutee', steps: [
      r`1. ($\Rightarrow$) Si $U$ est ouvert, c'est un ouvert contenu dans $U$, donc $U\subset\mathring{U}$ (plus grand ouvert inclus dans $U$). Comme $\mathring{U}\subset U$, on obtient $\mathring{U}=U$.`,
      r`1. ($\Leftarrow$) Si $\mathring{U}=U$, alors $U$ est égal à un ouvert (proposition 1.2.3, 2.), donc $U$ est ouvert.`,
      r`2. ($\Rightarrow$) Si $F$ est fermé, c'est un fermé contenant $F$, donc $\overline{F}\subset F$ (plus petit fermé contenant $F$). Avec $F\subset\overline{F}$, on a $\overline{F}=F$.`,
      r`2. ($\Leftarrow$) Si $\overline{F}=F$, alors $F$ est un fermé car $\overline{F}$ l'est (proposition 1.2.3, 5.). $\blacksquare$`] } },
  { id: 'prop-1.2.6', kind: 'proposition', number: '1.2.6', title: 'Adhérence et intérieur : réunion, intersection', body: r`Soient $A,B$ deux parties de $E$.
1. $\overline{A\cup B}=\overline{A}\cup\overline{B}$.
2. $\mathring{(A\cap B)}=\mathring{A}\cap\mathring{B}$.
3. $\overline{A\cap B}\subset\overline{A}\cap\overline{B}$.
4. $\mathring{A}\cup\mathring{B}\subset\mathring{(A\cup B)}$.
Les inclusions 3. et 4. peuvent être strictes : avec $A=]0,1[$, $B=]1,2[$ dans $\mathbb R$, $\overline{A\cap B}=\emptyset$ alors que $\overline{A}\cap\overline{B}=\{1\}$ ; avec $A=[0,1]$, $B=[1,2]$, $\mathring{A}\cup\mathring{B}=]0,1[\cup]1,2[$ alors que l'intérieur de $A\cup B=[0,2]$ est $]0,2[$.`,
    proof: { origin: 'ajoutee', steps: [
      r`1. Comme $A\subset A\cup B$, on a $\overline{A}\subset\overline{A\cup B}$ ; de même $\overline{B}\subset\overline{A\cup B}$. Donc $\overline{A}\cup\overline{B}\subset\overline{A\cup B}$.`,
      r`Réciproquement, $\overline{A}\cup\overline{B}$ est un fermé (réunion finie de fermés) qui contient $A\cup B$ : il contient le plus petit fermé $\overline{A\cup B}$. D'où l'égalité.`,
      r`2. Par monotonie (1.2.4, 2.), l'intérieur de $A\cap B$ est contenu dans $\mathring{A}$ et dans $\mathring{B}$, donc dans $\mathring{A}\cap\mathring{B}$. Réciproquement $\mathring{A}\cap\mathring{B}$ est un ouvert (intersection finie) contenu dans $A\cap B$, donc dans l'intérieur de $A\cap B$.`,
      r`3. et 4. Ce sont des conséquences de la monotonie : $A\cap B\subset A$ donne $\overline{A\cap B}\subset\overline{A}$ (idem pour $B$), et $\mathring{A}\subset\mathring{(A\cup B)}$ (idem pour $B$). $\blacksquare$`] } },
];
