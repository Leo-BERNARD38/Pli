// La vague 3 — pendant qu'elle regarde le volet.
//
// Elle a le texte, elle a le volet qui invite, elle n'a encore rien touché. Cette seconde-là
// paie tout le reste du parcours (docs/chargement.md#vague-3--pendant-quelle-regarde-le-volet).
//
// Trois règles, et elles se voient dans le code :
//   · jamais avant que A1 soit peint ;
//   · jamais d'un bloc — une ressource à la fois, la texture en premier ;
//   · tout est fini AVANT le premier pointerdown. Le geste déplace ce qui est prêt, il ne
//     fabrique rien (docs/fluidite.md#la-file-dattente-principale).

import type { Pli, Type } from '../lib/codec.ts'
import { construire, toileDe } from './a2.ts'

// Un pli n'a qu'un type : une seule de ces quatre feuilles est jamais demandée. Elles sont
// écrites en clair, une par une — un `import()` calculé n'est pas analysable au build.
const FEUILLES: Record<Type, () => Promise<unknown>> = {
  inv: () => import('../styles/inv.css'),
  pen: () => import('../styles/pen.css'),
  poe: () => import('../styles/poe.css'),
  sou: () => import('../styles/sou.css'),
}

/** Le drapeau du rechargement de secours (docs/donnees.md — les clés portent leur version). */
const DRAPEAU = 'pli.v1.recharge'

/**
 * Un fichier empreinté qui manque, c'est presque toujours la même chose : le document a
 * jusqu'à dix minutes de retard sur le site, et l'empreinte qu'il nomme n'existe plus
 * (docs/mises-a-jour.md#2-un-rechargement-de-secours-une-seule-fois).
 *
 * Une seule fois, jamais deux : la boucle de rechargement est le seul échec inacceptable
 * ici. Le paramètre de requête est indispensable — un rechargement simple peut resservir le
 * même document depuis le cache — et **le fragment est recopié tel quel**, sinon on
 * recharge sur un journal vide au lieu du pli.
 */
function rechargerUneFois(): void {
  try {
    if (sessionStorage.getItem(DRAPEAU)) return
    sessionStorage.setItem(DRAPEAU, '1')
  } catch {
    // Navigation privée : pas de drapeau, donc pas de garantie contre la boucle. On
    // n'insiste pas — ce qui est affiché reste affiché.
    return
  }
  window.location.replace(`/?r=${Date.now()}${window.location.hash}`)
}

/** Après le premier rendu, et pas avant. */
function auRepos(): Promise<void> {
  return new Promise((suite) => {
    const poser = (): void => {
      // `in window` restreindrait `window` à `never` dans la branche du repli : on regarde
      // la fonction elle-même. Safari ne l'a que depuis 17.4 — nos deux appareils l'ont,
      // le repli reste celui que docs/chargement.md prescrit.
      const auRepos = window.requestIdleCallback
      if (typeof auRepos === 'function') auRepos.call(window, () => suite(), { timeout: 1000 })
      else window.setTimeout(suite, 0)
    }
    if (document.readyState === 'complete') poser()
    else window.addEventListener('load', poser, { once: true })
  })
}

/**
 * La peinture du type, décodée. Les 30 à 60 ms de fil principal que coûte un décodage se
 * paient ici, pendant qu'elle regarde le volet — jamais pendant le geste
 * (docs/ressources.md#ce-quune-grande-image-coûte).
 *
 * Une peinture qui n'arrive pas laisse le cadre sur son aplat : c'est le bon échec, et
 * A2 se compose quand même.
 */
async function peinture(type: Type): Promise<HTMLImageElement | null> {
  const adresse = toileDe(type)
  if (!adresse) return null
  const toile = new Image()
  toile.decoding = 'async'
  toile.src = adresse
  try {
    await toile.decode()
    return toile
  } catch {
    return null
  }
}

/**
 * Prépare A2 dans la couche du dessous. Rend la main quand elle est **construite et
 * peinte** — c'est à ce moment, et pas avant, que le geste peut s'armer.
 */
export async function preparer(dessous: HTMLElement, pli: Pli, etiquette: string): Promise<void> {
  await auRepos()

  // 1 · la texture du type, d'abord, et décodée.
  const toile = await peinture(pli.t)

  // 2 · la composition du type. C'est le seul fichier empreinté du parcours, donc le seul
  // qui puisse manquer sur un document périmé.
  try {
    await FEUILLES[pli.t]()
  } catch {
    rechargerUneFois()
    return
  }

  // 3 · Bodoni, pour que le titre d'A2 ne saute pas au moment où il s'affiche. Elle n'est
  // pas préchargée : la liste de la vague 2 est fermée, et A1 n'a pas de titre.
  try {
    await document.fonts.load('800 64px "Bodoni Moda"')
  } catch {
    // Une police qui n'arrive pas donne du texte en police de secours, rien de plus.
  }

  // 4 · le DOM d'A2, construit d'un coup, avec la peinture déjà décodée.
  construire(dessous, pli, etiquette, toile)

  // 5 · et peint : deux images, le temps que la disposition et la peinture soient faites.
  await new Promise<void>((suite) =>
    requestAnimationFrame(() => requestAnimationFrame(() => suite())),
  )
}
