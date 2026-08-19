// Le poème — ce qui protège des liens déjà partis, et rien d'autre.
//
// Deux invariants tiennent tout le reste (docs/donnees.md#3-le-poème) : le jeton d'un
// numéro connu se réutilise, et l'index ne perd jamais une entrée. Ils sont irrattrapables
// — un lien parti est dans une conversation, pour toujours —, donc ils se testent.

import test from 'node:test'
import assert from 'node:assert/strict'

import { lire } from './routeur.ts'
import {
  decoderLIndex,
  dernierNumero,
  encoderLIndex,
  fabriquerUnJeton,
  jetonDu,
  lireLaSource,
  nomDuFichier,
  rangerDansLIndex,
  separerLesStrophes,
  type Entree,
} from './poeme.ts'

const INDEX: Entree[] = [
  { n: 14, j: 'ab12', ti: 'La gare' },
  { n: 15, j: 'vhtq', ti: 'Nuit de juin' },
]

// ── le jeton ─────────────────────────────────────────────────────────────────────────

test('le jeton d’un numéro déjà connu est réutilisé — le lien ne change pas', () => {
  assert.equal(
    jetonDu(15, INDEX, () => 'zzzz'),
    'vhtq',
  )
})

test('un numéro neuf reçoit un jeton neuf', () => {
  assert.equal(
    jetonDu(16, INDEX, () => 'zzzz'),
    'zzzz',
  )
})

test('le jeton fait quatre signes, dans l’alphabet du routeur', () => {
  // Chaque signe de l'alphabet, pris à son tour : c'est le seul moyen de vérifier qu'aucun
  // d'eux ne sortira de ce que le routeur accepte. Être plus large que la moulinette est
  // sans danger, l'inverse casserait un lien déjà parti.
  for (let i = 0; i < 36; i += 1) {
    const jeton = fabriquerUnJeton(() => i)
    assert.equal(jeton.length, 4)
    assert.deepEqual(lire(`#p=${nomDuFichier(15, jeton)}`), {
      ecran: 'poeme',
      nom: `015-${jeton}`,
    })
  }
})

test('le nom du fichier cale le numéro sur trois chiffres', () => {
  assert.equal(nomDuFichier(15, 'vhtq'), '015-vhtq')
  assert.equal(nomDuFichier(7, 'ab12'), '007-ab12')
  // Le routeur accepte plus large que ce qu'on fabrique, et c'est le bon sens.
  assert.equal(nomDuFichier(1234, 'ab12'), '1234-ab12')
})

// ── l'index ──────────────────────────────────────────────────────────────────────────

test('ranger un poème connu corrige son titre et garde son jeton', () => {
  const range = rangerDansLIndex(INDEX, { n: 15, j: 'zzzz', ti: 'Nuit de juin, reprise' })
  assert.equal(range.length, 2)
  assert.deepEqual(range[1], { n: 15, j: 'vhtq', ti: 'Nuit de juin, reprise' })
})

test('ranger un poème neuf ne fait perdre aucune entrée', () => {
  const range = rangerDansLIndex(INDEX, { n: 3, j: 'cd34', ti: 'Le quai' })
  assert.deepEqual(
    range.map((e) => e.n),
    [3, 14, 15],
  )
})

test('l’index fait l’aller-retour', async () => {
  assert.deepEqual(await decoderLIndex(await encoderLIndex(INDEX)), INDEX)
})

test('un index abîmé rend une liste vide, il ne lève pas', async () => {
  assert.deepEqual(await decoderLIndex('2pasunindex'), [])
  assert.deepEqual(await decoderLIndex(''), [])
  // Un JSON valide qui n'est pas une liste d'entrées ne passe pas non plus.
  assert.deepEqual(await decoderLIndex(await encoderLIndex([{ n: 1 } as unknown as Entree])), [])
})

test('le dernier numéro cale le compteur, et vaut 0 sur un index vide', () => {
  assert.equal(dernierNumero(INDEX), 15)
  assert.equal(dernierNumero([]), 0)
})

// ── la source ────────────────────────────────────────────────────────────────────────

const SOURCE = `---
n: 15
type: poeme
titre: Nuit de juin
signe: a.
---

première strophe, ligne une
première strophe, ligne deux

seconde strophe...
`

test('la source se lit — l’en-tête et les strophes', () => {
  const { entete, strophes } = lireLaSource(SOURCE)
  assert.deepEqual(entete, { n: 15, titre: 'Nuit de juin', signe: 'a.' })
  assert.deepEqual(strophes, [
    'première strophe, ligne une\npremière strophe, ligne deux',
    'seconde strophe...',
  ])
})

test('la ligne vide sépare deux strophes, et la strophe garde ses retours', () => {
  assert.deepEqual(separerLesStrophes('une\ndeux\n\ntrois'), ['une\ndeux', 'trois'])
  // Plusieurs lignes vides, ou une ligne d'espaces, ne font pas plus d'une coupure.
  assert.deepEqual(separerLesStrophes('une\n\n\n  \n\ndeux'), ['une', 'deux'])
  assert.deepEqual(separerLesStrophes('\n\nune\n\n'), ['une'])
})

test('les fins de ligne de Windows ne font pas de strophe en trop', () => {
  const { strophes } = lireLaSource(SOURCE.replace(/\n/g, '\r\n'))
  assert.equal(strophes.length, 2)
})

test('une source incomplète est un refus net, jamais une valeur devinée', () => {
  assert.throws(() => lireLaSource('pas de front-matter'), /front-matter/)
  assert.throws(() => lireLaSource(SOURCE.replace('type: poeme', 'type: pensee')), /poeme/)
  assert.throws(() => lireLaSource(SOURCE.replace('n: 15', 'n: quinze')), /numéro/)
  assert.throws(() => lireLaSource(SOURCE.replace('titre: Nuit de juin', 'titre:')), /titre/)
  assert.throws(() => lireLaSource(SOURCE.replace('signe: a.', 'signe:')), /signe/)
  assert.throws(() => lireLaSource(SOURCE.replace(/---\n\n[\s\S]*$/, '---\n')), /corps/)
})
