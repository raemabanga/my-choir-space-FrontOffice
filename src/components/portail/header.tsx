import type { ReactNode } from "react"
import { Bell, ChevronRight, Plus, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { ModuleDef } from "@/components/portail/sidebar"
import { ROLE_LABEL } from "@/data/portail-mock"
import type { DemoAccount, ModuleKey, Perms, Role } from "@/types/portail"

const liturgicalVars = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  "--font-heading": "'EB Garamond', serif",
  "--ebene": "#271900",
} as React.CSSProperties

type HeaderContent = {
  eyebrow?: string
  title: string
  subtitle?: string
  badge?: string
}

function getHeaderContent(
  view: ModuleKey,
  perms: Perms,
  account: DemoAccount,
  roles: Role[]
): HeaderContent {
  const annee = new Date().getFullYear()
  switch (view) {
    case "accueil":
      return {
        eyebrow: "Console d'intendance",
        title: `Bonjour ${account.nom.split(" ")[0]}`,
        subtitle: `Connecté en tant que ${account.nom} — ${roles
          .map((r) => ROLE_LABEL[r])
          .join(" · ")}`,
        badge: `Exercice ${annee}–${annee + 1}`,
      }
    case "comptes":
      return {
        title: "Comptes & Rôles",
        subtitle: perms.comptesFull
          ? "Création, désactivation et attribution des rôles"
          : "Création et désactivation des comptes choriste et commissions",
      }
    case "evenements":
      return {
        title: "Événements",
        subtitle: "Création, suppression et suivi budgétaire par événement",
      }
    case "cotisations":
      return {
        title: "Cotisations",
        subtitle: "Cotisation statutaire (carte à cocher) et cotisations événementielles",
      }
    case "paiements":
      return {
        title: "Paiements & Reçus",
        subtitle: "Enregistrement des paiements et génération automatique des reçus",
      }
    case "budget":
      return {
        title: "Budget",
        subtitle: "Vue consolidée des recettes et dépenses de l'association",
      }
    case "chants":
      return {
        title: "Répertoire de chants",
        subtitle: perms.chantsGerer
          ? "Ajout, modification et validation de suppression"
          : "Consultation du répertoire",
      }
    case "rapports":
      return {
        title: "Rapports",
        subtitle: "Export des données budgétaires et de cotisation",
      }
    case "parametres":
      return {
        title: "Paramètres",
        subtitle: "Personnalisation de l'apparence du portail",
      }
  }
}

function HeaderActions({
  view,
  perms,
  onNouveauCompte,
  onNouvelEvenement,
  onNouveauPaiement,
  onNouveauChant,
}: {
  view: ModuleKey
  perms: Perms
  onNouveauCompte: () => void
  onNouvelEvenement: () => void
  onNouveauPaiement: () => void
  onNouveauChant: () => void
}): ReactNode {
  switch (view) {
    case "accueil":
      return (
        <>
          {perms.paiements && (
            <Button size="sm" onClick={onNouveauPaiement}>
              <Plus size={14} /> Nouveau versement
            </Button>
          )}
          {perms.chantsGerer && (
            <Button size="sm" variant="outline" onClick={onNouveauChant}>
              <Plus size={14} /> Partitions
            </Button>
          )}
          {perms.evenements && (
            <Button size="sm" variant="outline" onClick={onNouvelEvenement}>
              <Plus size={14} /> Événement
            </Button>
          )}
        </>
      )
    case "comptes":
      return (
        <Button size="sm" onClick={onNouveauCompte}>
          <UserPlus size={14} /> Créer un compte
        </Button>
      )
    case "evenements":
      return (
        <Button size="sm" onClick={onNouvelEvenement}>
          <Plus size={14} /> Nouvel événement
        </Button>
      )
    case "paiements":
      return (
        <Button size="sm" onClick={onNouveauPaiement}>
          <Plus size={14} /> Enregistrer un paiement
        </Button>
      )
    case "chants":
      return perms.chantsGerer ? (
        <Button size="sm" onClick={onNouveauChant}>
          <Plus size={14} /> Ajouter un chant
        </Button>
      ) : null
    default:
      return null
  }
}

export function Header({
  view,
  modules,
  account,
  roles,
  perms,
  onNouveauCompte,
  onNouvelEvenement,
  onNouveauPaiement,
  onNouveauChant,
}: {
  view: ModuleKey
  modules: ModuleDef[]
  account: DemoAccount
  roles: Role[]
  perms: Perms
  onNouveauCompte: () => void
  onNouvelEvenement: () => void
  onNouveauPaiement: () => void
  onNouveauChant: () => void
}) {
  const annee = new Date().getFullYear()
  const content = getHeaderContent(view, perms, account, roles)
  const moduleLabel = modules.find((m) => m.key === view)?.label ?? content.title
  const crumbEnd = view === "accueil" ? `Exercice ${annee}` : moduleLabel

  const initials = account.nom
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div
      style={liturgicalVars}
      className="sticky top-0 z-20 border-b border-[rgba(198,146,45,0.14)] bg-[rgba(255,252,246,0.92)] shadow-[0_1px_0_rgba(198,146,45,0.1)] backdrop-blur-md"
    >
      <div className="flex flex-wrap items-center gap-2 px-8.5 pt-2.5 pb-1.5">
        <div className="relative w-full max-w-56">
          <Search
            size={12.5}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Rechercher choriste, chant..."
            className="h-7 rounded-full border-transparent bg-muted/50 pl-7.5 text-[12.5px] shadow-none transition-colors focus-visible:border-[var(--gold)]/40 focus-visible:bg-white"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-muted/50 py-0.5 pr-2.5 pl-2 font-mono text-[9.5px] tracking-[0.06em] text-muted-foreground uppercase">
          <span>{account.nom}</span>
          <ChevronRight size={10} className="opacity-50" />
          <span className="font-semibold text-[var(--gold-strong)]">{crumbEnd}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <HeaderActions
            view={view}
            perms={perms}
            onNouveauCompte={onNouveauCompte}
            onNouvelEvenement={onNouvelEvenement}
            onNouveauPaiement={onNouveauPaiement}
            onNouveauChant={onNouveauChant}
          />
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => toast("Notifications — bientôt disponible")}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell size={14} />
          </button>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-strong)] font-heading text-[11px] font-semibold text-white shadow-[0_2px_8px_rgba(198,146,45,0.35)] ring-2 ring-white">
            {initials}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-2 px-8.5 pb-2">
        <div>
          {content.eyebrow && (
            <div className="mb-0.5 font-mono text-[9.5px] tracking-[0.12em] text-[var(--gold-strong)] uppercase">
              {content.eyebrow}
            </div>
          )}
          <h1 className="font-heading text-[18px] leading-tight font-semibold text-foreground">
            {content.title}
          </h1>
          {content.subtitle && (
            <div className="mt-0.5 text-[11.5px] text-muted-foreground">{content.subtitle}</div>
          )}
        </div>
        {content.badge && (
          <Badge className="border-none bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold-strong)]/10 font-mono text-[9.5px] font-semibold tracking-[0.04em] text-[var(--gold-strong)] normal-case">
            {content.badge}
          </Badge>
        )}
      </div>
    </div>
  )
}

