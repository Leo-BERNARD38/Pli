// D4 · le tiroir — le numéro de réponse, la signature, le prochain numéro.
//
// « Trois lignes, la même écriture que D2, la même absence de valider : ce qui est écrit
// est gardé » (docs/parcours.md#d4--le-tiroir). D'où l'écriture à chaque signe, et aucune
// action pour la déclencher.
//
// Rien de ce tiroir n'entre dans le dépôt : le numéro de réponse ne connaît que deux
// endroits, ce téléphone et un lien déjà envoyé (docs/donnees.md#5-mon-historique).

import {
  fixerLeProchainNumero,
  noterLesReglages,
  prochainNumero,
  reglages,
} from '../lib/tiroir.ts'

/** Les trois lignes de l'écran, une fois trouvées. */
interface Lignes {
  w: HTMLInputElement
  s: HTMLInputElement
  n: HTMLInputElement
}

function lignes(ecran: HTMLElement): Lignes | null {
  const w = ecran.querySelector<HTMLInputElement>('#w')
  const s = ecran.querySelector<HTMLInputElement>('#s')
  const n = ecran.querySelector<HTMLInputElement>('#n')
  return w && s && n ? { w, s, n } : null
}

/**
 * Remplit le tiroir et le garde à jour.
 *
 * Le prochain numéro est une ligne comme les deux autres : il s'affiche, et il se reprend
 * à la main le jour où le bac a été vidé (docs/roadmap.md#ce-qui-reste). Une ligne vidée
 * ne remet pas le compteur à zéro — elle attend le nombre suivant.
 */
export function tenirLeTiroir(ecran: HTMLElement): void {
  const trois = lignes(ecran)
  if (!trois) return

  const garde = reglages()
  trois.w.value = garde.w
  trois.s.value = garde.s
  trois.n.value = String(prochainNumero())

  const noter = (): void => {
    noterLesReglages({ w: trois.w.value.trim(), s: trois.s.value.trim() })
  }
  trois.w.addEventListener('input', noter)
  trois.s.addEventListener('input', noter)

  trois.n.addEventListener('input', () => {
    const nombre = Number(trois.n.value.replace(/\D/g, ''))
    if (nombre >= 1) fixerLeProchainNumero(nombre)
  })
}

/**
 * Le numéro de réponse est-il là ?
 *
 * « Tant que le numéro de réponse est vide, D1 propose les trois autres types et grise
 * l'invitation » — elle est le seul type qui appelle une réponse
 * (docs/parcours.md#d4--le-tiroir).
 */
export function laReponseEstPossible(): boolean {
  return reglages().w !== ''
}
