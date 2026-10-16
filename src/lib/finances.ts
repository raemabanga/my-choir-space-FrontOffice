import { anneeCourante, moisEcoules, statsStatutaire } from "@/lib/cotisations"
import type { Depense, Evenement, Recette, Statutaire, TypeRecette } from "@/types/portail"

export const somme = (xs: { montant: number }[]) => xs.reduce((s, x) => s + x.montant, 0)

export function depensesDe(depenses: Depense[], eventId: string) {
  return depenses.filter((d) => d.eventId === eventId)
}

/** Bilan d'un événement : cotisations + autres recettes rattachées − dépenses validées. */
export function bilanEvenement(evenement: Evenement, depenses: Depense[], recettes: Recette[]) {
  const deps = depensesDe(depenses, evenement.id)
  const validees = somme(deps.filter((d) => d.statut === "validee"))
  const enAttente = somme(deps.filter((d) => d.statut === "en_attente"))
  const autresRecettes = somme(recettes.filter((r) => r.eventId === evenement.id))
  const cotisations = evenement.cotisation.collecte
  const recettesTotal = cotisations + autresRecettes
  return {
    depenses: deps,
    validees,
    enAttente,
    cotisations,
    autresRecettes,
    recettesTotal,
    solde: recettesTotal - validees,
    budget: evenement.budgetPrevisionnel,
    engage: validees + enAttente,
  }
}

export type SourceRecette = "statutaire" | "evenementielle" | TypeRecette

export const SOURCE_LABEL: Record<SourceRecette, string> = {
  statutaire: "Cotisations statutaires",
  evenementielle: "Cotisations événementielles",
  don: "Dons",
  billetterie: "Billetterie",
  subvention: "Subventions",
  autre: "Autres recettes",
}

/** Vue consolidée de la chorale sur l'exercice en cours. */
export function vueConsolidee(
  statutaire: Statutaire,
  evenements: Evenement[],
  depenses: Depense[],
  recettes: Recette[],
  choristes: string[]
) {
  const annee = anneeCourante()
  const ecoules = moisEcoules(annee)
  const suivis = statutaire.exercices[annee] ?? {}
  const statsStat = statsStatutaire(
    Object.fromEntries(choristes.map((n) => [n, suivis[n] ?? Array(12).fill(0)])),
    ecoules,
    statutaire.mensualite
  )

  const evCollecte = evenements.reduce((s, e) => s + e.cotisation.collecte, 0)
  const evAttendu = evenements.reduce((s, e) => s + e.cotisation.montant * choristes.length, 0)

  const parSource: Record<SourceRecette, number> = {
    statutaire: statsStat.collecte,
    evenementielle: evCollecte,
    don: 0,
    billetterie: 0,
    subvention: 0,
    autre: 0,
  }
  for (const r of recettes) parSource[r.type] += r.montant

  const totalRecettes = Object.values(parSource).reduce((s, v) => s + v, 0)
  const validees = depenses.filter((d) => d.statut === "validee")
  const enAttente = depenses.filter((d) => d.statut === "en_attente")
  const totalDepenses = somme(validees)

  const parCategorie = new Map<string, number>()
  for (const d of validees) parCategorie.set(d.categorie, (parCategorie.get(d.categorie) ?? 0) + d.montant)

  return {
    annee,
    statutaire: { collecte: statsStat.collecte, attendu: statsStat.attendu, taux: statsStat.taux },
    evenementielle: {
      collecte: evCollecte,
      attendu: evAttendu,
      taux: evAttendu ? Math.round((evCollecte / evAttendu) * 100) : 0,
    },
    parSource,
    totalRecettes,
    totalDepenses,
    solde: totalRecettes - totalDepenses,
    enAttente: { nombre: enAttente.length, montant: somme(enAttente) },
    parCategorie: [...parCategorie.entries()].sort((a, b) => b[1] - a[1]),
    controles: {
      aValider: enAttente.length,
      sansJustificatif: depenses.filter((d) => d.statut !== "rejetee" && !d.justificatif).length,
      nonRapprochees: validees.filter((d) => !d.rapproche).length,
      montantNonRapproche: somme(validees.filter((d) => !d.rapproche)),
    },
  }
}

export function tailleFichier(octets: number) {
  if (octets < 1024) return `${octets} o`
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`
}
