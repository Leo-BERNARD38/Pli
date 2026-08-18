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

// L'entrée du lecteur. L'atelier ne précharge rien : il n'est jamais servi sur son
// téléphone, et son premier écran n'a aucun budget de temps.
const LECTEUR = '/index.html'

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

// Deux entrées, deux bundles réellement distincts : rien de l'atelier ne doit pouvoir
// atterrir dans le bundle qui part chez elle (docs/architecture.md#deux-entrées).
export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [prechargerLesPolices()],
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
