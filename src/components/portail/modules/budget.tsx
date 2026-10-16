import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { ArrowDownToLine, ArrowUpFromLine, CalendarRange, LayoutDashboard } from "lucide-react"

import { BudgetDepenses, type FiltreControle, type FiltreStatut } from "@/components/portail/budget/budget-depenses"
import { BudgetEvenements } from "@/components/portail/budget/budget-evenements"
import { BudgetRecettes } from "@/components/portail/budget/budget-recettes"
import type { BudgetContext } from "@/components/portail/budget/budget-shared"
import { BudgetSynthese } from "@/components/portail/budget/budget-synthese"
import { vueConsolidee } from "@/lib/finances"
import { cn } from "@/lib/utils"
import type { Paiement, Statutaire } from "@/types/portail"

type Vue = "synthese" | "depenses" | "recettes" | "evenements"

const VUES: { key: Vue; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "synthese", label: "Vue consolidée", icon: LayoutDashboard },
  { key: "depenses", label: "Dépenses", icon: ArrowUpFromLine },
  { key: "recettes", label: "Recettes", icon: ArrowDownToLine },
  { key: "evenements", label: "Par événement", icon: CalendarRange },
]

export function BudgetModule({
  ctx,
  statutaire,
  choristes,
  paiements,
}: {
  ctx: BudgetContext
  statutaire: Statutaire
  choristes: string[]
  paiements: Paiement[]
}) {
  const [params, setParams] = useSearchParams()
  const vue = (VUES.find((v) => v.key === params.get("vue"))?.key ?? "synthese") as Vue
  const filtre = params.get("filtre")

  const consolidee = useMemo(
    () => vueConsolidee(statutaire, ctx.evenements, ctx.depenses, ctx.recettes, choristes),
    [statutaire, ctx.evenements, ctx.depenses, ctx.recettes, choristes]
  )

  const aller = (v: Vue, f?: string) =>
    setParams(v === "synthese" ? {} : f ? { vue: v, filtre: f } : { vue: v }, { replace: true })

  const tabs = (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[var(--line)] bg-white p-1">
      {VUES.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => aller(key)}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]",
            vue === key && "bg-[var(--navy)] text-white hover:text-white"
          )}
        >
          <Icon className="size-4" /> {label}
          {key === "depenses" && consolidee.controles.aValider > 0 && (
            <span
              className={cn(
                "rounded-md px-1.5 text-[10.5px] font-semibold",
                vue === key ? "bg-white/20 text-white" : "bg-amber-soft text-amber"
              )}
            >
              {consolidee.controles.aValider}
            </span>
          )}
        </button>
      ))}
    </div>
  )

  switch (vue) {
    case "depenses": {
      const filtreInitial =
        filtre === "en_attente" || filtre === "validee" || filtre === "rejetee"
          ? { statut: filtre as FiltreStatut }
          : filtre === "sans-justificatif" || filtre === "non-rapprochees"
            ? { controle: filtre as FiltreControle }
            : undefined
      // key : réinitialise les filtres quand on arrive depuis un raccourci de la vue consolidée
      return <BudgetDepenses key={filtre ?? "tout"} ctx={ctx} tabs={tabs} filtreInitial={filtreInitial} />
    }
    case "recettes":
      return <BudgetRecettes ctx={ctx} tabs={tabs} consolidee={consolidee} paiements={paiements} />
    case "evenements":
      return <BudgetEvenements ctx={ctx} tabs={tabs} />
    default:
      return (
        <BudgetSynthese
          ctx={ctx}
          tabs={tabs}
          consolidee={consolidee}
          onOuvrirDepenses={(f) => aller("depenses", f)}
          onOuvrirVue={(v) => aller(v)}
        />
      )
  }
}
