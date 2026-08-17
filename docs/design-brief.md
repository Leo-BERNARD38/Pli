# Brief design

À utiliser tel quel comme point de départ dans un outil de design. Le brief pose les
contraintes et les pistes — la direction artistique et l'animation d'ouverture se
tranchent en maquettant, pas ici.

## Contexte

Le produit s'appelle **Pli**. Des cartes envoyées par lien à une seule personne :
invitations à sortir, mots d'amour, coupons. Le design **est** le produit : l'app ne
fait presque rien, elle doit être belle à ouvrir.

Le nom oriente sans obliger : un pli est un objet plié, envoyé, à ouvrir. La piste
d'animation du dépliage part avec une longueur d'avance, mais elle doit gagner à
l'écran, pas par le nom.

## Contraintes dures

- **Mobile uniquement**, une main. Base 390 × 844. Pas de version desktop.
- **Texte seul.** Aucune photo, aucune illustration figurative. Tout l'impact vient de
  la typographie, de la matière et du mouvement.
- **Un seul bouton par carte**, en bas, atteignable au pouce.
- **Aucune navigation visible** sur une carte : ni menu, ni onglet, ni retour.
- Contenu de longueur imprévisible : de 4 mots à 1 500 caractères. La mise en page doit
  tenir aux deux extrêmes.
- Réalisable en CSS/SVG natif, sans librairie.

## Direction

**Papier et encre, mais riche.** Pas la carte de vœux sage : de la matière, de la
couleur, du mouvement, des mises en page qui prennent des risques.

Ce qu'on cherche :

- Papier teinté, avec grain et une trame irrégulière. La couleur du papier change
  selon le type de carte.
- Serif display pour les grandes lignes, une italique pour les respirations, un
  caractère étroit ou un chiffre énorme pour les dates.
- Compositions **éditoriales et asymétriques** : texte qui déborde, blocs décalés,
  filets, numérotation, larges vides. Le bloc centré est l'exception, pas la règle.
- L'encre comme matière : pleins et déliés, diffusion, transparences.

Ce qu'on refuse : cartes ombrées flottant sur un fond, dégradés violets, emoji comme
décor, icônes génériques, tout ce qui ressemble à un formulaire.

## Écrans à produire

| Écran | Note |
|---|---|
| Carte **invitation** | date, heure, lieu, note libre. Bouton « je viens ». Version texte court et texte long. |
| Carte **mot** | texte seul. C'est le test le plus dur : il ne reste que la typo. |
| Carte **coupon** | intitulé, validité. États : à utiliser / utilisé. |
| Carte **scellée** | avant sa date d'ouverture : compte à rebours, contenu invisible. Doit donner envie d'attendre. |
| **Journal** | liste des cartes reçues. Doit se lire comme un sommaire de revue, pas comme un fil. |
| **Seuil** | saisie du mot secret pour entrer dans le journal. Un seul champ. |
| **Studio** | formulaire + aperçu temps réel + bouton copier. Utilitaire, mais pas laid. |

## Système à définir en maquettant

- **Couleur** : une couleur de papier et une couleur d'encre par type de carte
  (invitation / mot / coupon), plus une couleur d'accent unique par carte.
- **Typo** : deux familles maximum. Échelle de 4 tailles, gros écarts.
- **Grille** : marges généreuses, une ligne de base qui tient sur les deux longueurs
  de texte extrêmes.
- **Grain** : intensité, échelle, et coût de rendu (à vérifier sur téléphone réel).

## Pistes d'animation d'ouverture à tester

Le moment où elle ouvre le lien est le point culminant. Quatre pistes à comparer :

1. **L'encre se diffuse** — une goutte se dépose, se diffuse, le texte apparaît dedans mot à mot.
2. **Le pli se déplie** — la carte arrive pliée en trois, se déplie en perspective.
3. **Le sceau se brise** — un cachet de cire, appui long, il se fend.
4. **La page se révèle** — le papier glisse, les lignes montent en décalé.

Critères : tient en moins de 1,2 s, se voit bien à une main, ne se démode pas à la
dixième fois, ne casse pas si le texte est très long.

## Détails qui comptent

- L'animation ne doit jamais retarder la lisibilité : le texte reste sélectionnable et
  présent même si l'animation échoue.
- Respecter `prefers-reduced-motion`.
- Le passage carte → journal doit être un geste discret, pas un bouton bien visible.
- Un coupon utilisé doit rester beau : marqué, pas grisé.
