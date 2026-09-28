import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  BadgeCheck,
  BookOpenText,
  CalendarDays,
  Coins,
  Gavel,
  ListFilter,
  Music2,
  Pause,
  Play,
  Receipt,
  RotateCcw,
  RotateCw,
  ScrollText,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProgressBar } from "@/components/portail/common"
import { ROLE_LABEL } from "@/data/portail-mock"
import { fmt } from "@/lib/format"
import { cn } from "@/lib/utils"
import type {
  Chant,
  Compte,
  Evenement,
  ModuleKey,
  Paiement,
  Perms,
  Role,
  Statutaire,
} from "@/types/portail"

const ROLE_BAR_CLASS: Record<Role, string> = {
  admin_chorale: "bg-plum",
  bureau: "bg-gold",
  secretaire: "bg-gold",
  tresorier: "bg-teal",
  choriste: "bg-muted-foreground",
  commission_recette: "bg-amber",
  commission_musicale: "bg-rust",
}

export function Accueil({
  evenements,
  comptes,
  statutaire,
  chants,
  paiements,
  perms,
  onNavigate,
  onValiderDepense,
}: {
  evenements: Evenement[]
  comptes: Compte[]
  statutaire: Statutaire
  chants: Chant[]
  paiements: Paiement[]
  perms: Perms
  onNavigate: (key: ModuleKey) => void
  onValiderDepense: (evId: string, idx: number) => void
}) {
  const annee = new Date().getFullYear()

  const totalPaiements = useMemo(
    () => paiements.reduce((s, p) => s + p.montant, 0),
    [paiements]
  )

  const recouvrement = useMemo(() => {
    const noms = Object.keys(statutaire.suivis)
    const moisEcoules = Math.max(
      1,
      ...Object.values(statutaire.suivis).map((a) => a.lastIndexOf(1) + 1)
    )
    const attendu = noms.length * moisEcoules
    const paye = Object.values(statutaire.suivis).reduce(
      (s, a) => s + a.slice(0, moisEcoules).reduce((x, y) => x + y, 0),
      0
    )
    const aJour = noms.filter((n) =>
      statutaire.suivis[n].slice(0, moisEcoules).every((v) => v === 1)
    ).length
    const pct = attendu ? Math.round((paye / attendu) * 100) : 0
    const reste = Math.max(0, attendu - paye) * statutaire.mensualite
    return { pct, aJour, total: noms.length, reste }
  }, [statutaire])

  const nextEvent = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const sorted = [...evenements].sort((a, b) => a.date.localeCompare(b.date))
    return sorted.find((e) => e.date >= today) ?? sorted[0]
  }, [evenements])

  const categoriesCount = useMemo(
    () => new Set(chants.map((c) => c.categorie)).size,
    [chants]
  )

  const comptesActifs = comptes.filter((c) => c.statut === "actif").length

  const rolesDistribution = useMemo(() => {
    const roleKeys = Array.from(
      new Set(comptes.flatMap((c) => c.roles).filter((r) => r !== "choriste"))
    ) as Role[]
    return roleKeys.map((r) => {
      const membres = comptes.filter((c) => c.roles.includes(r))
      const actifs = membres.filter((c) => c.statut === "actif").length
      return {
        role: r,
        actifs,
        total: membres.length,
        pct: membres.length ? Math.round((actifs / membres.length) * 100) : 0,
      }
    })
  }, [comptes])

  const depensesEnAttente = useMemo(
    () =>
      evenements.flatMap((e) =>
        e.depenses
          .map((d, idx) => ({ ...d, idx, evId: e.id, evTitre: e.titre }))
          .filter((d) => !d.valide)
      ),
    [evenements]
  )

  const flux = useMemo(() => {
    const depenses = depensesEnAttente.map((d) => ({
      kind: "depense" as const,
      key: `dep-${d.evId}-${d.idx}`,
      titre: d.libelle,
      badge: d.evTitre,
      montant: -d.montant,
      evId: d.evId,
      idx: d.idx,
    }))
    const versements = paiements.slice(0, 6).map((p) => ({
      kind: "paiement" as const,
      key: `pai-${p.id}`,
      titre: p.choriste,
      badge: p.type,
      montant: p.montant,
      recu: p.recu,
    }))
    return [...depenses, ...versements].slice(0, 5)
  }, [depensesEnAttente, paiements])

  const pupitres = useMemo(() => {
    const labels = ["Sopranos", "Altos", "Ténors", "Basses"]
    const weights = [0.3, 0.25, 0.2, 0.25]
    return labels.map((label, i) => {
      const total = Math.max(1, Math.round(comptes.length * weights[i]))
      const present = Math.min(total, Math.round(comptesActifs * weights[i]))
      return { label, present, total }
    })
  }, [comptes.length, comptesActifs])

  const chantSignale = chants[chants.length - 1]
  const [arbitrageResolu, setArbitrageResolu] = useState(false)

  const voixOptions = ["Soprano", "Alto", "Ténor", "Basse"] as const
  const [voix, setVoix] = useState<(typeof voixOptions)[number]>("Soprano")
  const [lecture, setLecture] = useState(false)

  const liturgicalVars = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    "--font-heading": "'EB Garamond', serif",
    "--ebene": "#271900",
  } as React.CSSProperties

  return (
    <div style={liturgicalVars}>
      <div className="grid grid-cols-4 gap-4">
        <Card className="relative overflow-hidden rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md transition-shadow hover:shadow-lg">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[rgba(198,146,45,0.6)] to-[rgba(223,171,72,0.15)]" />
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
                Trésorerie collectée
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold-strong)]">
                <Wallet size={14} />
              </div>
            </div>
            <div className="font-heading text-[26px] text-foreground">
              {fmt(totalPaiements)}
            </div>
            <div className="mt-1 text-[12px] text-muted-foreground">
              {paiements.length} versement{paiements.length > 1 ? "s" : ""} enregistré
              {paiements.length > 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md transition-shadow hover:shadow-lg">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[rgba(198,146,45,0.6)] to-[rgba(223,171,72,0.15)]" />
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
                Recouvrement cotisations
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-teal/10 text-teal">
                <Coins size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="font-heading text-[26px] text-teal">{recouvrement.pct}%</div>
              <div className="text-[12px] text-muted-foreground">
                {recouvrement.aJour}/{recouvrement.total} à jour
              </div>
            </div>
            <div className="mt-2.5">
              <ProgressBar value={recouvrement.pct} colorClassName="bg-teal" />
            </div>
            <div className="mt-1.5 text-[12px] text-muted-foreground">
              Reste à recouvrer : {fmt(recouvrement.reste)}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md transition-shadow hover:shadow-lg">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[rgba(198,146,45,0.6)] to-[rgba(223,171,72,0.15)]" />
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
                Prochain événement
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold-strong)]">
                <CalendarDays size={14} />
              </div>
            </div>
            {nextEvent ? (
              <>
                <div className="truncate font-heading text-[17px] font-semibold text-foreground">
                  {nextEvent.titre}
                </div>
                <div className="mt-0.5 text-[12px] text-muted-foreground">
                  {nextEvent.date} · {nextEvent.type}
                </div>
                <div className="mt-2.5">
                  <ProgressBar
                    value={
                      nextEvent.cotisation.montant * nextEvent.cotisation.attendu
                        ? (nextEvent.cotisation.collecte /
                            (nextEvent.cotisation.montant * nextEvent.cotisation.attendu)) *
                          100
                        : 0
                    }
                    colorClassName="bg-gold"
                  />
                </div>
                <div className="mt-1.5 text-[12px] text-muted-foreground">
                  {fmt(nextEvent.cotisation.collecte)} collecté
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Aucun événement planifié</div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md transition-shadow hover:shadow-lg">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[rgba(198,146,45,0.6)] to-[rgba(223,171,72,0.15)]" />
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <div className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
                Répertoire
              </div>
              <div className="flex size-8 items-center justify-center rounded-full bg-[var(--ebene)] text-[var(--gold)]">
                <Music2 size={14} />
              </div>
            </div>
            <div className="font-heading text-[26px] text-foreground">{chants.length}</div>
            <div className="mt-1 text-[12px] text-muted-foreground">
              chants répertoriés · {categoriesCount} catégorie{categoriesCount > 1 ? "s" : ""}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4">
          <Card className="rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] py-0 shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md">
            <div className="flex items-center justify-between px-4 pt-4">
              <div>
                <div className="font-heading text-base font-medium text-foreground">
                  Flux récents
                </div>
                <div className="text-xs text-muted-foreground">
                  Derniers versements et dépenses en attente de validation
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast("Filtrage par mode de paiement — bientôt disponible")}
                  className="flex items-center gap-1.5 rounded-lg border border-[rgba(198,146,45,0.3)] bg-white px-3 py-1.5 text-[12px] text-foreground transition-colors hover:bg-[rgba(198,146,45,0.08)]"
                >
                  <ListFilter size={13} />
                  Filtrer par mode
                </button>
                {perms.paiements && (
                  <button
                    onClick={() => onNavigate("paiements")}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--ebene)] px-3 py-1.5 text-[12px] font-medium text-[var(--gold)] transition-colors hover:bg-[var(--ebene)]/90"
                  >
                    <ScrollText size={13} />
                    Grand Livre
                  </button>
                )}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[rgba(198,146,45,0.2)] bg-transparent hover:bg-transparent">
                  {["Bénéficiaire", "Motif", "Montant", "Action"].map((h) => (
                    <TableHead
                      key={h}
                      className="font-mono text-[10.5px] tracking-[0.1em] text-[var(--gold-strong)] uppercase"
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {flux.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      Aucune opération récente
                    </TableCell>
                  </TableRow>
                )}
                {flux.map((f) => (
                  <TableRow key={f.key} className="hover:bg-[rgba(198,146,45,0.06)]">
                    <TableCell className="text-[13px] font-medium text-foreground">
                      {f.titre}
                    </TableCell>
                    <TableCell className="text-[12.5px] whitespace-normal text-muted-foreground">
                      {f.badge}
                    </TableCell>
                    <TableCell
                      className={
                        "text-[13px] font-semibold " +
                        (f.montant >= 0 ? "text-teal" : "text-rust")
                      }
                    >
                      {f.montant >= 0 ? "+" : "−"}
                      {fmt(Math.abs(f.montant))}
                    </TableCell>
                    <TableCell>
                      {f.kind === "paiement" ? (
                        <button
                          onClick={() => toast.success(`Reçu ${f.recu}`)}
                          className="rounded-md bg-[var(--gold)]/15 px-2.5 py-1 font-mono text-[11px] text-[var(--gold-strong)] transition-colors hover:bg-[var(--gold)] hover:text-white"
                        >
                          Reçu
                        </button>
                      ) : perms.evenements ? (
                        <Button size="sm" onClick={() => onValiderDepense(f.evId, f.idx)}>
                          Valider
                        </Button>
                      ) : (
                        <Badge variant="outline">En attente</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="px-4 py-3 text-[12px] text-muted-foreground">
              Affichage de {flux.length} opération{flux.length > 1 ? "s" : ""} sur{" "}
              {paiements.length + depensesEnAttente.length}
            </div>
          </Card>

          {perms.evenements && nextEvent && (
            <Card className="rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md">
              <CardContent>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Badge className="mb-1.5">{nextEvent.type}</Badge>
                    <div className="font-heading text-[19px] font-semibold text-foreground">
                      {nextEvent.titre}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{nextEvent.date}</div>
                  </div>
                  <button
                    onClick={() => onNavigate("evenements")}
                    className="text-[12.5px] font-medium text-[var(--gold-strong)] hover:underline"
                  >
                    Voir l'événement
                  </button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-[12px] text-muted-foreground">
                      <span>Cotisation collectée</span>
                      <span className="font-medium text-foreground">
                        {fmt(nextEvent.cotisation.collecte)}
                      </span>
                    </div>
                    <ProgressBar
                      value={
                        nextEvent.cotisation.montant * nextEvent.cotisation.attendu
                          ? (nextEvent.cotisation.collecte /
                              (nextEvent.cotisation.montant * nextEvent.cotisation.attendu)) *
                            100
                          : 0
                      }
                      colorClassName="bg-teal"
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-[12px] text-muted-foreground">
                      <span>Budget engagé</span>
                      <span className="font-medium text-foreground">
                        {fmt(nextEvent.depenses.reduce((s, d) => s + d.montant, 0))} /{" "}
                        {fmt(nextEvent.budgetPrevisionnel)}
                      </span>
                    </div>
                    <ProgressBar
                      value={
                        nextEvent.budgetPrevisionnel
                          ? (nextEvent.depenses.reduce((s, d) => s + d.montant, 0) /
                              nextEvent.budgetPrevisionnel) *
                            100
                          : 0
                      }
                      colorClassName="bg-gold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md">
            <CardContent>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[rgba(198,146,45,0.2)] pb-3.5">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Badge className="normal-case tracking-normal">Messe du dimanche</Badge>
                  </div>
                  <div className="font-heading text-base font-semibold text-foreground">
                    Prochaine célébration dominicale
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-heading text-[19px] text-[var(--gold-strong)]">
                    {comptesActifs} / {comptes.length}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Choristes confirmés (
                    {comptes.length ? Math.round((comptesActifs / comptes.length) * 100) : 0}%)
                  </div>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {pupitres.map((p) => (
                  <div
                    key={p.label}
                    className="rounded-xl border border-[rgba(198,146,45,0.25)] bg-white/70 p-3"
                  >
                    <div className="mb-1 flex items-center justify-between font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                      <span>{p.label}</span>
                    </div>
                    <div className="font-heading text-base text-foreground">
                      {p.present} <span className="text-[12px] text-muted-foreground">/ {p.total}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[rgba(198,146,45,0.15)]">
                      <div
                        className="h-full rounded-full bg-[var(--gold)]"
                        style={{ width: `${p.total ? (p.present / p.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[var(--gold-strong)] uppercase">
                <BookOpenText size={14} />
                Ordo musical du dimanche
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {chants.slice(0, 2).map((c, i) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-[rgba(198,146,45,0.25)] bg-white/60 p-3"
                  >
                    <div className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                      {i === 0 ? "Chant d'entrée" : "Offertoire"}
                    </div>
                    <div className="mt-0.5 text-[13px] font-medium text-foreground">{c.titre}</div>
                    <div className="text-[11.5px] text-muted-foreground">
                      {c.compositeur} · {c.tonalite}
                    </div>
                  </div>
                ))}
                {chants.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Ajoutez des chants au répertoire pour composer l'ordo musical.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md">
            <CardContent>
              <div className="mb-3 font-heading text-base font-medium text-foreground">
                Répartition des rôles
              </div>
              <div className="flex flex-col gap-3">
                {rolesDistribution.map((r) => (
                  <div key={r.role}>
                    <div className="mb-1 flex items-center justify-between text-[12.5px]">
                      <span className="text-foreground">{ROLE_LABEL[r.role]}</span>
                      <span className="text-muted-foreground">
                        {r.actifs}/{r.total}
                      </span>
                    </div>
                    <ProgressBar value={r.pct} colorClassName={ROLE_BAR_CLASS[r.role]} />
                  </div>
                ))}
              </div>
              <div className="mt-3.5 border-t border-border pt-3 text-[12px] text-muted-foreground">
                {comptesActifs} compte{comptesActifs > 1 ? "s" : ""} actif
                {comptesActifs > 1 ? "s" : ""} sur {comptes.length}
              </div>
            </CardContent>
          </Card>

          {chantSignale && (
            <Card className="rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md">
              <CardContent>
                <div className="mb-3 flex items-center gap-2">
                  <Gavel size={16} className="text-amber" />
                  <div className="font-heading text-base font-semibold text-foreground">
                    Arbitrage canonique
                  </div>
                </div>
                {arbitrageResolu ? (
                  <div className="rounded-xl border border-[rgba(198,146,45,0.25)] bg-white/60 p-3.5 text-[12.5px] text-muted-foreground">
                    Décision enregistrée pour « {chantSignale.titre} ».
                  </div>
                ) : (
                  <>
                    <p className="mb-3 text-[12.5px] text-muted-foreground">
                      Chant signalé lors des répétitions préparatoires, en attente de
                      validation par la commission musicale.
                    </p>
                    <div className="space-y-2.5 rounded-xl border border-[rgba(198,146,45,0.3)] bg-white/70 p-3.5">
                      <Badge variant="destructive" className="normal-case tracking-normal">
                        Non conforme rituel
                      </Badge>
                      <div className="font-heading text-[15px] font-semibold text-foreground">
                        « {chantSignale.titre} »
                      </div>
                      <p className="text-[12px] text-muted-foreground">
                        Texte non encore approuvé pour la liturgie du dimanche.
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => {
                            setArbitrageResolu(true)
                            toast.success(`Retrait approuvé — ${chantSignale.titre}`)
                          }}
                          className="w-full rounded-lg bg-destructive px-2 py-2 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                        >
                          Approuver retrait
                        </button>
                        <button
                          onClick={() => {
                            setArbitrageResolu(true)
                            toast(`Envoyé en audition — ${chantSignale.titre}`)
                          }}
                          className="w-full rounded-lg border border-[rgba(198,146,45,0.3)] bg-white px-2 py-2 text-[11px] font-medium text-foreground transition-colors hover:bg-[rgba(198,146,45,0.08)]"
                        >
                          Rejeter / Audition
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {perms.chantsVoir && chants.length > 0 && (
            <Card className="rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md">
              <CardContent>
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-heading text-base font-medium text-foreground">
                    Aperçu du répertoire
                  </div>
                  <button
                    onClick={() => onNavigate("chants")}
                    className="text-[12px] font-medium text-[var(--gold-strong)] hover:underline"
                  >
                    Voir tout
                  </button>
                </div>
                <div className="flex flex-col gap-2.5">
                  {chants.slice(0, 4).map((c) => (
                    <div key={c.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-[13px] font-medium text-foreground">
                          {c.titre}
                        </div>
                        <div className="truncate text-[11.5px] text-muted-foreground">
                          {c.compositeur} · {c.tonalite}
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {c.categorie}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-start gap-2.5 rounded-xl border-l-4 border-[var(--gold)] bg-gold-soft/70 px-3.5 py-3 text-[12.5px] text-[#6B5220]">
            <Receipt size={14} className="mt-0.5 shrink-0" />
            Le menu de gauche s'adapte automatiquement au(x) rôle(s) du compte
            sélectionné. Change de compte pour voir un autre point de vue sur
            le même portail.
          </div>

          {chants.length > 0 && (
            <Card className="rounded-2xl border-[rgba(198,146,45,0.28)] bg-[rgba(255,252,246,0.88)] shadow-[0_20px_40px_-15px_rgba(125,87,0,0.08)] backdrop-blur-md">
              <CardContent>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="font-heading text-base font-medium text-foreground">
                      Répétiteur vocal SATB
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Raccords audio par pupitre
                    </div>
                  </div>
                  <div className="flex size-7 items-center justify-center rounded-full bg-[var(--ebene)] text-[var(--gold)]">
                    <Music2 size={14} />
                  </div>
                </div>

                <div className="mb-3 flex rounded-xl bg-muted p-1 font-mono text-[10.5px]">
                  {voixOptions.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVoix(v)}
                      className={cn(
                        "flex-1 rounded-lg py-1.5 text-center transition-colors",
                        voix === v
                          ? "bg-white font-semibold text-[var(--gold-strong)] shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-[rgba(198,146,45,0.25)] bg-white/70 p-3.5">
                  <div className="mb-2 flex items-center justify-between text-[12px]">
                    <span className="truncate font-medium text-foreground">
                      {chants[0].titre} — Voix isolée {voix}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {lecture ? "00:42 / 03:10" : "00:00 / 03:10"}
                    </span>
                  </div>
                  <div className="mb-3 flex h-8 items-end justify-between gap-1 px-1">
                    {[3, 5, 7, 4, 6, 8, 5, 3, 6, 4, 7, 3, 2, 5].map((h, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 rounded-full",
                          i < 7 ? "bg-[var(--gold)]" : "bg-[var(--gold)]/40"
                        )}
                        style={{ height: `${h * 4}px` }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <button className="text-muted-foreground hover:text-foreground">
                      <RotateCcw size={16} />
                    </button>
                    <button
                      onClick={() => setLecture((v) => !v)}
                      className="flex size-9 items-center justify-center rounded-full bg-[var(--gold)] text-white shadow-md transition-transform active:scale-95"
                    >
                      {lecture ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <RotateCw size={16} />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="rounded-2xl border border-[rgba(198,146,45,0.28)] bg-gold-soft/40 p-4 text-center">
            <div className="mx-auto mb-2 flex size-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-[var(--gold)]/40">
              <BadgeCheck size={20} className="text-[var(--gold-strong)]" />
            </div>
            <div className="font-heading text-[15px] font-semibold text-foreground">
              Mandat canonique &amp; statutaire
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Bureau exécutif {annee}–{annee + 1} dûment investi. Registres de trésorerie
              tenus sous la responsabilité du compte connecté.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
