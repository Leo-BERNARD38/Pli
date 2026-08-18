# Pli

Un lien = un pli. Une feuille fermée qui se tire du doigt, et le message se découvre.

Mobile pour elle, statique (GitHub Pages), sans backend, sans compte.

- Les plis courts voyagent **dans le lien**. Rien n'est stocké sur un serveur.
- Les **poèmes** sont des fichiers encodés dans le dépôt : le lien ne porte que leur numéro.
- Le **journal** vit en `localStorage`, sur son téléphone.

| Entrée | Pour qui |
|---|---|
| `pli.re/` | elle — les plis reçus, le journal |
| `pli.re/atelier/` | moi — déposer, fabriquer le lien |

## Déposer un poème

Les trois autres types se déposent depuis l'atelier, sur le téléphone. Le poème s'écrit
au bureau, dans un fichier.

**1. Écrire** — `plis-source/015.md`, le numéro comme nom de fichier :

```markdown
---
n: 15
type: poeme
titre: Nuit de juin
signe: a.
---

première strophe, ligne une
première strophe, ligne deux

seconde strophe...
```

Une **ligne vide sépare deux strophes**, et une strophe est un écran.

**2. Encoder** :

```bat
plier.bat
```

```sh
./plier.sh
```

La moulinette écrit `public/plis/015-vhtq.txt` et `public/plis/index`, puis imprime :

```
nº 015 → https://pli.re/#p=015-vhtq
```

**3. Pousser**, et envoyer le lien.

> `plis-source/` est **gitignoré**. L'historique git est définitif : un poème commité en
> clair y reste pour toujours. Sauvegarde le dossier ailleurs que sur la machine.

## Développement

```sh
npm install
npm run dev        # les deux entrées
npm run build
npm run verifie    # lexique, encres, invariants, mouvement — déterministe, sans agent
npm run types      # dont src/lib/ compilé sans la bibliothèque DOM
npm test           # codec.ts, dates.ts, le routeur
```

La moulinette et son `plier.sh` n'existent pas encore : c'est le **jalon 6**
([docs/roadmap.md](docs/roadmap.md)).

## Documentation

Tout est dans [`docs/`](docs/README.md). Avant d'écrire un écran, lire
[`docs/integration.md`](docs/integration.md) — il dit ce qui fait foi et ce qui a changé
depuis les maquettes. Avant d'écrire du code qui charge ou qui bouge,
[`docs/chargement.md`](docs/chargement.md) et [`docs/fluidite.md`](docs/fluidite.md).

Le travail de design est archivé dans [`design/`](design/README.md) : ouvrir
[`design/handoff/index.html`](design/handoff/index.html) suffit, aucun build.

## Statut

Brainstorm et cahier des charges terminés. Design importé et réconcilié. **Le jalon 0 est
posé** : les deux entrées, le codec, les dates, le routeur, les deux workflows, et un pli en
dur qu'un lien remplace. Le style, le geste et les écrans viennent ensuite —
voir [`docs/roadmap.md`](docs/roadmap.md) et [`.claude/chantier.md`](.claude/chantier.md).

Quatre mesures à faire avant de s'engager, listées dans
[`docs/README.md`](docs/README.md#les-mesures-à-faire-avant-de-sengager) : le plafond réel
de longueur d'un lien, la survie de `localStorage` sur son iPhone, et les deux questions de
stockage que pose le navigateur intégré de WhatsApp.
