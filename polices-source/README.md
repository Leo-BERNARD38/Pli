# polices-source/ — les quatre familles, telles qu'elles arrivent

Aucun tiers, jamais : pas de CDN de polices, pas une connexion en dehors de `leo-bernard38.github.io`. Les
polices vivent donc dans le dépôt, et ce dossier garde **les sources**, avec leurs licences.

Ce qui est servi n'est pas ici : c'est `src/fonts/`, écrit par
[`scripts/polices.py`](../scripts/polices.py) — **regénérer, jamais retoucher**.

| Dossier | Fichier | D'où il vient |
|---|---|---|
| `pinyon-script/` | `PinyonScript-Regular.ttf` | [google/fonts · ofl/pinyonscript](https://github.com/google/fonts/tree/main/ofl/pinyonscript) |
| `newsreader/` | `Newsreader-Italic[opsz,wght].ttf` | [google/fonts · ofl/newsreader](https://github.com/google/fonts/tree/main/ofl/newsreader) |
| `space-mono/` | `SpaceMono-Bold.ttf` | [google/fonts · ofl/spacemono](https://github.com/google/fonts/tree/main/ofl/spacemono) |
| `bodoni-moda/` | `BodoniModa[opsz,wght].ttf` | [google/fonts · ofl/bodonimoda](https://github.com/google/fonts/tree/main/ofl/bodonimoda) |

Les quatre sont sous **SIL Open Font License 1.1**. Chaque dossier porte son `OFL.txt`, et
il ne se supprime pas : c'est la condition de la licence.

Ce que chaque famille dit et à quelle taille est dans
[docs/design-system.md](../docs/design-system.md#les-mains) ; ce qu'on en garde, et ce que
ça pèse, dans [docs/ressources.md](../docs/ressources.md#les-polices).

## Ce que le sous-ensemblage a appris

- **Bodoni Moda n'a ni `↑` ni `→`.** Ni la source d'origine, ni les sous-ensembles
  `math` et `symbols` que Google sert. Le `↑` des maquettes était tracé par la police de
  secours du système, pas par Bodoni.
- **Le tiret cadratin manquait à la plage d'exemple** de `ressources.md`.
  `chargement.md` le nomme pourtant dans la ponctuation à garder : `U+2013-2014` a été
  ajouté, et l'exemple de `ressources.md` corrigé.
- **`U+202F`, l'espace fine insécable, n'existe que dans Pinyon Script.** Les trois autres
  familles la laissent à la police de secours. C'est une espace : rien ne se voit.
