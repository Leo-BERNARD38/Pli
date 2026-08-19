# Intégration — de la maquette au code

Ce document est la passerelle. Il dit **ce qui fait foi**, **ce qui a changé** depuis le
projet design, et **ce qu'il ne faut pas recopier** des prototypes.

À lire avant d'écrire la première ligne d'un écran.

## Ce qui fait foi

| Question | Réponse |
|---|---|
| Les valeurs de la DA | [`design/handoff/pli.css`](../design/handoff/pli.css) |
| Ce que le design dessinait | [`design/canevas/`](../design/canevas/README.md) — la source dont `handoff/` est l'export |
| Le geste et ses réglages | `pli.css` + [`lecteur.html`](../design/handoff/lecteur.html) |
| Ce qu'on construit | `docs/` — **il gagne toujours** contre `design/` |
| Le lexique | [design-system.md](design-system.md#ton-et-vocabulaire) |
| Les parcours et les états | [parcours.md](parcours.md) |

`design/` est une archive figée. On ne l'édite pas : quand il se trompe, on corrige `docs/`
et on note l'écart ici.

## Reprendre `pli.css`

Le fichier se scinde en deux à la reprise :

- **`src/styles/tokens.css`** — le bloc `:root`, tel quel, avec les corrections ci-dessous.
- **`src/styles/pli.css`** — les sections 1 à 6, tel quel. La 7 reste dehors, voir juste
  en dessous ; la 6, « le dépôt », a depuis migré dans `src/styles/depot.css` — elle
  n'appartient qu'à l'atelier et pesait 900 octets gzip dans le document qui part chez elle.

Deux choses à retirer au passage :

- **L'`@import` Google Fonts.** Les polices se chargent en local et sous-ensemblées
  (voir [design-system.md](design-system.md#ce-que-ça-impose-au-chargement)).
- **La section 7, « le plateau ».** Elle n'existe que pour les planches de documentation.
  Seul E1 en garde `--sable-2`.

### Corrections à appliquer

| Élément | Dans `pli.css` | À écrire | Pourquoi |
|---|---|---|---|
| `--sortie` | `--sortie` | **`--courbe`** | Le jeton nomme une courbe, pas une sortie |
| `.etiquette--fine` | `opacity: .5` | **`.62`** | 3,5:1 → 5,1:1 ; elle porte « déposé par a. » |
| `.pli--plein` | une classe de papier | **supprimée** | C'est `.pli--encre` + `.image--pleine` |
| `.image--pleine` | absente | **à ajouter** | Le pendant de `.image--haute` |

### Classes à faire remonter des prototypes

Elles sont normatives mais vivent dans les `<style>` de `lecteur.html` :

- **`.oui`** — la liste des trois mots d'A3.
- **`.invite`** + ses images clés — le seul mouvement décoratif du produit. Le design les
  appelait `nudge` ; le dépôt est en français, et la doc dit déjà « l'invite du volet ».

### Classes à ne pas emporter

- **`.rembobine`** — bouton de démonstration, il n'existe pas dans le produit.
- **`.scene`, `.couche`, `.cartouche`, `.mesure`, `.pas`, `.cadre`, `.fenetre`, `.chrome`** —
  échafaudage des planches.

### Le piège à éviter

`createur.html` et `createur-bureau.html` **recopient une partie de la section 6** de
`pli.css` dans leur propre `<style>`, avec de légères divergences : `.type` sans
`all: unset`, `.type__glose` en `margin-top` au lieu de `display: block`, des tailles de
police décalées d'un point.

Ne pas reprendre les copies. `pli.css` fait foi ; les prototypes n'étaient que des vitrines.

## Ce qui a changé depuis le design

Le design décrivait un produit avec serveur, usage unique garanti, expiration et réponse
remontante. Le produit construit est sans serveur, à deux, et les plis rejoignent un journal.
Voici tout ce qui s'en déduit.

### Corrections de contenu dans les maquettes

| Où | La maquette dit | À écrire |
|---|---|---|
| A1 | « Il ne se lira qu'une fois. » | « Il ne s'ouvre qu'une fois. Ensuite il reste dans tes plis. » |
| A3 | « Elle le saura tout de suite, sans notification et sans compte. » | À réécrire : rien ne remonte automatiquement |
| A4 | « C'est parti chez a. Le pli se referme derrière toi. » | Faux — on affiche le mot, on n'affirme rien |
| A4 | « écrire à ton tour ↑ » | « tes plis ↑ » — elle n'a pas d'atelier |
| D3 | `pli.re/015-vhtq` affiché en clair | Le lien ne s'affiche pas : **envoyer** et **copier le lien** |
| E1 | « lien valable 30 jours » | Supprimé — il n'y a plus d'expiration |
| E1 | `pli.re/deposer` dans le chrome | `leo-bernard38.github.io/Pli/atelier/` |
| C4 | « lien mort · expiré » | « lien abîmé » — le cas réel est le lien tronqué par la messagerie |

### Structure

| Sujet | Design | Produit |
|---|---|---|
| Réponse | A3 → serveur | A3 → **WhatsApp pré-rempli** |
| Qui répond | tous les types | **l'invitation seulement** |
| Usage unique | garanti par le serveur | **convention locale**, sur son navigateur |
| Expiration | 30 jours | **aucune** |
| Historique C1 | côté créateur | **deux écrans distincts** : son journal, mon historique |
| Papier du souvenir | crème (§3) *et* image pleine (§7) | **crème + image pleine**, la contradiction est tranchée |
| Images | une seule, partagée | **cinq peintures** : une par type sauf le poème, deux au produit |
| Le poème | déposé dans D2 | **fichier écrit à la main**, D2p ne fait que choisir |
| `titre--geant` | `lh .86` dans PLI.md | **`.92`**, la CSS fait foi |
| Papiers | « trois, plus un » / « jamais un quatrième » / quatre classes | **trois papiers + un traitement** |
| Le lieu du dépôt | « studio » / « déposer » | **l'atelier** |
| Chargement C5 | tous les plis | **le poème uniquement** |
| Définition des textures | 720 × 1560, ~70 ko | **la définition native de la source** (1536 × 2752, ou 1296 × 2304 pour le drapé), servie telle quelle — [ressources.md](ressources.md) |
| Les flèches | caractères `↑` `→` en Bodoni | **deux tracés SVG inline** — l'unique exception au « pas de SVG ». Bodoni Moda n'a en fait ni l'un ni l'autre : le `↑` des maquettes venait de la police de secours du système, et les deux flèches sont dessinées ([ressources.md](ressources.md#les-deux-flèches)) |
| Bodoni sur A1 | présent, par la flèche de la pliure | **absent** — trois familles au premier écran, sans arrangement |
| L'aperçu du lien | un recadrage du papier froissé | **`og.png`**, dessiné : marque, phrase, pliure — 53 ko ([partage.md](partage.md#limage-daperçu)) |
| `og:description` | « Une seule lecture, pas de compte. » | **« Il ne s'ouvre qu'une fois. »** — la première promesse n'est pas tenable |
| Le bas de `og.png` | « UNE SEULE LECTURE · PAS DE COMPTE » | **« POUR TOI SEULE »** — corrigé |
| `icon-512` en `maskable` | annoncé masquable | **`purpose: any`** ; le masquable est un fichier à part, lettre à 52 % de large |
| La lettre sur la grille | `x = 30` dans le texte et les SVG, 29 dans les PNG | **29**, celui des tirages validés — SVG et PNG s'accordent |
| `.champ` | la classe des lignes de dépôt | **`.ligne`** — « champ » est sur la liste fermée du lexique, qui fait foi ; `.champ__nom` et `.champ--titre` suivent |
| Le cachet | « nº 014 » dans `donnees.md`, `014` dans la maquette | **`014`** — six signes ne tiennent pas dans 38px à 10px. `donnees.md` est corrigé ; « nº 014 » reste la forme de la prose |
| `--pliure` | `34%`, seul | **`--pliure-part: 0.34`** en plus, sans unité — un padding en pourcentage se compte sur la largeur, et le corps doit s'arrêter au-dessus du volet. Le nombre ne vit qu'à un endroit |
| `--corps-pied` | le `30px` du pied de `.corps`, écrit deux fois | **un jeton** — même raison |
| `twitter:card` | présent dans les balises livrées | **retiré** — un pli ne se partage pas ailleurs qu'en conversation |
| `mask-icon` | présent, avec un SVG à fond crème | **retiré** — l'onglet épinglé est une affaire de Safari de bureau |
| Écran C2 | atteint par le lien | atteint **depuis le journal** |
| `.pli` | le pli et son papier | **le cadre** : l'écran visible entier, `touch-action`. Ni ombre ni coin — il n'y a plus de plateau sur lequel se poser. Le papier passe aux deux couches, `.pli__dessus` et `.pli__dessous` — les mots de l'algorithme du dépliage |
| `.pli:has(.volet) .corps` | — | **`.corps:has(~ .volet)`** — la règle regarde le frère, sinon le volet d'A1 réserve sa place dans le corps d'A2, qui n'en a pas |
| `.tete` | statique | **`position: relative`** — une image pleine page est une couche de fond positionnée, un élément statique passerait dessous |
| Un pli plus haut que l'écran | non traité | **il n'y en a plus** : le cadre est l'écran. Un pli trop long est coupé par `.corps { overflow: hidden }`, et c'est le plafond du dépôt qui l'en empêche (19/08/2026 — remplace la mise à l'échelle du 18/08) |
| `.image--pleine` | absente | **une couche de fond** (`inset: 0`), le texte par-dessus — et elle **s'arrête à la pliure** quand un volet couvre le bas |
| Le voile d'une image pleine page | non spécifié | **`.image--pleine .image__fondu--encre`**, ses propres arrêts : `.68` mesuré, `.85` et `66 %` repris de `.image__fondu--encre`. Celui d'un bandeau retombe à `.38` au tiers, pile sous la tête et le numéro |
| `.etiquette--fine` sur carmin | `.62` partout | **opacité pleine sur carmin** — crème sur carmin vaut déjà 5,1:1, le `.62` le ramenait à 2,7:1 |
| La tête et le numéro d'A1 | en carmin | **en encre** — sur A1 la seule chose qui agit est le volet (règle nº 2). Ils ont été en crème tant qu'A1 portait le rideau ; le papier crème leur rend l'encre, et la raison, elle, n'a pas changé |
| Le fond d'A1 | papier crème | **papier crème** — `docs/` avait imposé le rideau, la mesure l'a repris (19/08/2026, voir plus bas) |
| Le titre de C4 | — | **`line-height: .92`** — deux lignes de capitales accentuées, le cas que `.titre--geant` nomme |
| `theme-color` | `#C81E33` dans installation.md, `#E9E2D2` dans appareils.md | **`#E9E2D2`**, le sable, dans les deux entrées ; le carmin reste le `theme_color` du manifeste |

### Les cinq questions laissées ouvertes par le design

`PLI.md` §11 s'arrête sur cinq points non tranchés. Quatre le sont désormais.

| Question du design | Tranchée |
|---|---|
| Modifier un pli après dépôt ? | **Non tranchée** — voir ci-dessous |
| Le relais en A4 : jusqu'où ? | **Il n'existe pas.** À deux, elle n'a pas d'atelier ; A4 mène à ses plis |
| Le poème : défiler ou paginer ? | **Défiler** (19/08/2026, renverse la réponse d'origine). Un poème est un texte, il se lit d'un bout à l'autre ; la pagination n'a jamais été construite. C'est l'exception nommée à la règle 1 ([design-system.md](design-system.md#les-cinq-règles)) |
| Les faits : texte libre ou sélecteur ? | **Texte libre.** Un sélecteur ajouterait un contrôle là où il n'y a qu'une ligne |
| Les images reviennent-elles ? | **Oui, comme conséquence du type** — jamais un emplacement à remplir |

**Ce qui reste ouvert : modifier un pli après dépôt.** La question a perdu son sens tel
qu'elle était posée — sans serveur, un pli déposé n'existe nulle part à modifier, et le
lien est déjà parti. Corriger un pli, c'est en fabriquer un autre. La seule variante qui
tient encore est le poème, dont le fichier se réencode sans changer de lien : la moulinette
le permet déjà, délibérément (voir [donnees.md](donnees.md#la-moulinette)). Rien à décider
avant qu'un poème ait besoin d'une correction.

### Ce qui a été tranché avec A1, au jalon 2

Cinq questions que cette section laissait ouvertes sont tranchées, et faites. Elles sont
reportées dans le tableau ci-dessus ; voici ce qui les a tranchées.

~~**Le fond d'A1, c'est le rideau.**~~ **Renversé le 19/08/2026, et la maquette avait
raison.** `docs/` avait tranché contre elle pour le rideau ; la mesure a donné tort à
`docs/`. A1 est l'écran qui doit se peindre avant tout le reste, et il traînait 614 ko
préchargés **dans la même seconde que les trois polices que le texte attend vraiment** —
`font-display: block` ne peint rien avant elles. Le papier crème ne coûte pas une requête.

A1 compose donc **en encre sur du papier**, comme la maquette : la tête et le numéro
gardent l'encre plutôt que le carmin de la maquette — sur A1 la seule chose qui agit est le
volet —, et le fil d'ombre du volet, que `pli.css` portait sans que rien ne l'écrive, est
enfin posé. Le rideau reste dans `src/textures/`, hors du build.

**Le débordement du gabarit** se traite des deux côtés, et les deux sont écrits. Un plafond
**par type**, mesuré à 360 × 780 et daté, dans
[donnees.md](donnees.md#ce-que-le-papier-peut-porter--mesuré-pas-estimé) — c'est le dépôt qui
s'y tiendra, au jalon 4. Et une garde dans le gabarit : `.corps { overflow: hidden }`, pour
qu'un lien fabriqué à la main ne recouvre jamais la marque.

La mesure a sorti un résultat que personne n'attendait : **l'invitation ne tient pas les
maximums que `donnees.md` documentait**. Elle porte trois de ses quatre éléments — titre à
22 signes, voix, trois faits, griffe — jamais les quatre. Le titre est le levier : à 64px,
22 signes font une troisième ligne de capitales et coûtent 92px d'un coup. Son plafond
descend donc à **16**.

~~**Un pli de 780px sur un écran plus court** : il se met à l'échelle.~~ **Renversé le
19/08/2026** : le cadre remplit l'écran, il n'y a plus de pli de 780px. Ce que la mise à
l'échelle réglait — la page qui défile — reste réglé, mesuré de 360 × 780 à 1440 × 900.
Ce qu'elle cachait apparaît : sur une hauteur visible plus courte que 780, la composition
n'a plus la place que les plafonds du papier lui supposaient
([.claude/decisions.md](../.claude/decisions.md)).

**L'empilement de `.image--pleine`** : c'est une couche de fond, le texte se compose
par-dessus, le fondu entre les deux.

**La composition des faits** est uniforme — une ligne par fait, le premier en carmin. La
hiérarchie de la maquette (trois compositions distinctes, index par index) ne se devine pas
dans une chaîne de texte libre, et une invitation à un seul fait tomberait sur une
composition qui n'a pas été dessinée pour elle.

### Les maquettes que le handoff n'avait pas transportées

**Relevé le 19/08/2026.** `design/handoff/` ne porte que trois pages — `index`, `lecteur`,
`createur`. Le projet design en compte six canevas, et ceux-là dessinent des écrans que
[parcours.md](parcours.md#3-ce-qui-nest-pas-encore-maquetté) listait comme jamais dessinés :
**C2 à C5**, **B0a-c**, **B2 · B3**, et l'atelier de D1 à son écran de lien. Les écrans
concernés ont donc été codés sans leur maquette, d'après `docs/` seul.

Les canevas sont entrés dans le dépôt le 19/08/2026, sous
[`design/canevas/`](../design/canevas/README.md). L'archive **peut s'agrandir, jamais
changer** : la garde, assouplie ce jour-là, accepte un fichier qui n'y était pas et refuse
toujours qu'un fichier déjà archivé soit modifié, supprimé ou renommé. Le `handoff/` du
projet design est identique **bit pour bit** à `design/handoff/` : rien à reprendre de ce
côté, l'archive du dépôt était à jour.

**La maquette disait déjà que le poème défile — c'est `docs/` qui avait inventé la
pagination.** Trouvé le 19/08/2026, en allant y chercher C5 : l'annotation du canevas
**Pli — Maquettes** écrit, sur les nouveaux types, « **Le poème (B2–B3) passe au fond encre.
C'est le seul type qui défile**, donc le seul qui garde un repère de progression en haut ».
Six documents de `docs/` décrivaient pourtant une pagination strophe par strophe et « la
suite ↑ », que rien dans `design/` ne demande. C'est l'inverse du cas habituel : ici ce n'est
pas l'archive qui se trompe, c'est la spécification qui s'était éloignée d'elle sans le
noter. Corrigé le même jour, dans les deux sens — le produit défile, et `docs/` le dit.

**Un repère de progression n'a pas été repris.** La même annotation en demande un, « en
haut ». Le produit n'en a pas : ce serait un élément de plus sur le seul écran qui n'a rien
d'autre que le texte, et la barre du navigateur en donne déjà un. À rouvrir si la lecture
d'un long poème se perd, sur les deux téléphones.

Ce que les canevas ajoutent, écran par écran :

| Écran | Ce que la maquette montre | Ce que le produit en retient |
|---|---|---|
| **B0a-c** | une promesse **par type** — « Deux lignes t'attendent », « Quatre strophes t'attendent » | **suivi** (19/08/2026), débarrassé de ce que ces phrases comptaient : aucune promesse ne chiffre |
| **C2** | un écran de synthèse : « Tu as dit oui », la griffe, « relire le pli », « tes plis ↑ » | le produit réaffiche le pli entier et rappelle le mot — deux formes différentes |
| **C3** | « Ce pli s'est refermé », Bodoni **400** sur encre, « tes plis » | le fond encre et le chemin vers le journal sont tenus |
| **C4** | « Il n'y a rien ici », Bodoni 400, et une action « voir tes plis ↑ » | le produit dit « lien abîmé » et n'a que la marque comme chemin |
| **C5** | la marque seule en 64px, un filet pointillé carmin, « un pli arrive » | **suivi**, et l'écran est écrit (19/08/2026). Deux écarts, plus bas |
| **l'atelier** | un choix de **style** (crème · encre · carmin · drapé), une image, une date | **écarté** : « le papier découle du type, jamais un choix offert au dépôt » (règle nº 4) |
| **D4 de la maquette** | un aperçu **plein écran** — « tu vois ce qu'elle verra » | le produit n'a que l'aperçu en petit de D2 ; aucune décision prise |

Deux numéros ne se correspondent pas : le **D5 de la maquette** est l'écran du lien prêt,
c'est-à-dire notre **D3** ; et le D4 de la maquette est un aperçu, pas le tiroir.

**Les deux écarts de C5** (19/08/2026, l'écran est écrit) :

- **Il centre verticalement**, ce qu'aucun autre écran du produit ne fait et que la liste à
  cocher plus bas interdit. C'est la maquette qui le compose ainsi, et elle a raison ici :
  C5 n'a pas de contenu, il n'a rien à aligner en bas. L'exception s'arrête à cet écran.
- **« Deux secondes maximum, sinon C4 » n'est pas repris.** La maquette l'annote ; le
  produit ne le fait pas, et c'est délibéré. Un réseau lent n'est pas un lien abîmé — c'est
  exactement la confusion que « hors ligne ≠ introuvable » vient de défaire
  ([parcours.md](parcours.md#les-états)). C5 attend aussi longtemps que le réseau met, et
  ne rend la main qu'au fichier ou au refus.

**La promesse d'A1 suit le type — tranché le 19/08/2026.** [parcours.md](parcours.md#a1--lattente)
écrivait « seule la promesse change » puis n'en donnait qu'une, et le gabarit l'écrivait en
dur pour les quatre. Les maquettes ont tranché avec la doc : chaque type a sa promesse, les
quatre sont dans `parcours.md`. Le coût était réel et il a été payé sans rien perdre : celle
de l'invitation reste **en dur dans le document**, donc le premier texte se peint toujours
sans attendre le décodage, et les trois autres la remplacent dans la même frame que le
numéro et la signature. **Aucune ne chiffre quoi que ce soit** — une maquette sait qu'il y a
quatre strophes, un gabarit ne le sait pas.

### Écrans qui n'existaient pas

**D0 · le seuil** (l'atelier n'était pas protégé), **D2p · quel poème**,
**l'invitation à installer** — et l'inventaire complet de ce qui reste à dessiner est
en fin de [parcours.md](parcours.md#3-ce-qui-nest-pas-encore-maquetté).

## Accessibilité — la liste à cocher

Rien de tout cela n'est dans les prototypes. `PLI.md` §10 l'admet lui-même.

- [x] Un `<button>` « déplier » atteignable au clavier, qui pose `p = 1` directement —
      `.deplier` dans le gabarit, `armer()` le branche (jalon 2).
- [x] `@media (prefers-reduced-motion: reduce)` : pas d'invite du volet, ouverture à
      120 ms — le bloc est dans `pli.css`, la durée dans `geste.ts` parce qu'elle se calcule.
- [x] Focus visible partout — `all: unset` le supprimait. Filet carmin de 2px à gauche sur
      `:focus-visible` : `.type`, `.depose` et `.passage` depuis le jalon 4, les deux lignes
      de saisie et `.conduite__retour` le 19/08/2026. Un conteneur pris de focus pour
      *déplacer* le focus n'en porte pas — `.ecran` est exclu, sinon le filet courait sur
      toute la hauteur de l'écran.
- [x] Le texte reste sélectionnable et présent si une animation échoue — `.corps` rend
      `user-select` au texte, que le cadre coupe pour le geste.
- [x] `.etiquette--fine` à `.62`.

Rien n'y reste ouvert. Ce qui s'y ajoute à l'avenir se coche ici, et un écran qui part en
production sans une de ces lignes est à refaire.

**Contrastes connus et acceptés** — ces deux-là ne vivent que dans l'atelier, chez moi :

| Classe | Contraste | Texte porté |
|---|---|---|
| `.conduite__pas` (`.45`, 10,5px) | 3,0:1 | « 2 sur 3 » |
| `.reste` (`.4`, 9,5px) | 2,7:1 | « 22 signes » |

## La revue d'un écran

Avant de considérer un écran fini :

1. **Les cinq règles** de [design-system.md](design-system.md#les-cinq-règles) tiennent-elles ?
2. Le contenu s'aligne-t-il **en bas** ? On ne centre jamais verticalement. **Trois
   exceptions, et elles seules** : un corps **réparti** (le souvenir) ; le **poème**, aligné
   en haut parce qu'il défile — sous `flex-end`, ce qui dépasse sort par le haut et ne se
   rattrape pas au défilement ; et **C5**, l'attente, le seul écran du produit qui centre —
   il n'a pas de contenu, donc rien à aligner en bas. Un quatrième écran qui centrerait est
   à refaire, pas à discuter.
3. Une seule marge, **26px**. Aucun autre retrait horizontal.
4. **Un seul titre**, **une seule griffe**, **une seule action** par pli.
5. Le texte tient-il **aux deux extrêmes** — quatre mots et le maximum autorisé ?
6. Les étiquettes sont-elles **en minuscules dans le code** ?
7. Le lexique est-il respecté — aucun « valider », « champ », « erreur », « créer » ?
8. Aucune icône, aucun SVG — **sauf les deux flèches**, devenues des tracés inline pour
   retirer Bodoni du premier écran ([ressources.md](ressources.md#les-deux-flèches)). Le
   dessin ne change pas, le moyen change. C'est l'unique exception, et elle est fermée.
