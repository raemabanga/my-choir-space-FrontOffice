import { ChevronRight, Download } from "lucide-react"

import { cardClass, PageHeading } from "@/components/portail/cotisations/cotisations-ui"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { telechargerCsv } from "@/lib/cotisations"
import { bilanEvenement, somme } from "@/lib/finances"
import { fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import { dateCourte, tdClass, thClass, type BudgetContext } from "./budget-shared"

export function calculerBilans(ctx: BudgetContext) {
  const { evenements, depenses, recettes } = ctx
  const lignes = [...evenements]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((e) => ({ evenement: e, ...bilanEvenement(e, depenses, recettes) }))

  const generalesDep = depenses.filter((d) => !d.eventId)
  const generales = {
    autresRecettes: somme(recettes.filter((r) => !r.eventId)),
    validees: somme(generalesDep.filter((d) => d.statut === "validee")),
    enAttente: somme(generalesDep.filter((d) => d.statut === "en_attente")),
  }
  return { lignes, generales }
}

function Solde({ value }: { value: number }) {
  return (
    <span className={cn("font-semibold whitespace-nowrap", value < 0 ? "text-rust" : "text-[var(--ink)]")}>
      {value > 0 ? "+" : ""}
      {fmt(value)}
    </span>
  )
}

export function BudgetEvenements({ ctx, tabs }: { ctx: BudgetContext; tabs: React.ReactNode }) {
  const { lignes, generales } = calculerBilans(ctx)

  const total = lignes.reduce(
    (t, l) => ({
      budget: t.budget + l.budget,
      cotisations: t.cotisations + l.cotisations,
      autres: t.autres + l.autresRecettes,
      validees: t.validees + l.validees,
      enAttente: t.enAttente + l.enAttente,
    }),
    { budget: 0, cotisations: 0, autres: generales.autresRecettes, validees: generales.validees, enAttente: generales.enAttente }
  )
  const soldeTotal = total.cotisations + total.autres - total.validees

  function exporter() {
    telechargerCsv("solde-par-evenement.csv", [
      ["Événement", "Date", "Budget prévisionnel", "Cotisations", "Autres recettes", "Dépenses validées", "Dépenses en attente", "Solde"],
      ...lignes.map((l) => [
        l.evenement.titre,
        l.evenement.date,
        l.budget,
        l.cotisations,
        l.autresRecettes,
        l.validees,
        l.enAttente,
        l.solde,
      ]),
      ["Frais et recettes généraux", "", "", "", generales.autresRecettes, generales.validees, generales.enAttente, generales.autresRecettes - generales.validees],
    ])
  }

  return (
    <div className="space-y-5">
      {tabs}

      <PageHeading
        eyebrow="Budget · Par événement"
        title="Solde par événement"
        subtitle="Recettes (cotisations + dons, billetterie…) moins dépenses validées, comparées au budget prévisionnel"
        actions={
          <Button variant="outline" onClick={exporter}>
            <Download /> Exporter
          </Button>
        }
      />

      <Card className={cn(cardClass, "gap-0 py-0")}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th className={thClass}>Événement</th>
                <th className={cn(thClass, "text-right")}>Cotisations</th>
                <th className={cn(thClass, "text-right")}>Autres recettes</th>
                <th className={cn(thClass, "text-right")}>Dépenses validées</th>
                <th className={cn(thClass, "text-right")}>En attente</th>
                <th className={cn(thClass, "text-right")}>Solde</th>
                <th className={thClass}>Consommation du budget</th>
                <th className={thClass} />
              </tr>
            </thead>
            <tbody>
              {lignes.map((l) => {
                const pct = l.budget ? (l.engage / l.budget) * 100 : 0
                return (
                  <tr
                    key={l.evenement.id}
                    onClick={() => ctx.onAller(`/evenements/${l.evenement.id}`)}
                    className="cursor-pointer border-b border-[var(--line)] transition-colors hover:bg-[var(--muted)]/60"
                  >
                    <td className={tdClass}>
                      <div className="font-medium text-[var(--ink)]">{l.evenement.titre}</div>
                      <div className="text-[11.5px] text-[var(--ink-light)]">
                        {dateCourte(l.evenement.date)} · <span className="capitalize">{l.evenement.type}</span>
                      </div>
                    </td>
                    <td className={cn(tdClass, "text-right whitespace-nowrap text-teal")}>{fmt(l.cotisations)}</td>
                    <td className={cn(tdClass, "text-right whitespace-nowrap text-teal")}>{l.autresRecettes ? fmt(l.autresRecettes) : "—"}</td>
                    <td className={cn(tdClass, "text-right whitespace-nowrap text-rust")}>{l.validees ? fmt(l.validees) : "—"}</td>
                    <td className={cn(tdClass, "text-right whitespace-nowrap text-amber")}>{l.enAttente ? fmt(l.enAttente) : "—"}</td>
                    <td className={cn(tdClass, "text-right")}>
                      <Solde value={l.solde} />
                    </td>
                    <td className={cn(tdClass, "min-w-56")}>
                      {l.budget ? (
                        <div>
                          <div className="mb-1 flex justify-between text-[11.5px]">
                            <span className={pct > 100 ? "font-semibold text-rust" : "text-[var(--ink-soft)]"}>
                              {Math.round(pct)} % engagé
                            </span>
                            <span className="text-[var(--ink-light)]">{fmt(l.budget)}</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                            <div
                              className={cn("h-full rounded-full", pct > 100 ? "bg-rust" : pct > 80 ? "bg-amber" : "bg-teal")}
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[12px] text-[var(--ink-light)]">Pas de budget prévisionnel</span>
                      )}
                    </td>
                    <td className={cn(tdClass, "w-10 text-right")}>
                      <ChevronRight className="size-4 text-[var(--ink-light)]" />
                    </td>
                  </tr>
                )
              })}
              <tr className="border-b border-[var(--line)]">
                <td className={tdClass}>
                  <div className="font-medium text-[var(--ink)]">Frais et recettes généraux</div>
                  <div className="text-[11.5px] text-[var(--ink-light)]">non rattachés à un événement</div>
                </td>
                <td className={cn(tdClass, "text-right")}>—</td>
                <td className={cn(tdClass, "text-right whitespace-nowrap text-teal")}>{fmt(generales.autresRecettes)}</td>
                <td className={cn(tdClass, "text-right whitespace-nowrap text-rust")}>{fmt(generales.validees)}</td>
                <td className={cn(tdClass, "text-right whitespace-nowrap text-amber")}>{generales.enAttente ? fmt(generales.enAttente) : "—"}</td>
                <td className={cn(tdClass, "text-right")}>
                  <Solde value={generales.autresRecettes - generales.validees} />
                </td>
                <td className={tdClass} colSpan={2} />
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[var(--muted)]/50 text-[12.5px] font-semibold text-[var(--ink)]">
                <td className="px-4 py-3">Total hors cotisations statutaires</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{fmt(total.cotisations)}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{fmt(total.autres)}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{fmt(total.validees)}</td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{fmt(total.enAttente)}</td>
                <td className="px-4 py-3 text-right">
                  <Solde value={soldeTotal} />
                </td>
                <td className="px-4 py-3 text-[11.5px] font-normal text-[var(--ink-light)]" colSpan={2}>
                  Budgets prévisionnels cumulés : {fmt(total.budget)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
