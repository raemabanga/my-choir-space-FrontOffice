export type Role =
  | "admin_chorale"
  | "bureau"
  | "secretaire"
  | "tresorier"
  | "choriste"
  | "commission_recette"
  | "commission_musicale"

export type ModuleKey =
  | "accueil"
  | "comptes"
  | "evenements"
  | "cotisations"
  | "paiements"
  | "budget"
  | "chants"
  | "rapports"

export interface DemoAccount {
  id: string
  nom: string
  roles: Role[]
}

export interface HistoriqueEntry {
  role: Role
  debut: string
  fin: string | null
  auteur: string
}

export interface Compte {
  id: string
  nom: string
  email: string
  roles: Role[]
  statut: "actif" | "désactivé"
  historique: HistoriqueEntry[]
}

export interface Depense {
  libelle: string
  montant: number
  valide: boolean
}

export interface Cotisation {
  montant: number
  collecte: number
  attendu: number
}

export interface Evenement {
  id: string
  titre: string
  date: string
  type: string
  budgetPrevisionnel: number
  cotisation: Cotisation
  depenses: Depense[]
}

export interface Statutaire {
  montantAnnuel: number
  mensualite: number
  suivis: Record<string, number[]>
}

export interface Chant {
  id: string
  titre: string
  compositeur: string
  tonalite: string
  categorie: string
}

export interface Paiement {
  id: string
  date: string
  choriste: string
  type: string
  montant: number
  recu: string
  auteur: string
}

export type ModalState =
  | { type: "compte" }
  | { type: "evenement" }
  | { type: "depense"; evId: string }
  | { type: "chant" }
  | { type: "paiement"; pre: { choriste?: string; type?: string; eventId?: string } }
  | null
