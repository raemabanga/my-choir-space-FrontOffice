import { useMemo, useState, type ReactNode } from "react"
import { Download, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { statutEvenement, telechargerCsv, type StatutEvenement } from "@/lib/cotisations"
import { fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Evenement } from "@/types/portail"
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

const TONE: Record<StatutEvenement, CellTone> = {
  paye: "paye",
  partiel: "partiel",
  impaye: "impaye",
  libre: "libre",
}

const LABEL: Record<StatutEvenement, string> = {
  paye: "Payé",
  partiel: "Partiel",
  impaye: "Non payé",
  libre: "Sans cotisation",
}

function dateCourte(date: string) {
  const d = new Date(date + "T00:00:00")
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
}

export function CotisationsEvenements({
  appName,
  evenements,
  choristes,
  roleDe,
  canPaiement,
  onPaiement,
  onVoirEvenement,
  tabs,
}: {
  appName: string
  evenements: Evenement[]
  choristes: string[]
  roleDe: (nom: string) => string
  canPaiement: boolean
  onPaiement: (pre: { choriste?: string; eventId?: string; type?: string }) => void
  onVoirEvenement: (id: string) => void
  tabs: ReactNode
}) {
  const [recherche, setRecherche] = useState("")
  const [filtre, setFiltre] = useState<FiltreMembres>("tous")

  const evs = useMemo(
    () => [...evenements].sort((a, b) => a.date.localeCompare(b.date)),
    [evenements]
  )
  const avecCotisation = evs.filter((e) => e.cotisation.montant > 0)

  const membres = useMemo(() => {
    const noms = Array.from(
      new Set([...choristes, ...evs.flatMap((e) => Object.keys(e.cotisation.versements))])
    )
    return noms.map((nom) => {
      const statuts = evs.map((e) => statutEvenement(e, nom))
      const verse = evs.reduce((s, e) => s + (e.cotisation.versements[nom] ?? 0), 0)
      const du = avecCotisation.reduce((s, e) => s + e.cotisation.montant, 0)
      const impayes = statuts.filter((s) => s === "impaye" || s === "partiel").length
      return { nom, statuts, verse, du, impayes, aJour: impayes === 0 }
    })
  }, [choristes, evs, avecCotisation])

  const attendu = membres.reduce((s, m) => s + m.du, 0)
  const collecte = membres.reduce((s, m) => s + Math.min(m.verse, m.du || m.verse), 0)
  const taux = attendu ? Math.min(100, Math.round((collecte / attendu) * 100)) : 0
  const reste = Math.max(0, attendu - collecte)
  const enAttente = membres.reduce((s, m) => s + m.impayes, 0)

  const counts = {
    tous: membres.length,
    "a-jour": membres.filter((m) => m.aJour).length,
    "en-retard": membres.filter((m) => !m.aJour).length,
    aucun: membres.filter((m) => m.verse === 0).length,
  }

  const visibles = membres.filter(
    (m) =>
      m.nom.toLowerCase().includes(recherche.trim().toLowerCase()) &&
      (filtre === "tous" ||
        (filtre === "a-jour" && m.aJour) ||
        (filtre === "en-retard" && !m.aJour) ||
        (filtre === "aucun" && m.verse === 0))
  )

  const tauxEvenement = evs.map((e) =>
    e.cotisation.montant > 0 && membres.length
      ? Math.round(
          (membres.filter((m) => statutEvenement(e, m.nom) === "paye").length / membres.length) * 100
        )
      : null
  )

  const aujourdhui = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })

  function exporter() {
    telechargerCsv("cotisations-evenementielles.csv", [
      ["Membre", "Rôle", ...evs.map((e) => `${e.titre} (${e.date})`), "Total versé (F)", "Impayés"],
      ...membres.map((m) => [
        m.nom,
        roleDe(m.nom),
        ...evs.map((e) => e.cotisation.versements[m.nom] ?? 0),
        m.verse,
        m.impayes,
      ]),
    ])
  }

  return (
    <div className="space-y-5">
      {tabs}

      <PageHeading
        eyebrow={`${appName} · ${evs.length} événement${evs.length > 1 ? "s" : ""}`}
        title="Cotisations événementielles"
        subtitle={`Participation de chaque membre par événement · situation au ${aujourdhui}`}
        actions={
          <>
            <Button variant="outline" onClick={exporter}>
              <Download /> Exporter
            </Button>
            {canPaiement && (
              <Button
                className="bg-teal hover:bg-teal/90"
                onClick={() => onPaiement({ type: "evenementielle", eventId: evs[0]?.id })}
              >
                <Plus /> Enregistrer un paiement
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Collecté sur les événements"
          value={fmt(collecte)}
          hint={`sur ${fmt(attendu)} attendus`}
        />
        <KpiCard
          label="Taux de recouvrement"
          value={`${taux} %`}
          progress={taux}
          hint={`${avecCotisation.length} événement${avecCotisation.length > 1 ? "s" : ""} avec cotisation`}
        />
        <KpiCard
          label="Membres à jour"
          value={String(counts["a-jour"])}
          suffix={`/${membres.length}`}
          hint="toutes les cotisations réglées"
        />
        <KpiCard
          label="Reste à percevoir"
          value={fmt(reste)}
          tone={reste > 0 ? "danger" : "default"}
          hint={`${enAttente} cotisation${enAttente > 1 ? "s" : ""} en attente`}
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
                { tone: "partiel", label: "Partiel" },
                { tone: "impaye", label: "Non payé" },
                { tone: "libre", label: "Sans cotisation" },
              ]}
            />
          }
        />

        <div className="overflow-x-auto border-t border-[var(--line)]">
          <table className="w-full text-sm" style={{ minWidth: 420 + evs.length * 110 }}>
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th className="sticky left-0 z-10 h-14 min-w-52 bg-white px-5 text-left text-[10px] font-semibold tracking-[0.14em] text-[var(--ink-light)] uppercase">
                  Membre
                </th>
                {evs.map((e) => (
                  <th key={e.id} className="h-14 w-28 px-2 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => onVoirEvenement(e.id)}
                      title={`Voir « ${e.titre} »`}
                      className="mx-auto block max-w-28 rounded-lg px-1.5 py-1 transition-colors hover:bg-[var(--muted)]"
                    >
                      <span className="block truncate text-[11px] font-semibold text-[var(--ink)]">
                        {e.titre}
                      </span>
                      <span className="block text-[10px] font-medium text-[var(--ink-light)]">
                        {dateCourte(e.date)} · {e.cotisation.montant ? fmt(e.cotisation.montant) : "libre"}
                      </span>
                    </button>
                  </th>
                ))}
                <th className="h-14 px-5 text-left text-[10px] font-semibold tracking-[0.14em] text-[var(--ink-light)] uppercase">
                  Total versé
                </th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={evs.length + 2} className="py-10 text-center text-[13px] text-[var(--ink-light)]">
                    {filtre === "aucun" && !recherche
                      ? "Tous les membres ont versé au moins une cotisation événementielle."
                      : "Aucun membre ne correspond à la recherche."}
                  </td>
                </tr>
              )}
              {visibles.map((m) => (
                <tr key={m.nom} className="border-b border-[var(--line)] transition-colors hover:bg-[var(--muted)]/60">
                  <td className="sticky left-0 z-10 bg-white px-5 py-3">
                    <MemberCell nom={m.nom} role={roleDe(m.nom)} />
                  </td>
                  {evs.map((e, i) => {
                    const statut = m.statuts[i]
                    const verse = e.cotisation.versements[m.nom] ?? 0
                    const reglable = canPaiement && (statut === "impaye" || statut === "partiel")
                    return (
                      <td key={e.id} className="px-2 py-3">
                        <StatusCell
                          tone={TONE[statut]}
                          title={`${e.titre} — ${LABEL[statut]} (${fmt(verse)} / ${fmt(e.cotisation.montant)})${
                            reglable ? " · cliquer pour encaisser" : ""
                          }`}
                          onClick={
                            reglable
                              ? () => onPaiement({ choriste: m.nom, eventId: e.id, type: "evenementielle" })
                              : undefined
                          }
                        />
                      </td>
                    )
                  })}
                  <td className="px-5 py-3">
                    <TotalCell
                      montant={fmt(m.verse)}
                      progress={m.du ? (m.verse / m.du) * 100 : 100}
                      impayes={m.impayes}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[var(--muted)]/50">
                <td className="sticky left-0 z-10 bg-[#f8f9fb] px-5 py-3 text-[12px] font-semibold text-[var(--ink)]">
                  Taux de paiement
                </td>
                {tauxEvenement.map((t, i) => (
                  <td key={i} className="px-2 py-3">
                    <RateCell value={t} />
                  </td>
                ))}
                <td className="px-5 py-3 text-[12.5px] font-semibold text-[var(--ink)]">{fmt(collecte)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <p className="text-[12px] text-[var(--ink-light)]">
        {canPaiement
          ? "Astuce : cliquez sur une case « non payé » ou « partiel » pour encaisser la cotisation, et sur le nom d'un événement pour ouvrir sa fiche."
          : "Cliquez sur le nom d'un événement pour ouvrir sa fiche détaillée."}
      </p>
    </div>
  )
}
