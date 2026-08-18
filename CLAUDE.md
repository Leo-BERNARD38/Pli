# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Le dépôt est en français : docs, code, commits, interface. On garde le français.

## Ce qu'est Pli

Un lien = un pli. Elle reçoit un lien par WhatsApp, trouve une feuille fermée, la tire du
doigt, le message se découvre. Statique (GitHub Pages, domaine `pli.re`), **sans backend,
sans compte, sans base de données**. Deux personnes, deux téléphones — pas un produit
publiable.

Deux entrées, deux bundles réellement distincts :

| Entrée | Pour qui | Contenu |
|---|---|---|
| `pli.re/` | elle | les plis reçus (A1→A4), le journal (C1→C5) |
| `pli.re/atelier/` | moi | déposer, fabriquer le lien (D0→D4, E1) |

Quatre types de pli — `inv` invitation, `pen` pensée, `poe` poème, `sou` souvenir. Les trois
courts voyagent **entièrement dans le fragment de l'URL** ; le poème est un fichier encodé du
dépôt dont le lien ne porte que le numéro (`#p=015-vhtq`).

## État du dépôt

**Documentation et design terminés, jalon 0 posé.** Il y a un `package.json`, deux entrées
Vite, `src/lib/` (codec, dates, routeur) avec ses tests, les deux workflows, et un pli en dur
qu'un lien remplace. Aucun style, aucune police, aucune peinture, aucun geste : c'est le
jalon 1 et le jalon 2 de [docs/roadmap.md](docs/roadmap.md).

Ce qui existe et sert : `docs/` (la spécification, elle fait foi), `design/` (l'archive figée
du design, **dont les cinq peintures** dans `design/handoff/assets/`), `public/icones/`
(livré, à servir tel quel), `public/CNAME` · `.nojekyll` · `404.html`, `scripts/icones.py`.
Les polices sont entrées au jalon 1 : les sources et leurs OFL dans `polices-source/`, les
woff2 sous-ensemblés dans `src/fonts/`, regénérés par `scripts/polices.py`
([docs/ressources.md](docs/ressources.md#les-polices)).

L'état vivant de la construction est dans [`.claude/chantier.md`](.claude/chantier.md).

Quatre mesures conditionnent des décisions et **ne se devinent pas** — plafond de longueur
d'URL, survie de `localStorage`, bac de stockage du navigateur WhatsApp, journal partagé ou
non avec l'app installée. Elles sont listées dans
[docs/README.md](docs/README.md#les-mesures-à-faire-avant-de-sengager). Ne pas trancher à leur
place : si une tâche en dépend, le dire.

## Commandes

```sh
npm install
npm run dev        # les deux entrées
npm run build
npm run types      # deux passes : tout le projet, puis src/lib/ sans la bibliothèque DOM
npm test           # codec.ts, dates.ts, le routeur — rien d'autre
```

Et ce qui tourne à côté :

```sh
# les quatre polices — regénère src/fonts/ en entier depuis polices-source/
# dépendances : fonttools, brotli
python3 scripts/polices.py

# la planche des icônes — regénère public/icones/ en entier
# dépendances : freetype-py, pillow, numpy, fonttools + les deux Google Fonts
python3 scripts/icones.py --pinyon PinyonScript-Regular.ttf \
                          --space-mono SpaceMono-Bold.ttf \
                          --og design/handoff/icones/og.png \
                          --sortie public/icones

# l'archive du design : aucun build, on ouvre le fichier
xdg-open design/handoff/index.html

# l'empreinte du seuil de l'atelier — fabriquée en local, seule à entrer dans le dépôt
node -e 'crypto.subtle.digest("SHA-256", new TextEncoder().encode("pli.seuil."+process.argv[1]))
  .then(b=>console.log(Buffer.from(b).toString("hex")))' 17082026

# ce que GitHub Pages sert vraiment (à refaire le jour où il change d'avis)
curl -sSI -H 'Accept-Encoding: br, gzip' https://pli.re/ | grep -i 'cache-control\|content-encoding'
```

Pas de lanceur de tests en dépendance : `node --test` lit les `.ts` sans compilation
(Node 22.18+, épinglé dans `engines` et dans les deux workflows). Les tests restent ceux de
`codec.ts`, `dates.ts` et du routeur — **pas de tests généralisés, pas de tests d'écran**.

## L'architecture, en dix lignes

TypeScript + Vite, **sans framework**, CSS natif (`@layer`, variables, animations),
**zéro dépendance npm au runtime**. Deux entrées Vite. Routage par `hashchange`, une fonction,
pas de librairie — GitHub Pages ne réécrit aucune URL, donc toute URL profonde tomberait en 404.

Le fragment ne quitte jamais l'appareil (spécification HTTP) : ni GitHub, ni un CDN, ni
WhatsApp en récupérant l'aperçu ne voient le contenu d'un pli. C'est **la** garantie du
produit, plus forte qu'un chiffrement dont la clé serait dans le bundle — d'où : pas de
chiffrement, seulement `deflate-raw` + base64url préfixé d'une version.

Quatre jeux de données, aucun serveur : le pli dans l'URL, le poème dans `public/plis/*.txt`,
son journal dans son `localStorage`, mon historique dans le mien. Les deux journaux ne se
parlent jamais. L'arborescence cible est dans
[docs/architecture.md](docs/architecture.md#arborescence-cible).

## Les invariants — ce qu'on ne casse jamais

Un lien parti n'a plus de version : il est dans une conversation, pour toujours. Tout ce qui
suit en découle.

1. **`#c=` et `#p=` restent lisibles pour toujours.** Un changement d'encodage prend un
   **nouveau préfixe de version**, il ne réécrit jamais l'ancien. Idem pour `v` dans le pli.
2. **Le nom d'un fichier de poème ne change jamais.** `public/plis/015-vhtq.txt` est une
   adresse publique dès le premier envoi. La moulinette **réutilise le jeton** d'un numéro
   déjà connu et **ne supprime jamais rien**.
3. **`codec.ts` est isomorphe Node + navigateur** — aucune API du DOM, sous peine de deux
   encodages qui divergent. Un lien cassé est un pli perdu : c'est le module le plus testé.
4. **Rien de secret dans le dépôt.** Tout ce qui est buildé est public : le numéro WhatsApp
   `w` ne vit que dans le tiroir (`localStorage`, mon téléphone) et dans le lien d'une
   invitation déjà envoyée — jamais un fichier, jamais une variable de build.
5. **`plis-source/` ne se commite jamais.** L'historique git est définitif ; un poème commité
   en clair une fois y reste pour toujours.
6. **Tout accès à `localStorage` passe par `journal.ts`.** Le dédoublonnage se fait sur `h`,
   l'empreinte du payload — **jamais sur `n`**. La navigation privée doit dégrader proprement :
   le pli s'affiche, il n'est simplement pas archivé.
7. **Aucun tiers, jamais.** Pas de CDN de polices, pas de mesure d'audience, pas une connexion
   en dehors de `pli.re`. Pas de framework, pas de librairie d'animation, pas de polyfill —
   on cible iOS 26 et Android 16, deux appareils connus.
8. **`design/` est une archive figée.** On ne l'édite pas : quand il se trompe, on corrige
   `docs/` et on note l'écart dans
   [docs/integration.md](docs/integration.md#ce-qui-a-changé-depuis-le-design).
9. **Le domaine ne change plus.** Il est dans chaque lien déjà envoyé.

## Où est la vérité

| Question | Le fichier qui tranche |
|---|---|
| Ce qu'on construit | `docs/` — **il gagne toujours** contre `design/` |
| Les valeurs de la DA | [`design/handoff/pli.css`](design/handoff/pli.css) |
| Les écarts entre les deux | [docs/integration.md](docs/integration.md) |
| Le lexique | [docs/design-system.md](docs/design-system.md#ton-et-vocabulaire) — fermé et normatif |

**Les `<style>` des prototypes ne font pas foi.** `createur.html` et `createur-bureau.html`
recopient une partie de `pli.css` avec de légères divergences ; `lecteur.html` définit des
classes qui n'existent pas ailleurs. La liste de ce qu'on remonte et de ce qu'on laisse est
dans [docs/integration.md](docs/integration.md#reprendre-plicss).

## Avant d'écrire un écran

Lire [docs/integration.md](docs/integration.md) — toujours, il dit ce qui a changé depuis les
maquettes — puis [docs/parcours.md](docs/parcours.md) pour l'enchaînement.

Les cinq règles servent de critères de revue ; un écran qui en casse une est à refaire :

1. **Un pli = un écran.** Jamais de défilement dans un pli.
2. **Le carmin est l'action.** Une seule couleur agit.
3. **La pliure est physique.** Elle suit le doigt, résiste dans le mauvais sens, retombe si on hésite.
4. **Le papier découle du type**, jamais un choix offert au dépôt.
5. **Rien à signer.** Pas de compte, pas de notification, pas de brouillon nommé.

Et : contenu **aligné en bas** (on ne centre jamais verticalement), **une seule marge** de
26px, un titre / une griffe / une action par pli, étiquettes **en minuscules dans le code**
(les capitales viennent de `text-transform`), texte testé aux deux extrêmes.

## Avant d'écrire du code qui charge ou qui bouge

[docs/chargement.md](docs/chargement.md) et [docs/fluidite.md](docs/fluidite.md) — chacun
porte sa liste de ce qui fait échouer une revue. L'essentiel :

- **Rien ne se charge avant le texte du premier écran.** A1 en **5 requêtes** : le document
  (≤ 14 ko gzip, CSS et module d'ouverture inline), trois polices préchargées, une peinture.
  Bodoni n'est pas du premier écran. `font-display: block`, **jamais `swap`**.
- Si le hash est un `#p=`, **lancer le `fetch` en toute première instruction**, avant de
  décoder quoi que ce soit.
- **Pendant le geste, seuls `transform` et `opacity` bougent**, sur exactement deux couches.
  Une seule lecture de géométrie, avant la première image. Jamais une variable CSS écrite sur
  `:root` : ça recalcule le style de tout l'arbre pour deux éléments. `will-change` posé au
  `pointerdown`, **retiré au `transitionend`**.
- Du `pointerdown` à la fin de la transition (460 ms), le fil principal ne fait **rien
  d'autre**. L'écriture du journal attend `transitionend` (plus un filet sur `pagehide`).
- Deux textures décodées vivantes au maximum — une peinture de 1536 × 2752 coûte 17 Mo en
  mémoire décodée, quelle qu'en soit la taille d'affichage.
- **On mesure sur les deux téléphones, jamais sur un émulateur.**

## Le rituel — comment une tâche se termine ici

Ce dépôt est écrit avec des agents, et personne ne relit les diffs ligne à ligne. La revue
n'est donc pas une politesse de fin de tâche, c'est la seule relecture qui aura lieu.

| Ce que tu viens d'écrire | Qui le relit |
|---|---|
| un écran | `revue-ecran`, puis `gardien-lexique` |
| un geste, une animation, un chemin de chargement | `garde-fluidite` |
| `lib/`, la moulinette, le routeur, `package.json` | `garde-invariants` |
| un écran fini | `/revue` — il lance les trois premiers ensemble |
| un jalon entier | `/jalon`, qui le découpe avant d'écrire quoi que ce soit |

Deux règles qui vont avec :

- **Petits diffs.** Une étape = un écran, un module, un fichier de configuration. Un gros
  diff est un diff que personne ne lit.
- **Un refus n'attend pas.** On ne passe pas à l'étape suivante avec un refus de relecteur
  derrière soi.

## Quand tu ne sais pas

Le seul mode de défaillance qui coûte cher ici est l'invention plausible. Une règle qui n'est
pas dans `docs/` n'existe pas.

- **Une doc muette n'autorise pas à trancher.** Ni sur une valeur de la DA, ni sur un texte
  d'interface, ni sur une des quatre mesures ouvertes. Dis ce qui manque et demande.
- **Un chiffre se cite, il ne s'estime pas.** 26px, 34 %, 460 ms, 0,55 px/ms, 14 ko gzip,
  `.62` — tous viennent d'un fichier, et le fichier se nomme.
- **Le README décrit la cible, pas l'existant** : `npm run dev` et `npm test` n'existeront
  qu'au jalon 0.
- Ce qui reste ouvert est ouvert exprès : les quatre mesures, et « modifier un pli après
  dépôt » ([docs/integration.md](docs/integration.md#les-cinq-questions-laissées-ouvertes-par-le-design)).

## Conventions d'écriture

Le lexique est **normatif et fermé**. On dit : déplier · déposer · répondre · refermer ·
un pli · le volet · la pliure · l'atelier · nº 014. On ne dit pas : ouvrir · envoyer un
message · créer · valider · champ · formulaire · compte · notification · erreur.

Français, minuscules, tutoiement, phrases courtes adressées à une personne. Pas
d'exclamation, pas d'emoji, pas de majuscule d'insistance. Une seule exception nommée : le
message WhatsApp pré-rempli d'A3 porte un cœur.

Les messages de commit suivent l'existant : `type: phrase courte en français, en minuscules`.

Règle des docs : **courtes**. Un document qui dépasse ce qu'on lit d'une traite se coupe en
deux.

## Structure agents

**`.claude/agents/`** — quatre relecteurs, chacun sur un domaine : `revue-ecran` (les cinq
règles, le gabarit, l'accessibilité), `gardien-lexique` (les mots visibles et les noms du
code), `garde-fluidite` (le geste et le chargement), `garde-invariants` (ce qui ne se rouvre
pas : le codec, les noms de fichiers, le journal, les secrets, les tiers).

**`.claude/commands/`** — `/chantier` (le prompt unique : lire l'état, planifier, découper,
écrire, relire, commiter, noter — se lance en mode plan d'abord), `/revue` (la revue complète
d'un écran), `/jalon` (cadrer un jalon avant d'écrire), `/seuil` (fabriquer l'empreinte),
`/etat` (où en est le jalon courant).

**`.claude/chantier.md`** — l'**état** du chantier, à ne pas confondre avec le plan
(`docs/roadmap.md`, qui ne bouge pas). Il dit ce qui a réellement atterri, ce que les mesures
bloquent, et les décisions prises en chemin. **Une nouvelle session le lit en premier**, et
toute étape terminée s'y coche.

**`.claude/hooks/`** — deux gardes déterministes, parce qu'une règle écrite en prose se
contourne sans le vouloir :

- `garde-irreversible.sh` refuse un commit qui emporte `plis-source/`, supprime ou renomme un
  fichier de `public/plis/`, modifie `design/`, ou fait entrer dans du code un numéro de
  téléphone ou la date du seuil en clair. Les exemples délibérés de `docs/` et `design/` sont
  exemptés. **On ne la contourne pas** : quand elle refuse, on corrige.
- `rappel-relecteur.sh` nomme, après chaque écriture dans `src/`, le relecteur qui va avec le
  fichier.

`.claude/settings.json` ferme en plus l'écriture dans `design/`, la lecture de `plis-source/`
et `git add -f`, et fait demander avant un `git push` ou une écriture dans `public/plis/`.
