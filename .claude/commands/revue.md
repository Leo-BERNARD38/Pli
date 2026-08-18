---
description: La revue complète d'un écran de Pli, avant qu'il parte en production
argument-hint: "[écran ou fichier — ex. A1, src/lecteur/a1.ts]"
---

Revue de : **$1** — sans argument, ce que `git diff` et `git status` montrent de non commité.

**Cette commande est chère : elle est réservée à un écran qui part en production.** Pour un
lot ordinaire, un seul relecteur suffit — celui dont le domaine est touché.

1. **`npm run verifie` d'abord.** Gratuit, déterministe : lexique, étiquettes, encres,
   propriétés animées, stockage, tiers, dépendances. **Zéro refus avant d'aller plus loin** —
   inutile de payer trois agents pour qu'ils retrouvent ce qu'un grep a déjà vu.

2. **Puis les relecteurs, en parallèle dans un seul message**, et seulement ceux qui servent :
   - `revue-ecran` — toujours ;
   - `garde-fluidite` — s'il y a du code qui charge ou qui bouge ;
   - `garde-invariants` — si le diff touche `lib/`, la moulinette, le routeur, la
     configuration ou les dépendances.

3. **Un seul verdict**, sans répéter trois fois le même point :
   - **ce qui condamne l'écran** — une des cinq règles cassée, une correction
     d'`integration.md` non appliquée, une image perdue pendant le geste, un invariant touché ;
   - **ce qui se corrige au passage**, avec `fichier:ligne` ;
   - **ce qui reste à vérifier à la main** — le grain, la cadence, le texte aux deux extrêmes.
     Ces trois-là se voient sur les deux téléphones, jamais sur un émulateur.

Termine par la question de `docs/integration.md#la-revue-dun-écran` qui n'a pas été couverte,
s'il en reste une.
