// Le geste — la pliure suit le doigt, résiste dans le mauvais sens, et retombe si on hésite.
//
// C'est le produit : s'il accroche une seule fois, tout le reste ne rattrape rien
// (docs/fluidite.md). L'algorithme est celui de docs/design-system.md#le-mouvement, et le
// chemin autorisé celui de docs/fluidite.md#le-seul-chemin-autorisé-pendant-le-geste :
//
//   pointerdown  → UNE lecture de géométrie, capturer le pointeur, couper les transitions
//   pointermove  → mémoriser y. Rien d'autre. Aucune lecture, aucune écriture de style.
//   rAF          → écrire deux transform. Une seule fois par image.
//   pointerup    → poser la transition, laisser filer
//   transitionend→ retirer will-change
//
// Trois écarts au prototype de design/handoff/lecteur.html, chacun exigé par fluidite.md :
// les transform s'écrivent en pourcentages, la vitesse se mesure entre deux IMAGES et non
// entre deux événements, et `pointermove` est passif — `touch-action: none` a déjà fait le
// travail, et un écouteur non passif oblige le navigateur à attendre notre code.

import type { Echelle } from './plateau.ts'

/** Sous `prefers-reduced-motion`, l'ouverture tombe à 120 ms (docs/fluidite.md). */
const CALME = window.matchMedia('(prefers-reduced-motion: reduce)')
const OUVERTURE_CALME = 120

/** Les réglages du geste vivent dans tokens.css, et nulle part ailleurs. */
function reglages() {
  const racine = getComputedStyle(document.documentElement)
  const nombre = (nom: string): number => parseFloat(racine.getPropertyValue(nom))
  return {
    seuil: nombre('--seuil'),
    elan: nombre('--elan'),
    caoutchouc: nombre('--caoutchouc'),
    entree: nombre('--entree'),
    ouvre: nombre('--ouvre'),
    referme: nombre('--referme'),
  }
}

export interface Pieces {
  /** Le cadre du pli : c'est lui qui porte `touch-action: none` et capture le pointeur. */
  cadre: HTMLElement
  /** La feuille qu'on tire — A1. */
  dessus: HTMLElement
  /** La page qui attend derrière et monte de 9 % — A2. */
  dessous: HTMLElement
  /** Le mouvement décoratif du volet, mis en pause dès que le doigt touche. */
  invite: HTMLElement | null
  /** L'alternative au geste, atteignable au clavier. */
  bouton: HTMLElement | null
  /** L'échelle du plateau, à figer le temps du geste. */
  echelle: Echelle
  /**
   * Le seuil vient d'être franchi : l'entrée du journal est **décidée**, pas encore écrite.
   * C'est le moment que docs/parcours.md#le-dépliage nomme, et il tombe avant l'animation
   * (docs/fluidite.md#écrire-le-journal-sans-bloquer).
   */
  auSeuil: () => void
  /** Le pli est déplié et la transition est finie. Une seule fois. */
  auDepliage: () => void
}

/** Ce que l'appelant garde du geste : de quoi le remettre à zéro pour un autre pli. */
export interface Geste {
  refermer(): void
}

/**
 * Arme le dépliage. À n'appeler que **quand la couche du dessous est peinte** : le geste
 * déplace ce qui est prêt, il ne fabrique rien (docs/fluidite.md#la-file-dattente-principale).
 */
export function armer(p: Pieces): Geste {
  const r = reglages()
  const couches = [p.dessus, p.dessous]

  let ouvert = false
  let deplie = false
  let doigt: number | null = null

  // La seule lecture de géométrie de tout le geste, prise avant la première image. Un
  // getBoundingClientRect() entre deux écritures force un calcul de disposition et fait
  // tomber la frame — c'est la faute classique, et la seule qui compte.
  let hauteur = 0

  let y0 = 0
  let p0 = 0
  let y = 0
  let yImage = 0
  let tImage = 0
  let vitesse = 0
  let demandeImage = 0

  /**
   * Les deux seules écritures de tout le geste. En **pourcentages** : un `translate` en %
   * se rapporte à l'élément lui-même, donc plus rien ne dépend de la hauteur ici, et la
   * mise à l'échelle du plateau ne fausse rien.
   */
  function placer(course: number): void {
    p.dessus.style.transform = `translate3d(0,${-course * 100}%,0)`
    p.dessous.style.transform = `translate3d(0,${(1 - course) * r.entree * 100}%,0)`
  }

  /** La course du doigt, avec son caoutchouc : le mauvais sens ne rend qu'un dixième. */
  function course(clientY: number): number {
    const brute = p0 + (y0 - clientY) / hauteur
    if (brute < 0) return brute * r.caoutchouc
    if (brute > 1) return 1 + (brute - 1) * r.caoutchouc
    return brute
  }

  function finir(): void {
    for (const couche of couches) couche.style.willChange = ''
    p.echelle.relacher()
    // L'invite ne revient qu'une fois le pli refermé : la faire repartir pendant qu'il
    // retombe, ça se voit (docs/fluidite.md#le-mouvement-décoratif).
    if (p.invite && !ouvert) p.invite.style.animation = ''
    if (ouvert && !deplie) {
      deplie = true
      p.auDepliage()
    }
  }

  function preparer(): void {
    for (const couche of couches) {
      couche.style.transition = 'none'
      couche.style.willChange = 'transform'
    }
    // L'invite s'ARRÊTE, elle ne se met pas seulement en pause — et c'est un écart mesuré
    // à docs/fluidite.md#le-mouvement-décoratif, qui prescrit la pause.
    //
    // Mesuré à l'inspecteur, en comptant les couches composées : `animation-play-state:
    // paused` garde la couche que l'animation infinie a promue, et le cachet se fait
    // promouvoir à son tour parce qu'il la recouvre — **quatre** couches bordées pendant le
    // geste au lieu de deux. L'arrêter franchement en laisse exactement deux, et le cachet
    // redescend avec (docs/fluidite.md#les-couches-et-ce-quelles-coûtent).
    //
    // Le prix : l'invite retombe d'au plus 9px à l'instant où le doigt se pose. Elle passe
    // 62 % de son cycle à zéro, et le doigt entraîne déjà toute la feuille à ce moment-là.
    // Elle ne repart qu'une fois le pli refermé, jamais pendant qu'il retombe.
    if (p.invite) p.invite.style.animation = 'none'
  }

  function poser(vers: boolean): void {
    const duree = CALME.matches ? OUVERTURE_CALME : vers ? r.ouvre : r.referme
    for (const couche of couches) couche.style.transition = `transform ${duree}ms var(--courbe)`
    // La décision se prend ici, l'écriture attend la fin de l'animation : le fil principal
    // n'a rien à faire d'autre que déplacer deux couches jusqu'à `transitionend`.
    if (vers && !ouvert) p.auSeuil()
    ouvert = vers

    const avant = p.dessus.style.transform
    placer(vers ? 1 : 0)
    // Rien n'a bougé : aucune transition ne se déclenchera, et `will-change` resterait posé.
    // Une propriété `will-change` oubliée transforme chaque écran en couche permanente.
    if (p.dessus.style.transform === avant) finir()
  }

  /**
   * Une image : la vitesse, puis deux transform. La vitesse se mesure **entre deux images**
   * et non entre deux événements — les événements pointeur sont coalescés, leur cadence
   * n'est pas celle de l'écran, et l'élan de 0,55 px/ms a été calibré sur des images.
   */
  function aChaqueImage(t: number): void {
    if (doigt === null) return
    if (tImage) {
      const dt = t - tImage
      if (dt > 0) vitesse = (y - yImage) / dt
    }
    yImage = y
    tImage = t
    placer(course(y))
    demandeImage = requestAnimationFrame(aChaqueImage)
  }

  p.cadre.addEventListener('pointerdown', (e) => {
    // Le bouton fait son travail tout seul : le geste ne le lui prend pas.
    if (doigt !== null || (e.target as Element | null)?.closest('button')) return
    doigt = e.pointerId
    hauteur = p.cadre.getBoundingClientRect().height
    y0 = y = yImage = e.clientY
    tImage = 0
    vitesse = 0
    p0 = ouvert ? 1 : 0
    // Le doigt qui sort du cadre continue le geste.
    p.cadre.setPointerCapture(doigt)
    // La barre d'URL se rétracte au premier mouvement : sans ça, un `resize` changerait la
    // taille d'une couche qui porte l'ombre et le grain, et la re-rastériserait.
    p.echelle.figer()
    preparer()
    demandeImage = requestAnimationFrame(aChaqueImage)
  })

  // Un seul écouteur, passif, qui ne fait que mémoriser. Aucun `preventDefault` :
  // `touch-action: none` sur le cadre a déjà fait le travail.
  p.cadre.addEventListener(
    'pointermove',
    (e) => {
      if (doigt === e.pointerId) y = e.clientY
    },
    { passive: true },
  )

  function relacher(e: PointerEvent): void {
    if (doigt !== e.pointerId) return
    cancelAnimationFrame(demandeImage)
    p.cadre.releasePointerCapture(doigt)
    doigt = null
    const fin = course(e.clientY)
    // Un coup sec vers le bas referme même au-delà du seuil ; un coup sec vers le haut
    // déplie même à 10 % de course.
    poser(vitesse > r.elan ? false : vitesse < -r.elan || fin > r.seuil)
  }

  p.cadre.addEventListener('pointerup', relacher)
  p.cadre.addEventListener('pointercancel', relacher)

  // L'alternative au geste : elle pose la course à 1 directement, avec la même transition.
  // Le geste est le chemin, jamais le seul chemin (docs/parcours.md#le-dépliage).
  p.bouton?.addEventListener('click', () => {
    if (ouvert) return
    p.echelle.figer()
    preparer()
    // Deux images de battement, le temps que la couche existe avant qu'on la déplace.
    requestAnimationFrame(() => requestAnimationFrame(() => poser(true)))
  })

  p.dessus.addEventListener('transitionend', (e) => {
    if (e.target === p.dessus && e.propertyName === 'transform') finir()
  })

  placer(0)

  return {
    // Un autre lien arrive sans rechargement : le pli doit être refermé, et le prochain
    // dépliage doit compter pour un.
    refermer: () => {
      if (!ouvert) return
      deplie = false
      poser(false)
    },
  }
}
