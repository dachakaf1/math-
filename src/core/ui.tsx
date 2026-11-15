import { useEffect, useReducer, useRef, type ReactNode } from 'react';
import { levelOf } from './store';

const floor = (n: number) => (50 * n * (n - 1)) / 2; // XP minimal du niveau n
/** Rafraîchit le composant quand la progression change (événement émis par useProgress). */
export function useProgressTick() {
  const [, tick] = useReducer((x: number) => x + 1, 0);
  useEffect(() => { window.addEventListener('mathl3:progress', tick); return () => window.removeEventListener('mathl3:progress', tick); }, []);
}
export const Logo = () => <span className="logo" aria-hidden="true">IE</span>;
export function LevelRing({ xp }: { xp: number }) {
  const L = levelOf(xp); const frac = Math.min(1, (xp - floor(L)) / (floor(L + 1) - floor(L))); const C = 2 * Math.PI * 24;
  return (<div className="lv" aria-label={`Niveau ${L}, ${xp} XP`}><div className="t"><small>Niveau {L}</small><b>{xp} XP</b></div>
    <svg className="ring" viewBox="0 0 56 56" aria-hidden="true"><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#A78BFA" /><stop offset="1" stopColor="#E879F9" /></linearGradient></defs>
      <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="3" />
      <circle cx="28" cy="28" r="24" fill="none" stroke="url(#rg)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${C * frac} ${C}`} transform="rotate(-90 28 28)" />
      <text x="28" y="35" textAnchor="middle">{L}</text></svg></div>);
}
export function Topbar({ title, nav, xp, onSearch }: { title: string; nav?: ReactNode; xp: number; onSearch?: () => void }) {
  return (<header className="top"><div className="in">
    <a className="brand" href="#/" aria-label="Accueil des modules"><Logo /><span className="n">{title}</span></a>
    {nav}
    <div className="tools">{onSearch && <button className="search" onClick={onSearch}>⌕ <span>Rechercher</span> <kbd>Ctrl K</kbd></button>}<LevelRing xp={xp} /></div></div></header>);
}
/** Fond de particules reliées (30 images/s max, en pause si l'onglet est caché, fixe si animations réduites). */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!; const ctx = cv.getContext('2d'); if (!ctx) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches; let w = 0, h = 0, raf = 0, last = 0;
    const N = innerWidth < 700 ? 28 : 60; const P = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - .5) * 2e-4, vy: (Math.random() - .5) * 2e-4 }));
    const size = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; }; size(); addEventListener('resize', size);
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw); if (document.hidden || t - last < 33) return; last = t; ctx.clearRect(0, 0, w, h);
      for (const p of P) { if (!still) { p.x = (p.x + p.vx * 33 + 1) % 1; p.y = (p.y + p.vy * 33 + 1) % 1; } }
      for (let i = 0; i < N; i++) { const a = P[i]!; ctx.fillStyle = 'rgba(196,181,253,.55)'; ctx.beginPath(); ctx.arc(a.x * w, a.y * h, 1.6, 0, 6.3); ctx.fill();
        for (let j = i + 1; j < N; j++) { const b = P[j]!; const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h); if (d < 130) { ctx.strokeStyle = `rgba(167,139,250,${0.22 * (1 - d / 130)})`; ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h); ctx.stroke(); } } }
    };
    raf = requestAnimationFrame(draw); return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} className="bgfx" aria-hidden="true" />;
}
