import { describe, it, expect } from 'vitest';
import { sanitize, levelOf } from './store';
import { parseHash } from './router';
describe('store', () => {
  it('une sauvegarde corrompue ne plante pas', () => {
    expect(sanitize(null).xp).toBe(0);
    expect(sanitize({ xp: 'x', read: 5 }).read).toEqual([]);
    expect(sanitize({ xp: -3 }).xp).toBe(0);
  });
  it('niveaux', () => { expect(levelOf(0)).toBe(1); expect(levelOf(50)).toBe(2); expect(levelOf(150)).toBe(3); });
});
describe('router', () => {
  it('adresse inconnue -> accueil', () => { expect(parseHash('#/nimporte/quoi').kind).toBe('home'); });
  it('module sans onglet', () => { expect(parseHash('#/topologie')).toMatchObject({ kind: 'module', module: 'topologie', tab: null }); });
  it('onglet inconnu -> accueil du module', () => { expect(parseHash('#/mesure/zzz')).toMatchObject({ module: 'mesure', tab: null }); });
  it('cours/2.1', () => { expect(parseHash('#/topologie/cours/2.1')).toMatchObject({ tab: 'cours', rest: ['2.1'] }); });
});
