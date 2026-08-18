// Le plancher de docs/architecture.md#tests pour le journal : le dédoublonnage sur `h`,
// et rien au-delà. Pas de test d'écran.
process.env.TZ = 'Europe/Paris'

import test from 'node:test'
import assert from 'node:assert/strict'

import { empreinte, entrees, noterLaReponse, noterLeDepliage, trouver } from './journal.ts'

/**
 * Le tiroir du navigateur, en mémoire. Node n'en a pas — et c'est très bien ainsi : ce
 * faux-là dit exactement ce que le module attend d'un `Storage`, et rien de plus.
 */
class Tiroir implements Storage {
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

function tiroirNeuf(): Tiroir {
  const tiroir = new Tiroir()
  globalThis.localStorage = tiroir
  return tiroir
}

const LE_3_SEPTEMBRE = new Date(2026, 8, 3, 21, 4)
const PLUS_TARD = new Date(2026, 8, 4, 9, 30)

test('l’empreinte est stable, courte, et suit le payload', async () => {
  const une = await empreinte('2abcdef')
  assert.equal(une, await empreinte('2abcdef'))
  assert.match(une, /^[0-9a-f]{16}$/)
  assert.notEqual(une, await empreinte('2abcdeg'))
  // Les accents passent par UTF-8 comme le reste : l'empreinte ne s'en aperçoit pas.
  assert.match(await empreinte('2é—à'), /^[0-9a-f]{16}$/)
})

test('un dépliage s’écrit une fois, et une seule', () => {
  tiroirNeuf()
  noterLeDepliage('aaaa', '2payload', LE_3_SEPTEMBRE)
  noterLeDepliage('aaaa', '2payload', PLUS_TARD)
  const liste = entrees()
  assert.equal(liste.length, 1)
  assert.deepEqual(liste[0], { h: 'aaaa', c: '2payload', deplieLe: '2026-09-03T21:04' })
})

test('le dédoublonnage se fait sur l’empreinte, jamais sur le numéro', () => {
  tiroirNeuf()
  // Deux plis distincts qui partageraient un numéro : les deux sont archivés.
  noterLeDepliage('aaaa', '2premier', LE_3_SEPTEMBRE)
  noterLeDepliage('bbbb', '2second', PLUS_TARD)
  assert.equal(entrees().length, 2)
  // Les plus récentes d'abord (docs/donnees.md#4-son-journal).
  assert.deepEqual(
    entrees().map((e) => e.h),
    ['bbbb', 'aaaa'],
  )
})

test('une entrée se retrouve par son payload', () => {
  tiroirNeuf()
  noterLeDepliage('aaaa', '2payload', LE_3_SEPTEMBRE)
  assert.equal(trouver('2payload')?.h, 'aaaa')
  assert.equal(trouver('2autre'), null)
})

test('la réponse se note sur l’entrée déjà là, sans la dupliquer', () => {
  tiroirNeuf()
  noterLeDepliage('aaaa', '2payload', LE_3_SEPTEMBRE)
  noterLaReponse('aaaa', '2payload', 'oui, j’y serai', PLUS_TARD)
  const liste = entrees()
  assert.equal(liste.length, 1)
  assert.deepEqual(liste[0]?.reponse, {
    mot: 'oui, j’y serai',
    ligne: null,
    le: '2026-09-04T09:30',
  })
  assert.equal(liste[0]?.deplieLe, '2026-09-03T21:04')
})

test('un bac vidé entre le dépliage et la réponse ne perd pas le mot', () => {
  tiroirNeuf()
  noterLaReponse('aaaa', '2payload', 'peut-être', PLUS_TARD)
  assert.equal(entrees()[0]?.reponse?.mot, 'peut-être')
})

test('un journal illisible rend une liste vide, et n’empêche rien', () => {
  const tiroir = tiroirNeuf()
  tiroir.setItem('pli.v1.journal', '{ ceci n’est pas du json')
  assert.deepEqual(entrees(), [])
  tiroir.setItem('pli.v1.journal', '{"h":"aaaa"}')
  assert.deepEqual(entrees(), [])
  // Une liste dont une entrée seulement est abîmée garde les autres.
  tiroir.setItem('pli.v1.journal', '[{"h":"aaaa"},{"h":"bbbb","c":"2p","deplieLe":"2026-09-03T21:04"}]')
  assert.deepEqual(
    entrees().map((e) => e.h),
    ['bbbb'],
  )
})

test('sans tiroir, tout dégrade proprement', () => {
  // La navigation privée d'iOS : le stockage existe mais refuse d'écrire.
  const ferme = new Tiroir()
  ferme.setItem = () => {
    throw new Error('bac fermé')
  }
  globalThis.localStorage = ferme
  assert.doesNotThrow(() => noterLeDepliage('aaaa', '2payload', LE_3_SEPTEMBRE))
  assert.deepEqual(entrees(), [])
})
