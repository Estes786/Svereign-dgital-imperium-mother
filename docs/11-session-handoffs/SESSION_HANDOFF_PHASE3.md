# SESSION HANDOFF: Phase 2 → Phase 3

## ⚡ CRITICAL: Read This First

**Phase 2 is COMPLETE.** All Dashboard UI features are built and deployed.
**Next: Phase 3 – Scout Agent (The Hunter)**

---

## 🔑 CREDENTIALS

All credentials are stored in `.dev.vars` (gitignored). 
For new sessions, copy credentials from the project owner's secure vault.

### Required Keys in .dev.vars:
```
GROQ_API_KEY=<your-groq-api-key>
SERPAPI_KEY=<your-serpapi-key>
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-jwt>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-jwt>
```

### Service URLs:
- **Cloudflare Project**: `sovereign-predator-suite`
- **Production URL**: https://sovereign-predator-suite.pages.dev
- **GitHub Repo**: https://github.com/Estes786/Svereign-predtor-suite.git
- **Supabase Dashboard**: Check project owner's Supabase account
- **Groq Console**: https://console.groq.com
- **SerpAPI Dashboard**: https://serpapi.com/dashboard

---

## 📋 PHASE 2 DELIVERABLES (All Complete)

### Files Modified/Created
| File | Description | Status |
|------|-------------|--------|
| `src/index.tsx` | Main app - 13 API endpoints + dummy data + page routes | ✅ |
| `src/pages/dashboard.ts` | Full 4-tab dashboard with glassmorphism UI (422 lines) | ✅ |
| `src/pages/landing.ts` | Landing page HTML | ✅ |
| `scripts/apply_migration.py` | Supabase migration tool (Management API) | ✅ |
| `.dev.vars` | All credentials configured (Groq, SerpAPI, Supabase) | ✅ |
| `README.md` | Updated for Phase 2 | ✅ |

### API Endpoints (13 total)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Landing page |
| GET | `/dashboard` | 4-tab Dashboard |
| GET | `/api/health` | Health check (v2.0.0, phase 2) |
| GET | `/api/stats` | Stats (8 leads, Rp 200k revenue, 3% progress) |
| GET | `/api/stats/dashboard` | Dashboard aggregate with agent status |
| GET | `/api/leads` | Leads list with ?status, ?category, ?search, ?min_score |
| GET | `/api/leads/:id` | Lead detail |
| POST | `/api/leads` | Create lead |
| GET | `/api/transactions` | Transactions with summary |
| GET | `/api/messages/:leadId` | Messages per lead |
| GET | `/api/demos` | Demo websites list |
| GET | `/api/agent-logs` | Agent activity logs |
| GET | `/api/treasury/stats` | Treasury with Chart.js data + profit split |

### Dashboard Tabs
1. **🎯 Predator** - Command Center with agent status, quick stats, Start Hunt button
2. **📋 Leads** - Searchable/filterable lead cards with AI scores + lead detail modal
3. **🏗️ Builder** - Demo website cards with status badges
4. **💰 Treasury** - Revenue chart (Chart.js), profit split breakdown, transaction list

### Supabase Database (Applied)
- 6 tables: `leads`, `messages`, `demo_websites`, `transactions`, `agent_logs`, `system_config`
- All RLS policies configured
- Indexes on high-traffic columns
- Migration applied via Management API (scripts/apply_migration.py)

---

## 🎯 PHASE 3 REQUIREMENTS: Scout Agent (The Hunter)

### Overview
Build the Scout Agent that searches Google Maps via SerpAPI, then scores leads using Groq AI.

### Files to Create/Modify

#### 1. `src/agents/scout.ts` - Scout Agent Engine
```
- searchBusinesses(area, category, limit)
  → Call SerpAPI: google_maps engine
  → Parse results: name, address, phone, rating, reviews, website, maps_url
  → Return array of raw business data

- scoreLeadWithAI(business)
  → Call Groq API (llama-3.3-70b-versatile)
  → Prompt: Analyze business for digital gap
  → Return: ai_score (0-100), digital_gap_score, digital_gap_analysis, recommended_approach

- scoutWorkflow(area, category, limit)
  → searchBusinesses() → scoreLeadWithAI() for each → Return scored leads
```

#### 2. `src/index.tsx` - New API Routes
```
GET  /api/scout/search?area=jakarta&category=barber&limit=10
     → Execute scout search, return raw results

GET  /api/scout/status
     → Return scout agent status (idle/hunting/scoring)

POST /api/scout/score
     → Body: { business: {...} }
     → Score a single business with Groq AI
```

#### 3. `src/pages/dashboard.ts` - UI Updates
```
- Wire "Start Hunt" button to /api/scout/search
- Show real-time search progress
- Auto-populate Leads tab with results
- Score badges color-coded (green >80, gold 50-80, red <50)
```

### SerpAPI Integration
```typescript
// SerpAPI Google Maps search
const url = `https://serpapi.com/search.json?engine=google_maps&q=${category}+${area}&api_key=${env.SERPAPI_KEY}`;
const response = await fetch(url);
const data = await response.json();
// Parse data.local_results array
```

### Groq AI Integration
```typescript
// Groq AI scoring
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a digital marketing analyst...' },
      { role: 'user', content: `Analyze this business: ${JSON.stringify(business)}` }
    ],
    temperature: 0.3,
    max_tokens: 1000
  })
});
```

### Key Points
- **All API calls MUST be server-side** (in Hono routes, NOT in frontend)
- **Keys from .dev.vars** → accessible via `c.env.SERPAPI_KEY` and `c.env.GROQ_API_KEY`
- **Rate limiting**: SerpAPI has 100 free searches/month - be conservative
- **Error handling**: Wrap all external API calls in try/catch
- **Status tracking**: Keep agent status in memory (idle/hunting/scoring)

---

## 🏗️ BUILD COMMANDS

```bash
# Clone repo
git clone https://github.com/Estes786/Svereign-predtor-suite.git webapp
cd webapp && npm install

# Create .dev.vars with credentials from secure vault

# Build & run
npm run build
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000/api/health
curl http://localhost:3000/api/stats
curl http://localhost:3000/dashboard

# After changes
npm run build && pm2 restart sovereign-predator

# Deploy to Cloudflare
npm run build && npx wrangler pages deploy dist --project-name sovereign-predator-suite

# Push to GitHub
git add . && git commit -m "Phase 3: Scout Agent - The Hunter"
git push origin main
```

---

## ⚠️ IMPORTANT NOTES

1. **Dummy data stays** until Phase 6 (Harvester) when real Supabase integration happens
2. **Phase 3 adds NEW routes** alongside existing ones - don't break existing functionality
3. **SerpAPI has rate limits** - implement caching or throttling
4. **Groq has rate limits** - batch scoring, not parallel
5. **Dashboard "Start Hunt"** button should call Scout API and show progress
6. **All secrets in .dev.vars** - never hardcode in source
7. **Never commit .dev.vars or secrets** to the repository

---

*Session Handoff v3.0 | Phase 2 → Phase 3 | Sovereign Predator Suite*
*Date: 2026-03-07 | Author: AI Agent (Genspark)*
