import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MiniStat } from "@/components/portail/common"
import { fmt } from "@/lib/format"
import type { Evenement } from "@/types/portail"

export function EvenementsModule({
  evenements,
  onSupprimer,
  onDepense,
  onValiderDepense,
}: {
  evenements: Evenement[]
  onSupprimer: (id: string) => void
  onDepense: (evId: string) => void
  onValiderDepense: (evId: string, idx: number) => void
}) {
  return (
    <>
      <div className="grid gap-3.5">
        {evenements.map((e) => {
          const depTotal = e.depenses
            .filter((d) => d.valide)
            .reduce((s, d) => s + d.montant, 0)
          return (
            <Card key={e.id}>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <div className="font-heading text-[17px] font-semibold text-foreground">
                      {e.titre}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {e.date} · {e.type}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onSupprimer(e.id)}>
                    <Trash2 size={14} /> Supprimer
                  </Button>
                </div>

                <div className="mt-3.5 flex gap-6">
                  <MiniStat label="Cotisation / choriste" value={fmt(e.cotisation.montant)} />
                  <MiniStat label="Collecté" value={fmt(e.cotisation.collecte)} className="text-teal" />
                  <MiniStat label="Dépenses validées" value={fmt(depTotal)} className="text-rust" />
                  <MiniStat label="Solde" value={fmt(e.cotisation.collecte - depTotal)} className="text-gold" />
                </div>

                {e.depenses.length > 0 && (
                  <div className="mt-3.5">
                    {e.depenses.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-t border-border py-1.5 text-[12.5px]"
                      >
                        <span className="text-muted-foreground">
                          {d.libelle} — {fmt(d.montant)}
                        </span>
                        {d.valide ? (
                          <Badge variant="outline" className="text-teal border-teal/30 bg-teal-soft">
                            Validée
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onValiderDepense(e.id, i)}
                          >
                            Valider
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3">
                  <Button variant="outline" size="sm" onClick={() => onDepense(e.id)}>
                    <Plus size={14} /> Enregistrer une dépense
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
