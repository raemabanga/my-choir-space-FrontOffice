import type {
  Chant,
  Compte,
  Depense,
  DemoAccount,
  Evenement,
  ModeReglement,
  Paiement,
  Recette,
  Role,
  TypeRecette,
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

export const DEMO_LOGIN_PASSWORD = "demo1234"

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "u1",
    nom: "Aïcha Koné",
    telephone: "07 01 02 03 04",
    email: "a.kone@mail.com",
    roles: ["admin_chorale"],
  },
  {
    id: "u2",
    nom: "Paul Ndongo",
    telephone: "07 02 03 04 05",
    email: "p.ndongo@mail.com",
    roles: ["bureau", "secretaire", "choriste"],
  },
  {
    id: "u3",
    nom: "Samuel Biya",
    telephone: "07 03 04 05 06",
    email: "s.biya@mail.com",
    roles: ["bureau", "choriste"],
  },
  {
    id: "u4",
    nom: "Grâce Mbala",
    telephone: "07 04 05 06 07",
    email: "g.mbala@mail.com",
    roles: ["tresorier", "choriste"],
  },
]

export const TYPES_EVENEMENT = ["concert", "sortie", "veillée", "mariage", "décès", "maladie"]

export const CHORISTES = [
  "Fatou Diarra",
  "Jean Kamdem",
  "Rosine Ateba",
  "Marc Loemba",
  "Julie Nkomo",
  "David Wandji",
  "Samuel Biya",
  "Paul Ndongo",
  "Grâce Mbala",
]

export const initialComptes: Compte[] = [
  { id: "cp1", nom: "Fatou Diarra", telephone: "06 11 22 33 44", email: "f.diarra@mail.com", roles: ["choriste"], statut: "actif", historique: [{ role: "choriste", debut: "2024-01-10", fin: null, auteur: "Aïcha Koné" }] },
  { id: "cp2", nom: "Jean Kamdem", telephone: "06 22 33 44 55", email: "j.kamdem@mail.com", roles: ["commission_recette", "choriste"], statut: "actif", historique: [{ role: "choriste", debut: "2023-06-01", fin: null, auteur: "—" }, { role: "commission_recette", debut: "2025-09-01", fin: null, auteur: "Aïcha Koné" }] },
  { id: "cp3", nom: "Rosine Ateba", telephone: "06 33 44 55 66", email: "r.ateba@mail.com", roles: ["commission_musicale", "choriste"], statut: "actif", historique: [{ role: "commission_musicale", debut: "2025-02-15", fin: null, auteur: "Aïcha Koné" }] },
  { id: "cp4", nom: "Samuel Biya", telephone: "07 03 04 05 06", email: "s.biya@mail.com", roles: ["bureau", "choriste"], statut: "actif", historique: [{ role: "bureau", debut: "2024-09-01", fin: "2026-09-01", auteur: "Aïcha Koné" }] },
  { id: "cp5", nom: "Paul Ndongo", telephone: "07 02 03 04 05", email: "p.ndongo@mail.com", roles: ["bureau", "secretaire", "choriste"], statut: "actif", historique: [{ role: "bureau", debut: "2024-09-01", fin: "2026-09-01", auteur: "Aïcha Koné" }] },
  { id: "cp6", nom: "Grâce Mbala", telephone: "07 04 05 06 07", email: "g.mbala@mail.com", roles: ["tresorier", "choriste"], statut: "actif", historique: [{ role: "tresorier", debut: "2024-09-01", fin: "2026-09-01", auteur: "Aïcha Koné" }] },
  { id: "cp8", nom: "Clarisse Ondo", telephone: "06 55 66 77 88", email: "c.ondo@mail.com", roles: ["choriste"], statut: "actif", historique: [{ role: "choriste", debut: "2026-09-01", fin: null, auteur: "Aïcha Koné" }] },
  { id: "cp7", nom: "Marc Loemba", telephone: "06 44 55 66 77", email: "m.loemba@mail.com", roles: ["choriste"], statut: "désactivé", historique: [{ role: "choriste", debut: "2022-03-01", fin: null, auteur: "—" }] },
]

export const initialEvenements: Evenement[] = [
  { id: "ev1", titre: "Concert de Noël", date: "2026-12-20", type: "concert", budgetPrevisionnel: 300000, cotisation: { montant: 5000, collecte: 30000, attendu: 9, versements: { "Fatou Diarra": 5000, "Jean Kamdem": 5000, "Rosine Ateba": 5000, "Julie Nkomo": 5000, "David Wandji": 5000, "Marc Loemba": 5000 } } },
  { id: "ev2", titre: "Mariage — Awa & Koffi", date: "2026-09-05", type: "mariage", budgetPrevisionnel: 0, cotisation: { montant: 2000, collecte: 8000, attendu: 9, versements: { "Fatou Diarra": 2000, "Jean Kamdem": 2000, "Rosine Ateba": 2000, "Julie Nkomo": 2000 } } },
  { id: "ev3", titre: "Sortie annuelle", date: "2026-11-02", type: "sortie", budgetPrevisionnel: 150000, cotisation: { montant: 10000, collecte: 40000, attendu: 9, versements: { "Fatou Diarra": 10000, "Jean Kamdem": 10000, "Rosine Ateba": 10000, "Julie Nkomo": 5000, "David Wandji": 5000 } } },
]

export const initialStatutaire: Statutaire = {
  montantAnnuel: 12000,
  mensualite: 1000,
  exercices: {
    2025: {
      "Fatou Diarra": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      "Jean Kamdem": [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
      "Rosine Ateba": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      "Marc Loemba": [1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0],
      "Julie Nkomo": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      "David Wandji": [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
      "Samuel Biya": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      "Paul Ndongo": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      "Grâce Mbala": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    },
    2026: {
      "Fatou Diarra": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      "Jean Kamdem": [1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      "Rosine Ateba": [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0],
      "Marc Loemba": [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "Julie Nkomo": [1, 1, 1, 1, 2, 1, 1, 0, 0, 1, 0, 0],
      "David Wandji": [1, 2, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0],
      "Samuel Biya": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      "Paul Ndongo": [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0],
      "Grâce Mbala": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    },
  },
}

export const initialChants: Chant[] = [
  { id: "ch1", titre: "Sublime Grâce", compositeur: "Trad.", tonalite: "Ré majeur", categorie: "Louange" },
  { id: "ch2", titre: "Vers Toi Seigneur", compositeur: "P. Ndongo", tonalite: "Sol majeur", categorie: "Adoration" },
  { id: "ch3", titre: "Cantique de Noël", compositeur: "Trad.", tonalite: "Do majeur", categorie: "Fête" },
]

export const initialPaiements: Paiement[] = [
  { id: "pa1", date: "2026-08-15 10:20", choriste: "Fatou Diarra", type: "Statutaire — mois de mai", montant: 1000, recu: "RCU-2026-0114", auteur: "Jean Kamdem" },
  { id: "pa2", date: "2026-08-14 16:05", choriste: "Rosine Ateba", type: "Événementielle — Sortie annuelle", montant: 10000, recu: "RCU-2026-0113", auteur: "Grâce Mbala", eventId: "ev3" },
]

export const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

export const CATEGORIES_DEPENSE = [
  "Location",
  "Transport",
  "Sonorisation",
  "Restauration",
  "Partitions",
  "Tenues",
  "Instruments",
  "Communication",
  "Divers",
]

export const MODE_REGLEMENT_LABEL: Record<ModeReglement, string> = {
  especes: "Espèces",
  mobile_money: "Mobile Money",
  virement: "Virement",
  cheque: "Chèque",
}

export const TYPE_RECETTE_LABEL: Record<TypeRecette, string> = {
  don: "Don",
  billetterie: "Billetterie",
  subvention: "Subvention",
  autre: "Autre recette",
}

export const initialDepenses: Depense[] = [
  { id: "dp1", date: "2026-10-02", libelle: "Location salle", categorie: "Location", montant: 80000, eventId: "ev1", beneficiaire: "Salle polyvalente Akwa", mode: "virement", statut: "validee", justificatif: { nom: "facture-salle-akwa.pdf", type: "application/pdf", taille: 184000 }, rapproche: true, saisiPar: "Grâce Mbala", traitePar: "Paul Ndongo" },
  { id: "dp2", date: "2026-10-10", libelle: "Sonorisation", categorie: "Sonorisation", montant: 45000, eventId: "ev1", beneficiaire: "SonoPro Douala", mode: "mobile_money", statut: "en_attente", justificatif: { nom: "devis-sonopro.pdf", type: "application/pdf", taille: 96000 }, rapproche: false, saisiPar: "Grâce Mbala" },
  { id: "dp3", date: "2026-09-28", libelle: "Transport", categorie: "Transport", montant: 60000, eventId: "ev3", beneficiaire: "Transports Mbanga", mode: "especes", statut: "validee", rapproche: false, saisiPar: "Grâce Mbala", traitePar: "Samuel Biya" },
  { id: "dp4", date: "2026-09-12", libelle: "Achat de partitions", categorie: "Partitions", montant: 18000, beneficiaire: "Librairie des Peuples", mode: "especes", statut: "validee", justificatif: { nom: "ticket-librairie.jpg", type: "image/jpeg", taille: 412000 }, rapproche: true, saisiPar: "Paul Ndongo", traitePar: "Grâce Mbala" },
  { id: "dp5", date: "2026-09-20", libelle: "Réparation du clavier", categorie: "Instruments", montant: 25000, beneficiaire: "Atelier Musique Plus", mode: "especes", statut: "rejetee", motifRejet: "Devis unique — fournir au moins deux devis.", rapproche: false, saisiPar: "Rosine Ateba", traitePar: "Paul Ndongo" },
  { id: "dp6", date: "2026-10-12", libelle: "Collation des choristes", categorie: "Restauration", montant: 35000, eventId: "ev3", beneficiaire: "Traiteur Chez Mama", mode: "mobile_money", statut: "en_attente", rapproche: false, saisiPar: "Paul Ndongo" },
]

export const initialRecettes: Recette[] = [
  { id: "rc1", date: "2026-08-30", type: "subvention", libelle: "Subvention vie associative", montant: 100000, source: "Mairie de Douala 1er", mode: "virement", saisiPar: "Grâce Mbala" },
  { id: "rc2", date: "2026-09-15", type: "don", libelle: "Don de la paroisse", montant: 50000, source: "Paroisse Saint-Michel", mode: "virement", saisiPar: "Grâce Mbala" },
  { id: "rc3", date: "2026-09-25", type: "autre", libelle: "Vente de CD", montant: 15000, source: "Ventes après la messe", mode: "especes", saisiPar: "Paul Ndongo" },
  { id: "rc4", date: "2026-10-01", type: "don", libelle: "Don anonyme", montant: 10000, source: "Anonyme", mode: "especes", saisiPar: "Grâce Mbala" },
  { id: "rc5", date: "2026-10-08", type: "billetterie", libelle: "Prévente des billets", montant: 42000, eventId: "ev1", source: "Billetterie en ligne", mode: "mobile_money", saisiPar: "Grâce Mbala" },
]
