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

## Le manifest

```json
{
  "name": "Pli",
  "short_name": "Pli",
  "lang": "fr",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#E9E2D2",
  "theme_color": "#E9E2D2",
  "icons": [
    { "src": "/icons/pli-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/pli-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/pli-512-masque.png", "sizes": "512x512", "type": "image/png",
      "purpose": "maskable" }
  ]
}
```

| Champ | Pourquoi cette valeur |
|---|---|
| `start_url: "/"` | l'app s'ouvre sur son journal, jamais sur un pli |
| `display: "standalone"` | pas de barre d'URL — c'est aussi ce qui stabilise la hauteur |
| `orientation: "portrait"` | le pli est un objet tenu à la main, il n'a pas de paysage |
| `background_color` | le **sable** du plateau : l'écran de lancement doit être le plateau, pas un rectangle blanc |
| `theme_color` | même sable, pour la barre système d'Android |

Et dans le `<head>`, parce qu'iOS reste plus sûr avec :

```html
<link rel="apple-touch-icon" href="/icons/pli-180.png">
<link rel="manifest" href="/manifest.json">
```

Noms **stables**, jamais empreintés ([mises-a-jour.md](mises-a-jour.md#les-fichiers-stables-un-par-un)) :
une icône installée sur son écran d'accueil pointe vers une adresse qui doit rester valable.

## L'icône

**Elle n'est pas encore dessinée.** C'est le seul dessin qui manque au produit, et il n'a
pas de maquette.

Ce qu'on sait déjà : pas d'icône au sens habituel, pas de symbole inventé. Le vocabulaire
disponible est celui du produit — le mot « Pli » en Pinyon sur crème, ou le cachet numéroté,
qui est le seul symbole que le design se soit autorisé
([design-system.md](design-system.md#ton-et-vocabulaire)). La version `maskable` a besoin de
**20 % de marge** sur tout le tour : Android recadre en cercle, en carré ou en goutte selon
le lanceur.

Trois tailles à produire : 180 (iOS), 192 et 512 (manifest), plus la 512 masquable.

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

- [ ] l'icône est nette sur l'écran d'accueil, et masquable sur Android
- [ ] le lancement montre le plateau sable, pas un écran blanc
- [ ] l'app s'ouvre sur le journal
- [ ] pas de barre d'URL, hauteur stable pendant le geste
- [ ] **le journal contient bien les plis ouverts avant l'installation** — la vraie question
- [ ] après le réglage de cadence : le dépliage est-il visiblement plus fluide dans l'app ?
- [ ] une réponse d'invitation part vers WhatsApp et revient sur A4
      ([partage.md](partage.md#le-retour))
