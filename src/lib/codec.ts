// Le codec — un seul dans tout le produit, pour les deux transports.
//
//   JSON.stringify sans espaces
//     → deflate-raw
//     → base64url (+/ → -_, sans =)
//     → préfixe d'un caractère : la version de l'encodage
//
// Deux règles qui ne se rouvrent pas (docs/donnees.md#2-lencodage) :
//   · aucune API du DOM ici — le module tourne sous Node comme dans le navigateur,
//     sous peine de deux encodages qui divergent ;
//   · un changement d'encodage prend un NOUVEAU préfixe, il ne réécrit jamais l'ancien :
//     un lien parti n'a plus de version.

/** Les quatre types de pli. */
export type Type = 'inv' | 'pen' | 'poe' | 'sou'

/** Le pli tel qu'il voyage — clés courtes (docs/donnees.md#1-le-pli). */
export interface Pli {
  /** version du schéma */
  v: number
  t: Type
  /** le numéro du cachet — affichage seulement */
  n: number
  /** le titre */
  ti: string
  /** le texte, ou les strophes d'un poème */
  b: string | string[]
  /** jusqu'à trois faits — l'invitation seulement */
  f?: string[]
  /** la griffe */
  g?: string
  /** la signature */
  s: string
  /** le numéro de réponse — l'invitation seulement, jamais dans le dépôt */
  w?: string
}

/** La version de l'encodage d'aujourd'hui. Elle préfixe chaque payload fabriqué. */
export const VERSION = '2'

/**
 * Les versions qu'on sait lire. On en ajoute une le jour d'un nouvel encodage ;
 * on n'en retire jamais — les liens partis n'ont plus de version.
 */
const LUES: readonly string[] = [VERSION]

/** Un tampon d'octets adossé à un ArrayBuffer — la forme qu'attendent les deux flux. */
type Octets = Uint8Array<ArrayBuffer>

/** Ce que les deux flux acceptent en entrée, sans emprunter le nom `BufferSource` au DOM. */
type Entree = ArrayBufferView | ArrayBuffer

const PAS = 0x8000

function enBase64url(octets: Octets): string {
  let binaire = ''
  for (let i = 0; i < octets.length; i += PAS) {
    binaire += String.fromCharCode(...octets.subarray(i, i + PAS))
  }
  return btoa(binaire).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function deBase64url(texte: string): Octets {
  const base64 = texte.replace(/-/g, '+').replace(/_/g, '/')
  const reste = base64.length % 4
  const binaire = atob(reste === 0 ? base64 : base64 + '='.repeat(4 - reste))
  const octets = new Uint8Array(binaire.length)
  for (let i = 0; i < binaire.length; i += 1) octets[i] = binaire.charCodeAt(i)
  return octets
}

async function traverser(
  octets: Octets,
  filtre: TransformStream<Entree, Uint8Array>,
): Promise<Octets> {
  const plume = filtre.writable.getWriter()
  const ecriture = (async () => {
    await plume.write(octets)
    await plume.close()
  })()
  // L'échec réel remonte par la lecture ; celui-ci ne doit pas rester orphelin.
  ecriture.catch(() => {})

  const lecture = filtre.readable.getReader()
  const morceaux: Uint8Array[] = []
  let taille = 0
  for (;;) {
    const { done, value } = await lecture.read()
    if (done) break
    morceaux.push(value)
    taille += value.length
  }

  const sortie = new Uint8Array(taille)
  let pose = 0
  for (const morceau of morceaux) {
    sortie.set(morceau, pose)
    pose += morceau.length
  }
  return sortie
}

const TYPES: readonly Type[] = ['inv', 'pen', 'poe', 'sou']

/**
 * Le minimum qui distingue un pli d'un json quelconque qui aurait survécu au trajet.
 * Sans ce garde, un payload à demi lisible tomberait dans l'écran — « déposé par undefined »
 * plutôt que C4. On vérifie ce qui s'affiche toujours, rien de plus : les clés optionnelles
 * restent optionnelles.
 */
function estUnPli(relu: unknown): relu is Pli {
  if (typeof relu !== 'object' || relu === null) return false
  const pli = relu as Partial<Pli>
  const texte = (valeur: unknown): boolean => typeof valeur === 'string'
  return (
    typeof pli.v === 'number' &&
    typeof pli.t === 'string' &&
    TYPES.includes(pli.t as Type) &&
    typeof pli.n === 'number' &&
    texte(pli.ti) &&
    texte(pli.s) &&
    (texte(pli.b) || (Array.isArray(pli.b) && pli.b.every(texte)))
  )
}

/** Le pli devient le payload d'un lien : `#c=<payload>`. */
export async function encoder(pli: Pli): Promise<string> {
  const octets = new TextEncoder().encode(JSON.stringify(pli))
  const serre = await traverser(octets, new CompressionStream('deflate-raw'))
  return VERSION + enBase64url(serre)
}

/**
 * Le payload redevient un pli. Tout ce qui rate — préfixe inconnu, base64 tronquée,
 * JSON abîmé — donne le même refus : c'est l'état C4, « lien abîmé ».
 */
export async function decoder(payload: string): Promise<Pli> {
  if (!LUES.includes(payload.slice(0, 1))) {
    throw new Error('lien abîmé')
  }
  try {
    const octets = deBase64url(payload.slice(1))
    const detendu = await traverser(octets, new DecompressionStream('deflate-raw'))
    const relu: unknown = JSON.parse(new TextDecoder().decode(detendu))
    if (!estUnPli(relu)) throw new Error('ce n’est pas un pli')
    return relu
  } catch (cause) {
    throw new Error('lien abîmé', { cause })
  }
}
