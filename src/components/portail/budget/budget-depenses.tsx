import { useId, useMemo, useState } from "react"
import { toast } from "sonner"
import { Ban, Check, CheckCircle2, Circle, Download, FileText, Paperclip, Plus, TriangleAlert } from "lucide-react"

import { cardClass, KpiCard, PageHeading } from "@/components/portail/cotisations/cotisations-ui"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MODE_REGLEMENT_LABEL } from "@/data/portail-mock"
import { telechargerCsv } from "@/lib/cotisations"
import { somme } from "@/lib/finances"
import { fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Depense, StatutDepense } from "@/types/portail"
import {
  Chips,
  dateCourte,
  EmptyRow,
  SearchInput,
  STATUT_DEPENSE,
  tdClass,
  thClass,
  titreEvenement,
  type BudgetContext,
} from "./budget-shared"

export type FiltreStatut = "toutes" | StatutDepense
export type FiltreControle = "aucun" | "sans-justificatif" | "non-rapprochees"

const TOUS_EVENEMENTS = "__tous__"
const FRAIS_GENERAUX = "__general__"

function ouvrirJustificatif(d: Depense) {
  if (d.justificatif?.url) window.open(d.justificatif.url, "_blank", "noopener")
  else toast("Aperçu indisponible pour les pièces de démonstration")
}

function JoindreButton({ onFichier }: { onFichier: (f: File) => void }) {
  const id = useId()
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-[color-mix(in_srgb,var(--amber)_55%,transparent)] px-2 py-1 text-[11.5px] font-medium text-amber hover:bg-amber-soft"
    >
      <Paperclip className="size-3.5" /> Joindre
      <input
        id={id}
        type="file"
        accept="application/pdf,image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFichier(f)
        }}
      />
    </label>
  )
}

export function BudgetDepenses({
  ctx,
  tabs,
  filtreInitial,
}: {
  ctx: BudgetContext
  tabs: React.ReactNode
  filtreInitial?: { statut?: FiltreStatut; controle?: FiltreControle }
}) {
  const { depenses, evenements, peutSaisir, peutValider, utilisateur } = ctx
  const [recherche, setRecherche] = useState("")
  const [statut, setStatut] = useState<FiltreStatut>(filtreInitial?.statut ?? "toutes")
  const [controle, setControle] = useState<FiltreControle>(filtreInitial?.controle ?? "aucun")
  const [evenement, setEvenement] = useState(TOUS_EVENEMENTS)

  const triees = useMemo(() => [...depenses].sort((a, b) => b.date.localeCompare(a.date)), [depenses])

  const visibles = triees.filter((d) => {
    const q = recherche.trim().toLowerCase()
    if (q && ![d.libelle, d.beneficiaire, d.categorie].some((x) => x.toLowerCase().includes(q))) return false
    if (statut !== "toutes" && d.statut !== statut) return false
    if (controle === "sans-justificatif" && (d.justificatif || d.statut === "rejetee")) return false
    if (controle === "non-rapprochees" && (d.statut !== "validee" || d.rapproche)) return false
    if (evenement === FRAIS_GENERAUX && d.eventId) return false
    if (evenement !== TOUS_EVENEMENTS && evenement !== FRAIS_GENERAUX && d.eventId !== evenement) return false
    return true
  })

  const count = (s: StatutDepense) => depenses.filter((d) => d.statut === s).length
  const validees = depenses.filter((d) => d.statut === "validee")
  const enAttente = depenses.filter((d) => d.statut === "en_attente")
  const sansJustif = depenses.filter((d) => d.statut !== "rejetee" && !d.justificatif)
  const nonRapprochees = validees.filter((d) => !d.rapproche)

  const evenementsItems = {
    [TOUS_EVENEMENTS]: "Tous les événements",
    [FRAIS_GENERAUX]: "Frais généraux",
    ...Object.fromEntries(evenements.map((e) => [e.id, e.titre])),
  }

  function exporter() {
    telechargerCsv("depenses.csv", [
      ["Date", "Libellé", "Catégorie", "Événement", "Bénéficiaire", "Mode", "Montant (F)", "Statut", "Motif de rejet", "Justificatif", "Rapprochée", "Saisie par", "Traitée par"],
      ...triees.map((d) => [
        d.date,
        d.libelle,
        d.categorie,
        titreEvenement(evenements, d.eventId),
        d.beneficiaire,
        MODE_REGLEMENT_LABEL[d.mode],
        d.montant,
        STATUT_DEPENSE[d.statut].label,
        d.motifRejet ?? "",
        d.justificatif?.nom ?? "",
        d.rapproche ? "Oui" : "Non",
        d.saisiPar,
        d.traitePar ?? "",
      ]),
    ])
  }

  return (
    <div className="space-y-5">
      {tabs}

      <PageHeading
        eyebrow="Budget · Journal des dépenses"
        title="Dépenses"
        subtitle="Saisie, validation, justificatifs et rapprochement des décaissements"
        actions={
          <>
            <Button variant="outline" onClick={exporter}>
              <Download /> Exporter
            </Button>
            {peutSaisir && (
              <Button onClick={() => ctx.onNouvelleDepense()}>
                <Plus /> Nouvelle dépense
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Dépenses validées" value={fmt(somme(validees))} hint={`${validees.length} décaissement${validees.length > 1 ? "s" : ""}`} />
        <KpiCard
          label="En attente de validation"
          value={fmt(somme(enAttente))}
          tone={enAttente.length ? "danger" : "default"}
          hint={`${enAttente.length} dépense${enAttente.length > 1 ? "s" : ""} à valider`}
        />
        <KpiCard
          label="Sans justificatif"
          value={String(sansJustif.length)}
          tone={sansJustif.length ? "danger" : "default"}
          hint="facture, reçu ou devis manquant"
        />
        <KpiCard
          label="Rapprochement"
          value={`${validees.length - nonRapprochees.length}`}
          suffix={`/${validees.length}`}
          progress={validees.length ? ((validees.length - nonRapprochees.length) / validees.length) * 100 : 100}
          hint={nonRapprochees.length ? `${fmt(somme(nonRapprochees))} à pointer sur le relevé` : "tous les décaissements sont pointés"}
        />
      </div>

      <Card className={cn(cardClass, "gap-0 py-0")}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput value={recherche} onChange={setRecherche} placeholder="Rechercher une dépense..." />
            <Chips
              value={statut}
              onChange={setStatut}
              items={[
                { key: "toutes", label: "Toutes", count: depenses.length },
                { key: "en_attente", label: "À valider", count: count("en_attente") },
                { key: "validee", label: "Validées", count: count("validee") },
                { key: "rejetee", label: "Rejetées", count: count("rejetee") },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chips
              value={controle}
              onChange={setControle}
              items={[
                { key: "aucun", label: "Tout" },
                { key: "sans-justificatif", label: "Sans justificatif", count: sansJustif.length },
                { key: "non-rapprochees", label: "Non rapprochées", count: nonRapprochees.length },
              ]}
            />
            <Select value={evenement} onValueChange={(v) => setEvenement(v as string)} items={evenementsItems}>
              <SelectTrigger size="sm" className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(evenementsItems).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border-t border-[var(--line)]">
          <table className="w-full min-w-[1080px] text-sm">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th className={thClass}>Date</th>
                <th className={thClass}>Dépense</th>
                <th className={thClass}>Événement</th>
                <th className={cn(thClass, "text-right")}>Montant</th>
                <th className={thClass}>Justificatif</th>
                <th className={thClass}>Statut</th>
                <th className={thClass}>Rapprochée</th>
                <th className={cn(thClass, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && <EmptyRow colSpan={8}>Aucune dépense ne correspond aux filtres.</EmptyRow>}
              {visibles.map((d) => {
                const st = STATUT_DEPENSE[d.statut]
                const saPropreSaisie = d.saisiPar === utilisateur
                return (
                  <tr key={d.id} className="border-b border-[var(--line)] transition-colors hover:bg-[var(--muted)]/60">
                    <td className={cn(tdClass, "whitespace-nowrap")}>{dateCourte(d.date)}</td>
                    <td className={tdClass}>
                      <div className="font-medium text-[var(--ink)]">{d.libelle}</div>
                      <div className="text-[11.5px] text-[var(--ink-light)]">
                        {d.categorie} · {d.beneficiaire} · {MODE_REGLEMENT_LABEL[d.mode]}
                      </div>
                    </td>
                    <td className={tdClass}>
                      {d.eventId ? (
                        <button
                          type="button"
                          onClick={() => ctx.onAller(`/evenements/${d.eventId}`)}
                          className="text-left text-[12.5px] text-[var(--ink)] underline-offset-2 hover:underline"
                        >
                          {titreEvenement(evenements, d.eventId)}
                        </button>
                      ) : (
                        <span className="text-[12.5px] text-[var(--ink-light)]">Frais généraux</span>
                      )}
                    </td>
                    <td className={cn(tdClass, "text-right font-semibold whitespace-nowrap text-[var(--ink)]", d.statut === "rejetee" && "text-[var(--ink-light)] line-through")}>
                      {fmt(d.montant)}
                    </td>
                    <td className={tdClass}>
                      {d.justificatif ? (
                        <button
                          type="button"
                          onClick={() => ouvrirJustificatif(d)}
                          title={d.justificatif.nom}
                          className="inline-flex max-w-40 items-center gap-1.5 text-[12px] text-[var(--ink)] hover:underline"
                        >
                          <FileText className="size-3.5 shrink-0 text-[var(--ink-light)]" />
                          <span className="truncate">{d.justificatif.nom}</span>
                        </button>
                      ) : d.statut === "rejetee" ? (
                        <span className="text-[12px] text-[var(--ink-light)]">—</span>
                      ) : peutSaisir ? (
                        <JoindreButton
                          onFichier={(f) =>
                            ctx.onJoindreJustificatif(d.id, {
                              nom: f.name,
                              type: f.type,
                              taille: f.size,
                              url: URL.createObjectURL(f),
                            })
                          }
                        />
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[12px] text-amber">
                          <TriangleAlert className="size-3.5" /> Manquant
                        </span>
                      )}
                    </td>
                    <td className={tdClass}>
                      <Badge variant={st.variant}>{st.label}</Badge>
                      {d.statut === "rejetee" && d.motifRejet && (
                        <div className="mt-1 max-w-52 text-[11px] leading-snug text-[var(--ink-light)]">{d.motifRejet}</div>
                      )}
                      {d.traitePar && d.statut !== "en_attente" && (
                        <div className="mt-0.5 text-[10.5px] text-[var(--ink-light)]">par {d.traitePar}</div>
                      )}
                    </td>
                    <td className={tdClass}>
                      {d.statut === "validee" ? (
                        <button
                          type="button"
                          disabled={!peutSaisir}
                          onClick={() => ctx.onToggleRapproche(d.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12px] font-medium whitespace-nowrap transition-colors disabled:cursor-default",
                            d.rapproche ? "text-teal" : "text-[var(--ink-light)]",
                            peutSaisir && "hover:bg-[var(--muted)]"
                          )}
                          title={d.rapproche ? "Pointée sur le relevé" : "Marquer comme pointée sur le relevé"}
                        >
                          {d.rapproche ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                          {d.rapproche ? "Oui" : "À pointer"}
                        </button>
                      ) : (
                        <span className="text-[12px] text-[var(--ink-light)]">—</span>
                      )}
                    </td>
                    <td className={cn(tdClass, "text-right")}>
                      {d.statut === "en_attente" && peutValider ? (
                        <div
                          className="inline-flex gap-1.5"
                          title={saPropreSaisie ? "Vous avez saisi cette dépense : un autre membre du bureau doit la valider." : undefined}
                        >
                          <Button size="xs" disabled={saPropreSaisie} onClick={() => ctx.onValiderDepense(d.id)}>
                            <Check /> Valider
                          </Button>
                          <Button size="xs" variant="destructive" disabled={saPropreSaisie} onClick={() => ctx.onRejeterDepense(d)}>
                            <Ban /> Rejeter
                          </Button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {visibles.length > 0 && (
              <tfoot>
                <tr className="bg-[var(--muted)]/50">
                  <td colSpan={3} className="px-4 py-3 text-[12px] font-semibold text-[var(--ink)]">
                    {visibles.length} dépense{visibles.length > 1 ? "s" : ""} affichée{visibles.length > 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 text-right text-[12.5px] font-semibold whitespace-nowrap text-[var(--ink)]">
                    {fmt(somme(visibles.filter((d) => d.statut !== "rejetee")))}
                  </td>
                  <td colSpan={4} className="px-4 py-3 text-[11.5px] text-[var(--ink-light)]">hors dépenses rejetées</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      <p className="text-[12px] text-[var(--ink-light)]">
        Contrôle interne : une dépense ne peut pas être validée par la personne qui l'a saisie. Pointez
        chaque décaissement validé sur le relevé de caisse, de banque ou de mobile money.
      </p>
    </div>
  )
}
