# Pli — l'icône

Direction retenue : **8b, la lettre en réserve.** Fond carmin plein, P de Pinyon Script
en crème, décalé de deux unités à gauche (x = 30 sur la grille de 64) pour compenser
la panse et la queue de la lettre.

## Les fichiers

| fichier | emploi |
|---|---|
| `favicon.svg` | la référence, grille 64, carré à fond perdu, sans arrondi |
| `favicon-petite.svg` | le même dessin au grade 1,25 — pour tout tirage sous 32 |
| `favicon.ico` | 16 · 32 · 48, les trois grades, PNG encapsulés |
| `favicon-16.png` `favicon-32.png` `favicon-48.png` | les tirages unitaires |
| `apple-touch-icon.png` | 180, fond plein, sans arrondi et sans transparence |
| `icon-192.png` `icon-512.png` `icon-1024.png` | manifeste (dont `purpose: maskable`) et magasins |
| `og.png` | 1200 × 630, le pli et « Un pli t'attend. » |
| `marque-encre.svg` | encre sur crème — onglet épinglé, impression, tampon |
| `site.webmanifest` `tete.html` | le manifeste et les balises `<head>` |

## Deux choses à finir

1. **Vectoriser la lettre.** Les SVG appellent encore `font-family: Pinyon Script` :
   un SVG n'embarque pas la police. Ouvrir `favicon.svg`, convertir le `<text>` en
   contour, garder x = 30, y = 47, corps 52. Les PNG, eux, sont définitifs.
2. **Regénérer, jamais retoucher.** Tous les PNG sortent de la planche
   `Pli - Icone - planche d'export.dc.html` : modifier la planche, retirer les fichiers.

## Le grade optique

Une seule main, Pinyon, jusqu'au 16 : ce n'est pas la police qui change mais l'épaisseur
du contour, ajoutée au tracé (`stroke` de la même encre, `stroke-linejoin: round`).

| taille | corps | ligne de base | grade |
|---|---|---|---|
| 16 | 58 | 48,5 | 1,25 |
| 32 | 56 | 48 | 0,80 |
| 48 | 54 | 47,7 | 0,55 |
| 64 | 53 | 47,5 | 0,35 |
| 180 et plus | 52 | 47 | 0 |

## Règles

- Trois encres, jamais de dégradé, jamais d'ombre dans le fichier.
- Le fichier est carré et plein : l'arrondi et le masque viennent de la plateforme.
- Zone sûre du masque adaptatif : la lettre tient dans les 66 % centraux, ne pas l'agrandir.
- Sur fond sombre, la lettre passe au rose `#EFA9A0` ; sur carmin elle reste crème.
- Le logotype « Pli » en Pinyon ne descend pas sous 38px et n'entre pas dans l'icône.
