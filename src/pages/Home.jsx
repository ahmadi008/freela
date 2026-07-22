import { Link } from 'react-router-dom'
import {
  FileText, ListChecks, Sparkles, TrendingUp, Search, MessageSquare,
  ArrowRight, CheckCircle2, Clock
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import StatCard from '../components/StatCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { timeAgo, truncate } from '../utils/helpers.js'

export default function Home() {
  const { profile, proposals, applications, projects } = useApp()

  const submitted  = applications.filter((a) => a.status === 'Submitted').length
  const interviewing = applications.filter((a) => a.status === 'Interviewing').length
  const won        = applications.filter((a) => a.status === 'Won').length
  const winRate    = applications.length ? Math.round((won / applications.length) * 100) : 0

  const recentProposals = proposals.slice(0, 3)
  const recentApps      = applications.slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-8 text-white shadow-lg sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered freelance coach
            </div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Win more projects. Land better clients.
            </h2>
            <p className="mt-3 text-brand-100 sm:text-lg">
              Analyze job posts, generate tailored proposals, polish your profile, and keep every opportunity organized — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/analyzer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow hover:bg-slate-50 transition"
              >
                Analyze a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/proposals"
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/20 transition"
              >
                Generate proposal
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-white/10 blur-2xl" />
              <div className="relative grid grid-cols-2 gap-3">
                <FeatureTile icon={Search}      label="Analyze" />
                <FeatureTile icon={FileText}    label="Propose" />
                <FeatureTile icon={MessageSquare} label="Communicate" />
                <FeatureTile icon={TrendingUp}  label="Win" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText}    label="Total proposals"  value={proposals.length}  color="brand" />
        <StatCard icon={ListChecks}  label="Applications"     value={applications.length} color="purple" />
        <StatCard icon={CheckCircle2} label="Won projects"    value={won}  color="green" trend={`${winRate}% win rate`} />
        <StatCard icon={Clock}       label="Interviewing"     value={interviewing} color="amber" />
      </div>

      {/* Profile banner */}
      {!profile.name && (
        <div className="card flex flex-col items-start gap-4 border-2 border-dashed border-brand-200 bg-brand-50/30 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Set up your freelancer profile</h3>
            <p className="mt-1 text-sm text-slate-600">
              Adding your skills and experience unlocks smarter AI recommendations.
            </p>
          </div>
          <Link to="/profile" className="btn-primary">
            Create profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {profile.name && (
        <div className="card flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Share Freela with a friend</h3>
            <p className="mt-1 text-sm text-slate-600">Show the public landing page — great for your portfolio.</p>
          </div>
          <Link to="/" className="btn-secondary">
            View landing page
          </Link>
        </div>
      )}

      {/* Two-column recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent proposals</h3>
            <Link to="/proposals" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {recentProposals.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No proposals yet"
              description="Generate your first AI-tailored proposal in seconds."
              action={<Link to="/proposals" className="btn-primary">Create proposal</Link>}
            />
          ) : (
            <ul className="space-y-3">
              {recentProposals.map((p) => (
                <li key={p.id} className="rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-900 line-clamp-1">{p.projectTitle || 'Untitled project'}</p>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{timeAgo(p.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{truncate(p.content, 120)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent applications</h3>
            <Link to="/tracker" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {recentApps.length === 0 ? (
            <EmptyState
              icon={ListChecks}
              title="No applications tracked"
              description="Add your first opportunity to start tracking progress."
              action={<Link to="/tracker" className="btn-primary">Track opportunity</Link>}
            />
          ) : (
            <ul className="space-y-3">
              {recentApps.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 truncate">{a.projectTitle}</p>
                    {a.client && <p className="text-xs text-slate-500">{a.client}</p>}
                  </div>
                  <span className={`badge ${
                    a.status === 'Won' ? 'badge-green' :
                    a.status === 'Lost' ? 'badge-red' :
                    a.status === 'Interviewing' ? 'badge-amber' :
                    'badge-slate'
                  }`}>{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Skills preview */}
      {profile.skills?.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-900">Your skills</h3>
          <p className="mt-1 text-sm text-slate-500">These are used by the AI to tailor every recommendation.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span key={s} className="badge badge-brand">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureTile({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-4 backdrop-blur">
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}
