# Les canevas — la source dont `handoff/` est l'export

Six canevas du projet design Claude Design « Pli », entrés le 19/08/2026. `handoff/` n'en
exportait que trois pages ; les canevas, eux, dessinent des écrans que
[docs/parcours.md](../../docs/parcours.md#3-ce-qui-nest-pas-encore-maquetté) croyait n'avoir
jamais été dessinés — C2 à C5, B0a-c, B2 · B3, et l'atelier.

| Fichier | Ce qu'il porte |
|---|---|
| `Pli - Maquettes` | tous les écrans d'elle, figés : A1→A4, B0a-c, B1→B4, C1→C5 |
| `Pli - Createur` | l'atelier, D1→D5 et E1 — la numérotation n'est **pas** celle du dépôt |
| `Pli - Systeme` | le gabarit, les encres, les mains |
| `Pli - Ouverture au doigt` | le geste, image par image |
| `Pli - Animations d'ouverture` | les cinq chemins de l'ouverture |
| `Pli - Icone - planche d'export` | la planche dont `public/icones/` est tiré |

Ils s'ouvrent tels quels dans un navigateur. `support.js` et `image-slot.js` sont le support
de Claude Design, pas du produit ; `assets/drape-carmin-rose.webp` est **le même fichier**
que `handoff/assets/` — recopié pour que les canevas ne dépendent de rien.

**Cette archive peut s'agrandir, jamais changer.** Un canevas déjà là ne se modifie pas :
quand le design se trompe, on corrige `docs/` et on note l'écart dans
[docs/integration.md](../../docs/integration.md#les-maquettes-que-le-handoff-navait-pas-transportées).
`PLI.md` du projet design porte depuis un §11 sur l'icône que la copie du dépôt n'a pas ; son
seul « reste à faire », vectoriser la lettre dans les SVG, **est déjà fait** —
`scripts/icones.py` sort des `<path>`, aucun `<text>`.
