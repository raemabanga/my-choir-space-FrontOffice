import type { Evenement, StatutMois } from "@/types/portail"

export const STATUT_MOIS = {
  impaye: 0,
  paye: 1,
  payeEnRetard: 2,
} as const satisfies Record<string, StatutMois>

export function anneeCourante() {
  return new Date().getFullYear()
}

export function moisCourant() {
  return new Date().getMonth()
}

/** Nombre de mensualités exigibles à ce jour pour un exercice donné. */
export function moisEcoules(annee: number) {
  const courante = anneeCourante()
  if (annee < courante) return 12
  if (annee > courante) return 0
  return moisCourant() + 1
}

export function estPaye(statut: StatutMois) {
  return statut === STATUT_MOIS.paye || statut === STATUT_MOIS.payeEnRetard
}

export function statsMembreStatutaire(mois: StatutMois[], ecoules: number, mensualite: number) {
  const exigibles = mois.slice(0, ecoules)
  const payes = mois.filter(estPaye).length
  const impayes = exigibles.filter((s) => !estPaye(s)).length
  return {
    payes,
    impayes,
    verse: payes * mensualite,
    attendu: ecoules * mensualite,
    aJour: impayes === 0,
  }
}

export function statsStatutaire(
  suivis: Record<string, StatutMois[]>,
  ecoules: number,
  mensualite: number
) {
  const membres = Object.values(suivis).map((m) => statsMembreStatutaire(m, ecoules, mensualite))
  const collecte = membres.reduce((s, m) => s + m.verse, 0)
  const attendu = membres.length * ecoules * mensualite
  const enAttente = membres.reduce((s, m) => s + m.impayes, 0)
  return {
    collecte,
    attendu,
    taux: attendu ? Math.min(100, Math.round((collecte / attendu) * 100)) : 0,
    aJour: membres.filter((m) => m.aJour).length,
    total: membres.length,
    enAttente,
    reste: enAttente * mensualite,
  }
}

export type StatutEvenement = "paye" | "partiel" | "impaye" | "libre"

export function statutEvenement(evenement: Evenement, choriste: string): StatutEvenement {
  const { montant, versements } = evenement.cotisation
  const verse = versements[choriste] ?? 0
  if (montant <= 0) return "libre"
  if (verse >= montant) return "paye"
  return verse > 0 ? "partiel" : "impaye"
}

export function telechargerCsv(nomFichier: string, lignes: (string | number)[][]) {
  const contenu = lignes
    .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\r\n")
  const blob = new Blob(["﻿" + contenu], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = nomFichier
  a.click()
  URL.revokeObjectURL(url)
}
