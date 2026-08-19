import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
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

const TYPES = ["concert", "sortie", "veillée", "mariage", "décès", "maladie"]

export function EvenementFormModal({
  onClose,
  onCreer,
}: {
  onClose: () => void
  onCreer: (form: { titre: string; date: string; type: string; budget: string; cotisation: string }) => void
}) {
  const [titre, setTitre] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState("concert")
  const [budget, setBudget] = useState("")
  const [cotisation, setCotisation] = useState("")

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel événement</DialogTitle>
        </DialogHeader>

        <div className="grid gap-1.5">
          <Label>Titre</Label>
          <Input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex. Concert de Pâques" />
        </div>
        <div className="grid gap-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as string)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Budget prévisionnel (F)</Label>
          <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="150000" />
        </div>
        <div className="grid gap-1.5">
          <Label>Cotisation par choriste (F)</Label>
          <Input value={cotisation} onChange={(e) => setCotisation(e.target.value)} placeholder="5000" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => titre && onCreer({ titre, date, type, budget, cotisation })}>
            <Check size={14} /> Créer l'événement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
