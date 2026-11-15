// @ts-nocheck — code repris de Jabr ; à typer strictement plus tard
import * as THREE from "three";

export const PALETTE = {
  bg: 0x0a0f1e,
  ink: 0x111a33,
  lapis: 0x4f7cff,
  gold: 0xffb547,
  emerald: 0x3ddc97,
  magenta: 0xff5fa2,
  red: 0xff5c5c,
  turquoise: 0x39d0d8,
  warm: 0xf3ead8,
  cool: 0x9aa7c7,
};

export function makeRenderer(container: HTMLElement, alpha = true): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha, powerPreference: "high-performance", preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(PALETTE.bg, alpha ? 0 : 1);
  container.appendChild(renderer.domElement);
  return renderer;
}

export function makeLabel(text: string, color = "#f3ead8", scale = 1): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "600 60px 'JetBrains Mono', monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.shadowColor = color; ctx.shadowBlur = 12;
    ctx.fillStyle = color;
    ctx.fillText(text, 256, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(1.6 * scale, 0.4 * scale, 1);
  return sprite;
}

export function makeParticles(count = 220, spread = 9): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = Math.random() * spread * 0.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: PALETTE.lapis, size: 0.025, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending });
  return new THREE.Points(geo, mat);
}

export function disposeObject(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (mat) {
      const list = Array.isArray(mat) ? mat : [mat];
      list.forEach((m) => {
        const anyM = m as unknown as Record<string, unknown>;
        for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap"]) {
          const tex = anyM[key];
          if (tex instanceof THREE.Texture) tex.dispose();
        }
        m.dispose();
      });
    }
  });
}

export function line(points: THREE.Vector3[], color: number, opacity = 0.8, dashed = false): THREE.Line {
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = dashed
    ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.08, gapSize: 0.06, depthWrite: false })
    : new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  const l = new THREE.Line(geo, mat);
  if (dashed) l.computeLineDistances();
  return l;
}

export function circle(radius: number, color: number, opacity = 0.8, segments = 80): THREE.LineLoop {
  const pts = Array.from({ length: segments }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
}

export function glowSphere(radius: number, color: number, opacity = 0.12): THREE.Group {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.3, transparent: true, opacity: 0.9 }));
  const halo = new THREE.Mesh(new THREE.SphereGeometry(radius * 2.2, 20, 14), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  g.add(core, halo);
  return g;
}

export function setupLights(scene: THREE.Scene, intensity = 1) {
  const ambient = new THREE.AmbientLight(0x9aa7c7, 0.5 * intensity);
  const key = new THREE.DirectionalLight(PALETTE.lapis, 1.6 * intensity);
  key.position.set(4, 6, 3);
  const rim = new THREE.PointLight(PALETTE.magenta, 18 * intensity, 20);
  rim.position.set(-4, 3, -3);
  const fill = new THREE.PointLight(PALETTE.gold, 10 * intensity, 18);
  fill.position.set(2, 1, -4);
  scene.add(ambient, key, rim, fill);
  return { ambient, key, rim, fill, setIntensity(v: number) { ambient.intensity = 0.5 * v; key.intensity = 1.6 * v; rim.intensity = 18 * v; fill.intensity = 10 * v; } };
}

export function box(w: number, h: number, d: number, color: number, opacity = 0.5, wire = false) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.18, transparent: true, opacity, wireframe: wire, roughness: 0.4, metalness: 0.2, depthWrite: opacity > 0.6 }));
}
export function sphere(r: number, color: number, opacity = 0.3, wire = false) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.2, transparent: true, opacity, wireframe: wire, roughness: 0.35, metalness: 0.2, depthWrite: false }));
}
