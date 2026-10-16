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
  | "parametres"

export interface DemoAccount {
  id: string
  nom: string
  telephone: string
  email?: string
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
  telephone: string
  email: string
  roles: Role[]
  statut: "actif" | "désactivé"
  historique: HistoriqueEntry[]
}

export type StatutDepense = "en_attente" | "validee" | "rejetee"

export type ModeReglement = "especes" | "mobile_money" | "virement" | "cheque"

export interface Justificatif {
  nom: string
  type: string
  taille: number
  /** URL locale (session) du fichier joint ; absente pour les données de démonstration */
  url?: string
}

export interface Depense {
  id: string
  date: string
  libelle: string
  categorie: string
  montant: number
  /** Événement rattaché ; absent pour les frais généraux */
  eventId?: string
  beneficiaire: string
  mode: ModeReglement
  statut: StatutDepense
  motifRejet?: string
  justificatif?: Justificatif
  /** Décaissement rapproché avec le relevé (caisse / banque / mobile money) */
  rapproche: boolean
  saisiPar: string
  traitePar?: string
}

export type TypeRecette = "don" | "billetterie" | "subvention" | "autre"

export interface Recette {
  id: string
  date: string
  type: TypeRecette
  libelle: string
  montant: number
  eventId?: string
  source: string
  mode: ModeReglement
  saisiPar: string
}

export interface Cotisation {
  montant: number
  collecte: number
  attendu: number
  /** Montant versé par choriste pour cet événement */
  versements: Record<string, number>
}

export interface Evenement {
  id: string
  titre: string
  date: string
  type: string
  budgetPrevisionnel: number
  cotisation: Cotisation
}

/** 0 = impayé (ou à venir), 1 = payé, 2 = payé en retard */
export type StatutMois = 0 | 1 | 2

export interface Statutaire {
  montantAnnuel: number
  mensualite: number
  /** Carte de cotisation par exercice, puis par membre (12 mois) */
  exercices: Record<number, Record<string, StatutMois[]>>
}

export interface Chant {
  id: string
  titre: string
  compositeur: string
  tonalite: string
  categorie: string
  paroles?: string
}

export interface Paiement {
  id: string
  date: string
  choriste: string
  type: string
  montant: number
  recu: string
  auteur: string
  eventId?: string
}

export interface Perms {
  comptes: boolean
  comptesFull: boolean
  evenements: boolean
  cotisations: boolean
  paiements: boolean
  budget: boolean
  /** Valider / rejeter les dépenses (jamais ses propres saisies) */
  depensesValider: boolean
  chantsGerer: boolean
  chantsVoir: boolean
  rapports: boolean
}

export type ModalState =
  | { type: "compte" }
  | { type: "compte-role"; compte: Compte }
  | { type: "compte-revoquer"; compte: Compte }
  | { type: "compte-statut"; compte: Compte }
  | { type: "evenement" }
  | { type: "depense"; evId?: string }
  | { type: "depense-rejet"; depense: Depense }
  | { type: "recette"; eventId?: string }
  | { type: "paiement"; pre: { choriste?: string; type?: string; eventId?: string } }
  | null
