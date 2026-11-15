import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
export type Shape = 'torus' | 'stairs' | 'crystal';
/** Forme 3D de l'accueil : tore (Topologie), escalier de colonnes (Mesure), cristal (Algèbre). Glisser pour tourner. */
export default function HeroScene({ shape, line, fill }: { shape: Shape; line: number; fill: number }) {
  const host = useRef<HTMLDivElement>(null); const st = useRef({ paused: false, zoom: 0, reset: 0 }); const [paused, setPaused] = useState(false);
  useEffect(() => {
    const el = host.current!; let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(40, 1, 0.1, 50); cam.position.set(0, 0, 6.2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7)); const d = new THREE.DirectionalLight(0xffffff, 1.1); d.position.set(3, 4, 5); scene.add(d);
    const g = new THREE.Group(); scene.add(g);
    const fillMat = new THREE.MeshPhysicalMaterial({ color: fill, roughness: 0.3, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    const lineMat = new THREE.LineBasicMaterial({ color: line, transparent: true, opacity: 0.85 });
    const geos: THREE.BufferGeometry[] = [];
    const add = (geo: THREE.BufferGeometry, wire: boolean, x = 0, y = 0) => { geos.push(geo);
      const m = new THREE.Mesh(geo, fillMat); const l = new THREE.LineSegments(wire ? new THREE.WireframeGeometry(geo) : new THREE.EdgesGeometry(geo), lineMat); m.position.set(x, y, 0); l.position.copy(m.position); g.add(m, l); };
    if (shape === 'torus') add(new THREE.TorusGeometry(1.55, 0.6, 24, 56), true);
    else if (shape === 'crystal') add(new THREE.IcosahedronGeometry(1.9, 1), false);
    else for (let i = 0; i < 7; i++) { const hgt = 0.5 + i * 0.45; add(new THREE.BoxGeometry(0.55, hgt, 0.55), false, -1.9 + i * 0.63, -1.6 + hgt / 2); }
    g.rotation.set(shape === 'torus' ? 1.0 : 0.35, 0.4, 0);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize = () => { const w = el.clientWidth || 400, h = el.clientHeight || 400; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    let vis = true, drag = false, lx = 0, ly = 0, raf = 0, z = 6.2;
    const io = new IntersectionObserver(([e]) => { vis = !!e?.isIntersecting; }); io.observe(el);
    const c = renderer.domElement; const dn = (e: PointerEvent) => { drag = true; lx = e.clientX; ly = e.clientY; c.setPointerCapture(e.pointerId); }; const up = () => { drag = false; };
    const mv = (e: PointerEvent) => { if (!drag) return; g.rotation.y += (e.clientX - lx) * 0.01; g.rotation.x += (e.clientY - ly) * 0.01; lx = e.clientX; ly = e.clientY; };
    c.addEventListener('pointerdown', dn); c.addEventListener('pointerup', up); c.addEventListener('pointermove', mv);
    const loop = () => { raf = requestAnimationFrame(loop); if (!vis) return; const s = st.current;
      if (s.reset) { s.reset = 0; g.rotation.set(shape === 'torus' ? 1.0 : 0.35, 0.4, 0); z = 6.2; }
      if (s.zoom) { z = Math.max(3.2, Math.min(10, z - s.zoom * 0.8)); s.zoom = 0; }
      cam.position.z += (z - cam.position.z) * 0.12;
      if (!s.paused && !drag && !reduced) { g.rotation.y += 0.004; g.rotation.z += 0.0012; }
      renderer.render(scene, cam); };
    loop();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); geos.forEach((x) => x.dispose()); fillMat.dispose(); lineMat.dispose(); renderer.dispose(); c.remove(); };
  }, [shape, line, fill]);
  const b = (label: string, aria: string, f: () => void) => <button type="button" aria-label={aria} title={aria} onClick={f}>{label}</button>;
  return (<div className="scene" role="img" aria-label={shape === 'torus' ? 'Tore 3D à faire tourner à la souris' : shape === 'stairs' ? 'Colonnes en escalier en 3D' : 'Cristal 3D'}>
    <div className="gl" ref={host} />
    <div className="ctl">{b(paused ? '▶' : '❚❚', paused ? 'Lecture' : 'Pause', () => { st.current.paused = !st.current.paused; setPaused(st.current.paused); })}
      {b('+', 'Zoom avant', () => { st.current.zoom = 1; })}{b('−', 'Zoom arrière', () => { st.current.zoom = -1; })}
      {b('↺', 'Réinitialiser la vue', () => { st.current.reset = 1; })}{b('⤢', 'Plein écran', () => { void host.current?.parentElement?.requestFullscreen?.(); })}</div></div>);
}
