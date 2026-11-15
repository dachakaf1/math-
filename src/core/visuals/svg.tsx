import type { ReactNode } from 'react';
/** Primitives SVG : chaque schéma porte un aria-label ; aucune information par la couleur seule (trait plein/pointillé + étiquette). */
export const Frame = ({ label, w = 320, h = 200, children }: { label: string; w?: number; h?: number; children: ReactNode }) =>
  <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} style={{ width: '100%', maxHeight: 320 }}>{children}</svg>;
export const Dot = ({ x, y, name }: { x: number; y: number; name?: string }) =>
  <g><circle cx={x} cy={y} r="3.5" fill="#fff" />{name && <text x={x + 6} y={y - 6} fill="var(--text)" fontSize="12">{name}</text>}</g>;
export const Txt = ({ x, y, children, c = 'var(--muted)' }: { x: number; y: number; children: ReactNode; c?: string }) =>
  <text x={x} y={y} fill={c} fontSize="12">{children}</text>;
export const T = 'opacity 600ms var(--ease), stroke 600ms var(--ease)';
