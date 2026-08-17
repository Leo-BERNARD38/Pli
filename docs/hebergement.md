# Hébergement — GitHub Pages

Ce que l'hébergeur donne, ce qu'il refuse, et ce qu'on en déduit. Ce qui se charge et dans
quel ordre est dans [chargement.md](chargement.md).

## Ce qui est déployé

```
dist/
  index.html              elle
  atelier/index.html      moi
  assets/                 js, css, polices — noms empreintés par Vite
  plis/                   les poèmes encodés + l'index      (copié de public/)
  textures/               les cinq peintures redimensionnées
  og.jpg                  l'aperçu du lien, 1200 × 630      (→ partage.md)
  manifest.json  icons/   l'ajout à l'écran d'accueil
  404.html  CNAME  .nojekyll
```

Déploiement par GitHub Actions sur push vers `main` : build, puis `actions/deploy-pages`.
Pas de branche `gh-pages` tenue à la main.

**`design/` ne part jamais dans le build.** C'est une archive qu'on ouvre en local ; ses
cinq originaux pèsent 4 Mo à eux seuls. Le build n'emporte que les versions redimensionnées.

## Ce que Pages ne donne pas

| Ce qui manque | Ce qu'on en fait |
|---|---|
| Aucun en-tête personnalisable | `cache-control: max-age=600` sur tout, sans exception — voir plus bas |
| Aucune réécriture d'URL | routage par hash, non négociable ([architecture.md](architecture.md#routage)) |
| gzip, pas de brotli | compter les budgets en **gzip**, jamais en brotli |
| Pas de redirection, pas de règle | le seul filet est `404.html`, en crème, qui renvoie à `pli.re/` |
| Aucun secret, aucune variable | tout ce qui est buildé est public — le numéro WhatsApp voyage dans le lien |

Pas de `robots.txt` : tenir les moteurs à l'écart est le travail de la balise `noindex`, et
un `Disallow` global couperait aussi l'aperçu du lien ([partage.md](partage.md#les-balises-écrites-une-fois-pour-toutes)).

Vérification, à refaire le jour où Pages change d'avis :

```sh
curl -sSI -H 'Accept-Encoding: br, gzip' https://pli.re/ | grep -i 'cache-control\|content-encoding'
```

Mesuré sur un site Pages le 17 août 2026 : `cache-control: max-age=600`,
`content-encoding: gzip` — même en demandant brotli.

## Ce que `max-age=600` change

Dix minutes de cache, et rien de plus, y compris sur des fichiers au nom empreinté qui
pourraient être gardés un an. Passé ce délai, chaque fichier est **revalidé** : l'`ETag`
évite de retélécharger, pas d'aller demander.

Trois conséquences qui gouvernent tout le reste :

1. **Peu de fichiers vaut mieux que des fichiers bien cachés.** Ce qu'on économise, ce sont
   des allers-retours, pas seulement des kilo-octets. Cible : **A1 en 4 requêtes ou moins**.
2. **Chaque visite est presque une visite froide.** Le budget de [chargement.md](chargement.md)
   se mesure cache vide — c'est le cas réaliste, pas le pire cas.
3. **Le seul vrai remède serait un service worker.** Il n'est pas en v1
   ([roadmap.md](roadmap.md)) : le `manifest.json` suffit pour l'écran d'accueil, et un cache
   qu'on gère mal est pire qu'un cache court.

## Le domaine

`pli.re`, apex, par un `CNAME` à la racine du build et les enregistrements DNS fournis par
GitHub. « Enforce HTTPS » activé dans les réglages du dépôt — un lien en clair qui redirige
coûte un aller-retour et casse l'aperçu.

**Le domaine ne change plus.** Il est dans chaque lien déjà envoyé.

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

- [ ] `base: '/'` dans Vite — un domaine propre, pas un sous-chemin de dépôt
- [ ] `CNAME` et `.nojekyll` dans `public/`, donc à la racine de `dist/`
- [ ] HTTPS forcé
- [ ] `404.html` en crème, qui renvoie à `pli.re/`
- [ ] `design/` absent de `dist/`
- [ ] les balises `og:` servies dans le HTML statique ([partage.md](partage.md))
- [ ] `curl` de vérification passé sur le domaine réel
