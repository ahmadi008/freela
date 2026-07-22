// =============================================================
// AppContext — global state for profile, proposals, applications
// Wraps localStorage so the rest of the app reads like a real DB.
// =============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  profileStore,
  proposalsStore,
  applicationsStore,
  projectsStore,
} from '../utils/storage.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [profile, setProfile]           = useState(() => profileStore.get())
  const [proposals, setProposals]       = useState(() => proposalsStore.get())
  const [applications, setApplications] = useState(() => applicationsStore.get())
  const [projects, setProjects]         = useState(() => projectsStore.get())
  const [toast, setToast]               = useState(null)

  // Persist on change
  useEffect(() => { profileStore.set(profile) }, [profile])
  useEffect(() => { proposalsStore.set(proposals) }, [proposals])
  useEffect(() => { applicationsStore.set(applications) }, [applications])
  useEffect(() => { projectsStore.set(projects) }, [projects])

  const showToast = useCallback((message, kind = 'success') => {
    setToast({ message, kind, id: Date.now() })
    setTimeout(() => setToast(null), 3200)
  }, [])

  // --- Profile ---
  const updateProfile   = (patch) => setProfile((p) => ({ ...p, ...patch }))
  const resetProfile    = () => setProfile(profileStore.get())

  // --- Proposals ---
  const addProposal     = (p) => { setProposals((curr) => proposalsStore.add(p)); showToast('Proposal saved!') }
  const updateProposal  = (id, patch) => setProposals((curr) => proposalsStore.update(id, patch))
  const removeProposal  = (id) => { setProposals((curr) => proposalsStore.remove(id)); showToast('Proposal deleted', 'info') }

  // --- Applications ---
  const addApplication    = (a) => { setApplications((curr) => applicationsStore.add(a)); showToast('Application tracked!') }
  const updateApplication = (id, patch) => setApplications((curr) => applicationsStore.update(id, patch))
  const removeApplication = (id) => { setApplications((curr) => applicationsStore.remove(id)); showToast('Removed', 'info') }

  // --- Projects (analyzed) ---
  const addProject    = (p) => { setProjects((curr) => projectsStore.add(p)); showToast('Project saved!') }
  const removeProject = (id) => { setProjects((curr) => projectsStore.remove(id)); showToast('Removed', 'info') }

  const value = {
    profile, updateProfile, resetProfile,
    proposals, addProposal, updateProposal, removeProposal,
    applications, addApplication, updateApplication, removeApplication,
    projects, addProject, removeProject,
    toast, showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
