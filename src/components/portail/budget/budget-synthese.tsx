import { ArrowRight, FileWarning, ListChecks, Plus, Scale } from "lucide-react"

import { cardClass, KpiCard, PageHeading } from "@/components/portail/cotisations/cotisations-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SOURCE_LABEL, type SourceRecette, type vueConsolidee } from "@/lib/finances"
import { fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import { calculerBilans } from "./budget-evenements"
import { BarRow, type BudgetContext } from "./budget-shared"

const SOURCE_BAR: Record<SourceRecette, string> = {
  statutaire: "bg-teal",
  evenementielle: "bg-gold",
  don: "bg-sky-500",
  billetterie: "bg-violet-500",
  subvention: "bg-indigo-500",
  autre: "bg-slate-400",
}

export function BudgetSynthese({
  ctx,
  tabs,
  consolidee,
  onOuvrirDepenses,
  onOuvrirVue,
}: {
  ctx: BudgetContext
  tabs: React.ReactNode
  consolidee: ReturnType<typeof vueConsolidee>
  onOuvrirDepenses: (filtre: "en_attente" | "sans-justificatif" | "non-rapprochees") => void
  onOuvrirVue: (vue: "evenements" | "recettes") => void
}) {
  const c = consolidee
  const maxCategorie = Math.max(1, ...c.parCategorie.map(([, v]) => v))
  const { lignes } = calculerBilans(ctx)

  const controles = [
    {
      key: "en_attente" as const,
      icon: ListChecks,
      label: "Dépenses à valider",
      detail: c.enAttente.nombre ? `${fmt(c.enAttente.montant)} en attente` : "Rien en attente",
      count: c.controles.aValider,
    },
    {
      key: "sans-justificatif" as const,
      icon: FileWarning,
      label: "Justificatifs manquants",
      detail: "facture, reçu ou devis à joindre",
      count: c.controles.sansJustificatif,
    },
    {
      key: "non-rapprochees" as const,
      icon: Scale,
      label: "Décaissements à rapprocher",
      detail: c.controles.nonRapprochees ? `${fmt(c.controles.montantNonRapproche)} à pointer` : "Tout est pointé",
      count: c.controles.nonRapprochees,
    },
  ]

  return (
    <div className="space-y-5">
      {tabs}

      <PageHeading
        eyebrow={`Budget · Exercice ${c.annee}`}
        title="Vue financière consolidée"
        subtitle="Toutes les recettes et dépenses validées de la chorale"
        actions={
          ctx.peutSaisir && (
            <>
              <Button variant="outline" onClick={() => ctx.onNouvelleRecette()}>
                <Plus /> Nouvelle recette
              </Button>
              <Button onClick={() => ctx.onNouvelleDepense()}>
                <Plus /> Nouvelle dépense
              </Button>
            </>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={`Recettes ${c.annee}`} value={fmt(c.totalRecettes)} hint="cotisations, dons, billetterie, subventions…" />
        <KpiCard label="Dépenses validées" value={fmt(c.totalDepenses)} hint={`${c.parCategorie.length} catégorie${c.parCategorie.length > 1 ? "s" : ""} de dépenses`} />
        <KpiCard
          label="Solde de trésorerie"
          value={`${c.solde > 0 ? "+" : ""}${fmt(c.solde)}`}
          tone={c.solde < 0 ? "danger" : "default"}
          progress={c.totalRecettes ? (c.totalDepenses / c.totalRecettes) * 100 : 0}
          hint={`${c.totalRecettes ? Math.round((c.totalDepenses / c.totalRecettes) * 100) : 0} % des recettes dépensées`}
        />
        <KpiCard
          label="Engagements en attente"
          value={fmt(c.enAttente.montant)}
          tone={c.enAttente.nombre ? "danger" : "default"}
          hint={`solde après validation : ${fmt(c.solde - c.enAttente.montant)}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Recettes par source</CardTitle>
            <CardDescription>Exercice {c.annee}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(Object.keys(SOURCE_LABEL) as SourceRecette[]).map((s) => (
              <BarRow
                key={s}
                label={SOURCE_LABEL[s]}
                montant={fmt(c.parSource[s])}
                part={c.totalRecettes ? (c.parSource[s] / c.totalRecettes) * 100 : 0}
                barClassName={SOURCE_BAR[s]}
              />
            ))}
            <Button variant="ghost" size="sm" className="-ml-2" onClick={() => onOuvrirVue("recettes")}>
              Détail des recettes <ArrowRight />
            </Button>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Dépenses par catégorie</CardTitle>
            <CardDescription>Dépenses validées uniquement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {c.parCategorie.length === 0 && (
              <p className="rounded-xl bg-[var(--muted)] px-3.5 py-3 text-[12.5px] text-[var(--ink-soft)]">
                Aucune dépense validée.
              </p>
            )}
            {c.parCategorie.map(([cat, montant]) => (
              <BarRow key={cat} label={cat} montant={fmt(montant)} part={(montant / maxCategorie) * 100} barClassName="bg-rust" />
            ))}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Contrôles</CardTitle>
            <CardDescription>Validation, justificatifs et rapprochement</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {controles.map(({ key, icon: Icon, label, detail, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => onOuvrirDepenses(key)}
                className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white px-3.5 py-3 text-left transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold-soft)]/25"
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    count ? "bg-amber-soft text-amber" : "bg-teal-soft text-teal"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-[var(--ink)]">{label}</span>
                  <span className="block truncate text-[11.5px] text-[var(--ink-light)]">{detail}</span>
                </span>
                <span
                  className={cn(
                    "rounded-lg px-2 py-0.5 text-[12px] font-semibold",
                    count ? "bg-amber-soft text-amber" : "bg-teal-soft text-teal"
                  )}
                >
                  {count}
                </span>
              </button>
            ))}

            <div className="mt-2 space-y-4 border-t border-[var(--line)] pt-4">
              <BarRow
                label="Cotisations statutaires"
                montant={`${c.statutaire.taux} %`}
                part={c.statutaire.taux}
                suffix={<span className="ml-1 font-normal text-[var(--ink-light)]">recouvré</span>}
              />
              <BarRow
                label="Cotisations événementielles"
                montant={`${c.evenementielle.taux} %`}
                part={c.evenementielle.taux}
                barClassName="bg-gold"
                suffix={<span className="ml-1 font-normal text-[var(--ink-light)]">recouvré</span>}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={cardClass}>
        <CardHeader className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>Solde par événement</CardTitle>
            <CardDescription>Recettes rattachées moins dépenses validées</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOuvrirVue("evenements")}>
            Tableau détaillé <ArrowRight />
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {lignes.map((l) => (
            <button
              key={l.evenement.id}
              type="button"
              onClick={() => ctx.onAller(`/evenements/${l.evenement.id}`)}
              className="rounded-xl border border-[var(--line)] bg-white p-4 text-left transition-colors hover:border-[var(--gold)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-semibold text-[var(--ink)]">{l.evenement.titre}</div>
                  <div className="text-[11.5px] text-[var(--ink-light)] capitalize">{l.evenement.type}</div>
                </div>
                <span className={cn("text-[15px] font-semibold whitespace-nowrap", l.solde < 0 ? "text-rust" : "text-teal")}>
                  {l.solde > 0 ? "+" : ""}
                  {fmt(l.solde)}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px] text-[var(--ink-soft)]">
                <span>Recettes : <b className="font-semibold text-[var(--ink)]">{fmt(l.recettesTotal)}</b></span>
                <span className="text-right">Dépenses : <b className="font-semibold text-[var(--ink)]">{fmt(l.validees)}</b></span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
