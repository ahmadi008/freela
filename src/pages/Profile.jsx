import { useState } from 'react'
import { Save, Plus, X, Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw, User as UserIcon } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { reviewProfile } from '../services/aiService.js'
import { initials } from '../utils/helpers.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'

const SUGGESTED_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python',
  'Figma', 'UI/UX Design', 'WordPress', 'SEO', 'Content Writing', 'Data Analysis',
]

const LEVELS = ['Beginner', 'Intermediate', 'Expert']

export default function Profile() {
  const { profile, updateProfile, showToast } = useApp()
  const [draft, setDraft]       = useState(profile)
  const [newSkill, setNewSkill] = useState('')
  const [review, setReview]     = useState(null)
  const [loading, setLoading]   = useState(false)

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))

  const addSkill = (skill) => {
    const s = (skill || newSkill).trim()
    if (!s) return
    if (draft.skills.includes(s)) {
      showToast('Skill already added', 'info')
      return
    }
    set({ skills: [...draft.skills, s] })
    setNewSkill('')
  }

  const removeSkill = (s) => set({ skills: draft.skills.filter((x) => x !== s) })

  const save = (e) => {
    e.preventDefault()
    updateProfile(draft)
    showToast('Profile saved!')
  }

  const runReview = async () => {
    if (!draft.name) {
      showToast('Add your name first', 'error')
      return
    }
    setLoading(true)
    setReview(null)
    try {
      const result = await reviewProfile(draft)
      setReview(result)
    } catch (err) {
      showToast('Review failed: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const applyBio = () => {
    if (review?.rewrittenBio) {
      set({ bio: review.rewrittenBio })
      showToast('Bio updated!')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Form */}
      <form onSubmit={save} className="lg:col-span-2 space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Basic information</h3>
          <p className="mt-1 text-sm text-slate-500">Your name and professional headline.</p>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={draft.name} onChange={(e) => set({ name: e.target.value })} placeholder="Sara Ahmadi" />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={draft.email} onChange={(e) => set({ email: e.target.value })} placeholder="sara@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Professional title</label>
              <input className="input" value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="Frontend Developer" />
            </div>
            <div>
              <label className="label">Experience level</label>
              <select className="input" value={draft.experienceLevel} onChange={(e) => set({ experienceLevel: e.target.value })}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Hourly rate (USD)</label>
              <input className="input" value={draft.hourlyRate} onChange={(e) => set({ hourlyRate: e.target.value })} placeholder="$50/hr" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Portfolio URL</label>
              <input className="input" value={draft.portfolioUrl} onChange={(e) => set({ portfolioUrl: e.target.value })} placeholder="https://yourportfolio.com" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Bio</label>
              <textarea rows={4} className="textarea" value={draft.bio} onChange={(e) => set({ bio: e.target.value })} placeholder="Tell clients about yourself, your style, and what you ship…" />
              <p className="mt-1.5 text-xs text-slate-500">{draft.bio.length} characters · aim for 150-300.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">Skills</h3>
          <p className="mt-1 text-sm text-slate-500">Add the technologies and services you offer. The AI uses these to tailor every proposal.</p>

          <div className="mt-5">
            <label className="label">Add a skill</label>
            <div className="flex gap-2">
              <input
                className="input"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                placeholder="e.g. React, Figma, SEO…"
              />
              <button type="button" onClick={() => addSkill()} className="btn-primary">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </div>

          {draft.skills.length > 0 && (
            <div className="mt-5">
              <label className="label">Your skills ({draft.skills.length})</label>
              <div className="flex flex-wrap gap-2">
                {draft.skills.map((s) => (
                  <span key={s} className="badge badge-brand gap-1 pl-3 pr-1">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)} className="ml-1 rounded p-0.5 hover:bg-brand-100">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="text-xs font-medium text-slate-500 mb-2">Suggested:</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_SKILLS.filter((s) => !draft.skills.includes(s)).slice(0, 8).map((s) => (
                <button key={s} type="button" onClick={() => addSkill(s)} className="badge badge-slate hover:bg-slate-200 transition">
                  <Plus className="h-3 w-3" /> {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => setDraft(profile)} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Reset
          </button>
          <button type="submit" className="btn-primary">
            <Save className="h-4 w-4" /> Save profile
          </button>
        </div>
      </form>

      {/* AI Review panel */}
      <aside className="space-y-4">
        <div className="card bg-gradient-to-br from-brand-50 to-accent-50 ring-brand-200">
          <div className="flex items-center gap-2 text-brand-700">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-semibold">AI profile review</h3>
          </div>
          <p className="mt-2 text-sm text-slate-700">
            Get instant, personalized feedback on how to make your profile stand out.
          </p>
          <button onClick={runReview} disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? 'Analyzing…' : 'Review my profile'}
          </button>
        </div>

        {loading && (
          <div className="card flex items-center justify-center py-12">
            <LoadingSpinner label="Running AI review…" />
          </div>
        )}

        {review && !loading && (
          <div className="card animate-slide-up">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Profile score</h4>
              <span className="text-2xl font-bold text-brand-600">{review.score}<span className="text-sm text-slate-400">/100</span></span>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all" style={{ width: `${review.score}%` }} />
            </div>

            {review.strengths?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-2">Strengths</p>
                <ul className="space-y-1.5">
                  {review.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.improvements?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-2">Improvements</p>
                <ul className="space-y-1.5">
                  {review.improvements.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-700">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-500 mt-0.5" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.rewrittenBio && (
              <div className="mt-5 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Suggested bio</p>
                <p className="text-sm text-slate-700 italic">"{review.rewrittenBio}"</p>
                <button onClick={applyBio} className="btn-secondary mt-3 w-full">
                  <Sparkles className="h-4 w-4" /> Use this bio
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile preview */}
        <div className="card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Preview</p>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-semibold">
              {initials(draft.name) || <UserIcon className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 truncate">{draft.name || 'Your name'}</p>
              <p className="text-sm text-slate-500 truncate">{draft.title || 'Your title'}</p>
            </div>
          </div>
          {draft.bio && <p className="mt-3 text-sm text-slate-600 line-clamp-3">{draft.bio}</p>}
        </div>
      </aside>
    </div>
  )
}
