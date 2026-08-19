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
import { deposes, viderLesDeposes, type Depose } from '../lib/tiroir.ts'

import { ligne, numero } from './liste.ts'
import { PAPIERS } from './type.ts'

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

/**
 * « déposé hier », « déposé il y a trois jours », puis la date nommée. Un horodatage abîmé
 * se tait.
 *
 * Le verbe est là pour que cette liste ne se confonde pas avec le sommaire de C1, qui porte
 * la même grammaire et se trouve désormais à un tap d'ici : chez elle une date dit quand un
 * pli s'est déplié, ici quand il est parti. Sans le mot, les deux écrans écrivent « hier »
 * au même endroit et disent deux choses différentes.
 */
function quand(quoi: Depose, maintenant: Date): string {
  try {
    return `déposé ${depuis(relire(quoi.le), maintenant)}`
  } catch {
    return ''
  }
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
  const vider = ecran.querySelector<HTMLButtonElement>('[data-vider]')

  let refaire: () => Promise<number>

  // Deux touches, et la première ne fait que prévenir : l'historique ne se rattrape pas.
  // Le mot revient à ce qu'il était dès qu'on quitte le bouton — on ne laisse pas un écran
  // armé derrière soi.
  const REPOS = 'vider l’historique'
  const PRET = 'touche encore pour vider'
  let arme = false
  const desarmer = (): void => {
    arme = false
    if (vider) vider.textContent = REPOS
  }
  vider?.addEventListener('click', () => {
    if (!arme) {
      arme = true
      vider.textContent = PRET
      return
    }
    desarmer()
    viderLesDeposes()
    void refaire()
  })
  vider?.addEventListener('blur', desarmer)

  refaire = async () => {
    const gardes = deposes()
    const maintenant = new Date()
    const noms = await Promise.all(gardes.map((quoi) => nommer(quoi)))

    const lignes: HTMLElement[] = []
    for (const [rang, quoi] of gardes.entries()) {
      const nom = noms[rang]
      if (nom === null || nom === undefined) continue
      lignes.push(
        ligne({
          etiquette: `nº ${numero(quoi.n)} · ${PAPIERS[quoi.t].nom}`,
          nom,
          quand: quand(quoi, maintenant),
          choisir: () => renvoyer(quoi),
        }),
      )
    }

    liste?.replaceChildren(...lignes)
    if (liste) liste.hidden = lignes.length === 0
    if (rien) rien.hidden = lignes.length > 0
    if (vider) vider.hidden = lignes.length === 0
    desarmer()
    return lignes.length
  }

  return () => refaire()
}
