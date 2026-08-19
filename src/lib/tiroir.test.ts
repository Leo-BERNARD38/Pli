// Le tiroir : la normalisation du seuil, le compteur, et le dédoublonnage de l'historique.
// Rien au-delà — pas de test d'écran (docs/architecture.md#tests).
process.env.TZ = 'Europe/Paris'

import test from 'node:test'
import assert from 'node:assert/strict'

import {
  calerLeCompteur,
  deposes,
  empreinteDuSeuil,
  fixerLeProchainNumero,
  noterLeSeuil,
  noterLesReglages,
  noterUnDepot,
  prochainNumero,
  reglages,
  seuilFranchi,
} from './tiroir.ts'

/** Le tiroir du navigateur, en mémoire — Node n'en a pas. */
class Bac implements Storage {
  range = new Map<string, string>()
  get length(): number {
    return this.range.size
  }
  clear(): void {
    this.range.clear()
  }
  getItem(cle: string): string | null {
    return this.range.get(cle) ?? null
  }
  key(i: number): string | null {
    return [...this.range.keys()][i] ?? null
  }
  removeItem(cle: string): void {
    this.range.delete(cle)
  }
  setItem(cle: string, valeur: string): void {
    this.range.set(cle, String(valeur))
  }
}

function bacNeuf(): Bac {
  const bac = new Bac()
  globalThis.localStorage = bac
  return bac
}

const LE_3_SEPTEMBRE = new Date(2026, 8, 3, 21, 4)
const PLUS_TARD = new Date(2026, 8, 4, 9, 30)

test('la normalisation est la seule tolérance du seuil', async () => {
  const attendue = await empreinteDuSeuil('17082026')
  assert.equal(await empreinteDuSeuil('17/08/2026'), attendue)
  assert.equal(await empreinteDuSeuil('17-08-2026'), attendue)
  assert.equal(await empreinteDuSeuil(' 17 08 2026 '), attendue)
  // Une date écrite à l'envers est une autre date, et le reste.
  assert.notEqual(await empreinteDuSeuil('2026/08/17'), attendue)
  assert.match(attendue, /^[0-9a-f]{64}$/)
})

test('le seuil se pose une fois', () => {
  bacNeuf()
  assert.equal(seuilFranchi(), false)
  noterLeSeuil()
  assert.equal(seuilFranchi(), true)
})

test('un tiroir neuf rend deux lignes vides, jamais rien', () => {
  bacNeuf()
  assert.deepEqual(reglages(), { w: '', s: '' })
  noterLesReglages({ w: '336XXXXXXXX', s: 'a.' })
  assert.deepEqual(reglages(), { w: '336XXXXXXXX', s: 'a.' })
})

test('un tiroir abîmé à la main se lit comme un tiroir neuf', () => {
  const bac = bacNeuf()
  bac.setItem('pli.v1.reglages', '{ceci n’est pas du JSON')
  bac.setItem('pli.v1.deposes', 'null')
  assert.deepEqual(reglages(), { w: '', s: '' })
  assert.deepEqual(deposes(), [])
  assert.equal(prochainNumero(), 1)
})

test('le compteur avance avec les dépôts, et se reprend à la main', () => {
  bacNeuf()
  assert.equal(prochainNumero(), 1)
  noterUnDepot({ n: 1, t: 'inv', ti: 'Tu es invitée', c: '2aaa' }, LE_3_SEPTEMBRE)
  assert.equal(prochainNumero(), 2)
  fixerLeProchainNumero(15)
  assert.equal(prochainNumero(), 15)
  // Un dépôt plus ancien ne fait jamais reculer le compteur.
  noterUnDepot({ n: 3, t: 'pen', ti: 'rien', c: '2bbb' }, PLUS_TARD)
  assert.equal(prochainNumero(), 15)
})

test('l’historique dédoublonne sur le payload, pas sur le numéro', () => {
  bacNeuf()
  noterUnDepot({ n: 1, t: 'inv', ti: 'la première', c: '2aaa' }, LE_3_SEPTEMBRE)
  // Même numéro, autre pli : les deux existent — l'inverse en perdrait un en silence.
  noterUnDepot({ n: 1, t: 'sou', ti: 'la seconde', c: '2bbb' }, PLUS_TARD)
  assert.equal(deposes().length, 2)
  // Le même pli redéposé ne se dédouble pas, et remonte en tête.
  noterUnDepot({ n: 1, t: 'inv', ti: 'la première', c: '2aaa' }, PLUS_TARD)
  const liste = deposes()
  assert.equal(liste.length, 2)
  assert.equal(liste[0]?.c, '2aaa')
})

// ── le compteur calé sur l'index des poèmes ───────────────────────────────────────────

test('le compteur se cale sur un numéro pris ailleurs, et ne recule jamais', () => {
  bacNeuf()
  // Un poème écrit hors atelier a consommé le nº 015 : sans calage, le prochain pli le
  // reprendrait, et deux plis porteraient le même numéro (docs/donnees.md#lindex).
  assert.equal(prochainNumero(), 1)
  calerLeCompteur(15)
  assert.equal(prochainNumero(), 16)

  // Il n'avance que vers le haut : un index en retard sur le tiroir ne doit pas rendre un
  // numéro déjà parti dans une conversation.
  calerLeCompteur(3)
  assert.equal(prochainNumero(), 16)

  // Et il compose avec la reprise à la main du tiroir.
  fixerLeProchainNumero(40)
  calerLeCompteur(12)
  assert.equal(prochainNumero(), 40)
})
