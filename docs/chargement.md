# Chargement

Une seule règle d'arbitrage, et tout en découle :

> **Rien ne se charge avant le texte du premier écran. Tout le reste se charge pendant
> qu'elle regarde le volet fermé.**

Le volet offre une seconde d'attente naturelle — c'est le seul budget de temps que le
produit s'accorde, et il est déjà écrit dans le geste.

L'objectif chiffré ne bouge pas : **le texte d'A1 lisible en moins d'une seconde en 4G**.

## Les trois vagues

| Vague | Quand | Quoi | Budget |
|---|---|---|---|
| **1 · critique** | dans le document | HTML d'A1 + CSS inline + le module d'ouverture | **≤ 14 ko gzip, 1 requête** |
| **2 · immédiate** | `preload` dans le `<head>` | 3 polices sous-ensemblées, puis le rideau | 3 requêtes + l'image |
| **3 · arrière-plan** | après le premier rendu, en idle | la texture du type, Bodoni entier, le CSS du type, `journal.ts` | invisible |

Cible d'ensemble : **A1 en cinq requêtes** — le document, trois polices, une peinture. Et
rien de tiers, jamais : pas de CDN de polices, pas de mesure d'audience, pas une seule
connexion en dehors de `pli.re`.

## Vague 1 — le document se suffit à lui-même

`index.html` contient A1 en entier : son balisage, son style et le code qui décide quel
écran montrer. **Aucune requête ne s'interpose entre le HTML et le premier texte.**

- **Le CSS est inline, en totalité pour ce qui est partagé.** `pli.css` fait 13,7 ko brut,
  **4,1 ko gzip** — et on en retire la section 7 et l'`@import` Google Fonts
  ([integration.md](integration.md#reprendre-plicss)). Un fichier séparé coûterait un
  aller-retour bloquant pour économiser trois kilo-octets : le calcul est vite fait. Seul le
  CSS **par type** est découpé, et il part en vague 3.
- **Le module d'ouverture est inline lui aussi** : lire le hash, décoder, chercher dans le
  journal, écrire A1. Quelques kilo-octets, zéro dépendance — `DecompressionStream` est
  natif ([donnees.md](donnees.md#2-lencodage)).
- **14 ko** n'est pas un chiffre rond : c'est ce qu'une connexion neuve envoie avant
  d'attendre le premier accusé de réception. Au-delà, le premier écran coûte un
  aller-retour de plus.

Ordre exact du module, et il compte : **si le hash est un `#p=`, lancer le `fetch` du poème
en toute première instruction**, avant même de décoder quoi que ce soit. C'est la seule
requête que le réseau nous impose, elle doit partir la première.

## Vague 2 — ce qui est préchargé, et rien d'autre

Précharger trop revient à ne rien précharger : les requêtes se disputent la bande passante.
La liste est fermée.

| Ressource | Pourquoi elle est là |
|---|---|
| Pinyon Script | le mot « Pli », en haut à gauche d'A1 |
| Newsreader ital. 300 | la voix — « Un pli t'attend. » |
| Space Mono 700 | les étiquettes, « déposé par a. » |
| `rideau-carmin-nuit.webp` | le fond des états fermés, en priorité **basse** |

**Bodoni n'est pas là**, et c'est nouveau : le `↑` de la pliure était son seul emploi sur
A1. Les deux flèches du produit sont devenues des tracés SVG inline
([ressources.md](ressources.md#les-deux-flèches)), donc le premier écran n'appelle plus que
trois familles, sans arrangement.

```html
<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/newsreader-…woff2">
```

`crossorigin` est obligatoire même en même origine, sinon la police est téléchargée deux fois.

### Les polices

Sous-ensemblées en woff2 : **latin + ponctuation française** (`« » — ’ … é è à ç ù`), et
rien de plus. Une famille, une graisse, un style — pas de fichier variable multi-axes, sauf
Bodoni dont on ne garde que l'axe `opsz`.

**`font-display: block`, et surtout pas `swap`.** Voir « Un pli t'attend » s'afficher en
Times puis sauter en Newsreader ruine l'instant que tout le produit prépare
([design-system.md](design-system.md#ce-que-ça-impose-au-chargement)). `block` laisse le
texte invisible le temps que la police arrive — quelques centaines de millisecondes,
préchargée et en même origine — puis l'écrit une fois, à sa place.

Le risque assumé : si une police n'arrive jamais, le texte apparaît en police de secours au
bout de trois secondes. C'est le bon échec.

### Le rideau

C'est une image, elle passe donc après le texte, sans exception. `<img>` et non fond CSS :
c'est le seul moyen d'avoir `fetchpriority`, `decoding` et `decode()`.

```html
<img src="/assets/rideau-…webp" decoding="async" fetchpriority="low" alt="">
```

Elle est **lourde** — les peintures sont servies en définition native, 600 ko à 1,15 Mo
([ressources.md](ressources.md#les-cinq-peintures--ce-quon-a-vraiment)). C'est un choix
assumé : une peinture se charge une fois, sur une bonne connexion, et on la regarde
longtemps. Ce que ce choix exige en retour est strict :

- le cadre est peint **à plat** dès la première image — un aplat ou un dégradé de deux
  couleurs prélevées sur la toile, qui ne coûte pas un octet ;
- la peinture se fond par-dessus en 240 ms d'opacité quand `decode()` a rendu la main ;
- **le texte d'A1 ne l'attend jamais.** En 5G elle arrive en 100 à 200 ms, en 4G en une
  seconde, et dans les deux cas l'écran était déjà lisible.

## Vague 3 — pendant qu'elle regarde le volet

Elle a le texte, elle a le volet qui invite, elle n'a encore rien touché. Cette seconde-là
paie tout le reste du parcours.

| Chargé en fond | Pour que… |
|---|---|
| la texture du **type** du pli, puis `img.decode()` | A2 n'ait plus rien à décoder au moment du geste — 30 à 60 ms qu'on ne peut pas payer pendant l'animation |
| Bodoni, pour les titres | le titre d'A2 ne saute pas au moment où il s'affiche |
| `styles/<type>.css` | la composition d'A2 soit prête |
| `journal.ts` | l'écriture au seuil ne charge rien |
| le module d'A3 (invitation seulement) | la réponse soit instantanée |

Le déclenchement : après le premier rendu — `requestIdleCallback` s'il existe, sinon un
`setTimeout(…, 0)` posé sur l'événement `load`. **Jamais avant que A1 soit peint**, jamais
d'un bloc : une ressource à la fois, la texture en premier.

**Un pli n'a qu'un type.** Personne ne télécharge les cinq peintures — c'est la seule
raison pour laquelle on peut servir des peintures d'un mégaoctet. Et **deux textures
décodées vivantes au maximum** : une image de 4,2 Mpx occupe 17 Mo de mémoire une fois
décodée ([ressources.md](ressources.md#ce-quune-grande-image-coûte)).

Une requête ne vient pas de nous : **le navigateur va chercher l'icône de l'onglet** tout
seul. Elle est déclarée en SVG (2,1 ko) et l'`.ico` ne sert que de repli — c'est la seule
raison pour laquelle ces fichiers restent minuscules. En app installée, la question ne se
pose pas : il n'y a pas d'onglet.

Ce qui n'est **pas** en vague 3 : l'atelier (bundle séparé, jamais servi sur son téléphone),
les quatre autres textures, la police des titres de documentation, l'aperçu `og.png` — il
n'est lu que par le fabricant d'aperçu, jamais par le produit.

## Le poème, le seul cas qui dépend du réseau

`#p=` demande un fichier ; c'est le seul écran d'attente du produit (**C5**). Le fichier est
petit — un poème encodé tient en quelques kilo-octets — en même origine, sur une connexion
déjà ouverte : un aller-retour. Le `fetch` part en première instruction, C5 ne s'affiche que
s'il dure ([parcours.md](parcours.md#larrivée)).

## Le budget, écran par écran

| Poste | Cible | Mesuré | Le |
|---|---|---|---|
| document d'A1 (HTML + CSS + JS, gzip) | **≤ 14 ko** | **5,86 ko** — un seul fichier, gabarit et module compris | 18/08/2026, en local |
| les trois polices d'A1 | **≤ 90 ko** | **52,6 ko** — Pinyon 24,6 · Newsreader 20,8 · Space Mono 7,2 | 18/08/2026, en local |
| une texture | définition native, **600 ko à 1,15 Mo** | 600 ko à 1,15 Mo | 17/08/2026 |
| requêtes **bloquantes** avant le premier rendu | **1** | **1** — le document, et lui seul | 18/08/2026, en local |
| requêtes avant le texte d'A1 **lisible** | **4** | **4** — le document et les trois polices | 18/08/2026, en local |
| requêtes avant A1 complet (rideau compris) | **≤ 5** | **5** — le document, trois polices, le rideau | 18/08/2026, en local |
| texte d'A1 peint, 4G, cache vide | **< 1 s** | — | à mesurer sur les deux téléphones |
| A2 après le geste | **0 requête** | — | A2 arrive au jalon 2 |

Le document est inline depuis le jalon 2 — gabarit et module compris, en un seul fichier —
et c'est ce qui ramène la première ligne de requêtes de 2 à 1. **Aucune requête ne s'interpose
plus entre le HTML et le premier texte**, et le plafond de 14 ko est désormais tenu par le
build lui-même : il échoue au-dessus.

Les deux lignes de requêtes sont désormais séparées, et il le fallait : **une** requête
bloquante n'est pas **un** texte à l'écran. Avec `font-display: block`, le texte d'A1
n'existe qu'à l'arrivée des polices — la quatrième requête. Lire « 1 » tout court se
lisait comme une victoire qui n'était pas gagnée.

Bodoni n'est plus sur ce chemin : A1 n'a pas de titre, et le seul du document — celui de
C4 — est dans un bloc `hidden`, donc jamais mis en forme au premier rendu. La cinquième
requête est le rideau, préchargé en priorité basse.

**Deux réserves, à lever sur les deux téléphones.** Le panneau réseau montrera sept ou huit
lignes, pas cinq : le navigateur va chercher l'icône de l'onglet et le manifeste tout seul —
ce n'est pas un dépassement. Et sur **C4**, Bodoni est demandée au moment où l'écran
s'affiche : le titre « lien abîmé » reste invisible le temps qu'elle arrive. La phrase qui
porte le message, elle, est en Newsreader, préchargée — l'écran n'est jamais muet, seul son
titre se pose un instant après.

La colonne de droite ne se remplit que de ce qui a vraiment été mesuré. Un budget sans date
de mesure est une intention, pas un budget — et **les deux dernières lignes ne se mesurent
que sur les deux téléphones**, avec le `performance.mark('a1')` posé dans le lecteur.

## Comment on mesure

**Le poids**, en local, après build :

```sh
find dist -name '*.js' -o -name '*.css' -o -name '*.html' \
  | xargs -I{} sh -c 'printf "%7s  %s\n" $(gzip -9c {} | wc -c) {}'
```

**Le temps**, sur les vrais appareils, jamais sur un émulateur :

- **Son iPhone** — câble, Réglages → Safari → Avancé → Inspecteur web, puis Safari du Mac,
  onglet Réseau, cache désactivé.
- **Mon Android** — `chrome://inspect`, Performance, throttling « Slow 4G ».

Le repère qui compte est un `performance.mark('a1')` posé juste après l'écriture du texte
d'A1 : Safari ne donne pas de LCP, et le premier rendu peint le plateau avant le texte.

## Ce qui fait échouer la revue d'un écran

1. Une requête vers un domaine autre que `pli.re`.
2. Une feuille de style ou un script bloquant entre le HTML et le premier texte.
3. Une image, une police ou un module chargé **pendant** le geste
   ([fluidite.md](fluidite.md#la-file-dattente-principale)).
4. Un `@import` CSS — il sérialise ce qu'il charge.
5. Deux textures pour un seul pli, ou une texture encore décodée alors qu'on a quitté
   l'écran.
6. Un fichier empreinté sur le chemin du premier texte — il rendrait une page périmée
   illisible ([mises-a-jour.md](mises-a-jour.md#1-une-page-périmée-doit-rester-lisible)).
