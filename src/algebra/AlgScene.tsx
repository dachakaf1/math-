import './jabr.css';
import MiniScene from './three/MiniScene';
import type { SceneKind } from '../modules/algebre/source/course';
/** Scène 3D d'une notion d'Algèbre ; `focus` vient de l'étape de preuve courante. */
export default function AlgScene({ scene, focus, title }: { scene: string; focus?: string; title: string }) {
  return <div className="jabr"><MiniScene kind={scene as SceneKind} focus={focus} title={title} height={290} /></div>;
}
