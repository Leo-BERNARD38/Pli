---
description: Construit Pli, jalon par jalon — lit l'état, planifie, découpe, écrit, relit, commite, note. Le prompt unique du chantier.
argument-hint: "[jalon — 0, 1, 2… ou « suite » pour reprendre]"
---

Tu construis Pli. Cible : **$1** — sans rien, ou « suite », reprends là où
[`.claude/chantier.md`](.claude/chantier.md) s'est arrêté.

## 0 · Si tu es en mode plan

Ne touche à aucun fichier. Produis le plan complet, puis sors par `ExitPlanMode`. Le plan
dit, dans cet ordre : ce qui est déjà là, les étapes découpées une par une avec leur
relecteur, **les mesures qui bloquent** et ce qu'elles empêchent, et la phrase qui termine le
jalon. Si une décision manque et qu'aucune doc ne la tranche, pose la question avec
`AskUserQuestion` **avant** de finir le plan — jamais après.

## 1 · Lire avant d'écrire

Dans cet ordre, sans sauter : `CLAUDE.md` · `.claude/chantier.md` · `docs/roadmap.md` pour le
jalon visé · `docs/integration.md` (toujours, avant le premier écran) · puis les documents que
le jalon pointe.

**Une règle absente de `docs/` n'existe pas.** Un chiffre se cite, il ne s'estime pas. Quand
la doc est muette, tu demandes — tu ne tranches pas à sa place.

## 2 · Ce qui bloque, et qui ne se devine pas

Quatre mesures sont ouvertes ([docs/README.md](docs/README.md#les-mesures-à-faire-avant-de-sengager)).
Aucune ne se simule, aucune ne se déduit : elles se font sur les deux téléphones.

Si une étape en dépend — le compteur de signes de l'atelier, l'écran `#/installer`, la
confiance qu'on accorde au journal — **fais tout le reste**, laisse cette étape ouverte, et
dis clairement laquelle et pourquoi. Ne bouche pas un trou avec une valeur inventée.

## 3 · Comment on découpe

L'arborescence cible est dans
[docs/architecture.md](docs/architecture.md#arborescence-cible). Elle fait foi. En plus :

- **Un écran, un fichier.** A1, A2, A3, A4, C1…C5, D0…D4, E1 — chacun son module, qui exporte
  une fonction de rendu et rien d'autre. Un fichier qui dépasse ce qu'on lit d'une traite se
  coupe en deux.
- **Le partagé vit dans `lib/`** : `codec.ts`, `journal.ts`, `dates.ts`, le routeur. Aucune de
  ces fonctions ne se recopie dans un écran.
- **Le CSS suit la même coupe** : `tokens.css`, `pli.css` (le gabarit, inline dans le
  document), puis un fichier **par type de pli**, chargé en arrière-plan.
- **Les deux entrées ne partagent que `lib/` et `styles/`.** Rien de l'atelier — formulaire,
  aperçus, index des poèmes — ne doit pouvoir atterrir dans le bundle qui part chez elle.
  Vérifie-le sur la sortie de build, pas sur l'intention.
- **Sans framework, sans dépendance au runtime.** Une `dependency` dans `package.json` est un
  refus par défaut ; la cible est zéro.

## 4 · Les polices — à faire entrer dans le dépôt

Aucun tiers, jamais : pas de CDN de polices. Les quatre familles vivent dans le dépôt.

- **Les sources** dans `polices-source/`, **commitées avec leurs licences OFL** — Pinyon
  Script régulier, Newsreader italique 300, Space Mono 700, Bodoni Moda (variable).
- **Les sous-ensembles woff2** dans `src/fonts/`, importés par le CSS donc empreintés par
  Vite. La commande `pyftsubset`, les plages de caractères et le détail famille par famille
  sont dans [docs/ressources.md](docs/ressources.md#les-polices) — **elle fait foi**, y compris
  le piège de Space Mono, dont le sous-ensemble garde minuscules **et** capitales parce que
  les étiquettes passent en capitales par CSS.
- **Un script rejouable**, `scripts/polices.py` ou `.mjs`, sur le modèle de `scripts/icones.py` :
  on regénère, on ne retouche pas.
- Bodoni : instancier `wght`, **ne garder que l'axe `opsz`**.
- Cible 15 à 30 ko par famille, à mesurer. `font-display: block`, jamais `swap`. Préchargement
  des **trois** familles d'A1 — pas Bodoni — avec `crossorigin`, même en même origine.

Les cinq peintures, elles, sont déjà là : `design/handoff/assets/`, à reprendre en définition
native dans `src/textures/` ([docs/ressources.md](docs/ressources.md#la-règle-de-définition)).

## 5 · Les tests

`docs/architecture.md#tests` pose le plancher et il n'est pas négociable :

- **`codec.ts`** — l'aller-retour sur les quatre types, les accents, un poème long, un payload
  tronqué, et le même résultat sous Node et dans le navigateur. Un lien cassé est un pli perdu.
- **`dates.ts`** — les formats français.

Trois autres méritent un test parce qu'ils protègent un invariant, et qu'ils sont de la
logique pure — pas des tests d'interface :

- le **dédoublonnage du journal sur l'empreinte `h`**, jamais sur `n` : deux plis de même
  numéro et de payloads différents donnent deux entrées ;
- la **moulinette** : un numéro déjà connu **réutilise son jeton**, et rien n'est jamais
  supprimé ;
- le **routeur** : `#c=`, `#p=`, `#/`, `#/installer`, et un hash inconnu.

Pas de tests d'écran, pas de tests de rendu, pas d'émulateur. Ce qui se voit se vérifie à la
main, sur les deux téléphones — c'est écrit dans
[docs/fluidite.md](docs/fluidite.md#comment-on-mesure), et aucun agent ne peut le faire à ta
place. Dis-le à chaque fin de jalon.

## 6 · Le rituel de chaque étape

Une étape à la fois, dans cet ordre, sans en sauter :

1. **écrire** — un écran, un module, ou un fichier de configuration. Pas plus ;
2. **relire** — `revue-ecran` puis `gardien-lexique` pour un écran, `garde-fluidite` pour un
   geste ou un chemin de chargement, `garde-invariants` pour `lib/`, la moulinette, le routeur
   ou les dépendances. `/revue` les lance ensemble ;
3. **corriger** — on ne passe pas à l'étape suivante avec un refus derrière soi ;
4. **commiter** — `type: phrase courte en français, en minuscules`. Si la garde refuse le
   commit, elle a raison : on corrige, on ne contourne pas ;
5. **noter** — cocher l'étape dans `.claude/chantier.md`, et y écrire toute décision prise en
   chemin que les docs ne tranchaient pas.

## 7 · Quand tu t'arrêtes

À la fin du jalon, ou dès qu'une mesure manquante bloque le reste. Alors :

- `.claude/chantier.md` est à jour — une autre session doit pouvoir reprendre en le lisant ;
- dis en trois lignes ce qui est fait, ce qui reste, ce qu'il faut mesurer à la main ;
- la phrase qui termine le jalon est-elle vraie ? Si non, dis-le franchement.
