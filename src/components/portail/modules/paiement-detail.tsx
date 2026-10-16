import { useParams } from "react-router-dom"
import { ArrowLeft, CalendarDays, Mail, Phone, Printer, ReceiptText, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { dateLongue, enLettres, fmt } from "@/lib/format"
import { useAppSettings } from "@/store/app-settings"
import type { Compte, Paiement } from "@/types/portail"

function categorieDe(type: string) {
  if (type.startsWith("Statutaire")) return "Cotisation statutaire"
  if (type.startsWith("Événementielle")) return "Cotisation événementielle"
  return "Autre versement"
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-3 last:border-0">
      <div className="text-[11px] font-medium tracking-[0.12em] text-[var(--ink-light)] uppercase">
        {label}
      </div>
      <div className="text-right text-[13px] font-medium text-[var(--ink)]">{children}</div>
    </div>
  )
}

export function PaiementDetailPage({
  paiements,
  comptes,
  onRetour,
  onVoir,
}: {
  paiements: Paiement[]
  comptes: Compte[]
  onRetour: () => void
  onVoir: (id: string) => void
}) {
  const { id } = useParams()
  const appName = useAppSettings((s) => s.appName)
  const paiement = paiements.find((p) => p.id === id)

  if (!paiement) {
    return (
      <Card className="mx-auto max-w-md border border-[var(--line)] bg-white/75 text-center">
        <CardContent className="space-y-4 py-4">
          <ReceiptText className="mx-auto size-8 text-[var(--ink-light)]" />
          <p className="text-sm text-[var(--ink-soft)]">Ce paiement est introuvable.</p>
          <Button variant="outline" onClick={onRetour}>
            <ArrowLeft /> Retour aux paiements
          </Button>
        </CardContent>
      </Card>
    )
  }

  const compte = comptes.find((c) => c.nom === paiement.choriste)
  const historique = paiements.filter((p) => p.choriste === paiement.choriste)
  const totalChoriste = historique.reduce((s, p) => s + p.montant, 0)
  const montantLettres = enLettres(paiement.montant)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="ghost" size="sm" onClick={onRetour}>
          <ArrowLeft /> Retour aux paiements
        </Button>
        <Button onClick={() => window.print()}>
          <Printer /> Imprimer / PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(300px,380px)_1fr]">
        <div className="flex min-w-0 flex-col gap-5 print:hidden">
          <Card className="border border-[var(--line)] bg-white/75 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-medium tracking-[0.12em] text-[var(--ink-light)] uppercase">
                  Montant versé
                </div>
                <Badge variant="success">Payé</Badge>
              </div>
              <div className="text-[2rem] leading-tight font-semibold tracking-[-0.06em] text-[var(--ink)]">
                {fmt(paiement.montant)}
              </div>
              <CardDescription className="first-letter:uppercase">
                {montantLettres} francs CFA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DetailRow label="N° de reçu">{paiement.recu}</DetailRow>
              <DetailRow label="Date">{dateLongue(paiement.date)}</DetailRow>
              <DetailRow label="Catégorie">{categorieDe(paiement.type)}</DetailRow>
              <DetailRow label="Motif">{paiement.type}</DetailRow>
              <DetailRow label="Enregistré par">{paiement.auteur}</DetailRow>
            </CardContent>
          </Card>

          <Card className="border border-[var(--line)] bg-white/75 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <CardHeader>
              <CardTitle>Choriste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--gold-soft)] text-[var(--navy)]">
                  <UserRound className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-[var(--ink)]">
                    {paiement.choriste}
                  </div>
                  {compte && (
                    <div className="flex items-center gap-1.5 truncate text-xs text-[var(--ink-light)]">
                      <Phone className="size-3" /> {compte.telephone}
                      {compte.email && (
                        <>
                          <Mail className="ml-1.5 size-3" /> {compte.email}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-xl bg-[var(--muted)] px-3.5 py-3 text-[12.5px] text-[var(--ink-soft)]">
                {historique.length} versement{historique.length > 1 ? "s" : ""} enregistré
                {historique.length > 1 ? "s" : ""} · total {fmt(totalChoriste)}
              </div>
            </CardContent>
          </Card>

          {historique.length > 1 && (
            <Card className="border border-[var(--line)] bg-white/75 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              <CardHeader>
                <CardTitle>Autres versements</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {historique
                  .filter((p) => p.id !== paiement.id)
                  .map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onVoir(p.id)}
                      className="flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[var(--muted)]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] text-[var(--ink)]">{p.type}</span>
                        <span className="flex items-center gap-1 text-[11px] text-[var(--ink-light)]">
                          <CalendarDays className="size-3" /> {p.date}
                        </span>
                      </span>
                      <span className="shrink-0 text-[13px] font-semibold text-teal">{fmt(p.montant)}</span>
                    </button>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="min-w-0 border border-[var(--line)] bg-white py-0 shadow-[0_12px_30px_rgba(15,23,42,0.04)] print:border-0 print:shadow-none">
          <div className="mx-auto w-full max-w-2xl px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)] pb-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--navy)] text-[var(--gold-soft)]">
                  <ReceiptText className="size-5" />
                </div>
                <div>
                  <div className="font-heading text-xl leading-tight tracking-[-0.04em] text-[var(--ink)]">
                    {appName}
                  </div>
                  <div className="text-[11px] tracking-[0.12em] text-[var(--ink-light)] uppercase">
                    Trésorerie de la chorale
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold tracking-[0.16em] text-[var(--ink-light)] uppercase">
                  Reçu de paiement
                </div>
                <div className="mt-1 font-heading text-lg tracking-[-0.03em] text-[var(--ink)]">
                  N° {paiement.recu}
                </div>
                <div className="text-xs text-[var(--ink-soft)]">{dateLongue(paiement.date)}</div>
              </div>
            </div>

            <div className="space-y-5 py-7 text-[14px] leading-relaxed text-[var(--ink-soft)]">
              <p>
                Reçu de <span className="font-semibold text-[var(--ink)]">{paiement.choriste}</span>,
                la somme de{" "}
                <span className="font-semibold text-[var(--ink)]">{montantLettres} francs CFA</span>.
              </p>

              <div className="overflow-hidden rounded-xl border border-[var(--line)]">
                <div className="grid grid-cols-[1fr_auto] gap-4 bg-[var(--muted)] px-4 py-2.5 text-[10px] font-semibold tracking-[0.14em] text-[var(--ink-light)] uppercase">
                  <span>Désignation</span>
                  <span>Montant</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3.5 text-[13px]">
                  <span className="text-[var(--ink)]">
                    {paiement.type}
                    <span className="block text-xs text-[var(--ink-light)]">
                      {categorieDe(paiement.type)}
                    </span>
                  </span>
                  <span className="font-medium text-[var(--ink)]">{fmt(paiement.montant)}</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-[var(--line)] px-4 py-3.5">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-light)] uppercase">
                    Total réglé
                  </span>
                  <span className="text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
                    {fmt(paiement.montant)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6 border-t border-[var(--line)] pt-6">
              <div className="text-xs text-[var(--ink-light)]">
                Reçu généré automatiquement — à conserver.
              </div>
              <div className="min-w-48 text-center">
                <div className="text-[11px] tracking-[0.12em] text-[var(--ink-light)] uppercase">
                  Le trésorier
                </div>
                <div className="mt-8 border-t border-dashed border-[var(--line-strong)] pt-1.5 text-[13px] font-medium text-[var(--ink)]">
                  {paiement.auteur}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
