# Roadmap

## Jalon 0 — Socle

- Vite + TypeScript, déploiement GitHub Pages par Actions
- Routeur par hash
- `lib/codec.ts` : encode / décode, avec tests
- Une carte en dur, sans style

Fin du jalon : un lien généré à la main s'ouvre sur son téléphone.

## Jalon 1 — Design

- Maquettes des 7 écrans (voir [design-brief.md](design-brief.md))
- Choix de la direction artistique et de l'animation d'ouverture
- `tokens.css` extrait des maquettes

## Jalon 2 — Les cartes

- Invitation, mot, coupon
- Carte scellée + compte à rebours
- Bouton de réponse WhatsApp
- Animation d'ouverture, avec `prefers-reduced-motion`

Fin du jalon : première vraie carte envoyée.

## Jalon 3 — Journal

- Archivage à l'ouverture, dédoublonnage
- Seuil (mot secret)
- Liste, relecture, coupons marqués utilisés
- `manifest.json` pour l'ajout à l'écran d'accueil

## Jalon 4 — Studio

- Formulaire par type, aperçu temps réel
- Carnet d'idées (`data/*.json`) piochable
- Copier le lien, partager via l'API native

Fin du jalon : je compose et j'envoie depuis mon téléphone, sans passer par le code.

## Plus tard

- Carte **vote** (« on mange quoi samedi ? »)
- Raccourcisseur de lien maison pour masquer le payload
- Export du journal en PDF, à imprimer
- Sons et vibrations à l'ouverture
