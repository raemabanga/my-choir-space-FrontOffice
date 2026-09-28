import * as React from "react"
import { Eye, EyeOff, LockKeyhole, Music2, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEMO_ACCOUNTS, DEMO_LOGIN_PASSWORD, ROLE_LABEL } from "@/data/portail-mock"
import type { DemoAccount } from "@/types/portail"

function normalizePhone(value: string) {
  return value.replace(/\s+/g, "")
}

export function LoginPage({ onLogin }: { onLogin: (accountId: string) => void }) {
  const [telephone, setTelephone] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState("")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!telephone.trim() || !password.trim()) {
      setError("Veuillez renseigner votre téléphone et votre mot de passe.")
      return
    }
    const account = DEMO_ACCOUNTS.find(
      (a) => normalizePhone(a.telephone) === normalizePhone(telephone)
    )
    if (!account || password !== DEMO_LOGIN_PASSWORD) {
      setError("Identifiants incorrects. Utilisez un compte de démonstration ci-dessous.")
      return
    }
    setError("")
    onLogin(account.id)
  }

  function quickLogin(account: DemoAccount) {
    setError("")
    onLogin(account.id)
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8edcf] px-4 py-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={
          {
            backgroundImage:
              "linear-gradient(rgba(200, 200, 200, 0.6), rgba(243, 240, 240, 0.616)), url('/loginImg.png')",
          }
        }
        aria-hidden="true"
      />
      <div className="relative z-10 flex w-full max-w-md mr-auto ml-29">
        <Card className="relative w-full max-w-107.5 border-white/70 bg-amber/10 shadow-[0_24px_70px_rgba(91,62,16,0.18)] backdrop-blur-md">
          <CardHeader className="items-center px-7 pt-8 text-center sm:px-10 sm:pt-10">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-(--ebene) text-(--gold-soft) shadow-[0_10px_24px_rgba(18,18,18,0.16)]">
              <Music2 size={27} />
            </div>
            <CardTitle className="text-3xl tracking-[-0.03em]">Bienvenue</CardTitle>
            <CardDescription className="mt-2 max-w-70 text-sm leading-relaxed">
              Connectez-vous à votre espace chorale.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-7 pb-8 sm:px-10 sm:pb-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="telephone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="07 01 02 03 04"
                    value={telephone}
                    onChange={(event) => setTelephone(event.target.value)}
                    className="h-11 bg-white/75 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <button type="button" className="text-xs font-medium text-(--gold-strong) hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 bg-white/75 px-10"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

              <Button type="submit" size="lg" className="h-11 w-full text-sm">
                Se connecter
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-5">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="font-mono text-[10.5px] tracking-[0.1em] text-muted-foreground uppercase">
                  Comptes de démonstration
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Mot de passe : {DEMO_LOGIN_PASSWORD}
                </span>
              </div>
              <div className="grid gap-1.5">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => quickLogin(account)}
                    className="flex items-center justify-between rounded-lg border border-border bg-white/60 px-3 py-2 text-left transition-colors hover:border-(--gold) hover:bg-white/90"
                  >
                    <span>
                      <span className="block text-[13px] font-medium text-foreground">
                        {account.nom}
                      </span>
                      <span className="block text-[11px] text-muted-foreground">
                        {account.telephone}
                      </span>
                    </span>
                    <span className="text-[10.5px] font-medium text-(--gold-strong) uppercase">
                      {ROLE_LABEL[account.roles[0]]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">Le Cahier · Espace choriste</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
