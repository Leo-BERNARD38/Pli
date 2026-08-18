// Ce que Vite sait faire d'un import qui n'est pas du TypeScript.
//
// Écrit à la main plutôt que de tirer `vite/client` : on n'a besoin que de cette forme,
// et `vite/client` déclare aussi `import.meta.env`, dont ce produit ne se sert pas —
// rien de secret dans le dépôt, donc aucune variable de build.

/** Une feuille de style importée pour son effet : Vite l'écrit dans le document. */
declare module '*.css' {}

/** Une peinture importée : Vite l'empreinte et rend son adresse. */
declare module '*.webp' {
  const adresse: string
  export default adresse
}
