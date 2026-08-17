# Concept

## En une phrase

Un lien = une carte. Je lui envoie un lien par message, il ouvre une page plein écran
faite pour être regardée, pas naviguée.

## Les deux usages

**Elle** reçoit un lien, l'ouvre, lit, répond en un tap. Chaque carte ouverte s'archive
toute seule dans son *journal*. Au bout de six mois, le journal est l'objet qui a de la valeur.

**Moi** j'ouvre le *studio* depuis mon téléphone, je choisis un type de carte, je remplis
trois champs (en piochant dans mon carnet d'idées si je sèche), je copie le lien, je l'envoie.

## Les trois zones

| Route | Pour qui | Rôle |
|---|---|---|
| `#/c=<payload>` | elle | La carte. Lecture seule, une animation, un bouton. |
| `#/journal` | elle | L'archive des cartes reçues. Derrière le mot secret. |
| `#/studio` | moi | Composer une carte, copier le lien. Non listé. |

Racine (`#/`) → dernière carte reçue, ou écran d'accueil si le journal est vide.

## Types de cartes (v1)

| Type | Contenu | Action |
|---|---|---|
| **Invitation** | date, heure, lieu, note libre, indice optionnel | « je viens » → WhatsApp pré-rempli |
| **Mot** | du texte, rien d'autre | aucune, ou « ❤️ » → WhatsApp |
| **Coupon** | un intitulé (« bon pour un petit déj au lit »), validité optionnelle | « je l'utilise » → marqué utilisé dans le journal |

Le **vote** (« on mange quoi samedi ? ») est écarté de la v1, gardé en idée.

## Décisions prises

| Sujet | Choix | Pourquoi |
|---|---|---|
| Transport du contenu | Encodé dans l'URL | Envoi instantané depuis le téléphone, rien de publié sur GitHub, aucun redéploiement |
| Médias | Texte uniquement | Tient dans une URL, et sert la direction éditoriale |
| Réponse | Bouton → WhatsApp pré-rempli | Un seul tap, la réponse arrive là où on se parle déjà |
| Archive | `localStorage` sur son téléphone | Le journal se construit tout seul |
| Carnet d'idées | JSON dans le dépôt | C'est mon outil à moi, il n'a rien à faire dans le lien |
| Carte scellée | Date d'ouverture dans le lien | Crée de l'attente pour presque rien |
| Mot secret | Seulement pour le journal | Les cartes s'ouvrent librement, l'archive est protégée |

## Non-objectifs

- Pas de comptes, pas de serveur, pas de base de données.
- Pas de desktop. Le design est pensé pour un écran tenu à la main.
- Pas de notifications : c'est moi qui envoie le lien, c'est ça la notification.
- Pas de synchronisation entre nos deux téléphones. Son journal est à elle.
