// Le plateau — ce qui entoure le pli, et ce qui le fait tenir dans l'écran.
//
// docs/design-system.md dit « 360 × 780, jamais élargie » ; docs/appareils.md dit que le
// plateau porte les retraits de sécurité. Ni l'un ni l'autre ne disait ce que devient un pli
// de 780px quand la hauteur visible est plus courte — mesuré à 390 × 664 au jalon 1, la page
// défile et le bas du volet sort de la vue, ce qui contredit « un pli = un écran ».
//
// Tranché au jalon 2 : **le pli se met à l'échelle**. La composition ne bouge jamais, le
// gabarit reste littéralement 360 × 780, et c'est l'idiome que le produit emploie déjà —
// « un vrai pli 360 × 780 réduit par transform: scale(), jamais un dessin séparé »
// (docs/parcours.md#d1--le-type).

/** Ce qu'on rend à l'appelant : de quoi figer l'échelle le temps d'un geste. */
export interface Echelle {
  /** Pendant le geste, plus rien ne bouge : voir le commentaire de `regler`. */
  figer(): void
  /** À la fin de la transition, on reprend la mesure — l'écran a pu changer entre-temps. */
  relacher(): void
}

/**
 * Met le pli à l'échelle de l'écran, et l'y garde.
 *
 * Deux éléments, et ce n'est pas le même travail : le **plateau** porte les retraits de
 * sécurité, donc c'est lui qu'on mesure ; le **pli** est le seul consommateur de
 * `--echelle`, donc c'est sur lui qu'on écrit. L'écrire sur la racine — ou sur le corps de
 * page, ce qui revient au même — invaliderait le style de tout l'arbre pour un seul
 * élément (docs/fluidite.md#ce-qui-a-le-droit-de-bouger).
 */
export function tenirDansLecran(plateau: HTMLElement, pli: HTMLElement): Echelle {
  // Les deux nombres du gabarit ne vivent qu'à un endroit : tokens.css. Les recopier ici
  // ferait deux vérités qui divergeraient le jour où l'une bouge.
  const racine = getComputedStyle(document.documentElement)
  const ecranL = parseFloat(racine.getPropertyValue('--ecran-l'))
  const ecranH = parseFloat(racine.getPropertyValue('--ecran-h'))

  let gele = false
  let posee = 0

  /**
   * Une mesure, puis une écriture — et seulement si le nombre a changé.
   *
   * Jamais pendant le geste : la barre d'URL se rétracte au premier mouvement et déclenche
   * un `resize`. Changer la taille d'une couche qui porte l'ombre et le grain la ferait
   * re-rastériser à chaque image (docs/fluidite.md#les-couches-et-ce-quelles-coûtent).
   */
  const regler = (): void => {
    if (gele) return

    // visualViewport, et non innerHeight : c'est ce que 100dvh approche, barre d'URL
    // rétractée comprise (docs/appareils.md#les-réglages-de-page).
    const vue = window.visualViewport
    const style = getComputedStyle(plateau)
    const retrait = (a: string, b: string): number =>
      parseFloat(style.getPropertyValue(a)) + parseFloat(style.getPropertyValue(b))

    const hauteur = (vue?.height ?? window.innerHeight) - retrait('padding-top', 'padding-bottom')
    const largeur = (vue?.width ?? window.innerWidth) - retrait('padding-left', 'padding-right')

    // Jamais au-dessus de 1 : le pli ne s'élargit pas, même sur 1440
    // (docs/design-system.md#le-gabarit). On l'entoure, on ne l'agrandit pas.
    const mesuree = Math.min(1, hauteur / ecranH, largeur / ecranL)
    const echelle = Math.round(mesuree * 1e4) / 1e4
    if (echelle === posee) return
    posee = echelle
    pli.style.setProperty('--echelle', String(echelle))
  }

  regler()
  window.addEventListener('resize', regler)
  window.visualViewport?.addEventListener('resize', regler)

  return {
    figer: () => {
      gele = true
    },
    relacher: () => {
      gele = false
      regler()
    },
  }
}
