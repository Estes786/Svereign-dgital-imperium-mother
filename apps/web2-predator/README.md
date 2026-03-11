# SOVEREIGN PREDATOR SUITE v3.0

> Autonomous AI Business Empire - Zero Mercy Mode
> Phase 3: Scout Agent (The Hunter) - LIVE

---

## Project Overview
- **Name**: Sovereign Predator Suite
- **Goal**: Automated UMKM lead hunting, scoring, and conversion system
- **Phase**: 3 of 8 (Scout Agent Complete)
- **Stack**: Hono v4 + TypeScript + Cloudflare Pages + SerpAPI + Groq AI

## URLs
- **Production**: https://sovereign-predator-suite.pages.dev
- **Dashboard**: https://sovereign-predator-suite.pages.dev/dashboard
- **GitHub**: https://github.com/Estes786/Svereign-predtor-suite

## Features (Phase 1-3)

### Phase 1: Foundation
- Landing page with Sovereign Predator branding
- Obsidian Black (#050505) + Gold (#FFD700) + Neon Green (#00FF00) design system
- Mobile-first responsive layout with glassmorphism

### Phase 2: Dashboard UI
- 4-tab dashboard (Predator, Leads, Builder, Treasury)
- Chart.js integration for treasury visualization
- Lead filtering and search
- Dummy data system with 8 sample leads

### Phase 3: Scout Agent (The Hunter) - NEW
- **SerpAPI Integration**: Search Google Maps for real UMKM businesses
- **Groq AI Scoring**: Score leads using Llama-3.3-70b-versatile (ai_score 0-100)
- **Live Hunt**: Dashboard "Start Hunt" button triggers real search + AI scoring
- **Hunt Progress Overlay**: Real-time progress with status polling
- **Scout-only Filter**: Toggle to view only scout-discovered leads
- **Source Badges**: Visual indicator for scout vs dummy leads

## API Endpoints (18 total)

### Existing (Phase 1-2)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Landing page |
| GET | `/dashboard` | 4-tab Dashboard |
| GET | `/api/health` | Health check (v3.0.0, phase 3, scout_status) |
| GET | `/api/stats` | Stats with scout_leads count |
| GET | `/api/stats/dashboard` | Dashboard aggregate with agent status |
| GET | `/api/leads` | Leads list with ?status, ?category, ?search, ?min_score, ?source |
| GET | `/api/leads/:id` | Lead detail |
| POST | `/api/leads` | Create lead |
| GET | `/api/transactions` | Transactions with summary |
| GET | `/api/messages/:leadId` | Messages per lead |
| GET | `/api/demos` | Demo websites list |
| GET | `/api/agent-logs` | Agent activity logs |
| GET | `/api/treasury/stats` | Treasury with Chart.js data |

### New (Phase 3 - Scout Agent)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/scout/status` | Scout agent status (idle/hunting/scoring/complete/error) |
| GET | `/api/scout/search` | Execute live search (?area, ?category, ?limit) |
| POST | `/api/scout/score` | Score single business with Groq AI |
| GET | `/api/scout/results` | Get cached hunt results |
| DELETE | `/api/scout/results` | Clear cached results |

## Data Architecture
- **Leads**: Dummy data (8) + Live Scout results (merged)
- **Scout Agent**: SerpAPI Google Maps + Groq AI Llama-3.3-70b scoring
- **Status Tracking**: In-memory scout status per worker instance
- **Storage**: Supabase PostgreSQL (tables created, integration in Phase 6)

## File Structure
```
src/
├── index.tsx           # Main Hono app - 18 API endpoints + page routes
├── agents/
│   └── scout.ts        # Scout Agent: SerpAPI search + Groq AI scoring
└── pages/
    ├── landing.ts      # Landing page HTML
    └── dashboard.ts    # Full 4-tab dashboard with scout integration
```

## Environment Variables (.dev.vars)
```
GROQ_API_KEY=<groq-api-key>
SERPAPI_KEY=<serpapi-key>
SUPABASE_URL=<supabase-url>
SUPABASE_ANON_KEY=<supabase-anon-jwt>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-jwt>
```

## User Guide
1. Go to `/dashboard`
2. On **Predator** tab: Set area + category + limit
3. Click **START HUNTING** - watches real-time progress
4. After hunt: auto-switches to **Leads** tab with scout results
5. Toggle "SCOUT ONLY" to filter only discovered leads
6. Use **Deploy Demo** or **Send WA** buttons on lead cards

## Phase Roadmap
- [x] Phase 1: Foundation (Landing + Dashboard + Schema)
- [x] Phase 2: Dashboard UI (4 tabs, dummy data, Chart.js)
- [x] Phase 3: Scout Agent (SerpAPI + Groq AI scoring)
- [ ] Phase 4: Closer Agent (WA message generation)
- [ ] Phase 5: Architect Agent (Demo website builder)
- [ ] Phase 6: Harvester Agent (Supabase integration + payments)
- [ ] Phase 7: Orchestrator (Full automation loop)
- [ ] Phase 8: Polish & Scale

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: Active
- **Tech Stack**: Hono v4 + TypeScript + TailwindCSS (CDN) + Chart.js
- **Last Updated**: 2026-03-07

---

*Sovereign Predator Suite v3.0 | Phase 3 Complete | Zero Mercy Mode*
*Author: GYS (The Sovereign Predator)*
