// Le poème — la part qui se lit des deux côtés.
//
// La moulinette écrit l'index à mon bureau, l'atelier le relit sur mon téléphone : le format
// n'a donc pas le droit de vivre dans un seul des deux. Ce module ne touche ni la page, ni le
// réseau, ni le stockage — il compile sans la bibliothèque DOM, comme le codec.
//
// Deux invariants passent par ici, et ils protègent des liens déjà partis
// (docs/donnees.md#3-le-poème) :
//   · le jeton d'un numéro déjà connu se RÉUTILISE — relancer la moulinette sur un poème
//     corrigé ne change pas son lien ;
//   · l'index ne perd jamais une entrée — la moulinette ne supprime rien.

import { detendre, serrer } from './codec.ts'

/**
 * Une entrée de `public/plis/index` : le numéro, le jeton, le titre. Rien d'autre — l'index
 * peuple D2p et cale mon compteur, il ne porte pas le poème.
 */
export interface Entree {
  n: number
  /** le jeton de quatre signes, celui du nom de fichier */
  j: string
  ti: string
}

/**
 * L'alphabet du jeton. Il se décide **dans le routeur et la moulinette ensemble** : être
 * plus large que la moulinette est sans danger, l'inverse casserait un lien déjà parti.
 * `routeur.ts` accepte `[a-z0-9]+`, on tire dans le même jeu, sur quatre signes.
 */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

/** La longueur du jeton (docs/donnees.md#la-moulinette). */
const SIGNES = 4

/**
 * Le nom d'un fichier de poème, et l'adresse qu'il porte : `015-vhtq`. Le numéro est calé
 * sur trois chiffres — le routeur en accepte davantage, on n'en fabrique pas davantage.
 */
export function nomDuFichier(n: number, jeton: string): string {
  return `${String(n).padStart(3, '0')}-${jeton}`
}

/**
 * Un jeton neuf, tiré dans l'alphabet. `hasard` rend un entier dans `[0, borne[` — il est
 * passé plutôt que pris pour que le test soit une vérification, pas un pari.
 *
 * Sans le jeton, `#p=015` inviterait à essayer `014` : c'est sa seule raison d'être, et
 * c'est pourquoi je ne le tape jamais.
 */
export function fabriquerUnJeton(hasard: (borne: number) => number): string {
  let jeton = ''
  for (let i = 0; i < SIGNES; i += 1) jeton += ALPHABET[hasard(ALPHABET.length)]
  return jeton
}

/**
 * Le jeton de ce numéro : celui qu'il a déjà, sinon un neuf. C'est le premier des deux
 * invariants, et il tient en une ligne parce qu'il ne doit jamais devenir plus compliqué.
 */
export function jetonDu(n: number, index: readonly Entree[], neuf: () => string): string {
  return index.find((e) => e.n === n)?.j ?? neuf()
}

/**
 * L'index, mis à jour d'un poème. Une entrée connue se corrige — son titre peut changer —,
 * **son jeton jamais**, et aucune ne s'en va. Trié par numéro, pour que deux passages sur
 * le même dépôt écrivent le même fichier.
 */
export function rangerDansLIndex(index: readonly Entree[], entree: Entree): Entree[] {
  const connue = index.find((e) => e.n === entree.n)
  const rangee = connue ? { ...entree, j: connue.j } : entree
  return [...index.filter((e) => e.n !== entree.n), rangee].sort((a, b) => a.n - b.n)
}

/** Le plus grand numéro que l'index connaisse, pour caler mon compteur. `0` s'il est vide. */
export function dernierNumero(index: readonly Entree[]): number {
  return index.reduce((haut, e) => Math.max(haut, e.n), 0)
}

function estUneEntree(relu: unknown): relu is Entree {
  if (typeof relu !== 'object' || relu === null) return false
  const e = relu as Partial<Entree>
  return typeof e.n === 'number' && typeof e.j === 'string' && typeof e.ti === 'string'
}

/** L'index devient le fichier `public/plis/index` — encodé, comme tout ce qu'on dépose. */
export async function encoderLIndex(index: readonly Entree[]): Promise<string> {
  return serrer(JSON.stringify(index))
}

/**
 * Le fichier redevient l'index. Un index illisible rend une liste vide plutôt que de lever :
 * D2p n'aurait rien à montrer, et c'est exactement ce que ça veut dire. La moulinette, elle,
 * repartirait d'un index vide et **réattribuerait des jetons** — d'où le garde-fou qui
 * l'accompagne côté script, qui refuse plutôt que d'écraser.
 */
export async function decoderLIndex(payload: string): Promise<Entree[]> {
  try {
    const relu: unknown = JSON.parse(await detendre(payload.trim()))
    if (!Array.isArray(relu)) return []
    return relu.filter(estUneEntree)
  } catch {
    return []
  }
}

/** Ce qu'un fichier source dit de lui-même, avant son corps. */
export interface EnTete {
  n: number
  titre: string
  signe: string
}

/** Ce que la moulinette a lu dans un `.md` : l'en-tête, et les strophes. */
export interface Source {
  entete: EnTete
  strophes: string[]
}

/**
 * Les strophes d'un corps. **La ligne vide sépare deux strophes** — la convention markdown
 * du paragraphe, et aucune syntaxe à apprendre. Elles restent un tableau parce que c'est ce
 * que le pli transporte depuis toujours ; le lecteur les affiche toutes, à la suite.
 */
export function separerLesStrophes(corps: string): string[] {
  return corps
    .replace(/\r\n/g, '\n')
    .split(/\n[ \t]*\n+/)
    .map((strophe) => strophe.trim())
    .filter((strophe) => strophe !== '')
}

/**
 * Lit un `.md` à front-matter. Le format est celui de docs/donnees.md#la-source, et rien de
 * plus : quatre lignes `clé: valeur` entre deux `---`, puis le corps.
 *
 * Tout ce qui manque est un refus net, jamais une valeur inventée : un poème mal en-tête
 * doit se corriger à la source, pas se deviner ici — son numéro est une adresse publique.
 */
export function lireLaSource(texte: string): Source {
  const decoupe = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(texte.replace(/^﻿/, ''))
  if (!decoupe) throw new Error('il manque le front-matter, entre deux lignes « --- »')

  const [, entete = '', corps = ''] = decoupe
  const valeurs = new Map<string, string>()
  for (const ligne of entete.split(/\r?\n/)) {
    const paire = /^([a-zA-Zéè]+)\s*:\s*(.*)$/.exec(ligne.trim())
    if (paire) valeurs.set(paire[1] as string, (paire[2] as string).trim())
  }

  const type = valeurs.get('type')
  if (type !== 'poeme') throw new Error(`« type: poeme » attendu, lu « ${type ?? 'rien'} »`)

  const n = Number(valeurs.get('n'))
  if (!Number.isInteger(n) || n <= 0) throw new Error(`« n » doit être un numéro, lu « ${valeurs.get('n') ?? 'rien'} »`)

  const titre = valeurs.get('titre')
  if (!titre) throw new Error('« titre » manque')

  const signe = valeurs.get('signe')
  if (!signe) throw new Error('« signe » manque')

  const strophes = separerLesStrophes(corps)
  if (strophes.length === 0) throw new Error('le poème n’a pas de corps')

  return { entete: { n, titre, signe }, strophes }
}
