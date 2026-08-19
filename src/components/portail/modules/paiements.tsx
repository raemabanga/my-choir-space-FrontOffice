import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SectionTitle } from "@/components/portail/common"
import { fmt } from "@/lib/format"
import type { Paiement } from "@/types/portail"

export function PaiementsModule({
  paiements,
  onNouveau,
}: {
  paiements: Paiement[]
  onNouveau: () => void
}) {
  return (
    <>
      <div className="flex items-end justify-between">
        <SectionTitle subtitle="Enregistrement des paiements et génération automatique des reçus">
          Paiements & Reçus
        </SectionTitle>
        <Button onClick={onNouveau}>
          <Plus size={14} /> Enregistrer un paiement
        </Button>
      </div>
      <Card className="py-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              {["Date", "Choriste", "Cotisation", "Montant", "Reçu", "Enregistré par"].map((h) => (
                <TableHead key={h} className="font-mono text-[10.5px] text-muted-foreground uppercase">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paiements.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{p.date}</TableCell>
                <TableCell className="text-[13px] text-foreground">{p.choriste}</TableCell>
                <TableCell className="whitespace-normal text-[12.5px] text-muted-foreground">{p.type}</TableCell>
                <TableCell className="text-[13px] font-semibold text-teal">{fmt(p.montant)}</TableCell>
                <TableCell className="font-mono text-xs text-gold">{p.recu}</TableCell>
                <TableCell className="text-[12.5px] text-muted-foreground">{p.auteur}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  )
}
