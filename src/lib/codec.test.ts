import test from 'node:test'
import assert from 'node:assert/strict'

import { decoder, encoder, VERSION, type Pli } from './codec.ts'

const INVITATION: Pli = {
  v: 1,
  t: 'inv',
  n: 14,
  ti: 'Tu es invitée',
  b: 'Mets la robe verte, celle du printemps.',
  f: ['samedi 22 août · 20h00', 'Le Petit Comptoir'],
  g: 'rien qu’à toi',
  s: 'a.',
}

// Un lien fabriqué le 18 août 2026 par ce codec. Il tient lieu de lien déjà parti :
// s'il cesse de se décoder, c'est un pli perdu dans une conversation, pas un test rouge.
const LIEN_DEJA_PARTI =
  '2BcEhDsJAEAXQq0y-njRtg1qLhQSBI4iWDjBJu1t2p2sICdfAYTkBAkdvwkl474oMVzEMDuozGB6uWjBM4bCdSBKpz2rzS8Bo4bAWS9Q3FEMrlCWaMB2k74W6icao3mQYUwHGEW6H1AzSKdU1NWH-GH3fVJfnsgRjJbQRU6NlGEYLGrFnnOAQVTxdpt_9MT_JgoKR4NAUuP0B'

const POEME: Pli = {
  v: 1,
  t: 'poe',
  n: 15,
  ti: 'Nuit de juin',
  b: ['première strophe, ligne une\npremière strophe, ligne deux', 'seconde strophe, et la nuit d’après'],
  s: 'a.',
}

// Le poème est le transport le plus durable : son fichier est encodé une fois par la
// moulinette et redécodé pour toujours. Ce payload-là est gelé le 18 août 2026.
const POEME_DEJA_PARTI =
  '2dc29CQJBEAbQVoYvHoQLTKYIG1CD1R105Jxd9keEQ7ANO7g-rhMrEYxMjF_wJtwgA6NBkJOC4ZBhzWgGwaZbo6h06eZgHCBb5KJXW-aiVFtJ-axMo51cqbvu_K9G7Xcwqh6Txx_VRmMg_0bv5yvksswVe0aFIKzw-AA'

async function allerRetour(pli: Pli): Promise<Pli> {
  return decoder(await encoder(pli))
}

test('un lien déjà parti reste lisible', async () => {
  assert.deepEqual(await decoder(LIEN_DEJA_PARTI), INVITATION)
})

test('un poème déjà parti reste lisible', async () => {
  assert.deepEqual(await decoder(POEME_DEJA_PARTI), POEME)
})

test('les quatre types font l’aller-retour', async () => {
  const plis: Pli[] = [
    INVITATION,
    { v: 1, t: 'pen', n: 15, ti: 'Ce matin', b: 'J’ai pensé à toi en passant.', s: 'a.' },
    {
      v: 1,
      t: 'poe',
      n: 16,
      ti: 'Nuit de juin',
      b: ['première strophe, ligne une\npremière strophe, ligne deux', 'seconde strophe'],
      s: 'a.',
    },
    { v: 1, t: 'sou', n: 17, ti: 'La gare', b: 'Il pleuvait.', g: 'pour toi seule', s: 'a.' },
  ]
  for (const pli of plis) assert.deepEqual(await allerRetour(pli), pli)
})

test('les accents et la ponctuation française traversent intacts', async () => {
  const pli: Pli = {
    v: 1,
    t: 'pen',
    n: 18,
    ti: 'Où ça, déjà ?',
    b: '« Ça va être l’été », a-t-elle dit — puis plus rien… çàéèêëïîôöùûü ÀÇÉÈÊËÏÎÔÖÙÛÜ',
    s: 'a.',
  }
  assert.deepEqual(await allerRetour(pli), pli)
})

test('un poème long fait l’aller-retour', async () => {
  const strophes = Array.from(
    { length: 40 },
    (_, i) => `strophe ${i + 1}, première ligne\nstrophe ${i + 1}, seconde ligne, plus longue encore`,
  )
  const pli: Pli = { v: 1, t: 'poe', n: 19, ti: 'La longue', b: strophes, s: 'a.' }
  const lien = await encoder(pli)
  assert.deepEqual(await decoder(lien), pli)
  assert.ok(lien.length < JSON.stringify(pli).length, 'le lien reste plus court que son json')
})

test('le numéro de réponse voyage dans le lien', async () => {
  const pli: Pli = { ...INVITATION, w: '336XXXXXXXX' }
  assert.equal((await allerRetour(pli)).w, '336XXXXXXXX')
})

test('une clé absente reste absente', async () => {
  const pli: Pli = { v: 1, t: 'pen', n: 20, ti: 'Rien de plus', b: 'Une ligne.', s: 'a.' }
  const relu = await allerRetour(pli)
  assert.equal('w' in relu, false)
  assert.equal('f' in relu, false)
  assert.equal('g' in relu, false)
})

test('le payload porte la version et rien qui abîme une url', async () => {
  const lien = await encoder(INVITATION)
  assert.equal(lien.slice(0, 1), VERSION)
  assert.match(lien.slice(1), /^[A-Za-z0-9_-]+$/)
})

test('un payload tronqué donne un lien abîmé', async () => {
  const lien = await encoder(INVITATION)
  await assert.rejects(() => decoder(lien.slice(0, lien.length - 12)), /lien abîmé/)
})

test('un préfixe inconnu donne un lien abîmé', async () => {
  const lien = await encoder(INVITATION)
  await assert.rejects(() => decoder('3' + lien.slice(1)), /lien abîmé/)
  await assert.rejects(() => decoder(''), /lien abîmé/)
})

test('du charabia donne un lien abîmé', async () => {
  await assert.rejects(() => decoder('2ceci-nest-pas-un-pli'), /lien abîmé/)
})

test('un json qui n’est pas un pli donne un lien abîmé', async () => {
  const etranger = await encoder({ bonjour: 'ceci n’est pas un pli' } as unknown as Pli)
  await assert.rejects(() => decoder(etranger), /lien abîmé/)
})

test('un pli amputé de ce qui s’affiche toujours donne un lien abîmé', async () => {
  const amputes = [
    { ...INVITATION, s: undefined },
    { ...INVITATION, ti: undefined },
    { ...INVITATION, n: undefined },
    { ...INVITATION, b: undefined },
    { ...INVITATION, t: 'xxx' },
    { ...INVITATION, v: undefined },
    { ...POEME, b: ['une strophe', 42] },
  ]
  for (const ampute of amputes) {
    const lien = await encoder(ampute as unknown as Pli)
    await assert.rejects(() => decoder(lien), /lien abîmé/)
  }
})

test('les clés optionnelles sont refusées quand elles ont la mauvaise forme', async () => {
  const tordus = [
    { ...INVITATION, f: 'samedi 22 août' },
    { ...INVITATION, f: ['samedi', 3] },
    { ...INVITATION, g: 12 },
    { ...INVITATION, w: 336 },
  ]
  for (const tordu of tordus) {
    const lien = await encoder(tordu as unknown as Pli)
    await assert.rejects(() => decoder(lien), /lien abîmé/)
  }
})

test('un pli sans ses clés optionnelles passe', async () => {
  const nu: Pli = { v: 1, t: 'pen', n: 20, ti: 'Rien de plus', b: 'Une ligne.', s: 'a.' }
  assert.deepEqual(await allerRetour(nu), nu)
})
