// Le journal — ses plis, sur son téléphone, et nulle part ailleurs.
//
// C'est le seul module du dépôt qui a le droit de toucher `localStorage`
// (CLAUDE.md#les-invariants). Tout le reste passe par ces fonctions, sans exception :
// `scripts/verifie.mjs` refuse un accès direct partout ailleurs.
//
// Trois règles qui ne se rouvrent pas :
//   · le dédoublonnage se fait sur `h`, l'empreinte du payload — JAMAIS sur `n`. Deux plis
//     qui partageraient un numéro verraient sinon le second silencieusement absorbé par le
//     premier : un pli reçu, jamais archivé, sans trace (docs/donnees.md#4-son-journal) ;
//   · on stocke le payload, pas l'objet décodé — une seule source de vérité, et on rejoue
//     le décodage à l'affichage ;
//   · rien ne lève. La navigation privée, un bac plein, un journal abîmé à la main : tout
//     ça dégrade proprement, parce qu'un pli qui s'affiche vaut mieux qu'un pli archivé
//     (docs/architecture.md#le-journal-peut-être-effacé).
//
// L'écriture est SYNCHRONE, et c'est délibéré : elle se fait aussi à `pagehide`, où plus
// rien d'asynchrone n'a le temps d'aboutir (docs/fluidite.md#écrire-le-journal-sans-bloquer).
// Ce qui est asynchrone — l'empreinte — se calcule bien avant, pendant qu'elle regarde le
// volet fermé.

import { horodate } from './dates.ts'

/** La clé porte sa version, comme tout ce qui est rangé (docs/donnees.md#4-son-journal). */
const CLE = 'pli.v1.journal'

/** Le mot qu'elle a choisi, et quand. `ligne` reste vide : elle l'écrit dans WhatsApp. */
export interface Reponse {
  mot: string
  ligne: string | null
  le: string
}

/** Une entrée du journal, telle qu'elle est rangée (docs/donnees.md#4-son-journal). */
export interface Entree {
  /** l'empreinte du payload — la seule clé de dédoublonnage */
  h: string
  /** le payload lui-même : on rejoue le décodage à l'affichage */
  c: string
  deplieLe: string
  reponse?: Reponse
}

/**
 * L'empreinte d'un payload : sha-256, les huit premiers octets en hexadécimal.
 *
 * Le même primitif que le seuil de l'atelier (docs/architecture.md#le-seuil-de-latelier) —
 * aucun second algorithme d'empreinte n'entre dans le produit. Elle est **définitive** : elle
 * est écrite dans le journal, et en changer ferait réapparaître des plis déjà dépliés.
 *
 * Soixante-quatre bits pour quelques centaines d'entrées : la collision est hors d'échelle,
 * et l'entrée porte le payload entier de toute façon.
 */
export async function empreinte(payload: string): Promise<string> {
  const digeste = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload))
  return [...new Uint8Array(digeste, 0, 8)].map((o) => o.toString(16).padStart(2, '0')).join('')
}

/**
 * Le tiroir, s'il est ouvert. En navigation privée, ou stockage refusé, la simple lecture
 * de la propriété lève sur certains navigateurs — d'où le `try` autour de l'accès lui-même.
 */
function tiroir(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function estUneEntree(relu: unknown): relu is Entree {
  if (typeof relu !== 'object' || relu === null) return false
  const e = relu as Partial<Entree>
  return typeof e.h === 'string' && typeof e.c === 'string' && typeof e.deplieLe === 'string'
}

/**
 * Toutes les entrées, les plus récentes d'abord. Un journal illisible rend une liste vide
 * plutôt que de lever : on n'efface rien, on ne devine rien, et le pli du jour s'affiche
 * quand même.
 */
export function entrees(): Entree[] {
  const range = tiroir()?.getItem(CLE)
  if (!range) return []
  try {
    const relu: unknown = JSON.parse(range)
    if (!Array.isArray(relu)) return []
    return relu.filter(estUneEntree).sort((a, b) => (a.deplieLe < b.deplieLe ? 1 : -1))
  } catch {
    return []
  }
}

/** L'entrée d'un payload, ou rien. Le payload détermine l'empreinte : chercher par l'un ou
 * par l'autre revient au même, et celui-là ne coûte pas d'attente à l'arrivée. */
export function trouver(payload: string): Entree | null {
  return entrees().find((e) => e.c === payload) ?? null
}

/** Une écriture qui rate ne dit rien : le bac est plein, ou fermé. Ce qui est à l'écran y reste. */
function ranger(liste: Entree[]): void {
  try {
    tiroir()?.setItem(CLE, JSON.stringify(liste))
  } catch {
    // Rien à faire, et surtout rien à montrer : elle lit un pli.
  }
}

/**
 * Le dépliage franchi. Appelable deux fois sans dommage — la fin de la transition et
 * `pagehide` peuvent tomber toutes les deux, et le dédoublonnage sur `h` fait que la
 * seconde ne produit rien (docs/fluidite.md#écrire-le-journal-sans-bloquer).
 */
export function noterLeDepliage(h: string, c: string, quand = new Date()): void {
  const liste = entrees()
  if (liste.some((e) => e.h === h)) return
  liste.unshift({ h, c, deplieLe: horodate(quand) })
  ranger(liste)
}

/**
 * Le mot qu'elle a choisi, noté **avant** de quitter la page pour WhatsApp
 * (docs/partage.md#la-réponse). L'entrée existe déjà — A3 n'est atteignable qu'après le
 * dépliage — sauf si le bac a été vidé entre-temps : on la recrée plutôt que de perdre le mot.
 */
export function noterLaReponse(h: string, c: string, mot: string, quand = new Date()): void {
  const liste = entrees()
  const date = horodate(quand)
  const entree = liste.find((e) => e.h === h) ?? { h, c, deplieLe: date }
  if (!liste.includes(entree)) liste.unshift(entree)
  entree.reponse = { mot, ligne: null, le: date }
  ranger(liste)
}
