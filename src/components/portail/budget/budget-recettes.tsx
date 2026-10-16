import { useMemo, useState } from "react"
import { ArrowRight, Download, Plus } from "lucide-react"

import { cardClass, KpiCard, PageHeading } from "@/components/portail/cotisations/cotisations-ui"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MODE_REGLEMENT_LABEL, TYPE_RECETTE_LABEL } from "@/data/portail-mock"
import { telechargerCsv } from "@/lib/cotisations"
import { somme, type vueConsolidee } from "@/lib/finances"
import { fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Paiement, TypeRecette } from "@/types/portail"
import {
  BarRow,
  Chips,
  dateCourte,
  EmptyRow,
  SearchInput,
  tdClass,
  thClass,
  titreEvenement,
  type BudgetContext,
} from "./budget-shared"

type Filtre = "toutes" | TypeRecette

const TYPE_VARIANT: Record<TypeRecette, "success" | "outline" | "secondary" | "default"> = {
  don: "success",
  billetterie: "outline",
  subvention: "secondary",
  autre: "default",
}

export function BudgetRecettes({
  ctx,
  tabs,
  consolidee,
  paiements,
}: {
  ctx: BudgetContext
  tabs: React.ReactNode
  consolidee: ReturnType<typeof vueConsolidee>
  paiements: Paiement[]
}) {
  const { recettes, evenements, peutSaisir } = ctx
  const [recherche, setRecherche] = useState("")
  const [filtre, setFiltre] = useState<Filtre>("toutes")

  const triees = useMemo(() => [...recettes].sort((a, b) => b.date.localeCompare(a.date)), [recettes])
  const visibles = triees.filter((r) => {
    const q = recherche.trim().toLowerCase()
    if (q && ![r.libelle, r.source].some((x) => x.toLowerCase().includes(q))) return false
    return filtre === "toutes" || r.type === filtre
  })

  const parType = (t: TypeRecette) => recettes.filter((r) => r.type === t)
  const { parSource, statutaire, evenementielle } = consolidee
  const totalCotisations = parSource.statutaire + parSource.evenementielle

  function exporter() {
    telechargerCsv("recettes.csv", [
      ["Date", "Type", "Libellé", "Provenance", "Événement", "Mode", "Montant (F)", "Saisie par"],
      ...triees.map((r) => [
        r.date,
        TYPE_RECETTE_LABEL[r.type],
        r.libelle,
        r.source,
        r.eventId ? titreEvenement(evenements, r.eventId) : "",
        MODE_REGLEMENT_LABEL[r.mode],
        r.montant,
        r.saisiPar,
      ]),
    ])
  }

  return (
    <div className="space-y-5">
      {tabs}

      <PageHeading
        eyebrow={`Budget · Exercice ${consolidee.annee}`}
        title="Recettes"
        subtitle="Cotisations, dons, billetterie, subventions et autres entrées d'argent"
        actions={
          <>
            <Button variant="outline" onClick={exporter}>
              <Download /> Exporter
            </Button>
            {peutSaisir && (
              <Button onClick={() => ctx.onNouvelleRecette()}>
                <Plus /> Nouvelle recette
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cotisations" value={fmt(totalCotisations)} hint="statutaires et événementielles" />
        <KpiCard label="Dons" value={fmt(somme(parType("don")))} hint={`${parType("don").length} don${parType("don").length > 1 ? "s" : ""} reçu${parType("don").length > 1 ? "s" : ""}`} />
        <KpiCard label="Billetterie" value={fmt(somme(parType("billetterie")))} hint="ventes de billets" />
        <KpiCard
          label="Subventions & autres"
          value={fmt(somme(parType("subvention")) + somme(parType("autre")))}
          hint="subventions, ventes diverses"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Recettes de cotisations</CardTitle>
            <CardDescription>Suivi du recouvrement sur l'exercice {consolidee.annee}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <BarRow
              label="Statutaires"
              montant={fmt(statutaire.collecte)}
              part={statutaire.taux}
              suffix={<span className="ml-1 font-normal text-[var(--ink-light)]">/ {fmt(statutaire.attendu)}</span>}
            />
            <BarRow
              label="Événementielles"
              montant={fmt(evenementielle.collecte)}
              part={evenementielle.taux}
              barClassName="bg-gold"
              suffix={<span className="ml-1 font-normal text-[var(--ink-light)]">/ {fmt(evenementielle.attendu)}</span>}
            />
            <div className="space-y-1 border-t border-[var(--line)] pt-3">
              <div className="mb-1 text-[11px] font-medium tracking-[0.12em] text-[var(--ink-light)] uppercase">
                Derniers reçus
              </div>
              {paiements.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => ctx.onAller(`/paiements/${p.id}`)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left hover:bg-[var(--muted)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] text-[var(--ink)]">{p.choriste}</span>
                    <span className="block truncate text-[11px] text-[var(--ink-light)]">{p.type}</span>
                  </span>
                  <span className="shrink-0 text-[12.5px] font-semibold text-teal">{fmt(p.montant)}</span>
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full" onClick={() => ctx.onAller("/cotisations")}>
              Voir le suivi des cotisations <ArrowRight />
            </Button>
          </CardContent>
        </Card>

        <Card className={cn(cardClass, "min-w-0 gap-0 py-0 xl:col-span-2")}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <div>
              <CardTitle>Journal des recettes</CardTitle>
              <CardDescription>Dons, billetterie, subventions et autres (les cotisations ont leur propre suivi)</CardDescription>
            </div>
            <SearchInput value={recherche} onChange={setRecherche} placeholder="Rechercher une recette..." />
          </div>
          <div className="px-4 pb-3 sm:px-5">
            <Chips
              value={filtre}
              onChange={setFiltre}
              items={[
                { key: "toutes", label: "Toutes", count: recettes.length },
                ...(Object.keys(TYPE_RECETTE_LABEL) as TypeRecette[]).map((t) => ({
                  key: t,
                  label: TYPE_RECETTE_LABEL[t],
                  count: parType(t).length,
                })),
              ]}
            />
          </div>
          <div className="overflow-x-auto border-t border-[var(--line)]">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className={thClass}>Date</th>
                  <th className={thClass}>Recette</th>
                  <th className={thClass}>Type</th>
                  <th className={thClass}>Événement</th>
                  <th className={cn(thClass, "text-right")}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {visibles.length === 0 && <EmptyRow colSpan={5}>Aucune recette ne correspond aux filtres.</EmptyRow>}
                {visibles.map((r) => (
                  <tr key={r.id} className="border-b border-[var(--line)] transition-colors hover:bg-[var(--muted)]/60">
                    <td className={cn(tdClass, "whitespace-nowrap")}>{dateCourte(r.date)}</td>
                    <td className={tdClass}>
                      <div className="font-medium text-[var(--ink)]">{r.libelle}</div>
                      <div className="text-[11.5px] text-[var(--ink-light)]">
                        {r.source} · {MODE_REGLEMENT_LABEL[r.mode]} · saisie par {r.saisiPar}
                      </div>
                    </td>
                    <td className={tdClass}>
                      <Badge variant={TYPE_VARIANT[r.type]}>{TYPE_RECETTE_LABEL[r.type]}</Badge>
                    </td>
                    <td className={tdClass}>
                      {r.eventId ? (
                        <button
                          type="button"
                          onClick={() => ctx.onAller(`/evenements/${r.eventId}`)}
                          className="text-left text-[12.5px] text-[var(--ink)] underline-offset-2 hover:underline"
                        >
                          {titreEvenement(evenements, r.eventId)}
                        </button>
                      ) : (
                        <span className="text-[12.5px] text-[var(--ink-light)]">Générale</span>
                      )}
                    </td>
                    <td className={cn(tdClass, "text-right font-semibold whitespace-nowrap text-teal")}>
                      +{fmt(r.montant)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {visibles.length > 0 && (
                <tfoot>
                  <tr className="bg-[var(--muted)]/50">
                    <td colSpan={4} className="px-4 py-3 text-[12px] font-semibold text-[var(--ink)]">
                      Total affiché
                    </td>
                    <td className="px-4 py-3 text-right text-[12.5px] font-semibold whitespace-nowrap text-[var(--ink)]">
                      {fmt(somme(visibles))}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
