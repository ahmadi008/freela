import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Sparkles, Loader2, Save, Copy, Download, Trash2, Edit3, ArrowLeft,
  FileText, CheckCircle2, Clock, Wand2, FileType
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { generateProposal } from '../services/aiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { copyToClipboard, downloadText, wordCount, readingTime, timeAgo } from '../utils/helpers.js'
import { downloadAsDocx, downloadAsPdf } from '../utils/exporters.js'
export default function Proposals() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, proposals, addProposal, updateProposal, removeProposal, showToast } = useApp()

  const [project, setProject]   = useState({ title: '', description: '', budget: '' })
  const [content, setContent]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [editingId, setEditing] = useState(null)

  // If we navigated here from the Analyzer, prefill the project.
  useEffect(() => {
    if (location.state?.project) {
      setProject(location.state.project)
    }
  }, [location.state])

  const generate = async () => {
    if (!project.title?.trim() && !project.description?.trim()) {
      showToast('Add a project title or description first', 'error')
      return
    }
    if (!profile.name) {
      showToast('Set up your profile first for personalized proposals', 'error')
      setTimeout(() => navigate('/profile'), 800)
      return
    }
    setLoading(true)
    try {
      const text = await generateProposal(project, profile)
      setContent(text)
    } catch (err) {
      showToast('Generation failed: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const save = () => {
    if (!content.trim()) {
      showToast('Nothing to save yet', 'error')
      return
    }
    if (editingId) {
      updateProposal(editingId, { projectTitle: project.title, content, budget: project.budget })
      setEditing(null)
    } else {
      addProposal({
        projectTitle: project.title || 'Untitled project',
        content,
        budget: project.budget,
        projectSnapshot: project,
      })
    }
    setContent('')
    setProject({ title: '', description: '', budget: '' })
  }

  const loadProposal = (p) => {
    setProject({
      title: p.projectTitle,
      description: p.projectSnapshot?.description || '',
      budget: p.budget || p.projectSnapshot?.budget || '',
    })
    setContent(p.content)
    setEditing(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const newProposal = () => {
    setContent('')
    setProject({ title: '', description: '', budget: '' })
    setEditing(null)
  }

    const copy = async () => {
    const ok = await copyToClipboard(content)
    showToast(ok ? 'Copied to clipboard' : 'Copy failed', ok ? 'success' : 'error')
  }
  // Three download formats
  const filename = () => project.title || 'proposal'
  const handleDownloadTxt = () => {
    downloadText(`${filename()}.txt`, content)
    showToast('Downloaded .txt', 'success')
  }
  const handleDownloadDocx = async () => {
    try {
      await downloadAsDocx(filename(), content)
      showToast('Downloaded Word document', 'success')
    } catch (err) {
      showToast('Word export failed: ' + err.message, 'error')
    }
  }
  const handleDownloadPdf = () => {
    try {
      downloadAsPdf(filename(), content)
      showToast('Downloaded PDF', 'success')
    } catch (err) {
      showToast('PDF export failed: ' + err.message, 'error')
    }
  }
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main editor */}
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Edit proposal' : 'New proposal'}
              </h3>
              <p className="mt-1 text-sm text-slate-500">Fill in the project details and let AI craft a tailored response.</p>
            </div>
            {editingId && (
              <button onClick={newProposal} className="btn-ghost text-xs">
                <ArrowLeft className="h-3.5 w-3.5" /> New
              </button>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Project title</label>
              <input className="input" value={project.title} onChange={(e) => setProject({ ...project, title: e.target.value })} placeholder="e.g. Build a React landing page" />
            </div>
            <div>
              <label className="label">Budget</label>
              <input className="input" value={project.budget} onChange={(e) => setProject({ ...project, budget: e.target.value })} placeholder="$500" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Project description</label>
              <textarea rows={4} className="textarea" value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} placeholder="Paste the project description to give the AI more context…" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {content ? `${wordCount(content)} words · ${readingTime(content)} min read` : 'No draft yet'}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={generate} disabled={loading} className="btn-primary">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                {loading ? 'Generating…' : content ? 'Regenerate' : 'Generate with AI'}
              </button>
            </div>
          </div>
        </div>

        {loading && (
          <div className="card flex justify-center py-16">
            <LoadingSpinner label="Crafting your proposal…" />
          </div>
        )}

        {content && !loading && (
          <div className="card animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">Proposal draft</h4>
                            <div className="flex flex-wrap gap-1.5">
                <button onClick={copy} className="btn-ghost text-xs" title="Copy text">
                  <Copy className="h-3.5 w-3.5" /> Copy
                </button>
                <button onClick={handleDownloadTxt} className="btn-ghost text-xs" title="Download as plain text">
                  <FileText className="h-3.5 w-3.5" /> .txt
                </button>
                <button onClick={handleDownloadDocx} className="btn-ghost text-xs" title="Download as Word document">
                  <FileType className="h-3.5 w-3.5" /> .docx
                </button>
                <button onClick={handleDownloadPdf} className="btn-ghost text-xs" title="Download as PDF">
                  <Download className="h-3.5 w-3.5" /> .pdf
                </button>
              </div>
            </div>

            <textarea
              rows={20}
              className="textarea font-mono text-sm"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button onClick={copy} className="btn-secondary"><Copy className="h-4 w-4" /> Copy</button>
              <button onClick={save} className="btn-primary">
                <Save className="h-4 w-4" /> {editingId ? 'Update proposal' : 'Save proposal'}
              </button>
            </div>
          </div>
        )}

        {!content && !loading && (
          <div className="card">
            <EmptyState
              icon={Sparkles}
              title="Ready to craft a winning proposal?"
              description="Click 'Generate with AI' above to create a personalized draft based on your profile."
            />
          </div>
        )}
      </div>

      {/* Sidebar: saved proposals */}
      <aside className="space-y-4">
        <div className="card">
          <h3 className="font-semibold text-slate-900">Saved proposals</h3>
          <p className="text-sm text-slate-500">{proposals.length} total</p>

          {proposals.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                icon={FileText}
                title="No saved proposals"
                description="Your generated proposals will appear here."
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {proposals.map((p) => (
                <li key={p.id} className="group rounded-lg border border-slate-200 p-3 hover:border-brand-300 hover:bg-brand-50/30 transition">
                  <div className="flex items-start justify-between gap-2">
                    <button onClick={() => loadProposal(p)} className="min-w-0 flex-1 text-left">
                      <p className="font-medium text-slate-900 line-clamp-1">{p.projectTitle}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" /> {timeAgo(p.createdAt)}
                      </p>
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this proposal?')) removeProposal(p.id) }}
                      className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge badge-slate text-[10px]">
                      <CheckCircle2 className="h-2.5 w-2.5" /> {wordCount(p.content)} words
                    </span>
                    {p.budget && <span className="badge badge-green text-[10px]">{p.budget}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card bg-gradient-to-br from-amber-50 to-orange-50 ring-amber-200">
          <h4 className="font-semibold text-slate-900">💡 Pro tips</h4>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            <li>• Lead with empathy for the client's problem</li>
            <li>• Show 2-3 specific examples of similar work</li>
            <li>• Always include a clear timeline and CTA</li>
            <li>• Edit the AI draft — it should sound like <em>you</em></li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
