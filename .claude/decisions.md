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
trois d'entre eux ferment des questions d'[integration.md](../docs/integration.md#ce-qui-a-été-tranché-avec-a1-au-jalon-2) :

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


### Jalon 3 — la boucle

- **18/08/2026 — l'empreinte `h` est un sha-256 tronqué à huit octets.** `docs/donnees.md`
  dit « empreinte du payload » et s'arrête là. Huit octets, seize signes hexadécimaux : la
  même primitive que le seuil de l'atelier, donc rien de neuf à maintenir, et une collision
  demanderait des milliards de plis quand il en circulera quelques centaines. C'est un
  **dédoublonnage**, pas une signature : rien de secret n'en dépend.
- **18/08/2026 — l'empreinte se calcule pendant la vague 3, l'écriture reste synchrone.**
  `crypto.subtle.digest` est asynchrone, et à `pagehide` plus rien d'asynchrone n'aboutit —
  elle part vers WhatsApp, l'onglet gèle, l'entrée n'existe jamais. L'empreinte est donc
  prête bien avant qu'un doigt se pose, pendant qu'elle regarde le volet fermé ; il ne reste
  à `pagehide` qu'un `JSON.stringify` et une écriture.
- **18/08/2026 — la recherche à l'arrivée se fait sur le payload, le dédoublonnage sur `h`.**
  Chercher par `h` à l'arrivée coûterait une attente asynchrone sur le chemin du premier
  texte. Le payload est **équivalent** à son empreinte — c'est ce dont elle est tirée — et la
  règle qui compte (« jamais sur `n` ») est tenue des deux côtés.
- **18/08/2026 — la ligne libre d'A3 se tape dans WhatsApp, pas dans le pli.**
  `docs/parcours.md` dit « une ligne libre facultative après » ; le message part déjà écrit
  dans une conversation qu'elle a sous les yeux. Un champ de saisie dans le pli ajouterait un
  clavier, un mot du lexique interdit, et une seconde façon d'écrire la même phrase. `ligne`
  reste dans le format du journal, à `null`, pour le jour où l'on changerait d'avis.
- **18/08/2026 — A4 garde son action « tes plis ↑ », muette.** Le journal ne se lit qu'au
  jalon 5. Recomposer le bas d'A4 deux fois coûterait plus qu'une action qui attend — c'est
  le choix déjà fait pour « répondre » au jalon 2, et le prototype le faisait aussi.
- **18/08/2026 — la vague 3 ne partage rien avec le module d'ouverture.** Deux fonctions de
  `a2.ts` réemployées par `reponse.ts` ont suffi à faire de celui-ci un chunk qui importe le
  chunk d'entrée — inliné dans le document, puis supprimé. Build vert, vague 3 morte au
  moment du geste. On recopie plutôt que de partager, et le greffon refuse le build qui
  referait le lien.
- **18/08/2026 — `wa.me` n'est pas un tiers.** L'invariant « aucun tiers » interdit ce qui
  **entre** dans la page : un CDN, une mesure d'audience, une police distante.
  `https://wa.me/…` est une destination de lien sortant, prescrite au caractère près par
  `docs/donnees.md#6-la-réponse-whatsapp`. `scripts/verifie.mjs` l'autorise nommément, et
  rien d'autre.

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
- **18/08/2026, le soir — c'est finalement le sous-chemin : `leo-bernard38.github.io/Pli/`.**
  Décision prise avec toi, contre celle du matin : le dépôt garde son nom, et GitHub Pages en
  fait un **site de projet**, servi sous `/Pli/`. Le site ne répondait que des 404, parce que
  le dépôt n'a pas été renommé et que `base: '/'` cherchait tout à la racine de l'hôte.
  Ce que ça coûte, et c'était l'argument du matin : **quatre signes de préfixe**, pris sur ce
  qu'un pli peut porter — à rapprocher de la mesure nº 1 quand elle sera faite. Ce que ça
  demande : `base: '/Pli/'` dans Vite, et **une seule constante** dans le produit — le module
  lit `import.meta.env.BASE_URL`, Vite pose le préfixe partout ailleurs. L'adresse n'est
  toujours pas gelée : aucun pli n'est parti.
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

### L'atelier

- **18/08/2026 — le stockage a deux modules, pas un.** L'invariant disait « tout
  `localStorage` passe par `journal.ts` » ; l'atelier range quatre clés qui n'ont rien à voir
  avec ses plis à elle — « il n'a rien à voir avec son journal et ne se synchronise pas »
  (`docs/donnees.md#5-mon-historique`). Les mettre dans `journal.ts` aurait posé le **numéro
  de réponse** dans le module que le lecteur importe. D'où `src/lib/tiroir.ts`, et une garde
  qui accepte désormais deux modules de stockage — deux, et pas trois.
- **18/08/2026 — deux builds au lieu de deux entrées.** Le jour où l'atelier importe
  `codec.ts`, Rollup en fait un chunk commun : le document du lecteur perd son inlining et
  gagne une requête avant le premier texte. `docs/architecture.md` laissait le choix entre
  deux builds séparés et l'inlining du graphe entier. C'est **deux builds** : chacun garde sa
  copie du module partagé, le budget de 14 ko ne bouge pas, et la garde « une entrée = un
  fichier » — qui a déjà attrapé un bug au jalon 3 — reste debout. `npm run build` lance Vite
  deux fois, `--mode lecteur` puis `--mode atelier`.

### Le journal

- **18/08/2026 — une entrée du journal a une adresse, `#/relire/<h>`.** `docs/parcours.md`
  dit « depuis une entrée, elle relit le pli entier », sans dire par où. Reprendre `#c=`
  aurait retombé sur C3, le pli refermé : il fallait une seconde adresse. Elle porte
  l'empreinte, seize signes hexadécimaux, et **ne quitte jamais l'appareil** — sans le
  journal qui la porte, elle ne désigne rien. C'est ce qui l'autorise à vivre à côté de
  `#c=` et `#p=`, qui, eux, sont dans une conversation pour toujours : l'invariant nº 1 ne
  la couvre pas, et n'a pas besoin de la couvrir.
- **18/08/2026 — le journal est le seul écran qui défile, et le défilement est enfermé dans
  la liste.** « Un pli = un écran, jamais de défilement dans un pli » vaut pour un pli ; le
  journal n'en est pas un, c'est un sommaire de revue (`docs/parcours.md#le-journal`). Le
  cadre, la tête et les marges ne bougent pas : seule `.plis` défile, avec
  `touch-action: pan-y` — le cadre coupe tout le toucher pour le geste du dépliage, et sans
  cette ligne le sommaire ne se ferait pas défiler du doigt.
- **18/08/2026 — le retour de WhatsApp par rechargement retombe sur C2, plus sur A4.**
  Le jalon 3 avait posé A4 au retour, faute de C2. `docs/partage.md#le-retour` tranche :
  « une `reponse` déjà notée mène à C2 ». Le pli relu porte son mot rappelé à la place de
  « répondre » — on ne répond pas deux fois. `poserLeMot` disparaît de `reponse.ts` : A4
  reste ce qu'elle est, l'écran qui suit le tap, dans la même page.

### Le journal

- **18/08/2026 — une entrée du journal a une adresse, `#/relire/<h>`.** `docs/parcours.md`
  dit « depuis une entrée, elle relit le pli entier », sans dire par où. Reprendre `#c=`
  aurait retombé sur C3, le pli refermé : il fallait une seconde adresse. Elle porte
  l'empreinte, seize signes hexadécimaux, et **ne quitte jamais l'appareil** — sans le
  journal qui la porte, elle ne désigne rien. C'est ce qui l'autorise à vivre à côté de
  `#c=` et `#p=`, qui, eux, sont dans une conversation pour toujours : l'invariant nº 1 ne
  la couvre pas, et n'a pas besoin de la couvrir.
- **18/08/2026 — le journal est le seul écran qui défile, et le défilement est enfermé dans
  la liste.** « Un pli = un écran, jamais de défilement dans un pli » vaut pour un pli ; le
  journal n'en est pas un, c'est un sommaire de revue (`docs/parcours.md#le-journal`). Le
  cadre, la tête et les marges ne bougent pas : seule `.plis` défile, avec
  `touch-action: pan-y` — le cadre coupe tout le toucher pour le geste du dépliage, et sans
  cette ligne le sommaire ne se ferait pas défiler du doigt.
- **18/08/2026 — le retour de WhatsApp par rechargement retombe sur C2, plus sur A4.**
  Le jalon 3 avait posé A4 au retour, faute de C2. `docs/partage.md#le-retour` tranche :
  « une `reponse` déjà notée mène à C2 ». Le pli relu porte son mot rappelé à la place de
  « répondre » — on ne répond pas deux fois. `poserLeMot` disparaît de `reponse.ts` : A4
  reste ce qu'elle est, l'écran qui suit le tap, dans la même page.

### Le socle en plein cadre

- **19/08/2026 — le pli remplit le viewport.** ~~Un pli plus haut que l'écran se met à
  l'échelle (18/08/2026), `--echelle` sur le plateau et `transform: scale()` sur le
  pli.~~ **Renversé.** 360 × 780 était la taille de référence des planches du design
  system ; recopiée comme une taille réelle, elle faisait flotter une carte au milieu
  d'une bande de sable sur un téléphone qui n'attend pas une carte. Le cadre devient
  l'écran — `.pli` et `.ecran` en 100 % × 100dvh, plus de `max-width`, plus de coin, plus
  d'ombre : il n'y a plus de plateau sur lequel se poser. La typographie reste en px ;
  360 × 780 reste la **proportion** de référence, celle où les plafonds du papier se
  mesurent, et celle que `.mini` continue de montrer. `plateau.ts` disparaît avec
  `--echelle`, et `figer()` / `relacher()` avec lui : une page qui ne défile jamais n'a
  plus de barre d'URL qui se rétracte, donc plus de `resize` à redouter pendant le geste.
  **Plein cadre partout, aucune media query de largeur** — y compris au bureau, où E1
  n'est de toute façon pas construit.
- **19/08/2026 — une seule règle citait la constante 780, elle passe en unité de
  conteneur.** `.corps:has(~ .volet)` réservait `--ecran-h × 0,34`. Un padding en
  pourcentage se compte sur la largeur, d'où le calcul ; mais le calcul **supposait** la
  hauteur au lieu de la mesurer, et le jour où le pli a rempli l'écran il est devenu faux
  en silence. `100cqh` interroge la boîte. `100dvh` aurait donné le même nombre — en le
  supposant lui aussi.
- **19/08/2026 — les retraits de sécurité passent du plateau au contenu.** Le pli touche
  les quatre bords : le fond va jusqu'au bord, seul le texte se retire. Quatre jetons
  `--encoche-*`, deux marges dérivées, portés par la tête, le corps, l'invite du volet et
  les cibles de l'atelier — et **remis à zéro dans `.mini`**, parce qu'un aperçu montre le
  gabarit et n'a pas d'encoche.
- **19/08/2026 — le clavier de l'atelier réduit la vue, il ne pousse plus la page.**
  `interactive-widget=resizes-content` sur l'entrée de l'atelier (Chrome ≥ 108, mon
  téléphone, le seul qui voie l'atelier), et `--vue-h` écrite par `src/atelier/vue.ts` en
  repli pour Safari. Sur les six écrans, jamais sur `:root` : la règle de `fluidite.md` ne
  change pas de raison parce qu'on change d'entrée, et `verifie.mjs` refuse la ligne — il a
  raison. L'écran défile, l'action est collante en bas : une action qu'on ne voit pas
  n'existe pas.
- **19/08/2026 — le zoom se bloque, et il faut dire ce que ça vaut.** `maximum-scale=1,
  user-scalable=no` dans les deux entrées. Honoré par Chrome ; **iOS l'ignore depuis
  iOS 10**, et chez elle c'est le `touch-action: none` du cadre — qui couvre maintenant
  tout l'écran — qui fait le travail. L'auto-zoom à la mise au point n'a jamais eu lieu :
  les lignes de saisie sont à 20 et 26px, au-dessus des 16 qui l'appellent. C'est donc un
  recul d'accessibilité pour mon seul Android, dans l'atelier, et il est assumé.
- **19/08/2026 — `a.marque` et `a.action` remontent de `plis.css` vers `pli.css`.**
  Elles y sont depuis le jalon 5, dans la feuille du journal, demandée à la volée. Or
  `chemin()` fait de la marque un `<a>` **dès A1**, où cette feuille n'est jamais chargée :
  la marque tombait sur le `a { color: carmin }` du socle et se peignait en carmin sur le
  rideau sombre — 1,4:1, mesuré aux trois largeurs. Le chemin discret appartient au
  gabarit, pas au journal. La faute date du jalon 5 ; le plein cadre ne l'a pas causée, il
  l'a fait trouver.
- **19/08/2026 — D3 composait en crème sur crème, et personne ne l'avait vu.** `.ecran`
  (`depot.css`) et `.pli--carmin` (`pli.css`) valent une classe chacun ; `depot.css` est
  chargée après, donc à égalité c'est l'ordre qui tranche, et le papier crème gagnait sur le
  carmin. L'écran du lien était illisible **depuis le jalon 4**. C'est le même piège, au même
  endroit, que le filet de focus de l'atelier trouvé en relisant D5 : le calcul de
  spécificité de `pli.css` ne vaut qu'à l'intérieur de `pli.css`. `.ecran.pli--carmin`, deux
  classes, et l'ordre ne décide plus.
- **19/08/2026 — le filet de focus rendu aux deux lignes de saisie.** `.ligne input` vaut une
  classe et un type (0,1,1) : son `all: unset` battait le `:focus-visible` nu de `pli.css`
  (0,1,0) quel que soit l'ordre. Le jalon 4 avait rendu son filet à `.type`, `.depose` et
  `.passage` — pas aux deux seules cibles où l'on tape, et
  `docs/integration.md#accessibilité--la-liste-à-cocher` le demandait depuis le jalon 1, case
  non cochée.
- **19/08/2026 — le paysage n'existe pas, et on ne le rattrape pas.** Un téléphone couché
  offre ~390px de haut pour une composition dessinée pour 780 ; la mise à l'échelle réglait
  ce cas sans qu'on le sache, le plein cadre coupe. Trois voies étaient ouvertes — une invite
  à redresser, un pli qui défile en paysage, ou rien. C'est **rien** : on ne sert que du
  portrait mobile, aucune règle d'orientation n'entre dans les feuilles, et le manifeste dit
  déjà `orientation: "portrait"`. Un pli qui défile aurait cassé la première des cinq règles ;
  une invite à redresser aurait ajouté un écran qu'aucune maquette ne dessine, pour un cas que
  ces deux téléphones ne rencontrent pas. Noté dans
  [docs/installation.md](../docs/installation.md#le-manifeste-et-les-icônes), qui fait foi.
- **19/08/2026 — le poème défile, et il est le seul.** La spécification décrivait une
  pagination strophe par strophe, au même geste que le dépliage (B2 · B3, « la suite ↑ »).
  Elle n'a jamais été construite, et l'auteur l'écarte : un poème est un texte, il se lit
  d'un bout à l'autre. La conséquence dépasse le poème — c'est **la première des cinq règles**
  qui gagne une exception nommée, et elle est nommée pour rester une exception : tout écran
  qui défile sans être un poème casse toujours la règle. À rapprocher de la décision du
  paysage, deux lignes plus haut, où « un pli qui défile » avait justement été refusé : ce
  qui était refusé là, c'était de faire défiler une composition **dessinée pour tenir** parce
  que l'écran était trop court. Ici c'est l'inverse : le contenu est long par nature, et
  aucune hauteur d'écran ne le ferait tenir.
  Techniquement, le doigt ne se rend pas depuis la feuille du type : `touch-action` se croise
  le long des ancêtres, et `.pli` porte `none` pour le geste. C'est le module qui pose
  `data-defile` sur le cadre, **une fois le poème ouvert et pas avant**, et `pli.css` comme
  `geste.ts` le lisent. Le corps passe aussi en `justify-content: flex-start` : sous
  `flex-end`, un contenu trop haut déborde par le **haut**, et ce qui déborde par le haut ne
  se rattrape pas au défilement — les premières strophes auraient été perdues.
- **19/08/2026 — l'aperçu de l'atelier a un bord, et deux vignettes sur quatre étaient
  blanches.** Signalé à l'usage : « les miniatures ont le même fond que la page, c'est un peu
  illisible ». Mesuré, c'était vrai au pixel — `#F7F2E8` sur `#F7F2E8`, sans bordure ni
  ombre. Le filet demandé est une **ombre externe**, ni `border` ni `inset`, et les deux
  exclusions sont mesurées : une bordure décalerait le `.mini` posé en absolu dans une boîte
  en `overflow: hidden` et rognerait le pli ; une ombre `inset` se peint sous les enfants, et
  le `.mini` couvre toute la boîte — essayée, mesurée à **1,12:1**, c'est-à-dire rien. Une
  ombre externe en `--trait-fort` donne **16,5:1** sur la page, et le pli se lit comme une
  page posée.
  En cherchant, un défaut bien pire : `.mini` pose `background: var(--creme)` et `pli--encre`
  pose l'encre — une classe chacun, et `depot.css` charge après `pli.css`. Le crème gagnait.
  Les vignettes de la **pensée** et du **poème** étaient donc en crème avec des blocs
  `--clair`, c'est-à-dire du crème à 70 % sur du crème : **entièrement blanches depuis le
  jalon 4**, et l'aperçu de D2 avec elles. C'est la **troisième fois** que ce piège mord —
  après le filet de focus de l'atelier et le D3 en crème sur crème. La règle qui en sort
  n'est plus « écrire en fin de feuille » mais **« deux classes, et l'ordre ne décide plus »**.
- **19/08/2026 — la ligne du mot suit ce qu'on y écrit.** Elle valait 64px et `resize: none` :
  mesuré, 288 signes en réclament 162, et le texte défilait DANS la boîte — on écrivait un
  souvenir par une fenêtre de deux lignes. Le plafond du papier va pourtant jusqu'à 312. La
  hauteur est maintenant écrite par le module à chaque frappe, `height: auto` d'abord pour
  qu'elle redescende quand on efface. `resize: none` reste : la poignée du navigateur
  donnerait une seconde façon de régler la même chose.

### La revue de tout, au navigateur — 19/08/2026

Cinq de ces six décisions viennent d'une seule chose : **avoir ouvert le build dans un
navigateur et traversé le parcours en entier**, plutôt que de relire des fichiers. Aucune
n'était visible dans un diff, aucun relecteur ne les avait vues, et `npm run verifie`,
`npm test` et `npm run types` passaient tous les trois.

- **19/08/2026 — A1 n'a plus d'image, et la maquette avait raison depuis le début.**
  `docs/` avait tranché contre `design/` au jalon 2 : « le fond d'A1, c'est le rideau »,
  alors que la maquette montrait un papier crème. Mesuré sur le build : le rideau était
  **préchargé, 614 ko, lancés à 66 ms** — dans la même seconde que les trois polices que le
  texte, lui, **attend** vraiment, puisque `font-display: block` ne peint rien avant elles.
  A1 est la page qui doit s'afficher avant tout le reste ; elle traînait le plus gros
  fichier du parcours. Papier crème et grain : **4 requêtes au lieu de 5, 89 ko au lieu de
  703**, et le rideau sort entièrement du build. Ce qui ne change pas : la tête et le numéro
  restent à l'encre et non au carmin de la maquette — sur A1 la seule chose qui agit est le
  volet, et cette raison-là ne dépendait pas du fond. Au passage, `.volet__ombre` — le fil
  d'ombre du papier devant la pliure, que `pli.css` portait depuis la reprise du handoff
  sans que rien ne l'écrive — est enfin posé.

- **19/08/2026 — A3 et A4 partent à chaque changement d'adresse.** `montrer()` commande les
  `.pli__dessus` et la couche du dessous ; les deux couches qui montent vivent **au-dessus**,
  en z-index 3 et 4, et personne ne les commandait. Depuis A4, « tes plis ↑ » changeait donc
  bien le hash, C1 se construisait bien — **sous A4, qui le recouvrait entièrement**. Le
  chemin principal du jalon 5 ne menait nulle part, et rien ne le disait. Elles se retirent
  maintenant dans le routeur, une fois, pour toutes les routes.

- **19/08/2026 — le cadre du pli est en `overflow: clip`, pas `hidden`.** Les deux rognent
  pareil, mais `hidden` fait du pli un **conteneur de défilement** : A3 et A4, posées à
  `translateY(100%)`, portent sa hauteur de défilement à deux écrans. Il suffisait qu'un
  élément prenne le focus — le bouton « déplier », c'est-à-dire l'alternative au geste, donc
  le chemin de l'accessibilité — pour que le navigateur fasse défiler le pli de **180px**
  afin de le « révéler ». Et il n'en revenait jamais : A2 arrivait amputée de sa tête, A4
  dépassait par le bas. Mesuré au clavier, sur une invitation. `clip` n'est pas un conteneur
  de défilement ; plus rien ne peut faire glisser le cadre.

- **19/08/2026 — `refermer()` repose les deux couches sans condition.** Le `if (!ouvert)
  return` avait l'air juste : pourquoi refermer ce qui est fermé ? Mais le geste ne referme
  pas seulement, il **repose**. La relecture d'un pli sort la couche du dessous de sa place
  (`transform: none`) et la rend au clavier (`inert = false`), parce qu'elle y est l'écran ;
  le lien suivant retrouvait donc un A2 posé à 0 et atteignable au Tab depuis A1 —
  « répondre » d'un pli qu'elle n'avait pas déplié. C'est la faute du jalon 3, revenue par
  une autre porte, et elle demande deux Tab pour se voir.

- **19/08/2026 — trois défauts de l'atelier, un seul geste pour les trois.** Une `<ul>`
  garde le retrait de 40px et la marge du navigateur si on ne les remet pas à zéro : les
  listes de **D5 et D2p** commençaient donc à 40px quand tout l'écran est à 26. Un
  `<button>` garde le fond gris et la bordure en relief du navigateur si `all: unset` ne
  passe pas : `.conduite__retour` s'affichait en petite boîte système sur **les six écrans**.
  Et `montrer()` donne le focus à l'écran qui arrive pour le retirer de celui qui devient
  inerte — le `:focus-visible` nu de `pli.css` lui peignait alors le filet carmin **sur
  toute sa hauteur**. Trois oublis du même ordre : une peau de navigateur qu'on croyait
  avoir retirée.

- **19/08/2026 — rien ne se coupe par le haut, et `safe` n'était écrit nulle part.**
  `depot.css` décrivait `safe` en commentaire depuis le jalon 4 — « un corps aligné en fin
  coupe le DÉBUT de son contenu quand il déborde, et le rend inatteignable » — sans que la
  déclaration existe. Conséquence mesurée : sur D2, une invitation remplie poussait son
  titre **9px au-dessus** du corps de l'aperçu, où `overflow: hidden` le mangeait. « Tu es
  invitée » n'était pas dans l'aperçu, qui est la moitié de D2. `justify-content: safe
  flex-end` sur `.mini .corps` et sur `.ecran > .corps`.

- **19/08/2026 — `verifie.mjs` cesse de crier ce qu'il a déjà accepté.** Le script portait
  deux griefs permanents que rien ne pouvait éteindre : `sessionStorage` dans `fond.ts`,
  qui est l'exception nommée du drapeau de rechargement, et le dégradé mesuré de
  `pli.css`, dont le message demandait précisément « si elle est mesurée, le dire en
  commentaire » — le commentaire était là. Le premier devient un **refus** partout ailleurs
  et se tait à l'endroit nommé ; le second lit le commentaire avant de parler. Trois lignes
  de bruit à chaque `npm run verifie`, c'est trois lignes derrière lesquelles un vrai grief
  se cache.

### Les phrases, révisées — 19/08/2026

- **19/08/2026 — la marque dit « Pli », le texte dit « il ».** Compté avant de toucher à
  quoi que ce soit : « pli » ou « plis » revenait **26 fois sur 187 mots visibles**, un mot
  sur sept. Douze fois la marque — elle a le droit, c'est son travail ; quatorze fois le
  texte, qui répétait à quelqu'un le nom du produit écrit trois centimètres au-dessus. C3
  cumulait quatre occurrences en trois lignes, dont « Ce **pli** est dans tes **plis** »
  dans la même phrase. La cause n'était pas de la négligence : le lexique dit « on dit un
  pli », et le produit l'avait lu comme une obligation de le dire. **Le lexique fixe quel
  mot, pas à quelle fréquence** — c'est maintenant écrit dans `design-system.md`. Reste
  deux occurrences, et une seule dans le produit : l'aperçu du lien, seul endroit où la
  marque n'est pas à l'écran.
- **19/08/2026 — « Un pli t'attend. » quitte A1 pour l'aperçu du lien.** La phrase est
  normative depuis le design, et elle le reste — mais à l'endroit où elle travaille. Sur
  A1 elle nommait le produit sous sa propre marque et ne s'adressait pas à elle ; dans une
  conversation WhatsApp, elle est tout ce qu'il y a. A1 dit désormais **« Il n'attendait
  que toi. »**
- **19/08/2026 — les écrans s'enchaînent au lieu de s'étiqueter.** Une fois les répétitions
  tombées, un arc apparaît sans qu'on l'ait écrit : *il n'attendait que toi* (A1) → *il se
  referme derrière toi* (A4) → *il est rangé, avec les autres* (C3) → *ce que je t'enverrai
  restera ici* (C1). Et les trois écrans d'accident deviennent trois états d'un même
  voyage : **il arrive** (C5), **il n'a juste pas pu arriver** (hors ligne), **il a dû être
  coupé en chemin** (C4). C'est la même métaphore, tenue sur trois écrans qui ne se voient
  jamais ensemble.
- **19/08/2026 — l'atelier a la même passe, sans la douceur.** C'est un outil, il ne parle
  qu'à moi : « déposer le pli » → « déposer », « Envoie ce lien à la personne » →
  « Envoie-le-lui », « Touche un pli pour le renvoyer » → « Touche-en un ». Aucune
  tentative de ton — les mots servent à ne pas se tromper d'écran.

### Les mouvements — 19/08/2026

- **19/08/2026 — le dépliage ne s'animait pas, et personne ne pouvait le voir.**
  `tokens.css` écrit `--ouvre: 460ms` ; le minifieur CSS du build le réécrit en **`.46s`**,
  qui est plus court et rigoureusement équivalent pour le navigateur. Mais `geste.ts` le
  relisait avec `parseFloat`, qui en tire **0,46**, et posait `transform 0.46ms` : la
  feuille sautait en **une image**. Trois choses cachaient le défaut — il n'existe pas en
  `npm run dev` où le CSS n'est pas minifié ; le geste au doigt n'était pas touché, puisqu'il
  écrit les positions lui-même, donc seul le relâchement claquait ; et une capture d'un pli
  ouvert est identique dans les deux cas. Mesuré sur le build : `-360px` puis `-844px`, deux
  images consécutives. La règle qui en sort : **une valeur CSS relue en JavaScript se
  convertit, elle ne se `parseFloat` pas.** Les autres réglages du geste sont sans unité et
  étaient hors d'atteinte.
- **19/08/2026 — on n'anime pas pour animer.** La première version de cette passe posait un
  fondu sur **tous** les écrans, y compris ceux qui arrivent avec la page. C'est exactement
  la faute que la règle interdit : un chargement n'a pas à être accompagné, il a à être
  court, et faire apparaître A1 retarderait le premier texte, qui est tout ce que ce produit
  défend. Le fondu ne dit qu'une chose, et il ne la dit qu'une fois : **c'est ton tap qui a
  produit cet écran.** Il ne s'applique donc qu'après un `hashchange`, jamais au premier
  rendu — un hash ne change pas tout seul.
- **19/08/2026 — ce qui se touche répond au doigt.** Le produit n'avait aucun `:active`, et
  `.pli` coupe le halo du navigateur avec `-webkit-tap-highlight-color: transparent` : taper
  « répondre », un des trois mots ou une entrée du journal ne produisait rien jusqu'à ce que
  l'écran suivant arrive. Sur un réseau lent, c'est une seconde d'incertitude, et on retape.
  Ce n'est pas un mouvement décoratif : c'est l'interface qui accuse réception. Deux sens,
  parce qu'un seul ne va pas aux deux familles — ce qui est plein s'atténue à `.55`, ce qui
  est déjà discret (`.conduite__retour` à `.55`, `.passage` à `.45`) **s'allume** à `1`.
  Les atténuer les ferait disparaître au moment précis où on les touche.
- **19/08/2026 — la marque disparaissait au survol.** `a:hover { color: var(--encre) }` et
  `a.marque { color: inherit }` valent la même spécificité ; l'ordre tranchait en faveur du
  survol. Sur C3, qui est en encre, la marque passait donc de crème à encre — invisible.
  Corrigé en `:not(.marque, .action)` plutôt qu'en déplaçant la règle : l'ordre ne doit plus
  décider, c'est la troisième fois que ce piège mord dans ce dépôt.
