// =============================================================
// aiService.js
// -------------------------------------------------------------
// Single entry-point for every AI feature in the app.
//   - generateProposal(project, profile)
//   - analyzeProject(description)
//   - generateClientMessage(scenario, context)
//   - reviewProfile(profile)
//   - matchProjectToProfile(project, profile)
// =============================================================

import { calculateMatch } from '../utils/helpers.js'

// The AI key now lives SERVER-SIDE (see netlify/functions/ai.mjs).
// The browser never sees the key — every AI call goes through the /api/ai proxy.

export async function checkAIStatus() {
  try {
    const res = await fetch('/api/ai', { method: 'GET' })
    const data = await res.json()
    return Boolean(data.configured)
  } catch {
    return false
  }
}

// =============================================================
// Low-level OpenAI caller (only used if a key is set)
// =============================================================
async function callOpenAI(systemPrompt, userPrompt) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: systemPrompt, user: userPrompt }),
  })
  let data = {}
  try { data = await res.json() } catch { /* ignore */ }
  if (!res.ok) {
    const err = new Error(data.error || `AI request failed (${res.status})`)
    err.code = data.code || 'unknown'
    throw err
  }
  return (data.text || '').trim()
}

// =============================================================
// Lightweight local heuristics for demo mode
// =============================================================
function extractSkills(text = '') {
  const KNOWN = [
    'react','next.js','nextjs','vue','angular','svelte','typescript','javascript',
    'node.js','nodejs','express','python','django','flask','fastapi','ruby on rails',
    'php','laravel','java','spring','go','rust','c++','c#','.net',
    'tailwind','css','scss','sass','html','figma','sketch','adobe xd',
    'ui/ux','ux','ui','design','wordpress','shopify','wix','squarespace',
    'seo','content writing','copywriting','blog','ghostwriting','translation',
    'data analysis','sql','postgresql','mysql','mongodb','firebase','supabase',
    'aws','azure','gcp','docker','kubernetes','ci/cd','devops',
    'machine learning','ml','ai','nlp','tensorflow','pytorch','data science',
    'video editing','premiere','final cut','after effects','motion graphics',
    'photography','illustration','3d modeling','blender',
    'marketing','social media','ads','ppc','email marketing','hubspot','mailchimp',
    'sales','crm','cold outreach','lead generation',
    'project management','agile','scrum','jira','asana','notion',
  ]
  const lower = (text || '').toLowerCase()
  const hits = new Set()
  for (const k of KNOWN) if (lower.includes(k)) hits.add(k)
  return [...hits]
}

function extractBudget(text = '') {
  const m = text.match(/\$[\d,]+(?:\s*[-–to]+\s*\$[\d,]+)?/i)
  return m ? m[0] : null
}

function extractTitle(text = '') {
  const firstLine = (text || '').split('\n').map((l) => l.trim()).find(Boolean) || ''
  return firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine
}

function pickTone(text = '') {
  const lower = text.toLowerCase()
  if (lower.includes('urgent') || lower.includes('asap')) return 'urgent'
  if (lower.includes('startup') || lower.includes('mvp')) return 'startup'
  if (lower.includes('enterprise') || lower.includes('large')) return 'enterprise'
  return 'standard'
}

// =============================================================
// FEATURE 1 — generateProposal (PLAIN TEXT, no markdown)
// =============================================================
export async function generateProposal(project, profile) {
  const userPrompt = `
Project title: ${project.title || 'Untitled'}
Project description: ${project.description || ''}
Budget: ${project.budget || 'not specified'}

Freelancer profile:
Name: ${profile.name || 'Freelancer'}
Title: ${profile.title || 'Freelancer'}
Skills: ${(profile.skills || []).join(', ')}
Experience: ${profile.experienceLevel || ''}
Bio: ${profile.bio || ''}
Hourly rate: ${profile.hourlyRate || ''}

Write a personalized, professional freelance proposal with:
1. A warm greeting that references the project specifically
2. A short paragraph showing I understood the client's needs
3. A "How I'd approach this" section (3-4 bullets)
4. A "Why me" section that ties my skills to the project
5. A clear timeline and next-step CTA
`.trim()

  const systemPrompt = `You are a top-tier freelance proposal writer. You write proposals that are warm, specific, and concise. You never use generic filler.

CRITICAL FORMATTING RULES:
- Do NOT use any markdown syntax (no #, ##, **, _, backticks, or special bullet characters).
- Do NOT use any HTML tags.
- Write in PURE PLAIN TEXT only, as if typing in a Notepad document.
- For section labels, use ALL CAPS followed by a colon on its own line (example: "HOW I'D APPROACH THIS:").
- Use simple dashes (-) for list items, never asterisks, numbers, or special unicode.
- The output must look like a professional business letter that can be exported directly to .docx or .pdf without any cleanup.`

  try {
    return await callOpenAI(systemPrompt, userPrompt)
  } catch (err) {
    if (err.code !== 'missing_key') throw err
    console.warn('[aiService] No AI key configured — using demo mode.')
  }

  // -------- Demo mode: smart template (plain text, no markdown) --------
  const skills = (profile.skills || []).slice(0, 4)
  const hasSkill = (s) => skills.some((sk) => sk.toLowerCase().includes(s))
  const approach = []
  if (hasSkill('react') || hasSkill('next'))  approach.push('Build a clean, component-driven UI in React so the design stays maintainable as it grows.')
  if (hasSkill('tailwind') || hasSkill('css'))approach.push('Style with Tailwind CSS for a responsive, mobile-first layout that looks crisp on every device.')
  if (hasSkill('node') || hasSkill('api'))   approach.push('Ship a lightweight API layer with proper validation and error handling.')
  if (hasSkill('figma') || hasSkill('ux'))   approach.push('Translate the Figma file 1:1, paying close attention to spacing, typography, and interaction states.')
  if (!approach.length)                       approach.push('Start with a quick discovery call to align on scope, then deliver in focused milestones with frequent check-ins.')
  while (approach.length < 3)                 approach.push('Keep communication proactive — short daily updates so you always know where things stand.')

  return `Hi there,

Thanks for posting ${project.title || 'this project'} — I read the description carefully and I'm confident I can deliver exactly what you're looking for.

HOW I'D APPROACH THIS:
${approach.map((a) => `- ${a}`).join('\n')}

WHY I'M A GREAT FIT:
${profile.bio ? profile.bio + '\n\n' : ''}I bring hands-on experience in ${skills.join(', ') || 'modern web development'}, and I've shipped similar projects from kickoff to launch. ${profile.experienceLevel === 'Beginner' ? 'I may be early in my career, but I over-deliver on quality and communication.' : profile.experienceLevel === 'Expert' ? 'With extensive experience in this space, I can move fast without sacrificing quality.' : 'I focus on clean code, clear communication, and on-time delivery.'}

TIMELINE & NEXT STEPS:
I can start within 24-48 hours and deliver a first version in 5-7 business days, depending on scope. Happy to jump on a 15-minute call to discuss details.

Looking forward to working together${profile.name ? `,\n${profile.name}` : ''}.`
}

// =============================================================
// FEATURE 2 — analyzeProject
// =============================================================
export async function analyzeProject(description) {
  const systemPrompt =
    'You are a freelance project analyst. Extract structured insights from job descriptions.'

  const userPrompt = `Analyze this freelance project description and return a JSON object with: title, summary (1-2 sentences), clientRequirements (string[]), skillsRequired (string[]), budget, estimatedHours, tone (urgent|standard|startup|enterprise), redFlags (string[]), and a fitAdvice (1 short paragraph for the freelancer).

Description: """${description}"""`

  try {
    const raw = await callOpenAI(systemPrompt, userPrompt + '\n\nReturn ONLY valid JSON.')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code !== 'missing_key') throw err
    console.warn('[aiService] No AI key configured — using demo mode.')
  }

  // -------- Demo mode: heuristic analyzer --------
  const skills = extractSkills(description)
  const budget = extractBudget(description)
  const tone   = pickTone(description)
  const title  = extractTitle(description)

  const clientRequirements = []
  if (/responsive/i.test(description)) clientRequirements.push('Responsive, mobile-friendly design')
  if (/clean code|maintainable/i.test(description)) clientRequirements.push('Clean, maintainable code')
  if (/communicat|update/i.test(description)) clientRequirements.push('Regular progress updates')
  if (/deadline|timeline/i.test(description)) clientRequirements.push('On-time delivery within timeline')
  if (/seo/i.test(description)) clientRequirements.push('SEO-friendly implementation')
  if (!clientRequirements.length) clientRequirements.push('High-quality deliverables matching the brief')

  const redFlags = []
  if (/\b(very low|cheap|free)\b/i.test(description)) redFlags.push('Budget may be unrealistically low')
  if (/\b(urgent|asap|right now)\b/i.test(description)) redFlags.push('Extreme urgency — clarify scope')
  if (!budget) redFlags.push('Budget not specified — confirm before committing')

  const estimatedHours = skills.length <= 3 ? '20-40 hours' : skills.length <= 6 ? '40-80 hours' : '80+ hours'

  return {
    title,
    summary: description.split('\n')[0]?.slice(0, 180) || 'Project description analyzed successfully.',
    clientRequirements,
    skillsRequired: skills,
    budget: budget || 'Not specified',
    estimatedHours,
    tone,
    redFlags,
    fitAdvice: `This looks like a ${tone} project. The core stack is ${skills.slice(0, 3).join(', ') || 'generalist'}, which ${skills.length ? 'aligns with a typical full-stack workflow' : 'is broad — pin down specifics in your proposal'}. Lead your response with 2-3 concrete examples that prove you can ship.`,
  }
}

// =============================================================
// FEATURE 3 — generateClientMessage
// =============================================================
export async function generateClientMessage({ scenario, message, tone = 'friendly' }) {
  const systemPrompt = `You are a professional freelance communicator. Write a ${tone} client message. Use plain text only — no markdown, no formatting symbols.`
  const userPrompt = `Scenario: ${scenario}
Original client message: ${message || '(none)'}

Write a short, professional response (under 200 words). Use the ${tone} tone. Plain text only.`

  try {
    return await callOpenAI(systemPrompt, userPrompt)
  } catch (err) {
    if (err.code !== 'missing_key') throw err
    console.warn('[aiService] No AI key configured — using demo mode.')
  }

  const templates = {
    greeting:      `Hi! Thanks for reaching out — I'd love to learn more about your project.\n\nCould you share a few quick details: the main goal, any preferred tools, and a rough timeline? That'll help me put together an accurate quote and timeline for you.\n\nLooking forward to hearing more!`,
    clarify:       `Happy to help! To give you the most accurate estimate, could you clarify:\n\n- The expected scope (MVP vs. full version)\n- Any reference projects you like\n- Your target deadline\n\nOnce I have these, I can send over a detailed proposal within 24 hours.`,
    followup:      `Hi! Just following up on my previous message. I'd love to move forward on this project and have time reserved this week.\n\nLet me know if you have any questions or if there's a better time to chat. Happy to work around your schedule.`,
    decline:       `Hi,\n\nThanks for considering me for this project. Unfortunately, my schedule is fully booked through next month, so I won't be able to take this on with the quality it deserves.\n\nI'd recommend posting it again with a longer timeline — there are great freelancers who'd love to help. Wishing you the best with the project!`,
    deliver:       `Hi! The project is ready for your review.\n\nHere's a quick summary of what was delivered:\n- All features from the agreed scope\n- Tested across the latest browsers\n- Documentation for handoff\n\nI've attached the files / pushed the code. Let me know if anything needs adjusting — happy to make small revisions. Thanks!`,
    negotiate:     `Thanks for the offer! I'd love to make this work. Based on the scope, my rate is $X. I can offer a small discount for a longer commitment, or we can trim the scope to fit your budget.\n\nWhich direction works better for you?`,
  }
  return templates[scenario] || templates.greeting
}

// =============================================================
// FEATURE 4 — reviewProfile
// =============================================================
export async function reviewProfile(profile) {
  const systemPrompt = 'You are a senior career coach for freelancers. Give concise, actionable profile advice. Use plain text only — no markdown.'
  const userPrompt = `Review this freelancer profile and return JSON: { score (0-100), strengths (string[]), improvements (string[]), rewrittenBio (string) }.

Profile: ${JSON.stringify(profile)}`

  try {
    const raw = await callOpenAI(systemPrompt, userPrompt + '\n\nReturn ONLY valid JSON.')
    return JSON.parse(raw)
  } catch (err) {
    if (err.code !== 'missing_key') throw err
    console.warn('[aiService] No AI key configured — using demo mode.')
  }

  const strengths = []
  const improvements = []

  if ((profile.skills || []).length >= 5) strengths.push('Strong skill set with ' + profile.skills.length + ' technologies')
  else improvements.push('Add more skills — aim for 5-8 relevant ones')

  if ((profile.bio || '').length >= 120) strengths.push('Bio is detailed and personal')
  else improvements.push('Expand your bio to 2-3 sentences highlighting your unique value')

  if (profile.portfolioUrl) strengths.push('Portfolio link adds credibility')
  else improvements.push('Add a portfolio URL — clients strongly prefer seeing past work')

  if (profile.hourlyRate) strengths.push('Hourly rate is transparent and saves client time')
  else improvements.push('Consider adding an hourly rate to filter serious leads')

  if (profile.experienceLevel) strengths.push(`Experience level (${profile.experienceLevel}) is clearly stated`)
  else improvements.push('Set your experience level so clients can match expectations')

  if (!profile.title) improvements.push('Add a clear professional title')

  const score = Math.min(100, 50 + strengths.length * 12 - improvements.length * 5)

  const rewrittenBio = `I'm a ${profile.experienceLevel || 'passionate'} ${profile.title || 'freelancer'} specializing in ${(profile.skills || []).slice(0, 4).join(', ') || 'modern web development'}. I help clients ship clean, reliable products by combining strong technical skills with clear, proactive communication. ${profile.bio ? profile.bio.split('.')[0] + '.' : ''}`

  return { score, strengths, improvements, rewrittenBio }
}

// =============================================================
// FEATURE 5 — matchProjectToProfile
// =============================================================
export async function matchProjectToProfile(project, profile) {
  const skills = project.skillsRequired || extractSkills(project.description || '')
  const m = calculateMatch(profile.skills || [], skills)
  return {
    ...m,
    advice: m.score >= 75
      ? 'Strong fit — lead with this proposal.'
      : m.score >= 50
      ? 'Decent fit — emphasize transferable experience in your cover.'
      : 'Low fit — consider passing or be honest about gaps in your reply.',
  }
}
