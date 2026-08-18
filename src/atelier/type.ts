// D1 · le type — quatre lignes, et la mise en page est choisie.
//
// « Le type fixe la mise en page : après lui, il n'y a plus que du texte »
// (docs/parcours.md#d1--le-type). C'est la quatrième des cinq règles : le papier découle du
// type, jamais d'un choix offert au dépôt.
//
// Ce fichier porte aussi **la table des quatre types** — ce que chacun demande, et ce que
// son papier peut porter. Les plafonds sont ceux de docs/donnees.md#ce-que-le-papier-peut-porter,
// mesurés le 18/08/2026 dans un vrai pli déplié. Ils ne s'estiment pas : ce sont les
// plafonds du DÉPÔT, et c'est l'atelier qui les tient.

import type { Type } from '../lib/codec.ts'

import { laReponseEstPossible } from './reglages.ts'

/** Ce qu'un type demande à D2, et ce que son papier porte. */
export interface Papier {
  /** le nom, tel qu'il s'affiche */
  nom: string
  /** ce qu'il est, en une ligne */
  glose: string
  /** la question de D2 */
  question: string
  /** le plafond du titre, ou `null` quand le type n'en montre pas */
  titre: number | null
  /** le plafond de la voix */
  voix: number
  /** les deux faits — l'invitation seulement */
  faits: boolean
  /** ce que l'atelier ne sait pas encore fabriquer */
  ici: boolean
}

/**
 * Les quatre types. L'ordre est celui de la maquette, et le poème reste en dernier : il ne
 * s'écrit pas ici — il passe par la moulinette, à mon bureau
 * (docs/parcours.md#le-poème-hors-atelier). D2p, la liste des poèmes déjà déposés, arrive
 * avec lui.
 */
export const PAPIERS: Record<Type, Papier> = {
  inv: {
    nom: 'une invitation',
    glose: 'un titre, un mot, la date et le lieu — elle répond oui ou non',
    question: 'Écris ton invitation.',
    // Le cas serré : à 64px, un titre de 22 signes prend une troisième ligne de capitales
    // et coûte 92px d'un coup. D'où 16 — et « Tu es invitée » en fait 13.
    titre: 16,
    voix: 46,
    faits: true,
    ici: true,
  },
  pen: {
    nom: 'une pensée',
    glose: 'deux lignes seules au milieu de la page — rien à répondre',
    question: 'Écris ta pensée.',
    titre: null,
    voix: 256,
    faits: false,
    ici: true,
  },
  poe: {
    nom: 'un poème',
    glose: 'il s’écrit à ton bureau, et la moulinette en fait le lien',
    question: 'Choisis un poème.',
    titre: 88,
    voix: 358,
    faits: false,
    ici: false,
  },
  sou: {
    nom: 'un souvenir',
    glose: 'un titre haut, une ligne en bas, beaucoup de vide',
    question: 'Écris ton souvenir.',
    titre: 70,
    voix: 312,
    faits: false,
    ici: true,
  },
}

/**
 * Tient les quatre lignes du choix. `choisi` est appelé quand le type change — l'écran
 * suivant en dépend, et il se relit à chaque passage.
 *
 * L'invitation est grise tant que le numéro de réponse est vide : elle est le seul type qui
 * appelle une réponse, et sans numéro elle n'irait nulle part
 * (docs/parcours.md#d4--le-tiroir).
 */
export function tenirLeType(ecran: HTMLElement, choisi: (quel: Type) => void): () => void {
  const lignes = [...ecran.querySelectorAll<HTMLButtonElement>('.type')]
  const action = ecran.querySelector<HTMLButtonElement>('.bouton')

  const marquer = (quel: Type): void => {
    for (const ligne of lignes) {
      // `aria-pressed`, et non `aria-selected` : celui-là n'a de sens que dans une liste ou
      // un groupe de boutons radio, et un lecteur d'écran l'ignore sur un bouton seul.
      ligne.setAttribute('aria-pressed', String(ligne.dataset['type'] === quel))
    }
    if (action) action.disabled = false
    choisi(quel)
  }

  for (const ligne of lignes) {
    ligne.addEventListener('click', () => {
      const quel = ligne.dataset['type'] as Type | undefined
      if (quel && !ligne.disabled) marquer(quel)
    })
  }

  /** Se rejoue à chaque passage : le numéro de réponse a pu être écrit entre-temps. */
  return () => {
    const reponse = laReponseEstPossible()
    for (const ligne of lignes) {
      const quel = ligne.dataset['type'] as Type | undefined
      if (!quel) continue
      const dispo = PAPIERS[quel].ici && (quel !== 'inv' || reponse)
      ligne.disabled = !dispo
      if (!dispo) ligne.setAttribute('aria-pressed', 'false')
    }
    if (action) action.disabled = !lignes.some((l) => l.getAttribute('aria-pressed') === 'true')
  }
}
