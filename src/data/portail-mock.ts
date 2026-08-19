import type {
  Chant,
  Compte,
  DemoAccount,
  Evenement,
  Paiement,
  Role,
  Statutaire,
} from "@/types/portail"

export const ROLE_LABEL: Record<Role, string> = {
  admin_chorale: "Admin de chorale",
  bureau: "Bureau exécutif",
  secretaire: "Secrétaire général",
  tresorier: "Trésorier(ère)",
  choriste: "Choriste",
  commission_recette: "Commission recette",
  commission_musicale: "Commission musicale",
}

export const ROLE_COLOR_CLASS: Record<Role, string> = {
  admin_chorale: "text-plum border-plum/30 bg-plum/10",
  bureau: "text-gold border-gold/30 bg-gold/10",
  secretaire: "text-gold border-gold/30 bg-gold/10",
  tresorier: "text-teal border-teal/30 bg-teal/10",
  choriste: "text-muted-foreground border-border bg-muted",
  commission_recette: "text-muted-foreground border-border bg-muted",
  commission_musicale: "text-muted-foreground border-border bg-muted",
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { id: "u1", nom: "Aïcha Koné", roles: ["admin_chorale"] },
  { id: "u2", nom: "Paul Ndongo", roles: ["bureau", "secretaire", "choriste"] },
  { id: "u3", nom: "Samuel Biya", roles: ["bureau", "choriste"] },
  { id: "u4", nom: "Grâce Mbala", roles: ["tresorier", "choriste"] },
]

export const CHORISTES = [
  "Fatou Diarra",
  "Jean Kamdem",
  "Rosine Ateba",
  "Marc Loemba",
  "Julie Nkomo",
  "David Wandji",
]

export const initialComptes: Compte[] = [
  { id: "cp1", nom: "Fatou Diarra", email: "f.diarra@mail.com", roles: ["choriste"], statut: "actif", historique: [{ role: "choriste", debut: "2024-01-10", fin: null, auteur: "Aïcha Koné" }] },
  { id: "cp2", nom: "Jean Kamdem", email: "j.kamdem@mail.com", roles: ["commission_recette", "choriste"], statut: "actif", historique: [{ role: "choriste", debut: "2023-06-01", fin: null, auteur: "—" }, { role: "commission_recette", debut: "2025-09-01", fin: null, auteur: "Aïcha Koné" }] },
  { id: "cp3", nom: "Rosine Ateba", email: "r.ateba@mail.com", roles: ["commission_musicale", "choriste"], statut: "actif", historique: [{ role: "commission_musicale", debut: "2025-02-15", fin: null, auteur: "Aïcha Koné" }] },
  { id: "cp4", nom: "Samuel Biya", email: "s.biya@mail.com", roles: ["bureau", "choriste"], statut: "actif", historique: [{ role: "bureau", debut: "2024-09-01", fin: "2026-09-01", auteur: "Aïcha Koné" }] },
  { id: "cp5", nom: "Paul Ndongo", email: "p.ndongo@mail.com", roles: ["bureau", "secretaire", "choriste"], statut: "actif", historique: [{ role: "bureau", debut: "2024-09-01", fin: "2026-09-01", auteur: "Aïcha Koné" }] },
  { id: "cp6", nom: "Grâce Mbala", email: "g.mbala@mail.com", roles: ["tresorier", "choriste"], statut: "actif", historique: [{ role: "tresorier", debut: "2024-09-01", fin: "2026-09-01", auteur: "Aïcha Koné" }] },
  { id: "cp7", nom: "Marc Loemba", email: "m.loemba@mail.com", roles: ["choriste"], statut: "désactivé", historique: [{ role: "choriste", debut: "2022-03-01", fin: null, auteur: "—" }] },
]

export const initialEvenements: Evenement[] = [
  { id: "ev1", titre: "Concert de Noël", date: "2026-12-20", type: "concert", budgetPrevisionnel: 300000, cotisation: { montant: 5000, collecte: 30000, attendu: 6 }, depenses: [{ libelle: "Location salle", montant: 80000, valide: true }, { libelle: "Sonorisation", montant: 45000, valide: false }] },
  { id: "ev2", titre: "Mariage — Awa & Koffi", date: "2026-09-05", type: "mariage", budgetPrevisionnel: 0, cotisation: { montant: 2000, collecte: 8000, attendu: 6 }, depenses: [] },
  { id: "ev3", titre: "Sortie annuelle", date: "2026-11-02", type: "sortie", budgetPrevisionnel: 150000, cotisation: { montant: 10000, collecte: 40000, attendu: 6 }, depenses: [{ libelle: "Transport", montant: 60000, valide: true }] },
]

export const initialStatutaire: Statutaire = {
  montantAnnuel: 12000,
  mensualite: 1000,
  suivis: {
    "Fatou Diarra": [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    "Jean Kamdem": [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Rosine Ateba": [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    "Marc Loemba": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "Julie Nkomo": [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    "David Wandji": [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
}

export const initialChants: Chant[] = [
  { id: "ch1", titre: "Sublime Grâce", compositeur: "Trad.", tonalite: "Ré majeur", categorie: "Louange" },
  { id: "ch2", titre: "Vers Toi Seigneur", compositeur: "P. Ndongo", tonalite: "Sol majeur", categorie: "Adoration" },
  { id: "ch3", titre: "Cantique de Noël", compositeur: "Trad.", tonalite: "Do majeur", categorie: "Fête" },
]

export const initialPaiements: Paiement[] = [
  { id: "pa1", date: "2026-08-15 10:20", choriste: "Fatou Diarra", type: "Statutaire — mois de mai", montant: 1000, recu: "RCU-2026-0114", auteur: "Jean Kamdem" },
  { id: "pa2", date: "2026-08-14 16:05", choriste: "Rosine Ateba", type: "Événementielle — Sortie annuelle", montant: 10000, recu: "RCU-2026-0113", auteur: "Grâce Mbala" },
]

export const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
