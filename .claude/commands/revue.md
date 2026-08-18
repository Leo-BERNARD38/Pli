---
description: La revue complète d'un écran de Pli — design, lexique, fluidité — avant de le considérer fini
argument-hint: "[écran ou fichier — ex. A1, atelier/D2, src/lecteur/a1.ts]"
---

Revue de : **$1**

Si rien n'est donné, relis ce que `git diff` et `git status` montrent de non commité.

Lance les trois relecteurs **en parallèle**, dans un seul message :

- `revue-ecran` — les cinq règles, le gabarit, les encres, les corrections d'`integration.md`,
  l'accessibilité ;
- `gardien-lexique` — les mots visibles et les noms du code ;
- `garde-fluidite` — uniquement s'il y a du code qui charge ou qui bouge ;
- `garde-invariants` — uniquement si le diff touche `lib/`, la moulinette, le routeur,
  la configuration ou les dépendances.

Puis rassemble en un seul verdict, sans répéter trois fois le même point :

1. **Ce qui condamne l'écran** — une des cinq règles cassée, une correction d'`integration.md`
   non appliquée, une image perdue pendant le geste, un invariant touché. À refaire.
2. **Ce qui se corrige au passage** — avec `fichier:ligne`.
3. **Ce qui reste à vérifier à la main** — ce qu'aucune lecture de code ne tranche : le rendu
   du grain, la cadence, le texte aux deux extrêmes. Ces trois-là se voient sur les deux
   téléphones, jamais sur un émulateur.

Termine par la question de `docs/integration.md#la-revue-dun-écran` qui n'a pas été couverte,
s'il en reste une.
