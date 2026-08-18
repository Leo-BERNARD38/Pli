# CLAUDE.md

Guide de travail pour Claude Code sur ce dépôt. Le dépôt est en français : docs, code,
commits, interface. On garde le français.

## Ce qu'est Pli

Un lien = un pli. Elle reçoit un lien par WhatsApp, trouve une feuille fermée, la tire du
doigt, le message se découvre. Statique (GitHub Pages, servi sous
`leo-bernard38.github.io/Pli/`), **sans backend, sans compte, sans base de données**. Deux personnes, deux téléphones — pas un produit
publiable.

| Entrée | Pour qui | Contenu |
|---|---|---|
| `leo-bernard38.github.io/Pli/` | elle | les plis reçus (A1→A4), le journal (C1→C5) |
| `leo-bernard38.github.io/Pli/atelier/` | moi | déposer, fabriquer le lien (D0→D4, E1) |

Quatre types de pli — `inv` invitation, `pen` pensée, `poe` poème, `sou` souvenir. Les trois
courts voyagent **entièrement dans le fragment de l'URL** ; le poème est un fichier encodé du
dépôt dont le lien ne porte que le numéro (`#p=015-vhtq`).

TypeScript + Vite, **sans framework**, CSS natif, **zéro dépendance npm au runtime**. Deux
entrées Vite. Routage par `hashchange` — Pages ne réécrit aucune URL, toute URL profonde
tomberait en 404. Le fragment ne quitte jamais l'appareil : c'est **la** garantie du produit,
d'où pas de chiffrement, seulement `deflate-raw` + base64url préfixé d'une version.

## Les quatre fichiers qui portent l'état

| Fichier | Ce qu'il dit | Quand le lire |
|---|---|---|
| [`.claude/chantier.md`](.claude/chantier.md) | ce qui a réellement atterri, ce qui reste | **en premier**, chaque session |
| [`.claude/memo.md`](.claude/memo.md) | **toutes les valeurs déjà tranchées**, sur une page | avant d'écrire ou de relire |
| [`.claude/decisions.md`](.claude/decisions.md) | l'archive datée des arbitrages | seulement si une décision est en cause |
| [`docs/`](docs/README.md) | la spécification — **elle fait foi** | quand la fiche ne répond pas |

`design/` est une **archive figée** : on ne l'édite pas. Quand elle se trompe, on corrige
`docs/` et on note l'écart dans [docs/integration.md](docs/integration.md).

## Commandes

```sh
npm run dev        # les deux entrées
npm run build
npm run verifie    # la relecture déterministe — lexique, encres, invariants, mouvement
npm run types      # deux passes : tout le projet, puis src/lib/ sans la bibliothèque DOM
npm test           # codec.ts, dates.ts, le routeur — rien d'autre
```

Et ce qui tourne à côté, quand on y touche : `scripts/polices.py` (les quatre familles),
`scripts/fleches.py` (les deux tracés), `scripts/icones.py` (la planche). Chacun regénère son
dossier en entier — on ne retouche jamais leur sortie à la main. Le détail est dans
[docs/ressources.md](docs/ressources.md).

## Les invariants — ce qu'on ne casse jamais

Un lien parti n'a plus de version : il est dans une conversation, pour toujours.

1. **`#c=` et `#p=` restent lisibles pour toujours.** Un changement d'encodage prend un
   **nouveau préfixe de version**, il ne réécrit jamais l'ancien. Idem pour `v` dans le pli.
2. **Le nom d'un fichier de poème ne change jamais.** La moulinette **réutilise le jeton**
   d'un numéro déjà connu et **ne supprime jamais rien**.
3. **`codec.ts` est isomorphe Node + navigateur** — aucune API du DOM. C'est le module le
   plus testé du dépôt.
4. **Rien de secret dans le dépôt.** Le numéro WhatsApp `w` ne vit que dans le tiroir et dans
   un lien déjà envoyé. Seule l'empreinte du seuil entre, jamais la date.
5. **`plis-source/` ne se commite jamais.**
6. **Tout accès au stockage passe par `journal.ts` ou `tiroir.ts`**, et par eux seuls — ses
   plis à elle d'un côté, mes réglages d'atelier de l'autre, jamais mélangés. Dédoublonnage
   sur `h`, l'empreinte du payload — **jamais sur `n`**. La navigation privée dégrade
   proprement.
7. **Aucun tiers, jamais.** Pas de CDN, pas de mesure d'audience, pas de framework, pas de
   polyfill. On cible iOS 26 et Android 16, deux appareils connus.
8. **L'adresse se gèle au premier pli envoyé.** Aujourd'hui `leo-bernard38.github.io/Pli/`,
   un **site de projet** servi sous un sous-chemin, sans domaine personnalisé ni `CNAME`. Le
   préfixe `/Pli/` n'est écrit qu'une fois, dans `vite.config.ts` : le module le lit dans
   `import.meta.env.BASE_URL`, et rien du produit ne s'écrit à la racine de l'hôte. Tant
   qu'aucun lien n'est parti l'adresse peut encore devenir un vrai domaine ; après, elle est
   dans une conversation, pour toujours.

## Le rituel — comment une tâche se termine ici

Personne ne relit les diffs ligne à ligne. La revue est donc la seule relecture qui aura lieu
— mais elle coûte cher, alors elle se dépense là où elle sert.

**1 · La machine d'abord.** `npm run verifie` couvre le lexique, les étiquettes, les encres,
les propriétés animées, les accès au stockage, les tiers, les dépendances. **On ne demande
jamais à un agent ce que ce script vérifie.** Il tourne tout seul après chaque écriture, et
en CI.

**2 · On relit un lot, pas un fichier.** Un lot, c'est deux à quatre étapes qui vont
ensemble — A1 et son fond, le geste et sa transition. Écrire, faire tourner `verifie`,
relire le lot une fois.

**3 · Un seul relecteur par lot**, celui dont le domaine est touché :

| Ce que le lot touche | Le relecteur |
|---|---|
| un écran, ses mots, sa composition | `revue-ecran` |
| un geste, une animation, un chemin de chargement | `garde-fluidite` |
| `lib/`, la moulinette, le routeur, `package.json` | `garde-invariants` |

`/revue` ne lance les trois ensemble que pour **un écran qui part en production**. Le reste du
temps, un seul suffit.

**4 · Pas de sous-agent pour chercher.** Trouver un fichier, lire une doc, vérifier un
chiffre : c'est `grep`, `cat`, ou la fiche. Un sous-agent coûte le prix d'un contexte entier ;
on le paie pour un jugement, jamais pour une lecture.

**5 · Un refus n'attend pas.** On ne passe pas à l'étape suivante avec un refus derrière soi.
Puis on commite (`type: phrase courte en français, en minuscules`) et on coche l'étape dans
`.claude/chantier.md`.

## Quand tu ne sais pas

Le seul mode de défaillance qui coûte cher ici est l'invention plausible.

- **Une doc muette n'autorise pas à trancher.** Dis ce qui manque et demande.
- **Un chiffre se cite, il ne s'estime pas.** Ils sont tous dans
  [`.claude/memo.md`](.claude/memo.md), avec leur source.
- **Quatre mesures sont ouvertes** et ne se simulent pas
  ([docs/README.md](docs/README.md#les-mesures-à-faire-avant-de-sengager)). Si une tâche en
  dépend : fais tout le reste, laisse celle-là, dis-le.
- **Ce qui se voit se vérifie sur les deux téléphones**, jamais sur un émulateur — le grain,
  la cadence, le texte aux deux extrêmes. Aucun agent ne peut le faire à ta place.

## Conventions d'écriture

Lexique **normatif et fermé** : déplier · déposer · répondre · refermer · un pli · le volet ·
la pliure · l'atelier · nº 014. Jamais : ouvrir · créer · valider · champ · formulaire ·
compte · notification · erreur. Français, minuscules, tutoiement, phrases courtes. La liste
complète et les cinq règles de design sont dans [`.claude/memo.md`](.claude/memo.md).

**Petits diffs, docs courtes.** Un document qui dépasse ce qu'on lit d'une traite se coupe en
deux.

## Les gardes

`.claude/hooks/garde-irreversible.sh` refuse un commit qui emporte `plis-source/`, supprime un
fichier de `public/plis/`, modifie `design/`, ou fait entrer un numéro de téléphone ou la date
du seuil en clair. **On ne la contourne pas** : quand elle refuse, on corrige.
`.claude/hooks/verifie.sh` fait tourner `scripts/verifie.mjs` sur chaque fichier écrit et ne
parle que s'il a trouvé quelque chose.
