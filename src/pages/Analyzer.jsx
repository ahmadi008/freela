import { useState } from 'react'
import { Search, Sparkles, Loader2, Save, AlertTriangle, Clock, DollarSign, Target, ListChecks, CheckCircle2, XCircle, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { analyzeProject, matchProjectToProfile } from '../services/aiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { calculateMatch, timeAgo } from '../utils/helpers.js'

const SAMPLE = `Build a React landing page for our SaaS startup

We need a clean, modern landing page built with React and Tailwind CSS.
Must be fully responsive and SEO-friendly.

Requirements:
- React + Tailwind
- Mobile-first responsive design
- Hero, features, pricing, and contact sections
- Integration with our Hubspot form
- Lighthouse score 90+

Budget: $500
Timeline: 1 week
Start: ASAP`

export default function Analyzer() {
  const { profile, projects, addProject, addApplication, showToast } = useApp()
  const [description, setDescription] = useState('')
  const [title, setTitle]           = useState('')
  const [budget, setBudget]         = useState('')
  const [analysis, setAnalysis]     = useState(null)
  const [match, setMatch]           = useState(null)
  const [loading, setLoading]       = useState(false)

  const run = async () => {
    if (!description.trim()) {
      showToast('Paste a project description first', 'error')
      return
    }
    setLoading(true)
    setAnalysis(null)
    setMatch(null)
    try {
      const fullText = [title, description, budget ? `Budget: ${budget}` : ''].filter(Boolean).join('\n\n')
      const result = await analyzeProject(fullText)
      setAnalysis(result)
      if (profile.skills?.length) {
        const m = await matchProjectToProfile({ skillsRequired: result.skillsRequired }, profile)
        setMatch(m)
      }
    } catch (err) {
      showToast('Analysis failed: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const save = () => {
    if (!analysis) return
    addProject({
      title: title || analysis.title,
      description,
      budget: budget || analysis.budget,
      clientRequirements: analysis.clientRequirements,
      skillsRequired: analysis.skillsRequired,
      tone: analysis.tone,
      redFlags: analysis.redFlags,
    })
  }

  const trackApp = () => {
    if (!analysis) return
    addApplication({
      projectTitle: title || analysis.title,
      budget: budget || analysis.budget,
      status: 'Saved',
    })
  }

  const localMatch = analysis && profile.skills?.length
    ? calculateMatch(profile.skills, analysis.skillsRequired)
    : null

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Paste a project description</h3>
            <p className="mt-1 text-sm text-slate-500">The AI will extract requirements, skills, tone, and red flags.</p>
          </div>
          <button
            onClick={() => { setDescription(SAMPLE); setTitle('Build a React landing page'); setBudget('$500') }}
            className="btn-ghost text-xs"
          >
            Try sample
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Project title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build a React landing page" />
          </div>
          <div>
            <label className="label">Budget (optional)</label>
            <input className="input" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="$500" />
          </div>
          <div>
            <label className="label">Project description</label>
            <p className="text-xs text-slate-500">Tip: paste the full job post — the more context, the better the analysis.</p>
          </div>
          <div className="sm:col-span-2">
            <textarea
              rows={8}
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste the full project description here…"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button onClick={run} disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Analyzing…' : 'Analyze project'}
          </button>
        </div>
      </div>

      {loading && <div className="card flex justify-center py-12"><LoadingSpinner label="Analyzing project…" /></div>}

      {analysis && !loading && (
        <div className="space-y-6 animate-slide-up">
          {/* Summary card */}
          <div className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{analysis.title}</h3>
                <p className="mt-1 text-slate-600">{analysis.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.tone && <span className="badge badge-purple capitalize">{analysis.tone}</span>}
                {analysis.budget && <span className="badge badge-green"><DollarSign className="h-3 w-3" />{analysis.budget}</span>}
                {analysis.estimatedHours && <span className="badge badge-slate"><Clock className="h-3 w-3" />{analysis.estimatedHours}</span>}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button onClick={save} className="btn-secondary">
                <Save className="h-4 w-4" /> Save project
              </button>
              <button onClick={trackApp} className="btn-secondary">
                <ListChecks className="h-4 w-4" /> Track application
              </button>
              <Link
                to="/proposals"
                state={{ project: { title: title || analysis.title, description, budget: budget || analysis.budget } }}
                className="btn-primary"
              >
                <FileText className="h-4 w-4" /> Generate proposal
              </Link>
            </div>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-slate-900">Client requirements</h4>
              </div>
              <ul className="space-y-2">
                {analysis.clientRequirements.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-700">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-brand-600" />
                <h4 className="font-semibold text-slate-900">Skills required</h4>
              </div>
              {analysis.skillsRequired.length ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.skillsRequired.map((s) => <span key={s} className="badge badge-brand">{s}</span>)}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No specific skills detected.</p>
              )}
            </div>

            {(localMatch || match) && (
              <div className="card lg:col-span-2">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-accent-500" />
                  <h4 className="font-semibold text-slate-900">Your fit for this project</h4>
                </div>
                {(() => {
                  const m = match || localMatch
                  return (
                    <>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="text-3xl font-bold text-slate-900">{m.score}<span className="text-base text-slate-400">%</span></div>
                          <p className="text-xs text-slate-500">match</p>
                        </div>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                          <div className={`h-full rounded-full transition-all ${
                            m.score >= 75 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            m.score >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                            'bg-gradient-to-r from-red-500 to-pink-500'
                          }`} style={{ width: `${m.score}%` }} />
                        </div>
                      </div>
                      {m.matched?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">You match</p>
                          <div className="flex flex-wrap gap-1.5">
                            {m.matched.map((s) => <span key={s} className="badge badge-green"><CheckCircle2 className="h-3 w-3" />{s}</span>)}
                          </div>
                        </div>
                      )}
                      {m.missing?.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Gaps to address</p>
                          <div className="flex flex-wrap gap-1.5">
                            {m.missing.map((s) => <span key={s} className="badge badge-amber"><XCircle className="h-3 w-3" />{s}</span>)}
                          </div>
                        </div>
                      )}
                      {m.advice && (
                        <p className="mt-4 rounded-lg bg-brand-50 p-3 text-sm text-brand-900 ring-1 ring-brand-200">
                          💡 {m.advice}
                        </p>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            {analysis.redFlags?.length > 0 && (
              <div className="card lg:col-span-2 border-amber-200 bg-amber-50/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-semibold text-slate-900">Watch out for</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.redFlags.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent saved projects */}
      {projects.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-900">Recently analyzed</h3>
          <ul className="mt-4 divide-y divide-slate-200">
            {projects.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 truncate">{p.title}</p>
                  <p className="text-xs text-slate-500">{p.budget} · {timeAgo(p.createdAt)}</p>
                </div>
                <Link
                  to="/proposals"
                  state={{ project: { title: p.title, description: p.description, budget: p.budget } }}
                  className="btn-ghost text-xs"
                >
                  Propose <FileText className="h-3.5 w-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
