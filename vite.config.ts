import { gzipSync } from 'node:zlib'

import { defineConfig, type Plugin } from 'vite'

// Les trois familles du premier écran, et rien d'autre. La liste est fermée :
// précharger trop revient à ne rien précharger, les requêtes se disputent la bande
// passante (docs/chargement.md#vague-2--ce-qui-est-préchargé-et-rien-dautre).
//
// Bodoni n'est pas là, et c'est nouveau : le ↑ de la pliure était son seul emploi sur
// A1, et c'est devenu un tracé. Le premier écran n'appelle plus que trois familles,
// sans arrangement.
const POLICES_DU_PREMIER_ECRAN = [
  'pinyon-script',       // le mot « Pli », en haut à gauche
  'newsreader-italique', // la voix — « Un pli t'attend. »
  'space-mono-700',      // les étiquettes, « déposé par a. »
]

// L'entrée du lecteur. L'atelier ne précharge rien et ne s'inline pas : il n'est jamais
// servi sur son téléphone, et son premier écran n'a aucun budget de temps.
const LECTEUR = '/index.html'

// Le plafond de la vague 1, en octets gzip (docs/chargement.md#les-trois-vagues).
const VAGUE_1 = 14 * 1024

/** Ce qu'il faut échapper pour qu'un nom de fichier empreinté redevienne un motif littéral. */
function litteral(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Pose le préchargement des trois polices dans le document du lecteur.
 *
 * Les noms sont empreintés, donc inconnus avant le build : le lien ne peut pas s'écrire
 * à la main dans index.html. Écrit ici plutôt que pris d'un greffon tiers — aucune
 * dépendance n'entre dans ce produit.
 */
function prechargerLesPolices(): Plugin {
  return {
    name: 'pli-precharger-les-polices',
    apply: 'build',
    transformIndexHtml: {
      // après tout le monde : le paquet doit être écrit pour qu'on y lise les empreintes.
      order: 'post',
      handler(_html, contexte) {
        if (contexte.path !== LECTEUR || !contexte.bundle) return

        const empreintees = Object.keys(contexte.bundle)
        return POLICES_DU_PREMIER_ECRAN.map((famille) => {
          // Une empreinte, un point, woff2 — et rien entre le nom de famille et elle :
          // sans ça, « newsreader-italique » attraperait aussi un futur
          // « newsreader-italique-latin », au hasard de l'ordre des clés.
          const motif = new RegExp(`(^|/)${famille}-[A-Za-z0-9_-]+\\.woff2$`)
          const trouves = empreintees.filter((nom) => motif.test(nom))
          if (trouves.length !== 1) {
            throw new Error(
              `${famille} : ${trouves.length} fichier(s) dans le paquet, il en faut un.` +
                ` scripts/polices.py l'a-t-il écrite, et une seule fois ?`,
            )
          }
          const [fichier] = trouves
          return {
            tag: 'link',
            injectTo: 'head' as const,
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              // obligatoire même en même origine, sinon la police est chargée deux fois
              crossorigin: '',
              href: `/${fichier}`,
            },
          }
        })
      },
    },
  }
}

/**
 * Le document du lecteur se suffit à lui-même : le gabarit et le module d'ouverture
 * entrent dedans, et plus aucune requête ne s'interpose entre le HTML et le premier texte
 * (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).
 *
 * Deux raisons, et la seconde est la plus forte :
 *   · une feuille de style séparée coûte un aller-retour bloquant pour économiser trois
 *     kilo-octets ;
 *   · GitHub Pages sert tout en `max-age=600`, y compris les fichiers empreintés. Un
 *     document périmé de dix minutes qui pointe une empreinte disparue est une page nue
 *     (docs/mises-a-jour.md#1-une-page-périmée-doit-rester-lisible). Inline, il se suffit.
 *
 * Les imports **dynamiques** ne sont pas touchés : ils restent des fichiers à part, et
 * c'est exactement la vague 3.
 */
function inlinerLeDocument(): Plugin {
  // Ce qui est entré dans le document et n'a donc plus à être servi — retiré du paquet
  // seulement à la fin, et seulement si plus personne n'y renvoie (voir generateBundle).
  const aRetirer = new Set<string>()

  return {
    name: 'pli-inliner-le-document',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, contexte) {
        const { bundle, chunk } = contexte
        if (contexte.path !== LECTEUR || !bundle || !chunk) return

        // La garde qui compte. Le jour où l'atelier importera codec.ts, Rollup sortira un
        // chunk commun et Vite posera un `modulepreload` dans le document DU LECTEUR :
        // une requête de plus avant le premier texte, introduite sans que personne l'ait
        // demandée. Elle échoue bruyamment plutôt que de se glisser dans le budget.
        if (chunk.imports.length > 0) {
          throw new Error(
            `Le module du lecteur importe ${chunk.imports.join(', ')} au lieu de se suffire.` +
              ` Une entrée = un fichier, sinon le document ne peut plus s'inliner` +
              ` (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).`,
          )
        }

        // Son jumeau silencieux : un chunk partagé se voit, du code d'atelier ABSORBÉ dans
        // l'entrée du lecteur ne se voit pas. Les deux bundles doivent rester réellement
        // distincts (docs/architecture.md#deux-entrées) — et c'est par là que le numéro de
        // réponse finirait un jour dans le document qui part chez elle.
        const atelier = chunk.moduleIds.filter((id) => /[/\\]src[/\\]atelier[/\\]/.test(id))
        if (atelier.length > 0) {
          throw new Error(
            `Le module du lecteur a absorbé ${atelier.join(', ')}.` +
              ` Rien de l'atelier ne doit pouvoir atterrir dans le bundle qui part chez elle` +
              ` (docs/architecture.md#deux-entrées).`,
          )
        }

        let sortie = html

        // — le gabarit ————————————————————————————————————————————————
        for (const feuille of chunk.viteMetadata?.importedCss ?? []) {
          const fichier = bundle[feuille]
          if (!fichier || fichier.type !== 'asset') continue
          const style = String(fichier.source)
          if (/<\/style/i.test(style)) {
            throw new Error(`${feuille} contient « </style » : il ne peut pas s'inliner.`)
          }
          // Un remplacement passé en CHAÎNE ferait de `$&`, `` $` ``, `$'` et `$1` des
          // motifs de substitution : le contenu se réécrirait lui-même, au build seulement.
          // Une fonction n'a pas ce piège.
          sortie = sortie.replace(
            new RegExp(`[ \\t]*<link\\b[^>]*href="[^"]*${litteral(feuille)}"[^>]*>\\n?`),
            () => `    <style>\n${style}    </style>\n`,
          )
          aRetirer.add(feuille)
        }

        // — le module d'ouverture ——————————————————————————————————————
        // `</script` n'existe dans du JavaScript qu'à l'intérieur d'une chaîne : l'échapper
        // y est sans effet, et il empêche le document de refermer la balise trop tôt.
        const module = chunk.code.replace(/<\/script/gi, '<\\/script')
        sortie = sortie.replace(
          new RegExp(`[ \\t]*<script\\b[^>]*src="[^"]*${litteral(chunk.fileName)}"[^>]*></script>\\n?`),
          () => `    <script type="module">\n${module}    </script>\n`,
        )
        aRetirer.add(chunk.fileName)

        // Rien ne doit rester sur le chemin du premier texte. On cherche la FORME, pas un
        // chemin : `base` et `assetsDir` peuvent bouger, un script à charger et une feuille
        // bloquante restent reconnaissables (docs/chargement.md#ce-qui-fait-échouer-la-revue).
        const reste = sortie.match(
          /<script\b[^>]*\bsrc=[^>]*>|<link\b[^>]*\brel="(?:stylesheet|modulepreload)"[^>]*>/g,
        )
        if (reste) {
          throw new Error(`Il reste une requête avant le premier texte : ${reste.join(' ')}`)
        }

        return sortie
      },
    },

    // Le ménage et la pesée, une fois tous les documents écrits — pas avant : à l'instant
    // où le lecteur s'inline, celui de l'atelier n'existe pas encore.
    generateBundle: {
      order: 'post',
      handler(_options, paquet) {
        // flatMap plutôt que filter : c'est ce qui restreint vraiment le type aux assets,
        // et `source` n'existe pas sur un chunk.
        const documents = Object.values(paquet).flatMap((f) =>
          f.type === 'asset' && f.fileName.endsWith('.html') ? [f] : [],
        )

        for (const nom of aRetirer) {
          // Ne jamais supprimer ce que quelqu'un d'autre attend encore. Le jour où l'atelier
          // reprendra pli.css, Rollup n'émettra qu'une feuille : le lecteur en garde une
          // copie inline, l'atelier garde son lien, et le fichier reste servi. Le supprimer
          // donnerait un build vert et un atelier entièrement nu, sans un mot.
          const attendu = documents.some((d) => String(d.source).includes(nom))
          if (!attendu) delete paquet[nom]
        }
        aRetirer.clear()

        // Le budget de la vague 1, tenu par la machine. 14 ko n'est pas un chiffre rond :
        // c'est ce qu'une connexion neuve envoie avant d'attendre le premier accusé de
        // réception (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).
        const lecteur = documents.find((d) => d.fileName === 'index.html')
        if (lecteur) {
          const poids = gzipSync(Buffer.from(String(lecteur.source)), { level: 9 }).length
          if (poids > VAGUE_1) {
            throw new Error(
              `Le document du lecteur pèse ${poids} octets gzip, au-dessus des ${VAGUE_1}` +
                ` de la vague 1 : le premier écran coûte désormais un aller-retour de plus` +
                ` (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).`,
            )
          }
          this.info(`document du lecteur : ${poids} octets gzip (plafond ${VAGUE_1})`)
        }
      },
    },
  }
}

// Deux entrées, deux bundles réellement distincts : rien de l'atelier ne doit pouvoir
// atterrir dans le bundle qui part chez elle (docs/architecture.md#deux-entrées).
export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [prechargerLesPolices(), inlinerLeDocument()],
  build: {
    // Deux appareils connus, iOS 26 et Android 16 : aucun préfixe, aucun polyfill, pas
    // même celui que Vite injecte pour modulepreload (docs/architecture.md#compatibilité).
    target: 'esnext',
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: {
        lecteur: 'index.html',
        atelier: 'atelier/index.html',
      },
    },
  },
})
