# Concept — Pli

## En une phrase

Un lien = un pli. Je lui envoie un lien par message, elle trouve une feuille fermée,
elle la tire du doigt, le message se découvre.

## Vocabulaire

Dans l'interface, l'objet s'appelle un **pli**. Dans le code et dans cette documentation,
on dit aussi **pli** — le mot est clair et le design l'a imposé partout. Le mot « carte »
du premier brainstorm est abandonné.

Le lexique du produit est fermé et normatif, il est dans
[design-system.md](design-system.md#ton-et-vocabulaire). Un ajout depuis le design :
le lieu où je dépose s'appelle l'**atelier** — pas « studio », pas « créateur ».

## Les deux personnes

**Elle** reçoit un lien, l'ouvre, lit. Sur une invitation, elle répond en un tap.
Chaque pli déplié rejoint son **journal**, sur son téléphone. Au bout de six mois,
le journal est l'objet qui a de la valeur.

**Moi** j'ouvre l'**atelier**, je choisis un type, je remplis trois lignes, je copie
le lien, je l'envoie. Sauf pour le poème, que j'écris à mon bureau dans un fichier.

Ce sont deux personnes, pas deux rôles ouverts au public. Pli n'est pas un produit
publiable : pas de comptes, pas de modération, pas d'inscription.

## Les deux entrées

| Entrée | Pour qui | Rôle |
|---|---|---|
| `leo-bernard38.github.io/Pli/` | elle | Les plis reçus, et le journal |
| `leo-bernard38.github.io/Pli/atelier/` | moi | Déposer un pli, fabriquer le lien |

Deux points d'entrée, deux bundles distincts. L'atelier ne se charge jamais sur son
téléphone. Le détail des routes est dans [architecture.md](architecture.md#routage).

L'atelier demande une fois **notre date d'officialisation** avant de s'ouvrir. C'est un
paillasson, pas une serrure : ça écarte le curieux, pas quelqu'un qui lit les sources.

## Types de plis

| Type | Contenu | Papier | Réponse |
|---|---|---|---|
| **invitation** | titre, mot, quand, où | crème + bandeau | oui / peut-être / non → WhatsApp |
| **pensée** | une phrase, deux lignes au plus | encre + image pleine | aucune |
| **poème** | plusieurs strophes, à la suite — il défile | encre, sans image | aucune |
| **souvenir** | un titre, une ligne | crème + image pleine | aucune |

Le papier n'est jamais un choix : il découle du type. **Seule l'invitation appelle une
réponse** — les trois autres se lisent et s'archivent.

## Comment un pli voyage

**Les trois types courts voyagent entièrement dans le lien.** Rien n'est stocké nulle part,
l'envoi est instantané et fonctionne hors ligne.

**Le poème est un fichier.** Je l'écris à la main dans un `.md`, une moulinette locale
l'encode, je pousse. Le lien ne porte que son numéro : `leo-bernard38.github.io/Pli/#p=015-vhtq`. C'est ce qui
permet à un poème d'être long sans produire un lien de deux mille caractères.

Le format des deux est détaillé dans [donnees.md](donnees.md).

## Décisions prises

| Sujet | Choix | Pourquoi |
|---|---|---|
| Transport | Encodé dans l'URL | Envoi instantané, hors ligne, rien de publié, aucun redéploiement |
| Le poème | Fichier encodé dans le dépôt | Seul contenu long ; un lien court quelle que soit sa taille |
| Serveur | Aucun | Rien à héberger, rien à payer, rien à maintenir |
| Médias | Cinq peintures dans le build | Elles ne voyagent pas dans le lien et servent la direction |
| Réponse | Trois mots → WhatsApp pré-rempli | La réponse arrive là où on se parle déjà |
| Journal | `localStorage`, chez elle, sans mot secret | Il se construit tout seul, elle n'a rien à retenir |
| Refermement | Le lien ne s'ouvre qu'une fois | Crée le rituel ; le pli reste lisible dans le journal |
| Atelier | Derrière une date connue de nous deux | Écarte le passant, sans prétendre à la sécurité |
| Chiffrement | Aucun | La compression rend déjà le payload illisible ; chiffrer rallongerait le lien |

## Ce qu'on assume

- **Le refermement est une convention locale.** Il repose sur son navigateur. Un autre
  appareil, un autre navigateur ou une navigation privée rouvrent le pli. À deux, sur son
  téléphone, ça tient — mais l'interface ne doit jamais le présenter comme une serrure.
- **Le contenu n'est pas secret.** Il est illisible et absent de tout serveur et de tout
  index, ce qui suffit ici. Ce n'est pas du chiffrement.
- **Les poèmes vivent dans un dépôt public**, encodés. Illisibles au premier venu,
  décodables par qui s'en donne la peine, et permanents dans l'historique git.
- **Son journal est ouvert.** Sans mot secret, qui prend son téléphone déverrouillé lit
  tous les plis. C'est un choix, pas un oubli.

## Non-objectifs

- Pas de comptes, pas de serveur, pas de base de données.
- Pas de desktop **pour elle**. Le pli est pensé pour un écran tenu à la main.
  L'atelier, lui, a un écran d'ordinateur.
- Pas de notifications : c'est moi qui envoie le lien, c'est ça la notification.
- Pas de synchronisation entre nos deux téléphones. Son journal est à elle, le mien est à moi.
- Pas d'expiration. Un pli archivé ne périme pas.
