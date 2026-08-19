# La fiche — tout ce qui se cite, sur une page

`docs/` fait foi. Cette fiche ne le remplace pas : elle **recopie les valeurs déjà tranchées**
pour qu'on n'ouvre pas quatre documents afin d'en citer une. Chaque bloc dit d'où il vient.
Quand la fiche ne répond pas, on ouvre le document nommé — et **seulement celui-là**.

Si une valeur d'ici contredit `docs/`, c'est `docs/` qui gagne et la fiche qui se corrige,
dans le même commit.

## Les cinq règles (design-system.md)

1. **Un pli = un écran.** Jamais de défilement dans un pli — **sauf le poème**, seul
   contenu long du produit, qui se lit d'un bout à l'autre (exception nommée, 19/08/2026).
2. **Le carmin est l'action.** Une seule couleur agit.
3. **La pliure est physique.** Elle suit le doigt, résiste dans le mauvais sens, retombe.
4. **Le papier découle du type**, jamais un choix offert au dépôt.
5. **Rien à signer.** Pas de compte, pas de notification, pas de brouillon nommé.

## Le lexique — fermé et normatif (design-system.md#ton-et-vocabulaire)

**On dit** — déplier · déposer · répondre · refermer · un pli · le volet · la pliure ·
l'atelier · nº 014 · « Un pli t'attend. » · « pour toi seule » · « déposé par a. »

**On ne dit pas** — ouvrir · envoyer un message · créer · valider · champ · formulaire ·
compte · notification · erreur · studio · créateur · carte · expiré.

**« ligne » a deux sens, et les deux sont bons** : *la ligne* de saisie de l'atelier, qui
remplace « champ » ; et *hors ligne*, l'écran du réseau coupé. Le second est un idiome, pas
un emploi du premier.

La règle vaut **aussi pour les noms du code**. Français, minuscules, tutoiement, phrases
courtes. Pas d'exclamation, pas d'emoji — seule exception nommée, le cœur du message WhatsApp
d'A3. Étiquettes en minuscules dans le code, capitales par `text-transform`.

`scripts/verifie.mjs` contrôle tout ce paragraphe. Ne pas le refaire à la main.

## Le gabarit (design-system.md#le-gabarit)

```
le cadre         remplit le viewport — 100 % × 100dvh, ni coin ni ombre
360 × 780        PROPORTION de référence : la composition s'y mesure, et .mini la montre
--marge  26px    seul retrait horizontal, PLUS l'encoche de l'appareil
--pliure 34%     hauteur du volet fermé, en bas
tête    padding 34px + encoche, 26px + encoche, 0
corps   flex:1, padding 0 26px 30px + encoche, contenu ALIGNÉ EN BAS
        trois exceptions : réparti (souvenir) · en haut et défilant (poème) · centré (C5)
volet   34 % de la hauteur, fond carmin
```

Le fond va jusqu'au bord, seul le texte se retire. Quatre jetons — `--encoche-haut`,
`--encoche-bas`, `--encoche-gauche`, `--encoche-droite` — et deux marges dérivées,
`--marge-gauche` et `--marge-droite`. Remis à zéro dans `.mini` : un aperçu montre le
gabarit, pas un appareil.

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

Sur A1 le titre est commun — « Un pli t'attend. » — et **la promesse suit le type** : celle
de l'invitation est en dur dans le document, les trois autres la remplacent au décodage.
Aucune ne chiffre quoi que ce soit. Les quatre phrases sont dans
[parcours.md](../docs/parcours.md#a1--lattente).

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

- **A1 en 5 requêtes** : le document, trois polices préchargées, une peinture.
- Vague 1 **≤ 14 ko gzip** — le build échoue au-delà. Mesuré le 19/08/2026 : **12,26 ko**,
  tout le lecteur dedans (5,86 au jalon 2, avant A2, le geste, la réponse et le journal).
- Les trois polices d'A1 : **52,6 ko** mesurés, cible 90.
- Un `#p=` lance son `fetch` **en toute première instruction**.
- Budgets comptés **en gzip** (Pages ne sert pas de brotli) et **cache vide**
  (`max-age=600` : chaque visite est presque froide).
- Deux textures décodées vivantes au maximum — une peinture de 1536 × 2752 coûte **17 Mo**
  décodés, quelle que soit sa taille d'affichage.

## Le journal et la réponse (donnees.md, parcours.md)

| Clé | Où | Quoi |
|---|---|---|
| `pli.v1.journal` | son téléphone | `{ h, c, deplieLe, reponse? }`, du plus récent au plus ancien |
| `pli.v1.reglages` · `pli.v1.compteur` · `pli.v1.deposes` · `pli.v1.seuil` | mon téléphone | le tiroir, et rien de commun avec son journal |

`h` est un **sha-256 tronqué à 8 octets** du payload — 16 signes hexadécimaux. Le
dédoublonnage se fait sur `h`, **jamais sur `n`**. Son journal passe par `journal.ts`, mon
tiroir par `tiroir.ts`, et rien d'autre ne touche le stockage.

Le seuil de l'atelier : les chiffres seuls dans l'ordre tapé, préfixés de `pli.seuil.`,
sha-256 **complet** en hexadécimal, comparé à la constante du bundle. La normalisation est
la seule tolérance offerte.

Les trois mots d'A3, et ce qui part dans la conversation :

| Elle lit | Noté | Le message |
|---|---|---|
| oui, j'y serai | `Oui` | `Oui, j'y serai ❤️` |
| peut-être | `Peut-être` | `Peut-être…` |
| je ne peux pas | `Non` | `Je ne peux pas` |

`https://wa.me/<w>?text=…`, et `whatsapp://send?text=…` sans `w`. L'ordre ne change pas :
**noter, afficher A4, puis ouvrir WhatsApp.** Le cœur est la seule exception à « pas
d'emoji », et A4 n'affirme rien : rien ne garantit qu'elle a appuyé sur envoyer.

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
