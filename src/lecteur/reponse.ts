// A3 · la réponse et A4 · le mot — l'invitation, et elle seule.
//
// Une pensée et un souvenir s'ouvrent et se referment sans réponse : c'est le produit, pas
// un manque (docs/roadmap.md#jalon-3--la-boucle). Ce module n'est donc demandé que pour un
// `inv`, et seulement une fois le pli déplié — un pli sur quatre, après le geste.
//
// L'ordre ne change pas (docs/partage.md#la-réponse) :
//
//   le mot tapé → noter la réponse dans son journal → A4 s'affiche → WhatsApp s'ouvre
//
// WhatsApp quitte la page, et A4 doit être là au retour. L'écriture est **synchrone** ici,
// avant de quitter : c'est l'exception assumée à docs/fluidite.md#écrire-le-journal-sans-bloquer,
// et il n'y a plus d'animation à protéger à ce moment-là.

import type { Pli } from '../lib/codec.ts'

// Ces deux-là existent aussi dans a2.ts, et c'est **voulu**. Les importer de là ferait de
// ce module un chunk qui dépend du chunk d'entrée — lequel est inliné dans le document,
// puis supprimé : la vague 3 tomberait au moment du geste, sans un mot. Vingt lignes
// recopiées coûtent moins que le partage (docs/chargement.md#les-trois-vagues), et le
// greffon `pli-inliner-le-document` refuse désormais le build qui le referait.

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

function couche(id: string, classes: string): HTMLElement {
  const e = element('section', classes)
  e.id = id
  // Posée hors du champ, elle reste dans l'ordre de tabulation : trois liens se ramassent
  // au clavier depuis A2 sans que rien ne se voie. `inert` les en sort.
  e.inert = true
  return e
}

function tete(etiquette: string): HTMLElement {
  const e = element('header', 'tete')
  e.append(element('p', 'marque', 'Pli'), element('p', 'etiquette carmin', etiquette))
  return e
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
  const a4 = couche('a4', 'pli__monte pli__monte--mot pli--carmin')
  const corps4 = element('div', 'corps corps--reparti')
  const haut4 = element('div', 'groupe')
  const leMot = element('h1', 'titre titre--geant')
  haut4.append(leMot, element('p', 'voix voix--corps', 'Il se referme derrière toi.'))

  // « tes plis ↑ », et non « écrire à ton tour » : elle n'a pas d'atelier, le relais
  // n'existe pas dans un produit à deux (docs/integration.md). Elle mène au journal
  // depuis le jalon 5 — un vrai `href`, comme les trois mots d'A3.
  const vers = document.createElement('a')
  vers.className = 'action'
  vers.href = '#/'
  vers.append(element('span', 'etiquette etiquette--forte', 'tes plis'), fleche())
  corps4.append(haut4, vers)
  a4.append(tete('ton mot'), corps4)

  a.cadre.append(a3, a4)

  function monter(quoi: HTMLElement): void {
    quoi.inert = false
    quoi.dataset.posee = ''
  }

  /** Ce qui passe dessous sort du clavier en même temps qu'il sort de la vue. */
  function couvrir(quoi: HTMLElement | null): void {
    if (quoi) quoi.inert = true
  }

  function montrerLeMot(mot: string): void {
    leMot.textContent = mot
    couvrir(a3)
    monter(a4)
  }

  a.dessous?.querySelector<HTMLElement>('button.action')?.addEventListener('click', () => {
    couvrir(a.dessous)
    monter(a3)
  })
}
