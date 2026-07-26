// =============================================================
// ThemeContext — manages brand color theme AND dark/light mode.
// Dark mode: toggles .dark class on <html>, persists to localStorage.
// Color theme: applies CSS variables (--brand / --accent) on <html>.
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

const THEME_KEY = 'freela:theme'
const DARK_KEY  = 'freela:dark'

const ThemeContext = createContext(null)

function applyColorTheme(themeId) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0]
  const root = document.documentElement
  root.style.setProperty('--brand', theme.brand)
  root.style.setProperty('--accent', theme.accent)
  root.dataset.theme = theme.id
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'indigo' } catch { return 'indigo' }
  })

  const [isDark, setIsDarkState] = useState(() => {
    try { return localStorage.getItem(DARK_KEY) === 'true' } catch { return false }
  })

  // Apply color theme whenever it changes
  useEffect(() => {
    applyColorTheme(theme)
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
  }, [theme])

  // Apply dark mode whenever it changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try { localStorage.setItem(DARK_KEY, String(isDark)) } catch {}
  }, [isDark])

  const setTheme = useCallback((id) => {
    if (THEMES.some((t) => t.id === id)) setThemeState(id)
  }, [])

  const toggleDark = useCallback(() => setIsDarkState((d) => !d), [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, isDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) return { theme: 'indigo', setTheme: () => {}, themes: THEMES, isDark: false, toggleDark: () => {} }
  return ctx
}