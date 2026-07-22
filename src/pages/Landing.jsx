import { Link } from 'react-router-dom'
import {
  Sparkles, FileText, MessageSquare, ListChecks, Search, TrendingUp,
  ArrowRight, Check, Star, Zap, Target, Wand2, Award, Clock, Shield, Github, Twitter, Linkedin
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

export default function Landing() {
  const { profile } = useApp()
  const firstName = profile?.name ? profile.name.split(' ')[0] : null

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Header firstName={firstName} />
      <Hero firstName={firstName} />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}

/* ------------------------------------------------------------- */
/* HEADER                                                        */
/* ------------------------------------------------------------- */
function Header({ firstName }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-slate-900">Freela</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">AI Coach</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features"      className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Features</a>
          <a href="#how-it-works"  className="text-sm font-medium text-slate-600 transition hover:text-slate-900">How it works</a>
          <a href="#benefits"      className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Benefits</a>
          <a href="#testimonials"  className="text-sm font-medium text-slate-600 transition hover:text-slate-900">Testimonials</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="btn-primary text-sm">
            {firstName ? `Continue, ${firstName}` : 'Launch app'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------- */
/* HERO                                                          */
/* ------------------------------------------------------------- */
function Hero({ firstName }) {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-200 via-accent-100 to-transparent opacity-60 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            Your AI-powered freelance coach
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Win more freelance projects.{' '}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              Without the grind.
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 sm:text-xl">
            Freela analyzes job posts, crafts tailored proposals, polishes your profile,
            and helps you communicate like a pro — all in one beautifully simple app.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/dashboard" className="btn-primary px-6 py-3 text-base">
              {firstName ? `Open dashboard, ${firstName}` : 'Try Freela free'}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#features" className="btn-secondary px-6 py-3 text-base">
              See the features
            </a>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            ✓ No signup required  ·  ✓ Works offline  ·  ✓ Built for bootcampers & pros
          </p>
        </div>

        {/* Hero visual */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="relative rounded-2xl bg-slate-900 p-2 shadow-2xl ring-1 ring-slate-900/10">
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <MiniCard
                  icon={<Search className="h-5 w-5" />}
                  title="Analyze"
                  value="4 skills detected"
                  accent="bg-brand-100 text-brand-700"
                />
                <MiniCard
                  icon={<Wand2 className="h-5 w-5" />}
                  title="Generate"
                  value="Proposal ready"
                  accent="bg-accent-100 text-accent-600"
                />
                <MiniCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  title="Match"
                  value="85% fit"
                  accent="bg-green-100 text-green-700"
                />
              </div>
              <div className="mt-4 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">AI Proposal</p>
                    <p className="mt-1 text-sm text-slate-700 line-clamp-3">
                      "Hi there! Thanks for posting <strong>Build a React landing page</strong> — I read the
                      description carefully and I'm confident I can deliver exactly what you're looking for.
                      I bring hands-on experience in React, Tailwind CSS, and modern frontend tooling…"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MiniCard({ icon, title, value, accent }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
        {icon}
      </div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
    </div>
  )
}

/* ------------------------------------------------------------- */
/* LOGO STRIP                                                    */
/* ------------------------------------------------------------- */
function LogoStrip() {
  const logos = ['Upwork', 'Fiverr', 'Toptal', 'Freelancer', '99designs', 'Contra']
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          Built for freelancers on every major platform
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {logos.map((l) => (
            <span key={l} className="text-lg font-bold tracking-tight text-slate-400">{l}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- */
/* FEATURES                                                      */
/* ------------------------------------------------------------- */
function Features() {
  const features = [
    { icon: Search,       color: 'from-brand-500 to-brand-700',   title: 'Project Analyzer',     desc: 'Paste any job post. Get instant insights on requirements, skills, tone, red flags, and effort estimates.' },
    { icon: Wand2,        color: 'from-accent-500 to-pink-600',   title: 'AI Proposal Generator', desc: 'Generate a tailored, professional proposal in seconds — never start from a blank page again.' },
    { icon: MessageSquare,color: 'from-emerald-500 to-green-600', title: 'Client Communication', desc: '6 ready-to-use scenarios: intros, follow-ups, declines, negotiations, deliveries.' },
    { icon: ListChecks,   color: 'from-amber-500 to-orange-600',  title: 'Opportunity Tracker',  desc: 'A clean pipeline from first contact to signed contract. Never lose track of an application.' },
    { icon: Award,        color: 'from-sky-500 to-blue-600',      title: 'Profile Review',       desc: 'Get a score, strengths, and concrete suggestions to make your profile stand out.' },
    { icon: Target,       color: 'from-violet-500 to-purple-600', title: 'Skill Matching',       desc: 'See your % match for a project before you apply. Focus on what you’ll actually win.' },
  ]

  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Features</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need to land clients
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Six powerful features that work together to save you hours every week.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-lg">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- */
/* HOW IT WORKS                                                  */
/* ------------------------------------------------------------- */
function HowItWorks() {
  const steps = [
    { n: '1', title: 'Set up your profile',    desc: 'Add your skills, bio, and rate. Takes 60 seconds.' },
    { n: '2', title: 'Analyze job posts',      desc: 'Paste a project. Get requirements, skills, red flags instantly.' },
    { n: '3', title: 'Generate & send proposal', desc: 'One click. Tailored, professional, ready to send.' },
    { n: '4', title: 'Track & communicate',    desc: 'Follow up, negotiate, and close — all in one place.' },
  ]
  return (
    <section id="how-it-works" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            From job post to signed contract in minutes
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl font-bold text-white shadow-lg">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- */
/* BENEFITS                                                      */
/* ------------------------------------------------------------- */
function Benefits() {
  const benefits = [
    { icon: Clock,    text: 'Save 5+ hours per week on proposals & follow-ups' },
    { icon: Zap,      text: 'Tailor every reply in seconds, not minutes' },
    { icon: TrendingUp, text: 'Win more projects with personalized, polished output' },
    { icon: Shield,   text: 'All data stays on your device. No accounts, no leaks.' },
  ]
  return (
    <section id="benefits" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Why Freela</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for the way freelancers actually work
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Most freelance tools are bloated CRMs. Freela is a focused coach that does six things
              extremely well — and stays out of your way.
            </p>
            <div className="mt-8 space-y-4">
              {benefits.map((b) => (
                <div key={b.text} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <b.icon className="h-4 w-4" />
                  </div>
                  <p className="text-base text-slate-700">{b.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 via-white to-accent-50 p-8 ring-1 ring-slate-200">
              <div className="space-y-4">
                <Stat label="Avg time saved per proposal" value="12 min" />
                <Stat label="Increase in response rate"   value="3.2x" />
                <Stat label="Cost to use"                value="Free" />
                <Stat label="Setup time"                 value="< 1 min" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-2xl font-extrabold text-slate-900">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------- */
/* TESTIMONIALS                                                  */
/* ------------------------------------------------------------- */
function Testimonials() {
  const items = [
    { quote: "Freela cut my proposal time from 30 minutes to 30 seconds. I landed 4 new clients in my first month.", name: "Maya P.", role: "Frontend Developer" },
    { quote: "The skill matching is genius. I stopped wasting time applying to projects I couldn't actually win.", name: "Daniel K.", role: "Full-Stack Engineer" },
    { quote: "I look more professional in client messages. The follow-up templates alone are worth it.", name: "Sara L.", role: "UI/UX Designer" },
  ]
  return (
    <section id="testimonials" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Loved by freelancers</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What users are saying
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-slate-700">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- */
/* CTA                                                           */
/* ------------------------------------------------------------- */
function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 p-10 text-center shadow-2xl sm:p-16">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to win more projects?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Start in 60 seconds. No signup. No credit card. Just open the app and try it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-700 shadow hover:bg-slate-50 transition">
              Open the app <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------- */
/* FOOTER                                                        */
/* ------------------------------------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">Freela</span>
            </Link>
            <p className="mt-3 text-sm text-slate-600">
              Your AI-powered freelance coach. Win more, work smarter.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#features"     className="hover:text-slate-900">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-900">How it works</a></li>
              <li><a href="#benefits"     className="hover:text-slate-900">Benefits</a></li>
              <li><Link to="/dashboard"   className="hover:text-slate-900">Open app</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Resources</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-slate-900">Documentation</a></li>
              <li><a href="#" className="hover:text-slate-900">Proposal templates</a></li>
              <li><a href="#" className="hover:text-slate-900">Pricing guide</a></li>
              <li><a href="#" className="hover:text-slate-900">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Connect</h4>
            <div className="mt-3 flex gap-3">
              <a href="#" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">© 2026 Freela. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with React, Tailwind, and ❤️</p>
        </div>
      </div>
    </footer>
  )
}
