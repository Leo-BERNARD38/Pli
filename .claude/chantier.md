# Chantier — où en est la construction

Ce fichier est **l'état**, pas le plan. Le plan est [docs/roadmap.md](../docs/roadmap.md) et
il ne bouge pas ; ce fichier dit ce qui a réellement atterri, et il se met à jour à chaque
étape terminée. C'est ce qu'une nouvelle session lit en premier pour savoir où reprendre.

Une étape n'est cochée que lorsqu'elle est **écrite, relue et commitée**.

## Jalon courant

**Jalon 5 — la durée.** Le journal se lit. C1 le sommaire et son état vide, C2 la relecture
d'un pli depuis une entrée, C3 le pli refermé, et la marque « Pli » devenue chemin discret :
elle mène au journal depuis A1, A2, C3 et C4, et « tes plis ↑ » d'A4 s'allume enfin. Une
entrée a son adresse, `#/relire/<h>`, qui ne quitte jamais l'appareil. Reste `#/installer`,
dont la forme dépend de la **mesure 4** — elle ne se simule pas, la page reste nue.

**Jalon 4 — l'atelier.** Le code est écrit, relu et commité en trois lots : le socle (le
tiroir, la garde à deux modules, les deux builds), D0 et D4, puis D1 à D3 avec le partage.
Un pli se compose et se dépose depuis le téléphone, sans passer par le code. Deux gestes
manuels restent, et un seul bloque : **l'empreinte du seuil**, à fabriquer en local avec
`/seuil` et à recopier dans `src/atelier/seuil.ts` — tant qu'elle est vide, rien ne passe la
porte, et c'est délibéré.

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
- [x] `.claude/` — relecteurs, commandes, gardes
- [x] le socle npm — `package.json`, `tsconfig.json`, `tsconfig.isomorphe.json`, `vite.config.ts`
- [x] `src/lib/` — `codec.ts`, `dates.ts`, `routeur.ts`, `journal.ts`, `tiroir.ts`, avec
      leurs tests
- [x] les deux entrées — `index.html`, `atelier/index.html`
- [x] `src/lecteur/` — `main.ts`, `a1.ts`, `a2.ts`, `reponse.ts`, `geste.ts`, `fond.ts`,
      `plateau.ts`, `plis.ts`
- [x] `polices-source/` et `src/fonts/` — les quatre familles, sources et sous-ensembles
- [x] `src/atelier/` — `main.ts`, `seuil.ts`, `reglages.ts`, `type.ts`, `textes.ts`,
      `apercu.ts`, `lien.ts`
- [x] `src/styles/` — `tokens.css`, `pli.css`, `depot.css` et les feuilles des types
- [x] `src/textures/` — les cinq peintures, en définition native
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

Les 34 tests passent, `npm run types` compile deux fois, et dans Chromium en 390 × 844 à 3× :
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
      **5,86 ko gzip** à l'époque, **10,5 ko** une fois A2, le geste, la réponse et le
      journal dedans — plafond de 14 ko tenu par le build, à chaque commit
- [x] le pli tient dans l'écran — `--echelle` sur le pli, vérifié de 320 × 568 à 1440 × 900 :
      la page ne défile jamais et la composition ne bouge pas
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
      ([donnees.md](../docs/donnees.md#ce-que-le-papier-peut-porter))
- [x] D3 · le lien — le lien ne s'affiche pas, deux actions à la place : envoyer (partage
      natif) et copier. Le dépôt est noté avant le partage
- [x] mon historique des plis déposés — `pli.v1.deposes`, dédoublonné sur le payload, jamais
      sur le numéro. L'**écran** qui le relit n'existe pas encore : la roadmap ne le
      demandait pas, et rien ne le décrit dans `parcours.md`
- [ ] **à la main, chez moi** : fabriquer l'empreinte du seuil avec `/seuil` et la recopier
      dans la constante `EMPREINTE` de `src/atelier/seuil.ts`. Tant qu'elle est vide, **rien
      ne passe la porte** — un seuil sans empreinte serait une porte ouverte, une empreinte
      inventée une porte qu'aucune date n'ouvre
- [ ] **le compteur de signes du LIEN attend la mesure 1.** D3 affiche le nombre de signes
      du lien fini, sans le juger : le plafond se mesure WhatsApp → iOS → Safari, il ne
      s'estime pas. Ce qui est tenu aujourd'hui, ce sont les plafonds du **papier**, qui sont
      mesurés, eux
- [ ] **à la main, sur les deux téléphones** : composer un pli de chaque type et l'ouvrir
      chez elle — c'est le seul endroit où l'on verra le partage natif et le presse-papier

**Fin du jalon :** je compose et j'envoie depuis mon téléphone, sans passer par le code.
Vraie dès que l'empreinte du seuil est posée.

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
étape du jalon 2. Le chunk commun est **à moitié résolu** : côté lecteur, un chunk de la
vague 3 qui partagerait quoi que ce soit avec le module d'ouverture fait maintenant échouer
le build, et `reponse.ts` recopie les deux fonctions plutôt que de les importer d'`a2.ts`.
Reste l'autre moitié : le jour où l'atelier importera `codec.ts` (jalon 4), il faudra
trancher — deux builds séparés, ou l'inlining du graphe entier.

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

**Au jalon 4, pour l'atelier** — ~~`index.html` embarque `#fleche-droite` sans s'en servir~~
**toujours vrai** : l'atelier a maintenant sa propre copie du trace, et celle du lecteur ne
sert toujours a rien. 219 octets gzip dans le document qui part chez elle, a reprendre le
jour ou le budget serre. Le fragment reste monolithique pour n'avoir qu'une
chose à recopier et une seule à comparer ; à rouvrir si les 219 octets gzip gênent.

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
