# Freela — AI-Powered Freelance Coach

> An intelligent platform that helps freelancers write stronger proposals, analyze job posts, polish their profiles, and win more projects.

![Freela Dashboard](https://img.shields.io/badge/Status-Ready-success?style=flat-square)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Freelancer Profile** | Manage skills, experience, bio, hourly rate, and portfolio link. |
| **Project Analyzer** | Paste any job post; the AI extracts requirements, skills, tone, red flags, and estimates effort. |
| **AI Proposal Generator** | Generate personalized, professional proposals in seconds. |
| **Client Communication** | Create polished messages for 6 common scenarios (intro, follow-up, decline, negotiate, deliver…). |
| **Profile Review** | Get a score, strengths, and concrete improvement suggestions. |
| **Opportunity Tracker** | Kanban-style pipeline tracking every application from first contact to signed contract. |
| **Skill Matching** | Instantly see how well your skills match a project before you apply. |

## 🤖 AI Modes

Freela works **with or without** an OpenAI API key:

- **Real AI mode** — set `VITE_OPENAI_API_KEY` in `.env.local` and the app calls `gpt-4o-mini` for all features.
- **Demo mode** (default) — uses a sophisticated template engine that produces realistic, professional outputs based on your project description and profile. Perfect for bootcamp demos, offline work, and cost-free use.

A status pill in the sidebar always tells you which mode is active.

## 🛠 Tech Stack

- **React 18** + **Vite 5** (fast HMR, modern build)
- **Tailwind CSS 3** (utility-first, custom design system)
- **React Router 6** (multi-page SPA)
- **Lucide React** (1k+ beautiful icons)
- **OpenAI API** (optional — `gpt-4o-mini`)
- **LocalStorage** (no backend, fully client-side)
- **Netlify** (one-click deploy, SPA redirects configured)

## 📦 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+

### Install & run

```bash
git clone <your-repo-url>
cd freela
npm install
npm run dev
```

Open http://localhost:5173 — you should see the Freela dashboard.

### Optional: enable real AI

```bash
cp .env.example .env.local
# add your OpenAI key to .env.local
VITE_OPENAI_API_KEY=sk-...
```

Restart `npm run dev`. The sidebar pill will flip from **Demo mode** (amber) to **Real AI connected** (green).

## 🚀 Build & Deploy

```bash
npm run build      # outputs to dist/
npm run preview    # test the production build locally
```

### Deploy to Netlify (recommended)

1. Push to GitHub.
2. Sign in to https://app.netlify.com.
3. **Add new site → Import from Git** → pick your repo.
4. Netlify auto-detects settings from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. (Optional) add `VITE_OPENAI_API_KEY` in **Site settings → Environment variables**.
6. Click **Deploy**. Your site is live in ~30 seconds.

## 📂 Project Structure

```
freela/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/      ← Layout, Toast, EmptyState, LoadingSpinner, StatCard
│   ├── pages/           ← Home, Profile, Analyzer, Proposals, Tracker, Communication
│   ├── context/         ← AppContext (global state)
│   ├── services/        ← aiService.js (OpenAI + demo-mode templates)
│   ├── utils/           ← storage.js, helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
├── netlify.toml
└── .env.example
```

## 💾 Data Model

All data persists in `localStorage` under the `freela:*` namespace:

```js
profile = {
  name: 'Sara',
  title: 'Frontend Developer',
  skills: ['React', 'Tailwind'],
  experienceLevel: 'Intermediate',
  hourlyRate: '$50/hr',
  bio: '...',
  portfolioUrl: 'https://...',
}

proposal = {
  id: 'uuid',
  projectTitle: 'Build a React landing page',
  content: 'Hi there, ...',
  budget: '$500',
  projectSnapshot: {...},
  createdAt: '2026-07-15T10:30:00Z',
}

application = {
  id: 'uuid',
  projectTitle: '...',
  client: 'Acme Corp',
  status: 'Submitted',  // Saved | Submitted | Interviewing | Won | Lost
  budget: '$500',
  deadline: '2026-07-30',
  notes: '...',
  url: 'https://...',
  createdAt: '...',
}
```

## 🎨 Design Principles

- **Calm, professional palette** — slate base with brand indigo + accent fuchsia.
- **Mobile-first** — sidebar collapses to a slide-out drawer below `lg`.
- **Accessible** — semantic HTML, focus rings, `aria-label` on icon buttons.
- **No CLS** — skeletons + smooth fade/slide transitions.
- **Friendly empty states** — every list page tells you what to do next.

## 🧠 Reflection

**What challenges do freelancers face when applying for projects?**
Writing personalized proposals at scale, standing out in crowded marketplaces, communicating professionally with strangers, and tracking dozens of applications at once.

**How can AI help improve proposal quality and communication?**
AI eliminates the blank-page problem, ensures every reply is tailored to the specific project, and lets freelancers sound more polished and professional — without spending 30+ minutes per application.

**Which feature provided the most value to freelancers?**
The Proposal Generator — it's the highest-leverage time-saver, turning a 30-minute task into a 30-second one while improving quality.

**How could Freela help users build successful freelance careers?**
By removing the operational friction (proposals, tracking, comms) so freelancers can focus on doing great work and building client relationships.

## 🗺 Stretch Goals (future)

- **Portfolio Builder** — let users create and showcase project portfolios inside Freela.
- **AI Negotiation Assistant** — suggest strategies for scope, timelines, and pricing.
- **Proposal Templates Library** — generate proposals in different styles and tones.
- **Browser extension** — one-click "analyze this job post" from Upwork, Fiverr, etc.
- **Multi-currency support** — auto-convert budgets to the user's local currency.

## 📄 License

MIT — free to learn from, fork, and extend.

---

Built with ❤️ for freelancers, by people who remember the struggle.
