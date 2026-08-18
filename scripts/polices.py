#!/usr/bin/env python3
"""Sous-ensemble les quatre polices de Pli, depuis polices-source/ vers src/fonts/.

Aucun tiers, jamais : les polices vivent dans le dépôt, pas sur un CDN. Les sources
commitées sont celles de Google Fonts, avec leurs OFL ; ce script en tire les woff2
réellement servis.

    python3 scripts/polices.py

Règle du dossier de sortie : **regénérer, jamais retoucher.** src/fonts/ est réécrit en
entier à chaque passage — comme public/icones/ l'est par scripts/icones.py.

Ce que le script produit, et pourquoi (docs/ressources.md#les-polices) :

    pinyon-script.woff2       la marque « Pli », et la griffe — du texte libre
    newsreader-italique.woff2 la voix : italique 300, statique
    space-mono-700.woff2      les étiquettes — minuscules ET capitales, voir plus bas
    bodoni-moda-700.woff2     les titres, graisse 700, axe opsz seul
    bodoni-moda-800.woff2     les titres, graisse 800, axe opsz seul

Dépendances : fonttools, brotli.
"""

import argparse
import io
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

# — la plage de caractères ——————————————————————————————————————————
# Latin + ponctuation française. Elle vient telle quelle de l'exemple de
# docs/ressources.md#les-polices, et elle vaut pour les quatre familles : Bodoni porte
# aussi le titre en cours de frappe dans l'atelier, du texte libre en casse normale, et
# le réduire à « capitales, chiffres, ponctuation » casserait un titre accentué.
# U+2013-2014 s'ajoute à l'exemple de ressources.md, qui l'oubliait : docs/chargement.md
# nomme « — » dans la ponctuation française à garder, et la voix est du texte libre.
PLAGE = "U+0020-007E,U+00A0-00FF,U+0152-0153,U+0178,U+2013-2014,U+2018-201D,U+2026,U+202F"

# kern pour l'approche, liga pour les ligatures, ccmp pour les accents composés.
FONCTIONS = ["kern", "liga", "ccmp"]

# — les cinq fichiers à produire ————————————————————————————————————
# instances : les axes à figer. axes_gardes : ceux qui survivent, s'il y en a.
#
# « Une famille, une graisse, un style — pas de fichier variable multi-axes, sauf Bodoni
# dont on ne garde que l'axe opsz. » (docs/ressources.md)
SORTIES = [
    {
        "sortie": "pinyon-script.woff2",
        "source": "pinyon-script/PinyonScript-Regular.ttf",
        "instances": {},
    },
    {
        "sortie": "newsreader-italique.woff2",
        "source": "newsreader/Newsreader-Italic[opsz,wght].ttf",
        # opsz figé à 18, la valeur par défaut de la police elle-même : la voix est
        # composée entre 23 et 31px, juste au-dessus. Newsreader ne garde pas d'axe.
        "instances": {"wght": 300, "opsz": 18},
    },
    {
        "sortie": "space-mono-700.woff2",
        "source": "space-mono/SpaceMono-Bold.ttf",
        "instances": {},
    },
    {
        "sortie": "bodoni-moda-700.woff2",
        "source": "bodoni-moda/BodoniModa[opsz,wght].ttf",
        # wght figé, opsz gardé : le navigateur l'accorde tout seul à la taille du texte
        # (font-optical-sizing: auto). Un fichier multi-axes coûterait le double pour un
        # réglage qu'on ne bouge jamais à la main.
        "instances": {"wght": 700},
    },
    {
        "sortie": "bodoni-moda-800.woff2",
        "source": "bodoni-moda/BodoniModa[opsz,wght].ttf",
        "instances": {"wght": 800},
    },
]


def sous_ensembler(source: Path, sortie: Path, instances: dict[str, float]) -> None:
    """Fige les axes demandés, puis ne garde que la plage de caractères du produit."""
    police = TTFont(source, recalcTimestamp=False)

    if instances:
        if "fvar" not in police:
            raise SystemExit(f"{source.name} n'est pas variable : rien à figer.")
        connus = {axe.axisTag for axe in police["fvar"].axes}
        inconnus = set(instances) - connus
        if inconnus:
            raise SystemExit(f"{source.name} n'a pas l'axe {', '.join(sorted(inconnus))}.")
        # updateFontNames reste faux : il exige une valeur STAT pour chaque axe figé,
        # et Newsreader n'en déclare pas pour opsz 18. Le nom de famille ne sert de
        # toute façon à rien ici — le CSS nomme les familles lui-même.
        police = instantiateVariableFont(police, instances)
        # Un aller-retour par la mémoire : l'instanciateur laisse des tables paresseuses
        # incomplètes que le sous-ensembleur ne sait pas relire (gvar sans entrée pour un
        # glyphe sans delta). Recharger remet tout à plat.
        memoire = io.BytesIO()
        police.save(memoire)
        police.close()
        police = TTFont(memoire, recalcTimestamp=False)

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = FONCTIONS
    options.notdef_outline = True
    # 13 et 14 sont le texte de la licence et son adresse. fontTools ne garde que 0 à 6 :
    # sans ça, le woff2 servi partirait sans sa licence, alors qu'il est sous OFL.
    options.name_IDs += [13, 14]
    # Le bytecode TrueType part avec le reste : ni CoreText (iOS) ni FreeType tel que
    # Chrome l'emploie sur Android ne l'exécutent à ces corps, et il pèse un tiers du
    # fichier sur Pinyon. Deux appareils connus, pas le web (docs/architecture.md).
    options.hinting = False
    # Les tables de maths et de couleur ne servent à rien ici, et pèsent.
    options.drop_tables += ["MATH", "SVG "]

    sous_ensemble = subset.Subsetter(options=options)
    sous_ensemble.populate(unicodes=subset.parse_unicodes(PLAGE))
    sous_ensemble.subset(police)

    sortie.parent.mkdir(parents=True, exist_ok=True)
    # C'est bien ici que le woff2 se décide : options.flavor ne guide que la ligne de
    # commande de fontTools, jamais save(). Sans cette ligne, on écrit un ttf déguisé.
    police.flavor = options.flavor
    police.save(sortie)
    police.close()


def couverture(sortie: Path) -> tuple[int, bool, bool]:
    """Ce que le fichier produit contient vraiment : glyphes, minuscules, capitales."""
    police = TTFont(sortie, lazy=True)
    table = police.getBestCmap()
    police.close()
    return len(table), ord("a") in table, ord("A") in table


def main() -> int:
    depart = Path(__file__).resolve().parent.parent
    arguments = argparse.ArgumentParser(description=__doc__)
    arguments.add_argument("--source", type=Path, default=depart / "polices-source")
    arguments.add_argument("--sortie", type=Path, default=depart / "src" / "fonts")
    lu = arguments.parse_args()

    if not lu.source.is_dir():
        raise SystemExit(f"{lu.source} est introuvable — les sources ne sont pas là.")

    # Les cinq sources d'abord : un échec à mi-parcours ne doit pas laisser derrière lui
    # un src/fonts/ à moitié écrit.
    for fichier in SORTIES:
        source = lu.source / fichier["source"]
        if not source.is_file():
            raise SystemExit(f"{source} est introuvable.")

    # Regénérer, jamais retoucher — mais on n'efface que ce que ce script a écrit. Un
    # rmtree sur un chemin passé en argument effacerait public/plis/ à une faute de frappe
    # près, et le nom d'un fichier de poème est une adresse publique définitive.
    attendus = {fichier["sortie"] for fichier in SORTIES}
    if lu.sortie.exists():
        etrangers = sorted(p.name for p in lu.sortie.iterdir() if p.name not in attendus)
        if etrangers:
            raise SystemExit(
                f"{lu.sortie} contient autre chose que les polices : {', '.join(etrangers)}."
            )
        for reste in lu.sortie.iterdir():
            reste.unlink()

    total = 0
    for fichier in SORTIES:
        source = lu.source / fichier["source"]
        sortie = lu.sortie / fichier["sortie"]
        sous_ensembler(source, sortie, fichier["instances"])

        poids = sortie.stat().st_size
        total += poids
        glyphes, minuscules, capitales = couverture(sortie)
        casse = "aA" if minuscules and capitales else ("a" if minuscules else "A")
        print(f"{poids / 1024:7.1f} ko  {glyphes:4d} glyphes  {casse:2}  {fichier['sortie']}")

    print(f"{total / 1024:7.1f} ko  au total")

    # Le piège nommé par docs/ressources.md : les étiquettes passent en capitales par
    # text-transform, donc Space Mono doit garder les deux casses malgré ce que montrent
    # les écrans. On le vérifie ici plutôt que de le découvrir sur son téléphone.
    glyphes, minuscules, capitales = couverture(lu.sortie / "space-mono-700.woff2")
    if not (minuscules and capitales):
        raise SystemExit("space-mono-700 a perdu une casse : text-transform n'aurait rien à transformer.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
