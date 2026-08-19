import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SectionTitle } from "@/components/portail/common"

export function RapportsModule({ onExport }: { onExport: () => void }) {
  return (
    <>
      <SectionTitle subtitle="Export des données budgétaires et de cotisation">
        Rapports
      </SectionTitle>
      <div className="grid max-w-120 gap-3">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-medium text-foreground">
                Rapport budgétaire global
              </div>
              <div className="text-xs text-muted-foreground">
                PDF — recettes / dépenses par événement
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onExport}>
              <FileDown size={14} /> Exporter
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <div className="text-[13.5px] font-medium text-foreground">
                État des cotisations statutaires
              </div>
              <div className="text-xs text-muted-foreground">
                Excel — mois payés / restants par choriste
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onExport}>
              <FileDown size={14} /> Exporter
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
