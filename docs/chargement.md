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
| **2 · immédiate** | `preload` dans le `<head>` | 3 polices sous-ensemblées + les flèches, puis le rideau | ≤ 100 ko, 4 requêtes |
| **3 · arrière-plan** | après le premier rendu, en idle | la texture du type, Bodoni entier, le CSS du type, `journal.ts` | invisible |

Cible d'ensemble : **A1 en 4 requêtes ou moins**, et rien de tiers, jamais — pas de CDN de
polices, pas de mesure d'audience, pas une seule connexion en dehors de `pli.re`.

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
| Bodoni · tranche flèches | le `↑` de la pliure, et lui seul — voir plus bas |
| `rideau-carmin-nuit.webp` | le fond des états fermés, en priorité **basse** |

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

### La tranche de flèches — une précision sur le design

Le design dit deux choses vraies qui se contredisent au chargement : **A1 n'appelle que
trois familles**, et **les flèches sont des caractères Bodoni**. Or la pliure d'A1 porte
un `↑`.

On tranche par `unicode-range`, sans toucher au dessin :

```css
@font-face{font-family:'Bodoni Moda';src:url(bodoni-fleches.woff2)format('woff2');
           unicode-range:U+2191,U+2192}        /* ~2 ko, préchargée avec A1 */
@font-face{font-family:'Bodoni Moda';src:url(bodoni-titres.woff2)format('woff2');
           unicode-range:U+0020-024F,U+2018-201D}  /* le reste, vague 3 */
```

Le navigateur ne télécharge une tranche que si un caractère la réclame. A1 tire deux
kilo-octets, les titres d'A2 tirent le reste — **pendant** qu'elle regarde A1.

### Le rideau

C'est une image, elle passe donc après le texte, sans exception. `<img>` et non fond CSS :
c'est le seul moyen d'avoir `fetchpriority`, `decoding` et `decode()`.

```html
<img src="/textures/rideau.webp" decoding="async" fetchpriority="low" alt="">
```

Le cadre est peint en encre pleine dès la première image ; le rideau se fond par-dessus en
opacité quand il est décodé — une transition composée, gratuite
([fluidite.md](fluidite.md)).

## Vague 3 — pendant qu'elle regarde le volet

Elle a le texte, elle a le volet qui invite, elle n'a encore rien touché. Cette seconde-là
paie tout le reste du parcours.

| Chargé en fond | Pour que… |
|---|---|
| la texture du **type** du pli, puis `img.decode()` | A2 n'ait plus rien à décoder au moment du geste |
| la tranche Bodoni des titres | le titre d'A2 ne saute pas |
| `styles/<type>.css` | la composition d'A2 soit prête |
| `journal.ts` | l'écriture au seuil ne charge rien |
| le module d'A3 (invitation seulement) | la réponse soit instantanée |

Le déclenchement : après le premier rendu — `requestIdleCallback` s'il existe, sinon un
`setTimeout(…, 0)` posé sur l'événement `load`. **Jamais avant que A1 soit peint**, jamais
d'un bloc : une ressource à la fois, la texture en premier.

**Un pli n'a qu'un type.** Personne ne télécharge les cinq peintures — c'est la seule
raison pour laquelle un budget de 70 ko par texture tient.

Ce qui n'est **pas** en vague 3 : l'atelier (bundle séparé, jamais servi sur son téléphone),
les quatre autres textures, la police des titres de documentation, l'aperçu `og.jpg` — il
n'est lu que par le crawler de WhatsApp.

## Le poème, le seul cas qui dépend du réseau

`#p=` demande un fichier ; c'est le seul écran d'attente du produit (**C5**). Le fichier est
petit — un poème encodé tient en quelques kilo-octets — en même origine, sur une connexion
déjà ouverte : un aller-retour. Le `fetch` part en première instruction, C5 ne s'affiche que
s'il dure ([parcours.md](parcours.md#larrivée)).

## Le budget, écran par écran

| Poste | Cible | Mesuré le |
|---|---|---|
| document d'A1 (HTML + CSS + JS, gzip) | **≤ 14 ko** | — |
| les quatre polices d'A1 | **≤ 100 ko** | — |
| une texture | **≤ 70 ko** | — |
| requêtes avant le texte d'A1 | **1** | — |
| requêtes avant A1 complet (rideau compris) | **≤ 4** | — |
| texte d'A1 peint, 4G, cache vide | **< 1 s** | — |
| A2 après le geste | **0 requête** | — |

La colonne de droite se remplit au jalon 1, sur son téléphone. Un budget sans date de mesure
est une intention, pas un budget.

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
5. Une texture qui dépasse 70 ko, ou deux textures pour un seul pli.
