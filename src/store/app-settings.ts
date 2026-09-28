import { create } from "zustand"
import { persist } from "zustand/middleware"

export const DEFAULT_APP_NAME = "Le Cahier"
export const DEFAULT_ACCENT_COLOR = "#c6922d"

interface AppSettingsState {
  appName: string
  accentColor: string
  setAppName: (name: string) => void
  setAccentColor: (color: string) => void
  resetSettings: () => void
}

export const useAppSettings = create<AppSettingsState>()(
  persist(
    (set) => ({
      appName: DEFAULT_APP_NAME,
      accentColor: DEFAULT_ACCENT_COLOR,
      setAppName: (name) => set({ appName: name.trim() || DEFAULT_APP_NAME }),
      setAccentColor: (color) => set({ accentColor: color }),
      resetSettings: () => set({ appName: DEFAULT_APP_NAME, accentColor: DEFAULT_ACCENT_COLOR }),
    }),
    { name: "app-settings" }
  )
)
