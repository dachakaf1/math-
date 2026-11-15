import type { Item } from '../../core/content';
const r = String.raw;
/** Section 1.3 d'après le cours de Pr. I. Tahiri (numérotation officielle 1.3.1 à 1.3.9). */
export const S13: Item[] = [
  { id: 'prop-1.3.1', kind: 'proposition', number: '1.3.1', title: 'Topologie induite', body: r`Soient $(E,\tau)$ un espace topologique et $A$ une partie non vide de $E$. La famille $\tau_A=\{O\cap A : O\in\tau\}$ est une topologie sur $A$.`,
    proof: { origin: 'cours', steps: [
      r`$\emptyset=A\cap\emptyset$ avec $\emptyset\in\tau$, et $A=A\cap E$ avec $E\in\tau$ : donc $\emptyset\in\tau_A$ et $A\in\tau_A$.`,
      r`Soient $U,V\in\tau_A$ : $U=O_1\cap A$ et $V=O_2\cap A$ avec $O_1,O_2\in\tau$.`,
      r`$U\cap V=(O_1\cap O_2)\cap A$ et $O_1\cap O_2\in\tau$ : donc $U\cap V\in\tau_A$.`,
      r`Soit $(u_i)_{i\in I}$ une famille d'éléments de $\tau_A$ : $u_i=O_i\cap A$ avec $O_i\in\tau$.`,
      r`$\bigcup_{i\in I}u_i=\Big(\bigcup_{i\in I}O_i\Big)\cap A$ avec $\bigcup_{i\in I}O_i\in\tau$ : donc $\bigcup_{i\in I}u_i\in\tau_A$. $\blacksquare$`] } },
  { id: 'def-1.3.2', kind: 'definition', number: '1.3.2', title: 'Sous-espace topologique', body: r`La topologie $\tau_A$ de la proposition 1.3.1 est appelée la topologie induite sur $A$. Le couple $(A,\tau_A)$ est un sous-espace topologique de $(E,\tau)$.` },
  { id: 'rem-1.3.3', kind: 'remarque', number: '1.3.3', title: 'Ouverts relatifs', body: r`En général, les ouverts de $(A,\tau_A)$ ne sont pas des ouverts de $(E,\tau)$ : être ouvert dépend de l'espace dans lequel on se place.` },
  { id: 'ex-1.3.4', kind: 'exemple', number: '1.3.4', title: 'Un ouvert relatif qui n’est pas ouvert', body: r`Dans $(\mathbb R,\tau_u)$, soit $A=[-1,1]$ muni de la topologie induite. L'ensemble $w=]0,1]=A\cap]0,+\infty[$ est un ouvert de $(A,\tau_A)$.
En revanche $w$ n'est ni ouvert ni fermé dans $(\mathbb R,\tau_u)$ : aucun intervalle $]1-\varepsilon,1+\varepsilon[$ n'est contenu dans $w$, et $0$ est adhérent à $w$ sans lui appartenir.` },
  { id: 'prop-1.3.5', kind: 'proposition', number: '1.3.5', title: 'Voisinages dans un sous-espace', body: r`Soit $(A,\tau_A)$ un sous-espace topologique de $(E,\tau)$ et $a\in A$. Une partie $V$ de $A$ est un voisinage de $a$ dans $(A,\tau_A)$ si et seulement si $V=W\cap A$ avec $W$ un voisinage de $a$ dans $(E,\tau)$.`,
    proof: { origin: 'cours', steps: [
      r`($\Rightarrow$) Soit $V$ un voisinage de $a$ dans $A$ : il existe $U\in\tau_A$ tel que $a\in U\subset V$. Écrivons $U=W_0\cap A$ avec $W_0\in\tau$.`,
      r`Posons $W=W_0\cup V$. Comme $W_0$ est un ouvert de $E$ contenant $a$ et $W_0\subset W$, $W$ est un voisinage de $a$ dans $E$.`,
      r`$W\cap A=(W_0\cap A)\cup(V\cap A)=U\cup V=V$, car $U\subset V\subset A$. Donc $V=W\cap A$.`,
      r`($\Leftarrow$) Soit $W$ un voisinage de $a$ dans $E$ : il existe $O\in\tau$ tel que $a\in O\subset W$.`,
      r`Alors $a\in O\cap A\subset W\cap A$ et $O\cap A\in\tau_A$ : $W\cap A$ est un voisinage de $a$ dans $A$. $\blacksquare$`] } },
  { id: 'prop-1.3.6', kind: 'proposition', number: '1.3.6', title: 'Topologie quotient (existence)', body: r`Soit $\mathcal R$ une relation d'équivalence sur un espace topologique $(E,\tau)$. On note $[x]=\{x'\in E : x'\mathcal R x\}$ la classe de $x$, $\widehat E=E/\mathcal R$ l'ensemble des classes et $q:E\to\widehat E$, $x\mapsto[x]$ la surjection canonique. La famille $\widehat\tau=\{U\subset\widehat E : q^{-1}(U)\in\tau\}$ est une topologie sur $\widehat E$.`,
    proof: { origin: 'ajoutee', steps: [
      r`$q^{-1}(\emptyset)=\emptyset\in\tau$ et $q^{-1}(\widehat E)=E\in\tau$ : donc $\emptyset,\widehat E\in\widehat\tau$.`,
      r`Soient $U,V\in\widehat\tau$. Comme $q^{-1}(U\cap V)=q^{-1}(U)\cap q^{-1}(V)$ est une intersection de deux ouverts de $E$, $U\cap V\in\widehat\tau$.`,
      r`Soit $(U_i)_{i\in I}$ dans $\widehat\tau$. Comme $q^{-1}\big(\bigcup_i U_i\big)=\bigcup_i q^{-1}(U_i)$ est une réunion d'ouverts de $E$, $\bigcup_i U_i\in\widehat\tau$. $\blacksquare$`] } },
  { id: 'def-1.3.7', kind: 'definition', number: '1.3.7', title: 'Topologie quotient', body: r`La topologie $\widehat\tau$ de la proposition 1.3.6 est appelée la topologie quotient sur $\widehat E=E/\mathcal R$. Par définition, $U\subset\widehat E$ est ouvert si et seulement si $q^{-1}(U)$ est ouvert dans $E$ ; en particulier $q$ est continue.` },
  { id: 'prop-1.3.8', kind: 'proposition', number: '1.3.8', title: 'Topologie produit (existence)', body: r`Soit $(E_i,\tau_i)_{1\le i\le n}$ une famille de $n$ espaces topologiques et $E=E_1\times\cdots\times E_n$. Soit $\tau_\pi$ la famille des parties de $E$ qui sont réunions quelconques de pavés $u_1\times\cdots\times u_n$ avec $u_i\in\tau_i$. Alors $\tau_\pi$ est une topologie sur $E$.`,
    proof: { origin: 'ajoutee', steps: [
      r`$\emptyset=\emptyset\times\cdots\times\emptyset$ et $E=E_1\times\cdots\times E_n$ sont des pavés ouverts : ils sont dans $\tau_\pi$.`,
      r`L'intersection de deux pavés ouverts est un pavé ouvert : $(u_1\times\cdots\times u_n)\cap(v_1\times\cdots\times v_n)=(u_1\cap v_1)\times\cdots\times(u_n\cap v_n)$, avec $u_i\cap v_i\in\tau_i$.`,
      r`Si $A=\bigcup_i P_i$ et $B=\bigcup_j Q_j$ sont des réunions de pavés ouverts, alors $A\cap B=\bigcup_{i,j}(P_i\cap Q_j)$ est une réunion de pavés ouverts : $A\cap B\in\tau_\pi$.`,
      r`Une réunion quelconque d'éléments de $\tau_\pi$ est encore une réunion de pavés ouverts. $\blacksquare$`] } },
  { id: 'def-1.3.9', kind: 'definition', number: '1.3.9', title: 'Topologie produit', body: r`La topologie $\tau_\pi$ de la proposition 1.3.8 est appelée la topologie produit sur $E=E_1\times\cdots\times E_n$. Les pavés $u_1\times\cdots\times u_n$ ($u_i\in\tau_i$) en forment une base d'ouverts.` },
];
