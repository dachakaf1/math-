import type { ModuleId, ModuleManifest } from './types';
import type { ModuleContent } from './content';

import { topologie } from '../modules/topologie';
import { algebre } from '../modules/algebre';
import { mesure } from '../modules/mesure';
export const CONTENT: Record<string, ModuleContent> = { topologie, mesure, algebre };
export const MODULES: ModuleManifest[] = [
  { id: 'topologie', title: 'Topologie', tagline: 'Ouverts, voisinages, compacts : voir l’espace se déformer.', status: 'actif', chapters: topologie.chapters },
  { id: 'mesure', title: 'Mesure et intégration', tagline: 'Tribus, mesures, escaliers qui montent vers f.', status: 'actif', chapters: mesure.chapters },
  { id: 'algebre', title: 'Structures algébriques', tagline: 'Groupes, quotients, anneaux : la symétrie en clair.', status: 'actif', chapters: algebre.chapters },
];
export const getModule = (id: string): ModuleManifest | undefined => MODULES.find((m) => m.id === id);
/** Textes d'accueil et idées clés de chaque module (formules en LaTeX). */
export type Hero = { name: string; sub: string; it: string; sym: string; shape: 'torus' | 'stairs' | 'crystal'; line: string; fill: string; keys: { tag: string; tex: string; text: string }[] };
export const HERO: Record<ModuleId, Hero> = {
  topologie: { name: 'Topologie', sub: 'La topologie', it: 'prend forme.', sym: 'τ', shape: 'torus', line: '#E8C382', fill: '#6D4BD8', keys: [
    { tag: 'Axiome I', tex: '$\\emptyset\\in\\tau$ et $E\\in\\tau$', text: 'Le vide et l’espace entier sont ouverts.' },
    { tag: 'Axiome II', tex: '$U,V\\in\\tau\\Rightarrow U\\cap V\\in\\tau$', text: 'Stabilité par intersection finie.' },
    { tag: 'Axiome III', tex: '$(U_i)\\subset\\tau\\Rightarrow\\bigcup U_i\\in\\tau$', text: 'Stabilité par réunion quelconque.' }] },
  mesure: { name: 'Mesure', sub: 'Les escaliers', it: 'montent vers f.', sym: 'σ', shape: 'stairs', line: '#F5B544', fill: '#B45309', keys: [
    { tag: 'Tribu I', tex: '$X\\in\\mathcal A$', text: 'L’ensemble entier est mesurable.' },
    { tag: 'Tribu II', tex: '$A\\in\\mathcal A\\Rightarrow A^c\\in\\mathcal A$', text: 'Stabilité par complémentaire.' },
    { tag: 'Tribu III', tex: '$A_n\\in\\mathcal A\\Rightarrow\\bigcup_n A_n\\in\\mathcal A$', text: 'Stabilité par réunion dénombrable.' }] },
  algebre: { name: 'Algèbre', sub: 'La symétrie', it: 'en clair.', sym: 'G', shape: 'crystal', line: '#F0ABFC', fill: '#7E22CE', keys: [
    { tag: 'Axiome I', tex: '$(a\\cdot b)\\cdot c=a\\cdot(b\\cdot c)$', text: 'La loi est associative.' },
    { tag: 'Axiome II', tex: '$\\exists e,\\ e\\cdot a=a\\cdot e=a$', text: 'Il existe un élément neutre.' },
    { tag: 'Axiome III', tex: '$\\forall a,\\ \\exists a^{-1},\\ a\\cdot a^{-1}=e$', text: 'Tout élément a un inverse.' }] },
};
