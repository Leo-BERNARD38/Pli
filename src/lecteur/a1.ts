// A1 · l'attente — le premier écran, celui que le lien apporte.
//
// Commune aux quatre types ; **seule la promesse change** (docs/parcours.md#a1--lattente).
// Le balisage vit dans le document, parce qu'il est la vague 1 ; ce module n'y pose que ce
// que le lien apporte.

import type { Pli, Type } from '../lib/codec.ts'

// La peinture est importée, donc empreintée par Vite — jamais un chemin écrit à la main
// (docs/ressources.md#où-les-fichiers-vivent).
import rideau from '../textures/rideau-carmin-nuit.webp'

/**
 * Ce que le type dit de lui-même sur l'écran d'attente, et rien de plus.
 *
 * En minuscules : les capitales viennent de `text-transform`
 * (docs/design-system.md#les-mains). Le rideau, lui, ne dit rien du contenu — c'est tout
 * son intérêt.
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
 * **jamais ce que le pli contient** : le rideau ne dit rien du contenu, la promesse non
 * plus. Reprises des écrans d'attente du design — A1 et B0a-c
 * (design/canevas/, docs/integration.md) — débarrassées de ce qu'elles comptaient : une
 * maquette sait qu'il y a quatre strophes, un gabarit ne le sait pas.
 *
 * Celle de l'invitation est écrite en dur dans le document : c'est elle qui se peint avant
 * le décodage, et les trois autres la remplacent quand le lien a livré son type.
 */
export const PROMESSES: Record<Type, string> = {
  inv: 'Il ne s’ouvre qu’une fois. Ensuite il reste dans tes plis.',
  pen: 'Rien à répondre. Tu peux la lire debout.',
  poe: 'Prends le temps. Il n’y a rien à répondre.',
  sou: 'Une image, une ligne. Tu sauras tout de suite quel jour c’était.',
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
 * La peinture arrive après le texte, jamais avant. Le cadre porte déjà son aplat ; l'image
 * se fond par-dessus en 240 ms quand `decode()` a rendu la main — un décodage coûte 30 à
 * 60 ms de fil principal, et il n'a le droit de les prendre que maintenant, pendant qu'elle
 * regarde le volet fermé (docs/ressources.md#ce-quune-grande-image-coûte).
 */
function peindre(): void {
  const toile = ecran?.querySelector('img')
  if (!toile || toile.src) return
  toile.src = rideau
  // Une peinture qui n'arrive jamais laisse l'aplat en place : c'est le bon échec.
  toile.decode().then(
    () => toile.setAttribute('data-peinte', ''),
    () => {},
  )
}

/** Écrit sur A1 ce que le lien apporte, puis lance la peinture. */
export function ecrire(pli: Pli): void {
  poser('[data-type]', ETIQUETTES[pli.t])
  poser('[data-promesse]', PROMESSES[pli.t])
  poser('[data-numero]', `nº ${numero(pli.n)} — pour toi seule`)
  poser('[data-signature]', `déposé par ${pli.s}`)
  poser('[data-cachet]', numero(pli.n))
  peindre()
}

/**
 * A1 rend sa peinture. Deux textures décodées vivantes au maximum, et A2 vient d'en poser
 * une : une image de 4,2 Mpx occupe 17 Mo une fois décodée, et ça ne se garde pas « au cas
 * où » (docs/ressources.md#ce-quune-grande-image-coûte). L'`<img>` sort du document ; le
 * cadre garde son aplat, qui ne coûte pas un octet.
 */
export function oublierLaPeinture(): void {
  ecran?.querySelector('img')?.remove()
}
