# Les décisions prises en construisant

Ce que les docs ne tranchaient pas et qui a été tranché en chemin — une ligne par décision,
avec sa date. Si une décision contredit une doc, la doc se corrige et l'écart se note dans
[docs/integration.md](../docs/integration.md).

Ce fichier est une **archive** : on y ajoute, on ne le relit pas en entier. L'état vivant du
chantier est dans [`chantier.md`](chantier.md), les valeurs dans [`memo.md`](memo.md).

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
- **18/08/2026 — le greffon d'inlining travaille en `generateBundle`, pas en
  `transformIndexHtml`.** Trouvé en essayant de brancher la vague 3 : le greffon CSS de Vite
  **supprime en `generateBundle` les chunks « purement CSS »** — ceux d'un `import()` de
  feuille — et réécrit les références qui y menaient. Inliner avant lui figeait dans le
  document un `import('./inv-….js')` vers un fichier qui n'existait jamais : le CSS d'un type
  ne se serait plus chargé, **en silence**. Le greffon porte maintenant `enforce: 'post'`, et
  une garde de plus : aucun `import()` relatif ne doit survivre dans le module inliné, qui
  vit à l'adresse du document et non dans `/assets/`.
- **18/08/2026 — l'atelier sort du document qui part chez elle.** La section 6 de `pli.css`,
  « le dépôt », était inlinée dans le document du lecteur : **623 octets gzip** sur 7 513,
  pour des écrans qu'elle ne verra jamais. Elle devient `styles/depot.css`, importée par
  `src/atelier/` seul. La garde du greffon refusait déjà le **JS** d'atelier absorbé par le
  lecteur ; le CSS passait par ce trou-là.
- **18/08/2026 — le rideau est préchargé, pas seulement posé par le module.** Son adresse ne
  vivait que dans la chaîne d'un script : le scanner de préchargement ne la voyait pas, et
  pour un `#p=` la peinture attendait la fin de l'aller-retour réseau du poème — deux
  requêtes sérialisées sans aucune dépendance. Un `<link rel="preload" as="image"
  fetchpriority="low">` la fait découvrir tôt et servir tard, ce que `chargement.md`
  demandait déjà.
- **18/08/2026 — l'invite s'arrête, elle ne se met pas en pause.** `fluidite.md` prescrivait
  `animation-play-state: paused` et « exactement deux couches bordées » ; les deux ne
  pouvaient pas être vraies ensemble. Compté à l'inspecteur pendant un vrai glissement : en
  pause, **quatre** couches — l'invite garde la sienne, et le cachet est promu parce qu'il la
  recouvre. Arrêtée, exactement deux. `fluidite.md` est corrigé.
- **18/08/2026 — A1 ne peint aucune valeur en dur.** Le type, le numéro, la signature et le
  cachet restent vides dans le document : `decoder()` traverse un `DecompressionStream`, et
  pour un `#p=` c'est un aller-retour réseau complet — un pli « UNE INVITATION » se serait
  peint sur une pensée, et pendant tout le fetch sur un poème. Seul l'invariant est écrit.
- **18/08/2026 — le focus du bouton « déplier » est crème.** Le volet est carmin même quand
  sa couche est en encre : `.pli--encre :focus-visible` y posait un filet rose, à 2,9:1, sur
  le seul élément atteignable au clavier du premier écran.

**Dette nommée, à ne pas perdre : Bodoni sur C4.** Le titre « lien abîmé » est en Bodoni, qui
n'est ni préchargée ni en vague 3 — elle est demandée à l'instant où C4 s'affiche, et
`font-display: block` laisse le titre invisible le temps qu'elle arrive. L'écran n'est pas
muet pour autant : la phrase qui porte le message est en Newsreader, préchargée. À trancher
si la mesure sur les deux téléphones le rend visible.


### Jalon 2 — les lots B et C

- **18/08/2026 — l'invite s'arrête, et `fluidite.md` est corrigé.** Il prescrivait
  `animation-play-state: paused` **et** « exactement deux couches bordées » : les deux ne
  pouvaient pas être vraies ensemble. Compté à l'inspecteur pendant un vrai glissement, en
  pause il y a **quatre** couches — l'invite garde la sienne, et le cachet est promu parce
  qu'il la recouvre. Arrêtée, il y en a deux.
- **18/08/2026 — les cinq chemins du geste sont vérifiés à la machine** : hésitation à 30,8 %
  referme, course à 51 % ouvre, coup sec à **11,5 % de course** ouvre, mauvais sens referme,
  clavier ouvre. `will-change` retiré à chaque fois, le rideau sorti du document au dépliage.
- **18/08/2026 — le voile d'une image dépend de ce qu'on écrit dessus, pas de la toile.**
  Trois voiles mesurés, aucun choisi : pleine page sur encre `.68`, sous la tête d'un bandeau
  `.82` tenu jusqu'à 20 %, sur le souvenir `.85` tenu jusqu'au tiers. Chacun est l'alpha qui
  ramène le pire pixel de sa toile à 4,5:1 pour du crème.
- **18/08/2026 — le souvenir écrit en crème, pas en carmin.** Sa toile porte un pixel **quasi
  blanc** (`#fffffb`) là où la tête et le titre se posent : le carmin y est impossible quel
  que soit le voile, le rose demanderait `.93`. C'est le seul écran du jalon dont aucune
  maquette n'existe, et **le seul point tranché sans filet** — validé sur capture.
- **18/08/2026 — l'invitation ne tient pas les maximums que `donnees.md` documentait.** Elle
  porte trois de ses quatre éléments, jamais les quatre. Son titre descend à **16 signes** :
  à 64px, 22 signes font une troisième ligne de capitales et coûtent 92px d'un coup. Les
  plafonds sont désormais **par type**, mesurés et datés
  ([donnees.md](../docs/donnees.md#ce-que-le-papier-peut-porter--mesuré-pas-estimé)).
- **18/08/2026 — le corps coupe chez lui.** `.corps { overflow: hidden }` : la vraie
  réparation est le plafond au dépôt, mais un lien fabriqué à la main ne doit jamais recouvrir
  la marque. Vu et capturé avant la garde : le titre s'imprimait par-dessus « Pli ».
- **18/08/2026 — le poème ne montre que sa première strophe.** La pagination est le jalon 6 ;
  lui poser « la suite ↑ » alors que rien ne suit serait un mensonge.


### La configuration des agents

- **18/08/2026 — la relecture déterministe passe avant les agents.** Les jalons 1 et 2 ont
  coûté une journée et plus de cent sous-agents, sur un produit dont le design était déjà
  écrit. La cause n'était pas la difficulté, c'était la **redondance de lecture** : chaque
  relecteur rouvrait `integration.md`, `design-system.md`, `parcours.md` et `pli.css` — une
  cinquantaine de kilo-octets — pour relire cent cinquante lignes, et la moitié de ce qu'il
  cherchait était un `grep`. `scripts/verifie.mjs` prend cette moitié : lexique, étiquettes en
  capitales, emoji, exclamations, couleurs en dur, propriétés animées, variables CSS sur
  `:root`, accès au stockage, tiers, `history.pushState`, dépendances au runtime. Il tourne
  après chaque écriture (hook) et en CI, et **ne parle que s'il a trouvé**.
- **18/08/2026 — `.claude/memo.md` remplace la lecture des docs pour un relecteur.** Une page
  qui recopie les valeurs déjà tranchées, avec leur source. `docs/` reste la vérité ; la fiche
  évite de l'ouvrir pour citer `26px`. Un relecteur lit 6 ko au lieu de 50.
- **18/08/2026 — quatre relecteurs deviennent trois, sur Sonnet.** `gardien-lexique` est
  absorbé par `revue-ecran` : c'était la même lecture, et son travail mot à mot est passé au
  script. Aucun des trois ne demande le modèle le plus cher pour une relecture cadrée.
- **18/08/2026 — on relit un lot, pas un fichier.** Deux à quatre étapes qui vont ensemble, un
  seul relecteur, celui dont le domaine est touché. `/revue` — les trois ensemble — est
  réservé à un écran qui part en production. Et pas de sous-agent pour chercher un fichier ou
  vérifier un chiffre : c'est `grep`.
- **18/08/2026 — `chantier.md` se coupe en deux.** L'état vivant reste ; les arbitrages datés
  passent dans ce fichier-ci, qu'on n'ouvre que lorsqu'une décision est en cause. Le fichier
  lu au démarrage de chaque session passe de 28 à 12 ko.

### L'adresse

- **18/08/2026 — l'adresse devient `leo-bernard38.github.io`, à la racine.** `pli.re` n'a
  jamais été acheté : le réglage « Custom domain » ne fait que dire à GitHub de répondre à un
  nom, il ne le donne pas. Renseigné sans DNS, il redirigeait `…github.io/Pli/` vers un nom
  qui ne résout nulle part — d'où le « site inaccessible ». Trois voies étaient ouvertes :
  acheter le domaine, nommer le dépôt `leo-bernard38.github.io` (site d'utilisateur, servi à
  la racine), ou rester sur le sous-chemin `/Pli/`. La troisième est la pire : elle demande
  `base: '/Pli/'`, toutes les adresses absolues du produit, et donne le préfixe le plus long
  — or chaque signe de préfixe est un signe de moins pour un pli qui voyage entièrement dans
  le fragment. La deuxième est gratuite, ne change **pas une ligne de code** (`base: '/'`
  reste juste) et marche aujourd'hui. Décision prise avec toi.
- **18/08/2026 — le `CNAME` sort du dépôt.** Il nommait un domaine qu'on ne possède pas, et
  sous la source « GitHub Actions » il n'est au mieux d'aucun effet, au pire il rejoue la
  panne. `docs/hebergement.md` a une section « L'adresse » à la place de « Le domaine ».
- **18/08/2026 — l'invariant du domaine se reformule.** Il disait « le domaine ne change
  plus » ; c'était faux tant qu'aucun lien n'était parti, et ça a failli coûter un mauvais
  choix. Il dit maintenant **ce qui est vrai** : l'adresse se gèle au **premier pli envoyé**.
  Avant, elle peut encore devenir un vrai domaine ; après, elle est dans une conversation.
  Les citations des maquettes gardent `pli.re` — une maquette se cite, elle ne se réécrit pas.

### La roadmap

- **18/08/2026 — sept jalons deviennent cinq, et le lancement est nommé.** Décision prise
  avec toi, pour partir plus vite. Ce qui a changé : **l'atelier passe devant le journal**
  (tant qu'il n'existe pas, chaque pli passe par un terminal — c'est le seul jalon qui change
  ma vie à moi), et **le poème et le bureau descendent dans « plus tard »**. Le poème est le
  quatrième type et de loin le plus de machinerie : une moulinette, un format de fichier
  public pour toujours, une pagination, deux écrans. Trois types de plis partent sans lui.
  Surtout, la roadmap dit maintenant **où on lance** : à la fin du jalon 3, quand elle a
  répondu. Tout ce qui suit est du confort — précieux, mais du confort. Réversible en une
  ligne si le poème compte plus que le journal.
