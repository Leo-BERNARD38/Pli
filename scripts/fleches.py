#!/usr/bin/env python3
"""Dessine les deux flèches de Pli, et écrit le fragment que les documents portent.

    python3 scripts/fleches.py

`↑` et `→` ne sont plus des caractères : ce sont deux tracés SVG inline, définis une fois
par document et appelés par `<use>` — zéro requête, zéro dépendance à une police, et
Bodoni n'est plus nécessaire avant A2 (docs/ressources.md#les-deux-flèches).

**Bodoni Moda n'a ni `↑` ni `→`.** Ni la source d'origine, ni les sous-ensembles `math` et
`symbols` que Google sert : le `↑` des maquettes était tracé par la police de secours du
système. Il n'y avait donc aucun dessin d'origine à reprendre, et les deux flèches sont
dessinées ici, à la manière didone — mais **aucun chiffre n'est estimé** :

- les épaisseurs viennent de Bodoni Moda mesuré à la coupe où la flèche vit
  (graisse 700, `opsz` 22, la taille de `.action .fleche`) — hampe, délié, empattement ;
- les proportions viennent du `↑` de Space Mono Bold, la seule vraie flèche des polices
  du produit — rapport hauteur/largeur, part de la tête, profondeur de l'encoche.

Les flancs de la tête sont **droits** : une concavité aurait demandé un chiffre que
personne n'a mesuré. Ce qui fait le didone ici est le contraste entre la tête pleine et
les déliés de l'encoche, et l'empattement plat non ramifié du pied.

Le `→` est le `↑` tourné d'un quart de tour : même dessin, comme la doc l'exige.

Dépendances : freetype-py, numpy.
"""

import argparse
import sys
from pathlib import Path

import freetype
import numpy as np

# — les deux coupes de référence ————————————————————————————————————
# .action .fleche est composée à 22px (design/handoff/pli.css §4) ; avec
# font-optical-sizing: auto le navigateur pose opsz sur la taille en px. On mesure donc
# Bodoni exactement là où la flèche se serait tenue.
BODONI_GRAISSE, BODONI_OPSZ = 700, 22
EM = 1000  # toutes les coordonnées sont en millièmes de cadratin


def rendre(chemin: Path, caractere: str, coords: list[int] | None = None) -> np.ndarray:
    """Le glyphe en niveaux de gris, à un cadratin de 1000 pixels."""
    police = freetype.Face(str(chemin))
    if coords:
        police.set_var_design_coords(coords)
    police.set_char_size(EM * 64)
    police.load_char(caractere, freetype.FT_LOAD_RENDER)
    image = police.glyph.bitmap
    # pitch, pas width : les lignes du bitmap sont complétées, et reformer sur la largeur
    # décale tout d'une ligne à l'autre.
    tableau = np.array(image.buffer, dtype=np.uint8).reshape(image.rows, image.pitch)
    return tableau[:, : image.width]


def plus_long(vecteur: np.ndarray, seuil: int = 128) -> int:
    """La plus longue suite d'encre — l'épaisseur d'un trait, sans compter les à-côtés."""
    meilleur = courant = 0
    for allume in vecteur > seuil:
        courant = courant + 1 if allume else 0
        meilleur = max(meilleur, courant)
    return meilleur


def etendue(ligne: np.ndarray, seuil: int = 128) -> int:
    """De la première à la dernière encre — la largeur occupée, encoches comprises."""
    encre = np.nonzero(ligne > seuil)[0]
    return 0 if encre.size == 0 else int(encre[-1] - encre[0] + 1)


def mesurer_bodoni(source: Path) -> dict[str, float]:
    """Les épaisseurs du didone : la hampe, le délié, l'empattement."""
    coords = [BODONI_GRAISSE, BODONI_OPSZ]  # l'ordre des axes est wght puis opsz
    i, o = rendre(source, "I", coords), rendre(source, "O", coords)
    capitale = i.shape[0]
    hampe = plus_long(i[capitale // 2])
    # à 6 % de la largeur, on est dans la dalle de l'empattement, pas sur sa pointe
    empattement_ep = plus_long(i[:, int(i.shape[1] * 0.06)])
    largeur_o = o.shape[1]
    delie = min(
        plus_long(o[:, x]) for x in range(int(largeur_o * 0.42), int(largeur_o * 0.58))
    )
    return {
        "capitale": capitale,
        "hampe": hampe,
        "delie": delie,
        "empattement_ep": empattement_ep,
        "empattement_larg": i.shape[1],
    }


def mesurer_squelette(source: Path) -> dict[str, float]:
    """Les proportions d'une vraie flèche : celle de Space Mono, en parts de sa hauteur."""
    fleche = rendre(source, "↑")
    hauteur, largeur = fleche.shape
    hampe = plus_long(fleche[int(hauteur * 0.9)])

    # la tête : tant que la ligne est plus large que la hampe, on y est encore
    lignes_tete = [r for r in range(hauteur) if etendue(fleche[r]) > hampe * 1.3]
    bas_tete = max(lignes_tete)
    base_tete = max(etendue(fleche[r]) for r in lignes_tete)

    # l'encoche : là où le dessous du barbillon rejoint la hampe, au-dessus des pointes
    pointes = max(r for r in lignes_tete if etendue(fleche[r]) >= base_tete * 0.98)
    encoche = bas_tete - pointes

    return {
        "rapport_largeur": largeur / hauteur,
        "part_tete": (bas_tete + 1) / hauteur,
        "part_base_tete": base_tete / largeur,
        "part_encoche": encoche / hauteur,
    }


def tracer(bodoni: dict[str, float], squelette: dict[str, float]) -> list[tuple[float, float]]:
    """Le contour du `↑`, centré dans une boîte de 1000 × 1000.

    Centré, et non posé sur la ligne de pied : la flèche ne vit jamais au fil du texte,
    toujours dans une rangée alignée au centre — `.action`, `.oui button`, `.bouton`
    (design/handoff/pli.css §4 et §6). Et un dessin centré tourne sans se déplacer.
    """
    capitale = bodoni["capitale"]
    sommet = (EM - capitale) / 2
    pied = sommet + capitale
    axe = EM / 2

    largeur = capitale * squelette["rapport_largeur"]
    demi_tete = largeur * squelette["part_base_tete"] / 2
    bas_tete = sommet + capitale * squelette["part_tete"]
    encoche = capitale * squelette["part_encoche"]
    epaule = bas_tete - encoche  # où le dessous du barbillon rejoint la hampe

    demi_hampe = bodoni["hampe"] / 2
    demi_empattement = bodoni["empattement_larg"] / 2
    haut_empattement = pied - bodoni["empattement_ep"]

    gauche, droite = axe - demi_hampe, axe + demi_hampe
    return [
        (axe, sommet),                              # la pointe
        (axe + demi_tete, bas_tete),                # le barbillon droit, flanc droit
        (droite, epaule),                           # son dessous, en délié
        (droite, haut_empattement),                 # la hampe, en plein
        (axe + demi_empattement, haut_empattement), # l'empattement, plat et non ramifié
        (axe + demi_empattement, pied),
        (axe - demi_empattement, pied),
        (axe - demi_empattement, haut_empattement),
        (gauche, haut_empattement),
        (gauche, epaule),
        (axe - demi_tete, bas_tete),
        (axe, sommet),
    ]


def chemin(points: list[tuple[float, float]], quart_de_tour: bool = False) -> str:
    """Le `d` d'un tracé. Le quart de tour fabrique le `→` : même dessin, tourné."""
    if quart_de_tour:
        points = [(EM - y, x) for x, y in points]
    lettres = [f"M{points[0][0]:.1f} {points[0][1]:.1f}"]
    lettres += [f"L{x:.1f} {y:.1f}" for x, y in points[1:-1]]
    return "".join(lettres) + "Z"


FRAGMENT = """<!-- Les deux flèches du produit, écrites par scripts/fleches.py.
     L'unique exception au « pas de SVG », nommée et fermée
     (docs/design-system.md#ton-et-vocabulaire). On ne les retouche pas : on regénère.
     width et height à zéro sur le conteneur : un <svg> sans dimension occupe 300 × 150
     avant toute feuille de style, et display:none casserait le <use> sur WebKit. -->
<svg class="fleches" width="0" height="0" aria-hidden="true" focusable="false"><defs>
  <symbol id="fleche-haut" viewBox="0 0 1000 1000"><path d="{haut}"/></symbol>
  <symbol id="fleche-droite" viewBox="0 0 1000 1000"><path d="{droite}"/></symbol>
</defs></svg>
"""

# Les documents susceptibles de porter le fragment. Un `@import` sérialiserait ce qu'il
# charge et 404.html ne dépend d'aucun fichier empreinté : les flèches vivent donc inline,
# dans chaque document qui s'en sert. On ne vérifie que ceux qui les appellent déjà —
# l'atelier les prendra au jalon 5, quand D0 lui donnera un écran.
DOCUMENTS = ["index.html", "atelier/index.html", "public/404.html"]


def main() -> int:
    depart = Path(__file__).resolve().parent.parent
    arguments = argparse.ArgumentParser(description=__doc__)
    arguments.add_argument("--source", type=Path, default=depart / "polices-source")
    arguments.add_argument("--sortie", type=Path, default=depart / "src" / "fleches.html")
    lu = arguments.parse_args()

    bodoni = mesurer_bodoni(lu.source / "bodoni-moda" / "BodoniModa[opsz,wght].ttf")
    squelette = mesurer_squelette(lu.source / "space-mono" / "SpaceMono-Bold.ttf")

    print(f"Bodoni {BODONI_GRAISSE}, opsz {BODONI_OPSZ} — les épaisseurs")
    for nom, valeur in bodoni.items():
        print(f"   {nom:18} {valeur / EM:.4f} em")
    print(f"   {'contraste':18} {bodoni['hampe'] / bodoni['delie']:.1f} : 1")
    print("Space Mono ↑ — les proportions")
    for nom, valeur in squelette.items():
        print(f"   {nom:18} {valeur:.3f}")

    points = tracer(bodoni, squelette)
    fragment = FRAGMENT.format(
        haut=chemin(points), droite=chemin(points, quart_de_tour=True)
    )
    lu.sortie.parent.mkdir(parents=True, exist_ok=True)
    lu.sortie.write_text(fragment, encoding="utf-8")
    print(f"\n{len(fragment.encode()):d} octets  {lu.sortie.relative_to(depart)}")

    # Le fragment vit inline dans trois documents : un `@import` sérialiserait ce qu'il
    # charge, et 404.html ne dépend d'aucun fichier empreinté. La copie ne doit pas
    # diverger sans qu'on le sache — on le dit ici plutôt que de le découvrir à l'écran.
    def serre(texte: str) -> str:
        """Sans les blancs : le fragment se réindente selon le document qui le porte."""
        return "".join(texte.split())

    corps = serre(fragment.split("<svg", 1)[1].rsplit("</svg>", 1)[0])
    en_retard = []
    for nom in DOCUMENTS:
        document = depart / nom
        if not document.is_file():
            continue
        texte = document.read_text(encoding="utf-8")
        appelle = "#fleche-" in texte.replace('id="fleche-', "")
        porte = 'id="fleche-haut"' in texte
        if porte and corps not in serre(texte):
            en_retard.append(f"{nom} (le tracé a divergé)")
        elif appelle and not porte:
            en_retard.append(f"{nom} (appelle une flèche sans porter les défs)")
    if en_retard:
        print(f"\nà remettre à jour : {', '.join(en_retard)}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
