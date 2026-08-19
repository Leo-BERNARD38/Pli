# Fluidité — le geste

Le dépliage est le produit. S'il accroche une seule fois, tout le reste ne rattrape rien.
Les réglages du geste (seuil, élan, caoutchouc, courbe) sont dans
[design-system.md](design-system.md#le-mouvement) — ici, ce qui garantit qu'ils tiennent.

## L'objectif, dit correctement

120 fps, c'est **8,3 ms par image**. Deux faits qui changent la façon de viser :

- **Mon Android** en 120 Hz anime à 120 : `requestAnimationFrame` suit la dalle.
- **Son iPhone** plafonne par défaut les mises à jour de page **autour de 60 Hz** — Safari
  garde un réglage « Prefer Page Rendering Updates near 60fps » actif, que seul un drapeau
  enfoui désactive. Le défilement natif, lui, reste à 120 : c'est le compositeur, pas la page.

Le drapeau se décoche, et c'est prévu : une fois, à la main, au moment où l'app est ajoutée
à l'écran d'accueil ([installation.md](installation.md#le-réglage-de-cadence)). Mais un
produit ne se construit pas sur une case cochée dans un menu caché — elle peut être remise,
le téléphone peut changer, et le réglage ne se propage pas forcément à l'app installée.
Donc la cible n'est pas un chiffre de fréquence :

> **Aucune image perdue, quelle que soit la cadence de l'appareil.**

Le budget de travail reste calé sur 120 Hz — **≤ 4 ms de fil principal par image**, la
moitié des 8,3 ms — pour que 60 Hz soit atteint sans y penser, et que 120 Hz soit tenu
partout où l'appareil le donne : sur mon Android aujourd'hui, sur son iPhone dès que le
réglage est fait. Un budget serré ne coûte rien ici : le geste ne fait bouger
que deux couches.

## Le seul chemin autorisé pendant le geste

```
pointerdown  → mesurer la hauteur UNE fois, capturer le pointeur, couper les transitions
pointermove  → mémoriser y. Rien d'autre. Aucune lecture, aucune écriture de style.
rAF          → écrire deux transform. Une seule fois par image.
pointerup    → poser la transition, laisser filer
```

La mesure de hauteur est la **seule** lecture de géométrie de tout le geste, et elle a lieu
avant la première image. Un `getBoundingClientRect()` entre deux écritures force un calcul
de disposition et fait tomber la frame — c'est la faute classique, et la seule qui compte.

La vitesse se mesure **entre deux images**, pas entre deux événements : les événements
pointeur sont coalescés, leur cadence n'est pas celle de l'écran, et le réglage d'élan
(`0,55 px/ms`) a été calibré sur des images.

## Ce qui a le droit de bouger

| Autorisé pendant une animation | Pourquoi |
|---|---|
| `transform` (`translate3d`) | déplacé par le compositeur, sans repeindre |
| `opacity` | même chose |

| Interdit pendant une animation | Ce que ça déclenche |
|---|---|
| `top`, `left`, `height`, `width`, `margin` | disposition **et** peinture, à chaque image |
| `box-shadow`, `filter`, `backdrop-filter` | repeinture d'une zone floutée, la plus chère qui soit |
| `background-position`, `object-position` | repeinture de toute la surface |
| `border-radius`, `clip-path` animés | ré-rastérisation de la couche |
| écrire une variable CSS sur `:root` | recalcul de style de **tout** l'arbre, pour deux éléments |

La dernière mérite d'être dite en clair : le geste écrit `style.transform` **directement sur
les deux couches**, jamais une `--variable` que l'arbre entier consommerait.

L'ombre du gabarit (`--ombre`) et le grain (`--grain`) ne sont pas interdits — ils sont
peints **une fois** dans la couche et voyagent avec elle. Ce qui est interdit, c'est de les
animer, et de faire changer la **taille** d'une couche qui les porte : elle serait
re-rastérisée à chaque image.

## Les couches, et ce qu'elles coûtent

Une couche plein écran sur une dalle à 3× pèse environ **3,4 Mo de mémoire GPU** — 412 × 915
points, la taille du plus grand des deux téléphones (c'était 2,5 Mo du temps où le pli
faisait 360 × 780). Deux couches, c'est confortable ; dix, c'est un téléphone qui chauffe et
une animation qui saccade.

La peinture qu'elle contient, elle, est une autre dépense : une image de 1536 × 2752 occupe
**17 Mo une fois décodée**, quelle que soit la taille à laquelle on l'affiche. D'où la règle
de [ressources.md](ressources.md#ce-quune-grande-image-coûte) : **deux textures décodées
vivantes au maximum**, l'`<img>` sort du document quand on quitte l'écran, et la liste du
journal n'affiche aucune peinture.

- **`will-change: transform` sur exactement deux éléments** : la feuille dessus, la page
  dessous. Posé au `pointerdown`, **retiré au `transitionend`**. Une propriété `will-change`
  laissée en place transforme chaque écran en couche permanente.
- Les écrans hors champ sortent du rendu : `content-visibility: hidden` plutôt que d'être
  gardés vivants.
- Les textures sont des `<img>` dans leur couche, `object-fit: cover`. Le cadrage est réglé
  une fois par `object-position` ([design-system.md](design-system.md#les-images)) — jamais
  animé.
- **Vérification visuelle** : Chrome DevTools → Rendering → *Layer borders*. Pendant le
  geste, exactement deux couches bordées. → *Paint flashing* : rien ne doit clignoter.

## La file d'attente principale

C'est la demande la plus stricte du produit, et elle se formule simplement :

> **Du `pointerdown` à la fin de la transition (460 ms), le fil principal ne fait rien
> d'autre que déplacer deux couches.**

Interdits dans cette fenêtre, chacun pour une raison mesurable :

| Travail | Coût | Où il va |
|---|---|---|
| `localStorage.setItem` | synchrone, 1 à 5 ms, davantage au premier accès | après la transition — voir plus bas |
| décoder une image | **30 à 60 ms** pour une peinture de 4,2 Mpx | vague 3, pendant A1 ([chargement.md](chargement.md)) |
| `fetch` + décompression | réseau, imprévisible | avant A1, jamais après |
| charger une police | disposition + peinture de tout ce qu'elle touche | pendant A1 |
| `import()` dynamique | analyse et exécution du module | pendant A1 |
| construire le DOM d'A2 | disposition complète | **avant** le premier `pointerdown` |
| `View Transitions` | capture de la page entière en image | jamais pendant le geste |

La couche du dessous — A2 — **existe et est peinte avant qu'un doigt se pose**. C'est
déjà ce que décrit le geste : deux couches, l'une monte, l'autre suit de 9 %. Le geste ne
fabrique rien, il déplace ce qui est prêt.

## Écrire le journal sans bloquer

[parcours.md](parcours.md#le-dépliage) pose la règle : franchir le seuil écrit l'entrée au
journal. La décision reste là où elle est ; l'**écriture**, elle, attend la fin de
l'animation.

```
seuil franchi      → l'entrée est décidée, gardée en mémoire
transitionend      → écriture dans localStorage
pagehide / hidden  → écriture aussi, au cas où elle quitte avant la fin
```

Deux écritures possibles, aucun doublon : le dédoublonnage se fait sur l'empreinte du
payload ([donnees.md](donnees.md#4-son-journal)), écrire deux fois la même entrée ne produit
rien. La seule exception à la règle est le départ vers WhatsApp : là, on écrit
**avant** de quitter la page, et il n'y a plus d'animation à protéger
([partage.md](partage.md#la-réponse)).

## Les entrées

- `touch-action: none` **sur le cadre du pli uniquement** — pas sur `body`, sinon on désarme
  aussi ce qui doit rester manipulable dans l'atelier.
- `overscroll-behavior: none` sur `html, body` : sans ça, Chrome Android déclenche son
  « tirer pour rafraîchir » sur le caoutchouc bas, et le pli se recharge en plein geste.
- `setPointerCapture` au `pointerdown` : le doigt qui sort du cadre continue le geste.
- Un seul écouteur `pointermove`, en `{passive: true}`. Aucun `preventDefault` n'est
  nécessaire — `touch-action` a déjà fait le travail, et un écouteur non passif oblige le
  navigateur à attendre notre code avant de défiler.

## Le mouvement décoratif

L'invite du volet (`translateY(-9px)`, 2,6 s) est une animation CSS composée, donc gratuite.
Elle **s'arrête** dès que le doigt touche — `animation: none`, et non `animation-play-state:
paused`.

C'est une correction, et elle vient d'une mesure. Une animation composée mise en pause
**garde la couche** qu'elle a promue : le compositeur la connaît toujours. Compté à
l'inspecteur le 18/08/2026, pendant un vrai glissement : en pause, quatre couches bordées —
`dessus`, `dessous`, l'invite, **et le cachet**, promu à son tour parce qu'il la recouvre.
Arrêtée franchement, exactement deux. « Pause » et « exactement deux couches bordées » ne
pouvaient pas être vraies ensemble ; c'est la seconde qui compte, et la première qui cède.

Ce que la pause protégeait reste protégé autrement : l'invite ne **repart** qu'une fois le
pli refermé, jamais pendant qu'il retombe — une animation qui repart de zéro au relâchement
se voit. Le prix accepté est un saut d'au plus 9px à l'instant où le doigt se pose, sur un
élément décoratif, alors que le doigt entraîne déjà toute la feuille.

Sous `prefers-reduced-motion: reduce`, elle n'existe pas et l'ouverture tombe à 120 ms.

## Ce que WebKit fait payer

- **Les filtres SVG sont lents sur iOS.** Il n'y en a aucun — le grain est un dégradé
  répété, et il est peint dans la couche.
- **Une image qui se décode pendant une animation fait tomber la frame.** `decoding="async"`
  et un `img.decode()` terminé avant le geste, toujours.
- **La barre d'URL se rétracte au premier mouvement** et change la hauteur : `100dvh`, pas
  `100vh` ([appareils.md](appareils.md)).
- **Le pli ne défile pas — sauf le poème.** C'est la règle 1 du design system et son
  exception nommée, et c'est aussi ce qui supprime toute une famille de saccades. Le poème
  paie cette exception avec précaution : son corps ne devient un conteneur de défilement
  qu'**une fois le pli ouvert**, jamais pendant le geste. Un conteneur qui défile se fait
  promouvoir en couche par le compositeur, et il vit sous une couche que `will-change:
  transform` promeut déjà — le rendre scrollable trop tôt ferait **trois** couches bordées
  pendant le dépliage au lieu de deux. C'est le jeton `data-defile` du cadre qui décide, et
  il n'est posé qu'à `transitionend` (src/lecteur/main.ts).

## Comment on mesure

Sur les deux téléphones, jamais sur un émulateur — le rendu du grain et le coût des couches
n'y ressemblent à rien.

- **Son iPhone** — Inspecteur web par câble, onglet Timeline pendant dix dépliages
  d'affilée. Ce qu'on cherche : une barre « Disposition » ou « Peinture » pendant le geste.
  Il ne doit y en avoir **aucune**.
- **Mon Android** — `chrome://inspect`, Performance. *Frame rendering stats* affiché
  pendant le geste : la cadence doit coller à la dalle, sans creux.
- **Le test qui tranche** : dix dépliages de suite, les quatre types, une fois à froid et
  une fois à chaud. Un seul accroc perceptible et l'écran repart en revue.
