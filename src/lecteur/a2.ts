// A2 · la découverte — ce que le pli montre une fois déplié.
//
// La composition suit le type : le papier, l'image et la présence d'une action en découlent
// (docs/parcours.md#a2--la-découverte). Ce n'est jamais un choix offert au dépôt.
//
// Ce module construit la couche du dessous, et rien d'autre. Il est appelé **pendant A1**,
// tant que le doigt n'a pas bougé : la couche du dessous existe et est peinte avant qu'un
// doigt se pose (docs/fluidite.md#la-file-dattente-principale).

import type { Pli, Type } from '../lib/codec.ts'

// Les peintures sont importées, donc empreintées par Vite. Trois seulement : le poème n'en
// a pas, et c'est délibéré — c'est le seul contenu long, le seul où lire compte plus que
// regarder (docs/design-system.md#les-trois-textures-de-type).
import drape from '../textures/drape-carmin-rose.webp'
import remous from '../textures/remous-encre-carmin.webp'
import voile from '../textures/voile-rose-touche.webp'

/** Ce que le type impose : le papier, la toile et son cadrage, l'action. */
interface Composition {
  /** Le papier. Absent = le crème du gabarit. */
  encre?: true
  toile?: {
    adresse: string
    /** `.image--haute` (bandeau 46 %) ou `.image--pleine` (la page entière). */
    forme: 'haute' | 'pleine'
    /** Le cadrage se règle une fois, jamais animé (docs/design-system.md#les-images). */
    cadrage: string
    /** Le dégradé qui la ramène au papier, ou à l'encre. Jamais une peinture nue. */
    fondu: 'papier' | 'encre'
  }
  /** L'unique action du pli, en bas. Absente pour trois types sur quatre. */
  action?: string
  /** Le corps se répartit — titre en haut, ligne en bas. Le souvenir, et lui seul. */
  reparti?: true
  /** La pensée ne montre pas de titre : sa phrase EST le pli (docs/parcours.md). */
  sansTitre?: true
}

const COMPOSITIONS: Record<Type, Composition> = {
  inv: {
    toile: { adresse: drape, forme: 'haute', cadrage: '50% 46%', fondu: 'papier' },
    action: 'répondre',
  },
  pen: {
    encre: true,
    toile: { adresse: remous, forme: 'pleine', cadrage: '50% 70%', fondu: 'encre' },
    sansTitre: true,
  },
  sou: {
    toile: { adresse: voile, forme: 'pleine', cadrage: '50% 50%', fondu: 'papier' },
    reparti: true,
  },
  // Le poème pagine, une strophe par écran, au même geste que le dépliage — c'est le
  // jalon 6 (B2 · B3). Au jalon 2 il montre sa première strophe et rien de plus : lui
  // poser « la suite ↑ » alors que rien ne suit serait un mensonge.
  poe: { encre: true },
}

/** L'adresse de la toile d'un type, pour que la vague 3 sache quoi charger avant A2. */
export function toileDe(type: Type): string | null {
  return COMPOSITIONS[type].toile?.adresse ?? null
}

function element(nom: string, classe: string, texte?: string): HTMLElement {
  const e = document.createElement(nom)
  e.className = classe
  if (texte !== undefined) e.textContent = texte
  return e
}

/**
 * La flèche du produit — un `<use>` vers le tracé déjà dans le document, zéro requête.
 * Elle porte `carmin` comme l'étiquette qu'elle accompagne : `fill: currentColor` la prend
 * de la couleur du texte, et sans ça elle sortait en encre à côté d'une action carmin.
 */
function fleche(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'fleche carmin')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('href', '#fleche-haut')
  svg.append(use)
  return svg
}

function tete(pli: Pli, etiquette: string): HTMLElement {
  const e = element('header', 'tete')
  e.append(element('p', 'marque', 'Pli'), element('p', 'etiquette', etiquette))
  return e
}

/**
 * Construit A2 dans la couche du dessous, à partir d'une peinture **déjà décodée** : un
 * décodage coûte 30 à 60 ms de fil principal, et il n'a pas le droit de les prendre pendant
 * le geste (docs/ressources.md#ce-quune-grande-image-coûte).
 */
export function construire(
  dessous: HTMLElement,
  pli: Pli,
  etiquette: string,
  peinture: HTMLImageElement | null,
): void {
  const c = COMPOSITIONS[pli.t]
  dessous.className = `pli__dessous${c.encre ? ' pli--encre' : ''}`
  // Le type se lit dans le balisage : c'est par là que sa feuille de style compose, et c'est ce qui
  // permet à une feuille par type d'exister sans que le module en sache rien.
  dessous.dataset.type = pli.t
  const morceaux: HTMLElement[] = []

  if (c.toile && peinture) {
    const image = element('div', `image image--${c.toile.forme}`)
    peinture.style.objectPosition = c.toile.cadrage
    peinture.alt = ''
    peinture.setAttribute('data-peinte', '')
    image.append(peinture)
    image.append(
      element('div', c.toile.fondu === 'encre' ? 'image__fondu image__fondu--encre' : 'image__fondu'),
    )
    // Sur un bandeau, la tête se pose DANS l'image, comme la maquette la montre ; sur une
    // page entière, l'image est une couche de fond et la tête reste dans le flux.
    if (c.toile.forme === 'haute') image.append(tete(pli, etiquette))
    morceaux.push(image)
  }

  if (!c.toile || c.toile.forme === 'pleine') morceaux.push(tete(pli, etiquette))

  const corps = element('div', `corps${c.reparti ? ' corps--reparti' : ''}`)

  // Un titre, une griffe — un seul de chaque par pli. Ils voyagent ensemble : sur un corps
  // réparti, c'est ce groupe qui monte en haut. La pensée n'en montre aucun, et son titre
  // n'est pas rendu plutôt que rendu puis masqué : masqué, il resterait dans l'arbre
  // d'accessibilité sans que rien ne le lise.
  if (!c.sansTitre) {
    const haut = document.createElement('div')
    haut.append(element('h1', 'titre', pli.ti))
    if (pli.g) haut.append(element('p', 'griffe', pli.g))
    corps.append(haut)
  }

  // La voix : ce que la personne a écrit — elle est sur les quatre types
  // (docs/donnees.md#1-le-pli). Pour un poème, la première strophe : la pagination est le
  // jalon 6. Chaque feuille de type lui donne sa taille.
  const strophes = Array.isArray(pli.b) ? pli.b : [pli.b]
  const voix = element('div', 'voix')
  voix.append(element('p', '', strophes[0] ?? ''))
  corps.append(voix)

  // Jusqu'à trois faits — au-delà, c'est un autre type de pli. Composition uniforme : une
  // ligne par fait, le premier en carmin. La hiérarchie de la maquette (trois compositions
  // distinctes, index par index) ne se devine pas dans une chaîne de texte libre.
  if (pli.f?.length) {
    const faits = element('ul', 'faits')
    for (const fait of pli.f.slice(0, 3)) faits.append(element('li', '', fait))
    corps.append(faits)
  }

  if (c.action) {
    // Elle est posée mais **muette** : A3 est le jalon 3. Recomposer le bas d'A2 dans une
    // semaine coûterait plus qu'une action qui attend.
    const action = element('div', 'action')
    action.append(element('span', 'etiquette carmin', c.action), fleche())
    corps.append(action)
  }

  morceaux.push(corps)
  dessous.replaceChildren(...morceaux)
  dessous.hidden = false
}
