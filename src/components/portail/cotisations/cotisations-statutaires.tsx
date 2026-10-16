import { useMemo, useState, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, Download, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MOIS } from "@/data/portail-mock"
import {
  anneeCourante,
  estPaye,
  moisCourant,
  moisEcoules,
  statsMembreStatutaire,
  statsStatutaire,
  telechargerCsv,
} from "@/lib/cotisations"
import { fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { StatutMois, Statutaire } from "@/types/portail"
import {
  cardClass,
  KpiCard,
  Legend,
  MemberCell,
  PageHeading,
  RateCell,
  StatusCell,
  Toolbar,
  TotalCell,
  type CellTone,
  type FiltreMembres,
} from "./cotisations-ui"

const MOIS_LONGS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
]
const MOIS_COURTS = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."]

const LABEL_STATUT: Record<CellTone, string> = {
  paye: "Payé",
  retard: "Payé en retard",
  impaye: "Impayé",
  avenir: "À venir",
  partiel: "Partiel",
  libre: "—",
}

function toneDe(statut: StatutMois, exigible: boolean): CellTone {
  if (statut === 1) return "paye"
  if (statut === 2) return "retard"
  return exigible ? "impaye" : "avenir"
}

/** Cycle de la carte : payé → payé en retard → impayé → payé */
function statutSuivant(statut: StatutMois): StatutMois {
  return statut === 1 ? 2 : statut === 2 ? 0 : 1
}

export function CotisationsStatutaires({
  appName,
  statutaire,
  choristes,
  roleDe,
  canPaiement,
  onPaiement,
  onChangerStatut,
  tabs,
}: {
  appName: string
  statutaire: Statutaire
  choristes: string[]
  roleDe: (nom: string) => string
  canPaiement: boolean
  onPaiement: (pre: { choriste?: string; type?: string }) => void
  onChangerStatut: (annee: number, choriste: string, mois: number, statut: StatutMois) => void
  tabs: ReactNode
}) {
  const annees = Object.keys(statutaire.exercices).map(Number).sort((a, b) => a - b)
  const [annee, setAnnee] = useState(() =>
    annees.includes(anneeCourante()) ? anneeCourante() : annees[annees.length - 1]
  )
  const [recherche, setRecherche] = useState("")
  const [filtre, setFiltre] = useState<FiltreMembres>("tous")

  const suivis = statutaire.exercices[annee] ?? {}
  const ecoules = moisEcoules(annee)
  const { mensualite } = statutaire
  const stats = statsStatutaire(
    Object.fromEntries(
      Array.from(new Set([...choristes, ...Object.keys(suivis)])).map((nom) => [
        nom,
        suivis[nom] ?? (Array(12).fill(0) as StatutMois[]),
      ])
    ),
    ecoules,
    mensualite
  )
  const estAnneeCourante = annee === anneeCourante()

  const membres = useMemo(
    () =>
      Array.from(new Set([...choristes, ...Object.keys(suivis)])).map((nom) => {
        const mois = suivis[nom] ?? (Array(12).fill(0) as StatutMois[])
        return { nom, mois, ...statsMembreStatutaire(mois, ecoules, mensualite) }
      }),
    [choristes, suivis, ecoules, mensualite]
  )

  const counts = {
    tous: membres.length,
    "a-jour": membres.filter((m) => m.aJour).length,
    "en-retard": membres.filter((m) => !m.aJour).length,
    aucun: membres.filter((m) => m.payes === 0).length,
  }

  const visibles = membres.filter(
    (m) =>
      m.nom.toLowerCase().includes(recherche.trim().toLowerCase()) &&
      (filtre === "tous" ||
        (filtre === "a-jour" && m.aJour) ||
        (filtre === "en-retard" && !m.aJour) ||
        (filtre === "aucun" && m.payes === 0))
  )

  const tauxMois = MOIS.map((_, i) =>
    i < ecoules && membres.length
      ? Math.round((membres.filter((m) => estPaye(m.mois[i])).length / membres.length) * 100)
      : null
  )

  const aujourdhui = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })

  function exporter() {
    telechargerCsv(`cotisations-statutaires-${annee}.csv`, [
      ["Membre", "Rôle", ...MOIS_LONGS, "Total versé (F)", "Impayés"],
      ...membres.map((m) => [
        m.nom,
        roleDe(m.nom),
        ...m.mois.map((s, i) => LABEL_STATUT[toneDe(s, i < ecoules)]),
        m.verse,
        m.impayes,
      ]),
    ])
  }

  return (
    <div className="space-y-5">
      {tabs}

      <PageHeading
        eyebrow={`${appName} · Exercice ${annee}`}
        title="Cotisations statutaires"
        subtitle={`Mensualité de ${fmt(mensualite)} par membre · ${
          estAnneeCourante ? `situation au ${aujourdhui}` : "exercice clôturé"
        }`}
        actions={
          <>
            <div className="flex items-center rounded-xl border border-[var(--line)] bg-white">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Exercice précédent"
                disabled={annee <= annees[0]}
                onClick={() => setAnnee(annees[annees.indexOf(annee) - 1])}
              >
                <ChevronLeft />
              </Button>
              <span className="min-w-12 text-center text-sm font-semibold text-[var(--ink)]">{annee}</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Exercice suivant"
                disabled={annee >= annees[annees.length - 1]}
                onClick={() => setAnnee(annees[annees.indexOf(annee) + 1])}
              >
                <ChevronRight />
              </Button>
            </div>
            <Button variant="outline" onClick={exporter}>
              <Download /> Exporter
            </Button>
            {canPaiement && (
              <Button className="bg-teal hover:bg-teal/90" onClick={() => onPaiement({ type: "statutaire" })}>
                <Plus /> Enregistrer un paiement
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label={`Collecté en ${annee}`}
          value={fmt(stats.collecte)}
          hint={`sur ${fmt(stats.attendu)} attendus ${estAnneeCourante ? "à ce jour" : "sur l'exercice"}`}
        />
        <KpiCard
          label="Taux de recouvrement"
          value={`${stats.taux} %`}
          progress={stats.taux}
          hint={`${ecoules} mensualité${ecoules > 1 ? "s" : ""} exigible${ecoules > 1 ? "s" : ""} par membre`}
        />
        <KpiCard
          label="Membres à jour"
          value={String(stats.aJour)}
          suffix={`/${stats.total}`}
          hint="aucune mensualité impayée"
        />
        <KpiCard
          label="Reste à percevoir"
          value={fmt(stats.reste)}
          tone={stats.reste > 0 ? "danger" : "default"}
          hint={`${stats.enAttente} mensualité${stats.enAttente > 1 ? "s" : ""} en attente`}
        />
      </div>

      <Card className={cn(cardClass, "gap-0 py-0")}>
        <Toolbar
          recherche={recherche}
          onRecherche={setRecherche}
          filtre={filtre}
          onFiltre={setFiltre}
          counts={counts}
          legend={
            <Legend
              items={[
                { tone: "paye", label: "Payé" },
                { tone: "retard", label: "Payé en retard" },
                { tone: "impaye", label: "Impayé" },
                { tone: "avenir", label: "À venir" },
              ]}
            />
          }
        />

        <div className="overflow-x-auto border-t border-[var(--line)]">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th className="sticky left-0 z-10 h-11 min-w-52 bg-white px-5 text-left text-[10px] font-semibold tracking-[0.14em] text-[var(--ink-light)] uppercase">
                  Membre
                </th>
                {MOIS_COURTS.map((m, i) => {
                  const courant = estAnneeCourante && i === moisCourant()
                  return (
                    <th
                      key={m}
                      className={cn(
                        "h-11 w-14 px-1 text-center text-[10px] font-semibold tracking-[0.1em] text-[var(--ink-light)] uppercase",
                        courant && "border-b-2 border-teal bg-teal-soft/60 text-teal"
                      )}
                    >
                      {m}
                    </th>
                  )
                })}
                <th className="h-11 px-5 text-left text-[10px] font-semibold tracking-[0.14em] text-[var(--ink-light)] uppercase">
                  Total versé
                </th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={14} className="py-10 text-center text-[13px] text-[var(--ink-light)]">
                    {filtre === "aucun" && !recherche
                      ? `Tous les membres ont effectué au moins un paiement en ${annee}.`
                      : "Aucun membre ne correspond à la recherche."}
                  </td>
                </tr>
              )}
              {visibles.map((m) => (
                <tr key={m.nom} className="border-b border-[var(--line)] transition-colors hover:bg-[var(--muted)]/60">
                  <td className="sticky left-0 z-10 bg-white px-5 py-3">
                    <MemberCell nom={m.nom} role={roleDe(m.nom)} />
                  </td>
                  {m.mois.map((s, i) => {
                    const exigible = i < ecoules
                    const tone = toneDe(s, exigible)
                    const courant = estAnneeCourante && i === moisCourant()
                    return (
                      <td key={i} className={cn("px-1 py-3", courant && "bg-teal-soft/40")}>
                        <StatusCell
                          tone={tone}
                          title={`${MOIS_LONGS[i]} ${annee} — ${LABEL_STATUT[tone]}`}
                          onClick={
                            canPaiement && exigible
                              ? () => onChangerStatut(annee, m.nom, i, statutSuivant(s))
                              : undefined
                          }
                        />
                      </td>
                    )
                  })}
                  <td className="px-5 py-3">
                    <TotalCell
                      montant={fmt(m.verse)}
                      progress={m.attendu ? (m.verse / m.attendu) * 100 : 0}
                      impayes={m.impayes}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[var(--muted)]/50">
                <td className="sticky left-0 z-10 bg-[#f8f9fb] px-5 py-3 text-[12px] font-semibold text-[var(--ink)]">
                  Taux de paiement du mois
                </td>
                {tauxMois.map((t, i) => (
                  <td key={i} className="px-1 py-3">
                    <RateCell value={t} />
                  </td>
                ))}
                <td className="px-5 py-3 text-[12.5px] font-semibold text-[var(--ink)]">
                  {fmt(stats.collecte)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <p className="text-[12px] text-[var(--ink-light)]">
        {canPaiement
          ? "Astuce : cliquez sur une case pour changer son statut (payé → payé en retard → impayé). Les mois à venir ne sont pas modifiables."
          : "Consultation seule : seul le ou la trésorier(ère) peut modifier la carte de cotisation."}
      </p>
    </div>
  )
}
