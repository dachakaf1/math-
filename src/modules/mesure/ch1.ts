import type { Chapter, Exercise } from '../../core/content';
const r = String.raw;
/** Chapitre 1 : tribus. Source : « Théorie générale de la mesure » (cours détaillé). */
export const CH1: Chapter = { id: '1', title: 'Espaces mesurables et tribus', summary: 'Pour mesurer, il faut d’abord décider quels ensembles on a le droit de mesurer : c’est le rôle des tribus.', sections: [
  { id: '1.1', title: 'Tribus', items: [
    { id: 'def-tribu', kind: 'definition', number: '1.1', title: 'Tribu (σ-algèbre)', body: r`Soit $X$ un ensemble. Une tribu sur $X$ est une famille $\mathcal T\subset\mathcal P(X)$ telle que :
i) $X\in\mathcal T$ ;
ii) si $A\in\mathcal T$, alors $A^c=X\setminus A\in\mathcal T$ (stabilité par complémentaire) ;
iii) si $A_n\in\mathcal T$ pour tout $n\geq 1$, alors $\bigcup_{n\geq 1}A_n\in\mathcal T$ (stabilité par réunion dénombrable).
Les éléments de $\mathcal T$ sont les parties mesurables de $X$, et $(X,\mathcal T)$ est un espace mesurable.
Idée : une tribu est une « boîte à outils » d'ensembles ; en faisant complémentaire et réunion dénombrable, on ne sort jamais de la boîte.` },
    { id: 'rem-anneau-booleen', kind: 'remarque', number: '1.1.1', title: 'Anneau booléen', body: r`Si on remplace iii) par la seule stabilité par réunion finie ($A,B\in\mathcal T\Rightarrow A\cup B\in\mathcal T$), on obtient un anneau booléen (ou algèbre de Boole). Une tribu est donc un anneau booléen qui supporte en plus les réunions dénombrables.` },
    { id: 'prop-consequences-tribu', kind: 'proposition', number: '1.2', title: 'Conséquences immédiates', body: r`Soit $\mathcal T$ une tribu sur $X$. Alors :
1) $\emptyset\in\mathcal T$ ;
2) si $A_n\in\mathcal T$ pour tout $n\geq 1$, alors $\bigcap_{n\geq 1}A_n\in\mathcal T$ ;
3) $\mathcal T$ est stable par réunion et intersection finies ;
4) si $A,B\in\mathcal T$, alors $A\setminus B\in\mathcal T$.`,
      proof: { origin: 'cours', steps: [
        r`1) $\emptyset=X^c$ et $X\in\mathcal T$ : par stabilité par complémentaire, $\emptyset\in\mathcal T$.`,
        r`2) Loi de De Morgan : $\bigcap_n A_n=\left(\bigcup_n A_n^c\right)^c$. Chaque $A_n^c$ est dans $\mathcal T$, donc la réunion aussi, donc son complémentaire.`,
        r`3) Réunion finie : on complète par des ensembles vides, $A_1\cup\dots\cup A_k=A_1\cup\dots\cup A_k\cup\emptyset\cup\emptyset\cup\cdots$, qui est une réunion dénombrable d'éléments de $\mathcal T$. Intersection finie : même idée en complétant par $X$.`,
        r`4) $A\setminus B=A\cap B^c$ : intersection de deux éléments de $\mathcal T$. $\blacksquare$`] } },
    { id: 'prop-caracterisation-tribu', kind: 'proposition', number: '1.3', title: 'Caractérisation d\'une tribu', body: r`Soit $\mathcal T\subset\mathcal P(X)$ non vide. Alors $\mathcal T$ est une tribu si et seulement si :
i) $A\in\mathcal T\Rightarrow A^c\in\mathcal T$ ;
ii) $A,B\in\mathcal T\Rightarrow A\cap B\in\mathcal T$ ;
iii) $\mathcal T$ est stable par réunion dénombrable disjointe.`,
      proof: { origin: 'cours', steps: [
        r`($\Rightarrow$) Une tribu vérifie i) par définition, ii) par la conséquence 3) de 1.2, et iii) car une réunion disjointe est un cas particulier de réunion.`,
        r`($\Leftarrow$) Supposons i), ii), iii). Comme $\mathcal T\neq\emptyset$, il existe $A\in\mathcal T$, donc $A^c\in\mathcal T$ par i).`,
        r`Or $X=A\cup A^c$ avec $A\cap A^c=\emptyset$ : c'est une réunion disjointe d'éléments de $\mathcal T$, donc $X\in\mathcal T$ par iii). La stabilité par complémentaire est i). Il reste la réunion dénombrable quelconque.`,
        r`Soit $(A_n)_{n\geq 1}\subset\mathcal T$. On pose $B_1=A_1$ et $B_n=A_n\setminus\bigcup_{p<n}A_p=A_n\cap A_1^c\cap\cdots\cap A_{n-1}^c$. Par i) et ii), $B_n\in\mathcal T$.`,
        r`Les $B_n$ sont deux à deux disjoints : si $m<n$, $B_m\subset A_m$ et $B_n\subset A_m^c$. De plus $\bigcup_n B_n=\bigcup_n A_n$ : si $x\in\bigcup A_n$, soit $n$ le plus petit indice avec $x\in A_n$ ; alors $x\in B_n$.`,
        r`Par iii), $\bigcup_n A_n=\bigcup_n B_n\in\mathcal T$. Donc $\mathcal T$ est une tribu. $\blacksquare$`] } },
    { id: 'rem-exemples-tribus', kind: 'exemple', number: '1.3.1', title: 'Exemples de tribus', body: r`1. $\{\emptyset,X\}$ est la plus petite tribu sur $X$ (tribu grossière), et $\mathcal P(X)$ la plus grande (tribu discrète).
2. Si $A\subset X$, alors $\mathcal T=\{\emptyset,A,A^c,X\}$ est une tribu : on coupe $X$ en deux blocs $A$ et $A^c$.` },
  ] },
  { id: '1.2', title: 'Tribu engendrée et tribu de Borel', items: [
    { id: 'prop-intersection-tribus', kind: 'proposition', number: '1.4', title: 'Intersection de tribus', body: r`Toute intersection (quelconque) de tribus sur $X$ est une tribu sur $X$.`,
      proof: { origin: 'ajoutee', steps: [
        r`Soit $(\mathcal T_i)_{i\in I}$ une famille de tribus et $\mathcal T=\bigcap_i\mathcal T_i$. Pour tout $i$, $X\in\mathcal T_i$, donc $X\in\mathcal T$.`,
        r`Si $A\in\mathcal T$, alors $A\in\mathcal T_i$ pour tout $i$, donc $A^c\in\mathcal T_i$ pour tout $i$ : $A^c\in\mathcal T$.`,
        r`Si $(A_n)\subset\mathcal T$, alors pour tout $i$, $(A_n)\subset\mathcal T_i$, donc $\bigcup_n A_n\in\mathcal T_i$. Ainsi $\bigcup_n A_n\in\mathcal T$. $\blacksquare$`] } },
    { id: 'def-tribu-engendree', kind: 'definition', number: '1.5', title: 'Tribu engendrée', body: r`Soit $\mathcal F\subset\mathcal P(X)$. On note $\sigma(\mathcal F)=\bigcap_{\mathcal F\subset\mathcal M}\mathcal M$, l'intersection de toutes les tribus $\mathcal M$ sur $X$ contenant $\mathcal F$. D'après 1.4, c'est une tribu : c'est la plus petite tribu contenant $\mathcal F$, appelée tribu engendrée par $\mathcal F$.
Exemple : pour $A\subset X$, $\sigma(\{A\})=\{\emptyset,A,A^c,X\}$.` },
    { id: 'def-borel', kind: 'definition', number: '1.6', title: 'Topologie et tribu de Borel', body: r`Une topologie sur $\Omega$ est une famille $\mathcal M\subset\mathcal P(\Omega)$ contenant $\emptyset$ et $\Omega$, stable par intersection finie et par réunion quelconque ; ses éléments sont les ouverts.
La tribu de Borel d'un espace topologique $(\Omega,\mathcal M)$ est la tribu engendrée par les ouverts : $\mathcal B(\Omega)=\sigma(\mathcal M)$. Elle contient les ouverts, les fermés, les réunions dénombrables de fermés et les intersections dénombrables d'ouverts.` },
    { id: 'prop-generateurs-borel', kind: 'proposition', number: '1.7', title: 'Générateurs de la tribu de Borel de ℝ', body: r`La tribu $\mathcal B(\mathbb R)$ est engendrée par les intervalles $]a,+\infty[$, $a\in\mathbb R$.`,
      proof: { origin: 'cours', steps: [
        r`Notons $\mathcal I=\{]a,+\infty[\ :\ a\in\mathbb R\}$. Comme ce sont des ouverts, $\mathcal I\subset\mathcal B(\mathbb R)$, donc $\sigma(\mathcal I)\subset\mathcal B(\mathbb R)$ (plus petite tribu contenant $\mathcal I$).`,
        r`Réciproquement, tout ouvert de $\mathbb R$ est réunion finie ou dénombrable d'intervalles ouverts. Il suffit donc de montrer que $\sigma(\mathcal I)$ contient $]a,+\infty[$, $]-\infty,a[$ et $]a,b[$.`,
        r`$]a,+\infty[\in\sigma(\mathcal I)$ par définition.`,
        r`$]-\infty,a[=[a,+\infty[^c$ et $[a,+\infty[=\bigcap_{n\geq 1}\left]a-\tfrac1n,+\infty\right[$. Chaque $]a-\tfrac1n,+\infty[$ est dans $\sigma(\mathcal I)$, donc l'intersection dénombrable aussi, donc son complémentaire : $]-\infty,a[\in\sigma(\mathcal I)$.`,
        r`$]a,b[=]-\infty,b[\ \cap\ ]a,+\infty[\in\sigma(\mathcal I)$.`,
        r`Donc $\sigma(\mathcal I)$ contient tous les ouverts, d'où $\mathcal B(\mathbb R)\subset\sigma(\mathcal I)$. Conclusion : $\mathcal B(\mathbb R)=\sigma(\mathcal I)$. $\blacksquare$`] } },
  ] },
] };
export const EX1: Exercise[] = [
  { id: 'exo-mes-1-1', chapter: '1', level: 1, origin: 'cours', uses: ['def-tribu'], title: 'Image réciproque d\'une tribu', statement: r`Soit $(\Omega',\mathcal T')$ un espace mesurable et $f:\Omega\to\Omega'$ une application. Montrer que $\mathcal T=f^{-1}(\mathcal T')=\{f^{-1}(B):B\in\mathcal T'\}$ est une tribu sur $\Omega$.`, hint: r`Utilise $f^{-1}(B^c)=(f^{-1}(B))^c$ et $f^{-1}(\bigcup B_n)=\bigcup f^{-1}(B_n)$.`,
    solution: [r`i) $\Omega=f^{-1}(\Omega')$ et $\Omega'\in\mathcal T'$, donc $\Omega\in\mathcal T$.`, r`ii) Soit $A\in\mathcal T$, $A=f^{-1}(B)$ avec $B\in\mathcal T'$. Alors $A^c=(f^{-1}(B))^c=f^{-1}(B^c)$ et $B^c\in\mathcal T'$, donc $A^c\in\mathcal T$.`, r`iii) Soit $(A_n)\subset\mathcal T$, $A_n=f^{-1}(B_n)$ avec $B_n\in\mathcal T'$. Alors $\bigcup_n A_n=f^{-1}\left(\bigcup_n B_n\right)$ et $\bigcup_n B_n\in\mathcal T'$.`, r`Conclusion : $\mathcal T$ est une tribu sur $\Omega$.`] },
  { id: 'exo-mes-1-2', chapter: '1', level: 1, origin: 'cours', uses: ['def-tribu'], title: 'L\'image directe n\'est pas toujours une tribu', statement: r`Soit $(\Omega,\mathcal T)$ un espace mesurable et $f:\Omega\to\Omega'$. L'ensemble $f(\mathcal T)=\{f(A):A\in\mathcal T\}$ est-il une tribu sur $\Omega'$ ?`, hint: 'Cherche une application constante.',
    solution: [r`Non en général. Prenons $\Omega=\{1,2,3,4,5\}$, $A=\{1,2,3\}$, $\mathcal T=\{\emptyset,A,A^c,\Omega\}$, $\Omega'=\Omega$ et $f(x)=2$ pour tout $x$.`, r`Alors $f(\mathcal T)=\{f(\emptyset),f(A),f(A^c),f(\Omega)\}=\{\emptyset,\{2\}\}$.`, r`Ce n'est pas une tribu : $\Omega'\notin f(\mathcal T)$, et $\{2\}^c=\{1,3,4,5\}\notin f(\mathcal T)$.`] },
  { id: 'exo-mes-1-3', chapter: '1', level: 2, origin: 'ajoutee', uses: ['def-tribu', 'rem-exemples-tribus'], title: 'Réunion de deux tribus', statement: r`Montrer que la réunion de deux tribus n'est pas en général une tribu.`, hint: r`Prends $X=\{1,2,3\}$ et deux tribus engendrées par un singleton.`,
    solution: [r`Soit $X=\{1,2,3\}$, $\mathcal T_1=\sigma(\{\{1\}\})=\{\emptyset,\{1\},\{2,3\},X\}$ et $\mathcal T_2=\sigma(\{\{2\}\})=\{\emptyset,\{2\},\{1,3\},X\}$.`, r`$\{1\}$ et $\{2\}$ sont dans $\mathcal T_1\cup\mathcal T_2$.`, r`Mais $\{1\}\cup\{2\}=\{1,2\}$ n'est ni dans $\mathcal T_1$ ni dans $\mathcal T_2$ : la stabilité par réunion échoue.`] },
  { id: 'exo-mes-1-4', chapter: '1', level: 2, origin: 'ajoutee', uses: ['def-tribu'], title: 'Tribu trace', statement: r`Soit $\mathcal T$ une tribu sur $X$ et $A\subset X$. Montrer que $\mathcal T\cap A=\{B\cap A:B\in\mathcal T\}$ est une tribu sur $A$.`, hint: r`Le complémentaire se calcule dans $A$ : $A\setminus(B\cap A)=B^c\cap A$.`,
    solution: [r`$A=X\cap A$ avec $X\in\mathcal T$ : $A\in\mathcal T\cap A$.`, r`Soit $B\cap A$ avec $B\in\mathcal T$. Son complémentaire dans $A$ est $A\setminus(B\cap A)=B^c\cap A$, et $B^c\in\mathcal T$.`, r`Soit $(B_n\cap A)$ avec $B_n\in\mathcal T$. Alors $\bigcup_n(B_n\cap A)=\left(\bigcup_n B_n\right)\cap A$ avec $\bigcup_n B_n\in\mathcal T$. Donc c'est une tribu sur $A$.`] },
  { id: 'exo-mes-1-5', chapter: '1', level: 3, origin: 'ajoutee', uses: ['prop-generateurs-borel', 'def-borel'], title: 'Un autre générateur de B(ℝ)', statement: r`Montrer que $\mathcal B(\mathbb R)$ est engendrée par les intervalles $]a,b]$, $a<b$.`, hint: r`Écris $]a,b]$ comme intersection d'ouverts, et $]a,b[$ comme réunion d'intervalles $]a,b']$.`,
    solution: [r`Soit $\mathcal J=\{]a,b]:a<b\}$. On a $]a,b]=\bigcap_{n\geq 1}\left]a,b+\tfrac1n\right[$, intersection dénombrable d'ouverts, donc $]a,b]\in\mathcal B(\mathbb R)$ : $\sigma(\mathcal J)\subset\mathcal B(\mathbb R)$.`, r`Réciproquement, $]a,b[=\bigcup_{n\geq n_0}\left]a,b-\tfrac1n\right]$ (avec $n_0$ tel que $b-\tfrac1{n_0}>a$) est dans $\sigma(\mathcal J)$.`, r`Tout ouvert de $\mathbb R$ est réunion dénombrable d'intervalles ouverts, donc appartient à $\sigma(\mathcal J)$. D'où $\mathcal B(\mathbb R)\subset\sigma(\mathcal J)$, puis l'égalité.`] },
];
