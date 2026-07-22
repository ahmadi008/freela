import { useState, useRef, useEffect } from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme, THEMES } from '../context/ThemeContext.jsx'
import { cn } from '../utils/helpers.js'

export default function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen]   = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const current = THEMES.find((t) => t.id === theme) || THEMES[0]

  if (compact) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
          aria-label="Change theme"
          title="Change theme"
        >
          <Palette className="h-4 w-4" />
        </button>
        {open && <Dropdown onPick={(id) => { setTheme(id); setOpen(false) }} current={theme} />}
      </div>
    )
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        <span className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-slate-500" />
          Theme
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full ring-1 ring-slate-300" style={{ background: current.brand }} />
          <span className="text-xs text-slate-500">{current.name}</span>
        </span>
      </button>
      {open && <Dropdown onPick={(id) => { setTheme(id); setOpen(false) }} current={theme} />}
    </div>
  )
}

function Dropdown({ onPick, current }) {
  return (
    <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
      <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Pick a color</p>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onPick(t.id)}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100',
            current === t.id && 'bg-brand-50'
          )}
        >
          <span className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full ring-1 ring-slate-200" style={{ background: `linear-gradient(135deg, ${t.brand} 50%, ${t.accent} 50%)` }} />
            <span>{t.name}</span>
          </span>
          {current === t.id && <Check className="h-3.5 w-3.5 text-brand-600" />}
        </button>
      ))}
    </div>
  )
}
