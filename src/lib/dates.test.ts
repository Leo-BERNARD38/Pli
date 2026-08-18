// Les dates du produit sont locales. On fixe le fuseau ici pour que le changement
// d'heure soit réellement traversé, quelle que soit la machine qui lance les tests.
process.env.TZ = 'Europe/Paris'

import test from 'node:test'
import assert from 'node:assert/strict'

import { depuis, heure, horodate, jour, relire } from './dates.ts'

const LE_3_SEPTEMBRE = new Date(2026, 8, 3, 21, 4)

test('l’horodatage du journal s’écrit à la minute', () => {
  assert.equal(horodate(LE_3_SEPTEMBRE), '2026-09-03T21:04')
  assert.equal(horodate(new Date(2026, 0, 1, 0, 0)), '2026-01-01T00:00')
  assert.equal(horodate(new Date(2026, 11, 31, 23, 59)), '2026-12-31T23:59')
})

test('l’horodatage se relit tel qu’il a été écrit', () => {
  assert.equal(horodate(relire('2026-09-03T21:04')), '2026-09-03T21:04')
  assert.deepEqual(relire('2026-09-03T21:04'), LE_3_SEPTEMBRE)
})

test('ce qui n’est pas un horodatage est refusé', () => {
  const abimes = [
    '',
    '03/09/2026',
    '2026-09-03',
    '2026-09-03T21:04:33',
    '2026-13-01T00:00',
    '2026-02-30T12:00',
    // `new Date` mapperait 0 à 99 sur les années 1900 : on refuse plutôt que de deviner.
    '0099-01-01T00:00',
    'hier',
  ]
  for (const abime of abimes) assert.throws(() => relire(abime), /date illisible/, abime)
})

test('l’heure se lit à la française', () => {
  assert.equal(heure(LE_3_SEPTEMBRE), '21h04')
  assert.equal(heure(new Date(2026, 8, 3, 0, 0)), '00h00')
  assert.equal(heure(new Date(2026, 8, 3, 20, 0)), '20h00')
})

test('la date nommée porte l’année seulement si ce n’est pas celle-ci', () => {
  assert.equal(jour(LE_3_SEPTEMBRE, new Date(2026, 11, 31, 12, 0)), '3 septembre')
  assert.equal(jour(LE_3_SEPTEMBRE, new Date(2027, 0, 1, 12, 0)), '3 septembre 2026')
  assert.equal(jour(new Date(2026, 0, 1, 9, 0), LE_3_SEPTEMBRE), '1er janvier')
  assert.equal(jour(new Date(2026, 1, 3, 9, 0), LE_3_SEPTEMBRE), '3 février')
})

test('le relatif tient jusqu’à sept jours, puis la date prend le relais', () => {
  const maintenant = new Date(2026, 8, 3, 12, 0)
  const jours = (n: number) => new Date(2026, 8, 3 - n, 12, 0)
  assert.equal(depuis(jours(0), maintenant), "aujourd'hui")
  assert.equal(depuis(jours(1), maintenant), 'hier')
  assert.equal(depuis(jours(2), maintenant), 'il y a deux jours')
  assert.equal(depuis(jours(3), maintenant), 'il y a trois jours')
  assert.equal(depuis(jours(6), maintenant), 'il y a six jours')
  assert.equal(depuis(jours(7), maintenant), '27 août')
  assert.equal(depuis(jours(30), maintenant), '4 août')
})

test('l’écart se compte en jours civils, pas en vingt-quatre heures', () => {
  // Une heure d’écart, mais la veille : c’est « hier », pas « aujourd'hui ».
  assert.equal(depuis(new Date(2026, 8, 2, 23, 30), new Date(2026, 8, 3, 0, 30)), 'hier')
  // Vingt-trois heures d’écart le même jour : c’est « aujourd'hui ».
  assert.equal(depuis(new Date(2026, 8, 3, 0, 30), new Date(2026, 8, 3, 23, 30)), "aujourd'hui")
})

test('une date en avance ne dit pas de bêtise', () => {
  assert.equal(depuis(new Date(2026, 8, 4, 9, 0), LE_3_SEPTEMBRE), "aujourd'hui")
})

test('le changement d’heure ne décale pas le compte', () => {
  // Le passage à l’heure d’hiver, en France, dans la nuit du 24 au 25 octobre 2026.
  assert.equal(depuis(new Date(2026, 9, 24, 12, 0), new Date(2026, 9, 25, 12, 0)), 'hier')
  assert.equal(depuis(new Date(2026, 9, 24, 12, 0), new Date(2026, 9, 26, 12, 0)), 'il y a deux jours')
})

test('aucune journée ne se raconte avec un trou', () => {
  const maintenant = new Date(2026, 8, 3, 12, 0)
  for (let n = 0; n <= 40; n += 1) {
    const dit = depuis(new Date(2026, 8, 3 - n, 12, 0), maintenant)
    assert.doesNotMatch(dit, /undefined|NaN/, `à ${n} jours`)
  }
})
