// netlify/functions/ai.mjs
// Netlify v2 function — uses Web API Request / Response.
// Proxies AI calls to OpenRouter (free models). Key stays server-side.

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free'

export default async function handler(req) {

  // Health check — lets the frontend know a key is configured.
  if (req.method === 'GET') {
    return Response.json({ configured: Boolean(process.env.OPENROUTER_API_KEY) })
  }

  if (req.method !== 'POST') {
    return Response.json({ code: 'method_not_allowed', error: 'Method not allowed' }, { status: 405 })
  }

  let payload
  try {
    payload = await req.json()
  } catch {
    return Response.json({ code: 'bad_request', error: 'Invalid JSON body' }, { status: 400 })
  }

  const { system, user } = payload
  if (!system || !user) {
    return Response.json(
      { code: 'bad_request', error: 'Missing "system" or "user" prompt' },
      { status: 400 }
    )
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return Response.json(
      { code: 'missing_key', error: 'OPENROUTER_API_KEY is not set on the server.' },
      { status: 500 }
    )
  }

  try {
    const upstream = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.get('origin') || 'https://freela-zahra.netlify.app',
        'X-Title': 'Freela',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    const raw = await upstream.text()

    if (!upstream.ok) {
      let code = 'upstream_error'
      let message = `AI provider error (${upstream.status})`
      try {
        const parsed = JSON.parse(raw)
        if (parsed?.error?.code) code = String(parsed.error.code)
        if (parsed?.error?.message) message = parsed.error.message
      } catch { /* ignore */ }
      if (upstream.status === 401) message = 'Invalid or missing OpenRouter API key.'
      else if (upstream.status === 429) message = 'Rate limit reached — try again in a minute.'
      return Response.json({ code, error: message }, { status: upstream.status })
    }

    const data = JSON.parse(raw)
    const text = data.choices?.[0]?.message?.content?.trim() || ''
    return Response.json({ text })

  } catch (err) {
    return Response.json(
      { code: 'upstream_error', error: 'Failed to reach OpenRouter: ' + (err?.message || 'unknown') },
      { status: 502 }
    )
  }
}
