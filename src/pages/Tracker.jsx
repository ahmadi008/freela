import { useState } from 'react'
import { Plus, ListChecks, Trash2, Edit3, Save, X, Filter, DollarSign, Calendar, Building2 } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { formatDate, timeAgo } from '../utils/helpers.js'

const STATUSES = ['Saved', 'Submitted', 'Interviewing', 'Won', 'Lost']
const STATUS_STYLES = {
  Saved:         'badge-slate',
  Submitted:     'badge-brand',
  Interviewing:  'badge-amber',
  Won:           'badge-green',
  Lost:          'badge-red',
}

export default function Tracker() {
  const { applications, addApplication, updateApplication, removeApplication, showToast } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState(null)
  const [filter, setFilter]     = useState('All')
  const [draft, setDraft]       = useState(emptyDraft())

  function emptyDraft() {
    return {
      projectTitle: '',
      client: '',
      budget: '',
      status: 'Saved',
      deadline: '',
      notes: '',
      url: '',
    }
  }

  const startEdit = (app) => {
    setEditing(app.id)
    setDraft({ ...app })
    setShowForm(true)
  }

  const submit = (e) => {
    e.preventDefault()
    if (!draft.projectTitle.trim()) {
      showToast('Project title is required', 'error')
      return
    }
    if (editing) {
      updateApplication(editing, draft)
      showToast('Application updated')
    } else {
      addApplication(draft)
    }
    setDraft(emptyDraft())
    setEditing(null)
    setShowForm(false)
  }

  const cancel = () => {
    setDraft(emptyDraft())
    setEditing(null)
    setShowForm(false)
  }

  const filtered = filter === 'All' ? applications : applications.filter((a) => a.status === filter)

  const stats = {
    total: applications.length,
    active: applications.filter((a) => !['Won', 'Lost'].includes(a.status)).length,
    won: applications.filter((a) => a.status === 'Won').length,
    lost: applications.filter((a) => a.status === 'Lost').length,
  }

  return (
    <div className="space-y-6">
      {/* Pipeline stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <PipelineStat label="Total"      value={stats.total}  color="slate" />
        <PipelineStat label="Active"      value={stats.active} color="brand" />
        <PipelineStat label="Won"         value={stats.won}    color="green" />
        <PipelineStat label="Lost"        value={stats.lost}   color="red" />
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Pipeline</h3>
            <p className="text-sm text-slate-500">Track every opportunity from first contact to signed contract.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input max-w-[160px]">
              <option value="All">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="btn-primary">
                <Plus className="h-4 w-4" /> Add opportunity
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-slate-200 pt-6 animate-slide-down">
            <div className="sm:col-span-2">
              <label className="label">Project title *</label>
              <input required className="input" value={draft.projectTitle} onChange={(e) => setDraft({ ...draft, projectTitle: e.target.value })} placeholder="e.g. Build a React landing page" />
            </div>
            <div>
              <label className="label">Client</label>
              <input className="input" value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} placeholder="Acme Corp" />
            </div>
            <div>
              <label className="label">Budget</label>
              <input className="input" value={draft.budget} onChange={(e) => setDraft({ ...draft, budget: e.target.value })} placeholder="$500" />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Deadline</label>
              <input type="date" className="input" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Job URL</label>
              <input className="input" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://upwork.com/..." />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Notes</label>
              <textarea rows={3} className="textarea" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="Next steps, contact info, key requirements…" />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={cancel} className="btn-secondary">
                <X className="h-4 w-4" /> Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Save className="h-4 w-4" /> {editing ? 'Update' : 'Add'} opportunity
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={filter === 'All' ? 'No opportunities tracked yet' : `No ${filter} opportunities`}
          description={filter === 'All' ? 'Add your first opportunity to start building your pipeline.' : 'Try a different filter, or add a new opportunity.'}
          action={filter === 'All' && <button onClick={() => setShowForm(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add opportunity</button>}
        />
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 bg-slate-50">
            <div className="col-span-5">Project</div>
            <div className="col-span-2">Budget</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Added</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          <ul className="divide-y divide-slate-200">
            {filtered.map((a) => (
              <li key={a.id} className="px-6 py-4 hover:bg-slate-50 transition">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5">
                    <p className="font-medium text-slate-900">{a.projectTitle}</p>
                    {a.client && <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Building2 className="h-3 w-3" />{a.client}</p>}
                    {a.notes && <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{a.notes}</p>}
                  </div>
                  <div className="sm:col-span-2 text-sm text-slate-700">
                    {a.budget ? <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{a.budget.replace('$', '')}</span> : <span className="text-slate-400">—</span>}
                  </div>
                  <div className="sm:col-span-2">
                    <select
                      value={a.status}
                      onChange={(e) => updateApplication(a.id, { status: e.target.value })}
                      className="text-xs rounded-md border-0 ring-1 ring-inset ring-slate-300 px-2 py-1 focus:ring-2 focus:ring-brand-600"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2 text-xs text-slate-500">{timeAgo(a.createdAt)}</div>
                  <div className="sm:col-span-1 flex justify-end gap-1">
                    <button onClick={() => startEdit(a)} className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded" title="Edit">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => { if (confirm('Delete this application?')) removeApplication(a.id) }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function PipelineStat({ label, value, color }) {
  const colors = {
    slate: 'bg-slate-100 text-slate-700',
    brand: 'bg-brand-50 text-brand-700',
    green: 'bg-green-50 text-green-700',
    red:   'bg-red-50 text-red-700',
  }
  return (
    <div className="card text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-3xl font-bold ${colors[color].split(' ')[1]}`}>{value}</p>
    </div>
  )
}
