import * as React from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import PortailChorale from "@/components/portail/portail-chorale"
import { Toaster } from "@/components/ui/sonner"
import { LoginPage } from "@/pages/login-page"
import { useApplyAccentColor } from "@/store/use-apply-accent-color"

function App() {
  const [accountId, setAccountId] = React.useState<string | null>(null)
  useApplyAccentColor()

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            accountId ? (
              <Navigate to="/accueil" replace />
            ) : (
              <LoginPage onLogin={(id) => setAccountId(id)} />
            )
          }
        />
        <Route
          path="/*"
          element={
            accountId ? (
              <PortailChorale initialAccountId={accountId} onLogout={() => setAccountId(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  )
}

export default App
