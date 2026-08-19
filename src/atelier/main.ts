// L'atelier — D0 le seuil, D4 le tiroir, D1 le type, D2 les textes, D3 le lien,
// D5 les plis déposés.
//
// Le pendant de src/lecteur/main.ts, de mon côté. Rien de ce qui s'écrit ici ne peut
// atterrir dans le bundle qui part chez elle : les deux entrées sont buildées séparément
// (vite.config.ts, docs/architecture.md#deux-entrées).
//
// L'aiguillage tient dans une fonction et ne touche pas au hash : l'atelier n'est jamais
// partagé, aucune de ses adresses ne s'envoie, et un écran profond rechargé sur GitHub
// Pages tomberait en 404 (docs/architecture.md#routage). Le retour est dans la conduite,
// en haut à gauche, comme le design l'impose.

import '../styles/tokens.css'
import '../styles/pli.css'
import '../styles/depot.css'

// Les trois feuilles des types que l'atelier sait fabriquer. Elles ne sont pas là pour
// l'atelier : elles sont là pour l'APERÇU, qui porte `data-type` et se compose donc
// exactement comme elle le lira. Chargées d'emblée, sans découpe en vagues — l'atelier
// n'est jamais servi sur son téléphone et n'a aucun budget de temps
// (docs/chargement.md#le-budget-écran-par-écran).
import '../styles/inv.css'
import '../styles/pen.css'
import '../styles/sou.css'

import type { Type } from '../lib/codec.ts'
import { prochainNumero, seuilFranchi, type Depose } from '../lib/tiroir.ts'

import { poserLapercu } from './apercu.ts'
import { tenirLesDeposes } from './deposes.ts'
import { adresseDuPayload, deposerLePli, tenirLeLien, type Depot } from './lien.ts'
import { laReponseEstPossible, tenirLeTiroir } from './reglages.ts'
import { tenirLeSeuil } from './seuil.ts'
import { fabriquer, tenirLesTextes } from './textes.ts'
import { tenirLeType } from './type.ts'
import { suivreLaVue } from './vue.ts'

/** Les écrans de l'atelier, dans l'ordre où on les traverse. D5 est à part : on n'y passe
 * pas, on y va — c'est une salle, pas une étape. */
type Ecran = 'd0' | 'd4' | 'd1' | 'd2' | 'd3' | 'd5'

const ecrans = new Map<Ecran, HTMLElement>()
for (const nom of ['d0', 'd4', 'd1', 'd2', 'd3', 'd5'] as const) {
  const element = document.getElementById(nom)
  if (element) ecrans.set(nom, element)
}

const mini = document.getElementById('mini')

// Les écrans suivent la hauteur visible : c'est le seul endroit du produit où un clavier
// monte, et l'action doit rester collée en bas (docs/appareils.md).
suivreLaVue(ecrans.values())

let type: Type = 'inv'
let numero = prochainNumero()

/**
 * Montre un écran, et un seul.
 *
 * `inert` suit `hidden` : les autres écrans sont toujours dans le document, et sans lui on
 * tomberait au Tab sur la ligne d'un écran qu'on ne voit pas — la faute déjà trouvée entre
 * A1 et A2 au jalon 3. Le focus se repose sur l'écran qui arrive — sinon il reste sur un
 * élément qui vient de devenir inerte, et il n'est plus nulle part. Sur l'écran, et non sur
 * sa première ligne : au téléphone, une ligne prise de focus fait monter le clavier par
 * par-dessus l’aperçu, et l’aperçu est la moitié de D2.
 */
function montrer(quel: Ecran): void {
  for (const [nom, element] of ecrans) {
    const vu = nom === quel
    element.hidden = !vu
    element.inert = !vu
  }
  window.scrollTo(0, 0)
  const arrive = ecrans.get(quel)
  if (arrive) {
    arrive.tabIndex = -1
    arrive.focus()
  }
}

// — les écrans, chacun tenu par son module ————————————————————————————————

const textes = ecrans.get('d2')
  ? tenirLesTextes(ecrans.get('d2') as HTMLElement, (quel, ecrits) => {
      if (mini) poserLapercu(mini, quel, ecrits)
    })
  : null

const lien = ecrans.get('d3') ? tenirLeLien(ecrans.get('d3') as HTMLElement) : null

/**
 * D3 sert deux fois : à la fin d'un dépôt, et au renvoi d'un pli déjà déposé. L'écran ne
 * change pas — seule sa conduite dit d'où l'on vient, et où le retour ramène.
 */
function conduireLeLien(depuisD5: boolean): void {
  const d3 = ecrans.get('d3')
  const retour = d3?.querySelector<HTMLElement>('[data-lien="retour"]')
  const pas = d3?.querySelector<HTMLElement>('[data-lien="pas"]')
  if (retour) {
    retour.dataset['va'] = depuisD5 ? 'd5' : 'd2'
    retour.textContent = depuisD5 ? '← les plis' : '← modifier'
  }
  if (pas) pas.textContent = depuisD5 ? 'déjà déposé' : '3 sur 3'
}

/**
 * D5 · les plis déposés. Renvoyer n'est pas déposer : le lien se refabrique depuis le
 * payload gardé, sans réencoder, sans noter un dépôt et sans avancer le compteur — c'est
 * le pli qui est parti la première fois, à l'identique.
 */
const relireLesDeposes = ecrans.get('d5')
  ? tenirLesDeposes(ecrans.get('d5') as HTMLElement, (quoi: Depose) => {
      lien?.({ adresse: adresseDuPayload(quoi.c), payload: quoi.c }, quoi.n)
      conduireLeLien(true)
      montrer('d3')
    })
  : null

/** Le chemin vers D5, sur D1 : il ne s'ouvre que s'il mène quelque part. */
const passage = document.querySelector<HTMLElement>('.passage')
async function poserLePassage(): Promise<void> {
  const combien = (await relireLesDeposes?.()) ?? 0
  if (passage) passage.hidden = combien === 0
}

const relireLesTypes = ecrans.get('d1')
  ? tenirLeType(ecrans.get('d1') as HTMLElement, (quel) => {
      type = quel
    })
  : null

/**
 * Le passage à D3 : le pli se fabrique, le lien avec, et le dépôt est noté avant que je
 * partage quoi que ce soit. Le numéro est relu ici et pas plus tôt — il a pu être repris à
 * la main dans le tiroir entre-temps.
 */
async function deposer(): Promise<void> {
  if (!textes || !lien) return
  numero = prochainNumero()
  const depot: Depot = await deposerLePli(fabriquer(type, textes.lire(), numero))
  lien(depot, numero)
  conduireLeLien(false)
  montrer('d3')
}

/** La conduite : `data-va` dit où l'on va, et c'est le seul chemin entre deux écrans. */
document.addEventListener('click', (evenement) => {
  const cible = evenement.target
  if (!(cible instanceof Element)) return
  const bouton = cible.closest<HTMLElement>('[data-va]')
  const va = bouton?.dataset['va'] as Ecran | undefined
  if (!va) return

  if (va === 'd1') {
    relireLesTypes?.()
    void poserLePassage()
  }
  if (va === 'd2') textes?.poser(type)
  if (va === 'd5') {
    // La liste se relit avant que l'écran s'ouvre : le décodage est asynchrone, et D5
    // s'afficherait sinon une frame sans liste et sans son mot — le sommaire de C1 attend
    // lui aussi d'être entier avant d'entrer.
    void relireLesDeposes?.().then(() => {
      montrer('d5')
    })
    return
  }
  if (va === 'd3') {
    void deposer()
    return
  }
  montrer(va)
})

/** Le premier passage ouvre le tiroir ; ensuite, D1 est la porte, et la conduite y ramène. */
function apresLeSeuil(premier: boolean): void {
  const tiroir = ecrans.get('d4')
  if (tiroir) tenirLeTiroir(tiroir)
  // « Ouvert une fois juste après le seuil, puis seulement quand je le demande »
  // (docs/parcours.md#d4--le-tiroir). Le numéro de réponse manquant compte comme une
  // demande : sans lui, une invitation n'irait nulle part.
  if (premier || !laReponseEstPossible()) {
    montrer('d4')
    return
  }
  relireLesTypes?.()
  void poserLePassage()
  montrer('d1')
}

const porte = ecrans.get('d0')
if (porte && !seuilFranchi()) {
  montrer('d0')
  tenirLeSeuil(porte, () => {
    apresLeSeuil(true)
  })
} else {
  apresLeSeuil(false)
}
