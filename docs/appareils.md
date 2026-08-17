# Appareils

## Deux appareils connus, et un troisième navigateur

| Qui | Appareil | Navigateur |
|---|---|---|
| elle | iPhone, iOS 26 | Safari 26 |
| moi | Android 16 | Chrome |
| — | les deux | **le navigateur intégré de WhatsApp** |

Les deux premières lignes étaient connues. **La troisième est celle qui décide de tout** :
un pli arrive par WhatsApp, et un lien tapé dans WhatsApp ne s'ouvre pas forcément dans
Safari. Les navigateurs intégrés aux applications sont cloisonnés — leur stockage n'est pas
celui du navigateur du système.

Ne pas cibler « le web » reste la bonne décision : toutes les API modernes sont disponibles
sans préfixe, sans polyfill, sans repli ([architecture.md](architecture.md#compatibilité)).
Ce qui change ici, c'est qu'il faut savoir **où** le produit s'exécute réellement.

## Le bac de stockage — la mesure qui manque

Son journal vit en `localStorage`. Trois bacs possibles, qui ne se parlent pas :

| Où le pli s'ouvre | Le journal s'écrit | Effacement à 7 jours | Écran d'accueil |
|---|---|---|---|
| Safari | bac de Safari | oui | possible |
| navigateur intégré de WhatsApp | bac de ce navigateur | oui, et sans exemption | impossible |
| l'app ajoutée à l'écran d'accueil | son propre bac | **non** — c'est l'exemption | déjà fait |

[architecture.md](architecture.md#le-journal-peut-être-effacé) pose l'ajout à l'écran
d'accueil comme le remède au plafond de sept jours de WebKit. Ce remède ne tient que si les
plis s'ouvrent **dans le même bac** que l'app installée — or, sur iOS, un lien tapé dans une
conversation n'ouvre jamais une app installée depuis l'écran d'accueil.

**Deux questions, une seule séance de mesure**, à faire avant de bâtir l'écran `#/installer` :

1. **Où un lien de WhatsApp s'ouvre-t-il sur son iPhone ?** Safari, ou le navigateur intégré ?
   Y a-t-il un réglage, et lequel est actif chez elle ?
2. **Le journal écrit depuis Safari est-il visible depuis l'app ajoutée à l'écran d'accueil ?**
   Ouvrir un pli dans Safari, ajouter à l'écran d'accueil, ouvrir l'app, regarder le journal.

Selon la réponse, l'écran `#/installer` change de sens — ou disparaît au profit d'un « ouvrir
dans Safari » et d'un export plus sérieux. Ce que l'installation apporte par ailleurs
(cadence, plein écran, écran de lancement) est dans [installation.md](installation.md).

Une atténuation existe déjà, et elle n'est pas rien : **le compteur des sept jours se remet à
zéro à chaque visite.** Le risque réel n'est pas le silence, c'est une dizaine de jours sans
un seul pli.

### Reconnaître un navigateur intégré

Sans prétendre à l'exactitude — c'est un indice, jamais une garantie :

- **iOS** : l'agent utilisateur d'un navigateur intégré ne porte pas `Version/… Safari/…`.
- **Android** : l'agent utilisateur porte `wv`.

Ce que ça autorise : une ligne discrète, une seule fois, « à ouvrir dans Safari pour garder
tes plis ». Ce que ça n'autorise pas : refuser d'afficher le pli. Le pli s'ouvre toujours,
partout.

## Les réglages de page

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#E9E2D2">
```

| Réglage | Rôle |
|---|---|
| `viewport-fit=cover` + `env(safe-area-inset-*)` | encoche et barre d'accueil — portés par **le plateau**, jamais par le pli |
| `100dvh` et jamais `100vh` | la barre d'URL se rétracte au premier mouvement et change la hauteur |
| `-webkit-text-size-adjust: 100%` | iOS regrossit le texte à la rotation sans ça |
| `-webkit-tap-highlight-color: transparent` | le rectangle gris au tap n'existe pas dans ce produit |
| `touch-action: manipulation` sur les actions | supprime l'attente du double-tap |
| `color-scheme: light` | Pli a ses encres ; il n'a pas de thème sombre |
| `overscroll-behavior: none` | le « tirer pour rafraîchir » de Chrome ([fluidite.md](fluidite.md#les-entrées)) |

Le pli fait 360 × 780 et ne s'élargit jamais : il ne touche aucun bord, donc **aucune encoche
ne le concerne**. C'est le plateau autour de lui qui porte les retraits de sécurité.

## L'atelier, sur mon téléphone

C'est le seul endroit avec un clavier, donc le seul avec des pièges de saisie.

- `inputmode` et `enterkeyhint` sur chaque champ — la touche de validation doit dire ce
  qu'elle fait.
- `autocapitalize="sentences"`, `autocorrect` laissé actif : j'écris du français.
- **Le clavier recouvre le champ** : suivre `visualViewport` et remonter la zone active.
  C'est le seul cas du produit où la hauteur visible n'est pas la hauteur de la fenêtre.
- Aucun `autocomplete` : rien de ce que j'écris ne ressemble à un formulaire.

## Le bureau

E1, 1440 × 900, pour moi seulement ([parcours.md](parcours.md)). Les événements pointeur
couvrent la souris sans une ligne de plus, et le chemin clavier reste celui de tout le monde
— c'est déjà l'alternative obligatoire au geste
([design-system.md](design-system.md#accessibilité)).

Pas de desktop **pour elle** : le pli est pensé pour un écran tenu à la main.

## La séance de test, appareil par appareil

À faire une fois au jalon 1, puis à chaque fin de jalon.

**Sur son iPhone**, en partant d'un lien reçu dans WhatsApp — jamais d'une URL tapée :

- [ ] où le lien s'ouvre : Safari, ou navigateur intégré
- [ ] le texte d'A1 arrive en moins d'une seconde, cache vide
- [ ] dix dépliages d'affilée, aucun accroc ([fluidite.md](fluidite.md#comment-on-mesure))
- [ ] le journal survit à la fermeture de l'onglet, puis à un redémarrage
- [ ] le passage vers WhatsApp, et le retour : A4 est toujours là
   ([partage.md](partage.md#le-retour))
- [ ] ajout à l'écran d'accueil, puis journal encore visible ?
      ([installation.md](installation.md#vérifier-une-installation))
- [ ] navigation privée : le pli s'affiche, il n'est simplement pas archivé

**Sur mon Android** :

- [ ] la vignette d'aperçu apparaît avant l'envoi ([partage.md](partage.md#vérifier-un-aperçu))
- [ ] le geste tient la cadence de la dalle
- [ ] l'atelier au clavier : les trois lignes se saisissent sans que le champ se cache
- [ ] partage natif et copie du lien, tous les deux
- [ ] le lien le plus long autorisé arrive entier chez elle
   ([architecture.md](architecture.md#la-longueur-du-lien))

**Jamais sur un émulateur.** Le grain, le coût des couches et le comportement du clavier n'y
ressemblent à rien.
