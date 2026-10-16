import { useState } from "react"
import { Check } from "lucide-react"

import { JustificatifInput } from "@/components/portail/modals/justificatif-input"
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
import { CATEGORIES_DEPENSE, MODE_REGLEMENT_LABEL } from "@/data/portail-mock"
import type { Depense, Evenement, Justificatif, ModeReglement } from "@/types/portail"

export type DepenseForm = Pick<
  Depense,
  "date" | "libelle" | "categorie" | "montant" | "eventId" | "beneficiaire" | "mode" | "justificatif"
>

const SANS_EVENEMENT = "__general__"

export function DepenseFormModal({
  evenements,
  evIdInitial,
  onClose,
  onValider,
}: {
  evenements: Evenement[]
  evIdInitial?: string
  onClose: () => void
  onValider: (form: DepenseForm) => void
}) {
  const [libelle, setLibelle] = useState("")
  const [montant, setMontant] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [categorie, setCategorie] = useState(CATEGORIES_DEPENSE[0])
  const [eventId, setEventId] = useState(evIdInitial ?? SANS_EVENEMENT)
  const [beneficiaire, setBeneficiaire] = useState("")
  const [mode, setMode] = useState<ModeReglement>("especes")
  const [justificatif, setJustificatif] = useState<Justificatif>()
  const [erreur, setErreur] = useState("")

  function enregistrer() {
    const m = Number(montant.replace(/\s/g, ""))
    if (!libelle.trim() || !m || m <= 0) {
      setErreur("Renseignez au moins un libellé et un montant valide.")
      return
    }
    onValider({
      libelle: libelle.trim(),
      montant: m,
      date,
      categorie,
      eventId: eventId === SANS_EVENEMENT ? undefined : eventId,
      beneficiaire: beneficiaire.trim() || "—",
      mode,
      justificatif,
    })
  }

  const evenementsItems = {
    [SANS_EVENEMENT]: "Frais généraux (aucun événement)",
    ...Object.fromEntries(evenements.map((e) => [e.id, e.titre])),
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer une dépense</DialogTitle>
          <DialogDescription>
            La dépense sera soumise à validation par un autre membre du bureau.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="dep-libelle">Libellé</Label>
            <Input id="dep-libelle" value={libelle} onChange={(e) => setLibelle(e.target.value)} placeholder="Ex. Location de chaises" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dep-montant">Montant (F)</Label>
            <Input id="dep-montant" inputMode="numeric" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="25000" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dep-date">Date</Label>
            <Input id="dep-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Catégorie</Label>
            <Select value={categorie} onValueChange={(v) => setCategorie(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES_DEPENSE.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Mode de règlement</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as ModeReglement)} items={MODE_REGLEMENT_LABEL}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(MODE_REGLEMENT_LABEL).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Événement</Label>
            <Select value={eventId} onValueChange={(v) => setEventId(v as string)} items={evenementsItems}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(evenementsItems).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label htmlFor="dep-benef">Bénéficiaire</Label>
            <Input id="dep-benef" value={beneficiaire} onChange={(e) => setBeneficiaire(e.target.value)} placeholder="Ex. Salle polyvalente, fournisseur…" />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Justificatif</Label>
            <JustificatifInput value={justificatif} onChange={setJustificatif} />
          </div>
        </div>

        {erreur && <p className="text-sm text-[var(--destructive)]" role="alert">{erreur}</p>}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={enregistrer}>
            <Check size={14} /> Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
