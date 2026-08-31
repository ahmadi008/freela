// netlify/functions/ai.mjs
// Server-side proxy to OpenRouter (free models). Keeps the API key out of the browser.
// Served at /.netlify/functions/ai and exposed to the frontend at /api/ai.

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free'

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export default async function handler(req) {
  // Health check — lets the frontend know if a key is configured.
  if (req.httpMethod === 'GET') {
    return json(200, { configured: Boolean(process.env.OPENROUTER_API_KEY) })
  }

  if (req.httpMethod !== 'POST') {
    return json(405, { code: 'method_not_allowed', error: 'Method not allowed' })
  }

  let payload
  try {
    payload = JSON.parse(req.body || '{}')
  } catch {
    return json(400, { code: 'bad_request', error: 'Invalid JSON body' })
  }

  const { system, user } = payload
  if (!system || !user) {
    return json(400, { code: 'bad_request', error: 'Missing "system" or "user" prompt' })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return json(500, { code: 'missing_key', error: 'OPENROUTER_API_KEY is not set on the server.' })
  }

  try {
    const upstream = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers?.origin || 'https://freela-zahra.netlify.app',
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
      else if (upstream.status === 429) message = 'Rate limit reached — free models have limits. Try again shortly, or switch models.'
      return json(upstream.status, { code, error: message })
    }

    const data = JSON.parse(raw)
    const text = data.choices?.[0]?.message?.content?.trim() || ''
    return json(200, { text })
  } catch (err) {
    return json(502, { code: 'upstream_error', error: 'Failed to reach OpenRouter: ' + (err?.message || 'unknown error') })
  }
}
