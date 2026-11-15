export type ModuleId = 'topologie' | 'mesure' | 'algebre';
export type ModuleManifest = {
  id: ModuleId; title: string; tagline: string; status: 'actif' | 'bientot';
  chapters: { id: string; title: string }[];
};
export const TABS = [
  ['cours', 'Cours'], ['labs', 'Labos'], ['jeux', 'Jeux'], ['exos', 'Exercices'],
  ['cartes', 'Flashcards'], ['quiz', 'QCM'], ['profil', 'Profil'],
] as const;
export type TabId = (typeof TABS)[number][0];
