// D2 · les textes — les lignes nommées, et l'aperçu qui se remplit pendant la frappe.
//
// « Voici la page telle qu'elle la recevra. Tu remplis, elle se remplit »
// (docs/parcours.md#d2--les-textes). L'aperçu est un vrai pli 360 × 780 réduit par
// `transform: scale()`, jamais un dessin séparé — c'est l'idiome du produit.
//
// Le compteur porte sur ce que **le papier** peut porter, mesuré dans un vrai pli déplié
// (docs/donnees.md#ce-que-le-papier-peut-porter). Il ne dit rien de la longueur du LIEN,
// qui est une des quatre mesures ouvertes et se fait sur les deux téléphones : l'une est la
// place sur le papier, l'autre ce qu'une conversation transporte.

import type { Pli, Type } from '../lib/codec.ts'
import { reglages } from '../lib/tiroir.ts'

import { PAPIERS } from './type.ts'

/** Ce que les lignes disent, avant que ça devienne un pli. */
export interface Textes {
  ti: string
  b: string
  quand: string
  ou: string
  s: string
}

/** Les lignes de l'écran, et l'aperçu. */
interface Pieces {
  ti: HTMLInputElement
  b: HTMLTextAreaElement
  quand: HTMLInputElement
  ou: HTMLInputElement
  s: HTMLInputElement
  action: HTMLButtonElement
}

function pieces(ecran: HTMLElement): Pieces | null {
  const ti = ecran.querySelector<HTMLInputElement>('#ti')
  const b = ecran.querySelector<HTMLTextAreaElement>('#b')
  const quand = ecran.querySelector<HTMLInputElement>('#quand')
  const ou = ecran.querySelector<HTMLInputElement>('#ou')
  const s = ecran.querySelector<HTMLInputElement>('#signe')
  const action = ecran.querySelector<HTMLButtonElement>('.bouton')
  return ti && b && quand && ou && s && action ? { ti, b, quand, ou, s, action } : null
}

/**
 * La ligne du mot suit ce qu'on y écrit.
 *
 * Elle vaut 64px et `resize: none` : à 288 signes il en faut 162, et le texte défilait donc
 * DANS la boîte — on écrivait un souvenir par une fenêtre de deux lignes, sans voir ce qu'on
 * venait de taper. Le plafond du papier, lui, va jusqu'à 312 signes.
 *
 * `height: auto` d'abord, sinon `scrollHeight` rend la hauteur qu'on lui a déjà imposée et
 * la boîte ne redescend jamais quand on efface. Deux écritures de style et une lecture de
 * géométrie, sur un écran qui n'a aucun budget de temps
 * (docs/chargement.md#le-budget-écran-par-écran) — le geste, lui, est à l'autre bout du
 * produit.
 */
function suivreLeTexte(mot: HTMLTextAreaElement): void {
  mot.style.height = 'auto'
  mot.style.height = `${mot.scrollHeight}px`
}

/** Ce qui reste, ligne par ligne — négatif quand ça déborde. */
function poser(reste: Element | null, plafond: number | null, texte: string): boolean {
  if (!reste || plafond === null) return false
  const restant = plafond - [...texte].length
  reste.textContent = `${restant} signes`
  reste.setAttribute('data-trop', restant < 0 ? '1' : '0')
  return restant < 0
}

/**
 * Le pli tel qu'il voyagera. `n` et `w` viennent du tiroir, pas des lignes : le numéro de
 * réponse ne se retape pas, et le numéro du cachet se compte tout seul.
 *
 * Les clés absentes sont omises, jamais mises à `null` (docs/donnees.md#1-le-pli).
 */
export function fabriquer(quel: Type, textes: Textes, n: number): Pli {
  const papier = PAPIERS[quel]
  const faits = [textes.quand, textes.ou].map((f) => f.trim()).filter(Boolean)
  const pli: Pli = {
    v: 1,
    t: quel,
    n,
    ti: papier.titre === null ? '' : textes.ti.trim(),
    b: textes.b.trim(),
    s: textes.s.trim(),
  }
  if (papier.faits && faits.length) pli.f = faits
  if (quel === 'inv') {
    const w = reglages().w
    if (w) pli.w = w
  }
  return pli
}

/**
 * Tient les lignes et l'aperçu. Rend de quoi rejouer l'écran quand le type change, et de
 * quoi lire ce qui y est écrit.
 */
export function tenirLesTextes(
  ecran: HTMLElement,
  apercu: (quel: Type, textes: Textes) => void,
): { poser(quel: Type): void; lire(): Textes } {
  const p = pieces(ecran)
  if (!p) return { poser: () => {}, lire: () => ({ ti: '', b: '', quand: '', ou: '', s: '' }) }

  const question = ecran.querySelector('.question')
  const resteTi = ecran.querySelector('#reste-ti')
  const resteB = ecran.querySelector('#reste-b')
  let quel: Type = 'inv'

  const lire = (): Textes => ({
    ti: p.ti.value,
    b: p.b.value,
    quand: p.quand.value,
    ou: p.ou.value,
    s: p.s.value,
  })

  const relire = (): void => {
    const papier = PAPIERS[quel]
    const textes = lire()
    const tropTi = poser(resteTi, papier.titre, textes.ti)
    const tropB = poser(resteB, papier.voix, textes.b)
    suivreLeTexte(p.b)
    // Le bouton reste inactif tant que le texte principal est vide
    // (docs/parcours.md#d2--les-textes) — et tant que le papier déborde.
    p.action.disabled = textes.b.trim() === '' || tropTi || tropB
    apercu(quel, textes)
  }

  for (const ligne of [p.ti, p.b, p.quand, p.ou, p.s]) {
    ligne.addEventListener('input', relire)
  }

  return {
    poser(nouveau: Type) {
      quel = nouveau
      const papier = PAPIERS[nouveau]
      if (question) question.textContent = papier.question
      // Une pensée ne montre pas de titre, et seule l'invitation porte des faits :
      // les lignes qui n'existent pas pour ce type s'en vont, elles ne se grisent pas.
      for (const ligne of ecran.querySelectorAll<HTMLElement>('[data-si]')) {
        const si = ligne.dataset['si']
        const vu = si === 'titre' ? papier.titre !== null : si === 'faits' ? papier.faits : true
        ligne.hidden = !vu
        ligne.inert = !vu
      }
      // La signature est déjà dans le tiroir : elle s'écrit seule, et se corrige ici.
      if (p.s.value === '') p.s.value = reglages().s
      relire()
    },
    lire,
  }
}
