import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, User, Search, FileText, ListChecks, MessageSquare,
  Sparkles, Menu, X, Github, Home as HomeIcon
} from 'lucide-react'
import { cn } from '../utils/helpers.js'
import { useApp } from '../context/AppContext.jsx'
import { isUsingRealAI } from '../services/aiService.js'


const NAV = [
  { to: '/dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/profile',       label: 'My Profile',    icon: User },
  { to: '/analyzer',      label: 'Project Analyzer', icon: Search },
  { to: '/proposals',     label: 'Proposal Generator', icon: FileText },
  { to: '/tracker',       label: 'Opportunity Tracker', icon: ListChecks },
  { to: '/communication', label: 'Client Comms',  icon: MessageSquare },
]

function NavItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
        isActive
          ? 'bg-brand-50 text-brand-700 shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('h-5 w-5', isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600')} />
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900">Freela</span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}>
          <div className="flex h-full flex-col">
            <Link to="/" className="flex items-center gap-2 px-6 pt-5 pb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900">Freela</span>
                <p className="text-[11px] font-medium text-slate-500 -mt-0.5">AI Freelance Coach</p>
              </div>
            </Link>

            <Link to="/" className="mx-3 mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
              <HomeIcon className="h-3.5 w-3.5" /> Back to landing page
            </Link>

            <nav className="flex-1 space-y-1 px-3">
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Workspace
              </p>
              {NAV.map((n) => (
                <NavItem key={n.to} {...n} onClick={() => setOpen(false)} />
              ))}
            </nav>

            <div className="border-t border-slate-200 p-4 space-y-3">
              
              <div className={cn(
                'rounded-lg p-3 text-xs',
                usingAI ? 'bg-green-50 ring-1 ring-green-200' : 'bg-amber-50 ring-1 ring-amber-200'
              )}>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span className={cn('h-2 w-2 rounded-full', usingAI ? 'bg-green-500' : 'bg-amber-500')} />
                  <span className={usingAI ? 'text-green-700' : 'text-amber-700'}>
                    {usingAI ? 'Real AI connected' : 'Demo mode'}
                  </span>
                </div>
                <p className={cn('mt-1', usingAI ? 'text-green-700' : 'text-amber-700')}>
                  {usingAI
                    ? 'OpenAI API key detected. Using live AI.'
                    : 'Add VITE_OPENAI_API_KEY to enable live AI.'}
                </p>
              </div>
              <a
                href="https://github.com"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-700"
              >
                <Github className="h-3.5 w-3.5" />
                <span>View source</span>
              </a>
            </div>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <PageHeader title={currentPage?.label || 'Freela'} />
            <div className="animate-fade-in">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

function PageHeader({ title }) {
  const { profile } = useApp()
  const greeting = profile?.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Welcome to Freela'
  return (
    <div className="mb-6 lg:mb-8">
      <p className="text-sm font-medium text-brand-600">{greeting} 👋</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
    </div>
  )
}
