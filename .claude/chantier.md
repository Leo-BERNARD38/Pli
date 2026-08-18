# Chantier — où en est la construction

Ce fichier est **l'état**, pas le plan. Le plan est [docs/roadmap.md](../docs/roadmap.md) et
il ne bouge pas ; ce fichier dit ce qui a réellement atterri, et il se met à jour à chaque
étape terminée. C'est ce qu'une nouvelle session lit en premier pour savoir où reprendre.

Une étape n'est cochée que lorsqu'elle est **écrite, relue et commitée**.

## Jalon courant

**Jalon 1 — mesures et fondations.** Les fondations sont écrites, relues et commitées : les
polices, les deux flèches, le gabarit, les cinq peintures, le préchargement. **Les mesures,
elles, ne sont pas faites** — et elles sont la moitié du jalon. Aucune ne se simule : elles
se font sur les deux téléphones.

Le jalon 0 reste ouvert lui aussi sur ses deux gestes manuels : régler GitHub Pages et le
domaine, puis ouvrir un lien sur son téléphone.

## Ce qui existe

- [x] `docs/` — la spécification, complète, elle fait foi
- [x] `design/` — l'archive figée, dont les cinq peintures dans `design/handoff/assets/`
- [x] `public/icones/` — icônes, manifeste et `og.png`, à servir tels quels
- [x] `scripts/icones.py` — la planche des icônes
- [x] `.claude/` — relecteurs, commandes, gardes
- [x] le socle npm — `package.json`, `tsconfig.json`, `tsconfig.isomorphe.json`, `vite.config.ts`
- [x] `src/lib/` — `codec.ts`, `dates.ts`, `routeur.ts`, avec leurs tests
- [x] les deux entrées — `index.html`, `atelier/index.html`
- [x] `polices-source/` et `src/fonts/` — les quatre familles, sources et sous-ensembles
- [x] `src/styles/` — `tokens.css` et `pli.css`
- [x] `src/textures/` — les cinq peintures, en définition native
- [x] `src/fleches.html` — les deux tracés

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

## Jalon 1 — mesures et fondations

- [x] les quatre polices, sources et OFL dans `polices-source/`, sous-ensembles dans
      `src/fonts/`, regénérés par `scripts/polices.py`
- [x] les deux flèches tracées — `scripts/fleches.py`, `src/fleches.html`
- [x] `tokens.css` et `pli.css` repris de `design/`, avec les quatre corrections
      d'[integration.md](../docs/integration.md#corrections-à-appliquer)
- [x] les cinq peintures en définition native dans `src/textures/`
- [x] le pli en dur posé sur le gabarit — tête, corps, volet, cachet
- [x] le préchargement des trois polices d'A1, par un greffon Vite maison
- [x] les balises `og:` en place — déjà posées au jalon 0, vérifiées sur la sortie de build
- [x] le budget de chargement rempli **de ce qui se mesure en local**
      ([chargement.md](../docs/chargement.md#le-budget-écran-par-écran))
- [ ] **à la main, sur les deux téléphones** : les mesures 1, 2 et 3 (voir plus bas)
- [ ] **à la main** : l'aperçu du lien vérifié en s'envoyant le lien dans une vraie
      conversation WhatsApp ([partage.md](../docs/partage.md#vérifier-un-aperçu))
- [ ] **à la main** : le texte d'A1 peint en moins d'une seconde en 4G, cache vide, sur les
      deux téléphones — le `performance.mark('a1')` est posé et attend

La roadmap ne donne pas de phrase de fin au jalon 1, et on n'en invente pas. Le jalon est
fini quand cette liste est cochée : les fondations seules ne ferment pas un jalon dont la
moitié s'appelle « mesures ».

### Ce qui est vérifié pour de bon

Les 34 tests passent, `npm run types` compile deux fois, et dans Chromium en 390 × 844 à 3× :
le gabarit tient, les quatre polices se posent, un `#c=` **encodé sous Node** remplit le même
balisage sans rechargement, un lien abîmé laisse la page nue sans la vider, le tiret cadratin
et les accents français rendent, et `performance.mark('a1')` se pose une fois.

Poids réels, après build : **5,8 ko gzip** pour le premier écran (1,7 de document, 2,7 de
CSS, 1,4 de module) et **52,6 ko** pour les trois polices d'A1 — les deux largement sous
leurs cibles de 14 et 90 ko. Les cinq woff2 sont reproductibles **au bit près**.

En revanche : **2 requêtes avant le premier texte au lieu d'une**, et **6 avant A1 complet au
lieu de 5** — parce que le CSS et le module ne sont pas encore inline. C'est l'étape nommée
du jalon 2 qui ramènera 2 à 1 et 6 à 5.

## Les mesures — aucune ne se devine

Elles sont décrites dans [docs/README.md](../docs/README.md#les-mesures-à-faire-avant-de-sengager).
Tant qu'une case est vide, ce qu'elle conditionne ne se tranche pas.

- [ ] **1 · le plafond de longueur d'un lien**, WhatsApp → iOS → Safari → fixe le compteur de
      signes de l'atelier
- [ ] **2 · la survie de `localStorage`** au plafond de sept jours de WebKit
- [ ] **3 · le bac de stockage** du navigateur intégré de WhatsApp
- [ ] **4 · le journal de l'app installée** est-il celui de Safari → décide de l'existence de
      l'écran `#/installer`

Les trois premières appartiennent au jalon 1 et **le tiennent ouvert**. Aucune ne bloquait ce
qui a été construit : les fondations ne dépendent d'aucune des quatre.

## Décisions prises en construisant

Ce que les docs ne tranchaient pas et qui a été tranché en chemin. Une ligne par décision,
avec sa date. Si elle contredit une doc, la doc se corrige et l'écart se note dans
[docs/integration.md](../docs/integration.md).

### Jalon 0

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
  compris ; l'entrée reste un `<script type="module">` empreinté, et depuis le jalon 1 une
  feuille de style empreintée l'accompagne. **L'inlining du CSS et du module est une étape
  nommée du jalon 2**, par un greffon Vite écrit à la main — pas de dépendance. Tant qu'il
  n'existe pas, une page périmée de dix minutes ne se suffit pas à elle-même
  ([docs/mises-a-jour.md](../docs/mises-a-jour.md#1-une-page-périmée-doit-rester-lisible)).
- **18/08/2026 — `tsconfig.isomorphe.json` fait vérifier l'isomorphisme par la machine.**
  `codec.ts` et `dates.ts` compilent sans la bibliothèque DOM : un `document.` y est refusé.
  La limite connue : les types de Node laissent passer `Buffer` et `node:fs`, qui n'existent
  pas dans le navigateur — ce côté-là reste à la relecture.
- **18/08/2026 — le lecteur suit `hashchange` dès maintenant**, au lieu de lire le hash une
  fois. Le `fetch` d'un poème part toujours en première instruction ; les changements de hash
  qui suivent réutilisent le routeur, sans rechargement.

### Jalon 1

- **18/08/2026 — les peintures se servent en définition native.** Décision prise avec toi :
  1536 × 2752, 1296 × 2304 pour le drapé, copiées telles quelles. Régénérer ≥ 1800 aurait
  demandé un nouveau tirage de chaque toile, qui ne serait pas identique — et au-delà de
  1080 de large, rien n'est visible de plus sur son téléphone
  ([ressources.md](../docs/ressources.md#la-règle-de-définition)).
- **18/08/2026 — la plage de caractères des sous-ensembles vaut pour les quatre familles.**
  `ressources.md` ne donnait la plage exacte que pour Newsreader. Bodoni porte aussi le titre
  en cours de frappe dans l'atelier, du texte libre en casse normale : le réduire à
  « capitales, chiffres, ponctuation » casserait un titre accentué en minuscules.
- **18/08/2026 — `U+2013-2014` entre dans la plage.** L'exemple de `ressources.md` oubliait
  le tiret cadratin, que `chargement.md` nomme pourtant dans la ponctuation française à
  garder. L'exemple a été corrigé. Au passage : `U+202F`, l'espace fine insécable, n'existe
  que dans Pinyon Script — les trois autres familles la laissent à la police de secours.
  C'est une espace, rien ne se voit.
- **18/08/2026 — le bytecode TrueType ne part pas dans les woff2.** Ni CoreText sur iOS ni
  FreeType tel que Chrome l'emploie sur Android ne l'exécutent à ces corps, et il pesait un
  tiers du fichier sur Pinyon. Deux appareils connus, pas le web.
- **18/08/2026 — Newsreader est figé à `opsz` 18**, la valeur par défaut de la police
  elle-même. La voix est composée entre 23 et 31px, juste au-dessus. Bodoni est la seule
  famille qui garde un axe.
- **18/08/2026 — les deux flèches sont dessinées, pas tracées depuis Bodoni.** Décision prise
  avec toi. **Bodoni Moda n'a ni `U+2191` ni `U+2192`** — ni la source, ni les sous-ensembles
  `math` et `symbols` servis par Google : le `↑` des maquettes venait de la police de secours
  du système, et il n'y avait aucun dessin d'origine à reprendre. Les épaisseurs sont
  mesurées sur Bodoni à la coupe où la flèche vit (graisse 700, `opsz` 22 → contraste
  15,6 : 1), les proportions sur le `↑` de Space Mono Bold. Les flancs restent droits : une
  concavité aurait demandé un chiffre que personne n'a mesuré.
  **À confirmer** : un didone porte son contraste sur l'axe vertical, donc le `→` obtenu par
  rotation a une hampe horizontale pleine — l'inverse de la logique du didone. Le dessin est
  cohérent avec lui-même, et la doc le dit ; si ça déplaît, c'est un mot à dire.
- **18/08/2026 — la classe `.champ` devient `.ligne`.** « champ » est sur la liste fermée du
  lexique, que `CLAUDE.md` désigne comme normative, alors qu'`integration.md` recopiait la
  classe telle quelle du design. Le lexique gagne ; `.champ__nom` et `.champ--titre` suivent,
  les docs sont corrigées, et rien n'appelait encore la classe. Au passage `@keyframes nudge`
  devient `invite`, le mot que la doc emploie déjà.
- **18/08/2026 — le plateau, c'est le corps de la page.** La classe `.plateau` de la
  section 7 ne servait qu'aux planches de documentation, mais les réglages, eux, sont réels :
  `100dvh`, `env(safe-area-inset-*)`, `-webkit-text-size-adjust`, `overscroll-behavior`
  ([appareils.md](../docs/appareils.md#les-réglages-de-page)). **Le pli y est centré** — les
  docs disent « on ne l'élargit pas, on l'entoure » et rien de plus ; ce qui se passe quand
  la fenêtre fait moins de 780px de haut se tranche avec A1, au jalon 2.
- **18/08/2026 — le filet de focus s'écrit en fin de feuille.** À spécificité égale c'est
  l'ordre qui tranche, et tous les `all: unset` sont au-dessus : écrit avant, il n'existait
  pas. Il passe au rose sur encre et au crème sur carmin, sinon il serait invisible là où il
  compte.
- **18/08/2026 — le cachet porte le numéro seul**, « 014 » et non « nº 014 » : la formule ne
  tient pas dans une pastille de 38px composée à 10px. C'est ce que montre la maquette, et le
  « nº » reste dans la prose.
- **18/08/2026 — le volet du pli en dur reste vide.** Ce qui s'y écrit — l'invite, « déplier »
  et sa flèche — n'a de sens qu'avec le geste. Le placer maintenant aurait demandé d'inventer
  la composition d'A1.

## Ce que les relecteurs demandent pour la suite

**Au jalon 2, pour le geste** — `.pli` est la **couche du dessous** : le geste demande deux
couches, une par `translate3d`. Le `<button>` « déplier » du clavier a maintenant un endroit
où vivre — le volet — mais il n'y est pas encore, faute de geste à déclencher.

**Au jalon 2, pour le chargement** — l'inlining du CSS et du module, par un greffon Vite écrit
à la main. Et le jour où l'atelier importera `codec.ts`, Rollup sortira un chunk commun et
Vite posera un `modulepreload` dans le document **du lecteur** : une requête de plus avant le
premier texte. Soit `manualChunks` garde une entrée = un fichier, soit le greffon d'inlining
inline **le graphe entier**, pas seulement le fichier d'entrée.

**Au jalon 2, pour A1 et A2** — trois choses restent en l'air, notées dans
[integration.md](../docs/integration.md#ce-qui-reste-à-trancher-avec-a1) : le fond d'A1
(`parcours.md` dit le rideau, la maquette montre un papier crème), l'empilement de
`.image--pleine` avec le texte, et la composition des faits.

**Au jalon 5, pour l'atelier** — `index.html` embarque `#fleche-droite` sans s'en servir : le
seul `→` du produit est dans l'atelier. Le fragment reste monolithique pour n'avoir qu'une
chose à recopier et une seule à comparer ; à rouvrir si les 219 octets gzip gênent.

## Ce qui reste ouvert

- **L'alphabet du jeton d'un poème.** Le routeur n'accepte que `numéro-jeton` en minuscules et
  chiffres. [docs/donnees.md](../docs/donnees.md#la-moulinette) dit « quatre signes » et rien
  de plus. Être plus large que la moulinette est sans danger, l'inverse casserait un lien déjà
  parti : **l'alphabet se décide dans le routeur et la moulinette ensemble**, au jalon 6.
- **Les versions des actions GitHub** n'ont pas pu être vérifiées depuis cette machine (l'API
  de GitHub n'y est pas ouverte). Si un workflow tombe sur une action dépréciée, monter la
  version majeure — le contenu des deux fichiers, lui, ne bouge pas.
