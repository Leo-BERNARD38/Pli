# Architecture

## Stack

- **TypeScript + Vite**, sans framework.
- **CSS natif** : variables, `@layer`, animations. Pas de librairie d'animation.
- **SVG inline** pour le grain, les taches d'encre, les filets.
- Cible : ~15 ko gzip. Le premier écran doit s'afficher avant qu'elle ait rangé son téléphone.

Pourquoi pas React : trois écrans, aucun état partagé complexe, et des animations
sur mesure. Le framework coûterait plus qu'il ne rapporte.

## Routage

Routage par **hash**, obligatoire sur GitHub Pages (pas de réécriture serveur, donc
toute URL profonde en 404).

```
#/            → dernière carte du journal, sinon accueil
#c=<payload>  → carte
#/journal     → journal (mot secret)
#/studio      → studio
```

Le routeur est une fonction sur `hashchange`. Pas de librairie.

## Arborescence cible

```
index.html
src/
  main.ts            routeur
  carte/             rendu d'une carte, par type
  journal/           archive, coupons utilisés
  studio/            formulaire, aperçu, génération du lien
  lib/
    codec.ts         encode / décode le payload
    stockage.ts      accès localStorage
    dates.ts         formats français, scellé, compte à rebours
  styles/
    tokens.css       couleurs, typo, espacements
    papier.css       textures, grain
    <type>.css       mise en page par type de carte
data/                le carnet d'idées
docs/
```

## Stockage

Voir [donnees.md](donnees.md). Tout est dans `lib/stockage.ts` : aucune autre partie
du code ne touche `localStorage` directement, pour que le mode navigation privée
(où l'écriture échoue) dégrade proprement — la carte s'affiche, elle n'est juste pas archivée.

## Hébergement

GitHub Pages, déploiement par GitHub Actions sur push vers `main`.

Contraintes à ne pas oublier :

- `base` de Vite = `/<repo>/`, sinon les assets tombent en 404.
- `.nojekyll` à la racine du build.
- Pas de variables d'environnement secrètes : tout ce qui est buildé est public.
  Le numéro WhatsApp voyage dans le lien, pas dans le dépôt.

## Compatibilité

Cible réelle : son téléphone. À vérifier avant de coder — iOS ou Android, et la version.

- `CompressionStream` : Safari 16.4+, Chrome 80+. Fallback prévu (voir `donnees.md`).
- Ajout à l'écran d'accueil : un `manifest.json` suffit pour que le journal ait une
  icône. Pas de service worker en v1.

## Ce qu'on ne fait pas

Pas de tests unitaires généralisés. Deux exceptions qui les méritent : `codec.ts`
(un lien cassé = une carte perdue) et `dates.ts` (les fuseaux et le scellé).
