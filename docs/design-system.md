# Système de design

La source des valeurs est [`design/handoff/pli.css`](../design/handoff/pli.css). Ce
document reprend le système, applique les corrections décidées, et dit ce qui s'écarte
du fichier d'origine — chaque écart est repris et justifié dans
[integration.md](integration.md).

## Les cinq règles

Elles servent de critères de revue. Un écran qui en casse une est à refaire, pas à discuter.

1. **Un pli = un écran.** Jamais de défilement dans un pli, jamais un flux de six pages.
   **Une exception, et elle est nommée : le poème.** C'est le seul contenu long du produit,
   et il se lit d'un bout à l'autre — son corps défile, les autres jamais. Ce n'est pas une
   permission générale : tout écran qui défile sans être un poème casse la règle.
2. **Le carmin est l'action.** Une seule couleur agit ; tout le reste est papier et encre.
3. **La pliure est physique.** Elle suit le doigt, résiste dans le mauvais sens, retombe si on hésite.
4. **Le papier découle du type.** Il change le fond et l'encre, jamais la composition —
   et ce n'est jamais un choix offert au dépôt.
5. **Rien à signer.** Pas de compte, pas de notification, pas de brouillon nommé.

## Encres

| Jeton | Valeur | Emploi |
|---|---|---|
| `--creme` | `#F7F2E8` | le papier du pli |
| `--sable` | `#E9E2D2` | le plateau, hors du pli |
| `--sable-2` | `#E4DCC9` | plateau du bureau (E1) |
| `--encre` | `#14100E` | le noir du produit — jamais `#000` |
| `--carmin` | `#C81E33` | la seule couleur d'action |
| `--rose` | `#EFA9A0` | le carmin, sur fond sombre uniquement |
| `--trait` | `rgba(20,16,14,.16)` | séparateur discret |
| `--trait-fort` | `#14100E` | séparateur de section, 2px |
| `--carmin-pointille` | `rgba(200,30,51,.55)` | le trait d'action, 2px dashed |
| `--grain` | `repeating-linear-gradient(0deg, rgba(20,16,14,.022) 0 1px, transparent 1px 4px)` | grain du papier crème |

Aucune autre couleur n'entre dans le produit. Sur encre, ce qui serait carmin devient rose ;
sur carmin, ce qui serait carmin devient crème.

**Contrastes vérifiés** — carmin sur crème **5,1:1**, rose sur encre **9,7:1**, crème sur
carmin **5,1:1**. Tous conformes. Le seul manquement corrigé est `.etiquette--fine`, passée
de `opacity: .5` (3,5:1) à **`.62`** (5,1:1) : elle porte « déposé par a. » sur son écran
d'attente. Les valeurs faibles restantes ne vivent que dans l'atelier et sont listées dans
[integration.md](integration.md).

## Papiers

**Trois papiers, et un traitement.** C'est la formulation qui remplace les trois versions
contradictoires du design.

| Papier | Classe | Types |
|---|---|---|
| crème | `.pli` | invitation, souvenir |
| encre | `.pli--encre` | pensée, poème |
| carmin | `.pli--carmin` | A4, D3 — jamais un contenu, seulement un aboutissement |

Le traitement image est une **couche par-dessus**, pas un quatrième papier :
`.image--haute` (bandeau 46 %) ou `.image--pleine` (page entière).
`.pli--plein` disparaît au profit de `.pli--encre` + `.image--pleine`.

## Les images

Cinq peintures, embarquées dans le build — elles ne voyagent jamais dans un lien.
**Trois appartiennent à un type**, deux appartiennent au produit.

Jamais nues : toujours un dégradé qui les ramène au papier (`.image__fondu`) ou à l'encre
(`.image__fondu--encre`). Le cadrage se règle par `object-position`, on ne recadre jamais
le fichier.

### Les trois textures de type

| Type | Texture | Format | Cadrage |
|---|---|---|---|
| invitation | `drape-carmin-rose.webp` | bandeau 46 % | `50% 46%` |
| pensée | `remous-encre-carmin.webp` | page entière, sur encre | `50% 70%` |
| souvenir | `voile-rose-touche.webp` | page entière, sur crème | `50% 50%` |
| poème | **aucune** | — | — |

Le poème n'a pas d'image, et c'est délibéré : c'est le seul contenu long, le seul qui
défile, et le seul où lire compte plus que regarder.

### Les deux images du produit

Elles n'entrent jamais dans un pli déplié.

| Image | Emploi | Cadrage |
|---|---|---|
| `rideau-carmin-nuit.webp` | les états fermés — A1, C3 | `50% 30%` |
| `papier-froisse-creme.webp` | l'aperçu OG, le journal vide, l'écran d'installation | `50% 25%` |

Les cinq sont de la même main : peinture à l'huile, abstraite, carmin et rose, **aucune
figuration**. Le sens de chacune et ses cadrages sont dans
[`design/handoff/assets/README.md`](../design/handoff/assets/README.md) ; **les définitions,
les poids et ce qu'ils coûtent** sont dans [ressources.md](ressources.md) — qui fait foi, le
retraitement à 720 × 1560 y étant abandonné au profit de la définition native.

## Les mains

| Rôle | Police | Tailles | Réglages | Emploi |
|---|---|---|---|---|
| marque | Pinyon Script | 52 / 44 / 38 | `lh .86` | le mot « Pli », coin haut gauche. Rien d'autre. |
| titre | Bodoni Moda 800 | 78 / 64 / 56 / 52 | caps, `-.035em`, `lh .9` — `.92` au-delà de 70px | un seul par pli |
| titre de doc | Bodoni Moda 700 | 34 / 30 | casse normale, `-.01em` | documentation seulement |
| voix | Newsreader ital. 300 | 31 / 29 / 23 | `lh 1.28–1.32`, `max-width 15–18ch`, `text-wrap: pretty` | le texte écrit par la personne |
| interface | Space Mono 700 | 14 / 12,5 / 11,5 / 10,5 / 10 | caps, `letter-spacing .24–.30em` | étiquettes, actions, états |
| griffe | Pinyon Script | 48 | `rotate(-4deg)` | une par pli au maximum |

Les étiquettes s'écrivent **en minuscules dans le code** et passent en capitales par
`text-transform`. Le rendu garde son espacement, les fichiers restent lisibles.

### Ce que ça impose au chargement

A1 n'appelle que **trois familles** — Pinyon, Newsreader, Space Mono. Bodoni ne sert qu'à
partir d'A2 et ne doit pas retarder l'ouverture. C'est désormais vrai sans arrangement : le
`↑` de la pliure, seul Bodoni du premier écran, est devenu un tracé.

`font-display: swap` est le mauvais réglage : voir « Un pli t'attend » s'afficher en Times
puis sauter en Newsreader ruine l'instant que tout le produit prépare. Le volet fermé offre
une seconde d'attente naturelle — préchargement des trois familles d'A1, sous-ensemble
latin + ponctuation française, blocage court plutôt que remplacement visible.
Bodoni Moda est une police variable : n'en prendre que l'axe `opsz`.

## Le gabarit

```
360 × 780        PROPORTION de référence — la composition s'y mesure, le cadre
                 rendu remplit l'écran (.claude/decisions.md, 19/08/2026)
--marge:  26px   seul retrait horizontal existant dans un pli
--pliure: 34%    hauteur du volet fermé, en bas
--cachet: 38px   pastille du numéro, à cheval sur la pliure, centrée
--rayon:  36px   coin du pli   — ne s'applique plus : un cadre plein n'a pas de coin
--ombre:  0 18px 40px rgba(20,16,14,.18)   — ni d'ombre, il n'y a plus de plateau
```

Les deux derniers restent déclarés pour E1, le bureau, où un pli redeviendra peut-être un
objet posé. Aujourd'hui rien ne les lit.

Quatre zones, de haut en bas :

1. **Tête** — `padding: 34px 26px 0`. Marque à gauche, type à droite.
2. **Corps** — `flex:1`, `padding: 0 26px 30px`, contenu **aligné en bas** ou réparti — ou
   aligné en haut et défilant, pour le poème et lui seul. On ne centre jamais verticalement.
3. **Pliure** — le trait d'action : `border-top: 2px dashed`, étiquette à gauche, flèche `↑` à droite.
4. **Volet** — 34 % de la hauteur, fond carmin.

Ce que le gabarit impose : **une seule marge**, 26px, aucun autre retrait horizontal — à
quoi s'ajoute le retrait de sécurité de l'appareil quand il y en a un, et lui seul. Le fond
va jusqu'au bord, seul le texte se retire ([appareils.md](appareils.md#les-réglages-de-page)).
Le contenu pousse vers la pliure. **Un titre, une voix, jusqu'à trois faits, une action** —
au-delà, c'est un autre type de pli.

## Le mouvement

Une seule courbe dans tout le produit : `cubic-bezier(.32,.72,0,1)` — le jeton
`--sortie` est **renommé `--courbe`**, il nomme une courbe, pas une sortie.

| Réglage | Valeur | Rôle |
|---|---|---|
| ouverture | `460 ms` | le pli part vers le haut |
| retour | `340 ms` | plus court : l'échec doit être rapide |
| seuil | `32 %` de la hauteur | course franchie = validé |
| élan | `0,55 px/ms` | le coup sec valide même à 10 % de course |
| caoutchouc | `0,1` | le mauvais sens ne rend qu'un dixième |
| entrée | `9 %` | la page dessous monte pour rejoindre sa place |

```
pointerdown   → mémoriser y0, p0 (0 fermé / 1 ouvert), couper toute transition
pointermove   → p = p0 + (y0 - y) / hauteur
                p < 0 → p *= 0.1        (caoutchouc bas)
                p > 1 → 1 + (p-1)*0.1   (caoutchouc haut)
                dessus.transform  = translate3d(0, -p*h, 0)
                dessous.transform = translate3d(0, (1-p)*0.09*h, 0)
                mesurer v = dy/dt entre deux frames
pointerup     → valide = v > 0.55 ? false : (v < -0.55 || p > 0.32)
                appliquer la transition (460 / 340 ms) et poser p à 1 ou 0
```

**Pendant le geste, aucune transition n'est active** : la feuille est exactement sous le
doigt. La courbe ne s'applique qu'au relâchement. C'est ce qui autorise l'hésitation —
s'arrêter, revenir, repartir.

Deux couches, un `translate3d` chacune. Pas de flou, pas d'ombre animée, rien à repeindre.
`touch-action: none` sur le cadre, `will-change: transform` sur les deux couches.

Le seul mouvement décoratif du produit est l'invite du volet : `translateY(-9px)` à 76 %
d'un cycle de 2,6 s, en pause dès que le doigt touche.

**Écartées, à ne pas implémenter** : le volet en trois bandes décalées, la ligne carmin
qui révèle par `clip-path`, l'écartement en deux moitiés. Toutes lisibles, mais elles
montrent l'animation au lieu de rendre le pli manipulable.

## Accessibilité

Absente des prototypes, obligatoire dans le produit.

- **Une alternative au geste**, toujours : un `<button>` « déplier » atteignable au clavier
  qui pose `p = 1` directement.
- **`prefers-reduced-motion: reduce`** supprime l'invite du volet et ramène l'ouverture à 120 ms.
- **Le focus doit rester visible.** `.ligne input { all: unset }` le supprime : ajouter un
  filet carmin de 2px à gauche sur `:focus-visible`, comme `.note` en porte déjà un.
- Le texte reste sélectionnable et présent même si une animation échoue.

## Ton et vocabulaire

Le lexique est **normatif et fermé**. Un seul ajout depuis le design : **atelier**, le lieu
où je dépose — le mot « studio » est retiré partout.

**On dit** — déplier · déposer · répondre · refermer · un pli · le volet · la pliure ·
l'atelier · nº 014 · « Un pli t'attend. » · « pour toi seule » · « déposé par a. »

**On ne dit pas** — ouvrir · envoyer un message · créer · valider · champ · formulaire ·
compte · notification · erreur.

Français, minuscules, tutoiement, phrases courtes adressées à une personne. Pas
d'exclamation, pas d'emoji, pas de majuscule d'insistance.

**Une seule exception, nommée** : le message WhatsApp pré-rempli d'A3 porte un cœur
(« Oui, j'y serai ❤️ »). Il quitte le produit et s'affiche dans une conversation, où il
parle en son nom à elle et non dans la voix de l'interface. C'est le seul endroit — partout
ailleurs la règle tient.

**Pas d'icônes, pas de SVG** — avec une exception, nommée et fermée : **les deux flèches**.
`↑` et `→` étaient des caractères Bodoni ; ce sont désormais deux tracés SVG inline, du même
dessin, pour la seule raison qu'un caractère obligeait à charger une police avant le premier
écran ([ressources.md](ressources.md#les-deux-flèches)). Le dessin ne change pas, le moyen
change.

Le seul symbole du produit reste le cachet numéroté.
