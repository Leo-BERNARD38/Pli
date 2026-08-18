// A1 · l'attente — le premier écran, celui que le lien apporte.
//
// Commune aux quatre types : la promesse ne change pas, seule l'étiquette de la tête change
// (docs/parcours.md#a1--lattente). Le balisage vit dans le document, parce qu'il est la
// vague 1 ; ce module n'y pose que ce que le lien apporte.

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
const ETIQUETTES: Record<Type, string> = {
  inv: 'une invitation',
  pen: 'une pensée',
  poe: 'un poème',
  sou: 'un souvenir',
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
  poser('[data-numero]', `nº ${numero(pli.n)} — pour toi seule`)
  poser('[data-signature]', `déposé par ${pli.s}`)
  poser('[data-cachet]', numero(pli.n))
  peindre()
}
