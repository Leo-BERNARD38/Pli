# Chantier — où en est la construction

Ce fichier est **l'état**, pas le plan. Le plan est [docs/roadmap.md](../docs/roadmap.md) et
il ne bouge pas ; ce fichier dit ce qui a réellement atterri, et il se met à jour à chaque
étape terminée. C'est ce qu'une nouvelle session lit en premier pour savoir où reprendre.

Une étape n'est cochée que lorsqu'elle est **écrite, relue et commitée**.

## Jalon courant

**Jalon 2 — le pli et le geste.** Le code est écrit, relu et commité en trois lots. Ce qui
reste tient en une séance sur les deux téléphones, et personne ne peut la faire à ma place.

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
- [x] **à la main, chez moi** : Pages activé, source « GitHub Actions » — c'est bien celle
      que `deploiement.yml` demande, `actions/deploy-pages` ne sait pas déployer autrement
- [ ] **à la main, chez moi** : le **domaine personnalisé** `pli.re` renseigné dans les
      réglages du dépôt, ses enregistrements DNS, puis « Enforce HTTPS » et le `curl` de
      vérification ([docs/hebergement.md](../docs/hebergement.md#avant-le-premier-déploiement)).
      **Tant qu'il manque, le site est servi sur `leo-bernard38.github.io/Pli/` et il y est
      cassé** : `base: '/'` et toutes les adresses du produit (`/icones/`, `/plis/`, les
      empreintes de Vite) partent de la racine du domaine. Le sous-chemin de dépôt n'est pas
      une cible — `hebergement.md` l'écrit, et le domaine est déjà dans les liens à venir.
      Le domaine posé, `leo-bernard38.github.io/Pli/` redirige tout seul vers `pli.re`
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

- **Le `CNAME` du build suffit-il quand la source de Pages est « GitHub Actions » ?**
  `hebergement.md` décrit le domaine « par un `CNAME` à la racine du build », ce qui était
  vrai de la publication par branche. La documentation de GitHub n'est pas joignable depuis
  cette machine : **poser le domaine dans les réglages du dépôt** est sûr dans les deux cas, et
  le fichier `CNAME` reste où il est. À vérifier au premier déploiement.

- **L'alphabet du jeton d'un poème.** Le routeur n'accepte que `numéro-jeton` en minuscules et
  chiffres. [docs/donnees.md](../docs/donnees.md#la-moulinette) dit « quatre signes » et rien
  de plus. Être plus large que la moulinette est sans danger, l'inverse casserait un lien déjà
  parti : **l'alphabet se décide dans le routeur et la moulinette ensemble**, au jalon 6.
- **Les versions des actions GitHub** n'ont pas pu être vérifiées depuis cette machine (l'API
  de GitHub n'y est pas ouverte). Si un workflow tombe sur une action dépréciée, monter la
  version majeure — le contenu des deux fichiers, lui, ne bouge pas.
