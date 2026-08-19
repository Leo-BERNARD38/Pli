// Le tiroir — mes réglages d'atelier, sur mon téléphone, et nulle part ailleurs.
//
// Le second des deux modules qui ont le droit de toucher `localStorage`, et le seul de
// mon côté (CLAUDE.md#les-invariants). `journal.ts` garde ses plis à elle ; ce fichier
// garde ce qui n'a rien à voir avec eux — « il n'a rien à voir avec son journal et ne se
// synchronise pas » (docs/donnees.md#5-mon-historique). Les mélanger aurait posé le numéro
// de réponse dans le module que le lecteur importe.
//
// Trois règles qui ne se rouvrent pas :
//   · le numéro de réponse ne connaît que deux endroits — ce tiroir, et un lien déjà
//     envoyé. Jamais le dépôt, jamais une variable de build : tout ce qui est buildé est
//     public (docs/donnees.md#5-mon-historique) ;
//   · le seuil compare une EMPREINTE, jamais la date en clair — sinon une date
//     d'anniversaire se lit dans les sources (docs/architecture.md#le-seuil-de-latelier) ;
//   · rien ne lève. Un tiroir fermé ou abîmé rend la valeur vide, comme un tiroir neuf.
//
// Ce module touche `localStorage` : il n'est pas isomorphe, et il ne sera jamais importé
// par le lecteur.

import { horodate } from './dates.ts'
import type { Type } from './codec.ts'

/** Les quatre clés, chacune avec sa version (docs/donnees.md#5-mon-historique). */
const SEUIL = 'pli.v1.seuil'
const REGLAGES = 'pli.v1.reglages'
const COMPTEUR = 'pli.v1.compteur'
const DEPOSES = 'pli.v1.deposes'

/** Ce que le préfixe du seuil hache avec la saisie (docs/architecture.md#le-seuil-de-latelier). */
const PREFIXE = 'pli.seuil.'

/** Le tiroir : ce que je ne veux pas retaper (docs/parcours.md#d4--le-tiroir). */
export interface Reglages {
  /** le numéro de réponse — il voyage dans le lien d'une invitation */
  w: string
  /** la signature, « a. » */
  s: string
}

/** Un pli déposé, gardé pour le relire et le renvoyer. */
export interface Depose {
  n: number
  t: Type
  ti: string
  /** le payload, tel qu'il voyage : le lien se refabrique sans réencoder */
  c: string
  le: string
}

/**
 * Le tiroir du navigateur, s'il est ouvert. En navigation privée la simple lecture de la
 * propriété lève sur certains navigateurs — d'où le `try` autour de l'accès lui-même.
 */
function bac(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function lire(cle: string): unknown {
  const range = bac()?.getItem(cle)
  if (!range) return null
  try {
    return JSON.parse(range) as unknown
  } catch {
    return null
  }
}

/** Une écriture qui rate ne dit rien : le bac est plein, ou fermé. */
function ranger(cle: string, quoi: unknown): void {
  try {
    bac()?.setItem(cle, JSON.stringify(quoi))
  } catch {
    // Rien à montrer : je suis en train de composer un pli.
  }
}

/**
 * L'empreinte d'une saisie de seuil.
 *
 * Le même primitif que le journal — sha-256, et aucun second algorithme n'entre dans le
 * produit. La normalisation est **la seule tolérance offerte** : `17/08/2026`, `17-08-2026`
 * et `17082026` donnent la même empreinte, une date écrite à l'envers non
 * (docs/architecture.md#le-seuil-de-latelier).
 */
export async function empreinteDuSeuil(saisie: string): Promise<string> {
  const chiffres = saisie.replace(/\D/g, '')
  const digeste = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(PREFIXE + chiffres))
  return [...new Uint8Array(digeste)].map((o) => o.toString(16).padStart(2, '0')).join('')
}

/** Le seuil est-il franchi ? Une fois posé, l'écran ne revient plus. */
export function seuilFranchi(): boolean {
  return lire(SEUIL) === true
}

/** Le seuil vient d'être franchi. */
export function noterLeSeuil(): void {
  ranger(SEUIL, true)
}

/** Ce que le tiroir garde. Un tiroir neuf rend deux lignes vides, jamais `null`. */
export function reglages(): Reglages {
  const relu = lire(REGLAGES)
  if (typeof relu !== 'object' || relu === null) return { w: '', s: '' }
  const r = relu as Partial<Reglages>
  return { w: typeof r.w === 'string' ? r.w : '', s: typeof r.s === 'string' ? r.s : '' }
}

/** Ce qui est écrit est gardé — il n'y a rien à valider (docs/parcours.md#d4--le-tiroir). */
export function noterLesReglages(quoi: Reglages): void {
  ranger(REGLAGES, { w: quoi.w, s: quoi.s })
}

/**
 * Le prochain numéro du cachet.
 *
 * Il vit sur mon téléphone seul : un bac effacé le ramène à 1, et c'est pour ça que D4
 * l'affiche et le laisse corriger à la main (docs/roadmap.md#ce-qui-reste).
 */
export function prochainNumero(): number {
  const relu = lire(COMPTEUR)
  return typeof relu === 'number' && Number.isInteger(relu) && relu >= 0 ? relu + 1 : 1
}

/** Le prochain numéro, repris à la main le jour où le bac a été vidé. */
export function fixerLeProchainNumero(n: number): void {
  ranger(COMPTEUR, Math.max(0, Math.trunc(n) - 1))
}

/**
 * Le compteur, calé sur un numéro déjà pris ailleurs — il n'avance jamais que vers le haut.
 *
 * **Un poème écrit hors atelier consomme un numéro que le compteur ignore** : il vient d'un
 * `.md` de mon bureau, pas d'ici. Sans ce calage, deux plis finiraient par porter le nº 015
 * (docs/donnees.md#lindex). C'est l'index qui l'apporte, à l'ouverture de D2p.
 *
 * Il ne recule jamais : un index en retard sur le tiroir ne doit pas rendre un numéro déjà
 * parti dans une conversation.
 */
export function calerLeCompteur(dernierPris: number): void {
  const pris = Math.trunc(dernierPris)
  const relu = lire(COMPTEUR)
  const actuel = typeof relu === 'number' && Number.isInteger(relu) && relu >= 0 ? relu : 0
  if (pris > actuel) ranger(COMPTEUR, pris)
}

function estUnDepose(relu: unknown): relu is Depose {
  if (typeof relu !== 'object' || relu === null) return false
  const d = relu as Partial<Depose>
  return typeof d.n === 'number' && typeof d.c === 'string' && typeof d.le === 'string'
}

/**
 * Les plis déposés, les plus récents d'abord. Une liste abîmée rend une liste vide.
 *
 * Le tri rend **zéro** sur deux dates égales, et ce n'est pas de la politesse : un
 * comparateur qui n'en rend jamais est incohérent, et l'ordre de deux plis déposés dans la
 * même minute devient celui du hasard. Zéro, plus un tri stable, garde l'ordre d'écriture —
 * le dernier rangé est le premier lu.
 */
export function deposes(): Depose[] {
  const relu = lire(DEPOSES)
  if (!Array.isArray(relu)) return []
  return relu.filter(estUnDepose).sort((a, b) => (a.le < b.le ? 1 : a.le > b.le ? -1 : 0))
}

/**
 * Un pli vient d'être déposé : il entre dans l'historique et il avance le compteur.
 *
 * Le dédoublonnage se fait sur le payload, jamais sur le numéro — deux plis qui
 * partageraient un numéro verraient sinon le second absorbé par le premier, la même faute
 * que le journal évite sur `h` (docs/donnees.md#4-son-journal).
 */
export function noterUnDepot(quoi: Omit<Depose, 'le'>, quand = new Date()): void {
  const liste = deposes().filter((d) => d.c !== quoi.c)
  liste.unshift({ ...quoi, le: horodate(quand) })
  ranger(DEPOSES, liste)
  const relu = lire(COMPTEUR)
  const dernier = typeof relu === 'number' && Number.isInteger(relu) ? relu : 0
  if (quoi.n > dernier) ranger(COMPTEUR, quoi.n)
}
