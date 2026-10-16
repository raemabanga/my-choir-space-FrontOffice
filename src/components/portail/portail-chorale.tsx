import { useEffect, useMemo, useState } from "react"
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"
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
import { Header } from "@/components/portail/header"
import { Accueil } from "@/components/portail/modules/accueil"
import { ComptesModule } from "@/components/portail/modules/comptes"
import { EvenementsModule } from "@/components/portail/modules/evenements"
import { CotisationsModule } from "@/components/portail/modules/cotisations"
import { PaiementsModule } from "@/components/portail/modules/paiements"
import { BudgetModule } from "@/components/portail/modules/budget"
import { PaiementDetailPage } from "@/components/portail/modules/paiement-detail"
import { EvenementDetailPage } from "@/components/portail/modules/evenement-detail"
import { ChantsModule } from "@/components/portail/modules/chants"
import { ChantNouveauPage, type ChantForm } from "@/components/portail/modules/chant-nouveau"
import { RapportsModule } from "@/components/portail/modules/rapports"
import { ParametresModule } from "@/components/portail/modules/parametres"
import { CompteFormModal } from "@/components/portail/modals/compte-form-modal"
import { AttribuerRoleModal } from "@/components/portail/modals/attribuer-role-modal"
import { RevoquerRoleModal } from "@/components/portail/modals/revoquer-role-modal"
import { DesactiverCompteModal } from "@/components/portail/modals/desactiver-compte-modal"
import { EvenementFormModal } from "@/components/portail/modals/evenement-form-modal"
import { DepenseFormModal, type DepenseForm } from "@/components/portail/modals/depense-form-modal"
import { DepenseRejetModal } from "@/components/portail/modals/depense-rejet-modal"
import { RecetteFormModal, type RecetteForm } from "@/components/portail/modals/recette-form-modal"
import type { BudgetContext } from "@/components/portail/budget/budget-shared"
import { PaiementFormModal } from "@/components/portail/modals/paiement-form-modal"

import {
  CHORISTES,
  DEMO_ACCOUNTS,
  initialChants,
  initialComptes,
  initialDepenses,
  initialEvenements,
  initialPaiements,
  initialRecettes,
  initialStatutaire,
  TYPES_EVENEMENT,
} from "@/data/portail-mock"
import { anneeCourante, moisCourant } from "@/lib/cotisations"
import type { Justificatif, ModalState, ModuleKey, Perms, Role, StatutMois } from "@/types/portail"

function nowStr() {
  const d = new Date()
  return d.toISOString().slice(0, 10) + " " + d.toTimeString().slice(0, 5)
}

export default function PortailChorale({
  initialAccountId,
  onLogout,
}: {
  initialAccountId?: string
  onLogout: () => void
}) {
  const [accountId, setAccountId] = useState(initialAccountId ?? "u1")
  const account = DEMO_ACCOUNTS.find((a) => a.id === accountId)!
  const roles = account.roles
  const has = (r: Role) => roles.includes(r)

  const perms: Perms = {
    comptes: has("admin_chorale") || has("secretaire"),
    comptesFull: has("admin_chorale"),
    evenements: has("bureau") || has("tresorier"),
    cotisations: has("bureau") || has("tresorier"),
    paiements: has("tresorier"),
    budget: has("bureau") || has("tresorier"),
    depensesValider: has("bureau") || has("tresorier"),
    chantsGerer: has("bureau"),
    chantsVoir: has("bureau") || has("tresorier"),
    rapports: has("admin_chorale") || has("bureau") || has("tresorier"),
  }

  const allModules: ModuleDef[] = [
    { key: "accueil", label: "Accueil", icon: LayoutGrid, show: true, section: "Menu principal" },
    { key: "comptes", label: "Comptes & Rôles", icon: Users2, show: perms.comptes, section: "Gestion chorale" },
    { key: "evenements", label: "Événements", icon: CalendarDays, show: perms.evenements, section: "Gestion chorale" },
    { key: "cotisations", label: "Cotisations", icon: Coins, show: perms.cotisations, section: "Gestion chorale" },
    { key: "paiements", label: "Paiements & Reçus", icon: Receipt, show: perms.paiements, section: "Gestion chorale" },
    { key: "budget", label: "Budget", icon: Wallet, show: perms.budget, section: "Gestion chorale" },
    { key: "chants", label: "Répertoire de chants", icon: Music2, show: perms.chantsVoir, section: "Gestion chorale" },
    { key: "rapports", label: "Rapports", icon: FileDown, show: perms.rapports, section: "Gestion chorale" },
  ]
  const modules = allModules.filter((m) => m.show)

  const location = useLocation()
  const navigate = useNavigate()
  const segments = location.pathname.split("/").filter(Boolean)
  const view = (segments[0] || "accueil") as ModuleKey
  const subView = segments[1]
  const goTo = (key: ModuleKey) => navigate(`/${key}`)

  useEffect(() => {
    if (view !== "parametres" && !modules.find((m) => m.key === view)) {
      navigate("/accueil", { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, view])

  const [comptes, setComptes] = useState(initialComptes)
  const [evenements, setEvenements] = useState(initialEvenements)
  const [typesEvenement, setTypesEvenement] = useState(TYPES_EVENEMENT)
  const [statutaire, setStatutaire] = useState(initialStatutaire)
  const [chants, setChants] = useState(initialChants)
  const [paiements, setPaiements] = useState(initialPaiements)
  const [depenses, setDepenses] = useState(initialDepenses)
  const [recettes, setRecettes] = useState(initialRecettes)
  const [modal, setModal] = useState<ModalState>(null)

  // Tous les choristes : liste de base + tous les comptes (y compris créés depuis le portail)
  const choristes = useMemo(
    () => Array.from(new Set([...CHORISTES, ...comptes.map((c) => c.nom)])),
    [comptes]
  )
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const creerCompte = (form: { nom: string; telephone: string; email: string; role: Role }) => {
    const id = "cp" + (comptes.length + 1)
    setComptes((c) => [
      ...c,
      {
        id,
        nom: form.nom,
        telephone: form.telephone,
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
    setModal(null)
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
    setModal(null)
  }

  const attribuerRole = (id: string, role: Role) => {
    const c = comptes.find((x) => x.id === id)
    if (!c || c.roles.includes(role)) return
    setComptes((cs) =>
      cs.map((x) =>
        x.id === id
          ? {
              ...x,
              roles: [...x.roles, role],
              historique: [
                ...x.historique,
                { role, debut: nowStr().slice(0, 10), fin: null, auteur: account.nom },
              ],
            }
          : x
      )
    )
    toast.success(`Rôle attribué — ${c.nom}`)
    setModal(null)
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
        cotisation: { montant: Number(form.cotisation) || 0, collecte: 0, attendu: choristes.length, versements: {} },
      },
    ])
    toast.success(`Événement créé — ${form.titre}`)
    setModal(null)
  }

  const supprimerEvenement = (id: string) => {
    setEvenements((e) => e.filter((x) => x.id !== id))
    toast.success("Événement supprimé")
  }

  /* ---------- Budget : dépenses et recettes ---------- */

  const enregistrerDepense = (form: DepenseForm) => {
    setDepenses((ds) => [
      ...ds,
      { ...form, id: "dp" + Date.now(), statut: "en_attente", rapproche: false, saisiPar: account.nom },
    ])
    toast.success("Dépense enregistrée — en attente de validation")
    setModal(null)
  }

  const validerDepense = (id: string) => {
    const d = depenses.find((x) => x.id === id)
    if (!d) return
    if (d.saisiPar === account.nom) {
      toast.error("Vous ne pouvez pas valider une dépense que vous avez saisie.")
      return
    }
    setDepenses((ds) => ds.map((x) => (x.id === id ? { ...x, statut: "validee", traitePar: account.nom } : x)))
    toast.success(`Dépense validée — ${d.libelle}`)
  }

  const rejeterDepense = (id: string, motif: string) => {
    setDepenses((ds) =>
      ds.map((x) => (x.id === id ? { ...x, statut: "rejetee", motifRejet: motif, traitePar: account.nom } : x))
    )
    toast.success("Dépense rejetée")
    setModal(null)
  }

  const toggleRapproche = (id: string) => {
    setDepenses((ds) => ds.map((x) => (x.id === id ? { ...x, rapproche: !x.rapproche } : x)))
  }

  const joindreJustificatif = (id: string, justificatif: Justificatif) => {
    setDepenses((ds) => ds.map((x) => (x.id === id ? { ...x, justificatif } : x)))
    toast.success(`Justificatif joint — ${justificatif.nom}`)
  }

  const enregistrerRecette = (form: RecetteForm) => {
    setRecettes((rs) => [...rs, { ...form, id: "rc" + Date.now(), saisiPar: account.nom }])
    toast.success(`Recette enregistrée — ${form.libelle}`)
    setModal(null)
  }

  const budgetCtx: BudgetContext = {
    evenements,
    depenses,
    recettes,
    utilisateur: account.nom,
    peutSaisir: perms.budget,
    peutValider: perms.depensesValider,
    onNouvelleDepense: (evId) => setModal({ type: "depense", evId }),
    onNouvelleRecette: (eventId) => setModal({ type: "recette", eventId }),
    onValiderDepense: validerDepense,
    onRejeterDepense: (depense) => setModal({ type: "depense-rejet", depense }),
    onToggleRapproche: toggleRapproche,
    onJoindreJustificatif: joindreJustificatif,
    onAller: (chemin) => navigate(chemin),
  }

  const enregistrerPaiement = (form: {
    choriste: string
    montant: string
    mois?: number
    eventId?: string
    type: string
  }) => {
    const recu = "RCU-2026-" + String(1000 + paiements.length).slice(-4)
    const paiementId = "pa" + (paiements.length + 1)
    setPaiements((p) => [
      {
        id: paiementId,
        date: nowStr(),
        choriste: form.choriste,
        type: form.type,
        montant: Number(form.montant),
        recu,
        auteur: account.nom,
        eventId: form.eventId,
      },
      ...p,
    ])
    if (form.mois !== undefined) {
      const annee = anneeCourante()
      const statut: StatutMois = form.mois < moisCourant() ? 2 : 1
      setStatutaire((s) => {
        const exercice = s.exercices[annee] ?? {}
        const carte = exercice[form.choriste] ?? (Array(12).fill(0) as StatutMois[])
        return {
          ...s,
          exercices: {
            ...s.exercices,
            [annee]: {
              ...exercice,
              [form.choriste]: carte.map((v, i) => (i === form.mois ? statut : v)),
            },
          },
        }
      })
    } else if (form.eventId) {
      setEvenements((es) =>
        es.map((e) =>
          e.id === form.eventId
            ? {
                ...e,
                cotisation: {
                  ...e.cotisation,
                  collecte: e.cotisation.collecte + Number(form.montant),
                  versements: {
                    ...e.cotisation.versements,
                    [form.choriste]: (e.cotisation.versements[form.choriste] ?? 0) + Number(form.montant),
                  },
                },
              }
            : e
        )
      )
    }
    toast.success(`Paiement enregistré — reçu ${recu} généré`, {
      action: { label: "Voir le reçu", onClick: () => navigate(`/paiements/${paiementId}`) },
    })
    setModal(null)
  }

  const changerStatutMois = (annee: number, choriste: string, mois: number, statut: StatutMois) => {
    setStatutaire((s) => ({
      ...s,
      exercices: {
        ...s.exercices,
        [annee]: {
          ...s.exercices[annee],
          [choriste]: (s.exercices[annee]?.[choriste] ?? (Array(12).fill(0) as StatutMois[])).map((v, i) =>
            i === mois ? statut : v
          ),
        },
      },
    }))
  }

  const ajouterChant = (form: ChantForm) => {
    setChants((c) => [...c, { id: "ch" + (c.length + 1), ...form }])
    toast.success(`Chant ajouté — ${form.titre}`)
    navigate("/chants")
  }

  const supprimerChant = (id: string) => {
    setChants((c) => c.filter((x) => x.id !== id))
    toast.success("Chant retiré du répertoire")
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        <Sidebar
          account={account}
          accountId={accountId}
          onAccountChange={setAccountId}
          roles={roles}
          modules={modules}
          view={view}
          onViewChange={goTo}
          onLogout={onLogout}
          mobileOpen={mobileNavOpen}
          onNavigate={() => setMobileNavOpen(false)}
        />
        {mobileNavOpen && (
          <button
            type="button"
            aria-label="Fermer la navigation"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 z-30 bg-[rgba(15,23,42,0.35)] lg:hidden"
          />
        )}

        <main className="min-w-0 flex-1 bg-[var(--surface)] print:bg-white">
          <Header
            view={view}
            subView={subView}
            account={account}
            roles={roles}
            perms={perms}
            onMenuClick={() => setMobileNavOpen(true)}
            onNouveauCompte={() => setModal({ type: "compte" })}
            onNouvelEvenement={() => setModal({ type: "evenement" })}
            onNouveauPaiement={() => setModal({ type: "paiement", pre: {} })}
            onNouveauChant={() => navigate("/chants/nouveau")}
          />
          <div className="px-4 py-6 sm:px-6 xl:px-8 print:p-0">
            <Routes>
              <Route index element={<Navigate to="accueil" replace />} />
              <Route
                path="accueil"
                element={
                  <Accueil
                    evenements={evenements}
                    comptes={comptes}
                    statutaire={statutaire}
                    chants={chants}
                    paiements={paiements}
                    depenses={depenses}
                    utilisateur={account.nom}
                    perms={perms}
                    onNavigate={goTo}
                    onVoirPaiement={(id) => navigate(`/paiements/${id}`)}
                    onVoirEvenement={(id) => navigate(`/evenements/${id}`)}
                    onValiderDepense={validerDepense}
                  />
                }
              />
              <Route
                path="comptes"
                element={
                  perms.comptes ? (
                    <ComptesModule
                      comptes={comptes}
                      full={perms.comptesFull}
                      onDesactiver={(c) => setModal({ type: "compte-statut", compte: c })}
                      onRevoquerDemande={(c) => setModal({ type: "compte-revoquer", compte: c })}
                      onAttribuerRole={(c) => setModal({ type: "compte-role", compte: c })}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="evenements"
                element={
                  perms.evenements ? (
                    <EvenementsModule
                      evenements={evenements}
                      depenses={depenses}
                      recettes={recettes}
                      onVoir={(id) => navigate(`/evenements/${id}`)}
                      onSupprimer={supprimerEvenement}
                      onDepense={(evId) => setModal({ type: "depense", evId })}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="evenements/:id"
                element={
                  perms.evenements ? (
                    <EvenementDetailPage
                      ctx={budgetCtx}
                      evenements={evenements}
                      paiements={paiements}
                      choristes={choristes}
                      peutEncaisser={perms.paiements}
                      onRetour={() => navigate("/evenements")}
                      onSupprimer={(id) => {
                        supprimerEvenement(id)
                        navigate("/evenements")
                      }}
                      onEncaisser={(pre) => setModal({ type: "paiement", pre })}
                      onVoirPaiement={(id) => navigate(`/paiements/${id}`)}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="cotisations"
                element={
                  perms.cotisations ? (
                    <CotisationsModule
                      statutaire={statutaire}
                      evenements={evenements}
                      comptes={comptes}
                      choristes={choristes}
                      onChangerStatut={changerStatutMois}
                      onVoirEvenement={(id) => navigate(`/evenements/${id}`)}
                      onPaiement={(pre) => setModal({ type: "paiement", pre })}
                      canPaiement={perms.paiements}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="paiements"
                element={
                  perms.paiements ? (
                    <PaiementsModule
                      paiements={paiements}
                      onVoir={(id) => navigate(`/paiements/${id}`)}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="paiements/:id"
                element={
                  perms.paiements ? (
                    <PaiementDetailPage
                      paiements={paiements}
                      comptes={comptes}
                      onRetour={() => navigate("/paiements")}
                      onVoir={(id) => navigate(`/paiements/${id}`)}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="budget"
                element={
                  perms.budget ? (
                    <BudgetModule
                      ctx={budgetCtx}
                      statutaire={statutaire}
                      choristes={choristes}
                      paiements={paiements}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="chants"
                element={
                  perms.chantsVoir ? (
                    <ChantsModule
                      chants={chants}
                      peutGerer={perms.chantsGerer}
                      onSupprimer={supprimerChant}
                    />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route
                path="chants/nouveau"
                element={
                  perms.chantsGerer ? (
                    <ChantNouveauPage
                      onAjouter={ajouterChant}
                      onAnnuler={() => navigate("/chants")}
                    />
                  ) : (
                    <Navigate to="/chants" replace />
                  )
                }
              />
              <Route
                path="rapports"
                element={
                  perms.rapports ? (
                    <RapportsModule onExport={() => toast.success("Rapport exporté (PDF)")} />
                  ) : (
                    <Navigate to="/accueil" replace />
                  )
                }
              />
              <Route path="parametres" element={<ParametresModule />} />
              <Route path="*" element={<Navigate to="/accueil" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {modal?.type === "compte" && (
        <CompteFormModal
          comptes={comptes}
          onClose={() => setModal(null)}
          onCreer={creerCompte}
          full={perms.comptesFull}
        />
      )}
      {modal?.type === "compte-role" && (
        <AttribuerRoleModal
          compte={modal.compte}
          onClose={() => setModal(null)}
          onAttribuer={attribuerRole}
        />
      )}
      {modal?.type === "compte-revoquer" && (
        <RevoquerRoleModal
          compte={modal.compte}
          onClose={() => setModal(null)}
          onRevoquer={revoquerRole}
        />
      )}
      {modal?.type === "compte-statut" && (
        <DesactiverCompteModal
          compte={modal.compte}
          onClose={() => setModal(null)}
          onConfirmer={toggleCompteStatut}
        />
      )}
      {modal?.type === "evenement" && (
        <EvenementFormModal
          types={typesEvenement}
          onCreerType={(t) => {
            setTypesEvenement((ts) => [...ts, t])
            toast.success(`Type d’événement ajouté — ${t}`)
          }}
          onClose={() => setModal(null)}
          onCreer={creerEvenement}
        />
      )}
      {modal?.type === "depense" && (
        <DepenseFormModal
          evenements={evenements}
          evIdInitial={modal.evId}
          onClose={() => setModal(null)}
          onValider={enregistrerDepense}
        />
      )}
      {modal?.type === "depense-rejet" && (
        <DepenseRejetModal depense={modal.depense} onClose={() => setModal(null)} onRejeter={rejeterDepense} />
      )}
      {modal?.type === "recette" && (
        <RecetteFormModal
          evenements={evenements}
          eventIdInitial={modal.eventId}
          onClose={() => setModal(null)}
          onValider={enregistrerRecette}
        />
      )}
      {modal?.type === "paiement" && (
        <PaiementFormModal
          onClose={() => setModal(null)}
          onValider={enregistrerPaiement}
          evenements={evenements}
          choristes={choristes}
          pre={modal.pre}
        />
      )}
    </div>
  )
}
