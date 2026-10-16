import { useState } from "react"
import { Check, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formaterTelephone, normaliserTelephone } from "@/lib/format"
import type { Compte, Role } from "@/types/portail"

const FULL_OPTIONS: [Role, string][] = [
  ["choriste", "Choriste"],
  ["commission_recette", "Commission recette"],
  ["commission_musicale", "Commission musicale"],
  ["bureau", "Bureau exécutif"],
  ["tresorier", "Trésorier(ère)"],
]
const LIMITED_OPTIONS: [Role, string][] = [
  ["choriste", "Choriste"],
  ["commission_recette", "Commission recette"],
  ["commission_musicale", "Commission musicale"],
]

type Erreurs = Partial<Record<"nom" | "telephone" | "email", string>>

export function CompteFormModal({
  comptes,
  onClose,
  onCreer,
  full,
}: {
  comptes: Compte[]
  onClose: () => void
  onCreer: (form: { nom: string; telephone: string; email: string; role: Role }) => void
  full: boolean
}) {
  const [nom, setNom] = useState("")
  const [telephone, setTelephone] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("choriste")
  const [erreurs, setErreurs] = useState<Erreurs>({})
  const options = full ? FULL_OPTIONS : LIMITED_OPTIONS

  function creer() {
    const e: Erreurs = {}
    const tel = normaliserTelephone(telephone)
    const chiffres = tel.replace("+", "")

    if (!nom.trim()) e.nom = "Le nom est obligatoire."
    if (!tel) e.telephone = "Le numéro de téléphone est obligatoire."
    else if (chiffres.length < 8 || chiffres.length > 15)
      e.telephone = "Numéro invalide (8 à 15 chiffres)."
    else {
      const doublon = comptes.find((c) => normaliserTelephone(c.telephone) === tel)
      if (doublon) e.telephone = `Ce numéro est déjà utilisé par ${doublon.nom}.`
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Adresse email invalide."

    setErreurs(e)
    if (Object.keys(e).length) return
    onCreer({ nom: nom.trim(), telephone: formaterTelephone(telephone), email: email.trim(), role })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un compte</DialogTitle>
          <DialogDescription>
            Le numéro de téléphone sert d'identifiant de connexion au portail.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label htmlFor="compte-nom">Nom complet</Label>
          <Input
            id="compte-nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex. Julie Nkomo"
            aria-invalid={erreurs.nom ? true : undefined}
          />
          {erreurs.nom && <p className="text-xs text-[var(--destructive)]">{erreurs.nom}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="compte-tel">Téléphone</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-light)]" />
            <Input
              id="compte-tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telephone}
              onChange={(e) => {
                setTelephone(e.target.value)
                setErreurs((x) => ({ ...x, telephone: undefined }))
              }}
              onBlur={() => telephone.trim() && setTelephone(formaterTelephone(telephone))}
              placeholder="07 01 02 03 04"
              className="pl-10"
              aria-invalid={erreurs.telephone ? true : undefined}
            />
          </div>
          {erreurs.telephone && <p className="text-xs text-[var(--destructive)]">{erreurs.telephone}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="compte-email">
            Email <span className="font-normal tracking-normal normal-case text-[var(--ink-light)]">(facultatif)</span>
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ink-light)]" />
            <Input
              id="compte-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErreurs((x) => ({ ...x, email: undefined }))
              }}
              placeholder="julie.nkomo@mail.com"
              className="pl-10"
              aria-invalid={erreurs.email ? true : undefined}
            />
          </div>
          {erreurs.email && <p className="text-xs text-[var(--destructive)]">{erreurs.email}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label>Rôle initial</Label>
          <Select value={role} onValueChange={(v) => setRole(v as Role)} items={Object.fromEntries(options)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map(([v, l]) => (
                <SelectItem key={v} value={v}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!full && (
          <div className="text-[11.5px] text-muted-foreground">
            En tant que Secrétaire, l'attribution de mandats (Bureau/Trésorier)
            reste réservée à l'Admin de chorale.
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={creer}>
            <Check size={14} /> Créer le compte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
