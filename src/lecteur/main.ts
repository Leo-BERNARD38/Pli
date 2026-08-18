// Le lecteur — ce qu'elle trouve au bout du lien.
//
// Jalon 3 : A1 l'attente, A2 la découverte, C4 le lien abîmé, et le journal qui se remplit
// au dépliage. A3 et A4 — la réponse et le mot — suivent dans le même jalon.
//
// Jalon 5 : le journal se lit. C1 le sommaire, C2 la relecture, C3 le pli refermé — et
// l'arrivée décide d'après le journal, jamais d'après le seul lien
// (docs/partage.md#le-retour).

// Les jetons d'abord, le gabarit ensuite : l'ordre est celui de la cascade. Les deux
// entrent dans le document au build, ils ne coûtent aucune requête
// (docs/chargement.md#vague-1--le-document-se-suffit-à-lui-même).
import '../styles/tokens.css'
import '../styles/pli.css'

import { decoder, type Pli } from '../lib/codec.ts'
import { empreinte, entrees, noterLaReponse, noterLeDepliage, trouver } from '../lib/journal.ts'
import { lire, suivre, type Route } from '../lib/routeur.ts'
import { tenirDansLecran } from './plateau.ts'
import { ecrire, oublierLaPeinture, ETIQUETTES } from './a1.ts'
import { preparer } from './fond.ts'
import { armer, type Geste } from './geste.ts'
import { chemin, journal, rappeler, refermer } from './plis.ts'

// Ordre imposé par docs/chargement.md : si le hash est un #p=, le fetch part en TOUTE
// première instruction, avant qu'on décode quoi que ce soit. C'est la seule requête que le
// réseau nous impose, et c'est le seul écran d'attente du produit.
//
// Elle repart d'ici depuis que le document est inline. Au jalon 1, cinq lignes du <head> la
// lançaient : une feuille de style bloquante gelait l'exécution d'un module, et la demande
// partait 63 ms trop tard. Il n'y a plus de feuille à attendre — mesuré à 60 ms de latence,
// cinq passes alternées : 75 ms d'ici contre 77 ms depuis le <head>. L'écart a disparu avec
// sa cause, et le nom d'un poème redevient l'affaire du seul routeur.
// Le site est servi sous un sous-chemin — `leo-bernard38.github.io/Pli/` — et rien de ce qui
// s'écrit à la main ne doit l'oublier : Vite remplace `BASE_URL` par ce préfixe au build, et
// c'est le seul endroit du produit où il est écrit (docs/hebergement.md#ladresse).
const RACINE = import.meta.env.BASE_URL

const premiere = lire(window.location.hash)
let dejaDemande =
  premiere.ecran === 'poeme'
    ? { nom: premiere.nom, reponse: fetch(`${RACINE}plis/${premiere.nom}.txt`) }
    : null

const cadre = document.querySelector<HTMLElement>('.pli')

// Le pli tient dans l'écran avant d'être peint : posée après coup, l'échelle se verrait
// changer. On mesure le plateau — c'est lui qui porte les retraits de sécurité
// (docs/appareils.md#les-réglages-de-page) — et on écrit sur le pli, son seul consommateur.
export const echelle = cadre ? tenirDansLecran(document.body, cadre) : null

// La marque « Pli » mène au journal, sur A1 comme sur C4. Elle est déjà dans le gabarit :
// le chemin ne coûte que son `href` (docs/parcours.md#a2--la-découverte).
if (cadre) chemin(cadre)
const a1 = document.querySelector<HTMLElement>('#a1')
const c4 = document.querySelector<HTMLElement>('#c4')
const dessous = document.querySelector<HTMLElement>('.pli__dessous')

/**
 * Un seul écran à la fois, et jamais deux. `hidden` seul ne suffit pas : les couches sont
 * en `display: flex`, une déclaration d'auteur qui bat la feuille du navigateur — le
 * gabarit porte la règle qui va avec (docs/parcours.md#larrivée).
 */
function montrer(ecran: HTMLElement | null): void {
  if (cadre) cadre.hidden = false
  for (const couche of cadre?.querySelectorAll<HTMLElement>('.pli__dessus') ?? []) {
    couche.hidden = couche !== ecran
  }
  // La couche du dessous ne se montre que pour elle-même — la relecture, qui n'a pas de
  // couche du dessus. Le geste, lui, la découvre en tirant : il ne passe pas par ici.
  if (dessous && ecran) dessous.hidden = true
}

/**
 * A3 et A4 partent avec leur pli. Elles sont ajoutées au cadre, pas au document : un
 * second lien dans la même page en trouverait deux, dont une avec le mauvais numéro.
 */
function retirerLesCouchesQuiMontent(): void {
  for (const vieille of cadre?.querySelectorAll('.pli__monte') ?? []) vieille.remove()
}

/**
 * Le repère du budget de chargement, posé une fois, quand le texte d'A1 est à l'écran.
 * Safari ne donne pas de LCP, et le premier rendu peint le plateau avant le texte : sans
 * cette marque, la colonne « Mesuré le » de docs/chargement.md reste vide pour toujours.
 *
 * Le **type de lien** voyage avec elle : pour un `#p=`, la marque inclut l'aller-retour
 * réseau, et sans cette précision la ligne du budget ne veut rien dire. Un lien abîmé ne
 * marque rien — la ligne mesure le temps du premier texte, pas celui d'un refus.
 */
let marquee = false
function marquer(lien: 'c' | 'p'): void {
  if (marquee) return
  marquee = true
  performance.mark('a1', { detail: { lien } })
}

/**
 * Le fichier d'un poème : celui demandé en première instruction si c'est bien le sien,
 * sinon un nouveau. La demande ne sert qu'une fois.
 */
function chercher(nom: string): Promise<Response> {
  const demande = dejaDemande
  dejaDemande = null
  if (demande?.nom === nom) return demande.reponse
  // Une demande qu'on abandonne ne doit pas laisser un échec sans personne pour l'entendre.
  demande?.reponse.catch(() => {})
  return fetch(`${RACINE}plis/${nom}.txt`)
}

/** Le pli, et le payload dont il sort : le journal range le second, jamais le premier. */
interface Apport {
  pli: Pli
  /** Ce qui est rangé au journal — une seule source de vérité (docs/donnees.md#4-son-journal). */
  payload: string
}

/**
 * Le pli que cette route demande. Cette fonction n'écrit pas — un seul endroit écrit, plus
 * bas. Un hash qu'on ne sait pas lire est un lien abîmé : c'est exactement ce que le
 * routeur appelle « inconnu », et il n'y a rien d'autre à en dire.
 */
async function pliDe(route: Route): Promise<Apport> {
  if (route.ecran === 'pli') return { pli: await decoder(route.payload), payload: route.payload }

  if (route.ecran === 'poeme') {
    const reponse = await chercher(route.nom)
    if (!reponse.ok) throw new Error('lien abîmé')
    // Le contenu récupéré est recopié dans l'entrée : un fichier supprimé ne doit pas faire
    // disparaître un pli de son archive (docs/donnees.md#4-son-journal).
    const payload = (await reponse.text()).trim()
    return { pli: await decoder(payload), payload }
  }

  throw new Error('lien abîmé')
}

// ── le journal ───────────────────────────────────────────────────────────────────────
//
// Franchir le seuil DÉCIDE l'entrée ; l'écriture, elle, attend la fin de l'animation —
// jusque-là le fil principal ne fait que déplacer deux couches
// (docs/fluidite.md#écrire-le-journal-sans-bloquer) :
//
//   seuil franchi      → l'entrée est décidée, gardée en mémoire
//   transitionend      → écriture
//   pagehide / hidden  → écriture aussi, au cas où elle quitte avant la fin
//
// Deux écritures possibles, aucun doublon : `noterLeDepliage` dédoublonne sur l'empreinte.

/** L'entrée du pli à l'écran, prête bien avant qu'un doigt se pose. */
let entreeDuPli: { h: string; c: string } | null = null

/** Décidée au seuil, en attente d'écriture. */
let aRanger: { h: string; c: string } | null = null

function rangerAuJournal(): void {
  const entree = aRanger
  if (!entree) return
  aRanger = null
  noterLeDepliage(entree.h, entree.c)
}

// `pagehide` couvre le départ vers WhatsApp et la fermeture de l'onglet ; `hidden` couvre
// l'application qu'on met de côté, que Safari ne fait pas toujours suivre d'un `pagehide`.
window.addEventListener('pagehide', rangerAuJournal)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') rangerAuJournal()
})

// Seule la dernière route écrit. Sans ce jeton, un poème lent suivi d'un lien valide
// masquerait, en arrivant en retard, un pli parfaitement décodé.
let generation = 0

// Le geste s'arme une fois : ses écouteurs vivent sur le cadre, qui ne bouge pas. Un
// second lien referme le pli au lieu d'armer une seconde fois.
let geste: Geste | null = null

/**
 * La vague 3, puis le geste. Dans cet ordre et pas dans l'autre : la couche du dessous doit
 * **exister et être peinte avant qu'un doigt se pose** — construire A2 au pointerdown
 * coûterait une disposition complète dans la fenêtre de 4 ms
 * (docs/fluidite.md#la-file-dattente-principale).
 */
async function preparerLeGeste(pli: Pli, payload: string): Promise<number> {
  const mienne = generation
  if (!cadre || !a1 || !dessous || !echelle) return mienne

  // Un pli qui s'en va sans que sa transition soit finie se range quand même : il a été
  // déplié, et c'est le dépliage qui décide, pas l'animation.
  rangerAuJournal()
  geste?.refermer()
  // Les écouteurs du geste survivent d'un pli à l'autre : entre ici et l'empreinte du
  // nouveau payload, un seuil franchi rangerait l'ANCIENNE entrée sous le pli qui vient
  // de s'afficher. Mieux vaut ne rien ranger que ranger le mauvais pli.
  entreeDuPli = null

  // L'empreinte se calcule ICI, pendant qu'elle regarde le volet fermé. L'écriture, elle,
  // doit rester synchrone : à `pagehide`, plus rien d'asynchrone n'a le temps d'aboutir.
  const h = await empreinte(payload)
  if (mienne !== generation) return mienne
  entreeDuPli = { h, c: payload }

  await preparer(dessous, pli, ETIQUETTES[pli.t])
  if (mienne !== generation) return mienne

  // La marque d'A2 mène au journal : pour une pensée et un souvenir, qui n'ont pas
  // d'action, c'est le seul chemin qui reste (docs/parcours.md#a2--la-découverte).
  chemin(dessous)

  geste ??= armer({
    cadre,
    dessus: a1,
    dessous,
    invite: a1.querySelector('.invite'),
    bouton: a1.querySelector('.deplier'),
    echelle,
    // Le geste s'arme une seule fois pour tous les plis de la session : ces deux fonctions
    // lisent l'entrée du pli à l'écran, elles ne la capturent pas.
    auSeuil: () => {
      aRanger = entreeDuPli
    },
    // Le pli est déplié : l'entrée s'écrit, et A1 rend sa peinture. Deux textures décodées
    // au maximum, et A2 vient d'en poser une.
    auDepliage: () => {
      rangerAuJournal()
      oublierLaPeinture()
    },
  })

  // A3 et A4 arrivent APRÈS le geste, et pour l'invitation seulement : elles ne servent
  // qu'une fois le pli déplié, un pli sur quatre les demande, et rien ne les attend avant
  // (docs/parcours.md#a3--la-réponse--invitation-seulement).
  if (pli.t === 'inv') {
    const { armerLaReponse } = await import('./reponse.ts')
    if (mienne !== generation) return mienne
    armerLaReponse({
      cadre,
      dessous,
      pli,
      noter: (mot) => noterLaReponse(h, payload, mot),
    })
  }
  return mienne
}

/**
 * C2 · la relecture — le pli entier, tel qu'il s'est déplié, et le mot rappelé s'il y en a
 * un. Deux chemins y mènent, et c'est le même écran : une entrée du journal, et le retour
 * de WhatsApp par rechargement, où le hash `#c=` est toujours dans la barre
 * (docs/partage.md#le-retour). Par le bfcache, rien de ceci ne joue — la page est restaurée
 * telle quelle, et c'est très bien : on ne dépend jamais d'un rechargement.
 */
async function relireLePli(pli: Pli, mot: string | null): Promise<void> {
  if (!dessous) return
  const mienne = generation
  retirerLesCouchesQuiMontent()
  // La même vague 3 que le dépliage, et le même A2 au bout : un pli relu est le pli, pas
  // un résumé. Il n'y a simplement plus de feuille à tirer par-dessus.
  await preparer(dessous, pli, ETIQUETTES[pli.t])
  if (mienne !== generation) return
  rappeler(dessous, mot)
  montrer(null)
  // La couche du dessous vit d'habitude sous une feuille qu'on tire : le geste la pose 9 %
  // plus bas et la sort du clavier tant qu'elle est cachée. Relue, elle est l'écran — elle
  // reprend sa place et redevient atteignable (docs/fluidite.md#ce-qui-a-le-droit-de-bouger).
  dessous.style.transform = 'none'
  dessous.inert = false
  dessous.hidden = false
}

/** C1 · le journal, reconstruit à chaque passage : elle en revient après avoir déplié. */
async function montrerLeJournal(): Promise<void> {
  if (!cadre) return
  const mienne = generation
  const ecran = await journal(cadre)
  if (mienne === generation) montrer(ecran)
}

suivre((route) => {
  rangerAuJournal()
  const mienne = ++generation

  if (route.ecran === 'journal') {
    void montrerLeJournal()
    return
  }

  // `#/installer` n'a pas encore d'écran : sa forme dépend de la mesure 4, et elle ne se
  // simule pas (docs/README.md#les-mesures-à-faire-avant-de-sengager). La page reste nue
  // plutôt que de montrer un écran qu'aucune mesure n'a dessiné.
  if (route.ecran === 'installer') {
    montrer(null)
    if (cadre) cadre.hidden = true
    return
  }

  // Une entrée du journal qu'on relit. Elle ne quitte jamais l'appareil : sans le journal
  // qui la porte, cette adresse ne désigne rien — et c'est un lien abîmé, comme un autre.
  if (route.ecran === 'relire') {
    const entree = entrees().find((e) => e.h === route.h)
    if (!entree) {
      montrer(c4)
      return
    }
    decoder(entree.c).then(
      (pli) => {
        if (mienne === generation) void relireLePli(pli, entree.reponse?.mot ?? null)
      },
      () => {
        if (mienne === generation) montrer(c4)
      },
    )
    return
  }

  pliDe(route).then(
    ({ pli, payload }) => {
      if (mienne !== generation) return
      retirerLesCouchesQuiMontent()

      // L'arrivée décide l'écran d'après le journal, jamais d'après le seul lien : une
      // réponse déjà notée mène à C2, un dépliage déjà noté à C3
      // (docs/partage.md#le-retour).
      const entree = trouver(payload)
      if (entree?.reponse) {
        void relireLePli(pli, entree.reponse.mot)
        return
      }
      if (entree && cadre) {
        void refermer(cadre, pli).then((ecran) => {
          if (mienne === generation) montrer(ecran)
        })
        return
      }

      ecrire(pli)
      montrer(a1)
      marquer(route.ecran === 'poeme' ? 'p' : 'c')
      void preparerLeGeste(pli, payload)
    },
    () => {
      if (mienne === generation) montrer(c4)
    },
  )
})
