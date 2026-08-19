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

// Le sous-chemin où le site est servi. Le dépôt s'appelle `Pli` : GitHub Pages en fait un
// **site de projet**, servi sous `leo-bernard38.github.io/Pli/` et non à la racine de l'hôte
// (docs/hebergement.md#ladresse). Tout ce qui s'écrit en absolu dans le produit part d'ici,
// et de nulle part ailleurs — le module lit `import.meta.env.BASE_URL`, que Vite remplace
// par cette chaîne au build.
const BASE = '/Pli/'

// L'entrée du lecteur. L'atelier ne précharge rien et ne s'inline pas : il n'est jamais
// servi sur son téléphone, et son premier écran n'a aucun budget de temps.
// L'unique entrée. Elle s'appelle encore « lecteur » parce que c'est ce qu'elle est
// d'abord : le premier écran est A1, et tout le budget de temps est à lui.
const LECTEUR = '/index.html'
const DOCUMENT = 'index.html'
const ENTREE = 'lecteur'

/**
 * Le plafond de la vague 1, en octets gzip (docs/chargement.md#le-plafond-de-la-vague-1).
 *
 * **Il valait 14 336 et il portait le lecteur seul.** La page unique du 19/08/2026 y fait
 * entrer l'atelier : un seul document, un seul routeur, une seule requête — le retour du
 * navigateur ne tombe plus entre deux pages, et les écrans peuvent glisser les uns sur les
 * autres. Le prix est ici, en clair, et il se paie sur le premier texte qu'elle voit.
 *
 * Mesuré le 19/08/2026, une fois la fusion faite : **22 756 octets**, contre 13 945 la
 * veille — l'atelier pèse près de 9 ko sur le premier écran d'A1. Le plafond est posé juste
 * au-dessus, à 24 ko, et pas plus haut : un plafond qui ne serre jamais ne tient rien.
 *
 * Ce qui n'a PAS bougé, et qui compte autant : les quatre feuilles des types restent en
 * vague 3. La fusion n'a pas le droit de changer ce qu'elle télécharge ni quand — l'atelier
 * les importait statiquement pour son aperçu, et elles seraient entrées dans le document
 * sans que personne le demande (src/atelier/main.ts).
 */
const VAGUE_1 = 24 * 1024

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
 * premier écran, **et rien d'autre**.
 *
 * Aucune image n'y est plus : A1 n'en porte plus, et le rideau qui y vivait coûtait 614 ko
 * lancés en même temps que les trois polices que le texte, lui, attend vraiment
 * (19/08/2026, .claude/decisions.md). Les peintures des types partent en vague 3, quand le
 * premier écran est peint.
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
            href: `${BASE}${empreinte(paquet, famille, 'woff2')}`,
          },
        }))

        return polices
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

        // ~~Son jumeau silencieux~~ — **retiré le 19/08/2026, avec la page unique.** Il
        // refusait tout code d'atelier absorbé par l'entrée du lecteur, parce que les deux
        // bundles devaient rester réellement distincts. Ils n'en font plus qu'un : l'atelier
        // EST dans le document qui part chez elle, c'est le prix de la page unique, et il
        // est écrit (docs/architecture.md#une-seule-page).
        //
        // Ce qui garde le premier écran, désormais, ce n'est plus une frontière de bundle,
        // c'est le plafond ci-dessous — mesuré, et il échoue bruyamment.

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
            `import(${guillemet}${BASE}${dossier}${nom}${guillemet})`,
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
//
// ~~**Deux builds, et non deux entrées d'un même build.**~~ **Un seul build depuis le
// 19/08/2026.** Le raisonnement d'alors tenait tant qu'il y avait deux entrées : Rollup en
// aurait tiré un chunk commun, et le document du lecteur aurait perdu son inlining. Il n'y
// a plus qu'une entrée, donc plus de chunk commun possible — la garde « une entrée = un
// fichier » vaut toujours, et c'est elle qui le vérifie.
//
// Ce qui a changé n'est pas le build, c'est le produit : une seule page
// (docs/architecture.md#une-seule-page). L'ancienne adresse survit en redirection, et elle
// a déménagé dans `public/atelier/` : ce n'est plus une entrée à builder, c'est un fichier
// à recopier tel quel — comme `404.html` et les icônes, et pour la même raison. Une icône
// posée sur un écran d'accueil pointe une adresse qui doit rester valable.
export default defineConfig(() => ({
  base: BASE,
  publicDir: 'public',
  plugins: [prechargerLaVague2(), inlinerLeDocument()],
  build: {
    // Deux appareils connus, iOS 26 et Android 16 : aucun préfixe, aucun polyfill, pas
    // même celui que Vite injecte pour modulepreload (docs/architecture.md#compatibilité).
    target: 'esnext',
    modulePreload: { polyfill: false },
    // Une entrée, et une seule — le type le dit, sinon Rollup lit une union.
    rollupOptions: { input: { [ENTREE]: DOCUMENT } as Record<string, string> },
  },
}))
