---
description: Prépare et cadre un jalon de la roadmap — ce qu'il contient, dans quel ordre, et ce qui le termine
argument-hint: "[numéro du jalon — ex. 0, 2]"
---

Jalon demandé : **$1**. Sans numéro, prends le premier jalon non terminé de
[docs/roadmap.md](docs/roadmap.md).

N'écris pas de code tant que les quatre points ci-dessous ne sont pas posés.

1. **Relis le jalon dans `docs/roadmap.md`**, et les documents qu'il pointe. Un jalon se
   termine sur une phrase — « un lien fabriqué à la main s'ouvre sur son téléphone », « le
   premier vrai pli envoyé ». C'est le seul critère de fin.

2. **Dis ce qui bloque avant de commencer.** Certains jalons dépendent d'une des quatre
   mesures de `docs/README.md#les-mesures-à-faire-avant-de-sengager` — le plafond de longueur
   d'URL, la survie de `localStorage`, le bac de stockage du navigateur WhatsApp, le journal
   de l'app installée. **Aucune ne se devine et aucune ne se tranche à sa place.** Si une
   tâche en dépend, dis-la, propose de faire tout le reste, et demande la mesure.

3. **Découpe en étapes qui se relisent une par une.** Une étape = un écran, ou un module, ou
   un fichier de configuration. Pas de « je fais le jalon » en un seul jet : sous vibe coding,
   un gros diff est un diff que personne ne lit.

4. **Nomme le relecteur de chaque étape** avant de l'écrire :
   - un écran → `revue-ecran` puis `gardien-lexique` ;
   - un geste, une animation, un chemin de chargement → `garde-fluidite` ;
   - `lib/`, la moulinette, le routeur, les dépendances → `garde-invariants` ;
   - un écran fini → `/revue`, qui lance les trois premiers ensemble.

Puis exécute étape par étape, en relisant à chaque fois. Ne passe pas à l'étape suivante avec
un refus non corrigé derrière toi.

Termine par ce qui reste à vérifier à la main sur les deux téléphones — c'est la seule partie
qu'aucun agent ne peut faire.
