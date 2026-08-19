# Chantier — où en est la construction

Ce fichier est **l'état**, pas le plan. Le plan est [docs/roadmap.md](../docs/roadmap.md) et
il ne bouge pas ; ce fichier dit ce qui a réellement atterri, et il se met à jour à chaque
étape terminée. C'est ce qu'une nouvelle session lit en premier pour savoir où reprendre.

Une étape n'est cochée que lorsqu'elle est **écrite, relue et commitée**.

## Jalon courant

**Le poème — 19/08/2026.** Le quatrième type existe de bout en bout. Il était rangé dans
« plus tard » de la roadmap et il était déjà à moitié là : `#p=` routait, le `fetch` partait
en première instruction, le payload était recopié au journal. Manquaient la moulinette,
l'écran d'attente, la lecture du poème entier, et l'écran de l'atelier. Écrit, relu et
commité en quatre lots.

**Jalon 5 — la durée.** Le journal se lit. C1 le sommaire et son état vide, C2 la relecture
d'un pli depuis une entrée, C3 le pli refermé, et la marque « Pli » devenue chemin discret :
elle mène au journal depuis A1, A2, C3 et C4, et « tes plis ↑ » d'A4 s'allume enfin. Une
entrée a son adresse, `#/relire/<h>`, qui ne quitte jamais l'appareil. Reste `#/installer`,
dont la forme dépend de la **mesure 4** — elle ne se simule pas, la page reste nue.

**Jalon 4 — l'atelier.** Le code est écrit, relu et commité en trois lots : le socle (le
tiroir, la garde à deux modules, les deux builds), D0 et D4, puis D1 à D3 avec le partage.
**L'empreinte du seuil est posée**, la porte s'ouvre, et un pli se compose et se dépose
depuis le téléphone sans passer par le code. Ce qui reste est à faire sur les deux
téléphones, et rien n'y bloque.

**Jalon 3 — la boucle.** Écrit, relu et commité en deux lots : le module du journal, puis A3
et A4 avec le passage à WhatsApp. L'échange fonctionne de bout en bout dans Chromium. Ce qui
reste tient en une séance sur les deux téléphones — et le jalon 2, lui, attend toujours la
sienne.

Les jalons 0 et 1 restent ouverts sur leurs gestes manuels, et eux seuls : déplier un lien
sur son téléphone, et les trois mesures du jalon 1. Aucun ne bloque la suite.

**La roadmap a été regroupée le 18/08/2026** : sept jalons deviennent cinq. Le jalon 5 est le
dernier ; après lui, il n'y a plus que « plus tard » — le poème, le bureau, le reste.

Le lancement tombait à la fin du jalon 3, et il y est resté : l'échange va de bout en bout.
Ce qui vient depuis est du confort — un pli ne se fabrique plus en ligne de commande, et le
journal se lit.

## Ce qui existe

- [x] `docs/` — la spécification, complète, elle fait foi
- [x] `design/` — l'archive figée, dont les cinq peintures dans `design/handoff/assets/`
- [x] `public/icones/` — icônes, manifeste et `og.png`, à servir tels quels
- [x] `scripts/icones.py` — la planche des icônes
- [x] `scripts/plier.mjs`, `plier.sh`, `plier.bat` — la moulinette du poème
- [x] `.claude/` — relecteurs, commandes, gardes
- [x] le socle npm — `package.json`, `tsconfig.json`, `tsconfig.isomorphe.json`, `vite.config.ts`
- [x] `src/lib/` — `codec.ts`, `dates.ts`, `routeur.ts`, `journal.ts`, `tiroir.ts`,
      `poeme.ts`, avec leurs six tests
- [x] les deux entrées — `index.html`, `atelier/index.html`
- [x] `src/lecteur/` — `main.ts`, `a1.ts`, `a2.ts`, `monte.ts`, `geste.ts`, `fond.ts`,
      `plis.ts` (`plateau.ts` est parti avec le plein cadre, et `reponse.ts` est devenu
      `monte.ts` en gagnant A5, 19/08/2026)
- [x] `polices-source/` et `src/fonts/` — les quatre familles, sources et sous-ensembles
- [x] `src/atelier/` — `main.ts`, `seuil.ts`, `reglages.ts`, `type.ts`, `textes.ts`,
      `apercu.ts`, `lien.ts`, `deposes.ts`, `poemes.ts`, `liste.ts`, `vue.ts`
- [x] `src/styles/` — `tokens.css`, `pli.css`, `depot.css` et les feuilles des types
- [x] `src/textures/` — les cinq peintures, en définition native. **Quatre sont servies** :
      le rideau est sorti du build avec l'image d'A1 (19/08/2026)
- [x] `src/fleches.html` — les deux tracés

## Jalon 0 — socle

- [x] `package.json`, Vite + TypeScript, deux entrées (`/` et `/atelier/`)
- [x] `src/lib/codec.ts` — isomorphe Node + navigateur, avec ses tests
- [x] `src/lib/dates.ts` — les formats français, avec ses tests
- [x] le routeur par hash
- [x] `.nojekyll`, `404.html`, `base: '/Pli/'` — le `CNAME` est parti avec `pli.re`
- [x] les deux workflows GitHub — vérification sur PR, déploiement sur `main`
- [x] un pli en dur, sans style
- [x] **à la main, chez moi** : Pages activé, source « GitHub Actions » — c'est bien celle
      que `deploiement.yml` demande, `actions/deploy-pages` ne sait pas déployer autrement
- [x] le déploiement tourne : les runs 2 et 3 de `deploiement.yml` sont en succès, le site
      est construit et publié
- [x] l'adresse réelle : **`https://leo-bernard38.github.io/Pli/`**. Le dépôt garde son nom,
      Pages en fait un site de projet servi sous `/Pli/`, et `base` vaut `/Pli/`. Le site ne
      répondait que des 404 tant que `base` valait `/` — corrigé le 18/08/2026, avec tout ce
      qui s'écrivait à la racine de l'hôte : le `fetch` d'un poème, le rechargement de
      secours, l'adresse fabriquée par l'atelier, le manifeste, `404.html`, les balises `og:`
      ([docs/hebergement.md](../docs/hebergement.md#ladresse))
- [ ] **à la main, chez moi** : le `curl` de vérification sur l'adresse réelle
      ([docs/hebergement.md](../docs/hebergement.md#ce-que-pages-ne-donne-pas))
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

Les tests passent — 34 à l'époque, **50 aujourd'hui** —, `npm run types` compile deux fois,
et dans Chromium en 390 × 844 à 3× :
le gabarit tient, les quatre polices se posent, un `#c=` **encodé sous Node** remplit le même
balisage sans rechargement, un lien abîmé laisse la page nue sans la vider, le tiret cadratin
et les accents français rendent, et `performance.mark('a1')` se pose une fois.

Poids réels, après build : **5,8 ko gzip** pour le premier écran (1,7 de document, 2,7 de
CSS, 1,4 de module) et **52,6 ko** pour les trois polices d'A1 — les deux largement sous
leurs cibles de 14 et 90 ko. Les cinq woff2 sont reproductibles **au bit près**.

En revanche : **2 requêtes avant le premier texte au lieu d'une**, et **6 avant A1 complet au
lieu de 5** — parce que le CSS et le module n'étaient pas encore inline. **Réglé au jalon 2**,
première étape : c'est une requête avant le premier texte. Le document pesait alors 5,86 ko
gzip ; il en pèse 10,5 aujourd'hui, tout le lecteur dedans.

## Jalon 2 — le pli et le geste

- [x] le document du lecteur se suffit à lui-même — gabarit et module inline, par le greffon
      `pli-inliner-le-document` de `vite.config.ts` ; **1 requête** avant le premier texte,
      **5,86 ko gzip** à l'époque, **12,26 ko** une fois A2, le geste, la réponse et le
      journal dedans — plafond de 14 ko tenu par le build, à chaque commit
- [x] ~~le pli tient dans l'écran — `--echelle` sur le pli~~ **remplacé le 19/08/2026** :
      le pli **remplit** l'écran, vérifié de 360 × 780 à 1440 × 900 — la page ne défile
      jamais ([decisions.md](decisions.md))
- [x] A1 · l'attente, pour les quatre types — le rideau, la promesse, le volet, l'invite
- [x] A2 · la découverte — invitation, pensée, souvenir, et la première strophe d'un poème
- [x] la vague 3 — la texture du type, son décodage, la feuille du type, Bodoni, puis le DOM
      d'A2 : **0 requête après le geste**, mesuré
- [x] le geste — les cinq chemins joués au pointeur, **exactement deux couches composées**
- [x] C4 · le lien abîmé
- [x] le plafond du gabarit, mesuré par type, et la garde qui va avec
- [ ] **à la main, sur les deux téléphones** : dix dépliages d'affilée, les quatre types, à
      froid et à chaud — **aucune image perdue**
      ([fluidite.md](../docs/fluidite.md#comment-on-mesure))
- [ ] **à la main** : le texte d'A1 peint en moins d'une seconde en 4G, cache vide

**Fin du jalon :** le premier vrai pli envoyé.

## Jalon 3 — la boucle

- [x] `lib/journal.ts` — le module, pas l'écran. Le seul qui touche `localStorage` ;
      dédoublonnage sur `h`, l'empreinte du payload, jamais sur `n` ; `[]` sur un JSON abîmé,
      rien qui lève en navigation privée
- [x] l'écriture au dépliage — le seuil **décide**, `transitionend` **écrit**, et `pagehide`
      comme `visibilitychange` écrivent aussi : elle peut partir avant la fin de l'animation
      ([fluidite.md](../docs/fluidite.md#écrire-le-journal-sans-bloquer))
- [x] A3 · la réponse — les trois mots, en `<a href>` : le navigateur gère la sortie
- [x] A4 · le mot — il affiche son mot et **n'affirme rien de plus**
- [x] le passage à WhatsApp dans le bon ordre : la réponse notée, **puis** A4, **puis**
      `wa.me` — et le retour par rechargement ne retombe jamais sur A1. Il tombait sur A4
      faute de mieux ; depuis le jalon 5 il tombe sur **C2**, le pli relu et le mot rappelé,
      ce que [partage.md](../docs/partage.md#le-retour) demandait
- [ ] **à la main, sur les deux téléphones** : la réponse envoyée pour de vrai, depuis le
      navigateur intégré de WhatsApp comme depuis Safari — c'est le seul endroit où l'on
      verra si `wa.me` revient bien sur la page, et dans quel bac de stockage
- [ ] **à la main** : le premier vrai pli envoyé (fin du jalon 2)

**Fin du jalon :** elle a répondu, et le mot est arrivé.

### Ce que ce jalon a trouvé, et qui ne se devinait pas

- **Un chunk de la vague 3 ne partage rien avec le module d'ouverture.** `reponse.ts`
  réemployait deux fonctions de `a2.ts` : Rollup en a fait un chunk qui importe le chunk
  d'entrée — lequel est inliné dans le document, **puis supprimé**. Build vert, vague 3
  morte au moment du geste, sans un mot. Les deux fonctions sont recopiées, et
  `pli-inliner-le-document` refuse désormais le build qui le referait. C'est la moitié du
  « chunk commun » que le jalon 2 avait gardé sans le résoudre — l'autre moitié attend
  l'atelier.
- **`touch-action: none` avalait le tap de la réponse.** Le geste ne relâchait que ce qui
  était dans un `<button>` ; les trois mots d'A3 sont des `<a>`. Aucun clic n'arrivait, et
  rien ne le disait. La sortie est maintenant `a, button`.
- **La couche cachée restait au clavier.** Les deux couches d'un pli sont toujours là,
  l'une seulement décalée : au Tab depuis A1, on tombait sur « répondre » en bas d'A2 — et
  depuis qu'il agit, il ouvrait la réponse d'un pli qu'elle n'avait pas déplié. `inert` suit
  maintenant l'état : A1 sort quand le pli s'ouvre, A2 quand la réponse monte, A3 quand le
  mot arrive. Vérifié au Tab sur les quatre écrans.
- **Le carmin sur carmin ne se voit pas.** A4 affichait son mot en 78px, entièrement
  invisible : `.titre` bascule sur encre depuis le jalon 1, pas sur carmin.
- **Les imports dynamiques du document inliné sont réécrits en absolus.** La garde qui les
  interdisait en relatif était là depuis le jalon 2 ; rien ne les rendait absolus, et le
  premier `import()` de module l'a fait échouer.

## Jalon 4 — l'atelier

- [x] `src/lib/tiroir.ts` — le second et dernier module de stockage : le seuil, les réglages,
      le compteur, les déposés, et l'empreinte du seuil. Séparé de `journal.ts` parce que le
      numéro de réponse n'a rien à faire dans le module que le lecteur importe ; la garde de
      `verifie.mjs` accepte deux modules, et deux seulement
- [x] **deux builds au lieu de deux entrées** — `vite build --mode lecteur` puis
      `--mode atelier`. L'atelier importe `codec.ts` sans que Rollup sorte un chunk commun
      qui coûterait une requête avant le premier texte. C'est l'autre moitié du « chunk
      commun » que le jalon 2 avait laissée ouverte : elle est refermée
- [x] D0 · le seuil — une ligne, aucune action à appuyer, la comparaison sur une empreinte
- [x] D4 · le tiroir — le numéro de réponse, la signature, le prochain numéro, gardés à
      chaque signe ; l'invitation reste grise tant que le numéro est vide
- [x] D1 · le type — quatre lignes, chacune avec le layout vu en petit. Le poème est visible
      mais inactif : il passe par la moulinette, et D2p arrive avec lui
- [x] D2 · les textes — les lignes nommées, l'aperçu qui se remplit pendant la frappe, et le
      compteur calé sur ce que **le papier** porte, mesuré
      ([donnees.md](../docs/donnees.md#ce-que-le-papier-peut-porter--mesuré-pas-estimé))
- [x] D3 · le lien — le lien ne s'affiche pas, deux actions à la place : envoyer (partage
      natif) et copier. Le dépôt est noté avant le partage
- [x] mon historique des plis déposés — `pli.v1.deposes`, dédoublonné sur le payload, jamais
      sur le numéro
- [x] D5 · les plis déposés — l'écran qui relit le tiroir. La roadmap le demandait bien
      (« mon historique des plis déposés ») ; `parcours.md` ne le dessine pas et n'en dit
      qu'une ligne, « relire et renvoyer ce que j'ai déposé ». Les deux trous ont été
      comblés avec l'auteur, pas devinés : la ligne reprend la grammaire du sommaire de C1,
      et l'accès est une ligne discrète sur D1, qui ne se montre que si elle mène quelque
      part. **Renvoyer n'est pas déposer** : le lien se refabrique depuis le payload gardé,
      sans réencoder, sans noter un dépôt et sans avancer le compteur — c'est le pli qui est
      parti la première fois, à l'identique. D3 sert les deux fois, seule sa conduite change
- [x] **l'empreinte du seuil est posée** dans `src/atelier/seuil.ts`. La porte s'ouvre, et
      ce qui attendait derrière est débloqué — dont le contraste de l'atelier, plus bas
- [ ] **le compteur de signes du LIEN attend la mesure 1.** D3 affiche le nombre de signes
      du lien fini, sans le juger : le plafond se mesure WhatsApp → iOS → Safari, il ne
      s'estime pas. Ce qui est tenu aujourd'hui, ce sont les plafonds du **papier**, qui sont
      mesurés, eux
- [ ] **à la main, sur les deux téléphones** : composer un pli de chaque type et l'ouvrir
      chez elle — c'est le seul endroit où l'on verra le partage natif et le presse-papier
- [ ] **à la main, sur mon téléphone** : sur D5, la conduite à 360px (« ← les plis » et
      « déjà déposé » côte à côte), et la ligne discrète de D1, volontairement sous les 76px
      que `.type` et `.depose` s'imposent — reste-t-elle franchissable au pouce ?

**Fin du jalon :** je compose et j'envoie depuis mon téléphone, sans passer par le code.
Vraie depuis que l'empreinte du seuil est posée — reste à le faire pour de bon, sur les
deux téléphones.

### Ce que la revue de D5 a trouvé

- **Le filet de focus de l'atelier n'existait pas.** `pli.css` écrit `:focus-visible` en fin
  de feuille pour gagner à spécificité égale — mais ce calcul ne vaut qu'à l'intérieur d'une
  feuille. `depot.css` est chargée **après**, donc à égalité c'est encore l'ordre qui tranche,
  et c'est `all: unset` qui gagnait. `.type` tabulait sans filet visible **depuis le jalon 4**,
  et personne ne l'avait vu : la faute n'était pas dans le lot, elle y a seulement été
  trouvée. Les trois cibles — `.type`, `.depose`, `.passage` — ont maintenant leur règle.
- **La typographie recopiée dérive.** Les trois classes `.depose__*` réinventaient des valeurs
  proches de `.etiquette`, `.voix voix--corps` et `.etiquette--fine` — le mémo garde
  justement la trace d'une de ces valeurs corrigée après coup. La ligne réemploie désormais
  le vocabulaire de `pli.css`, comme le sommaire de C1.
- **D5 s'ouvrait avant sa liste.** Le décodage est asynchrone ; l'écran s'affichait une frame
  sans liste et sans son mot. Il attend maintenant d'être entier, comme C1.

## Jalon 5 — la durée

- [x] C1 · le journal — un sommaire de revue, pas un fil : le numéro et le type, ce qui est
      écrit, depuis quand, et le mot s'il y en a un. Le décodage se rejoue à l'affichage —
      le journal range le payload, jamais l'objet décodé. Une entrée devenue illisible s'en
      va seule, les autres restent
- [x] C1 à l'état vide — le papier froissé, la seule fois où le produit se montre lui-même
- [x] C2 · la relecture — le pli entier, tel qu'il s'est déplié, et le mot rappelé à la
      place de « répondre » : on ne répond pas deux fois. Deux chemins y mènent, et c'est le
      même écran — une entrée du journal, et le retour de WhatsApp par rechargement
      ([partage.md](../docs/partage.md#le-retour))
- [x] C3 · le pli refermé — un lien déjà déplié ne se rejoue pas ; il mène au journal
- [x] la marque comme chemin discret, et `#/relire/<h>` dans le routeur, avec ses tests
- [ ] **`#/installer` attend la mesure 4.** Sa forme dépend de la réponse : le journal de
      l'app installée est-il celui de Safari. La route existe, la page reste nue — un écran
      qu'aucune mesure n'a dessiné ne s'invente pas
- [ ] **le réglage de cadence sur son iPhone**, au moment de l'installation — à faire à la
      main, sur son téléphone
- [ ] **à la main, sur les deux téléphones** : le journal relu après deux semaines de
      silence — c'est la phrase de fin du jalon, et elle **dépend de la mesure 2**

**Fin du jalon :** son journal existe et survit à deux semaines de silence. La première
moitié est vraie ; la seconde se mesure, elle ne se code pas.

## Le socle de mise en page — 19/08/2026

Le pli et l'atelier remplissent le viewport. Écrit, relu et commité en quatre lots : le
cadre, l'atelier et son clavier, le contraste, la doc.

- [x] `.pli` et `.ecran` en plein cadre, `plateau.ts` et `--echelle` supprimés
- [x] l'encoche portée par le contenu, remise à zéro dans `.mini`
- [x] le clavier réduit la vue, l'action reste collée en bas ; le zoom est bloqué
- [x] le contraste du **lecteur** mesuré sur ce que le navigateur peint, aux trois largeurs
      — au pire 4,84:1, et trois défauts corrigés : C1 vide, la marque en carmin sur le
      rideau, et D3 qui composait en crème sur crème depuis le jalon 4
- [x] le filet de focus rendu aux deux lignes de saisie — `docs/integration.md` le demandait
      depuis le jalon 1, case non cochée
- [ ] **le contraste de l'atelier n'est toujours pas mesuré**, mais il n'est plus bloqué :
      l'empreinte du seuil est posée. D0 mesure 4,48:1 au pire ; D1 à D5 et D2p ont été relus
      à l'œil, pas chiffrés. Le harnais peut maintenant passer la porte
- [ ] **à la main, sur les deux téléphones** : compter les couches à l'inspecteur pendant
      un dépliage — `container-type: size` sur `.pli` est une propriété de confinement que
      ce dépôt n'a jamais mesurée, et un coût de couche se mesure
- [ ] **à la main, sur les deux téléphones** : `100dvh` ne bouge pas pendant un geste
      parce que la page ne défile plus. C'est une **déduction**, pas une mesure — et le
      navigateur intégré de WhatsApp est le cas où elle peut tomber
- [ ] **à la main** : refaire les plafonds du papier à la hauteur visible la plus courte
      qu'on serve ([donnees.md](../docs/donnees.md#ce-que-le-papier-peut-porter--mesuré-pas-estimé))
- [ ] **à trancher, et ça attend les maquettes** : `theme-color` vaut le sable, qui
      n'entoure plus rien. Au-dessus d'un A1 devenu le rideau plein cadre, la barre du
      navigateur fait une couture claire que le plateau cachait. Toucher la balise touche
      aussi le manifeste — ce n'est pas une décision de mise en page. Aucune valeur unique
      ne convient à tous les écrans (le rideau sombre d'A1, le crème d'A2 et du journal),
      donc la réponse est un choix d'auteur qui doit se rapprocher des maquettes
      **Pli — Maquettes** de Claude Design. Elles n'ont pas pu être lues le 19/08/2026 : le
      serveur de Claude Design demande `/design-login`, qui exige un terminal interactif que
      la session distante n'a pas. À reprendre depuis une session locale, ou après un « Send
      to Claude Code Web » qui sème le projet dans l'espace de travail
- [x] **le paysage, tranché le 19/08/2026 : il n'existe pas.** On ne sert que du portrait
      mobile. Aucune règle d'orientation n'entre dans les feuilles, le manifeste disait déjà
      `orientation: "portrait"`, et une composition coupée sur un téléphone couché est
      acceptée — c'est écrit dans
      [installation.md](../docs/installation.md#le-manifeste-et-les-icônes)

## Les maquettes retrouvées — 19/08/2026

`design/handoff/` n'exportait que trois pages. Le projet design en compte **six canevas**,
et ils dessinent des écrans que [parcours.md](../docs/parcours.md#3-ce-qui-nest-pas-encore-maquetté)
listait comme jamais dessinés : **C2 à C5**, **B0a-c**, **B2 · B3**, et l'atelier. Ces
écrans-là ont donc été codés sans leur maquette.

- [x] les six canevas entrent dans l'archive — [`design/canevas/`](../design/canevas/README.md),
      avec leur README. La garde passe de « rien ne bouge sous `design/` » à **« l'archive
      peut s'agrandir, jamais changer »** : elle lit les états, accepte un ajout, refuse
      toujours modification, suppression et renommage. Vérifiée dans les deux sens
- [x] le relevé des écarts, écran par écran, dans
      [integration.md](../docs/integration.md#les-maquettes-que-le-handoff-navait-pas-transportées) —
      ce que chaque canevas montre, ce que le produit en retient, ce qu'il en écarte
- [x] le `handoff/` du projet design est identique **bit pour bit** à celui du dépôt :
      l'archive était à jour, il n'y avait rien à reprendre de ce côté
- [ ] **C4 reste nu, et c'est tranché** : la maquette lui donne « voir tes plis ↑ » en bas,
      l'auteur a choisi de n'en rien faire — un lien abîmé n'invite pas à aller ailleurs
- [x] **A1 · la promesse suit le type.** `parcours.md` disait « seule la promesse change »
      puis n'en donnait qu'une ; le gabarit l'écrivait en dur pour les quatre. Les quatre
      promesses viennent des écrans d'attente du design, débarrassées de ce qu'elles
      comptaient — **aucune ne chiffre** : le plafond d'une pensée est en signes, pas en
      lignes, et `revue-ecran` a refusé la première version qui promettait « deux lignes ».
      Celle de l'invitation reste en dur, les trois autres la remplacent au décodage, dans
      la même frame que le numéro et la signature. **+379 octets gzip** : le document passe
      de 11 609 à 11 988, plafond 14 336
- [x] **C2 · le rappel va vers la maquette** : un écran de synthèse — ce qu'elle a répondu,
      quand, de quoi il s'agissait — et « relire le pli » pour le pli entier, qui est ce
      que le code faisait jusqu'ici. Trois écarts assumés à cette maquette : on écrit
      « répondu le … » et non « réponse envoyée », parce que rien ne garantit qu'elle a
      appuyé sur envoyer ; une seule action, la marque menant déjà au journal ; et sa phrase
      « Le pli reste lisible. Onze jours. » n'est pas reprise — elle promet une durée que
      **la mesure 2** n'a pas rendue

Le §11 du `PLI.md` du projet design décrit l'icône et laisse un « reste à faire » —
vectoriser la lettre. **Il est déjà fait** : `scripts/icones.py` sort des `<path>`, aucun
`<text>`, et `PLI.md` n'entre pas dans l'archive parce qu'il en modifierait une page.

## Le poème — 19/08/2026

- [x] la moulinette — `scripts/plier.mjs`, `plier.sh`, `plier.bat`, et `src/lib/poeme.ts`
      sous tests. Les deux invariants tiennent, vérifiés de bout en bout : le jeton d'un
      numéro connu se réutilise (un poème corrigé garde son lien), et rien ne se supprime.
      `codec.ts` sort deux primitives, `serrer` et `detendre` — l'index s'encode avec la même
      machinerie. **L'alphabet du jeton est tranché** : la moulinette tire dans exactement ce
      que le routeur accepte, jamais plus large
- [x] **le poème défile**, et c'est l'exception nommée à la première des cinq règles. La
      pagination strophe par strophe (B2 · B3, « la suite ↑ ») est écartée. Le doigt se rend
      sur le cadre, pas depuis la feuille du type — `touch-action` se croise le long des
      ancêtres — et **une fois le poème ouvert seulement** : un conteneur qui défile se fait
      promouvoir en couche, et le rendre scrollable pendant le geste ferait trois couches au
      lieu de deux
- [x] C5 · l'attente du fichier, d'après la maquette retrouvée — la marque, un pointillé
      carmin, « un pli arrive », et une respiration en `opacity` que
      `prefers-reduced-motion` arrête
- [x] **hors ligne ≠ introuvable** — un fichier absent et un réseau coupé arrivaient tous
      deux sur « lien abîmé ». Seul un `fetch` qui **lève** est un réseau coupé ; un 404 est
      un fichier qu'on n'a pas. Le second a son écran et son « réessayer »
- [x] D2p · quel poème — la liste lue dans l'index encodé, la grammaire de C1 et de D5, et
      trois états : la liste, « aucun poème » qui est un fait, « pas de réseau » qui passe.
      **Choisir un poème n'est pas le déposer** : aucun dépôt noté, le compteur n'avance pas
- [x] le compteur calé sur l'index — un poème écrit hors atelier consommait un numéro que
      le tiroir ignorait, et deux plis auraient fini par porter le nº 015. C'est la question
      que la roadmap laissait ouverte depuis le jalon 4
- [ ] **le seuil d'apparition de C5 n'est pas mesuré.** 300 ms, et `docs/` n'en donne aucun
      — à vérifier sur les deux téléphones, en 4G. Trop court, l'attente clignote ; trop
      long, elle regarde un écran vide
- [ ] **à la main, sur les deux téléphones** : le défilement d'un poème au pouce, contre le
      geste. Et compter les couches pendant le dépliage d'un poème — le risque est supprimé
      par construction, il reste à le voir
- [ ] **à la main, sur les deux téléphones** : un poème de quatre mots. `flex-start` laisse
      le vide **en bas**, un motif que le produit n'a nulle part ailleurs
- [ ] **à la main, chez moi** : sauvegarder `plis-source/` ailleurs que sur la machine. Les
      poèmes se redécodent, mais il faudrait passer par le décodeur pour les relire

### Ce que les relectures ont trouvé

- **Un index présent mais vide était pris pour un premier lancement.** Une écriture
  interrompue laisse exactement ça — `writeFile` tronque avant d'écrire — et repartir de
  zéro aurait réattribué les jetons. Seule l'absence du fichier vaut « premier lancement ».
- **Deux sources pouvaient déclarer le même `n`.** Le numéro vient du front-matter, pas du
  nom du fichier : la seconde écrasait le `.txt` de la première sous le même nom, lien
  valable et contenu changé, sans un mot.
- **`docs/` s'est contredit lui-même deux fois.** Corriger la règle 1 dans six fichiers en
  a laissé trois en arrière — `integration.md`, `concept.md`, `fluidite.md` disaient encore
  « paginer ». Puis le lot suivant a ajouté une troisième exception à la centration
  verticale sans toucher la liste qui disait « deux, et elles seules ». Une exception qui ne
  vit que dans sa note d'écart est une brèche ouverte.
- **Au clavier, un poème plus long qu'un écran était illisible.** Une `div` en
  `overflow-y: auto` n'entre jamais d'elle-même dans l'ordre du Tab, et la marque était le
  seul élément atteignable de l'écran — elle mène ailleurs.
- **`chemin()` prenait ses classes à la marque** en la transformant en lien
  (`className = 'marque'`). C5 ne respirait pas. Le défaut datait du jalon 5.

### La maquette disait déjà que le poème défile

Trouvé en allant chercher C5 dans `design/canevas/` : l'annotation du canevas
**Pli — Maquettes** écrit « le poème est **le seul type qui défile** ». Six documents de
`docs/` décrivaient pourtant une pagination que rien dans `design/` ne demande. C'est
l'inverse du cas habituel — d'ordinaire c'est l'archive qui se trompe et `docs/` qui
corrige ; ici la spécification s'était éloignée de sa source sans le noter. Relevé dans
[integration.md](../docs/integration.md). Un point de cette annotation n'est **pas** repris :
le « repère de progression en haut ».

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

Elles sont archivées dans [`decisions.md`](decisions.md) — on y ajoute une ligne datée par
décision, on ne relit pas le fichier en entier.

## Ce que les relecteurs demandent pour la suite

**Au jalon 2, pour le gabarit** — le **débordement par le haut** est traité des deux côtés
depuis le 18/08 : un plafond par type au dépôt, et `.corps { overflow: hidden }` dans le
gabarit, pour qu'un lien fabriqué à la main ne recouvre jamais la marque. Ce qui reste
ouvert est ailleurs (voir plus bas). ~~Un pli de 780px
sur un écran visible plus court.~~ **Refermé le 19/08/2026**, mais pas par la mise à
l'échelle : par le plein cadre. Ce qui reste de la question a changé de forme et vit
maintenant dans [donnees.md](../docs/donnees.md#ce-que-le-papier-peut-porter--mesuré-pas-estimé)
— sur une hauteur visible **plus courte que 780**, les plafonds du papier supposent une
place que la composition n'a plus.

~~**Au jalon 2, pour le geste** — le `<button>` « déplier » du clavier n'a pas encore
d'endroit où vivre.~~ **Périmé** : il est dans le volet depuis le jalon 2 (`index.html`), et
le geste laisse passer ce qui est dans un `a` ou un `button`.

**Au jalon 2, pour le chargement** — ~~l'inlining du CSS et du module~~ **fait**, première
étape du jalon 2. Le chunk commun est **à moitié résolu** : côté lecteur, un chunk de la
vague 3 qui partagerait quoi que ce soit avec le module d'ouverture fait maintenant échouer
le build, et `reponse.ts` recopie les deux fonctions plutôt que de les importer d'`a2.ts`.
Reste l'autre moitié : le jour où l'atelier importera `codec.ts` (jalon 4), il faudra
trancher — deux builds séparés, ou l'inlining du graphe entier.

~~**Au jalon 2, pour l'invite et le mouvement**~~ — **fait, et mieux que demandé.** L'invite
**s'arrête** au toucher au lieu de se mettre en pause : mesuré à l'inspecteur, `paused` garde
la couche promue et le cachet se fait promouvoir à son tour — quatre couches au lieu de deux.
`prefers-reduced-motion` tombe bien à 120 ms (`geste.ts`).

~~**Au jalon 2, pour la marque `a1`**~~ — **fait** : elle suit le texte d'A1, un lien abîmé
ne marque rien, et le type de lien voyage avec elle (`main.ts`, `performance.mark('a1',
{ detail: { lien } })`).

**Au jalon 2, pour A1 et A2** — trois choses restent en l'air, notées dans
[integration.md](../docs/integration.md#ce-qui-a-été-tranché-avec-a1-au-jalon-2) : le fond d'A1
(`parcours.md` dit le rideau, la maquette montre un papier crème), l'empilement de
`.image--pleine` avec le texte, et la composition des faits.

~~**Au jalon 4, pour l'atelier** — `index.html` embarque `#fleche-droite` sans s'en
servir.~~ **Périmé le 19/08/2026** : le chemin de C1 vers l'atelier le porte, et c'est la
seule flèche du produit qui mène ailleurs plutôt que de remonter dans la page. La réserve de
219 octets n'en est plus une. **Le budget serre** — 13 471 sur 14 336. Le fragment reste
monolithique pour n'avoir qu'une chose à recopier et une seule à comparer.

## La revue de tout, au navigateur — 19/08/2026

Une passe sur le code **et** la doc, sur le build ouvert dans un navigateur. Ce qui suit
n'était visible dans aucun diff : `verifie`, `types` et `test` passaient tous les trois, et
aucun relecteur n'avait rien vu. Le détail et le pourquoi sont dans
[decisions.md](decisions.md).

- [x] **A1 n'a plus d'image** — papier crème, comme la maquette. 4 requêtes au lieu de 5,
      **89 ko au lieu de 703**, et le rideau sort du build. `.volet__ombre`, que `pli.css`
      portait sans que rien ne l'écrive, est posée
- [x] **A3 et A4 recouvraient le journal** — depuis A4, « tes plis ↑ » construisait bien C1,
      **sous** A4. Le chemin principal du jalon 5 ne menait nulle part
- [x] **le cadre défilait de 180px au clavier** — `overflow: hidden` fait du pli un conteneur
      de défilement, et le focus du bouton « déplier » l'y faisait glisser. `clip` le referme
- [x] **`refermer()` ne reposait pas les couches** quand le pli n'était pas ouvert : après une
      relecture, « répondre » d'A2 se ramassait au Tab depuis A1
- [x] **trois peaux de navigateur oubliées dans l'atelier** — le retrait de 40px des `<ul>` de
      D5 et D2p, la bordure système de `.conduite__retour` sur les six écrans, et le filet de
      focus peint sur toute la hauteur de l'écran
- [x] **le titre manquait à l'aperçu de D2** — `safe` était décrit en commentaire depuis le
      jalon 4 et n'avait jamais été écrit
- [x] **le code mort** — `Depot.payload`, le compteur module de l'atelier, le paramètre `pli`
      de `tete()`, `.titre--section`, `#a4 .action`, trois commentaires orphelins
- [x] **la doc remise d'aplomb** — `@layer` qu'on n'emploie pas, « deux entrées Vite » qui
      sont deux builds, `poeme.ts` absent de l'arborescence, cinq tests annoncés pour six,
      « une strophe est une page » qui contredisait le défilement, le compteur de D2 renvoyé
      à la mauvaise mesure, quatre cases d'accessibilité faites mais non cochées, l'invite
      « en pause » que `fluidite.md` avait déjà corrigée en « arrêtée »
- [x] **`verifie.mjs` cesse de crier ce qu'il a déjà accepté** — plus aucun grief permanent

Ce que la passe a **regardé sans y toucher**, et qui appartient à l'auteur :

- [ ] **le contenu du volet d'A1 est collé en haut**, et les deux sources du design ne disent
      pas la même chose : le prototype `handoff/lecteur.html` le pose à 50px du haut, le
      canevas **Pli — Maquettes** l'aligne en bas avec 30px de pied. Le dépôt suit le
      prototype. À 34 % de 844px, ça laisse **environ 190px de carmin vide** sous « glisser
      vers le haut ». `docs/` ne tranche pas — c'est une composition, elle se choisit
- [ ] **l'aperçu de D2 ne peut pas tout montrer** d'une invitation remplie. Il réserve les
      34 % du volet — qui appartient à A1 — pour composer le contenu d'A2, qui, lui, n'a pas
      de volet mais un bandeau de 46 %. Depuis `safe`, ce qui déborde sort par le bas au lieu
      du haut : le titre revient, les faits et la signature se coupent. La vraie question est
      ce que l'aperçu doit montrer, et elle n'a pas de réponse dans `docs/`
- [ ] **« glisser vers le haut » ou « tirer la pliure vers le haut »** — le prototype dit le
      premier, le canevas le second, et « la pliure » est un mot du lexique. Rien ne tranche
- [ ] **le compteur de D2 se lit mal** : il affiche « 3 signes » pour dire qu'il en reste
      trois, et « 16 signes » sur une ligne vide. Ce qui reste et ce qui est écrit se lisent
      pareil

## Les parcours — les sorties, et le relais rouvert — 19/08/2026

Trois culs-de-sac, trouvés en traversant le produit à l'écran. Écrit, relu par `revue-ecran`
et `garde-fluidite`, mesuré au navigateur, commité.

- [x] **les trois types sans réponse ont une sortie.** « c'est lu ↑ » en bas d'A2 fait monter
      **A5 · la fermeture** — carmin, la composition d'A4. La maquette dessinait ce pied de
      page sur B1, B3 et B4 et le tableau des écarts sautait justement ces quatre écrans :
      l'écart n'avait jamais été ni repris ni écarté, il avait été perdu
- [x] **A3 n'était sortable par rien.** Sa marque était un `<p>`, pas un chemin : qui ouvrait
      « répondre » sans vouloir répondre n'avait que trois liens WhatsApp. A3 et A4 écrivent
      maintenant leur marque en `<a>` — elles ne peuvent pas appeler `chemin()`, qui vit dans
      le chunk d'entrée
- [x] **la relecture aussi.** `rappeler()` retirait l'action d'A2 sans rien mettre à la
      place : un pli relu n'avait plus de sortie visible, sur les quatre types. Elle est
      **remplacée** par « tes plis ↑ ». Défaut trouvé en écrivant le reste, pas en le lisant
- [x] **le relais est rouvert**, et le design avait raison depuis le début (« A4 · le
      relais », « écrire à ton tour ↑ »). C1 finit par « l'atelier → », D1 et D5 par « les
      plis reçus → ». Chacun a les deux entrées sur son téléphone, et **rien ne se
      synchronise** : deux `localStorage`, deux bundles, le seuil tient toujours
- [x] **C1 et D5 ne se confondent pas.** Elles partagent leur grammaire et se touchent
      désormais : les lignes de D5 disent « déposé hier », là où « hier » seul disait deux
      choses selon l'écran
- [x] **le titre d'A5 est à 56px**, mesuré : « REFERMÉ » demandait 368px pour une colonne de
      308. Trouvé à l'œil, sur le build — aucun relecteur ne l'avait vu
- [x] **le module part pendant A1, les couches se posent à `transitionend`.** `armer()` rend
      le `pointerdown` vivant de façon synchrone : un `await import()` juste après se
      résolvait **en plein dépliage** et insérait une section dans un cadre en
      `container-type: size`. Le défaut existait pour l'invitation seule ; il passait à
      quatre types sur quatre. Trouvé par `garde-fluidite`
- [x] **`poserLesCouches` vit hors d'`armer()`.** Le geste ne s'arme qu'une fois par session :
      un `auDepliage` qui aurait appelé la fonction du premier pli l'aurait gardée pour
      toujours. Même mécanique qu'`entreeDuPli`
- [x] **le chemin de C1 était invisible sur l'écran vide.** `.passage` sans `position`
      passait **sous** le papier froissé — une image pleine page est une couche positionnée.
      Il restait dans l'ordre du Tab. Trouvé par `revue-ecran` ; c'est le même oubli que
      `.tete` et `.corps` ont chacune réparé de leur côté
- [x] **`.passage` remonté à `.62` des deux côtés** — celui de l'atelier mesurait **2,98:1**
      à `.45`. Celui de C1 tient 5,11:1 sur le sommaire, 6,94 sur l'écran vide
- [x] **le sélecteur du chemin vers D5** se désigne par sa destination : `.passage` nu
      prenait le premier du document, et ils sont quatre depuis ce lot
- [x] la grammaire de liste de l'atelier est partagée (`liste.ts`) au lieu d'être recopiée
      dans `deposes.ts` et `poemes.ts` — le bundle de l'atelier perd 230 octets au passage
- [x] `#fleche-droite` **sert enfin** dans le document du lecteur : il l'embarquait sans
      l'employer depuis le jalon 4, et c'était la première réserve de budget nommée

Le document du lecteur passe de **13 131 à 13 471 octets** gzip, plafond 14 336.

- [ ] **deux contrastes de l'atelier restent sous le seuil**, mesurés à 360 de large sur ce
      que le navigateur peint, et **non corrigés** : `.conduite__retour` à **4,06:1** et
      `.conduite__pas` à **2,98:1**. Ils ne sont pas dans ce lot ; ils ferment une partie de
      la case « le contraste de l'atelier n'est pas mesuré » plus haut
- [ ] **le corps de D5 se compose en bas**, alors qu'il porte `corps--haut`. Vérifié : ce
      n'est pas ce lot — `plis.css` n'est jamais chargée par l'atelier, et la règle
      `.corps:has(~ .passage)` ne peut pas l'atteindre. À regarder pour lui-même
- [ ] **l'accent d'A4 est coupé** quand le mot passe à la ligne — « ÊTRE » de « PEUT-ÊTRE »
      perd son circonflexe sous la ligne du dessus, à 78px. Vu sur le build, hors lot
- [ ] **à la main, sur les deux téléphones** : un tap immédiat après l'arrivée d'A1, avant
      que `monte.ts` soit chargé, et le compte des couches pendant la montée d'A5 —
      `garde-fluidite` ne peut pas trancher si `.pli__monte` est réellement promue par son
      seul `translate3d` statique

## Les mouvements, révisés — 19/08/2026

Le geste était la **seule** transition du produit, et il ne tournait pas. Mesuré sur le
build, pas sur `npm run dev`.

- [x] **le dépliage s'anime enfin.** Le minifieur réécrit `--ouvre: 460ms` en `.46s`, et
      `parseFloat` en tirait **0,46** : le module posait `transform 0.46ms` et la feuille
      sautait en une image, en production seulement. Le doigt n'était pas touché — seul le
      relâchement claquait, ce qu'aucune capture ne montre. La courbe se lit maintenant dans
      les chiffres : −360 → −644 en 130 ms, puis −827 → −831 sur les dernières
- [x] **ce qui se touche répond au doigt.** Zéro `:active` dans tout le produit, et `.pli`
      coupe le halo du navigateur : taper « répondre » ou une entrée du journal ne produisait
      rien jusqu'à l'écran suivant
- [x] **un écran demandé se pose, un écran chargé jamais.** 160 ms d'opacité après un tap ;
      A1, C4, C5 et hors ligne arrivent avec la page et ne fondent pas — un chargement n'a
      pas à être accompagné, il a à être court
- [x] **la marque cesse de disparaître au survol.** `a:hover` la repeignait en encre, sur
      C3 qui est en encre
- [x] **« copié » revient à « copier le lien »** au bout de 1,6 s. Il restait pour toujours,
      et le dépôt suivant retrouvait un bouton qui prétendait avoir déjà copié

Ce que la passe a **regardé sans y toucher** :

- [ ] **le journal arrive d'un bloc.** Un décalage ligne à ligne serait joli et ne servirait
      rien : c'est un sommaire, on le balaye. Écarté, pas oublié
- [ ] **`.type[aria-pressed]` bascule sec.** Le fond carmin à 5 % apparaît d'un coup. C'est
      un état, pas un mouvement — à rouvrir seulement si le choix du type paraît sourd sur
      le téléphone

## Ce qui reste ouvert

- **Un vrai domaine, plus tard ?** L'adresse ne se gèle qu'au **premier pli envoyé**. Tant
  qu'aucun lien n'est parti, `leo-bernard38.github.io/Pli` peut encore devenir un domaine acheté :
  on le renseigne dans les réglages du dépôt, on pose les enregistrements DNS de GitHub, on
  active « Enforce HTTPS ». Après le premier pli, non — il est dans une conversation. Le
  préfixe compte **36 signes** aujourd'hui (`https://leo-bernard38.github.io/Pli/`), dont
  quatre pour le sous-chemin, contre 15 pour un domaine court (`https://pli.re/`) — à
  rapprocher de la mesure nº 1 quand elle sera faite.

- **L'alphabet du jeton d'un poème.** Le routeur n'accepte que `numéro-jeton` en minuscules et
  chiffres. [docs/donnees.md](../docs/donnees.md#la-moulinette) dit « quatre signes » et rien
  de plus. Être plus large que la moulinette est sans danger, l'inverse casserait un lien déjà
  parti : **l'alphabet se décide dans le routeur et la moulinette ensemble**, avec le poème.
- **Les versions des actions GitHub** n'ont pas pu être vérifiées depuis cette machine (l'API
  de GitHub n'y est pas ouverte). Si un workflow tombe sur une action dépréciée, monter la
  version majeure — le contenu des deux fichiers, lui, ne bouge pas.
