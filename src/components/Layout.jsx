import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, Search, FileText, ListChecks, MessageSquare,
  Sparkles, Menu, X, Home as HomeIcon, Zap
} from 'lucide-react'
import { cn } from '../utils/helpers.js'
import { useApp } from '../context/AppContext.jsx'
import { isUsingRealAI } from '../services/aiService.js'
import ThemeSwitcher from './ThemeSwitcher.jsx'

const NAV = [
  { to: '/dashboard',     label: 'Dashboard',          icon: LayoutDashboard },
  { to: '/profile',       label: 'My Profile',         icon: User },
  { to: '/analyzer',      label: 'Project Analyzer',   icon: Search },
  { to: '/proposals',     label: 'Proposal Generator', icon: FileText },
  { to: '/tracker',       label: 'Opportunity Tracker',icon: ListChecks },
  { to: '/communication', label: 'Client Comms',       icon: MessageSquare },
]

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
        isActive
          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
      )}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn(
            'h-5 w-5 flex-shrink-0',
            isActive
              ? 'text-brand-600 dark:text-brand-400'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
          )} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const { profile } = useApp()
  const location = useLocation()
  const usingAI = isUsingRealAI()

  const currentPage = NAV.find((n) => n.to === location.pathname) || NAV[0]
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Mobile top bar ─────────────────────────────────────── */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">Freela</span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeSwitcher compact />
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex">
        {/* ── Sidebar ────────────────────────────────────────────── */}
        <aside className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex h-full flex-col overflow-y-auto">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 px-6 pt-5 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">Freela</span>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500 -mt-0.5">AI Freelance Coach</p>
              </div>
            </Link>

            {/* Back to landing */}
            <Link
              to="/"
              className="mx-3 mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-300 transition"
            >
              <HomeIcon className="h-3.5 w-3.5" />
              Back to landing page
            </Link>

            {/* Nav */}
            <nav className="flex-1 space-y-0.5 px-3">
              <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-600">
                Workspace
              </p>
              {NAV.map((item) => (
                <NavItem key={item.to} {...item} onClick={() => setOpen(false)} />
              ))}
            </nav>

            {/* AI status badge */}
            <div className="px-4 py-2">
              <div className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium',
                usingAI
                  ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-800'
                  : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800'
              )}>
                <Zap className="h-3.5 w-3.5 flex-shrink-0" />
                {usingAI ? 'Live AI (OpenAI)' : 'Demo mode — no API key'}
              </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-slate-200 dark:border-slate-800 px-4 py-4 space-y-3">
              {/* Profile row */}
              <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-accent-500 text-xs font-bold text-white flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {profile?.name || 'Your Name'}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-500">
                    {profile?.title || 'Add your title →'}
                  </p>
                </div>
              </div>

              {/* Theme + dark mode controls */}
              <ThemeSwitcher compact={false} />
            </div>
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Desktop page header */}
          <div className="hidden lg:flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 sticky top-0 z-10">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {currentPage.label}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher compact />
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}