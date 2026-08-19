// La hauteur visible de l'atelier — le seul endroit du produit où elle n'est pas la hauteur
// de la fenêtre (docs/appareils.md#latelier-sur-mon-téléphone).
//
// C'est le seul écran avec un clavier. Quand il monte, le viewport de disposition ne bouge
// pas : le navigateur découvre la ligne en cours en **faisant remonter la page**, et
// l'action collée en bas part sous le clavier. Le meta viewport de l'atelier demande
// `interactive-widget=resizes-content`, qui rétrécit le viewport au lieu de pousser la page
// — mais il n'existe que sur Chrome. Ce module est ce qui tient sur Safari, et il donne le
// même nombre sur Chrome : les deux ne se battent pas.
//
// Il écrit sur les écrans, jamais sur la racine : une variable de racine recalcule le style
// de tout l'arbre pour quelques éléments, et docs/fluidite.md#ce-qui-a-le-droit-de-bouger ne
// change pas de raison parce qu'on change d'entrée. C'est déjà ce que faisait plateau.ts —
// écrire sur le seul consommateur — et scripts/verifie.mjs refuse l'autre écriture.

/** Suit la hauteur visible et l'écrit en `--vue-h` sur chaque écran, qui la consomme. */
export function suivreLaVue(ecrans: Iterable<HTMLElement>): void {
  const vue = window.visualViewport
  // Sans visualViewport, `.ecran` retombe sur son `100dvh` de secours, et c'est très bien.
  if (!vue) return

  const cibles = [...ecrans]
  let posee = 0
  let demande = 0

  const regler = (): void => {
    demande = 0
    const hauteur = Math.round(vue.height)
    if (hauteur === posee) return
    posee = hauteur
    for (const ecran of cibles) ecran.style.setProperty('--vue-h', `${hauteur}px`)
  }

  // Le clavier envoie une volée d'événements pendant qu'il monte. Une image, une écriture,
  // et seulement si le nombre a changé — le garde-fou que plateau.ts avait déjà.
  const demander = (): void => {
    if (!demande) demande = requestAnimationFrame(regler)
  }

  regler()
  vue.addEventListener('resize', demander)
}
