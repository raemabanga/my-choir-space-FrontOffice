import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Users2,
  CalendarDays,
  Coins,
  Receipt,
  Wallet,
  Music2,
  FileDown,
  LayoutGrid,
} from "lucide-react"

import { Sidebar, type ModuleDef } from "@/components/portail/sidebar"
import { Accueil } from "@/components/portail/modules/accueil"
import { ComptesModule } from "@/components/portail/modules/comptes"
import { EvenementsModule } from "@/components/portail/modules/evenements"
import { CotisationsModule } from "@/components/portail/modules/cotisations"
import { PaiementsModule } from "@/components/portail/modules/paiements"
import { BudgetModule } from "@/components/portail/modules/budget"
import { ChantsModule } from "@/components/portail/modules/chants"
import { RapportsModule } from "@/components/portail/modules/rapports"
import { CompteFormModal } from "@/components/portail/modals/compte-form-modal"
import { EvenementFormModal } from "@/components/portail/modals/evenement-form-modal"
import { DepenseFormModal } from "@/components/portail/modals/depense-form-modal"
import { ChantFormModal } from "@/components/portail/modals/chant-form-modal"
import { PaiementFormModal } from "@/components/portail/modals/paiement-form-modal"

import {
  CHORISTES,
  DEMO_ACCOUNTS,
  initialChants,
  initialComptes,
  initialEvenements,
  initialPaiements,
  initialStatutaire,
} from "@/data/portail-mock"
import type { ModalState, ModuleKey, Role } from "@/types/portail"

function nowStr() {
  const d = new Date()
  return d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 5)
}

export default function PortailChorale() {
  const [accountId, setAccountId] = useState("u1")
  const account = DEMO_ACCOUNTS.find((a) => a.id === accountId)!
  const roles = account.roles
  const has = (r: Role) => roles.includes(r)

  const perms = {
    comptes: has("admin_chorale") || has("secretaire"),
    comptesFull: has("admin_chorale"),
    evenements: has("bureau") || has("tresorier"),
    cotisations: has("bureau") || has("tresorier"),
    paiements: has("tresorier"),
    budget: has("bureau") || has("tresorier"),
    chantsGerer: has("bureau"),
    chantsVoir: has("bureau") || has("tresorier"),
    rapports: has("admin_chorale") || has("bureau") || has("tresorier"),
  }

  const allModules: ModuleDef[] = [
    { key: "accueil", label: "Accueil", icon: LayoutGrid, show: true },
    { key: "comptes", label: "Comptes & Rôles", icon: Users2, show: perms.comptes },
    { key: "evenements", label: "Événements", icon: CalendarDays, show: perms.evenements },
    { key: "cotisations", label: "Cotisations", icon: Coins, show: perms.cotisations },
    { key: "paiements", label: "Paiements & Reçus", icon: Receipt, show: perms.paiements },
    { key: "budget", label: "Budget", icon: Wallet, show: perms.budget },
    { key: "chants", label: "Répertoire de chants", icon: Music2, show: perms.chantsVoir },
    { key: "rapports", label: "Rapports", icon: FileDown, show: perms.rapports },
  ]
  const modules = allModules.filter((m) => m.show)

  const [view, setView] = useState<ModuleKey>("accueil")
  useEffect(() => {
    if (!modules.find((m) => m.key === view)) setView("accueil")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  const [comptes, setComptes] = useState(initialComptes)
  const [evenements, setEvenements] = useState(initialEvenements)
  const [statutaire, setStatutaire] = useState(initialStatutaire)
  const [chants, setChants] = useState(initialChants)
  const [paiements, setPaiements] = useState(initialPaiements)
  const [modal, setModal] = useState<ModalState>(null)

  const creerCompte = (form: { nom: string; email: string; role: Role }) => {
    const id = "cp" + (comptes.length + 1)
    setComptes((c) => [
      ...c,
      {
        id,
        nom: form.nom,
        email: form.email,
        roles: [form.role, "choriste"],
        statut: "actif",
        historique: [{ role: form.role, debut: nowStr().slice(0, 10), fin: null, auteur: account.nom }],
      },
    ])
    toast.success(`Compte créé — ${form.nom}`)
    setModal(null)
  }

  const toggleCompteStatut = (id: string) => {
    const c = comptes.find((x) => x.id === id)
    if (!c) return
    setComptes((cs) =>
      cs.map((x) => (x.id === id ? { ...x, statut: x.statut === "actif" ? "désactivé" : "actif" } : x))
    )
    toast.success(`${c.statut === "actif" ? "Compte désactivé" : "Compte réactivé"} — ${c.nom}`)
  }

  const revoquerRole = (id: string, role: Role) => {
    setComptes((cs) =>
      cs.map((c) =>
        c.id === id
          ? {
              ...c,
              roles: Array.from(
                new Set(c.roles.filter((r) => r !== role && r !== "secretaire").concat(["choriste"]))
              ),
            }
          : c
      )
    )
    toast.success("Rôle révoqué — retour au statut Choriste")
  }

  const creerEvenement = (form: { titre: string; date: string; type: string; budget: string; cotisation: string }) => {
    setEvenements((e) => [
      ...e,
      {
        id: "ev" + (e.length + 1),
        titre: form.titre,
        date: form.date,
        type: form.type,
        budgetPrevisionnel: Number(form.budget) || 0,
        cotisation: { montant: Number(form.cotisation) || 0, collecte: 0, attendu: CHORISTES.length },
        depenses: [],
      },
    ])
    toast.success(`Événement créé — ${form.titre}`)
    setModal(null)
  }

  const supprimerEvenement = (id: string) => {
    setEvenements((e) => e.filter((x) => x.id !== id))
    toast.success("Événement supprimé")
  }

  const enregistrerDepense = (evId: string, libelle: string, montant: string) => {
    setEvenements((es) =>
      es.map((e) =>
        e.id === evId ? { ...e, depenses: [...e.depenses, { libelle, montant: Number(montant), valide: false }] } : e
      )
    )
    toast.success("Dépense enregistrée — en attente de validation")
  }

  const validerDepense = (evId: string, idx: number) => {
    setEvenements((es) =>
      es.map((e) =>
        e.id === evId
          ? { ...e, depenses: e.depenses.map((d, i) => (i === idx ? { ...d, valide: true } : d)) }
          : e
      )
    )
    toast.success("Dépense validée")
  }

  const enregistrerPaiement = (form: {
    choriste: string
    montant: string
    mois?: number
    eventId?: string
    type: string
  }) => {
    const recu = "RCU-2026-" + String(1000 + paiements.length).slice(-4)
    setPaiements((p) => [
      {
        id: "pa" + (p.length + 1),
        date: nowStr(),
        choriste: form.choriste,
        type: form.type,
        montant: Number(form.montant),
        recu,
        auteur: account.nom,
      },
      ...p,
    ])
    if (form.mois !== undefined) {
      setStatutaire((s) => ({
        ...s,
        suivis: {
          ...s.suivis,
          [form.choriste]: s.suivis[form.choriste].map((v, i) => (i === form.mois ? 1 : v)),
        },
      }))
    } else if (form.eventId) {
      setEvenements((es) =>
        es.map((e) =>
          e.id === form.eventId
            ? { ...e, cotisation: { ...e.cotisation, collecte: e.cotisation.collecte + Number(form.montant) } }
            : e
        )
      )
    }
    toast.success(`Paiement enregistré — reçu ${recu} généré`)
    setModal(null)
  }

  const ajouterChant = (form: { titre: string; compositeur: string; tonalite: string; categorie: string }) => {
    setChants((c) => [...c, { id: "ch" + (c.length + 1), ...form }])
    toast.success(`Chant ajouté — ${form.titre}`)
    setModal(null)
  }

  const supprimerChant = (id: string) => {
    setChants((c) => c.filter((x) => x.id !== id))
    toast.success("Chant retiré du répertoire")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        account={account}
        accountId={accountId}
        onAccountChange={setAccountId}
        roles={roles}
        modules={modules}
        view={view}
        onViewChange={setView}
      />

      <div className="flex-1 overflow-y-auto px-8.5 py-7.5 pb-15">
        {view === "accueil" && (
          <Accueil account={account} roles={roles} evenements={evenements} comptes={comptes} />
        )}
        {view === "comptes" && perms.comptes && (
          <ComptesModule
            comptes={comptes}
            full={perms.comptesFull}
            onCreer={() => setModal({ type: "compte" })}
            onToggle={toggleCompteStatut}
            onRevoquer={revoquerRole}
          />
        )}
        {view === "evenements" && perms.evenements && (
          <EvenementsModule
            evenements={evenements}
            onCreer={() => setModal({ type: "evenement" })}
            onSupprimer={supprimerEvenement}
            onDepense={(evId) => setModal({ type: "depense", evId })}
            onValiderDepense={validerDepense}
          />
        )}
        {view === "cotisations" && perms.cotisations && (
          <CotisationsModule
            statutaire={statutaire}
            evenements={evenements}
            onPaiement={(pre) => setModal({ type: "paiement", pre })}
            canPaiement={perms.paiements}
          />
        )}
        {view === "paiements" && perms.paiements && (
          <PaiementsModule paiements={paiements} onNouveau={() => setModal({ type: "paiement", pre: {} })} />
        )}
        {view === "budget" && perms.budget && <BudgetModule evenements={evenements} />}
        {view === "chants" && perms.chantsVoir && (
          <ChantsModule
            chants={chants}
            peutGerer={perms.chantsGerer}
            onAjouter={() => setModal({ type: "chant" })}
            onSupprimer={supprimerChant}
          />
        )}
        {view === "rapports" && perms.rapports && (
          <RapportsModule onExport={() => toast.success("Rapport exporté (PDF)")} />
        )}
      </div>

      {modal?.type === "compte" && (
        <CompteFormModal onClose={() => setModal(null)} onCreer={creerCompte} full={perms.comptesFull} />
      )}
      {modal?.type === "evenement" && (
        <EvenementFormModal onClose={() => setModal(null)} onCreer={creerEvenement} />
      )}
      {modal?.type === "depense" && (
        <DepenseFormModal
          onClose={() => setModal(null)}
          onValider={(l, m) => {
            enregistrerDepense(modal.evId, l, m)
            setModal(null)
          }}
        />
      )}
      {modal?.type === "chant" && <ChantFormModal onClose={() => setModal(null)} onAjouter={ajouterChant} />}
      {modal?.type === "paiement" && (
        <PaiementFormModal
          onClose={() => setModal(null)}
          onValider={enregistrerPaiement}
          evenements={evenements}
          pre={modal.pre}
        />
      )}
    </div>
  )
}
