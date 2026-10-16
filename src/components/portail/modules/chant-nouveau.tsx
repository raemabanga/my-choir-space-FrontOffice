import { useState } from "react"
import { ArrowLeft, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Chant } from "@/types/portail"

const CATEGORIES = ["Louange", "Adoration", "Fête", "Deuil"]

export type ChantForm = Omit<Chant, "id">

export function ChantNouveauPage({
  onAjouter,
  onAnnuler,
}: {
  onAjouter: (form: ChantForm) => void
  onAnnuler: () => void
}) {
  const [titre, setTitre] = useState("")
  const [compositeur, setCompositeur] = useState("")
  const [tonalite, setTonalite] = useState("")
  const [categorie, setCategorie] = useState("Louange")
  const [paroles, setParoles] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!titre.trim()) {
      setError("Le titre du chant est obligatoire.")
      return
    }
    setError("")
    onAjouter({
      titre: titre.trim(),
      compositeur: compositeur.trim(),
      tonalite: tonalite.trim(),
      categorie,
      paroles: paroles.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={onAnnuler}>
          <ArrowLeft /> Retour au répertoire
        </Button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={onAnnuler}>
            Annuler
          </Button>
          <Button type="submit">
            <Check /> Enregistrer le chant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(280px,360px)_1fr]">
        <Card className="h-fit border border-[var(--line)] bg-white/75 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <CardHeader>
            <CardTitle>Informations</CardTitle>
            <CardDescription>Fiche du chant dans le répertoire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="chant-titre">Titre</Label>
              <Input
                id="chant-titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex. Sublime Grâce"
                aria-invalid={error ? true : undefined}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chant-compositeur">Compositeur / auteur</Label>
              <Input
                id="chant-compositeur"
                value={compositeur}
                onChange={(e) => setCompositeur(e.target.value)}
                placeholder="Ex. Trad."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chant-tonalite">Tonalité</Label>
              <Input
                id="chant-tonalite"
                value={tonalite}
                onChange={(e) => setTonalite(e.target.value)}
                placeholder="Ex. Sol majeur"
              />
            </div>
            <div className="grid gap-2">
              <Label>Catégorie</Label>
              <Select value={categorie} onValueChange={(v) => setCategorie(v as string)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && (
              <p className="text-sm text-[var(--destructive)]" role="alert">
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border border-[var(--line)] bg-white/75 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
          <CardHeader>
            <CardTitle>Paroles du chant</CardTitle>
            <CardDescription>
              Séparez les couplets et le refrain par une ligne vide.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <Label htmlFor="chant-paroles" className="sr-only">
              Paroles
            </Label>
            <Textarea
              id="chant-paroles"
              value={paroles}
              onChange={(e) => setParoles(e.target.value)}
              placeholder={"Couplet 1\n…\n\nRefrain\n…"}
              className="min-h-[420px] flex-1 resize-y leading-relaxed lg:min-h-[520px]"
            />
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
