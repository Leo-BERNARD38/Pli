// Le lecteur — ce qu'elle trouve au bout du lien.
//
// Jalon 2 : A1 l'attente et C4 le lien abîmé. A2, le geste et le journal suivent.

// Les jetons d'abord, le gabarit ensuite : l'ordre est celui de la cascade. Les deux
// entrent dans le document au build, ils ne coûtent aucune requête
// (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).
import '../styles/tokens.css'
import '../styles/pli.css'

import { decoder, type Pli } from '../lib/codec.ts'
import { lire, suivre, type Route } from '../lib/routeur.ts'
import { tenirDansLecran } from './plateau.ts'
import { ecrire, oublierLaPeinture, ETIQUETTES } from './a1.ts'
import { preparer } from './fond.ts'
import { armer, type Geste } from './geste.ts'

// Ordre imposé par docs/chargement.md : si le hash est un #p=, le fetch part en TOUTE
// première instruction, avant qu'on décode quoi que ce soit. C'est la seule requête que le
// réseau nous impose, et c'est le seul écran d'attente du produit.
//
// Elle repart d'ici depuis que le document est inline. Au jalon 1, cinq lignes du <head> la
// lançaient : une feuille de style bloquante gelait l'exécution d'un module, et la demande
// partait 63 ms trop tard. Il n'y a plus de feuille à attendre — mesuré à 60 ms de latence,
// cinq passes alternées : 75 ms d'ici contre 77 ms depuis le <head>. L'écart a disparu avec
// sa cause, et le nom d'un poème redevient l'affaire du seul routeur.
const premiere = lire(window.location.hash)
let dejaDemande =
  premiere.ecran === 'poeme'
    ? { nom: premiere.nom, reponse: fetch(`/plis/${premiere.nom}.txt`) }
    : null

const cadre = document.querySelector<HTMLElement>('.pli')

// Le pli tient dans l'écran avant d'être peint : posée après coup, l'échelle se verrait
// changer. On mesure le plateau — c'est lui qui porte les retraits de sécurité
// (docs/appareils.md#les-réglages-de-page) — et on écrit sur le pli, son seul consommateur.
export const echelle = cadre ? tenirDansLecran(document.body, cadre) : null
const a1 = document.querySelector<HTMLElement>('#a1')
const c4 = document.querySelector<HTMLElement>('#c4')
const dessous = document.querySelector<HTMLElement>('.pli__dessous')

/**
 * Un seul écran à la fois, et jamais deux. `hidden` seul ne suffit pas : les couches sont
 * en `display: flex`, une déclaration d'auteur qui bat la feuille du navigateur — le
 * gabarit porte la règle qui va avec (docs/parcours.md#larrivée).
 */
function montrer(ecran: HTMLElement | null): void {
  if (cadre) cadre.hidden = ecran === null
  for (const autre of [a1, c4]) {
    if (autre) autre.hidden = autre !== ecran
  }
}

/**
 * Le repère du budget de chargement, posé une fois, quand le texte d'A1 est à l'écran.
 * Safari ne donne pas de LCP, et le premier rendu peint le plateau avant le texte : sans
 * cette marque, la colonne « Mesuré le » de docs/chargement.md reste vide pour toujours.
 *
 * Le **type de lien** voyage avec elle : pour un `#p=`, la marque inclut l'aller-retour
 * réseau, et sans cette précision la ligne du budget ne veut rien dire. Un lien abîmé ne
 * marque rien — la ligne mesure le temps du premier texte, pas celui d'un refus.
 */
let marquee = false
function marquer(lien: 'c' | 'p'): void {
  if (marquee) return
  marquee = true
  performance.mark('a1', { detail: { lien } })
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

/**
 * Le pli que cette route demande. Cette fonction n'écrit pas — un seul endroit écrit, plus
 * bas. Un hash qu'on ne sait pas lire est un lien abîmé : c'est exactement ce que le
 * routeur appelle « inconnu », et il n'y a rien d'autre à en dire.
 */
async function pliDe(route: Route): Promise<Pli> {
  if (route.ecran === 'pli') return decoder(route.payload)

  if (route.ecran === 'poeme') {
    const reponse = await chercher(route.nom)
    if (!reponse.ok) throw new Error('lien abîmé')
    return decoder((await reponse.text()).trim())
  }

  throw new Error('lien abîmé')
}

// Seule la dernière route écrit. Sans ce jeton, un poème lent suivi d'un lien valide
// masquerait, en arrivant en retard, un pli parfaitement décodé.
let generation = 0

// Le geste s'arme une fois : ses écouteurs vivent sur le cadre, qui ne bouge pas. Un
// second lien referme le pli au lieu d'armer une seconde fois.
let geste: Geste | null = null

/**
 * La vague 3, puis le geste. Dans cet ordre et pas dans l'autre : la couche du dessous doit
 * **exister et être peinte avant qu'un doigt se pose** — construire A2 au pointerdown
 * coûterait une disposition complète dans la fenêtre de 4 ms
 * (docs/fluidite.md#la-file-dattente-principale).
 */
async function preparerLeGeste(pli: Pli): Promise<number> {
  const mienne = generation
  if (!cadre || !a1 || !dessous || !echelle) return mienne

  geste?.refermer()
  await preparer(dessous, pli, ETIQUETTES[pli.t])
  if (mienne !== generation) return mienne

  geste ??= armer({
    cadre,
    dessus: a1,
    dessous,
    invite: a1.querySelector('.invite'),
    bouton: a1.querySelector('.deplier'),
    echelle,
    // Le pli est déplié : A1 rend sa peinture. Deux textures décodées au maximum, et A2
    // vient d'en poser une. C'est aussi ici que l'entrée du journal s'écrira, au jalon 4 —
    // après la transition, jamais pendant (docs/fluidite.md#écrire-le-journal-sans-bloquer).
    auDepliage: oublierLaPeinture,
  })
  return mienne
}

suivre((route) => {
  // Le journal et l'ajout à l'écran d'accueil n'ont pas encore d'écran : ils sont le
  // jalon 4. La page reste nue plutôt que de montrer un pli qui n'existe pas.
  if (route.ecran === 'journal' || route.ecran === 'installer') {
    montrer(null)
    return
  }

  const mienne = ++generation
  pliDe(route).then(
    (pli) => {
      if (mienne !== generation) return
      ecrire(pli)
      montrer(a1)
      marquer(route.ecran === 'poeme' ? 'p' : 'c')
      void preparerLeGeste(pli)
    },
    () => {
      if (mienne === generation) montrer(c4)
    },
  )
})
