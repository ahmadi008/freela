import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Toast from './components/Toast.jsx'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Analyzer from './pages/Analyzer.jsx'
import Proposals from './pages/Proposals.jsx'
import Tracker from './pages/Tracker.jsx'
import Communication from './pages/Communication.jsx'
import NotFound from './pages/NotFound.jsx'

function AppRoutes() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <Routes>
      <Route path="/"          element={<Landing />} />
      <Route path="/dashboard" element={<Layout><Home /></Layout>} />
      <Route path="/profile"   element={<Layout><Profile /></Layout>} />
      <Route path="/analyzer"  element={<Layout><Analyzer /></Layout>} />
      <Route path="/proposals" element={<Layout><Proposals /></Layout>} />
      <Route path="/tracker"   element={<Layout><Tracker /></Layout>} />
      <Route path="/communication" element={<Layout><Communication /></Layout>} />
      <Route path="*"          element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}

export default function App() {
  return (
    <>
      <AppRoutes />
      <Toast />
    </>
  )
}
