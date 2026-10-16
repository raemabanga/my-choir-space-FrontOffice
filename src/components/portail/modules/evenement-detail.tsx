import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Coins,
  Plus,
  ReceiptText,
  Trash2,
  Users,
  Wallet,
} from "lucide-react"

import { ProgressBar } from "@/components/portail/common"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { STATUT_DEPENSE, type BudgetContext } from "@/components/portail/budget/budget-shared"
import { TYPE_RECETTE_LABEL } from "@/data/portail-mock"
import { bilanEvenement } from "@/lib/finances"
import { dateLongue, fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Evenement, Paiement } from "@/types/portail"

type Statut = "a-jour" | "partiel" | "non-paye"
type Filtre = "tous" | Statut

const STATUT_LABEL: Record<Statut, string> = {
  "a-jour": "À jour",
  partiel: "Partiel",
  "non-paye": "Non payé",
}

const STATUT_VARIANT: Record<Statut, "success" | "warning" | "destructive"> = {
  "a-jour": "success",
  partiel: "warning",
  "non-paye": "destructive",
}

const cardClass = "border border-[var(--line)] bg-white/75 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"

function joursAvant(date: string) {
  const cible = new Date(date + "T00:00:00").getTime()
  const aujourdhui = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00").getTime()
  return Math.round((cible - aujourdhui) / 86_400_000)
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  progress,
  valueClassName,
  progressClassName = "bg-gold",
}: {
  label: string
  value: string
  hint?: string
  icon: typeof Wallet
  progress?: number
  valueClassName?: string
  progressClassName?: string
}) {
  return (
    <Card size="sm" className={cardClass}>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium tracking-[0.12em] text-[var(--ink-light)] uppercase">
            {label}
          </div>
          <Icon className="size-4 text-[var(--ink-light)]" />
        </div>
        <div
          className={cn(
            "text-[1.6rem] leading-tight font-semibold tracking-[-0.05em] text-[var(--ink)]",
            valueClassName
          )}
        >
          {value}
        </div>
        {progress !== undefined && <ProgressBar value={progress} colorClassName={progressClassName} />}
        {hint && <div className="text-[12px] text-[var(--ink-soft)]">{hint}</div>}
      </CardContent>
    </Card>
  )
}

export function EvenementDetailPage({
  ctx,
  evenements,
  paiements,
  choristes,
  peutEncaisser,
  onRetour,
  onSupprimer,
  onEncaisser,
  onVoirPaiement,
}: {
  ctx: BudgetContext
  evenements: Evenement[]
  paiements: Paiement[]
  choristes: string[]
  peutEncaisser: boolean
  onRetour: () => void
  onSupprimer: (id: string) => void
  onEncaisser: (pre: { choriste?: string; eventId: string }) => void
  onVoirPaiement: (id: string) => void
}) {
  const { id } = useParams()
  const evenement = evenements.find((e) => e.id === id)
  const [filtre, setFiltre] = useState<Filtre>("tous")
  const [confirmSuppression, setConfirmSuppression] = useState(false)

  const versementsEvenement = useMemo(
    () => paiements.filter((p) => p.eventId === id),
    [paiements, id]
  )

  const lignes = useMemo(() => {
    if (!evenement) return []
    const { montant, versements } = evenement.cotisation
    const noms = Array.from(new Set([...choristes, ...Object.keys(versements)]))
    return noms.map((nom) => {
      const paye = versements[nom] ?? 0
      const statut: Statut =
        paye <= 0 ? "non-paye" : montant > 0 && paye < montant ? "partiel" : "a-jour"
      const dernier = versementsEvenement.find((p) => p.choriste === nom)
      return { nom, paye, reste: Math.max(0, montant - paye), statut, dernier }
    })
  }, [choristes, evenement, versementsEvenement])

  if (!evenement) {
    return (
      <Card className={cn(cardClass, "mx-auto max-w-md text-center")}>
        <CardContent className="space-y-4 py-4">
          <CalendarDays className="mx-auto size-8 text-[var(--ink-light)]" />
          <p className="text-sm text-[var(--ink-soft)]">Cet événement est introuvable.</p>
          <Button variant="outline" onClick={onRetour}>
            <ArrowLeft /> Retour aux événements
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { cotisation, budgetPrevisionnel } = evenement
  const bilan = bilanEvenement(evenement, ctx.depenses, ctx.recettes)
  const depenses = bilan.depenses
  const recettesLiees = ctx.recettes.filter((r) => r.eventId === evenement.id)
  const attenduTotal = cotisation.montant * lignes.length
  const pctCollecte = attenduTotal ? (cotisation.collecte / attenduTotal) * 100 : 0
  const depValidees = bilan.validees
  const depEnAttente = bilan.enAttente
  const pctBudget = budgetPrevisionnel ? ((depValidees + depEnAttente) / budgetPrevisionnel) * 100 : 0
  const solde = bilan.solde

  const compte = (s: Statut) => lignes.filter((l) => l.statut === s).length
  const lignesFiltrees = filtre === "tous" ? lignes : lignes.filter((l) => l.statut === filtre)

  const jours = joursAvant(evenement.date)
  const echeance =
    jours > 1 ? `Dans ${jours} jours` : jours === 1 ? "Demain" : jours === 0 ? "Aujourd'hui" : "Terminé"

  const filtres: { key: Filtre; label: string; count: number }[] = [
    { key: "tous", label: "Tous", count: lignes.length },
    { key: "a-jour", label: "À jour", count: compte("a-jour") },
    { key: "partiel", label: "Partiel", count: compte("partiel") },
    { key: "non-paye", label: "Non payé", count: compte("non-paye") },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onRetour}>
          <ArrowLeft /> Retour aux événements
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="destructive" onClick={() => setConfirmSuppression(true)}>
            <Trash2 /> Supprimer
          </Button>
          <Button variant="outline" onClick={() => ctx.onNouvelleDepense(evenement.id)}>
            <Plus /> Enregistrer une dépense
          </Button>
          {peutEncaisser && (
            <Button onClick={() => onEncaisser({ eventId: evenement.id })}>
              <Coins /> Encaisser une cotisation
            </Button>
          )}
        </div>
      </div>

      <Card className={cardClass}>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-[var(--navy)] text-[var(--gold-soft)]">
              <span className="text-lg leading-none font-semibold">
                {new Date(evenement.date + "T00:00:00").getDate() || "—"}
              </span>
              <span className="text-[10px] tracking-[0.12em] uppercase">
                {new Date(evenement.date + "T00:00:00").toLocaleDateString("fr-FR", { month: "short" })}
              </span>
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {evenement.type}
                </Badge>
                <Badge variant={jours < 0 ? "default" : "success"}>{echeance}</Badge>
              </div>
              <h3 className="truncate font-heading text-2xl tracking-[-0.05em] text-[var(--ink)]">
                {evenement.titre}
              </h3>
              <div className="mt-0.5 flex items-center gap-1.5 text-sm text-[var(--ink-soft)]">
                <CalendarDays className="size-3.5" /> {dateLongue(evenement.date)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-medium tracking-[0.12em] text-[var(--ink-light)] uppercase">
              Participation
            </div>
            <div className="text-2xl font-semibold tracking-[-0.05em] text-[var(--ink)]">
              {compte("a-jour")} / {lignes.length}
            </div>
            <div className="text-xs text-[var(--ink-soft)]">choristes à jour</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Cotisation / choriste"
          value={fmt(cotisation.montant)}
          hint={`${lignes.length} choristes concernés`}
          icon={Users}
        />
        <StatCard
          label="Collecté"
          value={fmt(cotisation.collecte)}
          valueClassName="text-teal"
          progress={pctCollecte}
          progressClassName="bg-teal"
          hint={`${Math.round(pctCollecte)} % de ${fmt(attenduTotal)} attendus`}
          icon={Coins}
        />
        <StatCard
          label="Dépenses"
          value={fmt(depValidees + depEnAttente)}
          valueClassName="text-rust"
          progress={budgetPrevisionnel ? pctBudget : undefined}
          progressClassName={pctBudget > 100 ? "bg-rust" : "bg-gold"}
          hint={
            budgetPrevisionnel
              ? `sur ${fmt(budgetPrevisionnel)} de budget prévisionnel`
              : "Aucun budget prévisionnel"
          }
          icon={Wallet}
        />
        <StatCard
          label="Solde"
          value={fmt(solde)}
          valueClassName={solde < 0 ? "text-rust" : undefined}
          hint={bilan.autresRecettes ? `dont ${fmt(bilan.autresRecettes)} de dons, billetterie…` : "Recettes − dépenses validées"}
          icon={ReceiptText}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className={cn(cardClass, "min-w-0 py-0 xl:col-span-2")}>
          <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
            <div>
              <CardTitle>Cotisations des choristes</CardTitle>
              <CardDescription>
                Qui a cotisé, combien, et ce qu'il reste à percevoir.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-1 rounded-xl bg-[var(--muted)] p-1">
              {filtres.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFiltre(f.key)}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]",
                    filtre === f.key && "bg-white text-[var(--ink)] shadow-sm"
                  )}
                >
                  {f.label} <span className="text-[var(--ink-light)]">{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Choriste</TableHead>
                <TableHead>Versé</TableHead>
                <TableHead>Reste</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernier reçu</TableHead>
                {peutEncaisser && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {lignesFiltrees.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="py-8 text-center text-[var(--ink-light)]">
                    Aucun choriste dans cette catégorie.
                  </TableCell>
                </TableRow>
              )}
              {lignesFiltrees.map((l) => (
                <TableRow key={l.nom}>
                  <TableCell className="font-medium text-[var(--ink)]">{l.nom}</TableCell>
                  <TableCell className="font-semibold text-teal">{l.paye ? fmt(l.paye) : "—"}</TableCell>
                  <TableCell className={l.reste ? "text-rust" : undefined}>
                    {l.reste ? fmt(l.reste) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUT_VARIANT[l.statut]}>{STATUT_LABEL[l.statut]}</Badge>
                  </TableCell>
                  <TableCell>
                    {l.dernier ? (
                      <button
                        type="button"
                        onClick={() => onVoirPaiement(l.dernier!.id)}
                        className="text-xs font-medium text-[var(--gold-strong)] underline-offset-2 hover:underline"
                      >
                        {l.dernier.recu}
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--ink-light)]">
                        {l.paye ? "Antérieur" : "—"}
                      </span>
                    )}
                  </TableCell>
                  {peutEncaisser && (
                    <TableCell className="text-right">
                      {l.reste > 0 && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => onEncaisser({ eventId: evenement.id, choriste: l.nom })}
                        >
                          <Plus /> Encaisser
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="border-t border-[var(--line)] px-5 py-3 text-[12px] text-[var(--ink-soft)]">
            Reste à percevoir : <span className="font-semibold text-rust">{fmt(lignes.reduce((s, l) => s + l.reste, 0))}</span>
          </div>
        </Card>

        <div className="flex min-w-0 flex-col gap-5">
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>Budget & dépenses</CardTitle>
              <CardDescription>
                {fmt(depValidees)} validées · {fmt(depEnAttente)} en attente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {depenses.length === 0 ? (
                <p className="rounded-xl bg-[var(--muted)] px-3.5 py-3 text-[12.5px] text-[var(--ink-soft)]">
                  Aucune dépense enregistrée.
                </p>
              ) : (
                <div className="flex flex-col">
                  {depenses.map((d) => {
                    const peutTraiter = ctx.peutValider && d.statut === "en_attente" && d.saisiPar !== ctx.utilisateur
                    return (
                      <div
                        key={d.id}
                        className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2.5 last:border-0"
                      >
                        <div className="min-w-0">
                          <div className={cn("truncate text-[13px] text-[var(--ink)]", d.statut === "rejetee" && "text-[var(--ink-light)] line-through")}>
                            {d.libelle}
                          </div>
                          <div className="text-xs text-[var(--ink-light)]">
                            <span className="font-medium text-rust">{fmt(d.montant)}</span> · {d.categorie}
                            {!d.justificatif && d.statut !== "rejetee" && <span className="text-amber"> · sans justificatif</span>}
                          </div>
                        </div>
                        {peutTraiter ? (
                          <div className="flex shrink-0 gap-1">
                            <Button size="xs" onClick={() => ctx.onValiderDepense(d.id)}>
                              <Check /> Valider
                            </Button>
                            <Button size="icon-xs" variant="destructive" aria-label="Rejeter" onClick={() => ctx.onRejeterDepense(d)}>
                              <Trash2 />
                            </Button>
                          </div>
                        ) : (
                          <Badge variant={STATUT_DEPENSE[d.statut].variant} title={d.motifRejet}>
                            {STATUT_DEPENSE[d.statut].label}
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {budgetPrevisionnel > 0 && (
                <div className="rounded-xl bg-[var(--muted)] px-3.5 py-3 text-[12.5px] text-[var(--ink-soft)]">
                  Budget restant :{" "}
                  <span className="font-semibold text-[var(--ink)]">
                    {fmt(budgetPrevisionnel - depValidees - depEnAttente)}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => ctx.onNouvelleDepense(evenement.id)}>
                  <Plus /> Dépense
                </Button>
                <Button variant="outline" onClick={() => ctx.onAller("/budget?vue=depenses")}>
                  Journal <ArrowLeft className="rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>Autres recettes</CardTitle>
              <CardDescription>Dons, billetterie et recettes rattachées à l'événement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recettesLiees.length === 0 ? (
                <p className="rounded-xl bg-[var(--muted)] px-3.5 py-3 text-[12.5px] text-[var(--ink-soft)]">
                  Aucune recette hors cotisations.
                </p>
              ) : (
                <div className="flex flex-col">
                  {recettesLiees.map((r) => (
                    <div key={r.id} className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-2.5 last:border-0">
                      <div className="min-w-0">
                        <div className="truncate text-[13px] text-[var(--ink)]">{r.libelle}</div>
                        <div className="text-xs text-[var(--ink-light)]">
                          {TYPE_RECETTE_LABEL[r.type]} · {r.source}
                        </div>
                      </div>
                      <span className="shrink-0 text-[13px] font-semibold text-teal">+{fmt(r.montant)}</span>
                    </div>
                  ))}
                </div>
              )}
              {ctx.peutSaisir && (
                <Button variant="outline" className="w-full" onClick={() => ctx.onNouvelleRecette(evenement.id)}>
                  <Plus /> Ajouter un don ou une recette
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle>Versements reçus</CardTitle>
              <CardDescription>Paiements enregistrés pour cet événement</CardDescription>
            </CardHeader>
            <CardContent>
              {versementsEvenement.length === 0 ? (
                <p className="rounded-xl bg-[var(--muted)] px-3.5 py-3 text-[12.5px] text-[var(--ink-soft)]">
                  Aucun reçu émis depuis le portail pour cet événement.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {versementsEvenement.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onVoirPaiement(p.id)}
                      className="flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[var(--muted)]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] text-[var(--ink)]">{p.choriste}</span>
                        <span className="text-[11px] text-[var(--ink-light)]">
                          {p.recu} · {p.date}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold text-teal">{fmt(p.montant)}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmSuppression} onOpenChange={setConfirmSuppression}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer l'événement ?</DialogTitle>
            <DialogDescription>
              « {evenement.titre} » sera retiré, avec son suivi de cotisations et de dépenses.
              Les reçus déjà émis restent dans Paiements & Reçus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSuppression(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmSuppression(false)
                onSupprimer(evenement.id)
              }}
            >
              <Trash2 /> Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
