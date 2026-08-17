# assets/

Cinq peintures à l'huile, abstraites, carmin et rose. Même famille, même main, aucune
figuration. C'est tout le vocabulaire visuel du produit — il n'y a pas d'autre image.

Les fichiers ici sont les **originaux**, en pleine définition. Ils ne partent pas tels
quels dans le build : voir *Le poids* plus bas.

## Ce que chacune fait

| Fichier | Matière | Emploi |
|---|---|---|
| `drape-carmin-rose.webp` | drapé de soie, carmin et rose, plis profonds | **invitation** — bandeau A2 |
| `remous-encre-carmin.webp` | remous sombres, noir · carmin · rose | **pensée** — page entière sur encre |
| `voile-rose-touche.webp` | voile rose pâle, une seule touche rouge | **souvenir** — page entière sur crème |
| `rideau-carmin-nuit.webp` | rideau vertical, rayé, nuit | **les états fermés** — A1, C3 |
| `papier-froisse-creme.webp` | papier froissé, crème et carmin, empâtement | **la marque** — aperçu OG, C1 vide, écran d'installation |
| — | — | **poème** : aucune image, c'est voulu |

Les trois premières lignes closent la question laissée ouverte : chaque type a sa texture,
aucune n'est partagée.

### Pourquoi ce partage

**Le remous va à la pensée** parce que la pensée se lit sur papier encre. Une image déjà
sombre s'y pose sans être écrasée par `.image__fondu--encre` ; une image pâle aurait
demandé de la noyer, et on aurait payé 80 ko pour un gris.

**Le voile va au souvenir** pour la raison inverse : papier crème, image pleine, et une
seule touche rouge dans le champ libre entre le titre et la ligne du bas. C'est la plus
tendre des cinq — c'est l'image qui accepte qu'on la regarde longtemps.

**Le rideau ferme.** Vertical, régulier, sombre : il tient derrière la feuille close en A1
sans rien annoncer du contenu, et il redevient le fond de C3 quand le pli s'est refermé.
Il n'entre jamais dans un pli déplié.

**Le papier froissé ne sert aucun type**, et c'est délibéré. C'est littéralement un pli :
il parle du produit, pas d'un message. Sa place est là où le produit se présente —
l'aperçu WhatsApp avant l'ouverture, le journal vide, l'invitation à installer.

Réserve honnête : c'est celle des cinq que je couperais en premier. Si l'animation de
dépliage rend bien, une image de papier froissé à côté d'elle devient une redite. À
trancher en voyant les deux ensemble, pas avant.

## Les cadrages

L'image ne se recadre jamais dans le fichier : on déplace `object-position`.

| Écran | Fichier | `object-position` |
|---|---|---|
| A2 · la découverte (bandeau 46 %) | drapé | `50% 46%` |
| B1 · une pensée (page entière) | remous | `50% 70%` |
| B4 · un souvenir (page entière) | voile | `50% 50%` |
| A1 · l'attente | rideau | `50% 30%` |
| C3 · refermé | rideau | `50% 30%` |
| aperçu OG (1200 × 630) | papier froissé | `50% 25%` |

Les valeurs `50% 76%` et `50% 30%` que portent les prototypes pour B1 et B4 datent de
l'époque où le drapé servait aux trois — elles ne valent plus, chaque texture a la sienne.

## Le poids

Les originaux font 1536 × 2752 et pèsent entre 600 ko et 1,2 Mo. **Aucun ne peut partir
tel quel** : A1 doit être lisible en moins d'une seconde en 4G.

À produire au jalon 1, à côté des originaux, sans les remplacer :

- **720 × 1560** (le double du gabarit 360 × 780), webp qualité ~72
- **cible : 70 ko par image**, et un pli n'en charge jamais qu'une
- le rideau supporte plus de compression que les autres — il est presque uniforme
- l'aperçu OG est le seul format à part : **1200 × 630**, recadré depuis le papier froissé

Les originaux restent au dépôt : ils sont la source, et un recadrage se refait.
