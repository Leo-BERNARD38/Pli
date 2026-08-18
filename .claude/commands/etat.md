---
description: Où en est Pli — le jalon courant, ce qui reste, et les mesures qui bloquent
allowed-tools: Bash(git log:*), Bash(git status:*), Bash(ls:*), Read, Glob
---

Fais le point, court, en trois parties.

1. **Ce qui existe vraiment.** Lis d'abord [`.claude/chantier.md`](.claude/chantier.md), qui
   dit ce qui a atterri, puis vérifie sur le dépôt plutôt que sur le README : `package.json`, `src/`,
   `.github/workflows/`, `public/plis/`, `public/icones/` — présents ou pas. Le README annonce
   des commandes npm qui ne seront réelles qu'au jalon 0.

2. **Le jalon courant.** Lis `docs/roadmap.md` et dis lequel est en cours, ce qui y est fait,
   ce qui y manque. Un jalon se termine sur une phrase (« un lien fabriqué à la main s'ouvre
   sur son téléphone », « le premier vrai pli envoyé »…) : dis si elle est vraie.

3. **Ce qui bloque.** Les quatre mesures de
   `docs/README.md#les-mesures-à-faire-avant-de-sengager` — plafond de longueur d'URL, survie
   de `localStorage`, bac de stockage du navigateur WhatsApp, journal de l'app installée.
   Aucune ne se devine, et chacune conditionne une décision. Dis lesquelles restent ouvertes
   et ce qu'elles empêchent de trancher.

Ne propose pas de les trancher à sa place. Termine par la prochaine chose à faire, une ligne.

Si `.claude/chantier.md` a divergé de la réalité du dépôt, corrige-le — c'est lui qu'une autre
session lira.
