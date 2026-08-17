# Ressources — les images et les polices

Ce que le build embarque, à quelle définition, et comment on le produit. **Quand** ça se
charge est dans [chargement.md](chargement.md) ; ce que chaque image *dit* est dans
[design-system.md](design-system.md#les-images).

Le principe qui gouverne ce document :

> Une peinture se charge **une fois**, sur une bonne connexion, et elle reste à l'écran
> pendant qu'on lit. On paie la définition. On ne paie jamais la latence du premier texte.

## Les cinq peintures — ce qu'on a vraiment

| Fichier | Définition | Poids | Mégapixels |
|---|---|---|---|
| `papier-froisse-creme.webp` | 1536 × 2752 | 1 148 ko | 4,2 |
| `voile-rose-touche.webp` | 1536 × 2752 | 887 ko | 4,2 |
| `remous-encre-carmin.webp` | 1536 × 2752 | 802 ko | 4,2 |
| `rideau-carmin-nuit.webp` | 1536 × 2752 | 600 ko | 4,2 |
| `drape-carmin-rose.webp` | **1296 × 2304** | 619 ko | 3,0 |

Mesuré dans `design/handoff/assets/` le 17 août 2026. Ce sont des **webp avec perte**, pas
des masters.

### La règle de définition

**La définition native de la source, jamais un agrandissement.** Agrandir n'ajoute aucun
détail, seulement des octets et du flou.

Ce que ça implique pour la cible de 1800 de large : **aucune des cinq n'y est**. Quatre
plafonnent à 1536, le drapé à 1296. Deux chemins, et c'est une décision à prendre, pas une
contrainte technique :

| Chemin | Ce que ça donne |
|---|---|
| **Servir le natif** (par défaut) | 1536 × 2752, aucune perte ajoutée, rien à refaire |
| **Régénérer les peintures** en amont, ≥ 1800 × 2400 | la cible visée, au prix d'un nouveau tirage de chaque toile — et il ne sera pas identique |

### Le plafond que l'écran impose

Son iPhone est en **3×**, le pli fait **360 × 780** CSS et ne s'élargit jamais
([design-system.md](design-system.md#le-gabarit)). L'image est donc affichée sur
**1080 × 2340 pixels réels**, au maximum, quoi qu'on serve.

| Source | Rapport à l'écran |
|---|---|
| 1536 × 2752 | **1,42×** — de la marge |
| 1296 × 2304 | **1,20×** — de la marge |
| 1800 × 2400 | 1,67× — de la marge en plus, invisible à l'œil |

Au-delà de 1080 de large, rien n'est visible de plus sur son téléphone. La définition
supplémentaire achète de la réserve — un écran futur, un recadrage — pas de la netteté
perçue. Le natif suffit largement ; ça reste un choix légitime de vouloir la réserve.

### Ré-encoder, ou ne pas ré-encoder

**webp qualité 80** est le bon réglage — mais il s'applique à un master, pas à un fichier
déjà compressé. Ré-encoder une webp avec perte en produit une deuxième génération : on perd
du détail pour gagner deux ou trois cents kilo-octets.

| Ce qu'on a | Ce qu'on fait |
|---|---|
| un master (le tirage d'origine, PNG ou sortie du générateur) | ré-encoder en **webp q80**, définition native |
| seulement la webp du dépôt | **la servir telle quelle** — c'est déjà l'optimum disponible |

```sh
cwebp -q 80 -m 6 -sharp_yuv master.png -o public/textures/rideau.webp
```

`-sharp_yuv` compte sur ces peintures : le carmin saturé sur fond sombre est exactement ce
que la conversion chroma standard salit.

## Ce qu'une grande image coûte

| Coût | Pour 4,2 Mpx |
|---|---|
| octets | 600 ko à 1,15 Mo |
| 5G (~50 Mb/s) | 100 à 200 ms |
| 4G (~10 Mb/s) | 0,5 à 1 s |
| **décodage** | 30 à 60 ms de fil principal |
| **mémoire décodée** | 1536 × 2752 × 4 = **17 Mo** |

Les deux dernières lignes sont celles qui mordent. Trois règles en sortent :

1. **Aucun décodage pendant le geste.** La texture du type est chargée et `decode()`-ée
   pendant A1, tant que le doigt n'a pas bougé ([fluidite.md](fluidite.md#la-file-dattente-principale)).
2. **Deux textures décodées vivantes au maximum.** En quittant un pli, l'`<img>` sort du
   document — 17 Mo ne se gardent pas « au cas où ». **Le journal (C1) n'affiche aucune
   peinture dans sa liste** : une liste de dix plis illustrés, ce sont 170 Mo et un onglet
   que Safari ferme.
3. **Jamais avant le texte.** Le cadre est peint à plat, la peinture arrive après.

### Le fondu d'arrivée

Pas de vignette floutée : un flou est un filtre, et les filtres sont chers sur iOS. Le
cadre porte un **aplat ou un dégradé de deux couleurs prélevées sur la peinture** — zéro
octet, il est dans le CSS — et l'image se fond par-dessus en **240 ms d'opacité**, sur une
couche composée, quand `decode()` a rendu la main.

C'est aussi ce qui rend une image manquante sans conséquence : le fond reste juste.

## Où les fichiers vivent

| Fichier | Chemin | Nom |
|---|---|---|
| les cinq peintures servies | importées depuis `src/` | **empreinté par Vite** |
| les polices sous-ensemblées | importées par le CSS | **empreinté par Vite** |
| l'aperçu du lien | `public/og.jpg` | **stable, jamais empreinté** |
| les icônes de l'app | `public/icons/` | stables |
| les originaux | `design/handoff/assets/` | jamais servis |

L'empreinte n'est pas un détail de confort : c'est ce qui rend impossible de servir une
ancienne peinture avec un nouveau code ([mises-a-jour.md](mises-a-jour.md)). Seul `og.jpg`
y échappe, parce qu'un aperçu déjà envoyé pointe vers une adresse qui doit rester valable.

## L'aperçu du lien

1200 × 630, recadré depuis le papier froissé à `50% 25%`, **JPEG q78, ≤ 300 ko**
([partage.md](partage.md#limage-daperçu)).

```sh
# 1536×2752 → largeur 1200 (soit 1200×2151), puis fenêtre de 630 à 25 % du jeu vertical
magick papier-froisse-creme.webp -resize 1200x -crop 1200x630+0+380 -quality 78 public/og.jpg
```

## Les polices

Quatre familles, un seul style chacune, sous-ensemblées en woff2.

| Famille | Ce qu'on garde | Glyphes nécessaires |
|---|---|---|
| Pinyon Script | régulier | latin + accents français — la griffe est du texte libre |
| Newsreader | italique 300 | latin + accents + ponctuation française |
| Space Mono | 700 | latin, chiffres, `·` — les étiquettes passent en capitales par CSS |
| Bodoni Moda | 700 et 800, axe `opsz` seul | capitales, chiffres, ponctuation |

```sh
pyftsubset Newsreader-Italic.ttf \
  --unicodes="U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+2018-201D,U+2026,U+202F" \
  --layout-features="kern,liga,ccmp" --flavor=woff2 \
  --output-file=newsreader-italic.woff2
```

Bodoni est variable : instancier `wght` aux deux valeurs utiles et **ne garder que l'axe
`opsz`** ([design-system.md](design-system.md#les-mains)) — un fichier multi-axes coûte le
double pour un réglage qu'on ne bouge jamais.

Cible : **15 à 30 ko par famille**, à mesurer au jalon 1. `font-display: block`, préchargées,
`crossorigin` obligatoire ([chargement.md](chargement.md#les-polices)).

Les capitales des étiquettes viennent de `text-transform` : le sous-ensemble de Space Mono
doit donc contenir **les minuscules et les capitales**, malgré ce que montrent les écrans.

## Les deux flèches

Elles ne sont plus des caractères. `↑` et `→` sont **deux tracés SVG inline**, définis une
fois par document et appelés par `<use>` — environ 200 octets, zéro requête, zéro
dépendance à une police.

Ce que ça change, et c'est la raison du changement : **Bodoni n'est plus nécessaire avant
A2**. La pliure d'A1 portait un `↑` en Bodoni, ce qui contredisait « trois familles au
premier écran ». Le premier écran n'appelle plus que Pinyon, Newsreader et Space Mono, sans
arrangement.

Contraintes de tracé, pour que ça reste le produit et pas une icône :

- **Tracé depuis le glyphe Bodoni**, même dessin, mêmes pleins et déliés — on remplace le
  moyen, pas la forme.
- `fill: currentColor`, aucune dimension en dur : la flèche prend la couleur et la taille du
  texte qui l'entoure.
- `aria-hidden="true"` : elle décore une étiquette qui dit déjà ce qu'elle fait.
- **Deux tracés, pas un de plus.** L'exception au « pas de SVG » est nommée et fermée
  ([design-system.md](design-system.md#ton-et-vocabulaire)).

## À produire au jalon 1

- [ ] trancher : servir le natif, ou régénérer les peintures ≥ 1800 de large
- [ ] les cinq textures dans `src/`, ré-encodées q80 **seulement si un master existe**
- [ ] `og.jpg` 1200 × 630, ≤ 300 ko, vérifié dans une vraie conversation
- [ ] les quatre polices sous-ensemblées, poids réels notés dans
      [chargement.md](chargement.md#le-budget-écran-par-écran)
- [ ] les deux flèches tracées
- [ ] les icônes de l'app ([installation.md](installation.md#le-manifest))
