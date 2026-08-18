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
let dejaParti = premiere.ecran === 'poeme' ? fetch(`/plis/${premiere.nom}.txt`) : null

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
  if (pliDeLaPage) pliDeLaPage.dataset.type = pli.t

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

/** Le fichier d'un poème : celui déjà demandé au premier passage, sinon un nouveau. */
function chercher(nom: string): Promise<Response> {
  const reponse = dejaParti ?? fetch(`/plis/${nom}.txt`)
  dejaParti = null
  return reponse
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

// Un pli qui ne se décode pas laisse la page nue plutôt qu'un pli qui n'est pas le sien.
// C4 · lien abîmé, avec ses mots, arrive au jalon 2 (docs/parcours.md#les-états).
suivre((route) => {
  deplier(route).catch(() => pliDeLaPage?.replaceChildren())
})
