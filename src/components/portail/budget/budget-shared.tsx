import type { ReactNode } from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Depense, Evenement, Recette, StatutDepense } from "@/types/portail"

export interface BudgetContext {
  evenements: Evenement[]
  depenses: Depense[]
  recettes: Recette[]
  utilisateur: string
  peutSaisir: boolean
  peutValider: boolean
  onNouvelleDepense: (evId?: string) => void
  onNouvelleRecette: (eventId?: string) => void
  onValiderDepense: (id: string) => void
  onRejeterDepense: (depense: Depense) => void
  onToggleRapproche: (id: string) => void
  onJoindreJustificatif: (id: string, j: NonNullable<Depense["justificatif"]>) => void
  onAller: (chemin: string) => void
}

export const STATUT_DEPENSE: Record<
  StatutDepense,
  { label: string; variant: "warning" | "success" | "destructive" }
> = {
  en_attente: { label: "À valider", variant: "warning" },
  validee: { label: "Validée", variant: "success" },
  rejetee: { label: "Rejetée", variant: "destructive" },
}

export function titreEvenement(evenements: Evenement[], id?: string) {
  if (!id) return "Frais généraux"
  return evenements.find((e) => e.id === id)?.titre ?? "Événement supprimé"
}

export function dateCourte(date: string) {
  const d = new Date(date.slice(0, 10) + "T00:00:00")
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

export function Chips<K extends string>({
  value,
  onChange,
  items,
}: {
  value: K
  onChange: (k: K) => void
  items: { key: K; label: string; count?: number }[]
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-[var(--muted)] p-1">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          onClick={() => onChange(it.key)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12.5px] font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]",
            value === it.key && "bg-white text-[var(--ink)] shadow-sm"
          )}
        >
          {it.label}
          {it.count !== undefined && (
            <span
              className={cn(
                "rounded-md px-1.5 text-[10.5px]",
                value === it.key ? "bg-[var(--navy)] text-white" : "bg-white/70 text-[var(--ink-light)]"
              )}
            >
              {it.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-light)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-60 rounded-xl border border-[var(--line)] bg-white pr-3 pl-9 text-[13px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-light)] focus-visible:border-[var(--gold)] focus-visible:ring-4 focus-visible:ring-[var(--ring)]"
      />
    </div>
  )
}

/** Ligne de répartition : libellé, montant, part en %. */
export function BarRow({
  label,
  montant,
  part,
  barClassName = "bg-teal",
  suffix,
}: {
  label: ReactNode
  montant: string
  part: number
  barClassName?: string
  suffix?: ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-[13px]">
        <span className="truncate text-[var(--ink)]">{label}</span>
        <span className="shrink-0 font-semibold text-[var(--ink)]">
          {montant}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
        <div className={cn("h-full rounded-full", barClassName)} style={{ width: `${Math.min(100, Math.max(0, part))}%` }} />
      </div>
    </div>
  )
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 text-center text-[13px] text-[var(--ink-light)]">
        {children}
      </td>
    </tr>
  )
}

export const thClass =
  "h-11 px-4 text-left text-[10px] font-semibold tracking-[0.14em] whitespace-nowrap text-[var(--ink-light)] uppercase"
export const tdClass = "px-4 py-3 align-middle text-[13px] text-[var(--ink-soft)]"
