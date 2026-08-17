# Pli — système de design et spécification d'implémentation

Document de référence pour reconstruire Pli. Tout ce qui suit est normatif : les valeurs
sont celles du prototype, pas des suggestions.

**Pli** est un message qui arrive plié. On reçoit un lien, on trouve une feuille fermée,
on la tire du doigt, le message se découvre — et selon le type de pli, on répond d'un mot.
Pas de compte, pas de notification, une seule lecture.

---

## 1. Fichiers de ce dossier

```
PLI.md                          ce document
handoff/
  pli.css                       toutes les valeurs du système (tokens + classes)
  index.html                    planche de référence : encres, mains, gabarit, inventaire
  lecteur.html                  prototype A1 → A4, geste de dépliage réel
  createur.html                 prototype D1 → D3, dépôt en trois questions (mobile)
  createur-bureau.html          prototype E1 (1440 × 900)
  assets/drape-carmin-rose.webp la seule image du système
```

Les quatre HTML sont autonomes : aucun build, aucune dépendance npm, aucun framework.
Ouvrir `handoff/index.html` dans un navigateur suffit. Les polices viennent de Google Fonts
via `@import` dans `pli.css` — les remplacer par des fichiers locaux en production.

---

## 2. Les cinq règles

1. **Un pli = un écran.** Jamais de défilement à l'intérieur d'un pli, jamais un flux de six pages.
2. **Le carmin est l'action.** Une seule couleur agit ; tout le reste est papier et encre.
3. **La pliure est physique.** Elle suit le doigt, elle résiste dans le mauvais sens, elle retombe si on hésite.
4. **Quatre partitions, attachées au type.** Le papier change le fond et l'encre, jamais la
   composition — et il n'est pas un choix offert au créateur.
5. **Rien à signer.** Pas de compte, pas de notification, pas de brouillon nommé.

---

## 3. Encres et papiers

| jeton | valeur | emploi |
|---|---|---|
| `--creme` | `#F7F2E8` | le papier du pli |
| `--sable` | `#E9E2D2` | le plateau, hors du pli |
| `--sable-2` | `#E4DCC9` | plateau du bureau (E1) |
| `--encre` | `#14100E` | le noir du produit — jamais `#000` |
| `--carmin` | `#C81E33` | la seule couleur d'action |
| `--rose` | `#EFA9A0` | le carmin sur fond sombre uniquement |
| `--trait` | `rgba(20,16,14,.16)` | séparateur discret |
| `--carmin-pointille` | `rgba(200,30,51,.55)` | le trait d'action, 2px dashed |
| `--grain` | `repeating-linear-gradient(0deg, rgba(20,16,14,.022) 0 1px, transparent 1px 4px)` | grain du papier crème |

Aucune autre couleur n'entre dans le produit. Les images apportent leurs teintes mais sont
toujours recouvertes d'un dégradé qui les ramène au crème ou à l'encre.

**Trois papiers de pli, plus un :** crème (défaut), encre, carmin, drapé (l'image en fond +
voile encre). Sur encre et drapé, tout ce qui serait carmin devient rose. Sur carmin, tout
ce qui serait carmin devient crème.

---

## 4. Quatre mains

| rôle | police | réglages | emploi |
|---|---|---|---|
| marque | Pinyon Script | 52 / 44 / 38 px, `line-height:.86` | le mot « Pli », coin haut gauche. Rien d'autre. |
| titre | Bodoni Moda 800 | 78 / 64 / 56 / 52 px, caps, `-.035em`, `lh .9` (`.86` au-delà de 70px) | un seul par pli |
| titre de doc | Bodoni Moda 700 | 34 / 30 px, casse normale, `-.01em` | documentation seulement |
| voix | Newsreader italique 300 | 31 / 29 / 23 px, `lh 1.28–1.32`, `max-width: 15–18ch`, `text-wrap: pretty` | le texte écrit par la personne |
| interface | Space Mono 700 | 14 / 12,5 / 11,5 / 10,5 / 10 px, caps, `letter-spacing .24–.30em` | étiquettes, actions, états |
| griffe | Pinyon Script | 48 px, `rotate(-4deg)` | une ligne manuscrite par pli au maximum |

Écrire les étiquettes en minuscules dans le HTML et les mettre en capitales via
`text-transform: uppercase`. Le rendu garde son espacement, le code reste lisible.

---

## 5. Le gabarit du pli

```
360 × 780        taille de référence, jamais élargie (même sur 1440)
--marge: 26px    seul retrait horizontal existant dans un pli
--pliure: 34%    hauteur du volet fermé, en bas
--cachet: 38px   pastille du numéro, à cheval sur la pliure, centrée
--rayon: 36px    coin du pli (30px pour le pli d'écriture sur bureau, 26px pour l'aperçu)
--ombre: 0 18px 40px rgba(20,16,14,.18)
```

Quatre zones, du haut vers le bas :

1. **Tête** — `padding: 34px 26px 0`. Marque à gauche, type du pli à droite (étiquette carmin,
   `padding-top` de 16 à 18px pour aligner sur la ligne de base de la marque).
2. **Corps** — `flex:1`, `padding: 0 26px 30px`, contenu **aligné en bas** (`justify-content:flex-end`)
   ou réparti (`space-between`). On ne centre jamais verticalement.
3. **Pliure** — le trait d'action : `border-top: 2px dashed var(--carmin-pointille)`, l'étiquette
   à gauche, la flèche Bodoni `↑` à droite.
4. **Volet** — 34 % de la hauteur, fond carmin, étiquette « déplier » + `↑` à 50px du haut du volet.

**Images :** deux formats seulement — bandeau de 42 à 46 % de la hauteur, ou page entière.
Toujours un dégradé par-dessus (`.image__fondu` vers le crème, ou le voile encre pour les
fonds sombres). Le cadrage se règle par `object-position`, on ne recadre pas le fichier.

**Contenu d'un pli :** un titre, une voix, jusqu'à trois faits, une action. Au-delà, c'est
un autre type de pli.

---

## 6. Le mouvement

Une seule courbe dans tout le produit : `cubic-bezier(.32,.72,0,1)`.

| réglage | valeur | rôle |
|---|---|---|
| ouverture | `460 ms` | le pli part vers le haut |
| retour | `340 ms` | plus court : l'échec doit être rapide |
| seuil | `32 %` de la hauteur | course franchie = validé |
| élan | `0,55 px/ms` | le coup sec valide même à 10 % de course |
| caoutchouc | `0,1` | tirer dans le mauvais sens ne rend qu'un dixième |
| entrée | `9 %` | la page dessous monte de 9 % pour rejoindre sa place |

**Algorithme du dépliage** (implémenté dans `handoff/lecteur.html`, ~50 lignes) :

```
pointerdown   → mémoriser y0, p0 (0 fermé / 1 ouvert), couper toute transition
pointermove   → p = p0 + (y0 - y) / hauteur
                p < 0 → p *= 0.1      (caoutchouc bas)
                p > 1 → 1 + (p-1)*0.1 (caoutchouc haut)
                dessus.transform  = translate3d(0, -p*h, 0)
                dessous.transform = translate3d(0, (1-p)*0.09*h, 0)
                mesurer la vitesse v = dy/dt entre deux frames
pointerup     → valide = v > 0.55 ? false : (v < -0.55 || p > 0.32)
                appliquer la transition (460 / 340 ms) et poser p à 1 ou 0
```

Pendant le geste, **aucune transition n'est active** : la feuille est exactement à la
position du doigt. La courbe ne s'applique qu'au relâchement. C'est ce qui autorise
l'hésitation — s'arrêter, revenir, repartir.

Deux couches, un `translate3d` chacune. Pas de flou, pas d'ombre animée, rien à repeindre.
Le seul mouvement décoratif du produit est l'invite du volet : `translateY(-9px)` à 76 %
d'un cycle de 2,6 s, mise en pause dès que le doigt touche.

Alternatives explorées et écartées (garder au dossier, ne pas implémenter) : le volet en
trois bandes décalées, la ligne carmin qui révèle par `clip-path`, l'écartement en deux
moitiés. Toutes lisibles, mais elles montrent l'animation au lieu de rendre le pli
manipulable.

---

## 7. Les écrans

### Parcours du lecteur (arrive par lien)

| code | écran | papier | contenu |
|---|---|---|---|
| A1 | l'attente | crème + volet | nº, promesse (voix, max 14ch), « déposé par a. », volet « déplier ↑ ». Commune à tous les types. |
| A2 | la découverte | crème + image 46 % | titre 64px, griffe, trois faits (jour / heure / lieu), pliure « répondre ↑ » |
| A3 | la réponse | encre | trois mots au choix, une ligne facultative |
| A4 | le relais | carmin | le mot répondu en 78px, « écrire à ton tour ↑ » |

### Les autres types

| code | type | papier | particularité |
|---|---|---|---|
| B0a/b/c | attentes | crème + volet | même gabarit qu'A1, promesse adaptée au type |
| B1 | une pensée | image pleine | phrase au centre, **aucune pliure d'action** — rien à répondre |
| B2 → B3 | un poème | encre | entrée puis lecture, une strophe à la fois |
| B4 | un souvenir | image pleine | une image, une ligne, cadrage `50% 30%` |

### États

| code | état | papier | message |
|---|---|---|---|
| C1 | sans lien · l'historique | crème | « tes plis », sans compte, stockage local |
| C2 | déjà répondu | crème | rappel du mot envoyé |
| C3 | refermé · usage unique | encre | le pli ne se relit pas |
| C4 | lien mort | crème | expiré (30 jours) ou inconnu |
| C5 | le pli arrive | crème | chargement : marque qui respire, filet pointillé |

### Dépôt (créateur)

Trois écrans, trois questions. Le créateur ne compose pas une page : il choisit un type,
voit la mise en page qui vient avec, et remplit des textes nommés.

| code | écran | rôle |
|---|---|---|
| D1 | le type | quatre types en liste. Chacun porte son nom, une glose en une ligne, et **le layout vu en petit** (un pli 360 × 780 réduit à l'échelle .1722 par `transform`). Le type fixe la mise en page — plus rien à décider après. |
| D2 | les textes | la question (« Écris ton invitation. »), **le layout en petit en haut à droite** (échelle .2667) qui se remplit pendant la frappe, puis les lignes nommées : Le titre / Ton mot / Quand / Où / Signé. |
| D3 | le lien | carmin. « Nº 015 est prêt », `pli.re/015-vhtq`, envoyer ou copier. |
| E1 | ordinateur | 1440 × 900. Les mêmes trois questions tenant sur un écran : type + textes en colonne à gauche (320px), le pli fermé et le pli ouvert côte à côte au centre. |

**Ce que le créateur ne fait pas** — décisions retirées volontairement du produit :
pas d'image à déposer, pas de choix de style ou de partition, pas de police, pas de couleur,
pas de mise en page à composer, pas de brouillon à nommer, pas de compte.
Les quatre partitions de papier (§3) restent dans le système mais sont **attachées au type**,
pas exposées au créateur : invitation et souvenir sur crème, pensée et poème sur encre.

**Règles de dépôt :**
- **Une question par écran**, écrite en français dans la voix Bodoni (`.question`), avec une
  ligne d'aide en Newsreader (`.aide`) qui dit ce qui va se passer.
- **Le layout est montré, jamais manipulé.** Le pli miniature est un vrai pli réduit par
  `transform: scale()` — jamais un dessin séparé à maintenir, et `pointer-events: none`.
- **Des lignes nommées, pas un pli à deviner.** Chaque champ porte son nom en Space Mono 10px
  et le mot « facultatif » quand il l'est. Le champ actif se teinte de carmin à 5 %.
- **Les champs suivent le type.** « Quand » et « Où » n'existent que pour l'invitation
  (`[data-si="invitation"]`).
- **Une seule action, pleine largeur, en bas** (`.bouton`), désactivée tant que le texte
  principal est vide. Le retour est en haut à gauche, l'étape écrite « 2 sur 3 ».
- **Rien n'est envoyé avant D3.** Le libellé le dit : « rien n'est envoyé pour l'instant ».

## 8. Ton et vocabulaire

**On dit :** déplier · déposer · répondre · refermer · un pli · le volet · la pliure · nº 014 ·
« Un pli t'attend. » · « pour toi seule » · « déposé par a. »

**On ne dit pas :** ouvrir · envoyer un message · créer · valider · champ · formulaire ·
compte · notification.

Français, minuscules, pas d'exclamation, pas d'emoji, pas de majuscule d'insistance.
Les phrases du produit sont courtes et parlent à une personne, au tutoiement.

---

## 9. Modèle de données (minimum viable)

```ts
type Pli = {
  numero: number;              // affiché « nº 015 », séquentiel par expéditeur
  jeton: string;               // 4 signes, dans l'URL : pli.re/015-vhtq
  type: 'invitation' | 'pensee' | 'poeme' | 'souvenir';
  // le papier n'est pas un choix du créateur : il découle du type
  // invitation, souvenir → creme · pensee, poeme → encre
  titre: string;               // ~22 signes, deux lignes maximum
  voix: string;                // le texte, 15–18ch par ligne à l'affichage
  faits?: string[];            // jusqu'à 3 : jour, heure, lieu
  signature: string;           // « a. »
  lectures: 1 | null;          // 1 = usage unique
  expire: string;              // ISO, 30 jours par défaut
  reponse?: { mot: string; ligne?: string; le: string };
};
```

Pas de compte : l'historique du créateur (C1) vit en `localStorage`, la clé du pli est dans
le lien. Le serveur ne stocke que le pli et sa réponse.

---

## 10. Notes d'implémentation

- **Vanilla d'abord.** Les prototypes n'utilisent aucun framework et c'est suffisant :
  quatre écrans de lecture, un geste, trois écrans de dépôt. Si le projet passe à React ou Svelte,
  garder `pli.css` tel quel et n'y toucher que pour ajouter des classes.
- **Le geste doit tourner à 60 fps sur téléphone d'entrée de gamme.** `touch-action:none`
  sur le cadre, `will-change: transform` sur les deux couches, `translate3d` et rien d'autre.
- **Pas d'icônes, pas de SVG.** Les flèches sont des caractères (`↑` `→`) rendus en Bodoni.
  Le seul symbole du produit est le cachet numéroté.
- **Accessibilité :** le dépliage doit avoir une alternative au clavier et au clic simple
  (un `<button>` « déplier » qui pose directement `p = 1`), et
  `@media (prefers-reduced-motion: reduce)` doit supprimer l'invite du volet et raccourcir
  l'ouverture à 120 ms. **À faire — absent des prototypes.**
- **Polices :** 4 familles, ~7 graisses. Les charger en local et sous-ensembler (latin +
  ponctuation française) ; Bodoni Moda est une variable font, en prendre l'axe `opsz`.

---

## 11. Reste à trancher

1. **Modifier un pli après dépôt** tant qu'il n'a pas été ouvert ? Techniquement simple,
   mais ça affaiblit le « il ne se lira qu'une fois ».
2. **Le relais (A4).** Répondre invite à écrire à son tour — jusqu'où ? Un pli de réponse
   complet, ou seulement un mot ?
3. **Le poème (B3)** est le seul contenu qui peut dépasser un écran. Défiler, ou paginer
   strophe par strophe avec le même geste que le dépliage ?
4. **Les faits** sont du texte libre (« samedi 22 août · 20h00 »). Un vrai sélecteur de date
   serait plus sûr mais ajoute un contrôle là où il n'y a aujourd'hui qu'une ligne à écrire.
5. **Les images.** Retirées du dépôt pour tenir en trois écrans. Si elles reviennent, ce doit
   être comme conséquence du type (« un souvenir » demande une photo), jamais comme un
   emplacement vide à remplir dans tous les plis.
