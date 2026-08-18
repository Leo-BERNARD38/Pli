# Partage — l'aperçu du lien et la réponse

Le lien part dans une conversation WhatsApp. Ce document dit ce que la conversation en
montre, et comment la réponse y revient.

## L'aperçu ne peut pas fuiter, par construction

Tout ce qui suit le `#` **n'est jamais envoyé au serveur** — c'est la spécification HTTP,
pas une précaution. Le fabricant d'aperçu ne voit donc que `https://leo-bernard38.github.io/`, jamais
`#c=…` ni `#p=…`.

Conséquence : **tous les plis ont exactement le même aperçu**. Rien à filtrer, rien à
masquer, rien à tester par type. L'aperçu n'est pas un risque à couvrir, c'est le teaser du
produit — le papier froissé, et deux phrases qui n'en disent pas plus qu'A1.

## Les balises, écrites une fois pour toutes

```html
<meta property="og:title"       content="Un pli t'attend.">
<meta property="og:description" content="Il ne s'ouvre qu'une fois.">
<meta property="og:image"       content="https://leo-bernard38.github.io/icones/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url"         content="https://leo-bernard38.github.io/">
<meta property="og:type"        content="website">
<meta property="og:site_name"   content="Pli">
<meta property="og:locale"      content="fr_FR">
<meta name="description"        content="Un pli t'attend. Il ne s'ouvre qu'une fois.">
<meta name="robots"             content="noindex, nofollow">
```

| Règle | Pourquoi |
|---|---|
| Dans le HTML **statique** | le fabricant d'aperçu n'exécute pas de JavaScript |
| URL **absolues**, en `https` | une URL relative ne donne aucune vignette |
| `og:url` **sans fragment** | c'est déjà ce que voit le crawler ; l'y remettre ne servirait à rien |
| Deux lignes visibles au plus | la bulle tronque vite — nos deux phrases sont calibrées |
| `noindex` sur les deux entrées | Pli n'a rien à faire dans un moteur de recherche |
| Aucun `robots.txt` | un `Disallow` global couperait aussi l'aperçu ; `noindex` suffit |
| Aucune balise `og:` dans l'atelier | personne ne partage l'atelier ; il porte `noindex` et rien d'autre |

Le texte suit le lexique ([design-system.md](design-system.md#ton-et-vocabulaire)) : c'est
la voix du produit, pas une accroche marketing. Il ne nomme ni destinataire, ni type, ni
contenu.

## L'image d'aperçu

Elle est dessinée, et elle est bien meilleure que le recadrage de peinture prévu au départ :
le papier crème et son grain, la marque carmin, « Un pli t'attend. » en Bodoni, la pliure en
pointillé carmin. **Le produit se présente lui-même, dans sa propre voix.**

| Réglage | Valeur |
|---|---|
| Fichier | `public/icones/og.png`, regénéré par [`scripts/icones.py`](../scripts/icones.py) |
| Format | **1200 × 630**, PNG |
| Poids | **30 ko** — très loin du plafond des messageries |
| Servi depuis | `/icones/og.png`, nom stable, jamais empreinté |

PNG et non JPEG, et c'est le bon choix ici : des aplats et de la typographie, pas une
photographie. Le JPEG salirait les bords des lettres pour le même poids.

**Une phrase a été corrigée.** Le bas de l'image livrée portait
« PLI.RE · UNE SEULE LECTURE · PAS DE COMPTE » : « une seule lecture » est exactement la
promesse que le produit ne tient pas — le refermement est une convention locale, et le pli
reste lisible dans son journal
([integration.md](integration.md#corrections-de-contenu-dans-les-maquettes)). Le pied dit
désormais **« PLI.RE · POUR TOI SEULE »**, qui est du lexique et qui est vrai. Seule cette
bande de treize pixels a bougé ; le reste de l'image est intact, au pixel près.

La même phrase était dans `og:description` — c'est « Il ne s'ouvre qu'une fois. » qui fait
foi — la liste des balises est ci-dessus, celle du `<head>` est dans
[installation.md](installation.md#le-manifeste-et-les-icônes).

`twitter:card` est écarté : personne ne partage un pli ailleurs que dans une conversation, et
une balise de plus est une balise de plus à maintenir juste.

## Ce que WhatsApp fait vraiment

Trois comportements qui ne se devinent pas, et qui changent la manière de travailler :

1. **L'aperçu est fabriqué sur le téléphone qui envoie**, au moment où le lien est collé,
   puis voyage **dans le message** — le chiffrement de bout en bout l'impose. Donc : mon
   Android doit pouvoir joindre `leo-bernard38.github.io` au moment où je colle. Hors réseau, pas de
   vignette ; le lien, lui, fonctionne quand même.
2. **Coller, attendre que la vignette apparaisse, puis envoyer.** Envoyer trop vite part
   sans aperçu. C'est un geste à connaître, pas un réglage.
3. **La vignette est mise en cache sur l'appareil, sans moyen de purge.** Changer les
   balises ne change rien à ce que mon téléphone affichera pour `leo-bernard38.github.io/`.

Le remède au troisième point, le jour où les balises changent : ajouter un paramètre de
requête au lien.

```
https://leo-bernard38.github.io/?a=2#c=<payload>
```

WhatsApp y voit une adresse neuve et refabrique l'aperçu. Le fragment reste intact, le
serveur ignore la requête, le produit ne s'en aperçoit pas. Coût : cinq signes de lien —
à ne sortir que quand c'est nécessaire, pas par défaut.

## Vérifier un aperçu

- **Que les balises sont bien servies** — une commande suffit :

  ```sh
  curl -sS https://leo-bernard38.github.io/ | grep 'og:'
  ```

- **Ce que WhatsApp en fait** — s'envoyer le lien à soi-même, dans WhatsApp, sur le
  téléphone qui enverra les vrais. C'est le seul test fidèle : les validateurs en ligne et
  le débogueur de Facebook interrogent d'autres caches que celui du téléphone.
- Le faire **une fois**, au jalon 1, et le refaire uniquement si les balises changent.

## La réponse

Le mécanisme est dans [donnees.md](donnees.md#6-la-réponse-whatsapp) — ici, ce que
l'intégration doit garantir.

```
https://wa.me/<w>?text=<message url-encodé>       w présent : E.164 sans « + »
whatsapp://send?text=<message>                     w absent : sélecteur de contact
```

- **Un vrai `<a href>`, pas un `location.href` en JavaScript.** Un lien ouvre l'application
  plus fiablement, il est atteignable au clavier, et c'est le navigateur qui gère la sortie.
- **L'ordre ne change pas** : noter la réponse, afficher A4, **puis** ouvrir WhatsApp.
  L'écriture du journal est ici **synchrone, avant de quitter** — c'est l'exception assumée
  à la règle de [fluidite.md](fluidite.md#écrire-le-journal-sans-bloquer), et il n'y a plus
  d'animation à protéger à ce moment-là.
- **Le cœur est url-encodé** (`encodeURIComponent`) — « Oui, j'y serai ❤️ » est la seule
  exception au lexique, et elle est nommée.
- **Rien ne garantit qu'elle a appuyé sur envoyer.** A4 affiche son mot et n'affirme rien de
  plus ([integration.md](integration.md#corrections-de-contenu-dans-les-maquettes)).

### Le retour

Elle revient par le bouton système. Deux chemins possibles, et les deux doivent tomber juste :

| Retour | Ce qui se passe | Ce qu'il faut |
|---|---|---|
| depuis le **bfcache** | la page est restaurée telle quelle, aucun script rejoué | A4 est déjà là, rien à faire — ne jamais dépendre d'un rechargement |
| par un **rechargement** | le hash `#c=` est toujours dans la barre | l'arrivée relit le journal et retombe sur A4, pas sur A1 |

C'est la règle de [parcours.md](parcours.md#larrivée) étendue d'un cran : l'arrivée décide
l'écran d'après le journal — `deplieLe` mène à C3, une `reponse` déjà notée mène à C2.
L'écran ne se déduit jamais du seul lien.

Corollaire : **aucun état d'écran ne vit uniquement en mémoire.** Tout ce qui doit survivre
à un aller-retour vers WhatsApp est dans le journal avant de partir.

## Partager depuis l'atelier

D3 fabrique le lien ; il ne l'affiche pas ([integration.md](integration.md)).

- **Partage natif** — `navigator.share({ text, url })`, qui ouvre la feuille de partage du
  système et met WhatsApp en premier. Il exige un geste utilisateur direct : l'appel doit
  partir du `click`, pas d'une promesse résolue plus tard.
- **Copier le lien** — `navigator.clipboard.writeText`, toujours disponible en second
  chemin, y compris quand le partage natif échoue sans rien dire.
- Le numéro `w` est saisi dans l'atelier et voyage dans le lien. **Il n'entre jamais dans le
  dépôt** — un numéro en clair dans un dépôt public se fait moissonner
  ([donnees.md](donnees.md#1-le-pli)).
