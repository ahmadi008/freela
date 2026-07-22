// =============================================================
// Storage utility — a thin, safe wrapper around localStorage
// All app data is namespaced under the "freela:" prefix so it
// never collides with other apps on the same origin.
// =============================================================

const PREFIX = 'freela:'

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      if (raw === null) return fallback
      return JSON.parse(raw)
    } catch (err) {
      console.warn(`[storage] Failed to read "${key}":`, err)
      return fallback
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
      return true
    } catch (err) {
      console.warn(`[storage] Failed to write "${key}":`, err)
      return false
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(PREFIX + key)
      return true
    } catch (err) {
      console.warn(`[storage] Failed to remove "${key}":`, err)
      return false
    }
  },

  clear() {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(PREFIX))
        .forEach((k) => localStorage.removeItem(k))
      return true
    } catch (err) {
      console.warn('[storage] Failed to clear:', err)
      return false
    }
  },
}

// =============================================================
// Typed storage helpers — give you autocomplete + a default.
// =============================================================

export const profileStore = {
  get: () => storage.get('profile', {
    name: '',
    title: '',
    email: '',
    bio: '',
    skills: [],
    experienceLevel: 'Intermediate',
    hourlyRate: '',
    portfolioUrl: '',
    avatar: '',
  }),
  set: (profile) => storage.set('profile', profile),
  clear: () => storage.remove('profile'),
}

export const proposalsStore = {
  get: () => storage.get('proposals', []),
  set: (proposals) => storage.set('proposals', proposals),
  add: (proposal) => {
    const all = proposalsStore.get()
    const next = [{ ...proposal, id: proposal.id || crypto.randomUUID(), createdAt: proposal.createdAt || new Date().toISOString() }, ...all]
    proposalsStore.set(next)
    return next
  },
  update: (id, patch) => {
    const all = proposalsStore.get()
    const next = all.map((p) => (p.id === id ? { ...p, ...patch } : p))
    proposalsStore.set(next)
    return next
  },
  remove: (id) => {
    const all = proposalsStore.get()
    const next = all.filter((p) => p.id !== id)
    proposalsStore.set(next)
    return next
  },
  clear: () => storage.remove('proposals'),
}

export const applicationsStore = {
  get: () => storage.get('applications', []),
  set: (apps) => storage.set('applications', apps),
  add: (app) => {
    const all = applicationsStore.get()
    const next = [{ ...app, id: app.id || crypto.randomUUID(), createdAt: app.createdAt || new Date().toISOString() }, ...all]
    applicationsStore.set(next)
    return next
  },
  update: (id, patch) => {
    const all = applicationsStore.get()
    const next = all.map((a) => (a.id === id ? { ...a, ...patch } : a))
    applicationsStore.set(next)
    return next
  },
  remove: (id) => {
    const all = applicationsStore.get()
    const next = all.filter((a) => a.id !== id)
    applicationsStore.set(next)
    return next
  },
  clear: () => storage.remove('applications'),
}

export const projectsStore = {
  get: () => storage.get('projects', []),
  set: (projects) => storage.set('projects', projects),
  add: (project) => {
    const all = projectsStore.get()
    const next = [{ ...project, id: project.id || crypto.randomUUID(), createdAt: project.createdAt || new Date().toISOString() }, ...all]
    projectsStore.set(next)
    return next
  },
  remove: (id) => {
    const all = projectsStore.get()
    const next = all.filter((p) => p.id !== id)
    projectsStore.set(next)
    return next
  },
  clear: () => storage.remove('projects'),
}
