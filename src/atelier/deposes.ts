// D5 · les plis déposés — relire et renvoyer ce que j'ai déposé.
//
// Le dernier écran que la roadmap demandait à l'atelier (docs/roadmap.md#jalon-4) et le
// seul que parcours.md n'ait jamais dessiné : il n'en dit qu'une ligne, « relire et
// renvoyer ce que j'ai déposé » (docs/parcours.md#3-ce-qui-nest-pas-encore-maquetté). La
// forme reprend donc celle du sommaire de C1, chez elle — le numéro, le type, ce qui est
// écrit, depuis quand — parce que c'est la seule grammaire de liste que le produit ait.
//
// Le payload est gardé tel qu'il voyage : le lien se refabrique sans réencoder, et un pli
// renvoyé est **exactement** celui qui est parti la première fois. Rien ici ne note un
// dépôt et rien n'avance le compteur : renvoyer n'est pas déposer.

import { decoder } from '../lib/codec.ts'
import { depuis, relire } from '../lib/dates.ts'
import { deposes, type Depose } from '../lib/tiroir.ts'

import { PAPIERS } from './type.ts'

function element(nom: string, classe: string, texte?: string): HTMLElement {
  const e = document.createElement(nom)
  e.className = classe
  if (texte !== undefined) e.textContent = texte
  return e
}

/**
 * Ce qui nomme un pli dans la liste — son titre, ou sa première ligne quand il n'en a pas.
 *
 * Le décodage se rejoue à l'affichage, comme au journal : le tiroir range le payload, pas
 * l'objet. Un payload devenu illisible rend `null` — sa ligne s'en va seule, les autres
 * restent (docs/donnees.md#5-mon-historique).
 */
async function nommer(quoi: Depose): Promise<string | null> {
  try {
    const pli = await decoder(quoi.c)
    const strophes = Array.isArray(pli.b) ? pli.b : [pli.b]
    return pli.ti.trim() || (strophes[0] ?? '')
  } catch {
    return null
  }
}

/** « hier », « il y a trois jours », puis la date nommée. Un horodatage abîmé se tait. */
function quand(quoi: Depose, maintenant: Date): string {
  try {
    return depuis(relire(quoi.le), maintenant)
  } catch {
    return ''
  }
}

/** Une ligne : le numéro et le type, ce qui est écrit, et depuis quand. */
function ligne(quoi: Depose, nom: string, maintenant: Date, choisir: () => void): HTMLElement {
  const item = document.createElement('li')
  const bouton = document.createElement('button')
  bouton.type = 'button'
  bouton.className = 'depose'
  bouton.addEventListener('click', choisir)

  const dedans = element('span', 'depose__texte')
  dedans.append(
    element('span', 'depose__nom', `nº ${String(quoi.n).padStart(3, '0')} · ${PAPIERS[quoi.t].nom}`),
    element('span', 'depose__quoi', nom),
    element('span', 'depose__quand', quand(quoi, maintenant)),
  )
  bouton.append(dedans)
  item.append(bouton)
  return item
}

/**
 * Tient l'écran. La fonction rendue **reconstruit** la liste et rend le nombre de plis
 * lisibles : un pli déposé entre les deux passages doit s'y trouver, et D1 a besoin du
 * compte pour ne pas offrir un chemin vers une liste vide.
 */
export function tenirLesDeposes(
  ecran: HTMLElement,
  renvoyer: (quoi: Depose) => void,
): () => Promise<number> {
  const liste = ecran.querySelector<HTMLElement>('[data-deposes="liste"]')
  const rien = ecran.querySelector<HTMLElement>('[data-deposes="rien"]')

  return async () => {
    const gardes = deposes()
    const maintenant = new Date()
    const noms = await Promise.all(gardes.map((quoi) => nommer(quoi)))

    const lignes: HTMLElement[] = []
    for (const [rang, quoi] of gardes.entries()) {
      const nom = noms[rang]
      if (nom === null || nom === undefined) continue
      lignes.push(ligne(quoi, nom, maintenant, () => renvoyer(quoi)))
    }

    liste?.replaceChildren(...lignes)
    if (liste) liste.hidden = lignes.length === 0
    if (rien) rien.hidden = lignes.length > 0
    return lignes.length
  }
}
