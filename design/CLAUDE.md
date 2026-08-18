# design/ — archive figée, en lecture seule

Ce dossier est une **copie du projet Claude Design importée le 17 août 2026**. Il dit ce que
le design a produit ; [`docs/`](../docs/README.md) dit ce qu'on construit.

**Ne jamais modifier un fichier de ce dossier.** Quand le design se trompe, on corrige `docs/`
et on note l'écart dans
[`docs/integration.md`](../docs/integration.md#ce-qui-a-changé-depuis-le-design). Quand `docs/`
et `design/` divergent, **`docs/` fait foi**.

Il ne part jamais dans le build.

## Ce qui fait foi ici, et ce qui n'y fait pas foi

- **`handoff/pli.css` fait foi pour les valeurs de la DA** — encres, mains, gabarit, mouvement.
  Sa reprise (le fichier se scinde en deux, quatre corrections à appliquer, classes à remonter,
  classes à laisser) est décrite dans
  [`docs/integration.md`](../docs/integration.md#reprendre-plicss).
- **Les `<style>` des prototypes ne font pas foi.** `createur.html` et `createur-bureau.html`
  recopient une partie de `pli.css` avec de légères divergences ; `lecteur.html` définit des
  classes absentes de `pli.css`. Ne rien recopier d'eux sans passer par `integration.md`.
- **`PLI.md` est la spécification telle que le design l'a écrite** — antérieure aux décisions
  produit (serveur, expiration, usage unique garanti). Périmée sur ces points.
- Un seul fichier sert encore : `handoff/icones/og.png`, repris par `scripts/icones.py` qui
  n'en réécrit que le pied. Les icônes servies vivent dans `public/icones/`.
