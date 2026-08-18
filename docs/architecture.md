# Architecture

## Stack

- **TypeScript + Vite**, sans framework.
- **CSS natif** : variables, `@layer`, animations. Pas de librairie d'animation.
- **Zéro dépendance npm au runtime.** Le codec, le routeur et la moulinette tiennent en
  quelques dizaines de lignes chacun.

Pourquoi pas React : quelques écrans, aucun état partagé complexe, et un geste sur mesure.
Le framework coûterait plus qu'il ne rapporte.

## Deux entrées

```
pli.re/           elle   → index.html
pli.re/atelier/   moi    → atelier/index.html
```

Deux entrées Vite, donc **deux bundles réellement distincts**. Le formulaire, les aperçus
et l'index des poèmes ne se chargent jamais sur son téléphone. Ils ne partagent que
`lib/` et `styles/`.

## Routage

Routage par **hash**, obligatoire sur GitHub Pages : pas de réécriture serveur, donc toute
URL profonde tomberait en 404.

```
pli.re/#/            ses plis (vide tant qu'elle n'a rien reçu)
pli.re/#c=<payload>  un pli porté par le lien
pli.re/#p=<nom>      un poème, porté par un fichier
pli.re/#/installer   la marche à suivre pour l'ajout à l'écran d'accueil
pli.re/atelier/      D0 → D1 → D2 → D3
```

Le routeur est une fonction sur `hashchange`. Pas de librairie.

**Le fragment ne quitte jamais l'appareil** — par spécification HTTP, tout ce qui suit
le `#` n'est pas envoyé au serveur. Ni GitHub, ni un CDN, ni WhatsApp en récupérant
l'aperçu ne voient le contenu d'un pli. C'est une garantie plus forte que le chiffrement
avec clé publique.

Corollaire à exploiter : **l'aperçu WhatsApp est entièrement sous notre contrôle.** Les
balises `og:` sont écrites une fois pour toutes et deviennent le teaser — « Un pli
t'attend » sur le papier froissé. Le spoil n'est pas un risque à couvrir, c'est une carte
à jouer. Les balises, l'image et le comportement réel de WhatsApp sont dans
[partage.md](partage.md).

## Le seuil de l'atelier

Avant le premier usage, l'atelier demande notre date d'officialisation. La comparaison se
fait sur `sha-256` (via `crypto.subtle`), **jamais sur la date en clair** : sinon quelqu'un
qui ouvre les sources tombe sur une date d'anniversaire lisible.

Ce qui est haché, précisément :

```
saisie      « 17/08/2026 »
normaliser   les chiffres seuls, dans l'ordre tapé   → « 17082026 »
préfixer     une constante du produit, « pli.seuil. » → « pli.seuil.17082026 »
sha-256      → hexadécimal
comparer     à la constante inscrite dans le bundle
```

Deux précisions, parce qu'elles évitent deux erreurs :

- **La normalisation est la seule tolérance offerte.** `17/08/2026`, `17-08-2026` et
  `17082026` donnent la même empreinte ; une date écrite à l'envers, non. La ligne se vide
  sans rien reprocher ([parcours.md](parcours.md#d0--le-seuil)).
- **Le préfixe n'est pas un secret.** Il est dans le bundle comme le reste ; il n'empêche
  rien d'autre qu'une table d'empreintes de dates toute faite. Ça reste un paillasson.

L'empreinte se fabrique une fois, en local, et c'est elle seule qui entre dans le dépôt :

```sh
node -e 'crypto.subtle.digest("SHA-256", new TextEncoder().encode("pli.seuil."+process.argv[1]))
  .then(b=>console.log(Buffer.from(b).toString("hex")))' 17082026
```

C'est un paillasson, pas une serrure — le contrôle est côté client, et il n'existe que
quelques dizaines de milliers de dates plausibles. L'objectif est d'écarter le passant,
et c'est exactement calibré pour ça.

Une fois franchi, `pli.v1.seuil` est posé et l'écran ne revient plus.

## Le journal peut être effacé

**C'est le risque le plus sérieux du produit, et il est structurel.**

Depuis Safari 13.1, WebKit applique un **plafond de sept jours sur tout le stockage écrit
par script** — `localStorage`, IndexedDB, Cache API, tout. Le compteur se déclenche après
sept jours d'utilisation de Safari sans interaction avec le site. Passer à IndexedDB
n'aide en rien : c'est la même règle.

Autrement dit : si elle ne reçoit pas de pli pendant une dizaine de jours, **son journal
peut disparaître** — l'objet décrit dans [concept.md](concept.md) comme celui qui a de la
valeur au bout de six mois.

L'exemption est nette : **les sites ajoutés à l'écran d'accueil y échappent.** Le
Le manifeste n'est donc pas une coquetterie, il est porteur. Trois conséquences :

1. **L'ajout à l'écran d'accueil est une étape du parcours**, pas un bonus. Un écran
   `#/installer` montre le geste, proposé une fois, après son deuxième ou troisième pli.
   Aucun lien ne peut déclencher l'installation sur iOS — Safari n'expose pas
   `beforeinstallprompt`, c'est Partager → Sur l'écran d'accueil, à la main. Détecter
   `display-mode: standalone` pour ne jamais le proposer si c'est déjà fait.
2. **À vérifier sur son iPhone** avant de considérer le journal comme fiable.
3. **Pas d'export en v1** — décidé, pas oublié ([roadmap.md](roadmap.md#plus-tard)). Le
   journal n'a donc qu'un filet : l'ajout à l'écran d'accueil. Si la mesure du bac de
   stockage tourne mal, l'export redevient la première chose à construire.

## La longueur du lien

Le plafond ne se devine pas, il se mesure. Le vieux seuil de 2 083 caractères était une
limite d'Internet Explorer, morte depuis longtemps ; Safari 26 et Chrome encaissent des
URLs très longues. Le maillon faible est la chaîne WhatsApp → iOS → Safari, et elle ne se
documente pas.

**Protocole** — envoyer depuis mon Android vers son iPhone des liens de 500, 1 000, 2 000
et 4 000 caractères. Vérifier pour chacun qu'il arrive entier, qu'il reste cliquable, et
qu'il s'ouvre. **Fixer le plafond de l'atelier à la moitié de ce qui passe.**

Le vrai problème n'est d'ailleurs pas la limite technique mais l'allure : un lien de 1 900
caractères est un mur de charabia sur quinze lignes dans la conversation, juste au-dessus
de « je t'ai envoyé un pli ». C'est ce qui justifie que le poème passe par un fichier.

## Hébergement

GitHub Pages, déploiement par GitHub Actions sur push vers `main`. Domaine propre :
**`pli.re`**, via un `CNAME` à la racine du build. `base` de Vite = `/`, `.nojekyll` à la
racine, aucune variable secrète — tout ce qui est buildé est public.

Deux traits de l'hébergeur gouvernent le reste et ne se contournent pas :

- **Aucun en-tête personnalisable.** Tout est servi en `cache-control: max-age=600`, y
  compris les fichiers au nom empreinté. Dix minutes, pas un an : on compte donc les
  **allers-retours**, pas seulement les octets.
- **Aucune réécriture d'URL.** C'est ce qui impose le routage par hash.

Le détail — ce que Pages refuse, la vérification en une commande, les limites, et la liste
de ce qui ne doit jamais casser dans un lien déjà envoyé — est dans
[hebergement.md](hebergement.md).

Trois points qui restent ici parce qu'ils touchent au produit :

- Le domaine décorrèle l'URL du nom du dépôt : le dépôt redevient renommable, et chaque
  lien envoyé y gagne 18 caractères.
- **Ne plus changer de domaine.** Il est dans chaque lien déjà envoyé.
- `public/plis/` est copié tel quel dans la sortie — les poèmes se lisent en **même
  origine**, `pli.re/plis/015-vhtq.txt`. Aucune question de CORS, un cache HTTP normal.

## Poids

L'ancienne cible de 15 ko gzip est intenable — quatre familles de polices et une peinture
la dépassent d'un ordre de grandeur. Mais l'intention derrière ce chiffre est juste, donc on
mesure ce qui compte :

> **Le texte d'A1 lisible en moins d'une seconde en 4G.**

Budget éclaté, à titre indicatif :

| Poste | Cible |
|---|---|
| document d'A1 (HTML + CSS + JS inline) | < 14 ko gzip, **une seule requête** |
| polices sous-ensemblées | ~90 ko, **3 familles** au premier écran, Bodoni à partir d'A2 |
| texture | la **définition native** de la peinture — 600 ko à 1,15 Mo, **une seule par pli**, jamais avant le texte |

Un pli n'a qu'un type : personne ne télécharge les cinq peintures. C'est ce qui autorise à
servir les toiles en pleine définition plutôt qu'en vignettes — le choix, ce qu'il coûte en
mémoire et ce qu'il impose au rendu sont dans [ressources.md](ressources.md).

L'ordre de chargement — ce qui part avant le texte, ce qui attend le volet fermé, et
comment on le mesure sur les vrais téléphones — est dans [chargement.md](chargement.md).

## Compatibilité

Deux appareils, connus : **elle sur iOS 26** (Safari 26), **moi sur Android 16** (Chrome).
On cible ces deux-là, pas le web. Toutes les API modernes sont donc disponibles :
`CompressionStream`, `@layer`, `:has()`, `text-wrap: balance`, `View Transitions`,
`Web Share`, `crypto.subtle` — aucun préfixe, aucun polyfill, aucun fallback.

**Un troisième navigateur existe pourtant**, et c'est celui par lequel un pli arrive : le
navigateur intégré de WhatsApp. Il est cloisonné, son stockage n'est pas celui de Safari, et
il remet en cause le remède de l'ajout à l'écran d'accueil. C'est devenu la mesure nº 3 du
produit — [appareils.md](appareils.md#le-bac-de-stockage--la-mesure-qui-manque).

Deux vigilances de rendu :

- Safari iOS reste plus lent sur les filtres SVG. Le grain se teste sur son téléphone, pas
  sur un émulateur.
- Le geste ne doit perdre **aucune image** : `touch-action: none`, `will-change: transform`
  posé et retiré, `translate3d` et rien d'autre. Le budget par image, ce qui a le droit de
  bouger et ce qui ne doit jamais tourner pendant une animation sont dans
  [fluidite.md](fluidite.md).

Les réglages de page (encoche, `100dvh`, clavier, `theme-color`) et la séance de test
appareil par appareil sont dans [appareils.md](appareils.md).

Pas de service worker en v1 — le manifeste suffit pour l'ajout à l'écran d'accueil,
dont la spécification complète est dans [installation.md](installation.md).

Ce qui se passe quand on pousse une nouvelle version — fichiers empreintés, fenêtre de dix
minutes, index des poèmes, migration des clés de stockage — est dans
[mises-a-jour.md](mises-a-jour.md).

## Arborescence cible

```
index.html                 elle
atelier/index.html         moi
src/
  lecteur/                 A1 → A4, les types, les états C
  atelier/                 D0 → D3, E1
  lib/
    codec.ts               encode / décode — isomorphe Node + navigateur
    journal.ts             seul accès à localStorage
    dates.ts               formats français
  fleches.html             les deux tracés, inline dans chaque document qui s'en sert
  styles/
    tokens.css             extrait de design/handoff/pli.css
    pli.css                le gabarit et les classes — inline dans le document
    <type>.css             composition par type, chargée en arrière-plan
  textures/                les cinq peintures — importées, donc empreintées
  fonts/                   les woff2 sous-ensemblés — importés par le CSS
public/                    servi tel quel, noms stables
  plis/                    les poèmes encodés + l'index
  icones/                  les icônes, le manifeste, og.png — écrits par scripts/icones.py
  404.html
  CNAME  .nojekyll
plis-source/               les poèmes en clair — GITIGNORÉ
polices-source/            les quatre familles, avec leurs OFL — jamais servies
scripts/plier.mjs          la moulinette
scripts/polices.py         les sous-ensembles — regénère src/fonts/
scripts/fleches.py         les deux flèches — regénère src/fleches.html
scripts/icones.py          la planche des icônes — regénère public/icones/
plier.bat · plier.sh       les deux enveloppes
design/                    l'archive figée du design — jamais dans le build
docs/
```

Tout accès à `localStorage` passe par `journal.ts` : le mode navigation privée, où
l'écriture échoue, doit dégrader proprement — le pli s'affiche, il n'est simplement pas
archivé.

## Tests

Pas de tests unitaires généralisés. Deux modules les méritent :

- **`codec.ts`** — un lien cassé est un pli perdu, et il tourne des deux côtés.
  Tester l'aller-retour sur les quatre types, les accents, un poème long, un payload tronqué.
- **`dates.ts`** — les formats français.
