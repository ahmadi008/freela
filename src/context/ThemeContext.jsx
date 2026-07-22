// =============================================================
// ThemeContext — lets users pick a brand color theme at runtime.
// Themes are applied as CSS variables on document.documentElement.
// =============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export const THEMES = [
  { id: 'indigo',  name: 'Indigo',   brand: '#4f46e5', accent: '#d946ef' },
  { id: 'emerald', name: 'Emerald',  brand: '#059669', accent: '#0891b2' },
  { id: 'rose',    name: 'Rose',     brand: '#e11d48', accent: '#f97316' },
  { id: 'amber',   name: 'Amber',    brand: '#d97706', accent: '#dc2626' },
  { id: 'sky',     name: 'Sky',      brand: '#0284c7', accent: '#7c3aed' },
  { id: 'violet',  name: 'Violet',   brand: '#7c3aed', accent: '#ec4899' },
]

const STORAGE_KEY = 'freela:theme'

const ThemeContext = createContext(null)

function applyTheme(themeId) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0]
  const root = document.documentElement
  root.style.setProperty('--brand', theme.brand)
  root.style.setProperty('--accent', theme.accent)
  root.dataset.theme = theme.id
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || 'indigo' }
    catch { return 'indigo' }
  })

  useEffect(() => {
    applyTheme(theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme])

  const setTheme = useCallback((id) => {
    if (THEMES.some((t) => t.id === id)) setThemeState(id)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) return { theme: 'indigo', setTheme: () => {}, themes: THEMES }
  return ctx
}
