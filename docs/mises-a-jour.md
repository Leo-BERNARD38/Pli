# Mises à jour — pousser sans rien casser

Le produit vit dans des liens déjà partis et dans un journal qui est sur son téléphone.
Une mise à jour ne doit jamais casser l'un ni l'autre, et ne doit jamais servir un mélange
d'ancien et de neuf.

## Deux familles de fichiers

| Famille | Fichiers | Nom | Périmable ? |
|---|---|---|---|
| **empreintés** | js, css, polices, textures | `pli-a3f9c1.js` | non — un contenu neuf a un nom neuf |
| **stables** | `index.html`, `atelier/index.html`, `plis/*.txt`, `plis/index`, tout `icones/` | leur nom | **oui, dix minutes** |

L'empreinte règle le problème que tu décris — **jamais un ancien CSS avec un nouveau code**.
Deux versions d'un même fichier ne portent pas le même nom, elles ne peuvent pas se
mélanger. La condition est que **tout ce qui est empreinté soit importé par le code**, et
non déposé dans `public/`, qui copie les noms tels quels
([ressources.md](ressources.md#où-les-fichiers-vivent)).

Il reste donc exactement un point périmable qui compte : **`index.html`**, plafonné à dix
minutes par GitHub Pages ([hebergement.md](hebergement.md#ce-que-max-age600-change)).

## La fenêtre de dix minutes

Un déploiement **remplace le site entier** : les fichiers empreintés de la version
précédente sont supprimés. D'où le seul vrai scénario de casse :

```
je pousse                      → le site sert la version B
elle ouvre un lien             → son navigateur a encore l'index.html de la version A
                                 (moins de dix minutes se sont écoulées)
cet index appelle pli-a3f9c1.js → ce fichier n'existe plus : 404
```

Ce n'est pas théorique, c'est le mode d'échec normal d'un site à fichiers empreintés. Deux
protections, et la première est architecturale.

### 1. Une page périmée doit rester lisible

**Le chemin critique ne dépend d'aucun fichier empreinté.** Le document d'A1 se suffit à
lui-même — balisage, style et module d'ouverture sont inline
([chargement.md](chargement.md#vague-1--le-document-se-suffit-à-lui-même)).

Un `index.html` vieux de neuf minutes affiche donc **le pli, en entier, correctement** : le
contenu est dans le lien, le style est dans le document. Ce qui peut manquer est ce qui est
chargé ensuite, et chaque manque a son repli :

| Ce qui manque | Ce qui se passe |
|---|---|
| une police | le texte s'affiche en police de secours |
| une texture | le cadre garde son aplat ([ressources.md](ressources.md#le-fondu-darrivée)) |
| le module d'A2 | c'est le seul cas gênant — voir ci-dessous |

C'est une propriété à défendre en revue, pas un heureux hasard : **si le premier écran se
met un jour à dépendre d'un fichier empreinté, cette garantie tombe.**

### 2. Un rechargement de secours, une seule fois

Quand un `import()` ou un `fetch` d'un fichier empreinté échoue, l'explication la plus
probable est celle-ci — pas une panne de réseau, puisque le document est arrivé.

```
échec d'un import empreinté
  → sessionStorage a-t-il déjà le drapeau « rechargé » ?
      oui  → on n'insiste pas : on reste sur ce qui est affiché
      non  → poser le drapeau, puis recharger sur leo-bernard38.github.io/Pli/?r=<horodatage>#<hash inchangé>
```

Deux points qui font que ça marche :

- **Le paramètre de requête est indispensable.** Un rechargement simple peut resservir le
  même `index.html` depuis le cache ; une URL neuve force la version fraîche.
- **Le fragment est recopié tel quel.** Il n'a jamais quitté l'appareil, il ne doit pas se
  perdre dans l'opération — sinon on recharge sur un journal vide au lieu du pli.

Le drapeau en `sessionStorage` est ce qui empêche la boucle de rechargement, le seul échec
inacceptable ici.

## Les fichiers stables, un par un

### `plis/*.txt` — les poèmes

**Ils ne sont jamais renommés ni supprimés** ([donnees.md](donnees.md#la-moulinette)). Un
nouveau poème est un fichier de plus : rien à périmer.

Un poème **corrigé** garde son nom, donc son contenu peut être vieux de dix minutes dans un
navigateur qui vient de le lire. Sans conséquence : la correction n'atteint de toute façon
pas celle qui l'a déjà déplié, puisque le contenu est recopié dans son journal à la première
ouverture. **Le journal fait foi**, c'est voulu.

### `plis/index` — le seul piège réel

L'index est lu par l'atelier pour peupler D2p **et pour caler mon compteur de numéros**
([donnees.md](donnees.md#lindex)). Un index périmé de dix minutes, c'est un poème qui manque
à l'appel — et surtout **un compteur qui repart sur un numéro déjà pris**. Deux plis nº 015,
et le dédoublonnage du journal se fait sur l'empreinte, pas sur le numéro : le second pli
serait bien archivé, mais les deux porteraient le même cachet.

**L'atelier lit toujours l'index avec un paramètre anti-cache** :

```js
fetch(`/plis/index?t=${Date.now()}`)
```

C'est mon téléphone à moi, une requête par ouverture de l'atelier, le coût est nul. C'est la
seule ressource du produit qu'on force à être fraîche.

### `icones/` — l'aperçu, le manifeste, les icônes

Noms stables, adresses publiques. Changer l'aperçu ne rafraîchit pas les vignettes déjà
envoyées — le remède est dans [partage.md](partage.md#ce-que-whatsapp-fait-vraiment).

## Le stockage, entre deux versions

Les clés portent déjà la version du schéma : `pli.v1.journal`, `pli.v1.seuil`,
`pli.v1.compteur`, `pli.v1.deposes` ([donnees.md](donnees.md#4-son-journal)).

Trois règles, dans l'ordre où elles comptent :

1. **Une version ne lit jamais les clés d'une version supérieure.** Un journal écrit par une
   v2 doit laisser une v1 indifférente, pas la faire tomber.
2. **La migration se fait à la lecture, et elle écrit la nouvelle clé avant de renoncer à
   l'ancienne.** `pli.v1.journal` reste en place tant que `pli.v2.journal` n'est pas écrit et
   relu. Un journal de six mois ne se perd pas dans une migration ratée.
3. **On ne supprime jamais une ancienne clé le jour de la migration.** Un déploiement se
   reprend ; un `localStorage` effacé, non.

Le contenu, lui, est déjà protégé par le préfixe de version du codec : un payload « 2 »
restera décodable quand un « 3 » existera.

## Le service worker, et pourquoi pas encore

Un service worker est le seul moyen de dépasser les dix minutes de cache
([hebergement.md](hebergement.md#ce-que-max-age600-change)). Il ajoute aussi la panne la plus
tenace du web : une version qui refuse de partir.

Le jour où on en met un, deux règles non négociables : **réseau d'abord pour le document**,
cache pour les fichiers empreintés — et un `skipWaiting` assumé, pour qu'une nouvelle version
prenne la main au prochain lancement, pas au troisième.

## Pousser une mise à jour

- [ ] `npm run build` passe, et les tests de `codec.ts` avec
- [ ] Actions au vert, déploiement terminé — le site est remplacé, pas fusionné
- [ ] ouvrir un **ancien lien** sur son téléphone : il doit s'ouvrir comme avant
- [ ] ouvrir un **lien de poème** : le fichier répond toujours
- [ ] l'atelier montre le bon dernier numéro (index frais)
- [ ] dix minutes plus tard, tout est aligné — inutile de courir après le cache

Et la règle qui prime toutes les autres : **on ne renomme rien de ce qui est déjà parti dans
une conversation** ([hebergement.md](hebergement.md#ce-qui-ne-doit-jamais-casser)).
