// La grammaire de liste de l'atelier — une seule, et elle sert deux fois.
//
// « La liste reprend la grammaire du sommaire de C1 » : le numéro et le type, ce qui est
// écrit, depuis quand (docs/parcours.md#d5--les-plis-déposés). C'est la seule grammaire de
// liste que le produit ait, et deux écrans s'en servent — D5, les plis déposés, et D2p, le
// choix d'un poème.
//
// Elle était recopiée dans les deux, et c'est exactement ce que le mémo met en garde : une
// typographie recopiée dérive au premier réglage. Les deux écrans vivent dans le MÊME
// bundle — l'atelier n'a qu'un chunk —, donc rien ne justifiait la copie : ici la contrainte
// de vague 3 du lecteur n'existe pas (docs/chargement.md#les-trois-vagues).

export function element(nom: string, classe: string, texte?: string): HTMLElement {
  const e = document.createElement(nom)
  e.className = classe
  if (texte !== undefined) e.textContent = texte
  return e
}

/** « 015 » — le numéro tel qu'il s'écrit partout, sur trois chiffres. */
export function numero(n: number): string {
  return String(n).padStart(3, '0')
}

/** Ce qu'une ligne porte : trois textes du plus froid au plus chaud, et où elle mène. */
export interface Ligne {
  /** « nº 015 · un poème » */
  etiquette: string
  /** le titre, ou la première ligne quand il n'y en a pas */
  nom: string
  /** « déposé hier » — absent sur D2p, où un poème n'a pas de date de dépôt */
  quand?: string
  choisir: () => void
}

/**
 * Une ligne de liste. Le vocabulaire de `pli.css`, jamais un jeu de classes de plus : c'est
 * ce qui garde D5, D2p et le sommaire de C1 dans la même écriture.
 */
export function ligne(quoi: Ligne): HTMLElement {
  const item = document.createElement('li')
  const bouton = document.createElement('button')
  bouton.type = 'button'
  bouton.className = 'depose'
  bouton.addEventListener('click', quoi.choisir)

  const dedans = element('span', 'depose__texte')
  dedans.append(
    element('span', 'etiquette', quoi.etiquette),
    element('span', 'voix voix--corps', quoi.nom),
  )
  if (quoi.quand) dedans.append(element('span', 'etiquette etiquette--fine', quoi.quand))

  bouton.append(dedans)
  item.append(bouton)
  return item
}
