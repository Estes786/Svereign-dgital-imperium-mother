# SESSION HANDOFF DOCUMENT
# Devil Hunter Web — Complete Context for Next AI Session
**Author**: GANI HYPHA AI Dev | **Date**: 2 Maret 2026 | **Session**: #035+
**Purpose**: Copy-paste ini ke AI Dev session baru untuk FULL CONTEXT

---

## IDENTITY & CONTEXT

### Siapa Kamu (AI Dev)?
Kamu adalah AI Developer yang melanjutkan project **Devil Hunter Web** — sebuah Super App pribadi untuk hunting bisnis lokal (UMKM Indonesia), menganalisis potensi lead menggunakan AI, dan menutup deal melalui WhatsApp outreach. Ini BUKAN SaaS. Ini senjata pribadi untuk 1 user: **GANI HYPHA (Sovereign Reign Store)**.

### Philosophy
```
"Uang Dulu, Sempurna Kemudian"
"Akar Dalam, Cabang Tinggi"
Target: $500 USD (Rp 7.800.000) dalam 30 hari dari jasa digital ke UMKM
```

### Personality
- Panggil user: "Gyss" atau "Boss"
- Tone: Confident, direct, bilingual (Indonesia + English technical terms)
- Emoji: Boleh (terutama skull, fire, rocket)
- Mantras: "HOLYYBD", "Gyss!"

---

## PROJECT STATE (Current)

### Repository
- **GitHub**: https://github.com/Estes786/Hunter-kiler-web.1
- **Production URL**: https://devil-hunting-web.pages.dev
- **Cloudflare Project**: `devil-hunting-web`
- **Version**: 2.0.0 (deployed & working)

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Hono v4.12.3 |
| Runtime | Cloudflare Workers |
| Build | Vite v6.3.5 + @hono/vite-build |
| AI Engine | Groq (Llama-3.3-70b-versatile) |
| Database | Supabase PostgreSQL (project: ofepglecblzpqhtzfzui) |
| Frontend | Tailwind CSS CDN + Vanilla JS (inline SPA) |
| Deploy | Cloudflare Pages + Wrangler v4.4.0 |
| Process | PM2 + ecosystem.config.cjs |

### File Structure
```
webapp/
  src/index.tsx              ← MAIN FILE (1183 lines, backend + full SPA HTML)
  docs/
    DEVIL_HUNTER_PRD_v3.md   ← Product Requirements Document
    ARCHITECTURE_v3.md        ← System Architecture
    DESIGN_SYSTEM_v3.md       ← UI/UX Design System
    TODO_MASTER_v3.md         ← Master Task List
    API_REFERENCE_v3.md       ← Complete API Documentation
    SESSION_HANDOFF.md        ← THIS FILE
    DATABASE_SCHEMA.md        ← Database Schema & Migrations
    DEPLOYMENT_GUIDE.md       ← Step-by-step Deployment
  migrations/
    001_hunting_leads.sql     ← Supabase table schema
  public/
    static/style.css          ← External CSS (minimal, most CSS is inline)
  .dev.vars                   ← Environment variables (git-ignored)
  .gitignore
  ecosystem.config.cjs        ← PM2 config (wrangler pages dev)
  package.json                ← Dependencies & scripts
  tsconfig.json
  vite.config.ts
  wrangler.jsonc              ← Cloudflare config
  README.md
```

### Key Architecture Decisions
1. **Single file SPA**: Entire frontend is in `getMainHTML()` function inside `src/index.tsx` — served as HTML response from Hono route `GET /`
2. **Server-side AI**: All Groq API calls happen on backend (API keys protected)
3. **Supabase REST**: Direct REST API calls (no client library needed)
4. **localStorage fallback**: If Supabase down, data saved locally
5. **No frontend framework**: Vanilla JS for zero overhead
6. **CDN libraries**: Tailwind, Font Awesome, Google Fonts via CDN

---

## FEATURES COMPLETED (v2.0)

| # | Feature | Status | Tab |
|---|---------|--------|-----|
| 1 | Dashboard (revenue tracker, KPIs, activity feed, quick actions) | DONE | dashboard |
| 2 | Area Hunter (AI business search + Market Gap Finder) | DONE | hunter |
| 3 | Business Scanner (AI analysis, scoring 0-100, scripts, objection handling) | DONE | scanner |
| 4 | Pipeline CRM (4-stage kanban + Supabase CRUD + modal) | DONE | pipeline |
| 5 | AI Script Generator v2 (5 WA script versions) | DONE | scripts |
| 6 | Demo Website Generator (AI-generated full HTML landing page) | DONE | demo |
| 7 | Service Arsenal (9 services + revenue calculator + WA templates) | DONE | arsenal |
| 8 | Competitive Intelligence | DONE | tools |
| 9 | Master System Prompt Generator | DONE | tools |

### API Endpoints (12 total)
```
GET  /                           → Main SPA HTML
GET  /api/health                 → Health check
POST /api/maps/search            → AI business search
POST /api/ai/market-gap          → Market gap analysis
POST /api/ai/analyze-business    → Deep business analysis
POST /api/ai/generate-script     → WA scripts (5 versions)
POST /api/ai/generate-demo       → Demo website HTML
POST /api/ai/generate-master-prompt → System prompt gen
POST /api/ai/competitive-intel   → Competitive intelligence
CRUD /api/leads                  → CRM pipeline (GET/POST/PATCH/DELETE)
GET  /api/stats                  → Dashboard statistics
GET  /api/demo/preview/:id       → Demo preview
```

---

## KNOWN BUGS (Fix These First!)

| Bug | Severity | Location | Fix |
|-----|----------|----------|-----|
| HTML escape in scripts | CRITICAL | renderScan(), line ~952 | Add escapeHtml() for AI text output |
| Pipeline refresh race | HIGH | saveLead(), line ~963 | Add await + forced re-render |
| Modal scroll mobile | MEDIUM | showLeadModal() | Test overflow on small screens |
| Stats NaN | MEDIUM | updateDash() | Add `\|\| 0` fallback everywhere |
| Copy button selectors | MEDIUM | renderScripts() | Use data-attributes vs inline onclick |
| Demo XSS risk | LOW | iframe srcdoc | Remove allow-same-origin |

---

## v3.0 ROADMAP (Next Features)

### Priority Order
1. **SerpAPI Integration** (real Google Maps data — game-changer)
2. **Batch Scanner** (scan multiple businesses at once)
3. **CSV Export** (download leads as CSV)
4. **WA Template System** (personalized templates per stage)
5. **Daily Planner** (daily targets + follow-up queue)
6. **UI/UX Overhaul** (mobile bottom nav, skeletons, dark/light mode)

### SerpAPI Details
```
API Key: <stored-in-dev-vars>
Engine: google_maps
Endpoint: https://serpapi.com/search.json
Free Tier: 100 searches/month
New Endpoint: POST /api/maps/search-real
Env Variable: SERPAPI_KEY
```

---

## CREDENTIALS REFERENCE

> **IMPORTANT**: All credentials are stored in `.dev.vars` (local) and Cloudflare Secrets (production).
> **NEVER commit credentials to git.** See `.dev.vars.example` for the required keys.

### Required Environment Variables (.dev.vars)
```
GROQ_API_KEY=<your-groq-api-key>
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
SERPAPI_KEY=<your-serpapi-key>
```

### Supabase
- Project: `ofepglecblzpqhtzfzui`
- Table: `public.hunting_leads`

### Cloudflare
- Dashboard: https://dash.cloudflare.com
- Project: devil-hunting-web

### GitHub
- Repo: https://github.com/Estes786/Hunter-kiler-web.1

---

## COMMANDS CHEAT SHEET

### Development
```bash
# Install dependencies
cd /home/user/webapp && npm install

# Build
cd /home/user/webapp && npm run build

# Start local dev server (PM2)
cd /home/user/webapp && fuser -k 3000/tcp 2>/dev/null || true
cd /home/user/webapp && pm2 start ecosystem.config.cjs
curl http://localhost:3000

# Check logs
pm2 logs --nostream
```

### Database
```bash
# Run migrations on Supabase (via SQL Editor web UI)
# URL: https://app.supabase.com/project/ofepglecblzpqhtzfzui/sql
# File: migrations/001_hunting_leads.sql
```

### Deployment
```bash
# Build + Deploy to Cloudflare Pages
cd /home/user/webapp && npm run build
cd /home/user/webapp && npx wrangler pages deploy dist --project-name devil-hunting-web

# Set secrets
npx wrangler secret put GROQ_API_KEY --project-name devil-hunting-web
```

### Git
```bash
cd /home/user/webapp && git add . && git commit -m "message"
cd /home/user/webapp && git push origin main
```

---

## DOCUMENTATION AVAILABLE

| Document | Path | Description |
|----------|------|-------------|
| PRD v3.0 | `docs/DEVIL_HUNTER_PRD_v3.md` | Product requirements, features, revenue model |
| Architecture | `docs/ARCHITECTURE_v3.md` | System design, tech stack, data flow |
| Design System | `docs/DESIGN_SYSTEM_v3.md` | UI/UX specs, colors, components |
| TODO Master | `docs/TODO_MASTER_v3.md` | All tasks with priorities & timeline |
| API Reference | `docs/API_REFERENCE_v3.md` | Complete API documentation |
| Session Handoff | `docs/SESSION_HANDOFF.md` | THIS FILE — full context |
| Database Schema | `docs/DATABASE_SCHEMA.md` | Schema, migrations, indexes |
| Deployment Guide | `docs/DEPLOYMENT_GUIDE.md` | Step-by-step deployment |
| README | `README.md` | Project overview & quick start |

---

## SESSION QUICK START

```
Hai AI Dev! Ini project Devil Hunter Web. 

Baca dulu:
1. docs/SESSION_HANDOFF.md (this file — full context)
2. docs/TODO_MASTER_v3.md (task list)
3. src/index.tsx (main source code)

Lanjutkan dari prioritas tertinggi di TODO list.
Let's get it, Gyss!
```

---

## PREVIOUS SESSIONS SUMMARY

| Session | Date | Key Deliverables |
|---------|------|-----------------|
| #032-033 | Feb 2026 | v1.0 initial build, Groq + Supabase integration |
| #034 | Feb 28 | v2.0 major upgrade: 8 tabs, full SPA, all features |
| #035 | Mar 2 | Documentation suite created (8 docs), repo organized |
| #036+ | TBD | v2.1 bug fixes → v3.0 SerpAPI + features |

---

*Session Handoff | Devil Hunter Web | 2 Maret 2026*
*"Context is king. Never start from zero."*
