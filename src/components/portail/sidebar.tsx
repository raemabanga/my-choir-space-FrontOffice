import { HelpCircle, LogOut, Music2, Settings, type LucideIcon } from "lucide-react"
import { toast } from "sonner"
import { DEMO_ACCOUNTS, ROLE_LABEL } from "@/data/portail-mock"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppSettings } from "@/store/app-settings"
import type { DemoAccount, ModuleKey, Role } from "@/types/portail"
import { cn } from "@/lib/utils"

const liturgicalVars = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  "--font-heading": "'EB Garamond', serif",
  "--ebene": "#271900",
} as React.CSSProperties

export interface ModuleDef {
  key: ModuleKey
  label: string
  icon: LucideIcon
  show: boolean
  section?: string
}

export function Sidebar({
  account,
  accountId,
  onAccountChange,
  roles,
  modules,
  view,
  onViewChange,
  onLogout,
}: {
  account: DemoAccount
  accountId: string
  onAccountChange: (id: string) => void
  roles: Role[]
  modules: ModuleDef[]
  view: ModuleKey
  onViewChange: (key: ModuleKey) => void
  onLogout: () => void
}) {
  const primaryRole = roles.find((r) => r !== "choriste") ?? roles[0]
  const appName = useAppSettings((s) => s.appName)

  const groups = modules.reduce<{ section: string; items: ModuleDef[] }[]>((acc, m) => {
    const section = m.section ?? ""
    const last = acc[acc.length - 1]
    if (last && last.section === section) {
      last.items.push(m)
    } else {
      acc.push({ section, items: [m] })
    }
    return acc
  }, [])

  return (
    <div
      style={liturgicalVars}
      className="flex w-64 shrink-0 flex-col justify-between border-r border-[rgba(198,146,45,0.14)] bg-[rgba(255,252,246,0.78)] text-[var(--ink)] shadow-[1px_0_0_rgba(198,146,45,0.06)]"
    >
      <div className="px-4 pt-5">
        <div className="mb-5 flex items-center gap-3 border-b border-[rgba(198,146,45,0.12)] px-1 pb-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--ebene)] to-[var(--ebene)]/80 shadow-[0_4px_12px_rgba(39,25,0,0.25)] ring-1 ring-[var(--gold)]/25">
            <Music2 size={17} className="text-[var(--gold)]" />
          </div>
          <div className="overflow-hidden">
            <div className="font-heading text-[1.5rem] leading-none tracking-wide text-[var(--ink)]">
              {appName}
            </div>
            <div className="mt-1 truncate font-mono text-[10px] tracking-[0.1em] text-[var(--muted-foreground)] uppercase">
              Espace chorale
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-[rgba(198,146,45,0.22)] bg-white/60 p-3 shadow-[0_1px_2px_rgba(198,146,45,0.06)]">
          <div className="mb-2 flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/15 font-heading text-[12px] font-semibold text-[var(--gold-strong)]">
              {account.nom
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-semibold text-[var(--ink)]">
                {account.nom}
              </div>
              <div className="flex items-center gap-1 text-[10.5px] text-[var(--muted-foreground)]">
                <span className="size-1.5 shrink-0 rounded-full bg-teal" />
                <span className="truncate font-mono tracking-[0.04em] uppercase">
                  {primaryRole ? ROLE_LABEL[primaryRole] : "Choriste"}
                </span>
              </div>
            </div>
          </div>
          <Select
            value={accountId}
            onValueChange={(v) => v && onAccountChange(v)}
            items={Object.fromEntries(DEMO_ACCOUNTS.map((a) => [a.id, a.nom]))}
          >
            <SelectTrigger
              aria-label="Changer de compte démo"
              className="w-full rounded-lg border-[rgba(198,146,45,0.2)] bg-white/80 text-[11px] text-[var(--foreground)] focus-visible:ring-[var(--gold)]/40"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEMO_ACCOUNTS.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <nav className="space-y-4">
          {groups.map((group, i) => (
            <div key={group.section || i}>
              {group.section && (
                <div className="mb-1.5 px-3 font-mono text-[10px] font-medium tracking-[0.12em] text-[var(--muted-foreground)] uppercase">
                  {group.section}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => onViewChange(m.key)}
                    className={cn(
                      "relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13.5px] transition-all duration-150 after:absolute after:top-1.5 after:bottom-1.5 after:left-0 after:w-[3px] after:rounded-full after:content-['']",
                      view === m.key
                        ? "bg-[var(--gold)]/12 font-semibold text-[var(--ink)] after:bg-[var(--gold)]"
                        : "text-[var(--muted-foreground)] after:bg-transparent hover:bg-[rgba(198,146,45,0.06)] hover:text-[var(--ink)]"
                    )}
                  >
                    <m.icon
                      size={15}
                      className={view === m.key ? "text-[var(--gold-strong)]" : ""}
                    />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-[rgba(198,146,45,0.12)] px-4 py-4">
        <div className="mb-1 space-y-0.5">
          <button
            type="button"
            onClick={() => onViewChange("parametres")}
            className={cn(
              "relative flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] transition-all duration-150 after:absolute after:top-1 after:bottom-1 after:left-0 after:w-[3px] after:rounded-full after:content-['']",
              view === "parametres"
                ? "bg-[var(--gold)]/12 font-semibold text-[var(--ink)] after:bg-[var(--gold)]"
                : "text-[var(--muted-foreground)] after:bg-transparent hover:bg-[rgba(198,146,45,0.06)] hover:text-[var(--ink)]"
            )}
          >
            <Settings
              size={15}
              className={view === "parametres" ? "text-[var(--gold-strong)]" : ""}
            />
            <span>Paramètres</span>
          </button>
          <button
            type="button"
            onClick={() => toast("Assistance trésorerie — bientôt disponible")}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] text-[var(--muted-foreground)] transition-colors hover:bg-[rgba(198,146,45,0.06)] hover:text-[var(--ink)]"
          >
            <HelpCircle size={15} />
            <span>Assistance Trésorerie</span>
          </button>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(198,146,45,0.22)] bg-white/50 py-2 text-[12px] font-medium text-[var(--muted-foreground)] transition-all hover:border-[rgba(198,146,45,0.35)] hover:bg-white hover:text-[var(--ink)] active:scale-[0.98]"
        >
          <LogOut size={14} />
          <span>Clôturer la séance</span>
        </button>
      </div>
    </div>
  )
}
