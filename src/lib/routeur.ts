// Le routeur — une fonction sur `hashchange`, pas une librairie.
//
// GitHub Pages ne réécrit aucune URL : toute URL profonde tomberait en 404, d'où le
// routage par hash (docs/architecture.md#routage).
//
//   leo-bernard38.github.io/#/            ses plis
//   leo-bernard38.github.io/#c=<payload>  un pli porté par le lien
//   leo-bernard38.github.io/#p=<nom>      un poème, porté par un fichier
//   leo-bernard38.github.io/#/installer   l'ajout à l'écran d'accueil

/** L'écran que le lien demande. */
export type Route =
  | { ecran: 'journal' }
  | { ecran: 'pli'; payload: string }
  | { ecran: 'poeme'; nom: string }
  | { ecran: 'installer' }
  | { ecran: 'inconnu' }

/**
 * Le nom d'un fichier de poème, tel que la moulinette l'écrit : le numéro, un tiret,
 * le jeton. Tout le reste est inconnu — le nom part dans une adresse, il ne s'invente pas.
 */
const NOM_DE_POEME = /^[0-9]+-[a-z0-9]+$/

/** Ce que dit le hash. Une fonction pure : elle ne touche ni la page ni le réseau. */
export function lire(hash: string): Route {
  const chemin = hash.startsWith('#') ? hash.slice(1) : hash

  if (chemin === '' || chemin === '/') return { ecran: 'journal' }
  if (chemin === '/installer') return { ecran: 'installer' }
  if (chemin.startsWith('c=')) return { ecran: 'pli', payload: chemin.slice(2) }

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
