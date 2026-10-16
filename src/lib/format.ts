/** Garde uniquement les chiffres (et un + initial) pour comparer deux numéros. */
export function normaliserTelephone(tel: string) {
  return tel.trim().replace(/(?!^\+)[^\d]/g, "")
}

/** "0701020304" → "07 01 02 03 04" ; un numéro international est gardé tel que saisi. */
export function formaterTelephone(tel: string) {
  if (tel.trim().startsWith("+")) return tel.trim().replace(/\s+/g, " ")
  return normaliserTelephone(tel).replace(/(\d{2})(?=\d)/g, "$1 ")
}

export function fmt(n: number) {
  return n.toLocaleString("fr-FR") + " F"
}

/** "2026-08-14 16:05" → "14 août 2026 à 16:05" */
export function dateLongue(date: string) {
  const [jour, heure] = date.split(" ")
  const d = new Date(jour + "T00:00:00")
  if (Number.isNaN(d.getTime())) return date
  const libelle = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  return heure ? `${libelle} à ${heure}` : libelle
}

const UNITES = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
  "dix-sept", "dix-huit", "dix-neuf",
]
const DIZAINES = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"]

function moinsDeCent(n: number): string {
  if (n < 20) return UNITES[n]
  if (n < 70) {
    const d = Math.floor(n / 10)
    const u = n % 10
    if (u === 0) return DIZAINES[d]
    return DIZAINES[d] + (u === 1 ? "-et-un" : "-" + UNITES[u])
  }
  if (n < 80) return n === 71 ? "soixante-et-onze" : "soixante-" + UNITES[n - 60]
  if (n === 80) return "quatre-vingts"
  return "quatre-vingt-" + UNITES[n - 80]
}

function moinsDeMille(n: number): string {
  const c = Math.floor(n / 100)
  const r = n % 100
  if (c === 0) return moinsDeCent(r)
  const centaines = c === 1 ? "cent" : UNITES[c] + "-cent" + (r === 0 ? "s" : "")
  return r === 0 ? centaines : centaines + "-" + moinsDeCent(r)
}

/** Écrit un entier positif en toutes lettres (orthographe rectifiée, avec traits d'union). */
export function enLettres(n: number): string {
  n = Math.floor(Math.abs(n))
  if (n === 0) return UNITES[0]
  const parts: string[] = []
  const millions = Math.floor(n / 1_000_000)
  const milliers = Math.floor((n % 1_000_000) / 1000)
  const reste = n % 1000
  if (millions) parts.push(moinsDeMille(millions) + (millions > 1 ? "-millions" : "-million"))
  if (milliers) parts.push(milliers === 1 ? "mille" : moinsDeMille(milliers).replace(/(cent|vingt)s$/, "$1") + "-mille")
  if (reste) parts.push(moinsDeMille(reste))
  return parts.join("-")
}
