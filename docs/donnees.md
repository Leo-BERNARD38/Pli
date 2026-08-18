# Données

Quatre jeux de données, quatre endroits, aucun serveur. Les sections 5 et 6 décrivent
les deux mécanismes qui s'appuient dessus.

| Donnée | Où | Qui l'écrit |
|---|---|---|
| Un pli court | dans l'URL | l'atelier, à l'envoi |
| Un poème | `public/plis/*.txt`, encodé | la moulinette, avant commit |
| Son journal | `localStorage` de son téléphone | l'app, au dépliage |
| Mon historique | `localStorage` de mon téléphone | l'atelier, au dépôt |

Les deux journaux ne se parlent jamais.

## 1. Le pli

Un seul objet pour les quatre types, à clés courtes pour tenir dans une URL.

```json
{
  "v": 1,
  "t": "inv",
  "n": 14,
  "ti": "Tu es invitée",
  "b": "Mets la robe verte, celle du printemps.",
  "f": ["samedi 22 août · 20h00", "Le Petit Comptoir"],
  "g": "rien qu'à toi",
  "s": "a.",
  "w": "336XXXXXXXX"
}
```

| Clé | Type | Sur | Rôle |
|---|---|---|---|
| `v` | int | tous | Version du schéma. Permet de faire évoluer sans casser les vieux liens. |
| `t` | `inv` \| `pen` \| `poe` \| `sou` | tous | Type de pli. Il détermine le papier, la composition et la présence d'une action. |
| `n` | int | tous | Numéro, affiché sur le cachet — **le nombre seul, sur trois chiffres** : « nº 014 » ne tient pas dans une pastille de 38px composée à 10px. « nº 014 » reste la forme de la prose. **Affichage seulement.** |
| `ti` | string | tous | Le titre. ~22 signes, deux lignes au maximum. |
| `b` | string | tous | Le texte — la voix. Pour un poème, un tableau de strophes. |
| `f` | string[] | `inv` | Jusqu'à trois faits : quand, où. Texte libre. |
| `g` | string | tous | La griffe, la ligne manuscrite. Une par pli au maximum. Optionnel. |
| `s` | string | tous | La signature. « a. » |
| `w` | string | `inv` | Numéro WhatsApp de réponse, E.164 sans `+`. |

Les clés absentes sont omises, jamais mises à `null`.

### Ce que le papier peut porter — mesuré, pas estimé

Le gabarit fait 360 × 780, et **le corps est ce qui reste** entre la tête et la pliure. Les
clés s'y disputent la même place : un titre long vole ses lignes à la voix. Mesuré le
18/08/2026 dans Chromium, un vrai pli déplié, chaque clé poussée par dichotomie pendant que
les autres tiennent l'exemple ci-dessus.

| Type | `ti` | `b` | `f` |
|---|---|---|---|
| invitation | **16** | **46** | trois faits d'une ligne |
| pensée | — (elle n'en montre pas) | **256** | — |
| souvenir | **70** | **312** | — |
| poème | **88** | **358** par strophe | — |

**L'invitation est le cas serré**, et c'est le seul : elle empile un titre à 64px, une
griffe, une voix, jusqu'à trois faits et une action. Mesuré, elle porte **trois de ces
quatre-là, pas les quatre** :

| Composition | |
|---|---|
| titre 13 · voix · 2 faits · griffe | tient |
| titre 13 · voix · 3 faits · **sans griffe** | tient |
| titre 13 · **sans voix** · 3 faits · griffe | tient |
| titre 13 · voix · **3 faits** · griffe | déborde de 4px |
| **titre 22** · voix · 2 faits · griffe | déborde de **92px** |

Le titre est le levier : à 64px, 22 signes font une troisième ligne de capitales et coûtent
92px d'un coup, là où le paragraphe ci-dessus n'en veut que deux. D'où **16** — et « Tu es
invitée » en fait 13.

Ces plafonds sont ceux du **dépôt** : c'est l'atelier qui les tiendra, au jalon 4. Le lecteur,
lui, ne fait plus confiance à personne — le corps coupe chez lui plutôt que de recouvrir la
marque ([integration.md](integration.md)).

**À ne pas confondre avec la longueur du lien**, qui est une des quatre mesures ouvertes et
se fait sur les deux téléphones : l'une est la place sur le papier, l'autre le nombre de
caractères qu'une conversation transporte.


`w` voyage dans le lien et **jamais dans le dépôt** : un numéro de téléphone en clair dans
un dépôt public se fait moissonner. C'est aussi pourquoi seule l'invitation le porte —
les trois autres types n'appellent pas de réponse.

## 2. L'encodage

Un seul codec dans tout le produit, pour les deux transports.

```
JSON.stringify sans espaces
  → deflate-raw via CompressionStream
  → base64url (+/ → -_, sans =)
  → préfixe d'un caractère : version de l'encodage, « 2 » aujourd'hui
```

Le préfixe permet de changer d'encodage un jour sans casser les liens déjà envoyés.

**Le codec doit tourner sous Node comme dans le navigateur.** `CompressionStream`,
`TextEncoder` et `btoa` existent des deux côtés depuis Node 18 — donc aucune API du DOM
dans `codec.ts`, sous peine de se retrouver avec deux encodages qui divergent.

**Pas de chiffrement.** La compression rend déjà le payload illisible ; AES ajouterait
28 octets, un second chemin de code, et rien de plus contre un regard distrait — la clé
serait dans le bundle de toute façon.

### Longueur

Compter **0,6 à 0,8 caractère de lien par caractère de texte** : deflate est mauvais sur
les textes courts et bon sur les longs, base64 rajoute un tiers.

| Texte | Lien |
|---|---|
| une invitation (~180 signes) | ~200 caractères |
| un mot de 500 signes | ~400 |
| 1 000 signes | ~700 |
| 3 000 signes | ~1 900 |

Le plafond de l'atelier se fixe **par la mesure**, pas par estimation — le protocole est
dans [architecture.md](architecture.md#la-longueur-du-lien). C'est aussi ce qui justifie
que le poème ne passe pas par le lien.

## 3. Le poème

Le seul contenu long, et le seul qui n'est pas porté par son lien.

```
plis-source/015.md         en clair, chez moi, gitignoré
        ↓ plier.bat / plier.sh
public/plis/015-vhtq.txt   le poème encodé
public/plis/index          la liste, encodée
        ↓ git push
```

### La source

```markdown
---
n: 15
type: poeme
titre: Nuit de juin
signe: a.
---

première strophe, ligne une
première strophe, ligne deux

seconde strophe...
```

**La ligne vide est la page.** La convention markdown du paragraphe devient la règle de
pagination : une strophe, un écran, dans l'ordre du fichier. Aucune syntaxe à apprendre.

### La moulinette

Elle lit le front-matter et le corps, construit **le même objet JSON qu'un pli de lien**
(`b` devenant le tableau des strophes), l'encode avec le même codec, écrit le `.txt`,
met l'index à jour et imprime le lien fini :

```
nº 015 → https://leo-bernard38.github.io/Pli/#p=015-vhtq
```

Je ne nomme que le numéro. **Le jeton de quatre signes est ajouté par la moulinette** dans
le nom de sortie : sans lui, `#p=015` invite à essayer `014`. Je ne le tape jamais.

Deux invariants, parce qu'ils protègent des liens déjà envoyés :

- **Le jeton d'un numéro déjà connu est réutilisé.** Relancer la moulinette sur un poème
  corrigé ne change pas son lien.
- **Elle ne supprime jamais rien.** Retirer un poème est un geste manuel et délibéré.

### L'index

`public/plis/index`, encodé lui aussi — rien à lire dans le dépôt, pas même une table des
matières. Chargé **uniquement par l'atelier**, jamais par elle.

```json
[{ "n": 15, "j": "vhtq", "ti": "Nuit de juin" }]
```

Il sert à deux choses : peupler l'écran D2p, et caler mon compteur de numéros sur le
maximum réel — sinon un poème écrit hors atelier consommerait un numéro que le compteur
ignore, et deux plis finiraient par porter le nº 015.

### Ce que ça coûte

`plis-source/` est en `.gitignore`, avec un garde-fou avant commit : **l'historique git
est définitif**, un poème commité en clair une seule fois y reste pour toujours. Le dossier
doit être sauvegardé ailleurs que sur la machine — les poèmes se redécodent, mais il
faudrait passer par le décodeur pour les relire.

## 4. Son journal

`localStorage` suffit : quelques kilo-octets de texte. IndexedDB ne se justifierait qu'au-delà
de quelques centaines de plis, ou si on y stockait des images — ni l'un ni l'autre à l'horizon,
et **ça ne changerait rien au risque d'effacement** décrit dans
[architecture.md](architecture.md#le-journal-peut-être-effacé).

| Clé | Contenu |
|---|---|
| `pli.v1.journal` | tableau d'entrées, triées par date de dépliage décroissante |
| `pli.v1.recharge` | en `sessionStorage` : le drapeau du rechargement de secours, posé une fois et une seule ([mises-a-jour.md](mises-a-jour.md#2-un-rechargement-de-secours-une-seule-fois)) |

```json
{
  "h": "<empreinte du payload>",
  "c": "<payload>",
  "deplieLe": "2026-08-17T21:04",
  "reponse": { "mot": "Oui", "ligne": null, "le": "2026-08-17T21:05" }
}
```

On stocke le payload, pas l'objet décodé : une seule source de vérité, et on rejoue le
décodage à l'affichage. Pour un poème, le contenu récupéré est **recopié dans l'entrée à la
première ouverture** — sans ça, un fichier supprimé ferait disparaître un pli de son
archive, et la relecture hors ligne serait impossible.

**Le dédoublonnage se fait sur `h`, l'empreinte du payload — jamais sur `n`.** Deux plis
qui partageraient un numéro verraient sinon le second silencieusement absorbé par le
premier : un pli reçu, jamais archivé, sans erreur ni trace.

La présence de `deplieLe` est ce qui déclenche C3 sur un lien rouvert.

## 5. Mon historique

| Clé | Contenu |
|---|---|
| `pli.v1.seuil` | `true` une fois la date d'officialisation saisie |
| `pli.v1.reglages` | le tiroir : numéro de réponse `w`, signature `s`, rien d'autre |
| `pli.v1.compteur` | dernier numéro attribué |
| `pli.v1.deposes` | les plis déposés, pour relire et renvoyer |

```json
{ "w": "336XXXXXXXX", "s": "a." }
```

Sur mon téléphone uniquement. Il n'a rien à voir avec son journal et ne se synchronise pas.

**Le numéro de réponse ne connaît que deux endroits** : ce tiroir, et le lien d'une
invitation déjà envoyée. Jamais le dépôt, jamais un fichier de configuration, jamais une
variable de build — tout ce qui est buildé est public
([hebergement.md](hebergement.md#ce-que-pages-ne-donne-pas)). Il se saisit dans **D4 · le
tiroir** ([parcours.md](parcours.md#d4--le-tiroir)).

## 6. La réponse WhatsApp

```
https://wa.me/<w>?text=<message url-encodé>
```

Le message est pré-écrit selon le mot choisi : « Oui, j'y serai ❤️ », « Peut-être… »,
« Je ne peux pas ». Si `w` est absent, on bascule sur `whatsapp://send?text=…`, qui ouvre
le sélecteur de contact — un tap de plus.

L'ordre compte : **noter la réponse dans le journal, afficher A4, puis ouvrir WhatsApp.**
WhatsApp quitte la page, et A4 doit être là au retour. Rien ne garantit qu'elle a appuyé
sur envoyer — l'écran affiche son mot et n'affirme rien de plus.
