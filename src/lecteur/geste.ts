// Le geste — la pliure suit le doigt, résiste dans le mauvais sens, et retombe si on hésite.
//
// C'est le produit : s'il accroche une seule fois, tout le reste ne rattrape rien
// (docs/fluidite.md). L'algorithme est celui de docs/design-system.md#le-mouvement, et le
// chemin autorisé celui de docs/fluidite.md#le-seul-chemin-autorisé-pendant-le-geste :
//
//   pointerdown  → couper une transition en vol, et rien d'autre : le sens n'est pas connu
//   pointermove  → mémoriser y ; UNE fois par geste, choisir la piste et partir
//   partir       → UNE lecture de géométrie, capturer le pointeur, couper les transitions
//   rAF          → écrire les transform. Une seule fois par image.
//   pointerup    → poser la transition, laisser filer
//   transitionend→ retirer will-change
//
// Trois écarts au prototype de design/handoff/lecteur.html, chacun exigé par fluidite.md :
// les transform s'écrivent en pourcentages, la vitesse se mesure entre deux IMAGES et non
// entre deux événements, et `pointermove` est passif — `touch-action: none` a déjà fait le
// travail, et un écouteur non passif oblige le navigateur à attendre notre code.
//
// ── DEUX PISTES, UN SEUL DOIGT ─────────────────────────────────────────────────────────
//
// Le doigt monte, le doigt descend, et le sens dit ce qu'il fait. C'est la convention de
// tous les téléphones, et le produit la dessinait déjà : **chaque action porte une flèche
// vers le haut** (docs/parcours.md#le-dépliage).
//
//   vers le haut  →  l'action de l'écran   : A1 se déplie · A2 fait monter A3 ou A5
//   vers le bas   →  on revient d'un cran  : A3 et A5 redescendent · A2 se referme en A1
//
// Deux pistes, donc, et **un seul propriétaire du pointeur** : deux écouteurs sur le même
// cadre se voleraient le doigt. La piste ne se choisit pas au `pointerdown` — le sens n'est
// pas encore connu — mais au premier mouvement franc. Jusque-là, on n'a rien capturé, rien
// préparé, rien promu : un tap qui ne bouge pas ne coûte donc rien de plus qu'avant.
//
// Une fois la piste choisie, chacune ne déplace que **ce qui lui appartient** : la pliure
// bouge ses deux couches, la couche qui monte n'en bouge qu'une. On ne dépasse jamais deux
// couches composées (docs/fluidite.md#les-couches-et-ce-quelles-coûtent).
//
// **Le poème reste hors gestes**, et c'est l'exception nommée : son corps défile, le doigt
// lui appartient entièrement, et son « c'est lu ↑ » est au bout du texte — là où la maquette
// B3 le met.

/** Sous `prefers-reduced-motion`, l'ouverture tombe à 120 ms (docs/fluidite.md). */
const CALME = window.matchMedia('(prefers-reduced-motion: reduce)')
const OUVERTURE_CALME = 120

/**
 * Une durée écrite dans `tokens.css`, en millisecondes, quelle que soit l'unité qu'elle
 * porte à l'arrivée.
 *
 * **Sans cette conversion, le pli ne s'animait pas.** Le minifieur CSS du build réécrit
 * `460ms` en `.46s` — c'est plus court, et pour le navigateur c'est la même durée. Mais
 * `parseFloat` en tire **0,46**, et le module posait `transform 0.46ms` : la feuille
 * sautait en une image, en production seulement. Le geste au doigt n'était pas touché — il
 * écrit les positions lui-même —, donc le défaut ne se voyait qu'au relâchement, et jamais
 * en `npm run dev`. Mesuré le 19/08/2026 sur le build : -360px puis -844px, deux images
 * consécutives.
 *
 * Les autres réglages du geste sont sans unité (`--seuil`, `--elan`, `--caoutchouc`,
 * `--entree`) : eux ne peuvent pas se faire réécrire.
 */
function duree(racine: CSSStyleDeclaration, nom: string): number {
  const brut = racine.getPropertyValue(nom).trim()
  const nombre = parseFloat(brut)
  return /(^|[^m])s$/.test(brut) ? nombre * 1000 : nombre
}

/** Les réglages du geste vivent dans tokens.css, et nulle part ailleurs. */
function reglages() {
  const racine = getComputedStyle(document.documentElement)
  const nombre = (nom: string): number => parseFloat(racine.getPropertyValue(nom))
  return {
    seuil: nombre('--seuil'),
    elan: nombre('--elan'),
    caoutchouc: nombre('--caoutchouc'),
    entree: nombre('--entree'),
    ouvre: duree(racine, '--ouvre'),
    referme: duree(racine, '--referme'),
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
  /**
   * Le seuil vient d'être franchi : l'entrée du journal est **décidée**, pas encore écrite.
   * C'est le moment que docs/parcours.md#le-dépliage nomme, et il tombe avant l'animation
   * (docs/fluidite.md#écrire-le-journal-sans-bloquer).
   */
  auSeuil: () => void
  /** Le pli est déplié et la transition est finie. Une seule fois. */
  auDepliage: () => void
}

/**
 * La couche qui se tire au doigt par-dessus A2 — A3 ou A5, jamais A4.
 *
 * Elle se désigne par son attribut et non par son identité : le geste ne sait pas ce qu'est
 * une réponse ni une fermeture, et `monte.ts` pose `data-glisse` sur ce qui se tire
 * (src/lecteur/monte.ts). Elles n'existent qu'après le dépliage, d'où la recherche au
 * moment du geste plutôt qu'une référence gardée.
 */
function aTirer(cadre: HTMLElement, posee: boolean): HTMLElement | null {
  return cadre.querySelector<HTMLElement>(
    `.pli__monte[data-glisse]${posee ? '[data-posee]' : ':not([data-posee])'}`,
  )
}

/**
 * Ce qu'il faut bouger avant de savoir que le doigt part quelque part.
 *
 * Sous ce seuil, un doigt qui se pose et tremble n'est qu'un tap : rien n'est capturé, et
 * ce qui se touche garde son `:active`. Six pixels, la valeur qu'un tap ne franchit pas.
 */
const FRANC = 6

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

  /**
   * Quelle piste le doigt a prise, ou `null` tant qu'il n'a pas assez bougé pour le dire.
   *
   * Tant qu'elle est nulle, **rien n'est capturé et rien n'est promu** : le doigt posé sur
   * l'écran ne coûte pas plus qu'avant ce jour-là.
   */
  let piste: 'pliure' | 'monte' | null = null

  /** La couche que la piste `monte` déplace, et le sens dans lequel elle va. */
  let montante: HTMLElement | null = null
  let monteVers = false

  /**
   * Ce qu'il faut faire si un doigt se pose pendant qu'une transition est en vol : la
   * couper net, et laisser la feuille là où elle allait.
   *
   * Avant les deux pistes, `pointerdown` coupait les transitions lui-même. Il ne le fait
   * plus — le sens n'est pas encore connu, et un tap ne doit rien préparer. Sans cette
   * fonction, une couche qu'on retouche pendant son retour continuait sa propre courbe
   * pendant les six pixels d'indécision, **puis sautait** au moment où la piste se choisit :
   * un accroc qui ne se voit qu'au doigt, sur un vrai téléphone, en retouchant vite.
   *
   * Le transform en ligne porte déjà la position d'arrivée — c'est la transition seule qui
   * l'anime. La couper suffit donc à poser la feuille, sans une écriture de plus.
   */
  let enVol: (() => void) | null = null

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
   * se rapporte à l'élément lui-même, donc plus rien ne dépend de la hauteur ici — ni de
   * la taille du cadre, qui vaut désormais celle de l'écran.
   */
  function placer(course: number): void {
    p.dessus.style.transform = `translate3d(0,${-course * 100}%,0)`
    p.dessous.style.transform = `translate3d(0,${(1 - course) * r.entree * 100}%,0)`
  }

  /**
   * La couche qui monte, à sa course : 0 en bas, hors de l'écran ; 1 posée. Une seule
   * écriture, une seule couche — A2 ne bouge pas dessous, et le compte reste à deux.
   */
  function placerLaCouche(course: number): void {
    if (montante) montante.style.transform = `translate3d(0,${(1 - course) * 100}%,0)`
  }

  /** La course du doigt, avec son caoutchouc : le mauvais sens ne rend qu'un dixième. */
  function course(clientY: number): number {
    const brute = p0 + (y0 - clientY) / hauteur
    if (brute < 0) return brute * r.caoutchouc
    if (brute > 1) return 1 + (brute - 1) * r.caoutchouc
    return brute
  }

  /**
   * Le relâchement de la piste `monte` : la couche part se poser ou redescendre, et
   * l'inertie de l'écran suit — ce qui est sous elle sort du clavier en même temps qu'il
   * sort de la vue, comme pour les deux couches du dépliage.
   */
  function poserLaCouche(vers: boolean): void {
    const quoi = montante
    if (!quoi) return
    const d = CALME.matches ? OUVERTURE_CALME : vers ? r.ouvre : r.referme
    quoi.style.transition = `transform ${d}ms var(--courbe)`
    quoi.inert = !vers
    p.dessous.inert = vers
    if (vers) quoi.dataset.posee = ''
    else delete quoi.dataset.posee
    // La feuille reprend la main une fois posée : `data-posee` porte déjà la position, et un
    // transform en ligne la garderait figée si la couche changeait d'état autrement.
    const rendre = (): void => {
      enVol = null
      quoi.style.willChange = ''
      quoi.style.transform = ''
      quoi.style.transition = ''
    }
    // Couper une transition en vol, ce n'est PAS `transition = ''` : la déclaration en ligne
    // s'efface, et la feuille reprend la sienne — la couche continue de voler. C'est
    // `transition: none` qui la pose, net, sur le transform en ligne qu'elle porte déjà,
    // c'est-à-dire à son arrivée. Le transform reste donc en place : il dit la même chose
    // que `data-posee`, et le prochain vrai `transitionend` le rendra à la feuille.
    enVol = () => {
      enVol = null
      quoi.style.transition = 'none'
      quoi.style.willChange = ''
    }
    quoi.addEventListener('transitionend', rendre, { once: true })
    const avant = quoi.style.transform
    placerLaCouche(vers ? 1 : 0)
    // Rien n'a bougé : aucune transition ne se déclenchera, et `will-change` resterait posé.
    // Une propriété `will-change` oubliée transforme chaque écran en couche permanente —
    // c'est la même garde que `poser()`, et elle vaut ici pour la même raison.
    if (quoi.style.transform === avant) rendre()
  }

  function finir(): void {
    enVol = null
    for (const couche of couches) couche.style.willChange = ''
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

    // Ce qui passe derrière sort du clavier en même temps qu'il sort de la vue. Les deux
    // couches sont toujours là, l'une seulement décalée : sans ça, « répondre » en bas
    // d'A2 se ramassait au Tab depuis A1 — et depuis qu'il agit, il ouvrait la réponse
    // d'un pli qu'elle n'a pas encore déplié.
    p.dessus.inert = vers
    p.dessous.inert = !vers

    const avant = p.dessus.style.transform
    placer(vers ? 1 : 0)
    enVol = () => {
      for (const couche of couches) couche.style.transition = 'none'
      finir()
    }
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
    if (piste === 'monte') placerLaCouche(course(y))
    else placer(course(y))
    demandeImage = requestAnimationFrame(aChaqueImage)
  }

  /**
   * LE SENS DIT CE QUE LE DOIGT FAIT — appelée une fois, au premier mouvement franc.
   *
   * Elle rend la piste, ou `null` si ce sens-là ne mène nulle part depuis cet écran. Aucune
   * écriture ici : elle décide, elle ne bouge rien.
   */
  function choisir(vertical: number): 'pliure' | 'monte' | null {
    const versLeHaut = vertical < 0

    // Une couche posée par-dessus A2 — A3, A5 — se rabat vers le bas, et rien d'autre ne
    // peut se passer tant qu'elle est là : c'est elle, l'écran.
    const posee = aTirer(p.cadre, true)
    if (posee) {
      if (versLeHaut) return null
      montante = posee
      monteVers = false
      return 'monte'
    }

    // A4 EST POSÉE, ET ELLE NE SE RABAT PAS. Le mot est dit, on ne le reprend pas — et sans
    // cette ligne le doigt serait tombé sur la pliure, qui aurait replié A1 et A2 **sous**
    // un écran qui les recouvre entièrement, sans que rien ne se voie.
    if (p.cadre.querySelector('.pli__monte[data-posee]')) return null

    // A2 est à l'écran. Vers le haut, c'est l'action que l'écran dessine avec sa flèche ;
    // vers le bas, le pli se referme — la pliure, à l'envers, qui existait déjà.
    if (ouvert && versLeHaut) {
      const aMonter = aTirer(p.cadre, false)
      if (!aMonter) return null
      montante = aMonter
      monteVers = true
      return 'monte'
    }

    return 'pliure'
  }

  /** Le doigt part vraiment : on capture, on coupe les transitions, on lance les images. */
  function partir(e: PointerEvent, quelle: 'pliure' | 'monte'): void {
    piste = quelle
    doigt = e.pointerId
    // La seule lecture de géométrie de tout le geste, prise avant la première image.
    hauteur = p.cadre.getBoundingClientRect().height
    y0 = y = yImage = e.clientY
    tImage = 0
    vitesse = 0
    p.cadre.setPointerCapture(doigt)
    if (quelle === 'monte' && montante) {
      p0 = monteVers ? 0 : 1
      montante.style.transition = 'none'
      montante.style.willChange = 'transform'
      // Elle est hors du clavier tant qu'elle n'est pas posée, et le restera si le doigt
      // renonce : `poserLaCouche` remet les deux inerties à leur place au relâchement.
      montante.inert = false
      placerLaCouche(p0)
    } else {
      p0 = ouvert ? 1 : 0
      preparer()
    }
    demandeImage = requestAnimationFrame(aChaqueImage)
  }

  /** Le doigt s'est posé mais n'a pas encore dit où il va : son identité, et d'où il part. */
  let pose: { id: number; y: number } | null = null

  p.cadre.addEventListener('pointerdown', (e) => {
    // Ce qui agit fait son travail tout seul : le geste ne le lui prend pas. Le bouton
    // « déplier » du clavier, « répondre » et « c'est lu » en bas d'A2, les trois liens
    // d'A3, la marque — sans le `a`, `touch-action: none` avalait le tap et la réponse ne
    // partait jamais.
    // `pose` compte autant que `doigt` : entre le contact et le sixième pixel, un second
    // contact écrasait le premier sans l'avoir capturé — le doigt qui menait le geste
    // devenait orphelin, ses mouvements ne correspondaient plus à rien. Une main qui frôle
    // l'écran suffit.
    if (doigt !== null || pose !== null || (e.target as Element | null)?.closest('a, button')) {
      return
    }
    // Un poème ouvert défile, et c'est la seule exception à « un pli = un écran »
    // (docs/design-system.md#les-cinq-règles). Le geste lui rend le doigt entièrement :
    // sans ça, tirer ferait à la fois défiler le texte et remonter la feuille. L'attribut
    // est posé par `main.ts` une fois le poème ouvert, et par la même occasion `pli.css`
    // rend `touch-action` au navigateur — les deux vont ensemble, l'un sans l'autre ne
    // ferait rien. On ne referme donc pas un poème en tirant, et on ne le referme pas non
    // plus en poussant : son « c'est lu ↑ » est au bout du texte.
    if (p.cadre.dataset.defile !== undefined) return
    // Une transition en vol se coupe au contact, elle. C'est la seule chose que ce doigt
    // fait avant d'avoir dit où il va, et c'est ce que `pointerdown` faisait déjà avant les
    // deux pistes : sans elle, la feuille continue sa courbe pendant six pixels puis saute.
    enVol?.()
    // RIEN D'AUTRE ICI. Ni capture, ni géométrie, ni `will-change` : le sens n'est pas
    // encore connu, et un doigt qui se pose sans bouger ne doit rien coûter.
    pose = { id: e.pointerId, y: e.clientY }
  })

  // Un seul écouteur, passif, qui ne fait que mémoriser — plus, une fois par geste, choisir
  // la piste. Aucun `preventDefault` : `touch-action: none` sur le cadre a déjà fait le
  // travail, et un écouteur non passif obligerait le navigateur à attendre notre code.
  p.cadre.addEventListener(
    'pointermove',
    (e) => {
      if (doigt === e.pointerId) {
        y = e.clientY
        return
      }
      if (!pose || pose.id !== e.pointerId) return
      const vertical = e.clientY - pose.y
      if (Math.abs(vertical) < FRANC) return
      const quelle = choisir(vertical)
      // Ce sens-là ne mène nulle part depuis cet écran : le doigt ne reprend pas la main
      // plus loin dans le même mouvement, il repart d'un nouveau contact.
      pose = null
      if (quelle) partir(e, quelle)
    },
    { passive: true },
  )

  function relacher(e: PointerEvent): void {
    if (pose?.id === e.pointerId) pose = null
    if (doigt !== e.pointerId) return
    cancelAnimationFrame(demandeImage)
    p.cadre.releasePointerCapture(doigt)
    doigt = null
    const fin = course(e.clientY)
    const quelle = piste
    piste = null
    // La couche du pli qu'on vient de lire n'a rien à faire dans l'état du geste : `armer()`
    // ne s'instancie qu'une fois pour la session, et `retirerLesCouchesQuiMontent` la sort
    // du document au changement d'adresse (src/lecteur/main.ts). La référence est relâchée
    // après le dernier usage, plus bas.
    const laCouche = montante

    /**
     * LE SEUIL EST ABSOLU POUR LA PLIURE, RELATIF POUR UNE COUCHE QU'ON RABAT.
     *
     * `--seuil` est une POSITION — 32 % de la hauteur — et c'est juste pour le dépliage :
     * une feuille tirée à plus d'un tiers est une feuille ouverte. Mais rabattre une couche
     * posée en partant de 1, c'est franchir ce même point par en dessous : il aurait fallu
     * la traîner sur **68 %** de l'écran pour qu'elle s'en aille. Mesuré : un rabat de 500px
     * sur 844 ne suffisait pas, et seul un coup sec la renvoyait.
     *
     * Une couche qui monte est une feuille qu'on pousse, pas une pliure qu'on tire : son
     * seuil se compte depuis là où elle est. 32 % de course vers le bas, et elle descend —
     * ce que fait n'importe quel téléphone, et ce que le doigt attend.
     *
     * La pliure, elle, ne bouge pas d'un chiffre : c'est le geste du produit, il est mesuré
     * et il est dans docs/design-system.md#le-mouvement.
     */
    const franchi = quelle === 'monte' && !monteVers ? fin > 1 - r.seuil : fin > r.seuil
    // Un coup sec vers le bas referme même au-delà du seuil ; un coup sec vers le haut
    // déplie même à 10 % de course. Les deux pistes partagent ce jugement-là : c'est la même
    // feuille physique, tirée à deux endroits différents.
    const vers = vitesse > r.elan ? false : vitesse < -r.elan || franchi

    if (quelle === 'monte') poserLaCouche(vers)
    else poser(vers)
    if (quelle === 'monte' && laCouche === montante) montante = null
  }

  p.cadre.addEventListener('pointerup', relacher)
  p.cadre.addEventListener('pointercancel', relacher)

  // L'alternative au geste : elle pose la course à 1 directement, avec la même transition.
  // Le geste est le chemin, jamais le seul chemin (docs/parcours.md#le-dépliage).
  p.bouton?.addEventListener('click', () => {
    if (ouvert) return
    preparer()
    // Deux images de battement, le temps que la couche existe avant qu'on la déplace.
    requestAnimationFrame(() => requestAnimationFrame(() => poser(true)))
  })

  p.dessus.addEventListener('transitionend', (e) => {
    if (e.target === p.dessus && e.propertyName === 'transform') finir()
  })

  placer(0)
  p.dessous.inert = true

  return {
    // Un autre lien arrive sans rechargement : le pli doit être refermé, et le prochain
    // dépliage doit compter pour un.
    //
    // Sans condition, et c'est une réparation. Un `if (!ouvert) return` avait l'air juste —
    // pourquoi refermer ce qui est fermé ? — mais le geste ne referme pas seulement : il
    // REPOSE les deux couches. La relecture d'un pli sort la couche du dessous de sa place
    // (`transform: none`) et la rend au clavier (`inert = false`), parce qu'elle y est
    // l'écran ; le lien suivant retrouvait alors un A2 posé à 0 et atteignable au Tab
    // depuis A1 — « répondre » d'un pli qu'elle n'avait pas déplié. C'est la faute du
    // jalon 3, revenue par une autre porte (mesuré le 19/08/2026, deux Tab depuis A1).
    refermer: () => {
      deplie = false
      // Le doigt et la piste repartent de zéro : un pli qui s'en va n'emporte pas le geste
      // en cours, et sa couche qui montait n'est déjà plus dans le cadre
      // (`retirerLesCouchesQuiMontent`, src/lecteur/main.ts).
      pose = null
      piste = null
      montante = null
      poser(false)
    },
  }
}
