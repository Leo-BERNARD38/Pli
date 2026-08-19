// Le routeur — une fonction sur `hashchange`, pas une librairie.
//
// GitHub Pages ne réécrit aucune URL : toute URL profonde tomberait en 404, d'où le
// routage par hash (docs/architecture.md#routage).
//
//   leo-bernard38.github.io/Pli/#/            ses plis
//   leo-bernard38.github.io/Pli/#c=<payload>  un pli porté par le lien
//   leo-bernard38.github.io/Pli/#p=<nom>      un poème, porté par un fichier
//   leo-bernard38.github.io/Pli/#/relire/<h>  un pli de son journal, relu
//   leo-bernard38.github.io/Pli/#/atelier     l'atelier — le dépôt, de l'autre côté
//   leo-bernard38.github.io/Pli/#/installer   l'ajout à l'écran d'accueil
//
// **Une seule page depuis le 19/08/2026** : l'atelier n'est plus un second document servi
// sous `/Pli/atelier/`, c'est une route comme les autres. Les seules adresses qui partent
// dans une conversation restent `#c=` et `#p=` ; `#/`, `#/relire/` et `#/atelier` ne
// quittent jamais l'appareil (docs/architecture.md#une-seule-page).

/** L'écran que le lien demande. */
export type Route =
  | { ecran: 'journal' }
  | { ecran: 'pli'; payload: string }
  | { ecran: 'poeme'; nom: string }
  | { ecran: 'relire'; h: string }
  | { ecran: 'atelier' }
  | { ecran: 'installer' }
  | { ecran: 'inconnu' }

/**
 * Le nom d'un fichier de poème, tel que la moulinette l'écrit : le numéro, un tiret,
 * le jeton. Tout le reste est inconnu — le nom part dans une adresse, il ne s'invente pas.
 */
const NOM_DE_POEME = /^[0-9]+-[a-z0-9]+$/

/**
 * L'empreinte d'une entrée du journal — seize signes hexadécimaux, ceux que `journal.ts`
 * écrit. Cette adresse ne quitte jamais l'appareil : elle ne désigne rien sans le journal
 * qui la porte, et c'est pour ça qu'elle peut exister à côté de `#c=` et `#p=`, qui, eux,
 * sont dans une conversation pour toujours.
 */
const EMPREINTE = /^[0-9a-f]{16}$/

/** Ce que dit le hash. Une fonction pure : elle ne touche ni la page ni le réseau. */
export function lire(hash: string): Route {
  const chemin = hash.startsWith('#') ? hash.slice(1) : hash

  if (chemin === '' || chemin === '/') return { ecran: 'journal' }
  if (chemin === '/atelier') return { ecran: 'atelier' }
  if (chemin === '/installer') return { ecran: 'installer' }
  if (chemin.startsWith('c=')) return { ecran: 'pli', payload: chemin.slice(2) }

  if (chemin.startsWith('/relire/')) {
    const h = chemin.slice('/relire/'.length)
    return EMPREINTE.test(h) ? { ecran: 'relire', h } : { ecran: 'inconnu' }
  }

  if (chemin.startsWith('p=')) {
    const nom = chemin.slice(2)
    return NOM_DE_POEME.test(nom) ? { ecran: 'poeme', nom } : { ecran: 'inconnu' }
  }

  return { ecran: 'inconnu' }
}

/** Suit le hash de la page : maintenant, puis à chaque changement. Rend de quoi se retirer. */
export function suivre(quoi: (route: Route) => void): () => void {
  const ecouter = () => quoi(lire(window.location.hash))
  window.addEventListener('hashchange', ecouter)
  ecouter()
  return () => window.removeEventListener('hashchange', ecouter)
}
