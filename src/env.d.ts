// Ce que Vite sait faire d'un import qui n'est pas du TypeScript.
//
// Écrit à la main plutôt que de tirer `vite/client` : on ne déclare que ce dont le produit
// se sert, et rien de plus. Une seule variable de build existe — le sous-chemin où le site
// est servi (docs/hebergement.md#ladresse) ; il n'y a **rien de secret dans le dépôt**, donc
// aucune autre n'a le droit d'apparaître ici.

/** Une feuille de style importée pour son effet : Vite l'écrit dans le document. */
declare module '*.css' {}

/** Une peinture importée : Vite l'empreinte et rend son adresse. */
declare module '*.webp' {
  const adresse: string
  export default adresse
}

/** Le sous-chemin où le site est servi — `/Pli/`, écrit une seule fois dans `vite.config.ts`.
 * Vite le remplace par sa valeur au build. C'est la seule variable de build du produit. */
interface ImportMeta {
  readonly env: { readonly BASE_URL: string }
}
