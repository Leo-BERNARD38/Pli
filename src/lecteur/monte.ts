// Les couches qui montent — A3 · la réponse, A4 · le mot, A5 · la fermeture.
//
// Ce sont les trois écrans qui arrivent APRÈS le geste, en glissant du bas par-dessus A2
// (`.pli__monte`, src/styles/pli.css). Ils ne servent qu'une fois le pli déplié, et rien ne
// les attend avant : le module est donc demandé en vague 3, une fois par pli.
//
// Deux chemins, selon le type — c'est le seul endroit du lecteur où le type décide encore
// quelque chose après A2 :
//
//   invitation                  → A3 · les trois mots, puis A4 · le mot
//   pensée · poème · souvenir   → A5 · la fermeture
//
// L'ordre de la réponse ne change pas (docs/partage.md#la-réponse) :
//
//   le mot tapé → noter la réponse dans son journal → A4 s'affiche → WhatsApp s'ouvre
//
// WhatsApp quitte la page, et A4 doit être là au retour. L'écriture est **synchrone** ici,
// avant de quitter : c'est l'exception assumée à docs/fluidite.md#écrire-le-journal-sans-bloquer,
// et il n'y a plus d'animation à protéger à ce moment-là.
//
// A5, elle, ne note rien : le dépliage est déjà écrit au seuil (src/lecteur/main.ts). Elle
// referme, elle ne consigne pas.

import type { Pli } from '../lib/codec.ts'

// Ces deux-là existent aussi dans a2.ts, et c'est **voulu**. Les importer de là ferait de
// ce module un chunk qui dépend du chunk d'entrée — lequel est inliné dans le document,
// puis supprimé : la vague 3 tomberait au moment du geste, sans un mot. Vingt lignes
// recopiées coûtent moins que le partage (docs/chargement.md#les-trois-vagues), et le
// greffon `pli-inliner-le-document` refuse désormais le build qui le referait.
//
// C'est la même raison qui garde les trois écrans dans UN seul module au lieu de deux : la
// réponse et la fermeture ne partent jamais ensemble — un pli a un type —, et deux fichiers
// se partageraient ces vingt lignes en un troisième chunk, donc une requête de plus au
// moment du geste. Un module, un import dynamique, quel que soit le type.

function element(nom: string, classe: string, texte?: string): HTMLElement {
  const e = document.createElement(nom)
  e.className = classe
  if (texte !== undefined) e.textContent = texte
  return e
}

/** La flèche du produit — un `<use>` vers le tracé déjà dans le document, zéro requête. */
function fleche(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'fleche carmin')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttribute('href', '#fleche-haut')
  svg.append(use)
  return svg
}

/** Ce qu'un mot porte : ce qu'elle tape, ce qui est noté, ce qui part dans la conversation. */
interface Mot {
  /** noté au journal et peint en 78px sur A4 */
  mot: string
  /** ce qu'elle lit sur A3 */
  etiquette: string
  /** le message déjà écrit, tel que docs/donnees.md#6-la-réponse-whatsapp le fixe */
  message: string
}

// Le cœur est la seule exception à « pas d'emoji », et elle est nommée
// (docs/design-system.md#ton-et-vocabulaire).
const MOTS: readonly Mot[] = [
  { mot: 'Oui', etiquette: 'oui, j’y serai', message: 'Oui, j’y serai ❤️' }, // lexique-ok
  { mot: 'Peut-être', etiquette: 'peut-être', message: 'Peut-être…' },
  { mot: 'Non', etiquette: 'je ne peux pas', message: 'Je ne peux pas' },
]

/** Ce dont la fermeture a besoin : le cadre où monter, la couche qu'elle recouvre, et le
 * nom du type — « une pensée », « un poème », « un souvenir ». */
export interface Fermeture {
  cadre: HTMLElement
  dessous: HTMLElement | null
  /** l'étiquette du type, celle de la tête d'A2 (src/lecteur/a1.ts) */
  etiquette: string
}

/** Ce dont la réponse a besoin pour vivre. Le retour de WhatsApp par rechargement ne passe
 * plus par ici : il retombe sur C2, le pli relu et le mot rappelé
 * (docs/partage.md#le-retour). */
export interface Attaches {
  /** Le cadre du pli : les deux couches qui montent s'y ajoutent. */
  cadre: HTMLElement
  /** La couche d'A2, où vit « répondre ». */
  dessous: HTMLElement | null
  pli: Pli
  /** Noter le mot au journal, **avant** de quitter la page. */
  noter: (mot: string) => void
}

/**
 * Le lien de la réponse. Un vrai `href`, jamais un `location.href` en JavaScript : il ouvre
 * l'application plus fiablement, il est atteignable au clavier, et c'est le navigateur qui
 * gère la sortie (docs/partage.md#la-réponse).
 *
 * Sans `w`, on bascule sur le sélecteur de contact — un tap de plus, et le seul repli
 * possible : le numéro ne vit que dans le tiroir et dans un lien déjà envoyé.
 */
function adresse(w: string | undefined, message: string): string {
  const texte = encodeURIComponent(message)
  return w ? `https://wa.me/${w}?text=${texte}` : `whatsapp://send?text=${texte}`
}

/**
 * Une couche qui monte. `data-glisse` dit au geste qu'elle se tire au doigt : A3 et A5 le
 * portent, A4 non — on ne défait pas une réponse en la rabattant (src/lecteur/geste.ts).
 */
function couche(id: string, classes: string, glisse = true): HTMLElement {
  const e = element('section', classes)
  e.id = id
  if (glisse) e.dataset.glisse = ''
  // Posée hors du champ, elle reste dans l'ordre de tabulation : trois liens se ramassent
  // au clavier depuis A2 sans que rien ne se voie. `inert` les en sort.
  e.inert = true
  return e
}

/**
 * La tête d'une couche qui monte — et **sa marque est un chemin**, comme partout ailleurs
 * dans le lecteur (docs/parcours.md#a2--la-découverte).
 *
 * Elle ne l'était pas, et A3 était le seul écran du produit sans aucune sortie : trois liens
 * qui partent dans WhatsApp, et rien pour qui a ouvert « répondre » sans vouloir répondre.
 *
 * L'`<a>` s'écrit ici plutôt que par `chemin()` de plis.ts : importer ce module ferait de
 * celui-ci un chunk qui dépend du chunk d'entrée — voir plus haut.
 */
function tete(etiquette: string): HTMLElement {
  const e = element('header', 'tete')
  const marque = document.createElement('a')
  marque.className = 'marque'
  marque.href = '#/'
  marque.textContent = 'Pli'
  e.append(marque, element('p', 'etiquette carmin', etiquette))
  return e
}

/** L'action qui mène au journal — « tes plis ↑ », d'A4 comme d'A5. Un vrai `href` : c'est le
 * navigateur qui gère le chemin. */
function versLesPlis(): HTMLElement {
  const vers = document.createElement('a')
  vers.className = 'action'
  vers.href = '#/'
  vers.append(element('span', 'etiquette etiquette--forte', 'tes plis'), fleche())
  return vers
}

/**
 * Faire monter une couche — la même discipline que le dépliage, et pour la même raison.
 *
 * `will-change` se pose AVANT le glissement et se retire à la fin : c'est ce que `geste.ts`
 * fait au `pointerdown` et au `transitionend`, et le laisser en permanence garderait la
 * couche promue pour rien (docs/fluidite.md#ce-qui-a-le-droit-de-bouger). Compter sur la
 * promotion implicite du navigateur à la première image, c'est accepter de la payer pendant
 * cette image-là. La montée dure `--ouvre`, comme le dépliage.
 */
function monter(quoi: HTMLElement): void {
  quoi.inert = false
  quoi.style.willChange = 'transform'
  quoi.addEventListener(
    'transitionend',
    () => {
      quoi.style.willChange = ''
    },
    { once: true },
  )
  quoi.dataset.posee = ''
}

/** Ce qui passe dessous sort du clavier en même temps qu'il sort de la vue. */
function couvrir(quoi: HTMLElement | null): void {
  if (quoi) quoi.inert = true
}

/** L'unique action d'A2 : c'est elle qui fait monter la couche suivante, quel que soit le
 * type (src/lecteur/a2.ts). */
function brancher(dessous: HTMLElement | null, quoi: () => void): void {
  dessous?.querySelector<HTMLElement>('button.action')?.addEventListener('click', quoi)
}

/**
 * Construit A3 et A4, et branche le chemin de la réponse. À appeler **après le geste** :
 * elles ne servent qu'une fois le pli déplié, et rien ne les attend avant.
 */
export function armerLaReponse(a: Attaches): void {
  // A3 · la réponse. Le titre de la maquette reste ; la voix, elle, était fausse — « elle
  // le saura tout de suite » promettait une remontée automatique qui n'existe pas
  // (docs/integration.md#corrections-de-contenu-dans-les-maquettes).
  const a3 = couche('a3', 'pli__monte pli--encre')
  const corps3 = element('div', 'corps corps--reparti')
  const haut3 = element('div', 'groupe')
  haut3.append(
    element('h1', 'titre', 'Tu réponds'),
    element(
      'p',
      'voix voix--corps',
      'Le mot s’écrit tout seul. C’est toi qui l’envoies.',
    ),
  )

  const trois = element('div', 'oui')
  for (const m of MOTS) {
    const lien = document.createElement('a')
    lien.href = adresse(a.pli.w, m.message)
    lien.append(element('span', 'etiquette', m.etiquette), fleche())
    lien.addEventListener('click', () => {
      // L'ordre, et il ne change pas : noter, puis A4, puis la sortie — que le navigateur
      // fait tout seul en suivant le lien, une fois cet écouteur revenu.
      a.noter(m.mot)
      montrerLeMot(m.mot)
    })
    trois.append(lien)
  }

  corps3.append(
    haut3,
    trois,
    element(
      'p',
      'etiquette etiquette--fine',
      'un mot suffit · le reste, tu l’écriras toi-même',
    ),
  )
  a3.append(tete('la réponse'), corps3)

  // A4 · le mot. Elle affiche ce qu'elle a choisi et **n'affirme rien de plus** : rien ne
  // garantit qu'elle a appuyé sur envoyer dans WhatsApp (docs/parcours.md#a4--le-mot).
  const a4 = couche('a4', 'pli__monte pli__monte--mot pli--carmin', false)
  const corps4 = element('div', 'corps corps--reparti')
  const haut4 = element('div', 'groupe')
  const leMot = element('h1', 'titre titre--geant')
  haut4.append(leMot, element('p', 'voix voix--corps', 'Il se referme derrière toi.'))

  // « tes plis ↑ », et non « écrire à ton tour » comme la maquette. Le relais existe
  // pourtant depuis le 19/08/2026 — mais il passe par la liste, un tap plus loin : c'est
  // là qu'est la ligne vers l'atelier, et A4 n'a qu'une action
  // (docs/integration.md, docs/parcours.md#le-journal).
  corps4.append(haut4, versLesPlis())
  a4.append(tete('ton mot'), corps4)

  a.cadre.append(a3, a4)

  function montrerLeMot(mot: string): void {
    leMot.textContent = mot
    couvrir(a3)
    // A3 cesse de se tirer au doigt : rabattre A4 la redécouvrirait, et elle laisserait
    // répondre une seconde fois. Le mot est dit, il ne se reprend pas.
    delete a3.dataset.glisse
    monter(a4)
  }

  brancher(a.dessous, () => {
    couvrir(a.dessous)
    monter(a3)
  })
}

/**
 * A5 · la fermeture — la pensée, le poème et le souvenir, et eux seuls.
 *
 * Ces trois-là n'appellent pas de réponse, et le produit les laissait sans rien en bas : la
 * marque en haut à gauche était la seule sortie, discrète au point d'être invisible. La
 * maquette, elle, dessinait bien un pied de page — « tes plis ↑ » sous un filet, sur B1, B3
 * et B4 (design/canevas/) —, et l'écart n'avait jamais été relevé.
 *
 * On lui donne un écran plutôt qu'un pied : celui d'A4, au mot près de composition. Le pli
 * s'est ouvert en montant, il se referme du même mouvement — `.pli__monte` glisse du bas
 * avec la même `--ouvre` que le dépliage, et il n'y a pas une ligne de style à écrire.
 *
 * Elle ne note rien et ne referme rien pour de bon : le dépliage est déjà au journal depuis
 * le seuil, et le pli reste relisible. C'est un écran de sortie, pas un état de plus.
 */
export function armerLaFermeture(a: Fermeture): void {
  const a5 = couche('a5', 'pli__monte pli--carmin')
  const corps = element('div', 'corps corps--reparti')
  const haut = element('div', 'groupe')
  haut.append(
    // 56px, la taille de base du titre — et NON les 78px d'A4. Mesuré : « REFERMÉ » demande
    // 368px à 78px pour une colonne qui en fait 308 à 360 de large, et il sortait de l'écran
    // par la droite. Le mot d'A4 est court par construction — « Oui », « Non » —, celui-ci
    // ne l'est pas (docs/design-system.md#les-mains).
    element('h1', 'titre', 'refermé'),
    element('p', 'voix voix--corps', 'Il est à toi maintenant.'),
  )
  corps.append(haut, versLesPlis())
  // L'étiquette de la tête est CELLE DU TYPE, comme sur C3 : elle continue A2 au lieu de
  // répéter le titre en petit — la tête écrivait « refermé » à dix centimètres d'un
  // « REFERMÉ » de 56px. Sur carmin, `.carmin` se repeint en crème (pli.css).
  a5.append(tete(a.etiquette), corps)
  a.cadre.append(a5)

  brancher(a.dessous, () => {
    couvrir(a.dessous)
    monter(a5)
  })
}
