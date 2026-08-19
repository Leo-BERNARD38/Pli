// La moulinette — le poème passe d'un .md en clair à un fichier encodé du dépôt.
//
//   plis-source/015.md         en clair, chez moi, gitignoré
//           ↓ plier.sh / plier.bat
//   public/plis/015-vhtq.txt   le poème encodé
//   public/plis/index          la liste, encodée
//           ↓ git push
//   stdout : nº 015 → https://leo-bernard38.github.io/Pli/#p=015-vhtq
//
// Elle n'invente rien : le format est celui de docs/donnees.md#3-le-poème, et tout ce qui
// se décide vraiment — le jeton, l'index, les strophes — vit dans src/lib/poeme.ts, où des
// tests le tiennent. Ce fichier-ci ne fait que lire le disque, appeler, et écrire.
//
// Deux invariants, et ils protègent des liens DÉJÀ PARTIS (CLAUDE.md#les-invariants) :
//   · le jeton d'un numéro déjà connu se réutilise — un poème corrigé garde son lien ;
//   · rien ne se supprime, jamais. Retirer un poème est un geste manuel et délibéré.
//
// Usage :
//   node scripts/plier.mjs              tous les .md de plis-source/
//   node scripts/plier.mjs 015          celui-là seulement

import { randomInt } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { encoder } from '../src/lib/codec.ts'
import {
  decoderLIndex,
  encoderLIndex,
  fabriquerUnJeton,
  jetonDu,
  lireLaSource,
  nomDuFichier,
  rangerDansLIndex,
} from '../src/lib/poeme.ts'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(RACINE, 'plis-source')
const SORTIE = join(RACINE, 'public', 'plis')
const INDEX = join(SORTIE, 'index')

/** L'adresse du produit. Elle se gèle au premier pli envoyé (CLAUDE.md#les-invariants). */
const ADRESSE = 'https://leo-bernard38.github.io/Pli/'

/** La version du schéma du pli — la même que celle de l'atelier. */
const SCHEMA = 1

/**
 * L'index tel qu'il est sur le disque, et **s'il est lisible**.
 *
 * Un index illisible n'est pas un index vide : repartir de zéro réattribuerait des jetons,
 * et un lien déjà parti tomberait en 404. On refuse plutôt que d'écraser — c'est le seul
 * endroit de la moulinette qui puisse casser quelque chose d'irrattrapable.
 */
async function lireLIndex() {
  // **Seule l'absence du fichier** vaut « premier lancement ». Un index présent mais vide
  // est un index abîmé, pas un index neuf : `writeFile` tronque avant d'écrire, donc une
  // écriture interrompue laisse exactement ça — et le prendre pour un départ à zéro
  // réattribuerait les jetons qu'il portait.
  let brut
  try {
    brut = await readFile(INDEX, 'utf8')
  } catch (cause) {
    if (cause.code === 'ENOENT') return []
    throw cause
  }

  const index = await decoderLIndex(brut)
  if (index.length === 0) {
    throw new Error(
      `${INDEX} existe mais ne se relit pas. Un index perdu réattribuerait des jetons, et un ` +
        `lien déjà parti tomberait en 404. Le restaurer depuis git avant de replier quoi que ce soit.`,
    )
  }
  return index
}

/** Les sources à plier : celle qu'on nomme — `015` comme `15` —, ou toutes. */
async function lesSources(demande) {
  const fichiers = (await readdir(SOURCE)).filter((f) => f.endsWith('.md')).sort()
  if (!demande) return fichiers

  const vise = `${String(Number(demande)).padStart(3, '0')}.md`
  if (!fichiers.includes(vise)) throw new Error(`aucune source ne répond à « ${demande} » dans ${SOURCE}`)
  return [vise]
}

async function plier() {
  const [demande] = process.argv.slice(2)

  let index
  try {
    index = await lireLIndex()
  } catch (cause) {
    console.error(`refus — ${cause.message}`)
    process.exitCode = 1
    return
  }

  let sources
  try {
    sources = await lesSources(demande)
  } catch (cause) {
    console.error(
      cause.code === 'ENOENT' ? `refus — ${SOURCE} n’existe pas. Les poèmes s’écrivent là.` : `refus — ${cause.message}`,
    )
    process.exitCode = 1
    return
  }

  if (sources.length === 0) {
    console.error(`rien à plier — aucun .md dans ${SOURCE}`)
    return
  }

  await mkdir(SORTIE, { recursive: true })

  const liens = []
  /** Les numéros vus dans ce lancement — le nom du fichier ne fait pas le numéro. */
  const vus = new Map()

  for (const fichier of sources) {
    let source
    try {
      source = lireLaSource(await readFile(join(SOURCE, fichier), 'utf8'))
    } catch (cause) {
      console.error(`refus — ${fichier} : ${cause.message}`)
      process.exitCode = 1
      return
    }

    const { entete, strophes } = source

    // Le numéro vient du front-matter, pas du nom du fichier : rien n'empêche deux sources
    // de déclarer le même. Comme le jeton se réutilise par numéro, la seconde écraserait le
    // .txt de la première sous le même nom — le lien resterait valable et son contenu aurait
    // changé, sans un mot. Un numéro est une adresse : il ne se partage pas.
    const deja = vus.get(entete.n)
    if (deja) {
      console.error(`refus — ${fichier} et ${deja} portent tous deux « n: ${entete.n} ». Un numéro est une adresse.`)
      process.exitCode = 1
      return
    }
    vus.set(entete.n, fichier)
    const jeton = jetonDu(entete.n, index, () => fabriquerUnJeton((borne) => randomInt(borne)))
    const nom = nomDuFichier(entete.n, jeton)

    // Le même objet qu'un pli de lien, au même codec — `b` devenant le tableau des strophes.
    const payload = await encoder({
      v: SCHEMA,
      t: 'poe',
      n: entete.n,
      ti: entete.titre,
      b: strophes,
      s: entete.signe,
    })

    await writeFile(join(SORTIE, `${nom}.txt`), `${payload}\n`, 'utf8')
    index = rangerDansLIndex(index, { n: entete.n, j: jeton, ti: entete.titre })
    liens.push(`nº ${String(entete.n).padStart(3, '0')} → ${ADRESSE}#p=${nom}`)
  }

  await writeFile(INDEX, `${await encoderLIndex(index)}\n`, 'utf8')
  for (const lien of liens) console.log(lien)
}

await plier()
