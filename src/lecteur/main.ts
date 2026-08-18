// Le lecteur — ce qui s'ouvre quand elle touche le lien.
//
// Jalon 0 : le pli en dur de la page cède la place au pli du lien, sans style. A1, le
// geste, les papiers et les états C viennent aux jalons 1 et 2.

import { decoder, type Pli } from '../lib/codec.ts'
import { lire, suivre, type Route } from '../lib/routeur.ts'

// Ordre imposé par docs/chargement.md : si le hash est un #p=, le fetch part en toute
// première instruction, avant de décoder quoi que ce soit. C'est la seule requête que
// le réseau nous impose.
const premiere = lire(window.location.hash)
let dejaDemande =
  premiere.ecran === 'poeme'
    ? { nom: premiere.nom, reponse: fetch(`/plis/${premiere.nom}.txt`) }
    : null

const pliDeLaPage = document.querySelector<HTMLElement>('.pli')

function poser(selecteur: string, texte: string): void {
  const place = pliDeLaPage?.querySelector<HTMLElement>(selecteur)
  if (!place) return
  place.textContent = texte
  place.hidden = texte === ''
}

function ecrire(pli: Pli): void {
  // Le papier découle du type ; le crochet est posé dès maintenant, les papiers viennent
  // au jalon 1 (docs/design-system.md#les-cinq-règles).
  if (pliDeLaPage) {
    pliDeLaPage.dataset.type = pli.t
    pliDeLaPage.hidden = false
  }

  poser('.cachet', `nº ${String(pli.n).padStart(3, '0')}`)
  poser('.titre', pli.ti)
  poser('.griffe', pli.g ?? '')
  poser('.etiquette--fine', `déposé par ${pli.s}`)

  const voix = pliDeLaPage?.querySelector<HTMLElement>('.voix')
  if (voix) {
    const strophes = Array.isArray(pli.b) ? pli.b : [pli.b]
    voix.replaceChildren(
      ...strophes.map((strophe) => {
        const ligne = document.createElement('p')
        ligne.textContent = strophe
        return ligne
      }),
    )
  }

  const faits = pliDeLaPage?.querySelector<HTMLElement>('.faits')
  if (faits) {
    // Jusqu'à trois faits — au-delà, c'est un autre type de pli.
    faits.replaceChildren(
      ...(pli.f ?? []).slice(0, 3).map((fait) => {
        const ligne = document.createElement('li')
        ligne.textContent = fait
        return ligne
      }),
    )
    faits.hidden = !pli.f?.length
  }
}

/**
 * Le fichier d'un poème : celui demandé en première instruction si c'est bien le sien,
 * sinon un nouveau. La demande ne sert qu'une fois.
 */
function chercher(nom: string): Promise<Response> {
  const demande = dejaDemande
  dejaDemande = null
  if (demande?.nom === nom) return demande.reponse
  // Une demande qu'on abandonne ne doit pas laisser un échec sans personne pour l'entendre.
  demande?.reponse.catch(() => {})
  return fetch(`/plis/${nom}.txt`)
}

async function deplier(route: Route): Promise<void> {
  if (route.ecran === 'pli') {
    ecrire(await decoder(route.payload))
    return
  }

  if (route.ecran === 'poeme') {
    const reponse = await chercher(route.nom)
    if (!reponse.ok) throw new Error('lien abîmé')
    ecrire(await decoder((await reponse.text()).trim()))
    return
  }

  // Le journal, l'ajout à l'écran d'accueil et l'inconnu n'ont pas encore d'écran
  // (jalons 2 et 4) : la page garde le pli en dur.
}

/**
 * Un pli qui ne se décode pas laisse la page nue plutôt qu'un pli qui n'est pas le sien.
 * On masque, on ne vide pas : le balisage reste en place pour le lien suivant, qui peut
 * arriver sans rechargement. C4 · lien abîmé, avec ses mots, arrive au jalon 2
 * (docs/parcours.md#les-états).
 */
function laisserNue(): void {
  if (pliDeLaPage) pliDeLaPage.hidden = true
}

suivre((route) => {
  deplier(route).catch(laisserNue)
})
