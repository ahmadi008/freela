import { useState } from 'react'
import { Sparkles, Loader2, Copy, MessageSquare, Wand2 } from 'lucide-react'
import { generateClientMessage } from '../services/aiService.js'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { copyToClipboard } from '../utils/helpers.js'
import { useApp } from '../context/AppContext.jsx'

const SCENARIOS = [
  { id: 'greeting',  label: 'First reply',         desc: 'Introduce yourself to a new lead.' },
  { id: 'clarify',   label: 'Ask for clarification', desc: 'Get more info before quoting.' },
  { id: 'followup',  label: 'Follow up',           desc: 'Re-engage a lead that went quiet.' },
  { id: 'decline',   label: 'Politely decline',    desc: 'Pass on a project gracefully.' },
  { id: 'negotiate', label: 'Negotiate price',     desc: 'Counter-offer or discuss scope.' },
  { id: 'deliver',   label: 'Project delivered',   desc: 'Hand off completed work professionally.' },
]

const TONES = ['friendly', 'professional', 'concise']

export default function Communication() {
  const { showToast } = useApp()
  const [scenario, setScenario] = useState('greeting')
  const [tone, setTone]         = useState('friendly')
  const [context, setContext]   = useState('')
  const [message, setMessage]   = useState('')
  const [output, setOutput]     = useState('')
  const [loading, setLoading]   = useState(false)

  const generate = async () => {
    if (!message.trim() && scenario !== 'greeting' && scenario !== 'followup' && scenario !== 'deliver') {
      showToast('Add a client message or context first', 'error')
      return
    }
    setLoading(true)
    setOutput('')
    try {
      const result = await generateClientMessage({ scenario, message, tone, context })
      setOutput(result)
    } catch (err) {
      showToast('Generation failed: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    const ok = await copyToClipboard(output)
    showToast(ok ? 'Copied!' : 'Copy failed', ok ? 'success' : 'error')
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-slate-900">What's the situation?</h3>
          <p className="mt-1 text-sm text-slate-500">Pick a scenario, paste any context, and choose a tone.</p>

          <div className="mt-5">
            <label className="label">Scenario</label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`text-left rounded-lg border p-3 transition ${
                    scenario === s.id
                      ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-200'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <p className={`text-sm font-semibold ${scenario === s.id ? 'text-brand-700' : 'text-slate-900'}`}>{s.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <label className="label">Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                    tone === t
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Client message (optional)</label>
              <textarea rows={4} className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Paste the client's message here…" />
            </div>
            <div>
              <label className="label">Additional context</label>
              <textarea rows={4} className="textarea" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Project budget, deadline, key requirements…" />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button onClick={generate} disabled={loading} className="btn-primary">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {loading ? 'Generating…' : 'Generate message'}
            </button>
          </div>
        </div>

        {loading && <div className="card flex justify-center py-16"><LoadingSpinner label="Crafting your message…" /></div>}

        {output && !loading && (
          <div className="card animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">Suggested message</h4>
              <button onClick={copy} className="btn-ghost text-xs">
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
            </div>
            <div className="prose-freela whitespace-pre-wrap rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200">
              {output}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={copy} className="btn-secondary"><Copy className="h-4 w-4" /> Copy</button>
              <button onClick={generate} className="btn-primary"><Wand2 className="h-4 w-4" /> Regenerate</button>
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="card bg-gradient-to-br from-brand-50 to-accent-50 ring-brand-200">
          <div className="flex items-center gap-2 text-brand-700">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-semibold">Communication coach</h3>
          </div>
          <p className="mt-2 text-sm text-slate-700">
            Strong client communication wins projects. Use these templates to respond faster and more professionally.
          </p>
        </div>

        <div className="card">
          <h4 className="font-semibold text-slate-900">Communication tips</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2"><span>🎯</span> Respond within 24 hours</li>
            <li className="flex gap-2"><span>📋</span> Restate the goal in your reply</li>
            <li className="flex gap-2"><span>⏱️</span> Always include a clear next step</li>
            <li className="flex gap-2"><span>🤝</span> Be honest about scope and timelines</li>
            <li className="flex gap-2"><span>✨</span> End with a friendly sign-off</li>
          </ul>
        </div>
      </aside>
    </div>
  )
}
