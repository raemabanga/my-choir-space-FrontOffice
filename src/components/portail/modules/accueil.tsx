import { Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionTitle, MonoLabel } from "@/components/portail/common"
import { ROLE_LABEL } from "@/data/portail-mock"
import { fmt } from "@/lib/format"
import type { Compte, DemoAccount, Evenement, Role } from "@/types/portail"

export function Accueil({
  account,
  roles,
  evenements,
  comptes,
}: {
  account: DemoAccount
  roles: Role[]
  evenements: Evenement[]
  comptes: Compte[]
}) {
  const totalCollecte = evenements.reduce((s, e) => s + e.cotisation.collecte, 0)
  const comptesActifs = comptes.filter((c) => c.statut === "actif").length

  return (
    <>
      <SectionTitle
        subtitle={`Connecté en tant que ${account.nom} — ${roles
          .map((r) => ROLE_LABEL[r])
          .join(" · ")}`}
      >
        Bonjour {account.nom.split(" ")[0]}
      </SectionTitle>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <MonoLabel>Événements en cours</MonoLabel>
            <div className="font-heading text-[28px] text-foreground">
              {evenements.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MonoLabel>Cotisations collectées (événements)</MonoLabel>
            <div className="font-heading text-[28px] text-teal">
              {fmt(totalCollecte)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MonoLabel>Comptes actifs</MonoLabel>
            <div className="font-heading text-[28px] text-foreground">
              {comptesActifs}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-2.5 rounded-md bg-gold-soft px-3.5 py-3 text-[12.5px] text-[#6B5220]">
        <Info size={14} className="shrink-0" />
        Le menu de gauche s'adapte automatiquement au(x) rôle(s) du compte
        sélectionné. Change de compte pour voir un autre point de vue sur le
        même portail.
      </div>
    </>
  )
}
