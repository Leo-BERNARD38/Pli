# Hébergement — GitHub Pages

Ce que l'hébergeur donne, ce qu'il refuse, et ce qu'on en déduit. Ce qui se charge et dans
quel ordre est dans [chargement.md](chargement.md).

## Ce qui est déployé

```
dist/
  index.html              elle
  atelier/index.html      moi
  assets/                 js, css, polices, peintures — noms empreintés par Vite
  plis/                   les poèmes encodés + l'index      (copié de public/)
  icones/                 icônes, manifeste, og.png         (→ installation.md)
  404.html  .nojekyll
```

Deux workflows, et pas un de plus :

| Workflow | Quand | Ce qu'il fait |
|---|---|---|
| `verif` | sur chaque PR | `npm ci`, `npm test` (codec et dates), `npm run build` |
| `deploiement` | sur push vers `main` | le build, puis `actions/deploy-pages` |

Node en version LTS, épinglée dans le workflow et dans `package.json` (`engines`) — le codec
tourne des deux côtés, sa version de Node fait partie du contrat
([donnees.md](donnees.md#2-lencodage)). Pas de branche `gh-pages` tenue à la main.

**`design/` ne part jamais dans le build.** C'est une archive qu'on ouvre en local. Les
peintures servies vivent dans `src/`, d'où Vite les empreinte
([ressources.md](ressources.md#où-les-fichiers-vivent)).

## Ce que Pages ne donne pas

| Ce qui manque | Ce qu'on en fait |
|---|---|
| Aucun en-tête personnalisable | `cache-control: max-age=600` sur tout, sans exception — voir plus bas |
| Aucune réécriture d'URL | routage par hash, non négociable ([architecture.md](architecture.md#routage)) |
| gzip, pas de brotli | compter les budgets en **gzip**, jamais en brotli |
| Pas de redirection, pas de règle | le seul filet est `404.html`, en crème, qui renvoie à `leo-bernard38.github.io/` |
| Aucun secret, aucune variable | tout ce qui est buildé est public — le numéro WhatsApp voyage dans le lien |

Pas de `robots.txt` : tenir les moteurs à l'écart est le travail de la balise `noindex`, et
un `Disallow` global couperait aussi l'aperçu du lien ([partage.md](partage.md#les-balises-écrites-une-fois-pour-toutes)).

Vérification, à refaire le jour où Pages change d'avis :

```sh
curl -sSI -H 'Accept-Encoding: br, gzip' https://leo-bernard38.github.io/ | grep -i 'cache-control\|content-encoding'
```

Mesuré sur un site Pages le 17 août 2026 : `cache-control: max-age=600`,
`content-encoding: gzip` — même en demandant brotli.

## Ce que `max-age=600` change

Dix minutes de cache, et rien de plus, y compris sur des fichiers au nom empreinté qui
pourraient être gardés un an. Passé ce délai, chaque fichier est **revalidé** : l'`ETag`
évite de retélécharger, pas d'aller demander.

Trois conséquences qui gouvernent tout le reste :

1. **Peu de fichiers vaut mieux que des fichiers bien cachés.** Ce qu'on économise, ce sont
   des allers-retours, pas seulement des kilo-octets. Cible : **A1 en 5 requêtes** — le document, trois polices, une peinture.
2. **Chaque visite est presque une visite froide.** Le budget de [chargement.md](chargement.md)
   se mesure cache vide — c'est le cas réaliste, pas le pire cas.
3. **Le seul vrai remède serait un service worker.** Il n'est pas en v1
   ([roadmap.md](roadmap.md)) : le manifeste suffit pour l'écran d'accueil, et un cache
   qu'on gère mal est pire qu'un cache court.

## L'adresse

`https://leo-bernard38.github.io/`, servie à la **racine** — c'est le site d'utilisateur de
GitHub, obtenu en nommant le dépôt `leo-bernard38.github.io`. Pas de domaine personnalisé,
donc **pas de `CNAME`**, pas de DNS à tenir, et HTTPS d'office. `base` de Vite reste `/` :
c'est la racine d'un hôte, pas un sous-chemin de dépôt.

Un sous-chemin (`…github.io/Pli/`) n'est **pas** une cible : `base` devrait changer, toutes
les adresses absolues du produit avec, et le préfixe de chaque lien s'allongerait de cinq
signes — cinq signes de moins pour le pli, qui voyage entièrement dans le fragment.

**L'adresse se gèle au premier pli envoyé**, pas avant. Tant qu'aucun lien n'est parti, elle
peut encore devenir un vrai domaine : il suffirait de l'acheter, de le renseigner dans les
réglages du dépôt, de poser les enregistrements DNS de GitHub et d'activer « Enforce HTTPS ».
Après le premier pli, **elle ne change plus** — elle est dans une conversation, pour toujours.

## Ce qui ne doit jamais casser

Un lien parti n'a plus de version : il est dans une conversation, pour toujours.

- **Le nom d'un fichier de poème ne change jamais.** `public/plis/015-vhtq.txt` est une
  adresse publique dès le premier envoi ([donnees.md](donnees.md#la-moulinette)).
- **Un changement d'encodage prend un nouveau préfixe**, il ne réécrit pas l'ancien.
- **`#c=` et `#p=` restent lisibles pour toujours**, quel que soit le nombre de refontes.
- Les balises `og:` peuvent changer, mais les aperçus déjà envoyés, eux, ne bougeront pas
  ([partage.md](partage.md#ce-que-whatsapp-fait-vraiment)).

## Les limites de Pages

1 Go de dépôt, 100 Go de trafic par mois, une dizaine de builds par heure. Notre ordre de
grandeur : deux téléphones, moins de 2 Mo de build. On ne s'en approche pas — la seule
vigilance est de ne pas y verser un jour les originaux des peintures.

## Avant le premier déploiement

- [ ] `base: '/'` dans Vite — la racine d'un hôte, pas un sous-chemin de dépôt
- [ ] `.nojekyll` dans `public/`, donc à la racine de `dist/` — et **pas** de `CNAME`
- [ ] le dépôt nommé `leo-bernard38.github.io`, source de Pages = « GitHub Actions »
- [ ] `404.html` en crème, qui renvoie à `leo-bernard38.github.io/`
- [ ] `design/` absent de `dist/`
- [ ] les balises `og:` servies dans le HTML statique ([partage.md](partage.md))
- [ ] `curl` de vérification passé sur le domaine réel
