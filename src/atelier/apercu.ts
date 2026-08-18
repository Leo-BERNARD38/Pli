// L'aperçu — le pli tel qu'elle le recevra, en petit.
//
// « Un vrai pli 360 × 780 réduit par transform: scale(), jamais un dessin séparé »
// (docs/parcours.md#d1--le-type). L'échelle est dans depot.css ; ici on ne fait que
// remplir, et le papier suit le type — quatrième des cinq règles.

import type { Type } from '../lib/codec.ts'

import { PAPIERS } from './type.ts'
import type { Textes } from './textes.ts'

/** Les types qui se lisent sur fond encre (docs/design-system.md). */
const ENCRE: ReadonlySet<Type> = new Set<Type>(['pen', 'poe'])

/** Remplit l'aperçu. Rien à animer : il se repeint pendant la frappe, et c'est tout. */
export function poserLapercu(mini: HTMLElement, quel: Type, textes: Textes): void {
  const papier = PAPIERS[quel]
  // Deux choses, et pas la même : `data-type` fait entrer la feuille du type — l'aperçu se
  // compose donc exactement comme elle le lira — et `pli--encre` pose le papier sombre.
  mini.dataset['type'] = quel
  mini.classList.toggle('pli--encre', ENCRE.has(quel))

  const dire = (quoi: string, texte: string): void => {
    const element = mini.querySelector<HTMLElement>(`[data-mini="${quoi}"]`)
    if (!element) return
    element.textContent = texte
    element.hidden = texte === ''
  }

  dire('type', papier.nom)
  dire('titre', papier.titre === null ? '' : textes.ti)
  dire('voix', textes.b)
  dire('quand', papier.faits ? textes.quand : '')
  dire('ou', papier.faits ? textes.ou : '')
  dire('signature', textes.s === '' ? '' : `déposé par ${textes.s}`)

  // Seule l'invitation a une action, donc un volet qui appelle : les trois autres se
  // referment sans réponse, et c'est le produit, pas un manque (docs/roadmap.md#jalon-3).
  const volet = mini.querySelector<HTMLElement>('.mini__volet')
  if (volet) volet.hidden = quel !== 'inv'
}
