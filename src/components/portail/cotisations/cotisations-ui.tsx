import type { ReactNode } from "react"
import { Check, Clock3, Minus, Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const cardClass =
  "border border-[var(--line)] bg-white/75 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"

/* ---------- Indicateurs ---------- */

export function KpiCard({
  label,
  value,
  suffix,
  hint,
  progress,
  tone = "default",
}: {
  label: string
  value: string
  suffix?: string
  hint: string
  progress?: number
  tone?: "default" | "danger"
}) {
  return (
    <Card size="sm" className={cardClass}>
      <CardContent className="flex flex-col gap-1.5">
        <div className="text-[12px] text-[var(--ink-soft)]">{label}</div>
        <div
          className={cn(
            "text-[1.6rem] leading-tight font-semibold tracking-[-0.05em] text-[var(--ink)]",
            tone === "danger" && "text-rust"
          )}
        >
          {value}
          {suffix && <span className="ml-1 text-base font-medium text-[var(--ink-light)]">{suffix}</span>}
        </div>
        {progress !== undefined && (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
            <div className="h-full rounded-full bg-teal" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
        )}
        <div className="text-[11.5px] text-[var(--ink-light)]">{hint}</div>
      </CardContent>
    </Card>
  )
}

/* ---------- Cases de la grille ---------- */

export type CellTone = "paye" | "retard" | "partiel" | "impaye" | "avenir" | "libre"

const CELL_CLASS: Record<CellTone, string> = {
  paye: "border-transparent bg-teal text-white",
  retard: "border-[color-mix(in_srgb,var(--amber)_45%,transparent)] bg-amber-soft text-amber",
  partiel: "border-[color-mix(in_srgb,var(--amber)_45%,transparent)] bg-amber-soft text-amber",
  impaye: "border-[color-mix(in_srgb,var(--rust)_45%,transparent)] bg-white text-rust",
  avenir: "border-dashed border-[var(--line-strong)] bg-[var(--muted)] text-transparent",
  libre: "border-[var(--line)] bg-white text-[var(--ink-light)]",
}

function CellIcon({ tone }: { tone: CellTone }) {
  switch (tone) {
    case "paye":
      return <Check className="size-3.5" strokeWidth={3} />
    case "retard":
      return <Clock3 className="size-3.5" />
    case "partiel":
      return <span className="text-[9px] leading-none font-bold">½</span>
    case "impaye":
      return <X className="size-3.5" />
    case "libre":
      return <Minus className="size-3.5" />
    default:
      return null
  }
}

export function StatusCell({
  tone,
  title,
  onClick,
}: {
  tone: CellTone
  title: string
  onClick?: () => void
}) {
  const className = cn(
    "mx-auto flex size-7 items-center justify-center rounded-[7px] border transition-transform",
    CELL_CLASS[tone]
  )
  if (!onClick) {
    return (
      <div className={className} title={title} aria-label={title}>
        <CellIcon tone={tone} />
      </div>
    )
  }
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(className, "cursor-pointer hover:scale-110 focus-visible:ring-4 focus-visible:ring-[var(--ring)] focus-visible:outline-none")}
    >
      <CellIcon tone={tone} />
    </button>
  )
}

export function Legend({ items }: { items: { tone: CellTone; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {items.map((it) => (
        <div key={it.tone} className="flex items-center gap-1.5 text-[12px] text-[var(--ink-soft)]">
          <span
            className={cn(
              "flex size-4 items-center justify-center rounded-[5px] border [&_svg]:size-2.5",
              CELL_CLASS[it.tone]
            )}
          >
            <CellIcon tone={it.tone} />
          </span>
          {it.label}
        </div>
      ))}
    </div>
  )
}

/* ---------- Membre ---------- */

const AVATAR_TONES = [
  "bg-emerald-50 text-emerald-700",
  "bg-sky-50 text-sky-700",
  "bg-violet-50 text-violet-700",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-700",
  "bg-indigo-50 text-indigo-700",
]

function hash(text: string) {
  let h = 0
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function MemberCell({ nom, role }: { nom: string; role: string }) {
  const initiales = nom
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[9px] text-[11px] font-semibold",
          AVATAR_TONES[hash(nom) % AVATAR_TONES.length]
        )}
      >
        {initiales}
      </div>
      <div className="min-w-0">
        <div className="truncate text-[13px] font-semibold text-[var(--ink)]">{nom}</div>
        <div className="truncate text-[11.5px] text-[var(--ink-light)]">{role}</div>
      </div>
    </div>
  )
}

export function TotalCell({
  montant,
  progress,
  impayes,
}: {
  montant: string
  progress: number
  impayes: number
}) {
  return (
    <div className="min-w-36">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-semibold whitespace-nowrap text-[var(--ink)]">{montant}</span>
        {impayes === 0 ? (
          <Badge variant="success" className="px-2 py-0.5 text-[9px]">À jour</Badge>
        ) : (
          <Badge variant="destructive" className="px-2 py-0.5 text-[9px]">
            {impayes} impayé{impayes > 1 ? "s" : ""}
          </Badge>
        )}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div
          className={cn("h-full rounded-full", impayes === 0 ? "bg-teal" : "bg-[#e8743b]")}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  )
}

export function RateCell({ value }: { value: number | null }) {
  if (value === null) return <div className="text-center text-[11px] text-[var(--ink-light)]">—</div>
  return (
    <div className="mx-auto flex w-9 flex-col items-center gap-1">
      <span className="text-[11px] font-semibold text-[var(--ink)]">{value} %</span>
      <span className="h-0.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <span
          className={cn("block h-full rounded-full", value >= 95 ? "bg-teal" : "bg-[#e8743b]")}
          style={{ width: `${value}%` }}
        />
      </span>
    </div>
  )
}

/* ---------- Barre d'outils ---------- */

export type FiltreMembres = "tous" | "a-jour" | "en-retard" | "aucun"

export function Toolbar({
  recherche,
  onRecherche,
  filtre,
  onFiltre,
  counts,
  legend,
}: {
  recherche: string
  onRecherche: (v: string) => void
  filtre: FiltreMembres
  onFiltre: (f: FiltreMembres) => void
  counts: Record<FiltreMembres, number>
  legend: ReactNode
}) {
  const tabs: { key: FiltreMembres; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "a-jour", label: "À jour" },
    { key: "en-retard", label: "En retard" },
    { key: "aucun", label: "Rien payé" },
  ]
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-light)]" />
          <input
            value={recherche}
            onChange={(e) => onRecherche(e.target.value)}
            placeholder="Rechercher un membre..."
            className="h-9 w-56 rounded-xl border border-[var(--line)] bg-white pr-3 pl-9 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-light)] focus-visible:border-[var(--gold)] focus-visible:ring-4 focus-visible:ring-[var(--ring)]"
          />
        </div>
        <div className="flex gap-1 rounded-xl bg-[var(--muted)] p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onFiltre(t.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12.5px] font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]",
                filtre === t.key && "bg-white text-[var(--ink)] shadow-sm"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "rounded-md px-1.5 text-[10.5px]",
                  filtre === t.key ? "bg-[var(--navy)] text-white" : "bg-white/70 text-[var(--ink-light)]"
                )}
              >
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
      </div>
      {legend}
    </div>
  )
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow: string
  title: string
  subtitle: string
  actions: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.14em] text-[var(--ink-light)] uppercase">
          {eyebrow}
        </div>
        <h3 className="mt-1 font-heading text-[1.75rem] leading-tight tracking-[-0.05em] text-[var(--ink)]">
          {title}
        </h3>
        <div className="mt-0.5 text-[13px] text-[var(--ink-soft)]">{subtitle}</div>
      </div>
      <div className="flex flex-wrap items-center gap-2">{actions}</div>
    </div>
  )
}
