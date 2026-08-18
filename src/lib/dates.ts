// Les dates, en français.
//
// Deux emplois, et rien de plus :
//   · l'horodatage du journal — « 2026-08-17T21:04 », à la minute, en heure locale
//     (docs/donnees.md#4-son-journal) ;
//   · ce qui se lit à l'écran — le relatif d'abord, l'absolu ensuite.
//
// Les noms de mois sont écrits à la main : la même sortie sous Node, dans Safari et dans
// Chrome, au caractère près. Intl varie avec la bibliothèque ICU de l'appareil.

const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
] as const

const LETTRES = ['', '', 'deux', 'trois', 'quatre', 'cinq', 'six'] as const

/**
 * Au-delà, on ne compte plus les jours : on nomme la date. La bascule suit la table —
 * allonger l'une sans l'autre écrirait « il y a undefined jours ».
 */
const BASCULE = LETTRES.length

function deuxChiffres(nombre: number): string {
  return String(nombre).padStart(2, '0')
}

function minuit(quand: Date): number {
  return new Date(quand.getFullYear(), quand.getMonth(), quand.getDate()).getTime()
}

/** L'horodatage du journal : « 2026-08-17T21:04 ». */
export function horodate(quand: Date): string {
  const date = `${quand.getFullYear()}-${deuxChiffres(quand.getMonth() + 1)}-${deuxChiffres(quand.getDate())}`
  return `${date}T${deuxChiffres(quand.getHours())}:${deuxChiffres(quand.getMinutes())}`
}

/** Relit un horodatage du journal. Ce qui n'en est pas un est refusé, jamais deviné. */
export function relire(horodatage: string): Date {
  const morceaux = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(horodatage)
  if (!morceaux) throw new Error('date illisible')
  const [annee, mois, quantieme, heures, minutes] = morceaux.slice(1).map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ]
  // Le report fait le reste du contrôle : un 30 février ou une 25e heure changent le jour
  // ou le mois. L'année, elle, ne reporte pas — et `new Date` mappe 0 à 99 sur 1900.
  const quand = new Date(annee, mois - 1, quantieme, heures, minutes)
  const intact =
    quand.getFullYear() === annee && quand.getMonth() === mois - 1 && quand.getDate() === quantieme
  if (!intact) throw new Error('date illisible')
  return quand
}

/** L'heure seule : « 21h04 ». */
export function heure(quand: Date): string {
  return `${deuxChiffres(quand.getHours())}h${deuxChiffres(quand.getMinutes())}`
}

/** La date nommée : « 17 août », l'année ajoutée seulement si ce n'est pas celle d'aujourd'hui. */
export function jour(quand: Date, maintenant: Date): string {
  const quantieme = quand.getDate() === 1 ? '1er' : String(quand.getDate())
  const nomme = `${quantieme} ${MOIS[quand.getMonth()]}`
  return quand.getFullYear() === maintenant.getFullYear() ? nomme : `${nomme} ${quand.getFullYear()}`
}

/**
 * Depuis quand : « aujourd'hui », « hier », « il y a trois jours », puis la date nommée.
 * L'écart se compte en jours civils, pas en tranches de vingt-quatre heures.
 */
export function depuis(quand: Date, maintenant: Date): string {
  const ecart = Math.round((minuit(maintenant) - minuit(quand)) / 86_400_000)
  if (ecart <= 0) return "aujourd'hui"
  if (ecart === 1) return 'hier'
  if (ecart < BASCULE) return `il y a ${LETTRES[ecart]} jours`
  return jour(quand, maintenant)
}
