import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import type { Shape } from './HeroScene';
const HeroScene = lazy(() => import('./HeroScene')); // Three.js n'est chargé que si la forme apparaît à l'écran
export default function Hero3D({ shape, line, fill }: { shape: Shape; line: string; fill: string }) {
  const box = useRef<HTMLDivElement>(null); const [seen, setSeen] = useState(false);
  useEffect(() => { const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setSeen(true); io.disconnect(); } }); if (box.current) io.observe(box.current); return () => io.disconnect(); }, []);
  return (<div ref={box} className="scene">{seen && <Suspense fallback={null}><HeroScene shape={shape} line={parseInt(line.slice(1), 16)} fill={parseInt(fill.slice(1), 16)} /></Suspense>}</div>);
}
