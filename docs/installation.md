# Installation — l'app sur l'écran d'accueil

Ce n'était qu'un remède au plafond de sept jours de WebKit. Ça devient le mode d'usage
normal : c'est là que le journal est en sûreté, et là qu'on peut régler la cadence
d'affichage.

## Ce que l'installation change

| | Dans Safari | Installée |
|---|---|---|
| stockage | effaçable après 7 jours d'inactivité | **exempté** |
| barre d'URL | présente, elle se rétracte au mouvement | absente, hauteur stable |
| cadence | ~60 Hz par défaut ([fluidite.md](fluidite.md#lobjectif-dit-correctement)) | ~60 Hz aussi — **jusqu'au réglage, voir plus bas** |
| démarrage | onglet | icône, écran de lancement |
| liens reçus | s'ouvrent ici | **ne s'ouvrent pas ici** |

La dernière ligne est la difficulté du produit, et elle ne se contourne pas : **sur iOS, un
lien tapé dans WhatsApp n'ouvre jamais une app installée.** Le pli s'ouvre dans Safari ou
dans le navigateur intégré ; le journal, lui, serait dans l'app. Deux bacs, deux journaux.

C'est la mesure à faire avant de construire cet écran —
[appareils.md](appareils.md#le-bac-de-stockage--la-mesure-qui-manque). Selon la réponse,
`#/installer` est soit le chemin principal, soit remplacé par « ouvrir dans Safari » et un
export sérieux du journal.

## Le manifeste et les icônes

Le dessin est **le P de Pinyon en crème sur carmin plein** — la main du produit, pas une
icône inventée. Le handoff est archivé dans
[`design/handoff/icones/`](../design/handoff/icones/README.md) ; **les fichiers servis sont
dans `public/icones/`**, regénérés depuis le tracé par
[`scripts/icones.py`](../scripts/icones.py).

**Huit fichiers, 88 ko, et rien de plus** — tout ce qui n'était appelé par personne a été
retiré.

| Fichier | Emploi | Poids |
|---|---|---|
| `favicon.ico` (16 · 32 · 48) | l'onglet — trois tirages gradés, pas un redimensionnement | 3,7 ko |
| `favicon.svg` | l'onglet, en vectoriel | 2,1 ko |
| `apple-touch-icon.png` 180 | l'écran d'accueil iOS | 4,2 ko |
| `icon-192.png` · `icon-512.png` | le manifeste | 4,5 · 12,5 ko |
| **`icon-512-masque.png`** | le seul déclaré `maskable` | 9,6 ko |
| `og.png` 1200 × 630 | l'aperçu du lien ([partage.md](partage.md)) | 30 ko |
| `site.webmanifest` | le manifeste | 0,6 ko |

Noms **stables**, jamais empreintés
([mises-a-jour.md](mises-a-jour.md#les-fichiers-stables-un-par-un)) : une icône posée sur son
écran d'accueil et un aperçu déjà envoyé pointent vers des adresses qui doivent rester
valables.

| Champ du manifeste | Pourquoi cette valeur |
|---|---|
| `start_url: "/"` | l'app s'ouvre sur son journal, jamais sur un pli |
| `display: "standalone"` | pas de barre d'URL — c'est aussi ce qui stabilise la hauteur |
| `orientation: "portrait"` | le pli est un objet tenu à la main, il n'a pas de paysage |
| `background_color: #F7F2E8` | le **crème** du papier : l'écran de lancement est une feuille, pas un rectangle blanc |
| `theme_color: #C81E33` | le **carmin**, la seule couleur d'action, pour la barre système d'Android |

Les balises qui vont avec, à coller telles quelles dans les deux entrées :

```html
<link rel="icon" href="/icones/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/icones/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icones/apple-touch-icon.png">
<link rel="manifest" href="/icones/site.webmanifest">
<meta name="theme-color" content="#E9E2D2">
<meta name="robots" content="noindex, nofollow">
```

La balise `theme-color` porte **le sable**, celui du plateau
([appareils.md](appareils.md#les-réglages-de-page)) : dans le navigateur, la barre se confond
avec la page et le pli reste le seul objet à l'écran. Le **carmin** reste le `theme_color` du
manifeste, qui ne vaut que pour l'app installée. Les deux valeurs disaient la même balise ;
c'est tranché ici ([integration.md](integration.md#structure)).

Les balises `og:` s'ajoutent à celles-là, sur l'entrée d'elle seulement
([partage.md](partage.md#les-balises-écrites-une-fois-pour-toutes)).

### Ce qui a été corrigé sur les fichiers livrés

Trois défauts mesurés, trois corrections faites — c'est ce qui sépare
`design/handoff/icones/` de `public/icones/`.

| Défaut | Mesure | Correction |
|---|---|---|
| Le `maskable` débordait | la lettre occupait **70 % de la largeur**, 10 % de marge à droite contre 19,7 % à gauche : le masque circulaire d'Android l'aurait rognée | `icon-512-masque.png`, lettre **centrée à 52 % de la largeur**, toute l'encre dans le disque de 66 % — les autres tirages restent `purpose: any` |
| Les SVG appelaient une police | `font-family: Pinyon Script`, qu'un SVG n'embarque pas : partout où la police manque, le navigateur dessine un `P` de secours | **lettre vectorisée** — 2,2 ko, plus aucune police appelée à l'affichage |
| `mask-icon` avait un fond | Safari attend une forme monochrome sur transparent ; l'aplat crème aurait donné un carré plein | **la balise est retirée** — l'onglet épinglé est une affaire de Safari de bureau, et nos deux appareils sont un iPhone et un Android |

Deux détails réglés au passage :

- **Le SVG et les PNG n'étaient pas au même endroit.** Le texte du handoff pose la lettre à
  `x = 30` sur la grille de 64, ses PNG — ceux qui ont été vus et validés — la posent à 29.
  On suit les PNG : le tirage regénéré recouvre le livré à **98,6 %**, et les deux familles
  de fichiers s'accordent enfin.
- **Les PNG sont passés en palette** : deux encres et leurs fondus tiennent en 256 teintes,
  sans rien perdre. `icon-512` tombe de 17 à 12,5 ko.
- **Six fichiers du handoff ne sont pas servis** : les trois tirages unitaires du petit
  (l'`.ico` les porte déjà), la variante gradée en SVG, le 1024 de réserve et le tampon
  encre. Aucune balise ne les appelait. Ils restent dans l'archive, et une ligne du script
  les fait revenir le jour où ils servent.

Les grades optiques du handoff — l'épaisseur ajoutée au tracé sous 64 px — sont repris tels
quels, taille par taille, et comparés aux tirages livrés à l'œil : à 16 px, un grade plus
lourd bouche la panse de la lettre.

## L'écran `#/installer`

Proposé **une fois**, après son deuxième ou troisième pli, jamais au premier
([architecture.md](architecture.md#le-journal-peut-être-effacé)).

- Le geste est manuel sur iOS : **Partager → Sur l'écran d'accueil**. Safari n'expose pas
  `beforeinstallprompt`, aucun bouton ne peut déclencher l'installation.
- Détecter `display-mode: standalone` pour ne jamais le proposer si c'est déjà fait.
- Le fond est le papier froissé, comme le journal vide : les deux écrans où le produit se
  montre lui-même.
- Une seule proposition. Refusée, elle ne revient pas — le lexique interdit d'insister.

## Le réglage de cadence

Safari plafonne par défaut les mises à jour de page autour de 60 Hz. Le réglage existe, il
est enfoui, et il se fait **une fois, à la main, au moment de l'installation** :

> Réglages → Safari → Avancé → Feature Flags → décocher
> **« Prefer Page Rendering Updates near 60fps »**

À vérifier dans la foulée, parce que ça ne se déduit pas : **est-ce que ce réglage vaut
aussi pour l'app installée**, qui tourne dans le même moteur mais pas dans Safari ? Un
dépliage côte à côte, l'un dans Safari, l'autre dans l'app, tranche la question en trente
secondes.

Ce que ça ne change pas : le budget de [fluidite.md](fluidite.md) reste calé sur 8,3 ms et
le geste doit rester impeccable **sans** le réglage. On ne construit pas un produit qui
dépend d'une case cochée dans un menu caché.

## Vérifier une installation

- [ ] l'icône est nette sur l'écran d'accueil, et **rien n'est rogné** par le masque Android
- [ ] l'onglet de Safari et de Chrome montre le P, pas une cursive de secours
- [ ] le lancement montre le crème du papier, pas un écran blanc
- [ ] l'app s'ouvre sur le journal
- [ ] pas de barre d'URL, hauteur stable pendant le geste
- [ ] **le journal contient bien les plis ouverts avant l'installation** — la vraie question
- [ ] après le réglage de cadence : le dépliage est-il visiblement plus fluide dans l'app ?
- [ ] une réponse d'invitation part vers WhatsApp et revient sur A4
      ([partage.md](partage.md#le-retour))
