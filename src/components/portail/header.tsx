import type { ReactNode } from "react"
import { Bell, Menu, Plus, Search, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ROLE_LABEL } from "@/data/portail-mock"
import type { DemoAccount, ModuleKey, Perms, Role } from "@/types/portail"

type HeaderContent = {
  eyebrow?: string
  title: string
  subtitle?: string
  badge?: string
}

function getHeaderContent(
  view: ModuleKey,
  subView: string | undefined,
  perms: Perms,
  account: DemoAccount,
  roles: Role[]
): HeaderContent {
  if (view === "evenements" && subView) {
    return {
      eyebrow: "Événements",
      title: "Détail de l’événement",
      subtitle: "Cotisations des choristes, budget et dépenses",
    }
  }
  if (view === "paiements" && subView) {
    return {
      eyebrow: "Paiements & Reçus",
      title: "Détail du paiement",
      subtitle: "Informations du versement et reçu imprimable",
    }
  }
  if (view === "chants" && subView === "nouveau") {
    return {
      eyebrow: "Répertoire de chants",
      title: "Nouveau chant",
      subtitle: "Renseignez la fiche du chant et saisissez ses paroles",
    }
  }
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
        subtitle: "Suivi des mensualités statutaires et des cotisations par événement",
      }
    case "paiements":
      return {
        title: "Paiements & Reçus",
        subtitle: "Enregistrement des paiements et génération automatique des reçus",
      }
    case "budget":
      return {
        title: "Budget",
        subtitle: "Dépenses, recettes, justificatifs et solde de la chorale",
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
  subView,
  perms,
  onNouveauCompte,
  onNouvelEvenement,
  onNouveauPaiement,
  onNouveauChant,
}: {
  view: ModuleKey
  subView: string | undefined
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
      return subView ? null : (
        <Button size="sm" onClick={onNouvelEvenement}>
          <Plus size={14} /> Nouvel événement
        </Button>
      )
    case "paiements":
      return subView ? null : (
        <Button size="sm" onClick={onNouveauPaiement}>
          <Plus size={14} /> Enregistrer un paiement
        </Button>
      )
    case "chants":
      return perms.chantsGerer && subView !== "nouveau" ? (
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
  subView,
  account,
  roles,
  perms,
  onMenuClick,
  onNouveauCompte,
  onNouvelEvenement,
  onNouveauPaiement,
  onNouveauChant,
}: {
  view: ModuleKey
  subView?: string
  account: DemoAccount
  roles: Role[]
  perms: Perms
  onMenuClick: () => void
  onNouveauCompte: () => void
  onNouvelEvenement: () => void
  onNouveauPaiement: () => void
  onNouveauChant: () => void
}) {
  const content = getHeaderContent(view, subView, perms, account, roles)

  return (
    <header className="print:hidden sticky top-0 z-20 flex min-h-20 flex-wrap items-center gap-3 border-b border-[var(--line)] bg-white px-4 py-3 sm:px-6 xl:px-8">
      <button
        type="button"
        aria-label="Ouvrir la navigation"
        onClick={onMenuClick}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-[var(--ink-soft)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--ink)] focus-visible:ring-4 focus-visible:ring-[var(--ring)] focus-visible:outline-none lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-[0.18em] text-[var(--ink-light)] uppercase">
          {content.eyebrow ?? "Espace chorale"}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h2 className="truncate font-heading text-2xl leading-tight tracking-[-0.05em] text-[var(--ink)] sm:text-[2rem]">
            {content.title}
          </h2>
          {content.badge && <Badge variant="outline">{content.badge}</Badge>}
        </div>
        {content.subtitle && (
          <p className="mt-0.5 hidden truncate text-sm text-[var(--ink-soft)] sm:block">
            {content.subtitle}
          </p>
        )}
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <div className="relative hidden w-56 xl:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-light)]" />
          <Input placeholder="Rechercher choriste, chant..." className="h-9 pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <HeaderActions
            view={view}
            subView={subView}
            perms={perms}
            onNouveauCompte={onNouveauCompte}
            onNouvelEvenement={onNouvelEvenement}
            onNouveauPaiement={onNouveauPaiement}
            onNouveauChant={onNouveauChant}
          />
        </div>
        <button
          type="button"
          aria-label="Notifications"
          onClick={() => toast("Notifications — bientôt disponible")}
          className="ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--ink-soft)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--ink)] sm:ml-0"
        >
          <Bell className="size-4" />
        </button>
      </div>
    </header>
  )
}
