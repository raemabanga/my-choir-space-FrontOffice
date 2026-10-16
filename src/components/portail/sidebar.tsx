import { HelpCircle, LogOut, Settings, type LucideIcon } from "lucide-react"
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

export interface ModuleDef {
  key: ModuleKey
  label: string
  icon: LucideIcon
  show: boolean
  section?: string
}

function initialsOf(text: string) {
  return text
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function NavButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[rgba(229,238,252,0.72)] transition-all duration-200",
        "hover:bg-[var(--sidebar-accent)] hover:text-white",
        active &&
          "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--gold)_14%,transparent)]"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  )
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
  mobileOpen,
  onNavigate,
}: {
  account: DemoAccount
  accountId: string
  onAccountChange: (id: string) => void
  roles: Role[]
  modules: ModuleDef[]
  view: ModuleKey
  onViewChange: (key: ModuleKey) => void
  onLogout: () => void
  mobileOpen: boolean
  onNavigate: () => void
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

  const go = (key: ModuleKey) => {
    onViewChange(key)
    onNavigate()
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex h-screen print:hidden w-64 shrink-0 flex-col border-r border-[var(--sidebar-border)] bg-[var(--sidebar)] px-3 py-4 text-[var(--sidebar-foreground)] transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="mb-6 flex items-center gap-3 px-2.5 pt-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--gold)_16%,transparent)] text-sm font-semibold text-[var(--gold-soft)] ring-1 ring-[color-mix(in_srgb,var(--gold)_30%,transparent)]">
          {initialsOf(appName) || "LC"}
        </div>
        <div className="min-w-0">
          <div className="text-[0.75rem] font-medium tracking-[0.2em] text-[rgba(229,238,252,0.62)] uppercase">
            Espace chorale
          </div>
          <div className="truncate font-heading text-[1.6rem] leading-none tracking-[-0.06em] text-white">
            {appName}
          </div>
        </div>
      </div>

      <div className="mb-5 px-0.5">
        <div className="mb-1.5 px-2 text-[10px] font-medium tracking-[0.16em] text-[rgba(229,238,252,0.5)] uppercase">
          Compte de démonstration
        </div>
        <Select
          value={accountId}
          onValueChange={(v) => v && onAccountChange(v)}
          items={Object.fromEntries(DEMO_ACCOUNTS.map((a) => [a.id, a.nom]))}
        >
          <SelectTrigger
            aria-label="Changer de compte démo"
            className="h-10 w-full border-[var(--sidebar-border)] bg-[rgba(148,163,184,0.06)] text-[13px] text-white shadow-none hover:bg-[rgba(148,163,184,0.1)] [&_svg]:text-[rgba(229,238,252,0.7)]"
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

      <nav className="-mx-1 flex-1 space-y-5 overflow-y-auto px-1">
        {groups.map((group, i) => (
          <div key={group.section || i}>
            {group.section && (
              <div className="mb-1.5 px-3 text-[10px] font-medium tracking-[0.16em] text-[rgba(229,238,252,0.5)] uppercase">
                {group.section}
              </div>
            )}
            <div className="flex flex-col gap-1">
              {group.items.map((m) => (
                <NavButton
                  key={m.key}
                  active={view === m.key}
                  icon={m.icon}
                  label={m.label}
                  onClick={() => go(m.key)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-4 flex flex-col gap-1 border-t border-[var(--sidebar-border)] pt-3">
        <NavButton
          active={view === "parametres"}
          icon={Settings}
          label="Paramètres"
          onClick={() => go("parametres")}
        />
        <NavButton
          active={false}
          icon={HelpCircle}
          label="Assistance trésorerie"
          onClick={() => toast("Assistance trésorerie — bientôt disponible")}
        />
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[var(--sidebar-border)] bg-[rgba(148,163,184,0.06)] p-2.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--gold-soft)] text-[0.68rem] font-semibold text-[var(--navy)]">
          {initialsOf(account.nom)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-white">{account.nom}</div>
          <div className="truncate text-[11px] text-[rgba(229,238,252,0.68)]">
            {primaryRole ? ROLE_LABEL[primaryRole] : "Choriste"}
          </div>
        </div>
        <button
          type="button"
          aria-label="Se déconnecter"
          onClick={() => {
            onLogout()
            onNavigate()
          }}
          className="inline-flex size-8 items-center justify-center rounded-lg text-[rgba(229,238,252,0.8)] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  )
}
