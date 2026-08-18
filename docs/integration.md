# Intégration — de la maquette au code

Ce document est la passerelle. Il dit **ce qui fait foi**, **ce qui a changé** depuis le
projet design, et **ce qu'il ne faut pas recopier** des prototypes.

À lire avant d'écrire la première ligne d'un écran.

## Ce qui fait foi

| Question | Réponse |
|---|---|
| Les valeurs de la DA | [`design/handoff/pli.css`](../design/handoff/pli.css) |
| Le geste et ses réglages | `pli.css` + [`lecteur.html`](../design/handoff/lecteur.html) |
| Ce qu'on construit | `docs/` — **il gagne toujours** contre `design/` |
| Le lexique | [design-system.md](design-system.md#ton-et-vocabulaire) |
| Les parcours et les états | [parcours.md](parcours.md) |

`design/` est une archive figée. On ne l'édite pas : quand il se trompe, on corrige `docs/`
et on note l'écart ici.

## Reprendre `pli.css`

Le fichier se scinde en deux à la reprise :

- **`src/styles/tokens.css`** — le bloc `:root`, tel quel, avec les corrections ci-dessous.
- **`src/styles/pli.css`** — les sections 1 à 7, tel quel.

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
| E1 | `pli.re/deposer` dans le chrome | `pli.re/atelier/` |
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
| `.pli` | le pli et son papier | **le cadre** : 360 × 780, l'ombre, le coin, `touch-action`. Le papier passe aux deux couches, `.pli__dessus` et `.pli__dessous` — les mots de l'algorithme du dépliage |
| `.pli:has(.volet) .corps` | — | **`.corps:has(~ .volet)`** — la règle regarde le frère, sinon le volet d'A1 réserve sa place dans le corps d'A2, qui n'en a pas |
| `.tete` | statique | **`position: relative`** — une image pleine page est une couche de fond positionnée, un élément statique passerait dessous |
| Un pli plus haut que l'écran | non traité | **il se met à l'échelle** — `--echelle`, écrite sur le plateau, `transform: scale()` sur le pli. La composition ne bouge jamais |
| `.image--pleine` | absente | **une couche de fond** (`inset: 0`), le texte par-dessus — et elle **s'arrête à la pliure** quand un volet couvre le bas |
| Le voile d'une image pleine page | non spécifié | **`.image--pleine .image__fondu--encre`**, ses propres arrêts : `.68` mesuré, `.85` et `66 %` repris de `.image__fondu--encre`. Celui d'un bandeau retombe à `.38` au tiers, pile sous la tête et le numéro |
| `.etiquette--fine` sur carmin | `.62` partout | **opacité pleine sur carmin** — crème sur carmin vaut déjà 5,1:1, le `.62` le ramenait à 2,7:1 |
| La tête et le numéro d'A1 | en carmin | **en crème** — sur A1 la seule chose qui agit est le volet, et mesuré, le rose laissait 19,7 % de la ligne du numéro sous 4,5:1 |
| Le titre de C4 | — | **`line-height: .92`** — deux lignes de capitales accentuées, le cas que `.titre--geant` nomme |
| `theme-color` | `#C81E33` dans installation.md, `#E9E2D2` dans appareils.md | **`#E9E2D2`**, le sable, dans les deux entrées ; le carmin reste le `theme_color` du manifeste |

### Les cinq questions laissées ouvertes par le design

`PLI.md` §11 s'arrête sur cinq points non tranchés. Quatre le sont désormais.

| Question du design | Tranchée |
|---|---|
| Modifier un pli après dépôt ? | **Non tranchée** — voir ci-dessous |
| Le relais en A4 : jusqu'où ? | **Il n'existe pas.** À deux, elle n'a pas d'atelier ; A4 mène à ses plis |
| Le poème : défiler ou paginer ? | **Paginer**, au même geste que le dépliage — une strophe, un écran |
| Les faits : texte libre ou sélecteur ? | **Texte libre.** Un sélecteur ajouterait un contrôle là où il n'y a qu'une ligne |
| Les images reviennent-elles ? | **Oui, comme conséquence du type** — jamais un emplacement à remplir |

**Ce qui reste ouvert : modifier un pli après dépôt.** La question a perdu son sens tel
qu'elle était posée — sans serveur, un pli déposé n'existe nulle part à modifier, et le
lien est déjà parti. Corriger un pli, c'est en fabriquer un autre. La seule variante qui
tient encore est le poème, dont le fichier se réencode sans changer de lien : la moulinette
le permet déjà, délibérément (voir [donnees.md](donnees.md#la-moulinette)). Rien à décider
avant qu'un poème ait besoin d'une correction.

### Ce qui a été tranché avec A1, au jalon 2

Cinq questions que cette section laissait ouvertes sont tranchées. Elles sont reportées dans
le tableau ci-dessus ; voici ce qui les a tranchées. **Une seule est tranchée sans être
faite** — le plafond du gabarit : l'approche est décidée, la mesure et la garde restent à
écrire, et [donnees.md](donnees.md) dit toujours que le plafond « se fixe par la mesure ».

**Le fond d'A1, c'est le rideau.** `parcours.md` et `design-system.md` le disent tous les
deux, seule la maquette montre un papier crème — et `docs/` gagne toujours contre `design/`.
Le choix emporte le fondu, comme annoncé : A1 compose donc **en crème et en rose sur une
image sombre**, non en encre et carmin sur du papier.

**Le débordement du gabarit** se traite des deux côtés : un plafond par clé, **mesuré** à
360 × 780 et écrit dans [donnees.md](donnees.md) avec sa date, plus une garde dans le gabarit
pour que le lecteur ne recouvre jamais la marque en silence. **Ni l'un ni l'autre n'existe
encore** : `.pli { overflow: hidden }` coupe toujours sans un mot. C'est la seule décision de
cette liste qui laisse du travail derrière elle.

**Un pli de 780px sur un écran plus court** : il se met à l'échelle. Mesuré de 320 × 568 à
1440 × 900, la page ne défile plus jamais et la composition ne bouge pas d'un pixel.

**L'empilement de `.image--pleine`** : c'est une couche de fond, le texte se compose
par-dessus, le fondu entre les deux.

**La composition des faits** est uniforme — une ligne par fait, le premier en carmin. La
hiérarchie de la maquette (trois compositions distinctes, index par index) ne se devine pas
dans une chaîne de texte libre, et une invitation à un seul fait tomberait sur une
composition qui n'a pas été dessinée pour elle.

### Écrans qui n'existaient pas

**D0 · le seuil** (l'atelier n'était pas protégé), **D2p · quel poème**,
**l'invitation à installer** — et l'inventaire complet de ce qui reste à dessiner est
en fin de [parcours.md](parcours.md#3-ce-qui-nest-pas-encore-maquetté).

## Accessibilité — la liste à cocher

Rien de tout cela n'est dans les prototypes. `PLI.md` §10 l'admet lui-même.

- [ ] Un `<button>` « déplier » atteignable au clavier, qui pose `p = 1` directement.
- [ ] `@media (prefers-reduced-motion: reduce)` : pas d'invite du volet, ouverture à 120 ms.
- [ ] Focus visible partout — `.ligne input { all: unset }` le supprime aujourd'hui.
      Un filet carmin de 2px à gauche sur `:focus-visible`.
- [ ] Le texte reste sélectionnable et présent si une animation échoue.
- [ ] `.etiquette--fine` à `.62`.

**Contrastes connus et acceptés** — ces deux-là ne vivent que dans l'atelier, chez moi :

| Classe | Contraste | Texte porté |
|---|---|---|
| `.conduite__pas` (`.45`, 10,5px) | 3,0:1 | « 2 sur 3 » |
| `.reste` (`.4`, 9,5px) | 2,7:1 | « 22 signes » |

## La revue d'un écran

Avant de considérer un écran fini :

1. **Les cinq règles** de [design-system.md](design-system.md#les-cinq-règles) tiennent-elles ?
2. Le contenu s'aligne-t-il **en bas** ? On ne centre jamais verticalement.
3. Une seule marge, **26px**. Aucun autre retrait horizontal.
4. **Un seul titre**, **une seule griffe**, **une seule action** par pli.
5. Le texte tient-il **aux deux extrêmes** — quatre mots et le maximum autorisé ?
6. Les étiquettes sont-elles **en minuscules dans le code** ?
7. Le lexique est-il respecté — aucun « valider », « champ », « erreur », « créer » ?
8. Aucune icône, aucun SVG — **sauf les deux flèches**, devenues des tracés inline pour
   retirer Bodoni du premier écran ([ressources.md](ressources.md#les-deux-flèches)). Le
   dessin ne change pas, le moyen change. C'est l'unique exception, et elle est fermée.
