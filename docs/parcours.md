# Parcours

Les codes d'écran (A1, C3, D2…) sont ceux de l'inventaire du design —
[design/handoff/index.html](../design/handoff/index.html). Ce document dit ce qu'ils
enchaînent, ce qui les déclenche, et ce qui se range où.

---

# 1. Elle — `leo-bernard38.github.io/Pli/`

```
             lien reçu par WhatsApp
                      │
                      ▼
              décoder le payload ──── échec ──▶ C4  lien abîmé
                      │
              (poème) fetch ──────── échec ──▶ C4
                 │ C5 le pli arrive
                      ▼
              déjà déplié ? ──── oui ──▶ C3  refermé ──▶ le journal
                      │ non
                      ▼
                 A1  l'attente
                      │  ⟵ le geste : glisser vers le haut
                      ▼
              ✎ écrire au journal
                      │
                      ▼
                 A2  la découverte        (selon le type)
                      │
          invitation  │  pensée · poème · souvenir
                      │                   └──▶ fin — la marque mène au journal
                      ▼
                 A3  la réponse
                      │  un mot choisi
                      ▼
              ✎ noter la réponse   ──▶ ouvrir WhatsApp pré-rempli
                      │
                      ▼
                 A4  le mot          ──▶ « tes plis ↑ »
```

## L'arrivée

À l'ouverture du lien, dans cet ordre :

1. **Décoder.** `#c=` se décode sur place. `#p=` demande un `fetch` — c'est le seul cas
   où **C5** s'affiche, et le seul qui exige le réseau. Un décodage qui échoue, ou un
   fichier introuvable, donnent **C4** ; un réseau coupé donne l'écran **hors ligne**, qui
   propose « réessayer ».
2. **Chercher dans le journal**, sur l'empreinte du payload — jamais sur le numéro
   (voir [donnees.md](donnees.md#4-son-journal)). Trouvé et déjà déplié → **C3**.
3. Sinon → **A1**.

**Rien n'est consommé à l'arrivée.** L'entrée du journal ne s'écrit qu'au dépliage validé.
Si elle ferme l'onglet sur A1, le pli l'attend toujours. C'est elle qui ouvre, pas le lien
qui s'ouvre.

## A1 · l'attente

Commune aux quatre types ; seule la promesse change. Numéro, promesse en voix,
« déposé par a. », et le volet carmin qui invite.

**Le fond est le papier crème, et A1 ne porte aucune image** — c'est ce que la maquette
montre, et c'est la raison d'être de cet écran : il doit se peindre avant tout le reste. Le
rideau y a vécu du jalon 2 au 19/08/2026 ; il coûtait 614 ko préchargés en même temps que
les trois polices que le texte, lui, attend vraiment
([.claude/decisions.md](../.claude/decisions.md),
[chargement.md](chargement.md#vague-2--ce-qui-est-préchargé-et-rien-dautre)). Les peintures
commencent à A2, quand le pli est ouvert.

Le titre est commun — **« Un pli t'attend. »** — et la promesse suit le type. La phrase de
la maquette, « Il ne se lira qu'une fois », devient fausse dès que le journal existe :

| Type | La promesse |
|---|---|
| invitation | Il ne s'ouvre qu'une fois. Ensuite il reste dans tes plis. |
| pensée | Rien à répondre. Tu peux la lire debout. |
| poème | Prends le temps. Il n'y a rien à répondre. |
| souvenir | Une image, une ligne. Tu sauras tout de suite quel jour c'était. |

Elles viennent des écrans d'attente du design — A1 et B0a-c — débarrassées de ce qu'elles
comptaient : une maquette sait qu'il y a quatre strophes, un gabarit ne le sait pas. **Aucune
ne chiffre**, et la pensée pas davantage que les autres : son plafond est en signes, pas en
lignes ([donnees.md](donnees.md#ce-que-le-papier-peut-porter--mesuré-pas-estimé)), et « deux lignes au plus »
en laisse parfois une seule. Une
promesse dit ce qui attend et ce qu'on attend d'elle, **jamais ce que le pli contient** — le
rideau ne dit rien du contenu, elle non plus.

Celle de l'invitation est **écrite en dur dans le document** : c'est elle qui se peint avant
le décodage, et les trois autres la remplacent quand le lien a livré son type, dans la même
frame que le numéro et la signature. Ce que le document pèse est mesuré à chaque build, et
le build échoue au-dessus du plafond ([chargement.md](chargement.md#le-budget-écran-par-écran)).

## Le dépliage

Le geste, ses réglages et son algorithme sont dans
[design-system.md](design-system.md#le-mouvement). Ce qui relève du parcours :

- **Franchir le seuil écrit l'entrée au journal.** Un seul point d'écriture, un seul moment.
- L'échec du dépliage ne fait rien : la feuille retombe, le pli reste intact.
- **Une alternative existe toujours.** Un `<button>` « déplier » atteignable au clavier pose
  `p = 1` directement. Le geste est le chemin, jamais le seul chemin.

## A2 · la découverte

La composition suit le type — le papier, l'image et la présence d'une action en découlent.

| Type | Composition | Action en bas |
|---|---|---|
| invitation | titre 64px, griffe, jusqu'à 3 faits | « répondre ↑ » |
| pensée | une phrase, deux lignes au plus, image pleine | aucune |
| poème | le texte entier, encre, sans image — il défile | aucune |
| souvenir | titre haut, une ligne en bas, image pleine | aucune |

**Le poème défile, et il est le seul.** C'est l'exception nommée à la première des cinq
règles (design-system.md#les-cinq-règles) : un poème est le seul contenu long du produit, il
se lit d'un bout à l'autre, dans l'ordre du fichier. Les strophes se suivent, séparées par un
blanc — la ligne vide de la source. Il n'y a ni pagination, ni « la suite ↑ », ni second
geste : le dépliage ouvre le pli, et ensuite c'est le pouce qui lit.

Le geste rend donc le doigt au corps une fois le poème ouvert, et on ne referme pas un poème
en tirant. Comme pour la pensée et le souvenir, la marque mène au journal.

Pour les trois types sans action, le parcours s'arrête là : le pli est lu, il est archivé,
et **la marque « Pli » en haut à gauche mène au journal**. C'est le geste discret que le
brief demandait — elle est déjà dans le gabarit, elle ne coûte rien.

## A3 · la réponse — invitation seulement

Trois mots, un seul tap : *oui, j'y serai* · *peut-être* · *je ne peux pas*.

**La ligne libre se tape dans WhatsApp**, pas ici — l'écran le dit (« un seul mot suffit ·
tu pourras ajouter une ligne juste après ») et le message part avec son curseur au bout. Le
produit n'a pas de ligne de saisie sur A3, et n'en aura pas : ce serait un second choix sur
un écran qui n'en veut qu'un, et une chose de plus à écrire avant de répondre. Le champ
`ligne` du journal existe donc, et **vaut toujours `null`** — voir
[donnees.md](donnees.md#4-son-journal).

Au tap, dans cet ordre :

1. La réponse est notée dans son journal.
2. **A4 s'affiche.**
3. WhatsApp s'ouvre, message déjà écrit — `wa.me/<w>?text=…`, le numéro venant du payload.

L'ordre compte : WhatsApp quitte la page, et A4 doit être là au retour.

## A4 · le mot

Le mot choisi en 78px, sur carmin. Deux corrections à la maquette :

- **La phrase « C'est parti chez a. » est fausse** et doit disparaître : rien ne garantit
  qu'elle a appuyé sur envoyer dans WhatsApp. On affiche son mot, on n'affirme rien.
- **« écrire à ton tour ↑ » devient « tes plis ↑ ».** Elle n'a pas d'atelier ; le relais
  n'existe pas dans un produit à deux. La composition ne change pas, la destination si.

## Le journal — `leo-bernard38.github.io/Pli/#/`

La racine mène au journal. Vide au départ : tant qu'elle n'a rien reçu, il n'y a rien —
et cet écran vide porte le papier froissé, la seule fois où le produit se montre lui-même.

Aucun mot secret, aucun seuil. Il se lit comme un sommaire de revue, pas comme un fil.
Depuis une entrée, elle relit le pli entier — et c'est le seul chemin vers **C2**, le rappel
d'une invitation à laquelle elle a déjà répondu.

## Les états

| Code | Quand | Papier |
|---|---|---|
| **C1** | le journal, y compris vide | crème |
| **C2** | relecture d'une invitation déjà répondue — depuis le journal, ou au retour de WhatsApp | crème |
| **C3** | lien déjà déplié — mène au journal | encre |
| **C4** | payload illisible, ou fichier de poème **introuvable** | crème |
| **hors ligne** | le réseau a lâché — **poème uniquement** | crème |
| **C5** | attente du fichier — **poème uniquement** | crème |

**Hors ligne n'est pas introuvable.** C4 confondait les deux, et ce sont deux choses
opposées : un fichier absent est définitif, un réseau coupé passe. Le second porte donc son
propre écran et une action, « réessayer » — dire « lien abîmé » à quelqu'un dont le pli
l'attend serait un mensonge. La distinction se fait sur ce que le `fetch` a fait : seul
celui qui **lève** est un réseau coupé ; une réponse qui arrive et dit non — 404 — est un
fichier qu'on n'a pas, et le réseau a marché.

**C2 est un rappel, pas le pli.** Sa maquette (`design/canevas/`) en fait un écran de
synthèse, et c'est ce qu'on suit : ce qu'elle a répondu, quand, la griffe, et les faits —
le jour, l'heure, le lieu. Le pli entier est à un tap, sous « relire le pli », et c'est là
seulement que le mot remplace « répondre » : on ne répond pas deux fois. Trois écarts à cette
maquette :

- elle écrit « réponse envoyée le … ». **On n'affirme pas** : rien ne garantit qu'elle a
  appuyé sur envoyer, c'est la correction d'A4. Le journal sait quand elle a répondu, pas ce
  que WhatsApp en a fait ;
- elle porte deux actions. Une seule par écran — la marque mène déjà au journal ;
- sa phrase « Le pli reste lisible. Onze jours. » promet une durée que **la mesure 2** n'a pas
  rendue. Elle n'est pas reprise.

**C4 n'est plus « lien mort ».** Il n'y a plus d'expiration ; le cas réel est le lien
tronqué par l'application de messagerie. Le message le dit et propose de me le redemander.

---

# 2. Moi — `leo-bernard38.github.io/Pli/atelier/`

```
        D0  le seuil  ──▶  D4  le tiroir  ──▶  D1  le type  ──┬──▶  D2   les textes  ──▶  D3  le lien
        (une seule fois)   (au premier passage,               └──▶  D2p  quel poème   ──▶  D3  le lien
                            puis à la demande)
```

Trois questions, une par écran, comme le design l'impose. Le retour est en haut à gauche,
l'étape est écrite « 2 sur 3 », l'action unique est en bas.

## D0 · le seuil

Une seule fois, puis mémorisé. Une question, une ligne, dans la voix du produit :

> **Depuis quand ?**
> `jj/mm/aaaa`

Faux → la ligne se vide, sans rien reprocher. Le lexique interdit « valider », « erreur »
et « formulaire ». Le contrôle compare une empreinte, jamais la date en clair
(voir [architecture.md](architecture.md#le-seuil-de-latelier)).

## D4 · le tiroir

Ce que je ne veux pas retaper, et qui n'a rien à faire dans le dépôt. Ouvert une fois juste
après le seuil, puis seulement quand je le demande — la marque, en haut à gauche, y mène.

| Ce qu'il garde | Pourquoi il le garde |
|---|---|
| **le numéro de réponse** (`w`) | il voyage dans le lien d'une invitation ; en clair dans un dépôt public, il se ferait moissonner |
| **la signature** (`s`, « a. ») | elle est sur chaque pli, je ne la retape pas |
| **le prochain numéro** (`n`) | affiché, et corrigeable à la main le jour où le stockage a été effacé |

Trois lignes, la même écriture que D2, la même absence de « valider » : ce qui est écrit est
gardé. Tant que le numéro de réponse est vide, D1 propose les trois autres types et **grise
l'invitation** — elle est le seul type qui appelle une réponse.

Rien de ce tiroir n'entre dans le dépôt : il vit dans `pli.v1.reglages`, sur mon téléphone
([donnees.md](donnees.md#5-mon-historique)).

## D1 · le type

Quatre lignes, chacune avec son nom, sa glose et **le layout vu en petit** — un vrai pli
360 × 780 réduit par `transform: scale()`, jamais un dessin séparé. Il montre le **gabarit**,
pas l'écran de celle qui lira : le pli, lui, remplit le sien depuis le 19/08/2026. Le type fixe la mise
en page : après lui, il n'y a plus que du texte.

## D2 · les textes

L'aperçu en haut à droite se remplit pendant la frappe. En dessous, les lignes nommées :
Le titre · Ton mot · Quand · Où · Signé — « Quand » et « Où » n'existant que pour
l'invitation.

Le compteur de signes du titre s'étend au corps. Il porte sur **ce que le papier peut
tenir** — mesuré dans un vrai pli déplié
([donnees.md](donnees.md#ce-que-le-papier-peut-porter--mesuré-pas-estimé)) — et **pas sur la
longueur du lien**, qui est une des quatre mesures ouvertes et se fait sur les deux
téléphones ([architecture.md](architecture.md#la-longueur-du-lien)). Les deux se
confondent facilement : l'une est la place sur la page, l'autre ce qu'une conversation
transporte. Le bouton reste inactif tant que le texte principal est vide.

## D2p · quel poème

Le poème ne s'écrit pas ici. Cet écran remplace les lignes nommées par **la liste des
poèmes déjà déposés** — numéro et titre, lus dans l'index encodé. Une ligne, un tap, le
lien est fabriqué. La liste reprend la grammaire du sommaire de C1 et de D5 : c'est la seule
grammaire de liste que le produit ait, et un poème se choisit comme un pli déposé se relit.

C'est le seul écran de l'atelier qui demande le réseau, et il en tire **trois états, pas
deux** : la liste ; « aucun poème encore », qui est un fait ; et « pas de réseau », qui
passe. C'est la même distinction que « hors ligne ≠ introuvable » côté lecteur, et pour la
même raison.

**Choisir un poème n'est pas le déposer.** Un poème est poussé par git, pas fabriqué ici :
son lien se refabrique depuis le nom de son fichier, sans rien réencoder, **sans noter un
dépôt et sans avancer le compteur** — exactement comme le renvoi d'un pli depuis D5. Ce qui
cale le compteur, c'est l'index, et c'est sa seconde raison d'être
([donnees.md](donnees.md#lindex)) : un poème écrit hors atelier consomme un numéro que le
tiroir ignore. Le calage ne recule jamais, et ne se fait pas sur un index qu'on n'a pas pu
lire.

## D3 · le lien

Identique pour les quatre types, et il sert **trois fois** : à la fin d'un dépôt, au renvoi
d'un pli de D5, et au choix d'un poème sur D2p. L'écran ne change pas — seule sa conduite dit
d'où l'on vient. Un poème ne se modifie pas ici, son texte est à mon bureau : le retour
ramène à la liste, jamais à des textes qui n'existent pas.

Deux corrections à la maquette :

- **Le lien ne s'affiche pas.** L'adresse d'un poème tient sur une ligne, un vrai payload
  non — la maquette montrait `pli.re/015-vhtq`, un domaine que le produit n'a pas pris.
  La ligne de lien est remplacée par les deux actions : **envoyer** (partage natif) et
  **copier le lien**.
- **« lien valable 30 jours » disparaît** de E1 : il n'y a plus d'expiration.

## D5 · les plis déposés

**Écrit au jalon 4, jamais dessiné** — la roadmap le demandait en une ligne, « relire et
renvoyer ce que j'ai déposé », et la maquette qui porte le numéro D5 est l'écran du lien,
pas celui-là ([integration.md](integration.md#les-maquettes-que-le-handoff-navait-pas-transportées)).
Sa forme a donc été arrêtée avec son auteur, et la voici :

- **La liste reprend la grammaire du sommaire de C1** — le numéro et le type, ce qui est
  écrit, depuis quand. C'est la seule grammaire de liste que le produit ait, et un pli
  déposé se relit comme un pli reçu.
- **L'accès est une ligne discrète sur D1**, et elle ne se montre que si elle mène quelque
  part : rien de déposé, rien à afficher.
- **Renvoyer n'est pas déposer.** Le lien se refabrique depuis le payload gardé, sans
  réencoder, sans noter un dépôt et sans avancer le compteur — c'est le pli qui est parti la
  première fois, à l'identique. D3 sert les deux fois, seule sa conduite change.
- Le tiroir range le payload, jamais l'objet décodé, et le décodage se rejoue à l'affichage :
  une ligne devenue illisible s'en va seule, les autres restent
  ([donnees.md](donnees.md#5-mon-historique)).

## E1 · l'atelier au bureau

Les mêmes questions sur un écran de 1440 × 900 : type et textes en colonne à gauche, le pli
fermé et le pli ouvert côte à côte au centre. ~~**Le pli ne s'élargit jamais** — 360 de
large.~~ Depuis le 19/08/2026 le pli remplit l'écran, au bureau comme ailleurs : à
1440 × 900 il fait 1440 × 900. C'est le cas le plus étrange du plein cadre, et E1 n'est pas
construit — **sa forme se reprendra le jour où il s'écrira**, pas avant.

## Le poème, hors atelier

```
  plis-source/015.md   ──▶  plier.bat / plier.sh  ──▶  public/plis/015-vhtq.txt
   écrit à la main                                     public/plis/index
                                                       ↓
                                        stdout : nº 015 → leo-bernard38.github.io/Pli/#p=015-vhtq
```

J'écris le poème à mon bureau, dans un `.md` à front-matter. **Une ligne vide sépare deux
strophes**, et c'est toute la syntaxe. Elles se suivent à la lecture : le poème défile, il
ne pagine pas ([design-system.md](design-system.md#les-cinq-règles)). La moulinette encode,
met l'index à jour et m'imprime le lien fini. Je pousse. Le contrat complet est dans
[donnees.md](donnees.md#3-le-poème).

---

# 3. Ce qui n'est pas encore maquetté

À produire avant le développement des écrans concernés.

| Écran | Pourquoi il manque |
|---|---|
| **D0 · le seuil** | Nouveau : l'atelier n'était pas protégé dans le design |
| **D4 · le tiroir** | Nouveau : les constantes n'ont nulle part où vivre en dehors de mon téléphone |
| **D2p · quel poème** | Nouveau : conséquence du poème-fichier |
| **C1 à l'état vide** | Le journal existe, son écran vide non |
| **`#/installer`** | Nouveau, et il porte la survie du journal — voir [architecture.md](architecture.md#le-journal-peut-être-effacé) |
| **L'historique de l'atelier** | Relire et renvoyer ce que j'ai déposé. La maquette qui porte le numéro D5 est **l'écran du lien** — notre D3 — et pas celui-là |

**Corrigé le 19/08/2026 : quatre lignes sont sorties de ce tableau.** **C2, C3, C4, C5**,
**B0a-c** et **B2 · B3** y figuraient comme « inventoriés, jamais dessinés » ; ils **sont
dessinés**, dans les canevas du projet design que `design/handoff/` n'avait pas transportés.
Les écrans concernés ont donc été codés d'après cette liste, c'est-à-dire sans leur maquette.
Ce qu'elles montrent, et ce que le produit en retient, est relevé dans
[integration.md](integration.md#les-maquettes-que-le-handoff-navait-pas-transportées).
