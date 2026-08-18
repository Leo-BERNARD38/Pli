# Chantier — où en est la construction

Ce fichier est **l'état**, pas le plan. Le plan est [docs/roadmap.md](../docs/roadmap.md) et
il ne bouge pas ; ce fichier dit ce qui a réellement atterri, et il se met à jour à chaque
étape terminée. C'est ce qu'une nouvelle session lit en premier pour savoir où reprendre.

Une étape n'est cochée que lorsqu'elle est **écrite, relue et commitée**.

## Jalon courant

**Jalon 0 — socle.** Écrit, relu, commité. Il reste deux gestes qui ne se font qu'à la main,
et personne ne peut les faire à ma place : régler GitHub Pages et le domaine, puis ouvrir un
lien sur son téléphone.

## Ce qui existe

- [x] `docs/` — la spécification, complète, elle fait foi
- [x] `design/` — l'archive figée, dont les cinq peintures dans `design/handoff/assets/`
- [x] `public/icones/` — icônes, manifeste et `og.png`, à servir tels quels
- [x] `scripts/icones.py` — la planche des icônes
- [x] `.claude/` — relecteurs, commandes, gardes
- [x] le socle npm — `package.json`, `tsconfig.json`, `tsconfig.isomorphe.json`, `vite.config.ts`
- [x] `src/lib/` — `codec.ts`, `dates.ts`, `routeur.ts`, avec leurs tests
- [x] les deux entrées — `index.html`, `atelier/index.html`

## Jalon 0 — socle

- [x] `package.json`, Vite + TypeScript, deux entrées (`/` et `/atelier/`)
- [x] `src/lib/codec.ts` — isomorphe Node + navigateur, avec ses tests
- [x] `src/lib/dates.ts` — les formats français, avec ses tests
- [x] le routeur par hash
- [x] `CNAME`, `.nojekyll`, `404.html`, `base: '/'`
- [x] les deux workflows GitHub — vérification sur PR, déploiement sur `main`
- [x] un pli en dur, sans style
- [ ] **à la main, chez moi** : Pages activé, les enregistrements DNS de `pli.re`,
      « Enforce HTTPS », puis le `curl` de vérification
      ([docs/hebergement.md](../docs/hebergement.md#avant-le-premier-déploiement))
- [ ] **à la main, sur les deux téléphones** : le lien ouvert chez elle

**Fin du jalon :** un lien fabriqué à la main s'ouvre sur son téléphone.

Ce qui est vérifié pour de bon : 31 tests passent, `npm run types` compile deux fois (dont
`src/lib/` sans la bibliothèque DOM), et dans Chromium un lien `#c=` **encodé sous Node** se
décode et remplace le pli en dur — l'isomorphisme du codec n'est pas qu'une intention. Un
lien abîmé et un poème introuvable laissent la page nue ; le hash se suit sans rechargement.
Poids du premier écran, cache vide : **1,12 ko gzip** de document et **1,21 ko gzip** de
module, loin des 14 ko — mais ce sont deux requêtes, pas une (voir la décision 5).

## Les mesures — aucune ne se devine

Elles sont décrites dans [docs/README.md](../docs/README.md#les-mesures-à-faire-avant-de-sengager).
Tant qu'une case est vide, ce qu'elle conditionne ne se tranche pas.

- [ ] **1 · le plafond de longueur d'un lien**, WhatsApp → iOS → Safari → fixe le compteur de
      signes de l'atelier
- [ ] **2 · la survie de `localStorage`** au plafond de sept jours de WebKit
- [ ] **3 · le bac de stockage** du navigateur intégré de WhatsApp
- [ ] **4 · le journal de l'app installée** est-il celui de Safari → décide de l'existence de
      l'écran `#/installer`

Aucune des quatre ne bloquait le jalon 0.

## Décisions prises en construisant

Ce que les docs ne tranchaient pas et qui a été tranché en chemin. Une ligne par décision,
avec sa date. Si elle contredit une doc, la doc se corrige et l'écart se note dans
[docs/integration.md](../docs/integration.md).

- **18/08/2026 — le lanceur de tests est `node --test`, sans dépendance.** Node 22.18+ lit
  les `.ts` sans compilation. La version est épinglée dans `engines` et dans les deux
  workflows : elle fait partie du contrat du codec.
- **18/08/2026 — les dates affichées vont du relatif à l'absolu** : « aujourd'hui », « hier »,
  « il y a N jours » (N en lettres, de deux à six), puis la date nommée « 3 septembre »,
  l'année n'apparaissant que hors année courante. L'écart se compte en **jours civils**, pas
  en tranches de vingt-quatre heures. Les noms de mois sont écrits à la main : `Intl` varie
  avec la bibliothèque ICU de l'appareil, et une date doit se lire pareil sur les deux
  téléphones. Les docs étaient muettes ; seul l'horodatage de stockage était fixé.
- **18/08/2026 — `theme-color` porte le sable `#E9E2D2`** dans les deux entrées, et le carmin
  reste le `theme_color` du manifeste. `installation.md` et `appareils.md` se contredisaient ;
  `installation.md` a été corrigé et l'écart est noté dans
  [docs/integration.md](../docs/integration.md#structure).
- **18/08/2026 — `404.html` ne dit que « tes plis ↑ »**, sur crème. La formule est déjà
  normative (A4) : aucune phrase nouvelle n'a été inventée pour une page d'égarement.
- **18/08/2026 — le module d'ouverture n'est pas encore inline.**
  [docs/chargement.md](../docs/chargement.md) veut A1 en une requête, document et module
  compris ; au jalon 0 l'entrée reste un `<script type="module">` empreinté. **L'inlining du
  CSS et du module devient une étape nommée du jalon 2**, par un plugin Vite écrit à la main
  — pas de dépendance. Tant qu'il n'existe pas, une page périmée de dix minutes ne se suffit
  pas à elle-même ([docs/mises-a-jour.md](../docs/mises-a-jour.md#1-une-page-périmée-doit-rester-lisible)).
- **18/08/2026 — `tsconfig.isomorphe.json` fait vérifier l'isomorphisme par la machine.**
  `codec.ts` et `dates.ts` compilent sans la bibliothèque DOM : un `document.` y est refusé.
  La limite connue : les types de Node laissent passer `Buffer` et `node:fs`, qui n'existent
  pas dans le navigateur — ce côté-là reste à la relecture.
- **18/08/2026 — le lecteur suit `hashchange` dès maintenant**, au lieu de lire le hash une
  fois. Le `fetch` d'un poème part toujours en première instruction ; les changements de hash
  qui suivent réutilisent le routeur, sans rechargement.

## Ce que les relecteurs demandent pour la suite

Rien de tout cela n'est un refus au jalon 0 ; tout est à prendre au jalon suivant, et c'est
écrit ici pour ne pas le redécouvrir.

**Au jalon 1, en reprenant `pli.css`** — le pli est un conteneur plat : ni `.tete`, ni
`.corps`, ni `.volet` (`design/handoff/pli.css` §4-5). C'est `.corps` qui porte l'alignement
en bas ; sans lui, l'arrivée du gabarit est une réécriture du balisage. Le cachet est le
premier nœud du document alors qu'il se pose en bas, à cheval sur la pliure : l'ordre de
lecture au clavier et l'ordre visuel divergeront. Le `<ul class="faits">` porte un retrait
par défaut, qui est un second retrait horizontal — à neutraliser. Et le `↑` du 404 reste un
caractère : les deux flèches se tracent au jalon 1.

**Au jalon 2, pour le geste** — décider dès le découpage que `.pli` est la **couche du
dessous** : le geste demande deux couches, une par `translate3d`, et le `<button>` « déplier »
du clavier n'a aujourd'hui aucun endroit où vivre.

**Au jalon 1, pour mesurer** — poser un `performance.mark('a1')` juste après l'écriture du
texte d'A1 : Safari ne donne pas de LCP, et la colonne « Mesuré le » de
[docs/chargement.md](../docs/chargement.md#le-budget-écran-par-écran) reste vide sans lui.

**Au jalon 2, dans `vite.config.ts`** — le jour où l'atelier importera `codec.ts`, Rollup
sortira un chunk commun et Vite posera un `modulepreload` dans le document **du lecteur** :
une requête de plus avant le premier texte. Soit `manualChunks` garde une entrée = un fichier,
soit le plugin d'inlining inline **le graphe entier**, pas seulement le fichier d'entrée.

**Un écart de doc à réconcilier** : `chargement.md` annonce le favicon SVG à 0,3 ko,
`installation.md` et `ressources.md` à 2,1 ko. Le fichier livré fait 2 180 octets.

## Ce qui reste ouvert

- **L'alphabet du jeton d'un poème.** Le routeur n'accepte que `numéro-jeton` en minuscules et
  chiffres. [docs/donnees.md](../docs/donnees.md#la-moulinette) dit « quatre signes » et rien
  de plus. Être plus large que la moulinette est sans danger, l'inverse casserait un lien déjà
  parti : **l'alphabet se décide dans le routeur et la moulinette ensemble**, au jalon 6.
- **Les versions des actions GitHub** n'ont pas pu être vérifiées depuis cette machine (l'API
  de GitHub n'y est pas ouverte). Si un workflow tombe sur une action dépréciée, monter la
  version majeure — le contenu des deux fichiers, lui, ne bouge pas.
