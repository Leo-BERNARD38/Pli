# Chantier — où en est la construction

Ce fichier est **l'état**, pas le plan. Le plan est [docs/roadmap.md](../docs/roadmap.md) et
il ne bouge pas ; ce fichier dit ce qui a réellement atterri, et il se met à jour à chaque
étape terminée. C'est ce qu'une nouvelle session lit en premier pour savoir où reprendre.

Une étape n'est cochée que lorsqu'elle est **écrite, relue et commitée**.

## Jalon courant

**Jalon 2 — le pli et le geste.** En cours. Le document du lecteur se suffit désormais à
lui-même ; A1, le geste, A2 et C4 suivent.

Les jalons 0 et 1 restent ouverts sur leurs gestes manuels, et eux seuls : régler GitHub
Pages et le domaine, ouvrir un lien sur son téléphone, et les trois mesures du jalon 1.
Aucun ne bloque le jalon 2.

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

### Les trois refus de relecteurs, et ce qu'ils ont trouvé

Aucun n'est resté debout, et deux valaient le détour :

- **`.pli[hidden]` ne masquait rien.** `display: flex` est une déclaration d'auteur : elle
  bat le `[hidden]` de la feuille du navigateur. Un lien abîmé affichait donc **un pli qui
  n'était pas le sien** — l'inverse exact de ce que le jalon 0 croyait avoir vérifié, parce
  qu'il avait regardé l'attribut et non le rendu.
- **Le `fetch` d'un poème ne partait plus en première instruction.** Le module respectait la
  lettre, mais une feuille de style bloquante gèle l'exécution d'un module : mesuré avec 60 ms
  de latence, la demande partait à 153 ms au lieu de 90. Un aller-retour complet ajouté sur
  le seul écran d'attente du produit. Réparé par cinq lignes inline dans le `<head>`, avant
  la feuille — **elles ont disparu au jalon 2**, avec la feuille bloquante.
- **Le texte du pli n'était pas sélectionnable.** `user-select: none` du cadre cascadait
  jusqu'à la voix. Il reste sur le cadre, pour le geste ; `.corps` le rend au texte.

### Ce qui est vérifié pour de bon

Les 34 tests passent, `npm run types` compile deux fois, et dans Chromium en 390 × 844 à 3× :
le gabarit tient, les quatre polices se posent, un `#c=` **encodé sous Node** remplit le même
balisage sans rechargement, un lien abîmé laisse la page nue sans la vider, le tiret cadratin
et les accents français rendent, et `performance.mark('a1')` se pose une fois.

Poids réels, après build : **5,8 ko gzip** pour le premier écran (1,7 de document, 2,7 de
CSS, 1,4 de module) et **52,6 ko** pour les trois polices d'A1 — les deux largement sous
leurs cibles de 14 et 90 ko. Les cinq woff2 sont reproductibles **au bit près**.

En revanche : **2 requêtes avant le premier texte au lieu d'une**, et **6 avant A1 complet au
lieu de 5** — parce que le CSS et le module n'étaient pas encore inline. **Réglé au jalon 2**,
première étape : c'est une requête avant le premier texte, et le document pèse 5,86 ko gzip.

## Jalon 2 — le pli et le geste

- [x] le document du lecteur se suffit à lui-même — gabarit et module inline, par le greffon
      `pli-inliner-le-document` de `vite.config.ts` ; **1 requête** avant le premier texte,
      **5,86 ko gzip**, plafond de 14 ko tenu par le build
- [ ] le pli tient dans l'écran, quelle que soit la hauteur visible
- [ ] A1 · l'attente, pour les quatre types
- [ ] A2 · la découverte — invitation, pensée, souvenir
- [ ] la vague 3 — la texture du type, Bodoni, le CSS du type, décodés pendant qu'elle
      regarde le volet
- [ ] le geste — seuil, élan, caoutchouc, alternative clavier, `prefers-reduced-motion`
- [ ] C4 · le lien abîmé
- [ ] le plafond du gabarit, mesuré, et la garde qui va avec
- [ ] **à la main, sur les deux téléphones** : dix dépliages d'affilée, les quatre types, à
      froid et à chaud — **aucune image perdue**
      ([fluidite.md](../docs/fluidite.md#comment-on-mesure))
- [ ] **à la main** : le texte d'A1 peint en moins d'une seconde en 4G, cache vide

**Fin du jalon :** le premier vrai pli envoyé.

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
- **18/08/2026 — le module d'ouverture n'est pas encore inline.** ~~L'entrée reste un
  `<script type="module">` empreinté, accompagné depuis le jalon 1 d'une feuille de style
  empreintée.~~ **Fait au jalon 2**, première étape : le greffon `pli-inliner-le-document`
  de `vite.config.ts`. Une page périmée de dix minutes se suffit désormais à elle-même
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
- **18/08/2026 — le cachet porte le numéro seul**, « 014 » et non « nº 014 » : six signes ne
  tiennent pas dans une pastille de 38px composée à 10px. `donnees.md` écrivait « nº 014 » et
  a été corrigé ; « nº 014 » reste la forme de la prose.
- **18/08/2026 — `--pliure-part` et `--corps-pied` entrent dans les jetons.** Un padding en
  pourcentage se compte sur la **largeur**, jamais sur la hauteur : le corps qui doit
  s'arrêter au-dessus du volet ne peut pas réutiliser `--pliure` tel quel. Plutôt que de
  recopier `0.34` et `30px` dans un `calc`, les deux nombres deviennent des jetons — ils ne
  vivent qu'à un endroit. C'est un écart au « bloc `:root` repris tel quel », noté dans
  [integration.md](../docs/integration.md#corrections-à-appliquer).
- **18/08/2026 — le `fetch` d'un poème part du `<head>`, pas du module.** ~~Cinq lignes inline
  avant la feuille de style, parce qu'une feuille bloquante gèle l'exécution d'un module.~~
  **Renversé au jalon 2** : il n'y a plus de feuille à attendre, la demande repart du module,
  et le nom d'un poème redevient l'affaire du seul routeur.
- **18/08/2026 — le volet du pli en dur reste vide.** Ce qui s'y écrit — l'invite, « déplier »
  et sa flèche — n'a de sens qu'avec le geste. Le placer maintenant aurait demandé d'inventer
  la composition d'A1.

### Jalon 2

Six points que les docs laissaient ouverts ont été tranchés **avec toi** avant d'écrire, et
trois d'entre eux ferment des questions d'[integration.md](../docs/integration.md#ce-qui-reste-à-trancher-avec-a1) :

- **18/08/2026 — un pli sur un écran plus court se met à l'échelle.** Un `scale()` sur le
  plateau, jamais une recomposition : le gabarit reste littéralement 360 × 780 et aucun écran
  n'est à refaire. L'idiome existe déjà dans le dépôt, `.mini` réduit un vrai pli.
- **18/08/2026 — le fond d'A1 est le rideau.** `parcours.md` et `design-system.md` le disent,
  seule la maquette montre un papier crème, et `docs/` gagne toujours contre `design/`.
  **Le fondu suit** : `integration.md` dit que le choix emporte le fondu, donc
  `.image__fondu--encre` — et A1 compose en crème et rose, non en encre et carmin.
- **18/08/2026 — le débordement du gabarit se traite des deux côtés** : un plafond par clé,
  **mesuré** en local à 360 × 780 et écrit dans `donnees.md` avec sa date, plus une garde
  dans le gabarit pour que le lecteur ne recouvre jamais la marque en silence.
- **18/08/2026 — sur A1, seule l'étiquette de tête change avec le type.** La promesse est la
  même pour les quatre. `parcours.md` dit « seule la promesse change » mais n'en écrit qu'une.
- **18/08/2026 — les mots de C4** : titre « Lien abîmé », voix « Il a dû être coupé en
  chemin. Redemande-le-moi. » Le texte n'était écrit nulle part ; le nom de l'état, si.
- **18/08/2026 — les faits d'une invitation se composent uniformément** : une ligne par fait,
  le premier en carmin. La hiérarchie de la maquette ne se devine pas dans une chaîne libre.

Et ce que la construction a tranché :

- **18/08/2026 — le document se suffit à lui-même, et la machine le tient.** Le greffon
  `pli-inliner-le-document` porte quatre gardes, chacune vérifiée en la faisant échouer :
  un chunk partagé, du code d'`atelier/` absorbé par le lecteur, une requête restée sur le
  chemin du premier texte, et le **plafond de 14 ko gzip** de la vague 1. Il ne supprime du
  paquet que ce que plus aucun document ne référence — sinon un atelier qui reprendrait
  `pli.css` serait servi nu, sans un mot.
- **18/08/2026 — les cinq lignes du `<head>` sont parties, sur mesure.** Elles gagnaient
  63 ms quand une feuille bloquante gelait le module. Mesuré à nouveau dans Chromium à 60 ms
  de latence forcée, cinq passes alternées : **75 ms depuis le module contre 77 ms depuis le
  `<head>`**. L'écart est tombé dans le bruit, et elles portaient une seconde copie de
  l'expression du nom d'un poème, hors du routeur.
- **18/08/2026 — les aplats des cinq toiles sont prélevés, pas choisis.** Moyenne des pixels
  sur le cadrage que le pli affiche vraiment, mesurée dans Chromium. Le rideau donne
  `#743c3b` en haut et `#440b10` en bas ; le drapé, dans son bandeau de 46 %, `#944850` et
  `#904a53`.

## Ce que les relecteurs demandent pour la suite

**Au jalon 2, pour le gabarit** — deux choses ne peuvent pas rester silencieuses, elles sont
écrites dans [integration.md](../docs/integration.md#ce-qui-reste-à-trancher-avec-a1) : le
**débordement par le haut** (au maximum autorisé, le contenu passe sur la marque et se fait
couper sans un mot), et **un pli de 780px sur un écran visible plus court** — mesuré à
390 × 664, la page défile et le bas du volet sort du champ, ce qui contredit « un pli = un
écran ». La seconde est une question à poser, pas à résoudre.

**Au jalon 2, pour le geste** — `.pli` est la **couche du dessous** : le geste demande deux
couches, une par `translate3d`. Le `<button>` « déplier » du clavier a maintenant un endroit
où vivre — le volet — mais il n'y est pas encore, faute de geste à déclencher.

**Au jalon 2, pour le chargement** — ~~l'inlining du CSS et du module~~ **fait**, première
étape du jalon 2. Le chunk commun annoncé ici n'est pas résolu mais **gardé** : le build
échoue si le chunk d'entrée du lecteur porte le moindre import statique. Le jour où l'atelier
importera `codec.ts` (jalon 5), il faudra trancher — deux builds séparés, ou l'inlining du
graphe entier. La garde nomme le problème au lieu de le laisser entrer.

**Au jalon 2, pour l'invite et le mouvement** — l'invite du volet doit se **mettre en pause**
au toucher, pas redémarrer ([fluidite.md](../docs/fluidite.md)) : une animation infinie
composée promeut le volet en couche permanente, et si elle tourne pendant le geste
l'inspecteur montrera **trois** couches bordées au lieu de deux. Et sous
`prefers-reduced-motion`, l'ouverture tombe à **120 ms** — le bloc `@media` existe, la
transition à régler n'existe pas encore.

**Au jalon 2, pour la marque `a1`** — elle date aujourd'hui l'échafaudage déplié ; elle devra
suivre le texte d'A1. Un lien abîmé ne marque rien : à trancher avec C4. Et pour un `#p=`,
la marque inclut l'aller-retour réseau — **noter le type de lien à côté du chiffre**, sinon
la ligne du budget ne veut rien dire.

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
