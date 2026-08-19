import type { LucideIcon } from "lucide-react"
import { DEMO_ACCOUNTS } from "@/data/portail-mock"
import { RolePill } from "@/components/portail/role-pill"
import type { DemoAccount, ModuleKey, Role } from "@/types/portail"
import { cn } from "@/lib/utils"

export interface ModuleDef {
  key: ModuleKey
  label: string
  icon: LucideIcon
  show: boolean
}

export function Sidebar({
  account,
  accountId,
  onAccountChange,
  roles,
  modules,
  view,
  onViewChange,
}: {
  account: DemoAccount
  accountId: string
  onAccountChange: (id: string) => void
  roles: Role[]
  modules: ModuleDef[]
  view: ModuleKey
  onViewChange: (key: ModuleKey) => void
}) {
  return (
    <div className="flex w-58 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pt-6 pb-3.5">
        <div className="font-heading text-lg font-semibold">Le Cahier</div>
        <div className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-white/60">
          PORTAIL CHORALE
        </div>
      </div>

      <div className="px-5 pb-3.5">
        <StaffLines />
      </div>

      <div className="flex-1 px-3 py-1.5">
        {modules.map((m) => (
          <button
            key={m.key}
            onClick={() => onViewChange(m.key)}
            className={cn(
              "mb-0.5 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-[13px] transition-colors",
              view === m.key
                ? "bg-sidebar-accent text-white"
                : "text-white/70 hover:bg-sidebar-accent/60 hover:text-white"
            )}
          >
            <m.icon size={15} />
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-sidebar-border px-5 py-4">
        <div className="mb-2 font-mono text-[10.5px] tracking-[0.1em] text-white/50 uppercase">
          Compte connecté (démo)
        </div>
        <select
          value={accountId}
          onChange={(e) => onAccountChange(e.target.value)}
          className="mb-2.5 w-full rounded-md border border-sidebar-border bg-plum-soft px-2.5 py-2 text-xs text-white outline-none"
        >
          {DEMO_ACCOUNTS.map((a) => (
            <option key={a.id} value={a.id} className="text-black">
              {a.nom}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1.5">
          {roles.map((r) => (
            <RolePill key={r} role={r} />
          ))}
        </div>
        <div className="sr-only">{account.nom}</div>
      </div>
    </div>
  )
}

function StaffLines() {
  return (
    <svg width="100%" height="18" className="block opacity-35">
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          y1={3 + i * 3.5}
          x2="100%"
          y2={3 + i * 3.5}
          stroke="var(--gold)"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}
