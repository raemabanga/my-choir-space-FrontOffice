import { useState } from "react"
import { toast } from "sonner"
import { Check, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DEFAULT_ACCENT_COLOR, DEFAULT_APP_NAME, useAppSettings } from "@/store/app-settings"

const COLOR_PRESETS = [
  { label: "Or liturgique", value: "#c6922d" },
  { label: "Vert sacristie", value: "#2e6d55" },
  { label: "Terre cuite", value: "#a74d40" },
  { label: "Prune épiscopale", value: "#6b2d5c" },
  { label: "Bleu chasuble", value: "#2f5f8a" },
]

export function ParametresModule() {
  const { appName, accentColor, setAppName, setAccentColor, resetSettings } = useAppSettings()
  const [nameDraft, setNameDraft] = useState(appName)
  const [colorDraft, setColorDraft] = useState(accentColor)

  const dirty = nameDraft !== appName || colorDraft !== accentColor

  const save = () => {
    setAppName(nameDraft)
    setAccentColor(colorDraft)
    toast.success("Paramètres enregistrés")
  }

  const reset = () => {
    resetSettings()
    setNameDraft(DEFAULT_APP_NAME)
    setColorDraft(DEFAULT_ACCENT_COLOR)
    toast.success("Paramètres réinitialisés")
  }

  return (
    <div className="grid max-w-140 gap-4">
      <Card>
        <CardContent>
          <div className="mb-1 text-[13.5px] font-medium text-foreground">
            Identité de l'application
          </div>
          <div className="mb-3 text-xs text-muted-foreground">
            Le nom affiché en haut de la barre latérale.
          </div>
          <div className="grid gap-1.5">
            <Label>Nom de l'application</Label>
            <Input
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={DEFAULT_APP_NAME}
              className="max-w-80"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="mb-1 text-[13.5px] font-medium text-foreground">
            Couleur d'accentuation
          </div>
          <div className="mb-3 text-xs text-muted-foreground">
            Recolore les boutons, badges, barres de progression et le menu du portail.
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={colorDraft}
              onChange={(e) => setColorDraft(e.target.value)}
              aria-label="Choisir une couleur personnalisée"
              className="size-8 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
            />
            <Input
              value={colorDraft}
              onChange={(e) => setColorDraft(e.target.value)}
              className="max-w-32 font-mono uppercase"
              maxLength={7}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.label}
                aria-label={preset.label}
                onClick={() => setColorDraft(preset.value)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full ring-1 ring-border transition-transform hover:scale-110",
                  colorDraft.toLowerCase() === preset.value &&
                    "ring-2 ring-offset-2 ring-offset-background"
                )}
                style={{ backgroundColor: preset.value }}
              >
                {colorDraft.toLowerCase() === preset.value && (
                  <Check size={14} className="text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Button onClick={save} disabled={!dirty}>
          <Check size={14} /> Enregistrer
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw size={14} /> Réinitialiser
        </Button>
      </div>
    </div>
  )
}
