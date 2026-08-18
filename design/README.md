# design/ — l'archive du travail de design

Ce dossier est une **copie figée** du projet Claude Design
[`ac0ffdcd`](https://claude.ai/design/p/ac0ffdcd-47fb-4df0-8881-cad80afa8571),
importée le 17 août 2026. Il n'est pas modifié à la main.

Il n'est pas non plus la spécification du produit. Il dit ce que le design a produit ;
[`docs/`](../docs/README.md) dit ce qu'on construit. Quand les deux divergent —
et ils divergent, la liste est dans [`docs/integration.md`](../docs/integration.md) —
**`docs/` fait foi.**

## Contenu

| Fichier | Rôle |
|---|---|
| [PLI.md](PLI.md) | La spécification telle que le design l'a écrite |
| [handoff/pli.css](handoff/pli.css) | Toutes les valeurs du système. **Fait foi pour la DA.** |
| [handoff/index.html](handoff/index.html) | Planche de référence : encres, mains, gabarit, inventaire des écrans |
| [handoff/lecteur.html](handoff/lecteur.html) | Prototype A1 → A4, avec le geste de dépliage réel |
| [handoff/createur.html](handoff/createur.html) | Prototype D1 → D3, mobile |
| [handoff/createur-bureau.html](handoff/createur-bureau.html) | Prototype E1, 1440 × 900 |

Aucun build, aucune dépendance. Ouvrir `handoff/index.html` dans un navigateur suffit.

Les icônes, le manifeste et l'aperçu du lien vivent dans
[handoff/icones/](handoff/icones/README.md) — importés le 18 août 2026, après le reste.
Comme le reste du dossier, ils ne bougent plus : **les fichiers servis vivent dans
`public/icones/`**, regénérés depuis le tracé de la lettre par
[`scripts/icones.py`](../scripts/icones.py). Ce qui les sépare — trois défauts mesurés et
corrigés — est dans
[`docs/installation.md`](../docs/installation.md#ce-qui-a-été-corrigé-sur-les-fichiers-livrés).

De ce dossier, un seul fichier sert encore à quelque chose : **`og.png`**, que le script
reprend pour n'en réécrire que le pied. Les autres sont l'archive de ce qui a été livré.

Les images vivent dans [handoff/assets/](handoff/assets/README.md) — cinq peintures, leur
emploi et leurs cadrages. Elles, contrairement au reste du dossier, ont bougé depuis
l'import : quatre se sont ajoutées et toutes ont été nommées.

## Un avertissement

**Les `<style>` des prototypes ne font pas foi.** `createur.html` et `createur-bureau.html`
recopient une partie de `pli.css` avec de légères divergences, et `lecteur.html` définit des
classes qui n'existent pas dans `pli.css`. Le détail et le tri sont dans
[`docs/integration.md`](../docs/integration.md).

Les prototypes ne connaissent que le drapé : B1 et B4 le montrent encore, avec les anciens
cadrages. Les textures qui leur reviennent désormais sont dans
[handoff/assets/README.md](handoff/assets/README.md).
