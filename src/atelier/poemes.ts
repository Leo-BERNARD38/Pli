// D2p · quel poème — la liste des poèmes déjà déposés.
//
// « Le poème ne s'écrit pas ici. Cet écran remplace les lignes nommées par la liste des
// poèmes déjà déposés — numéro et titre, lus dans l'index encodé. Une ligne, un tap, le
// lien est fabriqué » (docs/parcours.md#d2p--quel-poème).
//
// **C'est le seul écran de l'atelier qui demande le réseau.** L'index est un fichier du
// dépôt, comme les poèmes eux-mêmes : il est encodé, donc rien ne se lit dans le dépôt, pas
// même une table des matières (docs/donnees.md#lindex).
//
// La liste reprend la grammaire du sommaire de C1 et de D5 — le numéro et le type, ce qui
// est écrit. C'est la seule grammaire de liste que le produit ait, et un poème se choisit
// comme un pli déposé se relit.

import { decoderLIndex, nomDuFichier, type Entree } from '../lib/poeme.ts'

import { PAPIERS } from './type.ts'

/** L'adresse de l'index, sous le préfixe du site — le seul endroit où il est écrit. */
const INDEX = `${import.meta.env.BASE_URL}plis/index`

function element(nom: string, classe: string, texte?: string): HTMLElement {
  const e = document.createElement(nom)
  e.className = classe
  if (texte !== undefined) e.textContent = texte
  return e
}

/** Une ligne : le numéro et le type, puis le titre. Le vocabulaire de `pli.css`, pas un autre. */
function ligne(quoi: Entree, choisir: () => void): HTMLElement {
  const item = document.createElement('li')
  const bouton = document.createElement('button')
  bouton.type = 'button'
  bouton.className = 'depose'
  bouton.addEventListener('click', choisir)

  const dedans = element('span', 'depose__texte')
  dedans.append(
    element('span', 'etiquette', `nº ${String(quoi.n).padStart(3, '0')} · ${PAPIERS.poe.nom}`),
    element('span', 'voix voix--corps', quoi.ti),
  )
  bouton.append(dedans)
  item.append(bouton)
  return item
}

/** Ce que la liste a rendu — de quoi caler mon compteur sans le deviner. */
export interface Liste {
  /** ce que l'index porte, du plus petit numéro au plus grand */
  poemes: Entree[]
  /** le réseau a lâché : ce n'est pas « aucun poème », et ça ne se dit pas pareil */
  coupe: boolean
}

/**
 * Tient l'écran. La fonction rendue **relit l'index à chaque passage** : un poème poussé
 * depuis mon bureau doit s'y trouver sans que je recharge l'atelier.
 *
 * Un index qu'on n'atteint pas et un index vide ne se disent pas de la même façon — c'est
 * la même distinction que « hors ligne ≠ introuvable » côté lecteur, et pour la même
 * raison : l'un passe, l'autre est un fait.
 */
export function tenirLesPoemes(
  ecran: HTMLElement,
  choisir: (quoi: Entree) => void,
): () => Promise<Liste> {
  const liste = ecran.querySelector<HTMLElement>('[data-poemes="liste"]')
  const rien = ecran.querySelector<HTMLElement>('[data-poemes="rien"]')
  const coupe = ecran.querySelector<HTMLElement>('[data-poemes="coupe"]')

  return async () => {
    let poemes: Entree[] = []
    let perdu = false
    try {
      const reponse = await fetch(INDEX)
      // Pas d'index du tout, c'est qu'aucun poème n'est encore parti : une liste vide, et
      // c'est un fait, pas une panne.
      if (reponse.ok) poemes = await decoderLIndex(await reponse.text())
      else if (reponse.status !== 404) perdu = true
    } catch {
      perdu = true
    }

    liste?.replaceChildren(...poemes.map((quoi) => ligne(quoi, () => choisir(quoi))))
    if (liste) liste.hidden = poemes.length === 0
    if (rien) rien.hidden = poemes.length > 0 || perdu
    if (coupe) coupe.hidden = !perdu
    return { poemes, coupe: perdu }
  }
}

/** Le nom de fichier d'une entrée — c'est lui qui fait l'adresse `#p=`. */
export function nomDe(quoi: Entree): string {
  return nomDuFichier(quoi.n, quoi.j)
}
