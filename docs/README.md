# Documentation

| Document | Contenu |
|---|---|
| [concept.md](concept.md) | Le produit : à quoi ça sert, ce qui est tranché, ce qu'on assume |
| [parcours.md](parcours.md) | Écran par écran : ce qui déclenche quoi, et ce qui se range où |
| [design-system.md](design-system.md) | Encres, mains, gabarit, mouvement, lexique |
| [donnees.md](donnees.md) | Le pli, l'encodage, le poème-fichier, les deux journaux |
| [architecture.md](architecture.md) | Stack, routage, hébergement, poids, les deux risques mesurés |
| [integration.md](integration.md) | De la maquette au code : ce qui fait foi, ce qui a changé |
| [roadmap.md](roadmap.md) | Ce qu'on construit, dans quel ordre |

Le travail de design est archivé, non modifié, dans [`design/`](../design/README.md).
**Quand `design/` et `docs/` divergent, `docs/` fait foi** — les écarts sont listés
dans [integration.md](integration.md#ce-qui-a-changé-depuis-le-design).

## Par où commencer

- **Comprendre le produit** → [concept.md](concept.md), puis [parcours.md](parcours.md).
- **Écrire un écran** → [integration.md](integration.md) d'abord, toujours.
- **Reprendre la DA** → [design-system.md](design-system.md), et ouvrir
  [`design/handoff/index.html`](../design/handoff/index.html) à côté.

## Les deux choses à mesurer avant de s'engager

1. **Le journal peut être effacé par Safari** au bout de sept jours d'inactivité —
   [architecture.md](architecture.md#le-journal-peut-être-effacé).
2. **Le plafond de longueur d'un lien** ne se devine pas, il se mesure —
   [architecture.md](architecture.md#la-longueur-du-lien).

Règle : docs courtes. Si un document dépasse ce qu'on lit d'une traite, il se coupe en deux.
