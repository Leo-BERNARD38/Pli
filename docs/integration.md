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
- **`.invite`** + `@keyframes nudge` — le seul mouvement décoratif du produit.

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
| Les flèches | caractères `↑` `→` en Bodoni | **deux tracés SVG inline** — l'unique exception au « pas de SVG » |
| Bodoni sur A1 | présent, par la flèche de la pliure | **absent** — trois familles au premier écran, sans arrangement |
| L'aperçu du lien | un recadrage du papier froissé | **`og.png`**, dessiné : marque, phrase, pliure — 53 ko ([partage.md](partage.md#limage-daperçu)) |
| `og:description` | « Une seule lecture, pas de compte. » | **« Il ne s'ouvre qu'une fois. »** — la première promesse n'est pas tenable |
| Le bas de `og.png` | « UNE SEULE LECTURE · PAS DE COMPTE » | **« POUR TOI SEULE »** — à réexporter |
| `icon-512` en `maskable` | annoncé masquable | **`purpose: any`** tant qu'une variante à 66 % n'existe pas — mesuré à 70 % de large, 10 % de marge à droite |
| `twitter:card` | présent dans `tete.html` | **retiré** — un pli ne se partage pas ailleurs qu'en conversation |
| Écran C2 | atteint par le lien | atteint **depuis le journal** |

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

### Écrans qui n'existaient pas

**D0 · le seuil** (l'atelier n'était pas protégé), **D2p · quel poème**,
**l'invitation à installer** — et l'inventaire complet de ce qui reste à dessiner est
en fin de [parcours.md](parcours.md#3-ce-qui-nest-pas-encore-maquetté).

## Accessibilité — la liste à cocher

Rien de tout cela n'est dans les prototypes. `PLI.md` §10 l'admet lui-même.

- [ ] Un `<button>` « déplier » atteignable au clavier, qui pose `p = 1` directement.
- [ ] `@media (prefers-reduced-motion: reduce)` : pas d'invite du volet, ouverture à 120 ms.
- [ ] Focus visible partout — `.champ input { all: unset }` le supprime aujourd'hui.
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
8. Aucune icône, aucun SVG : les flèches sont des caractères Bodoni.
