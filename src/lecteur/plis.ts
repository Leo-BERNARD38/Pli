// C1 · le journal, C2 · le rappel, C3 · le pli refermé — ce qui reste quand le pli est lu.
//
// Le module du journal existe depuis le jalon 3 ; ces trois écrans sont le jalon 5. Ils
// partagent une seule idée : **l'arrivée décide d'après le journal, jamais d'après le seul
// lien** (docs/partage.md#le-retour).
//
//   une réponse déjà notée  → C2, le pli relu et le mot rappelé
//   un dépliage déjà noté   → C3, le pli refermé, qui mène au journal
//   ni l'un ni l'autre      → A1, comme avant
//
// Ce module est **statique**, et c'est délibéré : il lit le journal, les dates et le codec,
// que le module d'ouverture porte déjà. En faire une vague 3 le ferait dépendre du chunk
// d'entrée — inliné dans le document puis supprimé (docs/chargement.md#les-trois-vagues).
// Sa feuille, elle, est demandée à la volée : le premier texte ne l'attend pas.

import { decoder, type Pli } from '../lib/codec.ts'
import { depuis, relire } from '../lib/dates.ts'
import { entrees, type Entree } from '../lib/journal.ts'
import { ETIQUETTES, numero } from './a1.ts'

// La seule fois où le produit se montre lui-même : le papier froissé porte le journal vide
// (docs/design-system.md, docs/ressources.md#la-règle-de-définition).
import froisse from '../textures/papier-froisse-creme.webp'

function element(nom: string, classe: string, texte?: string): HTMLElement {
  const e = document.createElement(nom)
  e.className = classe
  if (texte !== undefined) e.textContent = texte
  return e
}

/** La flèche du produit — un `<use>` vers le tracé déjà dans le document, zéro requête. */
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

/**
 * La tête d'un écran du journal. La marque n'y est pas un chemin : on est déjà arrivée.
 * Ailleurs — A1, A2, C3, C4 — elle en est un, et c'est `chemin()` qui le pose.
 */
function tete(etiquette: string, classe = 'etiquette'): HTMLElement {
  const e = element('header', 'tete')
  e.append(element('p', 'marque', 'Pli'), element('p', classe, etiquette))
  return e
}

/**
 * La marque « Pli » mène au journal — le geste discret que le brief demandait, et il ne
 * coûte rien : elle est déjà dans le gabarit (docs/parcours.md#a2--la-découverte).
 *
 * Le `<p>` devient un `<a>` : c'est le navigateur qui gère le chemin, comme pour les trois
 * mots d'A3. Le geste laisse passer ce qui est dans un `a` (src/lecteur/geste.ts).
 */
export function chemin(ou: ParentNode): void {
  for (const marque of ou.querySelectorAll<HTMLElement>('p.marque')) {
    const lien = document.createElement('a')
    lien.className = 'marque'
    lien.href = '#/'
    lien.textContent = marque.textContent
    marque.replaceWith(lien)
  }
}

/** La feuille du journal, demandée à la volée : le premier texte ne l'attend jamais. */
let feuille: Promise<unknown> | null = null
function composer(): Promise<unknown> {
  feuille ??= import('../styles/plis.css')
  return feuille
}

/** Le titre qui nomme une entrée dans le sommaire. Une pensée n'a pas de titre : sa
 * phrase EST le pli, et c'est elle qu'on lit (docs/parcours.md#a2--la-découverte). */
function nommer(pli: Pli): string {
  const strophes = Array.isArray(pli.b) ? pli.b : [pli.b]
  return pli.ti.trim() || (strophes[0] ?? '')
}

/** « hier », « il y a trois jours », puis la date nommée. Un horodatage illisible ne dit
 * rien plutôt que d'inventer un jour. */
function quand(entree: Entree, maintenant: Date): string {
  try {
    return depuis(relire(entree.deplieLe), maintenant)
  } catch {
    return ''
  }
}

/** Une ligne du sommaire : le numéro, le type, ce qui est écrit, et depuis quand. */
function ligne(entree: Entree, pli: Pli, maintenant: Date): HTMLElement {
  const item = document.createElement('li')
  const lien = document.createElement('a')
  lien.className = 'ligne'
  lien.href = `#/relire/${entree.h}`

  const le = quand(entree, maintenant)
  const mot = entree.reponse ? ` · tu as répondu ${entree.reponse.mot.toLowerCase()}` : ''

  lien.append(
    element('span', 'etiquette', `nº ${numero(pli.n)} · ${ETIQUETTES[pli.t]}`),
    element('span', 'voix voix--corps', nommer(pli)),
    element('span', 'etiquette etiquette--fine', `${le}${mot}`),
  )
  item.append(lien)
  return item
}

/**
 * L'écran vide : le papier froissé, et une phrase qui n'attend rien.
 *
 * Il compose en CRÈME sur l'encre, comme A1 et comme la pensée. Il a longtemps composé en
 * encre sur un `.image__fondu` nu — le voile du papier, qui assombrit son premier tiers de
 * `.5` avant de revenir au crème. Du texte presque noir sur un fond assombri : c'était le
 * seul couple fond/texte du produit qu'aucune mesure ne couvrait, et il ne se lisait pas.
 *
 * Le voile est celui de `.image--pleine` : `.68`, mesuré pour tenir 4,5:1 en crème
 * (pli.css). On ne remesure pas ce qui l'est déjà, on cesse de s'en passer.
 */
function vide(): HTMLElement {
  const image = element('div', 'image image--pleine')
  const toile = new Image()
  toile.src = froisse
  toile.alt = ''
  toile.decoding = 'async'
  toile.style.objectPosition = '50% 25%'
  toile.decode().then(
    () => toile.setAttribute('data-peinte', ''),
    () => {},
  )
  image.append(toile, element('div', 'image__fondu image__fondu--encre'))
  return image
}

/**
 * C1 · le journal. Il se lit comme un sommaire de revue, pas comme un fil
 * (docs/parcours.md#le-journal). Reconstruit à chaque passage : elle en revient après
 * avoir déplié un pli, et le sommaire doit le porter.
 */
export async function journal(cadre: HTMLElement): Promise<HTMLElement> {
  await composer()
  const ecran = cadre.querySelector<HTMLElement>('#c1') ?? element('section', 'pli__dessus')
  ecran.id = 'c1'
  ecran.className = 'pli__dessus'
  if (!ecran.isConnected) cadre.append(ecran)

  const liste = entrees()
  const maintenant = new Date()
  const corps = element('div', 'corps corps--haut')

  if (liste.length === 0) {
    // La seule branche du journal qui porte une peinture, donc la seule qui compose en
    // crème. Le sommaire, lui, reste sur le papier.
    ecran.className = 'pli__dessus pli--encre'
    corps.append(
      element('h1', 'voix', 'Rien encore.'),
      element('p', 'voix voix--corps', 'Le premier pli déposé pour toi restera ici.'),
    )
    ecran.replaceChildren(vide(), tete('tes plis'), corps)
    return ecran
  }

  // Le décodage se rejoue à l'affichage : le journal range le payload, jamais l'objet —
  // une seule source de vérité (docs/donnees.md#4-son-journal). Un payload devenu
  // illisible ne fait pas disparaître le sommaire : sa ligne s'en va, les autres restent.
  const lues = await Promise.all(
    liste.map((entree) => decoder(entree.c).then((pli) => ({ entree, pli }), () => null)),
  )

  const sommaire = element('ul', 'plis')
  for (const lue of lues) {
    if (lue) sommaire.append(ligne(lue.entree, lue.pli, maintenant))
  }
  corps.append(sommaire)
  ecran.replaceChildren(tete('tes plis'), corps)
  return ecran
}

/**
 * C3 · le pli refermé. Elle rouvre un lien qu'elle a déjà déplié : le pli ne se rejoue
 * pas — il est dans ses plis, et c'est là qu'on l'envoie (docs/parcours.md#les-états).
 */
export async function refermer(cadre: HTMLElement, pli: Pli): Promise<HTMLElement> {
  await composer()
  const ecran = cadre.querySelector<HTMLElement>('#c3') ?? element('section', 'pli__dessus')
  ecran.id = 'c3'
  ecran.className = 'pli__dessus pli--encre'
  if (!ecran.isConnected) cadre.append(ecran)

  const corps = element('div', 'corps')
  const vers = document.createElement('a')
  vers.className = 'action'
  vers.href = '#/'
  vers.append(element('span', 'etiquette etiquette--forte', 'tes plis'), fleche())
  corps.append(
    element('h1', 'titre', 'déjà déplié'),
    element('p', 'voix voix--corps', 'Ce pli est dans tes plis, avec les autres.'),
    vers,
  )

  const entete = tete(ETIQUETTES[pli.t], 'etiquette carmin')
  ecran.replaceChildren(entete, corps)
  chemin(entete)
  return ecran
}

/**
 * C2 · la relecture. Le pli entier, tel qu'il s'est déplié — et pour une invitation déjà
 * répondue, le mot rappelé à la place de « répondre » : on ne répond pas deux fois.
 */
export function rappeler(dessous: HTMLElement, mot: string | null): void {
  chemin(dessous)
  const corps = dessous.querySelector('.corps')
  dessous.querySelector('button.action')?.remove()
  if (!mot || !corps) return
  corps.append(element('p', 'etiquette etiquette--fine', `tu as répondu ${mot.toLowerCase()}`))
}
