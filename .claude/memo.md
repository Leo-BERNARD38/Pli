# La fiche — tout ce qui se cite, sur une page

`docs/` fait foi. Cette fiche ne le remplace pas : elle **recopie les valeurs déjà tranchées**
pour qu'on n'ouvre pas quatre documents afin d'en citer une. Chaque bloc dit d'où il vient.
Quand la fiche ne répond pas, on ouvre le document nommé — et **seulement celui-là**.

Si une valeur d'ici contredit `docs/`, c'est `docs/` qui gagne et la fiche qui se corrige,
dans le même commit.

## Les cinq règles (design-system.md)

1. **Un pli = un écran.** Jamais de défilement dans un pli.
2. **Le carmin est l'action.** Une seule couleur agit.
3. **La pliure est physique.** Elle suit le doigt, résiste dans le mauvais sens, retombe.
4. **Le papier découle du type**, jamais un choix offert au dépôt.
5. **Rien à signer.** Pas de compte, pas de notification, pas de brouillon nommé.

## Le lexique — fermé et normatif (design-system.md#ton-et-vocabulaire)

**On dit** — déplier · déposer · répondre · refermer · un pli · le volet · la pliure ·
l'atelier · nº 014 · « Un pli t'attend. » · « pour toi seule » · « déposé par a. »

**On ne dit pas** — ouvrir · envoyer un message · créer · valider · champ · formulaire ·
compte · notification · erreur · studio · créateur · carte · expiré.

La règle vaut **aussi pour les noms du code**. Français, minuscules, tutoiement, phrases
courtes. Pas d'exclamation, pas d'emoji — seule exception nommée, le cœur du message WhatsApp
d'A3. Étiquettes en minuscules dans le code, capitales par `text-transform`.

`scripts/verifie.mjs` contrôle tout ce paragraphe. Ne pas le refaire à la main.

## Le gabarit (design-system.md#le-gabarit)

```
360 × 780        taille de référence, jamais élargie
--marge  26px    seul retrait horizontal existant dans un pli
--pliure 34%     hauteur du volet fermé, en bas
tête    padding 34px 26px 0      marque à gauche, type à droite
corps   flex:1, padding 0 26px 30px, contenu ALIGNÉ EN BAS
volet   34 % de la hauteur, fond carmin
```

Un titre, une voix, jusqu'à trois faits, une action. Au-delà, c'est un autre type de pli.

## Les encres (design-system.md)

| Jeton | Valeur |
|---|---|
| `--creme` | `#F7F2E8` |
| `--sable` | `#E9E2D2` (aussi `theme-color`) |
| `--sable-2` | `#E4DCC9` |
| `--encre` | `#14100E` — **jamais `#000`** |
| `--carmin` | `#C81E33` |
| `--rose` | `#EFA9A0` — le carmin, sur fond sombre uniquement |
| `--trait` | `rgba(20,16,14,.16)` |
| `--carmin-pointille` | `rgba(200,30,51,.55)` |

`.etiquette--fine` à **`.62`**, pas `.5`. Aplats mesurés : rideau `#743c3b` → `#440b10`,
drapé `#944850` / `#904a53`. Voiles d'image : pleine page sur encre `.68`, bandeau `.82`,
souvenir `.85`.

## La typographie (design-system.md)

| Rôle | Police | Tailles |
|---|---|---|
| marque | Pinyon Script | 52 / 44 / 38, `lh .86` |
| titre | Bodoni Moda 800 | 78 / 64 / 56 / 52, caps, `-.035em`, `lh .9` |
| voix | Newsreader ital. 300 | 31 / 29 / 23, `lh 1.28–1.32`, `max-width 15–18ch` |
| interface | Space Mono 700 | 14 / 12,5 / 11,5 / 10,5 / 10, caps, `ls .24–.30em` |
| griffe | Pinyon Script | 48, `rotate(-4deg)` |

A1 n'appelle que **trois familles** — Pinyon, Newsreader, Space Mono. **Bodoni commence à
A2.** `font-display: block`, jamais `swap`.

## Le geste (design-system.md, fluidite.md)

| Réglage | Valeur |
|---|---|
| ouverture | `460 ms` |
| retour | `340 ms` |
| seuil | `32 %` de la hauteur |
| élan | `0,55 px/ms` — mesuré entre deux **images**, pas deux événements |
| caoutchouc | `0,1` |
| entrée | `9 %` |
| courbe | `cubic-bezier(.32,.72,0,1)` — le jeton s'appelle `--courbe` |
| invite du volet | `translateY(-9px)`, `2,6 s` — **arrêtée** au toucher, pas mise en pause |
| `prefers-reduced-motion` | pas d'invite, ouverture à `120 ms` |

Le seul chemin autorisé :

```
pointerdown → mémoriser y0 et p0, capturer le pointeur, couper les transitions,
              UNE seule lecture de géométrie
pointermove → p = p0 + (y0 - y) / hauteur ; caoutchouc ×0.1 hors [0,1] ; rien d'autre
rAF         → dessus.transform  = translate3d(0, -p*h, 0)
              dessous.transform = translate3d(0, (1-p)*0.09*h, 0)
pointerup   → valide = v > 0.55 ? false : (v < -0.55 || p > 0.32)
transitionend → retirer will-change, PUIS écrire le journal
```

Budget : **≤ 4 ms de fil principal par image** (120 Hz = 8,3 ms). Du `pointerdown` à la fin
de la transition, le fil principal ne fait **rien d'autre** que déplacer **deux couches**.

## Le chargement (chargement.md, hebergement.md)

- Les requêtes d'A1 : **1** bloquante avant le premier rendu (le document, et lui seul),
  **4** avant le texte lisible (les trois polices), **5** avant A1 complet (le rideau).
- Le document d'A1 : cible **≤ 14 ko gzip**, mesuré **9,56 ko** — le build échoue au-delà.
- Les trois polices d'A1 : cible **≤ 90 ko**, mesuré **52,6 ko**.
- A2 après le geste : **0 requête**.
- Un `#p=` lance son `fetch` **en toute première instruction**.
- Budgets comptés **en gzip** (Pages ne sert pas de brotli) et **cache vide**
  (`max-age=600` : chaque visite est presque froide).
- Deux textures décodées vivantes au maximum — une peinture de 1536 × 2752 coûte **17 Mo**
  décodés, quelle que soit sa taille d'affichage.

## Ce qui ne se devine pas

Quatre mesures restent ouvertes (`docs/README.md#les-mesures-à-faire-avant-de-sengager`) :
plafond de longueur d'URL, survie de `localStorage`, bac de stockage du navigateur WhatsApp,
journal partagé ou non avec l'app installée. **Aucune ne se simule.** Si une tâche en dépend,
on fait tout le reste et on le dit.

## Où aller quand la fiche ne suffit pas

| Question | Le seul document à ouvrir |
|---|---|
| ce qui a changé depuis les maquettes | `docs/integration.md` |
| l'enchaînement d'un écran | `docs/parcours.md` |
| le geste, la cadence | `docs/fluidite.md` |
| ce qui se charge, et quand | `docs/chargement.md` |
| le format d'un lien, le journal | `docs/donnees.md` |
| ce qui a été tranché en construisant | `.claude/decisions.md` |
