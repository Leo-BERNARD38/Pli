# Roadmap

Sept jalons sont devenus cinq : le journal et l'atelier ont changé de place, le poème et le
bureau sont passés dans « plus tard ». Le lancement, lui, est nommé — il tombe à la fin du
jalon 3, et tout ce qui suit est du confort.

## Avant la première ligne de code

### Tranché

| Point | La décision |
|---|---|
| **Le seuil de l'atelier** | chiffres seuls, préfixe `pli.seuil.`, sha-256, l'empreinte fabriquée en local et seule à entrer dans le dépôt ([architecture.md](architecture.md#le-seuil-de-latelier)) |
| **Le numéro de réponse** | un écran de l'atelier, **D4 · le tiroir**, qui garde `w` et la signature sur mon téléphone ([parcours.md](parcours.md#d4--le-tiroir)) |
| **L'export du journal** | **pas en v1.** Le seul filet devient l'ajout à l'écran d'accueil — si la mesure du bac de stockage tourne mal, l'export repasse en tête |
| **L'icône** | livrée et mise au propre : `public/icones/`, regénéré par `scripts/icones.py` ([installation.md](installation.md#le-manifeste-et-les-icônes)) |

### Ce qui reste

| Point | Ce qui manque | Quand |
|---|---|---|
| **Le numéro `n` des plis courts** | il vient de `pli.v1.compteur`, sur mon téléphone seul. Le tiroir l'affiche et permet de le corriger. **Le cas du poème est réglé** (19/08/2026) : un poème écrit hors atelier consommait un numéro que le compteur ignorait, et l'index le lui apporte maintenant à l'ouverture de D2p ([donnees.md](donnees.md#lindex)) | fait |

Les écrans qui ne sont pas encore maquettés sont listés à part, en fin de
[parcours.md](parcours.md#3-ce-qui-nest-pas-encore-maquetté).

## Jalon 0 — Socle

- Vite + TypeScript, deux entrées (`/` et `/atelier/`)
- Les deux workflows : vérification sur PR, déploiement sur `main`
  ([hebergement.md](hebergement.md#ce-qui-est-déployé))
- Adresse `leo-bernard38.github.io/Pli`, `.nojekyll`, `404.html`, déploiement GitHub Pages par Actions
  ([hebergement.md](hebergement.md#avant-le-premier-déploiement))
- Routeur par hash
- `lib/codec.ts` : encode / décode, **isomorphe Node + navigateur**, avec tests
- Un pli en dur, sans style

**Fin du jalon :** un lien fabriqué à la main s'ouvre sur son téléphone.

## Jalon 1 — Mesures et fondations

Deux mesures conditionnent des décisions qu'on ne peut pas prendre au jugé.

- **Le plafond de longueur d'URL**, mesuré WhatsApp → iOS → Safari
  (protocole dans [architecture.md](architecture.md#la-longueur-du-lien))
- **La survie de `localStorage`** sur son iPhone, avec et sans ajout à l'écran d'accueil
  ([architecture.md](architecture.md#le-journal-peut-être-effacé))
- **Où s'ouvre un pli**, et dans quel bac de stockage — Safari, navigateur intégré de
  WhatsApp, app installée ([appareils.md](appareils.md#le-bac-de-stockage--la-mesure-qui-manque))
- `tokens.css` et `pli.css` repris de `design/`, avec les corrections de
  [integration.md](integration.md#corrections-à-appliquer)
- Polices locales, sous-ensemblées, préchargées ([ressources.md](ressources.md#les-polices))
- Les cinq textures en **définition native**, ré-encodées q80 seulement si un master existe,
  plus l'aperçu OG en 1200 × 630 — et la décision « natif ou régénérer ≥ 1800 »
  ([ressources.md](ressources.md#la-règle-de-définition))
- Les deux flèches tracées, en SVG inline ([ressources.md](ressources.md#les-deux-flèches))
- Les balises `og:` en place et l'aperçu vérifié en s'envoyant le lien à soi-même
  ([partage.md](partage.md#vérifier-un-aperçu))
- Le budget de chargement rempli avec de vrais chiffres, mesuré sur les deux téléphones
  ([chargement.md](chargement.md#le-budget-écran-par-écran))

## Jalon 2 — Le pli et le geste

- A1 l'attente, pour les quatre types
- Le dépliage : geste, seuil, élan, caoutchouc — et son alternative clavier
- **Aucune image perdue** : zéro disposition, zéro peinture pendant le geste, vérifié à
  l'inspecteur sur les deux téléphones ([fluidite.md](fluidite.md#comment-on-mesure))
- `prefers-reduced-motion`
- A2 la découverte : invitation, pensée, souvenir
- C4 lien abîmé

**Fin du jalon :** le premier vrai pli envoyé.

## Jalon 3 — La boucle

Deux écrans et un module, et le produit existe pour de bon : elle reçoit, elle répond, le
mot arrive.

- `lib/journal.ts` — **le module, pas l'écran** : l'écriture au dépliage et le dédoublonnage
  sur l'empreinte `h`. A3 note la réponse dans le journal avant d'ouvrir WhatsApp
  ([parcours.md](parcours.md#a3--la-réponse--invitation-seulement)), donc le module vient ici
  et pas plus tard. Il porte aussi l'invariant du stockage — « tout `localStorage` passe par
  `journal.ts` », auquel le jalon 4 ajoutera `tiroir.ts`, et **eux deux seulement**
  ([architecture.md](architecture.md#arborescence-cible))
- A3 les trois mots, A4 le mot
- Le passage à WhatsApp, dans le bon ordre — la réponse notée, **puis** A4, **puis** `wa.me`

**Fin du jalon :** elle a répondu, et le mot est arrivé.

> **C'est ici qu'on lance.** Tout ce qui suit est du confort — précieux, mais du confort. Un
> pli se fabrique encore en ligne de commande et le journal ne se lit pas encore : l'échange,
> lui, fonctionne de bout en bout.
>
> À dire honnêtement : A3 n'existe **que pour l'invitation**. Une pensée et un souvenir
> s'ouvrent et se referment sans réponse — c'est le produit, pas un manque.

## Jalon 4 — L'atelier

Le seul jalon qui change ma vie à moi : tant qu'il n'existe pas, chaque pli passe par un
terminal.

- D0 le seuil, D4 le tiroir — le numéro de réponse et la signature, gardés sur mon téléphone
- D1 le type, D2 les textes, D3 le lien
- Compteur de signes calé sur le plafond mesuré — **dépend de la mesure 1**
- Partage natif et copie du lien
- Mon historique des plis déposés

**Fin du jalon :** je compose et j'envoie depuis mon téléphone, sans passer par le code.

## Jalon 5 — La durée

Ce qui fait qu'un pli reste un pli, et pas un message.

- C1 le journal et son état vide — le module existe depuis le jalon 3, l'écran non
- C2 déjà répondu — il n'est atteignable **que** depuis une entrée du journal
  ([parcours.md](parcours.md)), donc il vient avec C1 et pas avant
- C3 refermé, et son chemin vers le journal
- La marque comme chemin discret
- Le manifeste et les icônes — faits, à servir tels quels
  ([installation.md](installation.md#le-manifeste-et-les-icônes))
- L'écran `#/installer` — **sa forme dépend de la mesure 4**
- Le réglage de cadence sur son iPhone, au moment de l'installation

**Fin du jalon :** son journal existe et survit à deux semaines de silence.

## Plus tard

### Le poème

Le quatrième type, et de loin le plus de machinerie : une moulinette, un format de fichier
public pour toujours, un écran d'attente. Trois types de plis partent sans lui. Il remonte
le jour où il manque vraiment.

- `scripts/plier.mjs`, `plier.bat`, `plier.sh`
- `plis-source/` gitignoré, garde-fou avant commit
- C5 l'attente du fichier

### Le bureau

E1, l'atelier en 1440 × 900. Deux téléphones suffisent à faire vivre le produit.

### Le reste

- Un service worker, seul moyen de dépasser les dix minutes de cache de GitHub Pages
  ([hebergement.md](hebergement.md#ce-que-max-age600-change))
- Un carnet d'idées (`data/*.json`) piochable depuis D2 — aucun écran maquetté à ce jour
- Sons et vibrations à l'ouverture
- **L'export du journal** — écarté de la v1, à reprendre si le stockage se révèle fragile ;
  en texte d'abord, en PDF à imprimer ensuite
- Source des poèmes privée, sortie encodée au build — rendrait l'écriture en clair et
  l'illisibilité du dépôt compatibles, au prix d'un déploiement par poème
