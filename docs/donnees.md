# Données

Trois jeux de données, trois endroits, aucun serveur.

| Donnée | Où | Qui l'écrit |
|---|---|---|
| La carte | dans l'URL | le studio, à l'envoi |
| Le journal | `localStorage` de son téléphone | l'app, à l'ouverture d'une carte |
| Le carnet d'idées | `data/*.json` du dépôt | moi, à la main |

## 1. La carte

Objet JSON à clés courtes, pour tenir dans une URL.

```json
{
  "v": 1,
  "t": "inv",
  "n": 14,
  "b": "Samedi, tu es invitée.",
  "d": "2026-08-22T20:00",
  "l": "Le Petit Comptoir",
  "h": "Mets la robe verte",
  "s": "2026-08-20T18:00",
  "w": "336XXXXXXXX"
}
```

| Clé | Type | Sur | Rôle |
|---|---|---|---|
| `v` | int | tous | Version du schéma. Permet de faire évoluer sans casser les vieux liens. |
| `t` | `inv` \| `mot` \| `cpn` | tous | Type de carte. |
| `n` | int | tous | Numéro de la carte. Sert à l'affichage (« N° 014 ») et à dédoublonner dans le journal. |
| `b` | string | tous | Le texte. C'est le cœur. |
| `d` | ISO court | `inv` | Date et heure de la sortie. |
| `l` | string | `inv` | Lieu. |
| `h` | string | `inv` | Note libre : code vestimentaire, indice, consigne. |
| `e` | ISO court | `cpn` | Date de péremption du coupon. Optionnel. |
| `s` | ISO court | tous | Scellé jusqu'à cette date. Optionnel. |
| `w` | string | tous | Numéro WhatsApp de réponse, format E.164 sans `+`. Optionnel. |

Les clés absentes sont omises, jamais mises à `null`.

## 2. L'encodage dans le lien

```
https://leo-bernard38.github.io/Pli/#c=<marqueur><base64url>
```

1. `JSON.stringify` sans espaces
2. compression `deflate-raw` via `CompressionStream` (natif, zéro dépendance)
3. encodage base64url (`+/` → `-_`, sans `=`)
4. préfixe d'un caractère : version de l'encodage, `2` aujourd'hui

`CompressionStream` est disponible sur nos deux appareils (voir
[architecture.md](architecture.md)), donc pas de chemin sans compression. Le préfixe
ne sert qu'à pouvoir changer d'encodage un jour sans casser les liens déjà envoyés.

**Ordre de grandeur** : une invitation typique fait ~180 octets de JSON, ~150 après
compression, ~200 caractères de lien. Un mot d'amour long (1 500 caractères) reste
sous 900 caractères de lien. La limite pratique est ~2 000 caractères, donc large.

**Ce que ça implique** : le contenu n'est pas secret, juste illisible à l'œil et absent
de tout serveur et de tout index. Suffisant ici, à ne pas confondre avec du chiffrement.

## 3. Le journal (`localStorage`)

`localStorage` suffit : quelques kilo-octets de texte. IndexedDB serait surdimensionné.

| Clé | Contenu |
|---|---|
| `pli.v1.journal` | tableau d'entrées, triées par date d'ouverture décroissante |
| `pli.v1.seuil` | `true` une fois le mot secret saisi |

Entrée du journal :

```json
{ "c": "<payload brut du lien>", "ouvertLe": "2026-08-17T21:04", "utiliseLe": null }
```

On stocke le payload, pas la carte décodée : une seule source de vérité, et on rejoue
le décodage à l'affichage. `utiliseLe` ne sert qu'aux coupons.

Dédoublonnage sur `n`. Réouvrir une carte ne crée pas de doublon.

## 4. Le carnet d'idées (`data/*.json`)

Mon outil à moi, chargé uniquement par le studio. Ne part jamais dans un lien.

```
data/
  lieux.json      restos, bars, balades — nom, ville, note perso
  sorties.json    idées d'activités, avec saison ou météo
  phrases.json    formulations déjà écrites, par type de carte
  coupons.json    coupons récurrents
```

Format volontairement plat, pour être éditable au pouce depuis l'app GitHub :

```json
[
  { "nom": "Le Petit Comptoir", "ville": "Grenoble", "note": "terrasse, réserver" }
]
```

## 5. La réponse WhatsApp

```
https://wa.me/<w>?text=<message url-encodé>
```

Le message est pré-écrit par type : « Oui, je viens ❤️ », « J'ai lu ❤️ »,
« J'utilise mon coupon : … ».

Si `w` est absent, le bouton bascule sur `whatsapp://send?text=…`, qui ouvre le
sélecteur de contact — un tap de plus.
