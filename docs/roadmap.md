# Roadmap

## Jalon 0 — Socle

- Vite + TypeScript, deux entrées (`/` et `/atelier/`)
- Domaine `pli.re`, `CNAME`, déploiement GitHub Pages par Actions
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
- `tokens.css` et `pli.css` repris de `design/`, avec les corrections de
  [integration.md](integration.md#corrections-à-appliquer)
- Polices locales, sous-ensemblées, préchargées
- Les cinq textures redimensionnées en 720 × 1560 (~70 ko), plus l'aperçu OG en 1200 × 630
  ([assets/README.md](../design/handoff/assets/README.md#le-poids))

## Jalon 2 — Le pli et le geste

- A1 l'attente, pour les quatre types
- Le dépliage : geste, seuil, élan, caoutchouc — et son alternative clavier
- `prefers-reduced-motion`
- A2 la découverte : invitation, pensée, souvenir
- C4 lien abîmé

**Fin du jalon :** le premier vrai pli envoyé.

## Jalon 3 — La réponse

- A3 les trois mots, A4 le mot
- Le passage à WhatsApp, dans le bon ordre
- C2 déjà répondu

## Jalon 4 — Le journal

- Écriture au dépliage, dédoublonnage sur l'empreinte
- C1 le journal, et son état vide
- C3 refermé, et son chemin vers le journal
- La marque comme chemin discret
- `manifest.json` + l'écran `#/installer`
- Export du journal

**Fin du jalon :** son journal existe et survit à deux semaines de silence.

## Jalon 5 — L'atelier

- D0 le seuil
- D1 le type, D2 les textes, D3 le lien
- Compteur de signes calé sur le plafond mesuré
- Partage natif et copie du lien
- Mon historique des plis déposés

**Fin du jalon :** je compose et j'envoie depuis mon téléphone, sans passer par le code.

## Jalon 6 — Le poème

- `scripts/plier.mjs`, `plier.bat`, `plier.sh`
- `plis-source/` gitignoré, garde-fou avant commit
- B2 · B3 : la pagination strophe par strophe, au même geste
- C5 l'attente du fichier
- D2p : la liste des poèmes dans l'atelier

## Jalon 7 — Le bureau

- E1, l'atelier en 1440 × 900

## Plus tard

- Un carnet d'idées (`data/*.json`) piochable depuis D2 — aucun écran maquetté à ce jour
- Sons et vibrations à l'ouverture
- Export du journal en PDF, à imprimer
- Source des poèmes privée, sortie encodée au build — rendrait l'écriture en clair et
  l'illisibilité du dépôt compatibles, au prix d'un déploiement par poème
