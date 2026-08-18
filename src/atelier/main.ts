// L'atelier — D0 le seuil, D4 le tiroir, D1 le type, D2 les textes, D3 le lien.
//
// Le pendant de src/lecteur/main.ts, de mon côté. Rien de ce qui s'écrit ici ne peut
// atterrir dans le bundle qui part chez elle : les deux entrées sont buildées séparément
// (vite.config.ts, docs/architecture.md#deux-entrées).
//
// L'aiguillage tient dans une fonction et ne touche pas au hash : l'atelier n'est jamais
// partagé, aucune de ses adresses ne s'envoie, et un écran profond rechargé sur GitHub
// Pages tomberait en 404 (docs/architecture.md#routage). Le retour est dans la conduite,
// en haut à gauche, comme le design l'impose.

import '../styles/tokens.css'
import '../styles/pli.css'
import '../styles/depot.css'

import { seuilFranchi } from '../lib/tiroir.ts'

import { tenirLeSeuil } from './seuil.ts'
import { tenirLeTiroir } from './reglages.ts'

/** Les écrans de l'atelier, dans l'ordre où on les traverse. */
type Ecran = 'd0' | 'd4' | 'd1' | 'd2' | 'd3'

const ecrans = new Map<Ecran, HTMLElement>()

for (const nom of ['d0', 'd4', 'd1', 'd2', 'd3'] as const) {
  const element = document.getElementById(nom)
  if (element) ecrans.set(nom, element)
}

/**
 * Montre un écran, et un seul.
 *
 * `inert` suit `hidden` : les autres écrans sont toujours dans le document, et sans lui on
 * tomberait au Tab sur la ligne d'un écran qu'on ne voit pas — la faute déjà trouvée entre
 * A1 et A2 au jalon 3.
 */
function montrer(quel: Ecran): void {
  for (const [nom, element] of ecrans) {
    const vu = nom === quel
    element.hidden = !vu
    element.inert = !vu
  }
  window.scrollTo(0, 0)
}

/** Le premier passage ouvre le tiroir ; ensuite, la marque y ramène. */
function apresLeSeuil(): void {
  const tiroir = ecrans.get('d4')
  if (!tiroir) return
  tenirLeTiroir(tiroir)
  montrer('d4')
}

const porte = ecrans.get('d0')
if (porte && !seuilFranchi()) {
  montrer('d0')
  tenirLeSeuil(porte, apresLeSeuil)
} else {
  apresLeSeuil()
}
