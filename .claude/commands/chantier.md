---
description: Construit Pli, jalon par jalon — lit l'état, découpe en lots, écrit, relit une fois, commite, note.
argument-hint: "[jalon — 0, 1, 2… ou « suite » pour reprendre]"
---

Tu construis Pli. Cible : **$1** — sans rien, ou « suite », reprends là où
[`.claude/chantier.md`](.claude/chantier.md) s'est arrêté.

## Ce que tu lis, et rien de plus

`.claude/chantier.md` (l'état) · `.claude/memo.md` (toutes les valeurs) · le jalon visé dans
`docs/roadmap.md`. **Un document de `docs/` ne s'ouvre que si la fiche ne répond pas** — et
alors celui-là seul. `CLAUDE.md` est déjà dans ton contexte : ne le relis pas.

Une règle absente de `docs/` n'existe pas. Un chiffre se cite, il ne s'estime pas. Quand la
doc est muette, tu demandes avec `AskUserQuestion` — **avant** d'écrire, jamais après.

## En mode plan

Ne touche à aucun fichier. Le plan dit, dans cet ordre : ce qui est déjà là, les **lots**
(pas les fichiers) avec leur relecteur, les mesures qui bloquent et ce qu'elles empêchent, et
la phrase qui termine le jalon. Puis `ExitPlanMode`.

## Comment on découpe

Un **lot** = deux à quatre étapes qui vont ensemble : un écran et son fond, un module et ses
tests, le geste et sa transition. C'est l'unité qui se relit. Un écran par fichier, le partagé
dans `lib/`, le CSS coupé par type de pli
([docs/architecture.md](docs/architecture.md#arborescence-cible) fait foi).

**Rien de l'atelier ne doit atterrir dans le bundle qui part chez elle** — vérifie-le sur la
sortie de build, pas sur l'intention. Une `dependency` dans `package.json` est un refus par
défaut : la cible est zéro.

## Le rituel d'un lot

1. **écrire** le lot en entier ;
2. **`npm run verifie`** — il tourne déjà après chaque écriture ; le lancer en entier avant de
   relire. Zéro refus avant de continuer ;
3. **relire une fois**, avec le seul relecteur dont le domaine est touché :
   `revue-ecran` (un écran), `garde-fluidite` (un geste, un chargement), `garde-invariants`
   (`lib/`, la moulinette, le routeur, les dépendances). Les trois ensemble — `/revue` — sont
   réservés à un écran qui part en production ;
4. **corriger** — on ne passe pas au lot suivant avec un refus derrière soi ;
5. **commiter** — `type: phrase courte en français, en minuscules`. Si la garde refuse, elle a
   raison : on corrige, on ne contourne pas ;
6. **noter** — cocher dans `.claude/chantier.md` ; une décision que les docs ne tranchaient pas
   s'ajoute, datée, à `.claude/decisions.md`.

**Pas de sous-agent pour chercher.** Trouver un fichier, lire une doc, vérifier un chiffre :
`grep`, `cat`, ou la fiche.

## Ce qui bloque et ne se devine pas

Quatre mesures sont ouvertes ([docs/README.md](docs/README.md#les-mesures-à-faire-avant-de-sengager)).
Aucune ne se simule. Si une étape en dépend : **fais tout le reste**, laisse celle-là ouverte,
dis laquelle et pourquoi. Ne bouche pas un trou avec une valeur inventée.

## Les tests

Le plancher de `docs/architecture.md#tests`, et rien au-delà : `codec.ts` (aller-retour sur
les quatre types, accents, poème long, payload tronqué, même résultat sous Node et dans le
navigateur), `dates.ts`, le dédoublonnage du journal sur `h`, la moulinette qui réutilise un
jeton, le routeur. **Pas de tests d'écran, pas de tests de rendu, pas d'émulateur.**

## Quand tu t'arrêtes

À la fin du jalon, ou dès qu'une mesure manquante bloque le reste. Alors : `chantier.md` est à
jour, tu dis en trois lignes ce qui est fait, ce qui reste, et ce qu'il faut mesurer à la main
sur les deux téléphones. La phrase qui termine le jalon est-elle vraie ? Si non, dis-le.
