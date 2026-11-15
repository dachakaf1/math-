import { useEffect, useRef } from 'react';
import * as THREE from 'three';
/** Boule ouverte translucide ; étape 1 : un petit voisinage (halo) autour de x, contenu dans la boule. Rotation à la souris. */
export default function Scene3D({ step, onFail }: { step: number; onFail: () => void }) {
  const host = useRef<HTMLDivElement>(null); const stepRef = useRef(step); stepRef.current = step;
  useEffect(() => {
    const el = host.current!; let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { onFail(); return; }
    const w = el.clientWidth || 400, h = 300;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.setSize(w, h); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(45, w / h, 0.1, 50); cam.position.set(0, 0, 5);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6)); const d = new THREE.DirectionalLight(0xffffff, 1.2); d.position.set(3, 4, 5); scene.add(d);
    const g = new THREE.Group(); scene.add(g);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 32), new THREE.MeshPhysicalMaterial({ color: 0x2dd4bf, roughness: 0.15, transparent: true, opacity: 0.45 }));
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.SphereGeometry(1.5, 16, 12)), new THREE.LineBasicMaterial({ color: 0x2dd4bf }));
    const pt = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); pt.position.set(0.6, 0.3, 0.5);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 16), new THREE.MeshBasicMaterial({ color: 0xb8f34a, transparent: true, opacity: 0.3 })); halo.position.copy(pt.position);
    g.add(ball, edges, pt, halo); g.rotation.set(0.3, 0.5, 0);
    let vis = true, drag = false, lx = 0, ly = 0, raf = 0, k = 0;
    const io = new IntersectionObserver(([e]) => { vis = !!e?.isIntersecting; }); io.observe(el);
    const c = renderer.domElement; c.style.touchAction = 'none'; c.style.cursor = 'grab';
    const dn = (e: PointerEvent) => { drag = true; lx = e.clientX; ly = e.clientY; }; const up = () => { drag = false; };
    const mv = (e: PointerEvent) => { if (!drag) return; g.rotation.y += (e.clientX - lx) * 0.01; g.rotation.x = Math.max(-1.2, Math.min(1.2, g.rotation.x + (e.clientY - ly) * 0.01)); lx = e.clientX; ly = e.clientY; };
    c.addEventListener('pointerdown', dn); window.addEventListener('pointerup', up); c.addEventListener('pointermove', mv);
    const loop = () => { raf = requestAnimationFrame(loop); if (!vis) return; k += (stepRef.current - k) * 0.12; halo.scale.setScalar(Math.max(0.001, k)); renderer.render(scene, cam); };
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('pointerup', up); renderer.dispose(); scene.traverse((o) => { if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) { o.geometry.dispose(); (o.material as THREE.Material).dispose(); } }); c.remove(); };
  }, [onFail]);
  return <div ref={host} style={{ width: '100%', height: 300 }} role="img" aria-label="Boule ouverte en 3D à faire tourner à la souris, avec un petit voisinage autour d’un point." />;
}
