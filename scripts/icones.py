#!/usr/bin/env python3
"""Fabrique les icônes de Pli depuis une seule source : le P de Pinyon Script.

Écrit exactement ce qui est servi, et rien de plus : l'onglet, l'écran d'accueil, le
manifeste, l'aperçu du lien. Les balises du <head> qui vont avec sont dans
docs/installation.md.

    python3 scripts/icones.py --pinyon PinyonScript-Regular.ttf \
                             --space-mono SpaceMono-Bold.ttf \
                             --og design/handoff/icones/og.png \
                             --sortie public/icones

Les deux polices sont des Google Fonts, sous licence ouverte, à récupérer une fois :
    https://github.com/google/fonts/tree/main/ofl/pinyonscript
    https://github.com/google/fonts/tree/main/ofl/spacemono

Règle du dossier : **regénérer, jamais retoucher.** Ce fichier est la planche.

Dépendances : freetype-py, pillow, numpy, fonttools.
"""

import argparse, ctypes, io, struct
from pathlib import Path

import freetype
import numpy as np
from freetype import FT_Outline_Embolden
from PIL import Image

# — les trois encres, et rien d'autre ————————————————————————————————
CARMIN = (200, 30, 51)      # #C81E33
CREME  = (247, 242, 232)    # #F7F2E8
ENCRE  = (20, 16, 14)       # #14100E

# — le gabarit de l'icône ——————————————————————————————————————————
GRILLE  = 64                # tout se pense sur une grille de 64
ANCRE_X = 29                # la lettre est centrée sur 29, pas sur 32 : sa panse et sa
                            # queue compensent le décalage. Le handoff dit 30 dans son
                            # texte et dans ses SVG, mais ses PNG — ceux qui ont été vus
                            # et validés — sont à 29. On suit les PNG, et les deux
                            # familles de fichiers s'accordent enfin.

# corps · ligne de base · grade optique, par taille de tirage.
# Le grade est une épaisseur ajoutée au tracé, pour que la lettre tienne au petit.
# Les valeurs viennent du handoff ; épaissir le tracé de FreeType d'autant redonne,
# à l'œil, le noir des tirages validés — comparé taille par taille.
GRADES = [
    (16,  58, 48.5, 1.25),
    (32,  56, 48.0, 0.80),
    (48,  54, 47.7, 0.55),
    (64,  53, 47.5, 0.35),
    (10**9, 52, 47.0, 0.00),
]

# le pied de l'aperçu du lien — ce qui remplace « une seule lecture »
OG_PIED_CARMIN = "PLI.RE"
OG_PIED_ENCRE  = "POUR TOI SEULE"
OG_CORPS, OG_TRACKING = 16, 4.0     # Space Mono 700, 0,25 em — mesurés sur l'original
OG_BASE, OG_GAUCHE = 539, 97        # bas des capitales, marge de gauche
OG_BANDE = (520, 550)               # la bande à réécrire
OG_SOURCE = 36                      # d'où recopier le fond : multiple de 4, le grain a ce pas


def grade(taille):
    for seuil, corps, base, g in GRADES:
        if taille <= seuil:
            return corps, base, g
    raise AssertionError


# — la lettre ———————————————————————————————————————————————————————

def _face(chemin, corps_px):
    f = freetype.Face(str(chemin))
    f.set_char_size(int(round(corps_px * 64)))
    return f


def lettre(pinyon, taille, corps, base, g, echelle=1.0, ss=4):
    """Le P, rendu en niveaux de gris sur un carré de `taille`, sans fond."""
    face = _face(pinyon, corps * echelle * taille / GRILLE * ss)
    face.load_char("P", freetype.FT_LOAD_NO_BITMAP)
    slot = face.glyph
    if g:
        FT_Outline_Embolden(ctypes.byref(slot.outline._FT_Outline),
                            int(round(g * taille / GRILLE * ss * 64)))
    avance = slot.advance.x / 64.0
    slot.render(freetype.FT_RENDER_MODE_NORMAL)
    b = slot.bitmap
    encre = (np.array(b.buffer, dtype=np.uint8).reshape(b.rows, b.pitch)[:, :b.width]
             if b.rows else np.zeros((0, 0), np.uint8))

    toile = np.zeros((taille * ss, taille * ss), np.uint8)
    x = int(round(ANCRE_X / GRILLE * taille * ss - avance / 2 + slot.bitmap_left))
    y = int(round(base / GRILLE * taille * ss - slot.bitmap_top))
    _poser(toile, encre, x, y)
    return np.array(Image.fromarray(toile).resize((taille, taille), Image.LANCZOS))


def _poser(toile, morceau, x, y):
    if morceau.size == 0:
        return
    y0, x0 = max(0, y), max(0, x)
    m = morceau[y0 - y:, x0 - x:][:toile.shape[0] - y0, :toile.shape[1] - x0]
    zone = toile[y0:y0 + m.shape[0], x0:x0 + m.shape[1]]
    toile[y0:y0 + m.shape[0], x0:x0 + m.shape[1]] = np.maximum(zone, m)


def _aplatir(alpha, fond, trait):
    """Compose la lettre sur son fond plein. Aucun canal alpha en sortie :
    l'arrondi et le masque viennent de la plateforme, pas du fichier."""
    a = (alpha.astype(np.float32) / 255.0)[..., None]
    img = np.array(fond, np.float32) * (1 - a) + np.array(trait, np.float32) * a
    return Image.fromarray(img.round().astype(np.uint8), "RGB")


def carre(pinyon, taille, fond=CARMIN, trait=CREME):
    corps, base, g = grade(taille)
    return _aplatir(lettre(pinyon, taille, corps, base, g), fond, trait)


def carre_masque(pinyon, taille, rayon_sur=0.33):
    """La variante masquable. Android recadre en cercle : on rentre toute
    l'encre dans un disque centré, quitte à réduire la lettre."""
    corps, base, _ = grade(10**9)
    bas, haut = 0.40, 1.00
    for _ in range(24):
        e = (bas + haut) / 2
        a = _centrer(lettre(pinyon, taille, corps, base, 0.0, echelle=e))
        if _rayon_max(a) > rayon_sur * taille:
            haut = e
        else:
            bas = e
    a = _centrer(lettre(pinyon, taille, corps, base, 0.0, echelle=bas))
    return _aplatir(a, CARMIN, CREME), bas, _largeur(a) / taille


def _bbox(alpha):
    ys, xs = np.where(alpha > 40)
    return xs.min(), ys.min(), xs.max(), ys.max()


def _largeur(alpha):
    x0, _, x1, _ = _bbox(alpha)
    return x1 - x0 + 1


def _centrer(alpha):
    x0, y0, x1, y1 = _bbox(alpha)
    dx = int(round((alpha.shape[1] - 1 - x1 - x0) / 2))
    dy = int(round((alpha.shape[0] - 1 - y1 - y0) / 2))
    out = np.zeros_like(alpha)
    _poser(out, alpha[y0:y1 + 1, x0:x1 + 1], x0 + dx, y0 + dy)
    return out


def _rayon_max(alpha):
    ys, xs = np.where(alpha > 40)
    c = (alpha.shape[0] - 1) / 2
    return float(np.sqrt((xs - c) ** 2 + (ys - c) ** 2).max())


# — le tracé, pour les SVG ——————————————————————————————————————————

def trace(pinyon):
    """Le contour du P sur la grille de 64. Aucune police n'est appelée à
    l'affichage : c'est tout l'intérêt."""
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    from fontTools.ttLib import TTFont

    f = TTFont(str(pinyon))
    jeu = f.getGlyphSet()
    nom = f.getBestCmap()[ord("P")]
    corps, base, _ = grade(10**9)
    k = corps / f["head"].unitsPerEm
    x0 = ANCRE_X - f["hmtx"][nom][0] * k / 2
    plume = SVGPathPen(jeu, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
    jeu[nom].draw(TransformPen(plume, (k, 0, 0, -k, x0, base)))
    return plume.getCommands()


SVG = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">\n'
       '  <title>Pli</title>\n{corps}\n</svg>\n')


def svg_carre(d, fond, trait):
    return SVG.format(corps=f'  <rect width="64" height="64" fill="{fond}"/>\n'
                            f'  <path d="{d}" fill="{trait}"/>')


# — l'aperçu du lien ————————————————————————————————————————————————

def mot(space_mono, texte, corps, tracking, ss=4):
    face = _face(space_mono, corps * ss)
    plume, morceaux = 0.0, []
    for c in texte:
        face.load_char(c)
        s = face.glyph
        s.render(freetype.FT_RENDER_MODE_NORMAL)
        b = s.bitmap
        arr = (np.array(b.buffer, dtype=np.uint8).reshape(b.rows, b.pitch)[:, :b.width]
               if b.rows else np.zeros((0, 0), np.uint8))
        morceaux.append((arr, plume + s.bitmap_left, s.bitmap_top))
        plume += s.advance.x / 64.0 + tracking * ss
    largeur, hauteur = int(plume) + 8 * ss, int(corps * ss * 2)
    toile = np.zeros((hauteur, largeur), np.uint8)
    base = int(corps * ss * 1.2)
    for arr, x, haut in morceaux:
        _poser(toile, arr, int(round(x)), base - haut)
    petit = np.array(Image.fromarray(toile).resize((largeur // ss, hauteur // ss), Image.LANCZOS))
    return petit, base // ss


def og(source, space_mono):
    """Réécrit la seule ligne fausse de l'aperçu : « une seule lecture » est
    une promesse que le produit ne tient pas depuis que le journal existe."""
    img = np.array(Image.open(source).convert("RGB")).astype(np.float32)
    y0, y1 = OG_BANDE
    assert OG_SOURCE % 4 == 0, "le grain a un pas de 4 pixels : le décalage doit lui coller"
    img[y0:y1] = img[y0 + OG_SOURCE:y1 + OG_SOURCE]     # du fond propre, grain aligné

    x = OG_GAUCHE
    for texte, teinte in ((OG_PIED_CARMIN, CARMIN), (OG_PIED_ENCRE, (120, 116, 110))):
        alpha, base = mot(space_mono, texte, OG_CORPS, OG_TRACKING)
        ys, xs = np.where(alpha > 8)
        for yy, xx in zip(ys, xs):
            py, px = OG_BASE - base + yy + 1, x - xs.min() + xx
            a = alpha[yy, xx] / 255.0
            img[py, px] = img[py, px] * (1 - a) + np.array(teinte, np.float32) * a
        x += (xs.max() - xs.min() + 1) + 32          # l'espace-mot de l'original
    return Image.fromarray(img.round().astype(np.uint8), "RGB")


# — l'ico, à la main : trois tirages, pas un redimensionnement ————————

def ico(images):
    corps = []
    for im in images:
        tampon = io.BytesIO()
        im.save(tampon, "PNG", optimize=True)
        corps.append(tampon.getvalue())
    tete = struct.pack("<HHH", 0, 1, len(images))
    decalage = len(tete) + 16 * len(images)
    entrees = b""
    for im, c in zip(images, corps):
        entrees += struct.pack("<BBBBHHII", im.width % 256, im.height % 256, 0, 0,
                               1, 32, len(c), decalage)
        decalage += len(c)
    return tete + entrees + b"".join(corps)


MANIFESTE = """{
  "name": "Pli",
  "short_name": "Pli",
  "description": "Un message qui arrive plié.",
  "lang": "fr",
  "dir": "ltr",
  "start_url": "/Pli/",
  "scope": "/Pli/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#F7F2E8",
  "theme_color": "#C81E33",
  "icons": [
    { "src": "/Pli/icones/favicon.svg", "type": "image/svg+xml", "sizes": "any" },
    { "src": "/Pli/icones/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/Pli/icones/icon-512.png", "type": "image/png", "sizes": "512x512" },
    { "src": "/Pli/icones/icon-512-masque.png", "type": "image/png", "sizes": "512x512",
      "purpose": "maskable" }
  ]
}
"""


def main():
    a = argparse.ArgumentParser(description=__doc__)
    a.add_argument("--pinyon", required=True, type=Path)
    a.add_argument("--space-mono", type=Path)
    a.add_argument("--og", type=Path)
    a.add_argument("--sortie", default=Path("public/icones"), type=Path)
    o = a.parse_args()
    o.sortie.mkdir(parents=True, exist_ok=True)

    d = trace(o.pinyon)
    ecrits = []

    def ecrire(nom, contenu):
        chemin = o.sortie / nom
        if isinstance(contenu, Image.Image):
            # deux encres et leurs fondus : 256 teintes suffisent, sans rien perdre
            couleurs = contenu.getcolors(256)
            if couleurs:
                contenu = contenu.convert("P", palette=Image.ADAPTIVE, colors=len(couleurs))
            contenu.save(chemin, "PNG", optimize=True)
        elif isinstance(contenu, bytes):
            chemin.write_bytes(contenu)
        else:
            chemin.write_text(contenu, encoding="utf-8")
        ecrits.append((nom, chemin.stat().st_size))

    ecrire("favicon.svg", svg_carre(d, "#C81E33", "#F7F2E8"))
    # les trois grades du petit ne sortent pas en fichiers : ils vivent dans l'ico
    ecrire("favicon.ico", ico([carre(o.pinyon, t) for t in (16, 32, 48)]))
    ecrire("apple-touch-icon.png", carre(o.pinyon, 180))
    for t in (192, 512):
        ecrire(f"icon-{t}.png", carre(o.pinyon, t))

    masque, echelle, part = carre_masque(o.pinyon, 512)
    ecrire("icon-512-masque.png", masque)
    print(f"  masquable : lettre à {echelle:.0%} du corps plein, "
          f"soit {part:.0%} de la largeur — toute l'encre tient dans le disque de 66 %")

    if o.space_mono and o.og:
        ecrire("og.png", og(o.og, o.space_mono))

    ecrire("site.webmanifest", MANIFESTE)

    for nom, poids in ecrits:
        print(f"  {nom:24} {poids/1024:7.1f} ko")


if __name__ == "__main__":
    main()
