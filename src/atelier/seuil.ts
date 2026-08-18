// D0 · le seuil — une question, une ligne, et l'atelier s'ouvre.
//
// « Faux → la ligne se vide, sans rien reprocher » (docs/parcours.md#d0--le-seuil). Il n'y
// a donc rien à appuyer : la ligne se relit à chaque signe, et le jour où elle est juste,
// l'écran s'en va. C'est la règle « rien à signer » appliquée à la seule porte du produit.
//
// C'est un paillasson, pas une serrure : le contrôle est côté client et il n'existe que
// quelques dizaines de milliers de dates plausibles. L'objectif est d'écarter le passant
// (docs/architecture.md#le-seuil-de-latelier).

import { empreinteDuSeuil, noterLeSeuil } from '../lib/tiroir.ts'

/**
 * L'empreinte de notre date, et elle seule — la date en clair n'entre jamais dans le dépôt.
 *
 * Elle se fabrique en local, une fois, avec la commande `/seuil` puis se recopie ici. Tant
 * qu'elle est vide, **rien ne passe** : un seuil sans empreinte serait une porte ouverte,
 * et une empreinte inventée serait une porte qu'aucune date n'ouvre.
 */
const EMPREINTE = ''

/** Le nombre de chiffres d'une date complète : au huitième, la ligne se juge. */
const CHIFFRES = 8

/**
 * Tient la porte. Rend de quoi savoir si elle est déjà franchie ; `franchi` est appelé
 * quand elle vient de l'être.
 */
export function tenirLeSeuil(ecran: HTMLElement, franchi: () => void): void {
  const ligne = ecran.querySelector('input')
  if (!ligne) return

  ligne.addEventListener('input', () => {
    void relire()
  })

  const relire = async (): Promise<void> => {
    const saisie = ligne.value
    if (saisie.replace(/\D/g, '').length < CHIFFRES) return

    if (EMPREINTE && (await empreinteDuSeuil(saisie)) === EMPREINTE) {
      noterLeSeuil()
      franchi()
      return
    }

    // Sans rien reprocher : la ligne se vide, et c'est tout ce qui se passe.
    ligne.value = ''
  }

  ligne.focus()
}
