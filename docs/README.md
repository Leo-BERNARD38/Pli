# Documentation

## Le produit

| Document | Contenu |
|---|---|
| [concept.md](concept.md) | Le produit : à quoi ça sert, ce qui est tranché, ce qu'on assume |
| [parcours.md](parcours.md) | Écran par écran : ce qui déclenche quoi, et ce qui se range où |
| [design-system.md](design-system.md) | Encres, mains, gabarit, mouvement, lexique |
| [donnees.md](donnees.md) | Le pli, l'encodage, le poème-fichier, les deux journaux |
| [integration.md](integration.md) | De la maquette au code : ce qui fait foi, ce qui a changé |
| [roadmap.md](roadmap.md) | Ce qu'on construit, dans quel ordre |

## La technique

| Document | Contenu |
|---|---|
| [architecture.md](architecture.md) | Stack, routage, la page unique, arborescence — la carte |
| [hebergement.md](hebergement.md) | GitHub Pages : ce qu'il donne, ce qu'il refuse, ce qu'on en déduit |
| [chargement.md](chargement.md) | Les trois vagues : ce qui part avant le texte, et ce qui attend |
| [fluidite.md](fluidite.md) | Le geste sans accroc : CPU, GPU, et ce qui ne doit jamais tourner pendant |
| [ressources.md](ressources.md) | Les peintures et les polices : définition, poids, production |
| [partage.md](partage.md) | L'aperçu du lien dans WhatsApp, et le retour de la réponse |
| [appareils.md](appareils.md) | Son iPhone, mon Android, et le navigateur intégré de WhatsApp |
| [installation.md](installation.md) | L'app sur l'écran d'accueil : manifest, icônes, cadence |
| [mises-a-jour.md](mises-a-jour.md) | Pousser une version sans servir d'ancien code ni casser un lien |

Le travail de design est archivé dans [`design/`](../design/README.md) : les trois pages
exportées dans `handoff/`, et **les six canevas dans [`canevas/`](../design/canevas/README.md)**,
qui dessinent tous les écrans — y compris ceux que `parcours.md` a longtemps crus jamais
dessinés. L'archive **peut s'agrandir, jamais changer**.

**Quand `design/` et `docs/` divergent, `docs/` fait foi** — les écarts sont listés
dans [integration.md](integration.md#ce-qui-a-changé-depuis-le-design), et ceux que les
canevas ont révélés dans
[la section qui leur est propre](integration.md#les-maquettes-que-le-handoff-navait-pas-transportées).

## Par où commencer

- **Comprendre le produit** → [concept.md](concept.md), puis [parcours.md](parcours.md).
- **Écrire un écran** → [integration.md](integration.md) d'abord, toujours.
- **Reprendre la DA** → [design-system.md](design-system.md), et ouvrir
  [`design/handoff/index.html`](../design/handoff/index.html) à côté.
- **Écrire du code qui charge ou qui bouge** → [chargement.md](chargement.md) et
  [fluidite.md](fluidite.md). Les deux tiennent en une lecture, et ils portent chacun leur
  liste de ce qui fait échouer une revue.
- **Pousser une version** → [mises-a-jour.md](mises-a-jour.md), et sa liste avant push.

## Les mesures à faire avant de s'engager

Quatre, et aucune ne se devine.

1. **Le plafond de longueur d'un lien**, WhatsApp → iOS → Safari —
   [architecture.md](architecture.md#la-longueur-du-lien).
2. **La survie du journal** au plafond de sept jours de WebKit —
   [architecture.md](architecture.md#le-journal-peut-être-effacé).
3. **Où s'ouvre un pli** sur son iPhone : Safari, ou le navigateur intégré de WhatsApp ?
   Les deux ne partagent pas leur stockage — [appareils.md](appareils.md#le-bac-de-stockage--la-mesure-qui-manque).
4. **Le journal écrit dans Safari est-il celui de l'app ajoutée à l'écran d'accueil ?**
   De la réponse dépend l'existence de l'écran `#/installer` — même section.

Règle : docs courtes. Si un document dépasse ce qu'on lit d'une traite, il se coupe en deux.
