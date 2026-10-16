import { useSearchParams } from "react-router-dom"
import { CalendarDays, IdCard } from "lucide-react"

import { CotisationsEvenements } from "@/components/portail/cotisations/cotisations-evenements"
import { CotisationsStatutaires } from "@/components/portail/cotisations/cotisations-statutaires"
import { ROLE_LABEL } from "@/data/portail-mock"
import { cn } from "@/lib/utils"
import { useAppSettings } from "@/store/app-settings"
import type { Compte, Evenement, StatutMois, Statutaire } from "@/types/portail"

type Vue = "statutaires" | "evenements"

export function CotisationsModule({
  statutaire,
  evenements,
  comptes,
  choristes,
  onPaiement,
  onChangerStatut,
  onVoirEvenement,
  canPaiement,
}: {
  statutaire: Statutaire
  evenements: Evenement[]
  comptes: Compte[]
  choristes: string[]
  onPaiement: (pre: { choriste?: string; eventId?: string; type?: string }) => void
  onChangerStatut: (annee: number, choriste: string, mois: number, statut: StatutMois) => void
  onVoirEvenement: (id: string) => void
  canPaiement: boolean
}) {
  const appName = useAppSettings((s) => s.appName)
  const [params, setParams] = useSearchParams()
  const vue: Vue = params.get("vue") === "evenements" ? "evenements" : "statutaires"

  const roleDe = (nom: string) => {
    const compte = comptes.find((c) => c.nom === nom)
    const role = compte?.roles.find((r) => r !== "choriste")
    if (compte?.statut === "désactivé") return "Membre · compte désactivé"
    return role ? ROLE_LABEL[role] : "Membre"
  }

  const tabs = (
    <div className="inline-flex gap-1 rounded-xl border border-[var(--line)] bg-white p-1">
      {(
        [
          { key: "statutaires", label: "Statutaires", icon: IdCard },
          { key: "evenements", label: "Événementielles", icon: CalendarDays },
        ] as const
      ).map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => setParams(key === "statutaires" ? {} : { vue: key }, { replace: true })}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-[13px] font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]",
            vue === key && "bg-[var(--navy)] text-white hover:text-white"
          )}
        >
          <Icon className="size-4" /> {label}
        </button>
      ))}
    </div>
  )

  return vue === "statutaires" ? (
    <CotisationsStatutaires
      appName={appName}
      statutaire={statutaire}
      choristes={choristes}
      roleDe={roleDe}
      canPaiement={canPaiement}
      onPaiement={onPaiement}
      onChangerStatut={onChangerStatut}
      tabs={tabs}
    />
  ) : (
    <CotisationsEvenements
      appName={appName}
      evenements={evenements}
      choristes={choristes}
      roleDe={roleDe}
      canPaiement={canPaiement}
      onPaiement={onPaiement}
      onVoirEvenement={onVoirEvenement}
      tabs={tabs}
    />
  )
}
