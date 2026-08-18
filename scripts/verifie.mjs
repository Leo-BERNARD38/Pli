#!/usr/bin/env node
/**
 * La relecture qui ne coûte rien.
 *
 * Tout ce qui se vérifie par une expression régulière n'a rien à faire dans un agent :
 * un mot hors lexique, une couleur en dur, un accès direct au stockage, une propriété
 * animée qui déclenche une disposition. Ces contrôles-là tournent ici, en une seconde,
 * à chaque écriture et à chaque `npm run verifie` — et les relecteurs gardent ce qui
 * demande vraiment un jugement : la composition, la cadence, ce qui casse un lien parti.
 *
 * Deux gravités, et pas une troisième :
 *   refus   — la règle est écrite quelque part dans docs/. On corrige, on ne discute pas.
 *   regard  — c'est peut-être délibéré. Le message dit pourquoi, la sortie reste verte.
 *
 * Une ligne qui porte `lexique-ok` (en commentaire) échappe aux contrôles de mots :
 * c'est la seule échappatoire, elle est visible dans le diff.
 *
 * Usage :
 *   node scripts/verifie.mjs                  tout le dépôt
 *   node scripts/verifie.mjs --fichier <p>    un seul fichier
 *   node scripts/verifie.mjs --hook           sortie JSON pour un hook, jamais d'échec
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative, extname, basename } from 'node:path'

const RACINE = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
const HOOK = args.includes('--hook')
const CIBLE = args[args.indexOf('--fichier') + 1]

const griefs = []
const refus = (f, l, m) => griefs.push({ gravite: 'refus', f, l, m })
const regard = (f, l, m) => griefs.push({ gravite: 'regard', f, l, m })

/* ── les fichiers qu'on regarde ─────────────────────────────────────────────── */

const IGNORE = new Set(['node_modules', 'dist', '.git', 'design', 'polices-source', 'plis-source'])

function fichiers(dossier, sortie = []) {
  for (const nom of readdirSync(dossier)) {
    if (IGNORE.has(nom)) continue
    const chemin = join(dossier, nom)
    if (statSync(chemin).isDirectory()) fichiers(chemin, sortie)
    else if (['.ts', '.css', '.html'].includes(extname(nom))) sortie.push(chemin)
  }
  return sortie
}

const aRegarder = CIBLE
  ? [join(RACINE, relative(RACINE, CIBLE))].filter((c) => existsSync(c))
  : [
      ...fichiers(join(RACINE, 'src')),
      ...['index.html', 'atelier/index.html'].map((n) => join(RACINE, n)).filter(existsSync),
    ]

/* ── masquer les commentaires : un mot cité n'est pas un mot employé ─────────── */

function sansCommentaires(texte, ext) {
  let t = texte.replace(/\/\*[\s\S]*?\*\//g, (bloc) => bloc.replace(/[^\n]/g, ' '))
  if (ext === '.html') t = t.replace(/<!--[\s\S]*?-->/g, (bloc) => bloc.replace(/[^\n]/g, ' '))
  if (ext === '.ts') t = t.replace(/(^|[^:])\/\/[^\n]*/g, (m, avant) => avant + ' '.repeat(m.length - avant.length))
  return t
}

/* ── le lexique, fermé et normatif (docs/design-system.md#ton-et-vocabulaire) ── */

const MOTS_INTERDITS = [
  [/\bouvrir\b/i, 'on dit « déplier »'],
  [/\bcr[ée]er\b/i, 'on dit « déposer »'],
  [/\bvalider\b/i, 'on dit « déposer »'],
  [/\benvoyer un message\b/i, 'on dit « répondre »'],
  [/\bchamps?\b/i, 'on dit « la ligne »'],
  [/\bformulaire/i, 'le mot n’existe pas dans le produit'],
  [/\bcomptes?\b/i, 'rien à signer : pas de compte'],
  [/\bnotifications?\b/i, 'rien à signer : pas de notification'],
  [/\berreurs?\b/i, 'on nomme l’état — « lien abîmé »'],
  [/\bstudio\b/i, 'retiré du produit'],
  [/\bcr[ée]ateur/i, 'on dit « l’atelier »'],
  [/\bcartes?\b/i, 'retiré du produit — c’est « un pli »'],
  [/\bexpir[ée]/i, 'C4 dit « lien abîmé », jamais « expiré »'],
]

/** Les segments d’un nom : `formatDate` → format, date ; `pli--encre` → pli, encre. */
const segments = (nom) =>
  nom
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-zÀ-ÿ0-9]+/)
    .filter(Boolean)
    .map((s) => s.toLowerCase())

const NOMS_INTERDITS = new Set([
  'card', 'cards', 'carte', 'cartes', 'form', 'forms', 'formulaire', 'champ', 'champs',
  'valid', 'valider', 'validate', 'create', 'creer', 'createur', 'studio', 'compte',
  'notif', 'notification', 'error', 'erreur', 'open', 'ouvrir',
])

/** Les deux seuls modules qui ont le droit de toucher au stockage du navigateur. */
const STOCKAGE = /lib[/\\](journal|tiroir)\.ts$/

/** Les chaînes de caractères d’une ligne — ce que quelqu’un peut lire à l’écran. */
function chaines(ligne) {
  const trouvees = []
  for (const m of ligne.matchAll(/'([^'\\]*)'|"([^"\\]*)"|`([^`\\$]*)`/g)) {
    trouvees.push(m[1] ?? m[2] ?? m[3] ?? '')
  }
  return trouvees.filter((c) => /[A-Za-zÀ-ÿ]/.test(c))
}

/* ── les contrôles ──────────────────────────────────────────────────────────── */

for (const chemin of aRegarder) {
  const f = relative(RACINE, chemin)
  const ext = extname(chemin)
  const brut = readFileSync(chemin, 'utf8')
  const propre = sansCommentaires(brut, ext)
  const lignes = propre.split('\n')
  const lignesBrutes = brut.split('\n')
  const test = !/\.test\.ts$/.test(f)

  lignes.forEach((ligne, i) => {
    const n = i + 1
    const exempte = /lexique-ok/.test(lignesBrutes[i])

    /* les mots visibles */
    if (test && !exempte) {
      const visibles =
        ext === '.html'
          ? [...ligne.matchAll(/>([^<>]{2,})</g)].map((m) => m[1]).concat(
              [...ligne.matchAll(/(?:aria-label|title|alt|placeholder)="([^"]*)"/g)].map((m) => m[1]),
            )
          : chaines(ligne)

      for (const texte of visibles) {
        for (const [motif, pourquoi] of MOTS_INTERDITS) {
          const m = texte.match(motif)
          if (m) refus(f, n, `lexique — « ${m[0]} » : ${pourquoi}`)
        }
        if (/\p{Extended_Pictographic}/u.test(texte))
          refus(f, n, 'lexique — pas d’emoji ; la seule exception nommée est le cœur du message WhatsApp d’A3')
        if (/[!]\s*$/.test(texte.trim()))
          refus(f, n, 'lexique — pas d’exclamation (design-system.md#ton-et-vocabulaire)')
        const lettres = texte.replace(/[^A-Za-zÀ-ÿ]/g, '')
        if (lettres.length >= 3 && !/[0-9]/.test(texte) && lettres === lettres.toUpperCase())
          refus(f, n, 'les étiquettes s’écrivent en minuscules dans le code ; les capitales viennent de `text-transform`')
      }
    }

    /* les noms du code */
    if (!exempte) {
      const declares =
        ext === '.css'
          ? [...ligne.matchAll(/(?:^|[\s,>+~])\.([a-zA-Z][\w-]*)/g)].map((m) => m[1])
          : [...ligne.matchAll(/(?:function|class|const|let|var|interface|type)\s+([A-Za-zÀ-ÿ_$][\w$]*)/g)].map((m) => m[1])
      for (const nom of declares) {
        const fautif = segments(nom).find((s) => NOMS_INTERDITS.has(s))
        if (fautif) refus(f, n, `lexique — le nom « ${nom} » porte « ${fautif} », qui est hors du lexique`)
      }
    }

    /* les invariants (CLAUDE.md#les-invariants) */
    // Deux modules de stockage, et deux seulement : `journal.ts` garde ses plis à elle,
    // `tiroir.ts` garde mes réglages d'atelier. Ils ne se mélangent pas — le numéro de
    // réponse n'a rien à faire dans le module que le lecteur importe
    // (docs/donnees.md#5-mon-historique).
    if (/\blocalStorage\s*\./.test(ligne) && !STOCKAGE.test(f))
      refus(f, n, 'invariant — tout accès à `localStorage` passe par `journal.ts` ou `tiroir.ts`')
    if (/\bsessionStorage\s*\./.test(ligne) && !STOCKAGE.test(f))
      regard(f, n, 'invariant — `garde-invariants` demande qu’aucun stockage ne vive hors de `journal.ts` ou `tiroir.ts`')
    if (/history\.(pushState|replaceState)/.test(ligne))
      refus(f, n, 'invariant — routage par hash seulement : Pages ne réécrit aucune URL, une route profonde tombe en 404')
    // `wa.me` n'est pas un tiers au sens de la règle : rien n'en est chargé, c'est la
    // destination d'un lien sortant, et docs/donnees.md#6-la-réponse-whatsapp prescrit
    // cette adresse au caractère près. Un tiers, c'est ce qui entre dans la page.
    const url = ligne.match(/https?:\/\/[^\s"'`)]+/)
    if (url && !/^https?:\/\/(leo-bernard38\.github\.io|wa\.me\/|www\.w3\.org)/.test(url[0]))
      refus(f, n, `invariant — aucun tiers : « ${url[0]} » sort du site`)

    /* les encres et le mouvement (design-system.md, fluidite.md, chargement.md) */
    if (ext === '.css') {
      if (/#(000|fff)\b|#(000000|ffffff)\b/i.test(ligne))
        refus(f, n, 'encres — `--encre` et `--creme`, jamais `#000` ni `#fff`')
      else if (/#[0-9a-fA-F]{3,8}\b/.test(ligne) && basename(f) !== 'tokens.css')
        regard(f, n, 'encres — une couleur en dur hors de `tokens.css` ; si elle est mesurée, le dire en commentaire')
      if (/font-display\s*:\s*swap/.test(ligne))
        refus(f, n, 'chargement — `font-display: block`, jamais `swap`')
      if (/@import\s+url\(\s*['"]?https?:/.test(ligne))
        refus(f, n, 'chargement — aucun tiers, pas de CDN de polices')
      const anime = ligne.match(
        /(?:transition|animation)(?:-property)?\s*:[^;]*\b(top|left|right|bottom|width|height|margin|padding|box-shadow|filter|backdrop-filter|background-position|object-position|border-radius|clip-path)\b/,
      )
      if (anime)
        refus(f, n, `fluidité — « ${anime[1]} » animée : seuls \`transform\` et \`opacity\` bougent`)
    }

    if (ext === '.ts' && /documentElement\.style\.setProperty/.test(ligne))
      refus(f, n, 'fluidité — jamais une variable CSS sur `:root` : recalcul du style de tout l’arbre pour deux éléments')
  })
}

/* ── le socle : zéro dépendance au runtime ──────────────────────────────────── */

if (!CIBLE) {
  const paquet = JSON.parse(readFileSync(join(RACINE, 'package.json'), 'utf8'))
  const deps = Object.keys(paquet.dependencies ?? {})
  if (deps.length)
    refus('package.json', 0, `invariant — zéro dépendance au runtime, et il y en a ${deps.length} : ${deps.join(', ')}`)
}

/* ── ce qu’on rend ──────────────────────────────────────────────────────────── */

const casse = griefs.filter((g) => g.gravite === 'refus')
const aVoir = griefs.filter((g) => g.gravite === 'regard')

if (HOOK) {
  // Le hook ne parle que des refus : un « à regarder » répété à chaque écriture est du bruit,
  // et le bruit coûte du contexte. Ils sortent avec `npm run verifie`.
  if (!casse.length) process.exit(0)
  const texte = casse.map((g) => `${g.f}:${g.l} — ${g.m}`).join('\n')
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: `verifie.mjs :\n${texte}\nCorriger avant d’aller plus loin.`,
      },
    }),
  )
  process.exit(0)
}

for (const g of casse) console.log(`refus   ${g.f}:${g.l}  ${g.m}`)
for (const g of aVoir) console.log(`regard  ${g.f}:${g.l}  ${g.m}`)

if (!griefs.length) console.log(`rien à redire — ${aRegarder.length} fichiers relus`)
else console.log(`\n${casse.length} refus, ${aVoir.length} à regarder`)

process.exit(casse.length ? 1 : 0)
