import test from 'node:test'
import assert from 'node:assert/strict'

import { lire } from './routeur.ts'

test('la racine mène au journal', () => {
  assert.deepEqual(lire(''), { ecran: 'journal' })
  assert.deepEqual(lire('#'), { ecran: 'journal' })
  assert.deepEqual(lire('#/'), { ecran: 'journal' })
})

test('un pli porté par le lien', () => {
  assert.deepEqual(lire('#c=2BcEhDsJAEAXQq0y-njRtg1qLhQSBI4iWDjBJu1t2p2sICdfAYTkBAkdv'), {
    ecran: 'pli',
    payload: '2BcEhDsJAEAXQq0y-njRtg1qLhQSBI4iWDjBJu1t2p2sICdfAYTkBAkdv',
  })
})

test('un payload qui porte des tirets et des soulignés reste entier', () => {
  assert.deepEqual(lire('#c=2a-b_c-d_e'), { ecran: 'pli', payload: '2a-b_c-d_e' })
})

test('un pli vide reste un pli — c’est au codec de refuser', () => {
  assert.deepEqual(lire('#c='), { ecran: 'pli', payload: '' })
})

test('un poème est nommé par son numéro et son jeton', () => {
  assert.deepEqual(lire('#p=015-vhtq'), { ecran: 'poeme', nom: '015-vhtq' })
  assert.deepEqual(lire('#p=1024-a1b2'), { ecran: 'poeme', nom: '1024-a1b2' })
})

test('un nom de poème qui n’en est pas un ne part pas chercher de fichier', () => {
  for (const nom of ['015', '../secret', '015-VHTQ', '015-vhtq/', '015 vhtq', '']) {
    assert.deepEqual(lire(`#p=${nom}`), { ecran: 'inconnu' }, nom)
  }
})

test('ce qu’un client colle après le nom ne fabrique pas un fichier', () => {
  assert.deepEqual(lire('#p=015-vhtq?x=1'), { ecran: 'inconnu' })
  assert.deepEqual(lire('#p=015%2Dvhtq'), { ecran: 'inconnu' })
})

test('l’ajout à l’écran d’accueil a son adresse', () => {
  assert.deepEqual(lire('#/installer'), { ecran: 'installer' })
})

test('un hash inconnu est inconnu, jamais deviné', () => {
  for (const hash of ['#/atelier', '#c', '#p', '#nimporte', '#/installer/2']) {
    assert.deepEqual(lire(hash), { ecran: 'inconnu' }, hash)
  }
})
