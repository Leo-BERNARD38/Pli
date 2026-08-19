// D3 · le lien — identique pour les quatre types.
//
// Deux corrections à la maquette, tranchées dans docs/parcours.md#d3--le-lien :
//   · **le lien ne s'affiche pas.** Une adresse de poème tient sur une ligne, un vrai
//     payload non. La ligne de lien est remplacée par les deux actions ;
//   · « lien valable 30 jours » a disparu : il n'y a plus d'expiration.
//
// Le fragment ne quitte jamais l'appareil : c'est la garantie du produit, et c'est aussi
// pourquoi ce module fabrique l'adresse ici, en entier, sans jamais l'envoyer nulle part.

import { encoder, type Pli } from '../lib/codec.ts'
import { noterUnDepot } from '../lib/tiroir.ts'

/** L'adresse du produit. Elle se gèle au premier pli envoyé (CLAUDE.md#les-invariants). */
const ADRESSE = `https://leo-bernard38.github.io${import.meta.env.BASE_URL}`

/** Ce qu'un dépôt a produit, une fois le lien fabriqué. */
export interface Depot {
  adresse: string
  payload: string
}

/** L'adresse d'un pli, depuis son seul payload — la même règle des deux côtés. */
export function adresseDuPayload(payload: string): string {
  return `${ADRESSE}#c=${payload}`
}

/**
 * Fabrique le lien, et le note dans mon historique.
 *
 * Le dépôt est noté **avant** que je partage : ce qui part dans une conversation ne se
 * rattrape pas, et un lien fabriqué puis perdu serait un pli sans trace de mon côté.
 */
export async function deposerLePli(pli: Pli): Promise<Depot> {
  const payload = await encoder(pli)
  noterUnDepot({ n: pli.n, t: pli.t, ti: pli.ti, c: payload })
  return { adresse: adresseDuPayload(payload), payload }
}

/**
 * Tient l'écran du lien : le numéro, la longueur, et les deux actions.
 *
 * La longueur est affichée telle quelle, sans plafond : **le plafond de longueur d'un lien
 * est une des quatre mesures ouvertes** (docs/README.md#les-mesures-à-faire-avant-de-sengager),
 * et il se mesure WhatsApp → iOS → Safari, pas ici. Le chiffre est déjà utile — il ne se
 * fait juste pas encore juger.
 */
export function tenirLeLien(ecran: HTMLElement): (depot: Depot, n: number) => void {
  const envoyer = ecran.querySelector<HTMLButtonElement>('#envoyer')
  const copier = ecran.querySelector<HTMLButtonElement>('#copier')
  const numero = ecran.querySelector<HTMLElement>('[data-lien="numero"]')
  const longueur = ecran.querySelector<HTMLElement>('[data-lien="longueur"]')
  let adresse = ''

  envoyer?.addEventListener('click', () => {
    // Le partage natif, et rien d'autre : pas de repli maison sur un menu qu'on aurait
    // dessiné. Là où il n'existe pas, il reste « copier le lien », juste à côté.
    void navigator.share?.({ url: adresse }).catch(() => {
      // Un partage refermé sans choisir n'est pas un incident : il ne dit rien.
    })
  })

  copier?.addEventListener('click', () => {
    void navigator.clipboard?.writeText(adresse).then(
      () => {
        if (copier) copier.textContent = 'copié'
      },
      () => {
        // Le presse-papier peut être fermé : le lien reste dans l'historique du tiroir.
      },
    )
  })

  return (depot: Depot, n: number) => {
    adresse = depot.adresse
    if (numero) numero.textContent = `Nº ${String(n).padStart(3, '0')}`
    if (longueur) longueur.textContent = `${[...depot.adresse].length} signes`
    if (copier) copier.textContent = 'copier le lien'
    if (envoyer) envoyer.hidden = typeof navigator.share !== 'function'
  }
}
