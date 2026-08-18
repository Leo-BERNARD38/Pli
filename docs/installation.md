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

## Le manifest et les icônes

Livrés, dessinés, mesurés : [`design/handoff/icones/`](../design/handoff/icones/README.md).
Le dessin retenu est **le P de Pinyon en crème sur carmin plein** — pas d'icône inventée, la
main du produit.

| Fichier | Emploi | Poids |
|---|---|---|
| `favicon.ico` (16 · 32 · 48) | l'onglet | 3,8 ko |
| `favicon.svg`, `favicon-petite.svg` | l'onglet, en vectoriel | 0,3 ko |
| `apple-touch-icon.png` 180 | l'écran d'accueil iOS | 7,7 ko |
| `icon-192.png`, `icon-512.png` | le manifeste | 8,5 et 17 ko |
| `icon-1024.png` | la réserve | 45 ko |
| `og.png` 1200 × 630 | l'aperçu du lien ([partage.md](partage.md)) | 53 ko |
| `marque-encre.svg` | encre sur crème — onglet épinglé, impression | 0,3 ko |

Servis depuis **`public/icones/`**, noms stables, jamais empreintés
([mises-a-jour.md](mises-a-jour.md#les-fichiers-stables-un-par-un)) : une icône posée sur son
écran d'accueil pointe vers une adresse qui doit rester valable.

```json
{
  "name": "Pli",  "short_name": "Pli",  "description": "Un message qui arrive plié.",
  "lang": "fr",   "dir": "ltr",
  "start_url": "/",  "scope": "/",
  "display": "standalone",  "orientation": "portrait",
  "background_color": "#F7F2E8",
  "theme_color": "#C81E33",
  "icons": [ … ]
}
```

| Champ | Pourquoi cette valeur |
|---|---|
| `start_url: "/"` | l'app s'ouvre sur son journal, jamais sur un pli |
| `display: "standalone"` | pas de barre d'URL — c'est aussi ce qui stabilise la hauteur |
| `orientation: "portrait"` | le pli est un objet tenu à la main, il n'a pas de paysage |
| `background_color` | le **crème** du papier : l'écran de lancement est une feuille, pas un rectangle blanc |
| `theme_color` | le **carmin**, la seule couleur d'action, pour la barre système d'Android |

Les balises du `<head>` sont écrites dans
[`tete.html`](../design/handoff/icones/tete.html) — à reprendre telles quelles, avec les
deux corrections ci-dessous.

### Trois corrections avant de servir ces fichiers

**1. Le `maskable` ne l'est pas encore.** Mesuré sur les fichiers livrés : la lettre occupe
**70 % de la largeur**, avec seulement **10 % de marge à droite** contre 19,7 % à gauche. Le
masque d'Android recadre en cercle — un disque de 80 % du côté — et la boucle haute de la
lettre en sort. Déclarer les fichiers actuels en `purpose: "any"`, et **exporter une variante
masquable** où la lettre tient dans les 66 % centraux, marges égales.

**2. Le SVG appelle une police qu'il n'embarque pas.** `favicon.svg` contient
`font-family: Pinyon Script` : partout où la police n'est pas installée — c'est-à-dire
partout — le navigateur dessine un `P` en cursive de secours. **Vectoriser la lettre** avant
de servir le fichier ; les PNG, eux, sont définitifs. Le README des icônes le note déjà.

**3. `mask-icon` attend une image monochrome à fond transparent.** `marque-encre.svg` porte
un aplat crème : l'onglet épinglé de Safari afficherait un carré plein. Soit on retire le
fond, soit on retire la balise — elle ne sert plus qu'à d'anciennes versions de Safari.

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
- [ ] le lancement montre le crème du papier, pas un écran blanc
- [ ] l'app s'ouvre sur le journal
- [ ] pas de barre d'URL, hauteur stable pendant le geste
- [ ] **le journal contient bien les plis ouverts avant l'installation** — la vraie question
- [ ] après le réglage de cadence : le dépliage est-il visiblement plus fluide dans l'app ?
- [ ] une réponse d'invitation part vers WhatsApp et revient sur A4
      ([partage.md](partage.md#le-retour))
