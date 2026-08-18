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

// Et le rideau, en priorité BASSE : il passe après le texte, sans exception, mais il doit
// être **découvert tôt**. Posé seulement par le module, son adresse n'existe que dans la
// chaîne d'un script : le scanner de préchargement ne la voit pas, et pour un `#p=` la
// peinture attendait la fin de l'aller-retour réseau du poème — deux requêtes sérialisées
// qui n'ont aucune dépendance entre elles.
const TOILE_DU_PREMIER_ECRAN = 'rideau-carmin-nuit'

// L'entrée du lecteur. L'atelier ne précharge rien et ne s'inline pas : il n'est jamais
// servi sur son téléphone, et son premier écran n'a aucun budget de temps.
const LECTEUR = '/index.html'
const DOCUMENT = 'index.html'
const ENTREE = 'lecteur'

// Le plafond de la vague 1, en octets gzip (docs/chargement.md#les-trois-vagues).
const VAGUE_1 = 14 * 1024

/** Ce qu'il faut échapper pour qu'un nom de fichier empreinté redevienne un motif littéral. */
function litteral(texte: string): string {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Le seul fichier du paquet dont le nom commence par `famille-` et finit en `.ext`. */
function empreinte(paquet: Record<string, unknown>, famille: string, ext: string): string {
  // Rien entre le nom de famille et l'empreinte : sans ça, « newsreader-italique »
  // attraperait aussi un futur « newsreader-italique-latin », au hasard de l'ordre des clés.
  const motif = new RegExp(`(^|/)${famille}-[A-Za-z0-9_-]+\\.${ext}$`)
  const trouves = Object.keys(paquet).filter((nom) => motif.test(nom))
  const [fichier] = trouves
  if (trouves.length !== 1 || !fichier) {
    throw new Error(
      `${famille} : ${trouves.length} fichier(s) .${ext} dans le paquet, il en faut un.` +
        ` Les scripts de scripts/ les ont-ils écrits, et une seule fois ?`,
    )
  }
  return fichier
}

/**
 * Pose le préchargement de la vague 2 dans le document du lecteur : les trois polices du
 * premier écran, puis le rideau.
 *
 * Les noms sont empreintés, donc inconnus avant le build : le lien ne peut pas s'écrire
 * à la main dans index.html. Écrit ici plutôt que pris d'un greffon tiers — aucune
 * dépendance n'entre dans ce produit.
 */
function prechargerLaVague2(): Plugin {
  return {
    name: 'pli-precharger-la-vague-2',
    apply: 'build',
    transformIndexHtml: {
      // après tout le monde : le paquet doit être écrit pour qu'on y lise les empreintes.
      order: 'post',
      handler(_html, contexte) {
        if (contexte.path !== LECTEUR || !contexte.bundle) return
        const paquet = contexte.bundle

        const polices = POLICES_DU_PREMIER_ECRAN.map((famille) => ({
          tag: 'link',
          injectTo: 'head' as const,
          attrs: {
            rel: 'preload',
            as: 'font',
            type: 'font/woff2',
            // obligatoire même en même origine, sinon la police est chargée deux fois
            crossorigin: '',
            href: `/${empreinte(paquet, famille, 'woff2')}`,
          },
        }))

        return [
          ...polices,
          {
            tag: 'link',
            injectTo: 'head' as const,
            attrs: {
              rel: 'preload',
              as: 'image',
              // Le texte ne l'attend jamais : elle est découverte tôt, servie tard.
              fetchpriority: 'low',
              href: `/${empreinte(paquet, TOILE_DU_PREMIER_ECRAN, 'webp')}`,
            },
          },
        ]
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
  return {
    name: 'pli-inliner-le-document',
    apply: 'build',
    // Après les greffons de build de Vite, et c'est indispensable : celui du CSS supprime
    // en `generateBundle` les chunks « purement CSS » — ceux d'un `import()` de feuille —
    // et réécrit les références qui y menaient. Inliner avant lui (dans
    // `transformIndexHtml`) figerait dans le document un `import()` vers un fichier qui
    // n'existera jamais : le CSS d'un type ne se chargerait plus, en silence.
    enforce: 'post',
    generateBundle: {
      order: 'post',
      handler(_options, paquet) {
        const document = paquet[DOCUMENT]
        if (!document || document.type !== 'asset') return

        const entree = Object.values(paquet).find(
          (f) => f.type === 'chunk' && f.isEntry && f.name === ENTREE,
        )
        if (!entree || entree.type !== 'chunk') return

        // La garde qui compte. Le jour où l'atelier importera codec.ts, Rollup sortira un
        // chunk commun et Vite posera un `modulepreload` dans le document DU LECTEUR : une
        // requête de plus avant le premier texte, introduite sans que personne l'ait
        // demandée. Elle échoue bruyamment plutôt que de se glisser dans le budget.
        if (entree.imports.length > 0) {
          throw new Error(
            `Le module du lecteur importe ${entree.imports.join(', ')} au lieu de se suffire.` +
              ` Une entrée = un fichier, sinon le document ne peut plus s'inliner` +
              ` (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).`,
          )
        }

        // Son jumeau silencieux : un chunk partagé se voit, du code d'atelier ABSORBÉ dans
        // l'entrée du lecteur ne se voit pas. Les deux bundles doivent rester réellement
        // distincts (docs/architecture.md#deux-entrées) — et c'est par là que le numéro de
        // réponse finirait un jour dans le document qui part chez elle.
        const atelier = entree.moduleIds.filter((id) => /[/\\]src[/\\]atelier[/\\]/.test(id))
        if (atelier.length > 0) {
          throw new Error(
            `Le module du lecteur a absorbé ${atelier.join(', ')}.` +
              ` Rien de l'atelier ne doit pouvoir atterrir dans le bundle qui part chez elle` +
              ` (docs/architecture.md#deux-entrées).`,
          )
        }

        let sortie = String(document.source)
        const aRetirer = new Set<string>()

        // — le gabarit ————————————————————————————————————————————————
        for (const feuille of entree.viteMetadata?.importedCss ?? []) {
          const fichier = paquet[feuille]
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
        const module = entree.code.replace(/<\/script/gi, '<\\/script')
        sortie = sortie.replace(
          new RegExp(`[ \\t]*<script\\b[^>]*src="[^"]*${litteral(entree.fileName)}"[^>]*></script>\\n?`),
          () => `    <script type="module">\n${module}    </script>\n`,
        )
        aRetirer.add(entree.fileName)

        // Rien ne doit rester sur le chemin du premier texte. On cherche la FORME, pas un
        // chemin : `base` et `assetsDir` peuvent bouger, un script à charger et une feuille
        // bloquante restent reconnaissables (docs/chargement.md#ce-qui-fait-échouer-la-revue).
        const reste = sortie.match(
          /<script\b[^>]*\bsrc=[^>]*>|<link\b[^>]*\brel="(?:stylesheet|modulepreload)"[^>]*>/g,
        )
        if (reste) {
          throw new Error(`Il reste une requête avant le premier texte : ${reste.join(' ')}`)
        }

        // Le module inliné vit désormais à l'adresse du document, et non dans /assets/ :
        // un `import()` relatif y pointerait à côté. Les imports dynamiques de la vague 3
        // deviennent donc absolus, à partir du dossier où l'entrée vivait — et le contrôle
        // qui suit vérifie qu'il n'en reste pas un seul.
        const dossier = entree.fileName.slice(0, entree.fileName.lastIndexOf('/') + 1)
        sortie = sortie.replace(
          /import\((["'`])\.\/([^"'`]+)\1\)/g,
          (_tout: string, guillemet: string, nom: string) =>
            `import(${guillemet}/${dossier}${nom}${guillemet})`,
        )

        const relatif = sortie.match(/import\(["'`]\.\/[^"'`]+["'`]\)/g)
        if (relatif) {
          throw new Error(
            `Le module inliné garde un import relatif : ${relatif.join(' ')}.` +
              ` Inliné dans le document, il ne pointe plus vers /assets/.`,
          )
        }

        document.source = sortie

        /** Ce qui a réellement quitté le paquet — ce que plus personne ne doit attendre. */
        const partis = new Set<string>()

        const documents = Object.values(paquet).flatMap((f) =>
          f.type === 'asset' && f.fileName.endsWith('.html') ? [f] : [],
        )
        for (const nom of aRetirer) {
          // Ne jamais supprimer ce que quelqu'un d'autre attend encore. Le jour où l'atelier
          // reprendra pli.css, Rollup n'émettra qu'une feuille : le lecteur en garde une
          // copie inline, l'atelier garde son lien, et le fichier reste servi. Le supprimer
          // donnerait un build vert et un atelier entièrement nu, sans un mot.
          if (!documents.some((d) => String(d.source).includes(nom))) {
            delete paquet[nom]
            partis.add(nom)
          }
        }

        // Ce qui reste ne doit plus rien attendre de ce qui vient de partir. Un chunk de la
        // vague 3 qui partagerait ne serait-ce qu'une fonction avec le module d'ouverture
        // se met à importer le chunk d'entrée — inliné, puis supprimé. Le build reste vert,
        // la vague 3 tombe au moment du geste, et rien ne le dit. C'est arrivé : deux
        // fonctions de A2 réemployées par la réponse ont suffi.
        //
        // On lit le CODE, pas la liste d'imports de Rollup : celle-ci nomme encore les
        // chunks purement CSS que Vite vient de dissoudre, et n'accuserait que du vide.
        for (const chunk of Object.values(paquet)) {
          if (chunk.type !== 'chunk') continue
          const disparus = [...partis].filter((nom) => String(chunk.code).includes(nom))
          if (disparus.length) {
            throw new Error(
              `${chunk.fileName} attend ${disparus.join(', ')}, qui vient d'être inliné` +
                ` dans le document. La vague 3 ne partage rien avec le module d'ouverture.`,
            )
          }
        }

        // Le budget de la vague 1, tenu par la machine. 14 ko n'est pas un chiffre rond :
        // c'est ce qu'une connexion neuve envoie avant d'attendre le premier accusé de
        // réception (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).
        const poids = gzipSync(Buffer.from(sortie), { level: 9 }).length
        if (poids > VAGUE_1) {
          throw new Error(
            `Le document du lecteur pèse ${poids} octets gzip, au-dessus des ${VAGUE_1}` +
              ` de la vague 1 : le premier écran coûte désormais un aller-retour de plus` +
              ` (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).`,
          )
        }
        this.info(`document du lecteur : ${poids} octets gzip (plafond ${VAGUE_1})`)
      },
    },
  }
}

// Deux entrées, deux bundles réellement distincts : rien de l'atelier ne doit pouvoir
// atterrir dans le bundle qui part chez elle (docs/architecture.md#deux-entrées).
export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [prechargerLaVague2(), inlinerLeDocument()],
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
