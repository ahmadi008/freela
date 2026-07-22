// =============================================================
// helpers.js — small utilities used across pages
// =============================================================

export const cn = (...args) =>
  args.flat().filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()

export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export const formatDateTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const timeAgo = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  const intervals = [
    [31536000, 'year'],
    [2592000,  'month'],
    [86400,    'day'],
    [3600,     'hour'],
    [60,       'minute'],
  ]
  for (const [s, label] of intervals) {
    const v = Math.floor(seconds / s)
    if (v >= 1) return `${v} ${label}${v > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

export const truncate = (str, n = 140) => {
  if (!str) return ''
  if (str.length <= n) return str
  return str.slice(0, n).trim() + '…'
}

export const wordCount = (str) =>
  str ? str.trim().split(/\s+/).filter(Boolean).length : 0

export const readingTime = (str) => {
  const wpm = 200
  return Math.max(1, Math.ceil(wordCount(str) / wpm))
}

export const initials = (name) => {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export const downloadText = (filename, text) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Skill matching for project fit scoring
export const calculateMatch = (userSkills = [], requiredSkills = []) => {
  if (!requiredSkills.length) return { score: 0, matched: [], missing: [] }
  const u = new Set(userSkills.map((s) => s.toLowerCase().trim()))
  const matched = []
  const missing = []
  for (const req of requiredSkills) {
    const r = req.toLowerCase().trim()
    if ([...u].some((s) => r.includes(s) || s.includes(r))) matched.push(req)
    else missing.push(req)
  }
  return {
    score: Math.round((matched.length / requiredSkills.length) * 100),
    matched,
    missing,
  }
}
