// A1 · l'attente — le premier écran, celui que le lien apporte.
//
// Commune aux quatre types ; **seule la promesse change** (docs/parcours.md#a1--lattente).
// Le balisage vit dans le document, parce qu'il est la vague 1 ; ce module n'y pose que ce
// que le lien apporte.

import type { Pli, Type } from '../lib/codec.ts'

// AUCUNE PEINTURE ICI, ET C'EST VOULU. A1 est l'écran qui doit se peindre avant tout le
// reste ; son papier est le crème du gabarit, qui ne coûte pas une requête. Le rideau a
// vécu ici jusqu'au 19/08/2026 : 614 ko préchargés en même temps que les trois polices
// que le texte, lui, attend vraiment (.claude/decisions.md, docs/chargement.md).

/**
 * Ce que le type dit de lui-même sur l'écran d'attente, et rien de plus.
 *
 * En minuscules : les capitales viennent de `text-transform`
 * (docs/design-system.md#les-mains).
 */
export const ETIQUETTES: Record<Type, string> = {
  inv: 'une invitation',
  pen: 'une pensée',
  poe: 'un poème',
  sou: 'un souvenir',
}

/**
 * La promesse — la seule chose qui change d'un type à l'autre sur l'attente
 * (docs/parcours.md#a1--lattente). Elle dit ce qui attend et ce qu'on en attend d'elle,
 * **jamais ce que le pli contient** : l'attente ne montre rien du pli, la promesse non
 * plus. Reprises des écrans d'attente du design — A1 et B0a-c
 * (design/canevas/, docs/integration.md) — débarrassées de ce qu'elles comptaient : une
 * maquette sait qu'il y a quatre strophes, un gabarit ne le sait pas.
 *
 * Celle de l'invitation est écrite en dur dans le document : c'est elle qui se peint avant
 * le décodage, et les trois autres la remplacent quand le lien a livré son type.
 */
export const PROMESSES: Record<Type, string> = {
  inv: 'Il ne s’ouvre qu’une fois. Ensuite il est à toi.',
  pen: 'Rien à répondre. Lis-la où tu veux.',
  poe: 'Prends ton temps. Celui-là se lit lentement.',
  sou: 'Une image, une ligne. Tu sauras tout de suite.',
}

const ecran = document.querySelector<HTMLElement>('#a1')

/** Le numéro du cachet, sur trois chiffres — le nombre seul (docs/donnees.md#1-le-pli). */
export function numero(n: number): string {
  return String(n).padStart(3, '0')
}

function poser(selecteur: string, texte: string): void {
  const place = ecran?.querySelector<HTMLElement>(selecteur)
  if (place) place.textContent = texte
}

/**
 * Écrit sur A1 ce que le lien apporte. Cinq emplacements, une seule frame, et rien à
 * charger : c'est tout ce que cet écran fait.
 */
export function ecrire(pli: Pli): void {
  poser('[data-type]', ETIQUETTES[pli.t])
  poser('[data-promesse]', PROMESSES[pli.t])
  poser('[data-numero]', `nº ${numero(pli.n)} — pour toi seule`)
  poser('[data-signature]', `déposé par ${pli.s}`)
  poser('[data-cachet]', numero(pli.n))
}
