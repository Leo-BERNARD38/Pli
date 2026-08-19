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
   où **C5** s'affiche, et le seul qui exige le réseau. Un décodage ou un fetch qui échoue
   donne **C4**.
2. **Chercher dans le journal**, sur l'empreinte du payload — jamais sur le numéro
   (voir [donnees.md](donnees.md#4-son-journal)). Trouvé et déjà déplié → **C3**.
3. Sinon → **A1**.

**Rien n'est consommé à l'arrivée.** L'entrée du journal ne s'écrit qu'au dépliage validé.
Si elle ferme l'onglet sur A1, le pli l'attend toujours. C'est elle qui ouvre, pas le lien
qui s'ouvre.

## A1 · l'attente

Commune aux quatre types ; seule la promesse change. Numéro, promesse en voix,
« déposé par a. », et le volet carmin qui invite. Le fond est le rideau, la seule image
des états fermés — elle ne dit rien du contenu, c'est tout son intérêt
([design-system.md](design-system.md#les-deux-images-du-produit)).

La phrase de la maquette — « Il ne se lira qu'une fois » — devient fausse dès que le journal
existe. Elle est remplacée par :

> **Un pli t'attend.**
> Il ne s'ouvre qu'une fois. Ensuite il reste dans tes plis.

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
| poème | strophe par strophe, encre, sans image | « la suite ↑ » puis rien |
| souvenir | titre haut, une ligne en bas, image pleine | aucune |

**Le poème pagine, il ne défile jamais.** La règle « un pli = un écran » l'impose, et le
geste est le même que le dépliage. Une strophe = un écran, dans l'ordre du fichier ; la
dernière n'a plus de pliure.

Pour les trois types sans action, le parcours s'arrête là : le pli est lu, il est archivé,
et **la marque « Pli » en haut à gauche mène au journal**. C'est le geste discret que le
brief demandait — elle est déjà dans le gabarit, elle ne coûte rien.

## A3 · la réponse — invitation seulement

Trois mots, un seul tap : *oui, j'y serai* · *peut-être* · *je ne peux pas*.
Une ligne libre facultative après.

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
| **C2** | relecture d'une invitation déjà répondue, **depuis le journal** | crème |
| **C3** | lien déjà déplié — mène au journal | encre |
| **C4** | payload illisible, ou fichier de poème introuvable | crème |
| **C5** | attente du fichier — **poème uniquement** | crème |

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

Le compteur de signes du titre s'étend au corps, avec le plafond mesuré sur les deux
téléphones (voir [architecture.md](architecture.md#la-longueur-du-lien)). Le bouton reste
inactif tant que le texte principal est vide.

## D2p · quel poème

Le poème ne s'écrit pas ici. Cet écran remplace les lignes nommées par **la liste des
poèmes déjà déposés** — numéro et titre, lus dans l'index encodé. Une ligne, un tap, le
lien est fabriqué.

C'est le seul écran de l'atelier qui demande le réseau.

## D3 · le lien

Identique pour les quatre types. Deux corrections à la maquette :

- **Le lien ne s'affiche pas.** `pli.re/015-vhtq` tient sur une ligne, un vrai payload non.
  La ligne de lien est remplacée par les deux actions : **envoyer** (partage natif) et
  **copier le lien**.
- **« lien valable 30 jours » disparaît** de E1 : il n'y a plus d'expiration.

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

J'écris le poème à mon bureau, dans un `.md` à front-matter. Une ligne vide sépare deux
strophes — et **une strophe est une page**. La moulinette encode, met l'index à jour et
m'imprime le lien fini. Je pousse. Le contrat complet est dans
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
