/** Liste des schémas existants (utilisée aussi par la validation du contenu). steps = nombre d'états. */
export const VISUALS = {
  'union-ouverts': { kind: 'svg', steps: 4 },
  'voisinage-eps': { kind: 'lab', steps: 1 },
  'boule-3d': { kind: 'three', steps: 2 },
} as const;
export type VisualKey = keyof typeof VISUALS;
/** Métadonnées d'un schéma. Les scènes 3D du module Algèbre ont une clé « alg-<scène> » (un seul état : l'élément en avant suit l'étape de preuve). */
export const visualMeta = (key: string): { kind: string; steps: number } | undefined =>
  (VISUALS as Record<string, { kind: string; steps: number }>)[key] ?? (key.startsWith('alg-') ? { kind: 'three', steps: 1 } : undefined);
