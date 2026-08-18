# Chantier — où en est la construction

Ce fichier est **l'état**, pas le plan. Le plan est [docs/roadmap.md](../docs/roadmap.md) et
il ne bouge pas ; ce fichier dit ce qui a réellement atterri, et il se met à jour à chaque
étape terminée. C'est ce qu'une nouvelle session lit en premier pour savoir où reprendre.

Une étape n'est cochée que lorsqu'elle est **écrite, relue et commitée**.

## Jalon courant

**Jalon 0 — socle.** Rien n'est commencé.

## Ce qui existe

- [x] `docs/` — la spécification, complète, elle fait foi
- [x] `design/` — l'archive figée, dont les cinq peintures dans `design/handoff/assets/`
- [x] `public/icones/` — icônes, manifeste et `og.png`, à servir tels quels
- [x] `scripts/icones.py` — la planche des icônes
- [x] `.claude/` — relecteurs, commandes, gardes

## Jalon 0 — socle

- [ ] `package.json`, Vite + TypeScript, deux entrées (`/` et `/atelier/`)
- [ ] `src/lib/codec.ts` — isomorphe Node + navigateur, avec ses tests
- [ ] `src/lib/dates.ts` — les formats français, avec ses tests
- [ ] le routeur par hash
- [ ] `CNAME`, `.nojekyll`, `404.html`, `base: '/'`
- [ ] les deux workflows GitHub — vérification sur PR, déploiement sur `main`
- [ ] un pli en dur, sans style

**Fin du jalon :** un lien fabriqué à la main s'ouvre sur son téléphone.

## Les mesures — aucune ne se devine

Elles sont décrites dans [docs/README.md](../docs/README.md#les-mesures-à-faire-avant-de-sengager).
Tant qu'une case est vide, ce qu'elle conditionne ne se tranche pas.

- [ ] **1 · le plafond de longueur d'un lien**, WhatsApp → iOS → Safari → fixe le compteur de
      signes de l'atelier
- [ ] **2 · la survie de `localStorage`** au plafond de sept jours de WebKit
- [ ] **3 · le bac de stockage** du navigateur intégré de WhatsApp
- [ ] **4 · le journal de l'app installée** est-il celui de Safari → décide de l'existence de
      l'écran `#/installer`

## Décisions prises en construisant

Ce que les docs ne tranchaient pas et qui a été tranché en chemin. Une ligne par décision,
avec sa date. Si elle contredit une doc, la doc se corrige et l'écart se note dans
[docs/integration.md](../docs/integration.md).

_(vide)_
