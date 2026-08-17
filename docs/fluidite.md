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

On ne va pas demander à quelqu'un d'aller cocher un drapeau dans les réglages de Safari.
Donc la cible n'est pas un chiffre de fréquence :

> **Aucune image perdue, quelle que soit la cadence de l'appareil.**

Le budget de travail reste calé sur 120 Hz — **≤ 4 ms de fil principal par image**, la
moitié des 8,3 ms — pour que 60 Hz soit atteint sans y penser et que 120 Hz soit tenu
partout où l'appareil le donne. Un budget serré ne coûte rien ici : le geste ne fait bouger
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

Une couche de 360 × 780 sur un écran à 3× pèse environ **2,5 Mo de mémoire GPU**. Deux
couches, c'est confortable ; dix, c'est un téléphone qui chauffe et une animation qui
saccade.

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
| décoder une image | 10 à 30 ms pour une texture 720 × 1560 | vague 3, pendant A1 ([chargement.md](chargement.md)) |
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
Elle se met en **pause** dès que le doigt touche (`animation-play-state: paused`), pas en
« redémarrage » : une animation qui repart de zéro au relâchement se voit.

Sous `prefers-reduced-motion: reduce`, elle n'existe pas et l'ouverture tombe à 120 ms.

## Ce que WebKit fait payer

- **Les filtres SVG sont lents sur iOS.** Il n'y en a aucun — le grain est un dégradé
  répété, et il est peint dans la couche.
- **Une image qui se décode pendant une animation fait tomber la frame.** `decoding="async"`
  et un `img.decode()` terminé avant le geste, toujours.
- **La barre d'URL se rétracte au premier mouvement** et change la hauteur : `100dvh`, pas
  `100vh` ([appareils.md](appareils.md)).
- **Le pli ne défile pas.** Il n'y a rien de scrollable dans un pli — c'est la règle 1 du
  design system, et c'est aussi ce qui supprime toute une famille de saccades.

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
