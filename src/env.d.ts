// Ce que Vite sait faire d'un import qui n'est pas du TypeScript.
//
// Écrit à la main plutôt que de tirer `vite/client` : on n'a besoin que de cette forme,
// et `vite/client` déclare aussi `import.meta.env`, dont ce produit ne se sert pas —
// rien de secret dans le dépôt, donc aucune variable de build.

/** Une feuille de style importée pour son effet : Vite l'écrit dans le document. */
declare module '*.css' {}

/**
 * Le relais du <head> : la demande d'un poème, partie avant que ce module s'exécute.
 * Elle disparaîtra au jalon 2, quand le CSS et le module seront inline et qu'il n'y aura
 * plus de feuille bloquante à attendre.
 */
interface Window {
  poemeDemande?: { nom: string; reponse: Promise<Response> }
}
