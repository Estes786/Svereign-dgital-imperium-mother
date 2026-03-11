# SESSION HANDOFF: Phase 3 → Phase 4

## CRITICAL: Read This First

**Phase 3 is COMPLETE.** Scout Agent is LIVE with real SerpAPI + Groq AI scoring.
**Next: Phase 4 – Closer Agent (The Ghostwriter)**

---

## CREDENTIALS

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
- **Supabase Dashboard**: https://ztndcxvgcwppihtipntg.supabase.co
- **Groq Console**: https://console.groq.com
- **SerpAPI Dashboard**: https://serpapi.com/dashboard

---

## PHASE 3 DELIVERABLES (All Complete)

### Files Created/Modified
| File | Description | Status |
|------|-------------|--------|
| `src/agents/scout.ts` | Scout Agent: SerpAPI search + Groq AI scoring engine | NEW |
| `src/index.tsx` | Main app - 18 API endpoints + live scout integration | MODIFIED |
| `src/pages/dashboard.ts` | Dashboard with live hunt overlay + scout source toggle | MODIFIED |
| `README.md` | Updated for Phase 3 | MODIFIED |

### New API Endpoints (Phase 3)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/scout/status` | Scout agent status (idle/hunting/scoring/complete/error) |
| GET | `/api/scout/search` | Execute live search (?area, ?category, ?limit) |
| POST | `/api/scout/score` | Score single business with Groq AI |
| GET | `/api/scout/results` | Get cached hunt results |
| DELETE | `/api/scout/results` | Clear cached results |

### Scout Agent Features
- **SerpAPI Google Maps**: Search real UMKM businesses by area + category
- **Groq AI (Llama-3.3-70b)**: Score each lead (ai_score 0-100, digital_gap_score 0-100)
- **Digital Gap Analysis**: has_website, has_booking, social_active, needs[], summary
- **Recommended Approach**: AI-generated approach strategy in Bahasa Indonesia
- **Rate Limiting**: Sequential AI calls with 300ms delay between each
- **Fallback Scoring**: If Groq fails, uses rule-based scoring
- **Status Tracking**: Real-time status polling (idle → hunting → scoring → complete)

### Dashboard Upgrades
- **Hunt Progress Overlay**: Shows real-time hunt progress with animated bar
- **Scout Status Banner**: Shows scout agent state + result count
- **Source Toggle**: "ALL LEADS" vs "SCOUT ONLY" in Leads tab
- **SCOUT Badge**: Visual badge on scout-discovered leads
- **AI Analysis Display**: Shows gap analysis summary + recommended approach per lead
- **Status Polling**: Auto-refreshes scout status every 10 seconds

### What Still Works from Phase 1-2
- Landing page (/)
- Dashboard 4 tabs (Predator, Leads, Builder, Treasury)
- All 13 original API endpoints
- Chart.js treasury visualizations
- 8 dummy leads (merged with scout results)
- Dummy transactions, messages, demos, agent logs

---

## PHASE 4 REQUIREMENTS: Closer Agent (The Ghostwriter)

### Overview
Build the Closer Agent that generates personalized WhatsApp messages using Groq AI and creates WA deeplinks.

### Files to Create/Modify

#### 1. `src/agents/closer.ts` - Closer Agent Engine
```
- generateMessage(lead, messageType)
  → Call Groq API (llama-3.3-70b-versatile)
  → messageType: 'initial', 'follow_up', 'closing', 'upsell'
  → Personalized based on lead data (name, rating, reviews, ai_score, digital_gap)
  → Return: message_text, wa_deeplink, tone, estimated_response_rate

- generateFollowUp(lead, previousMessages)
  → Context-aware follow-up based on previous conversation
  → Return: message_text, wa_deeplink

- batchGenerateMessages(leads, messageType)
  → Generate messages for multiple leads at once (sequential, rate-limited)
  → Return: array of message objects
```

#### 2. `src/index.tsx` - New API Routes
```
POST /api/closer/generate
     → Body: { lead_id, message_type }
     → Generate personalized WA message for a lead

POST /api/closer/batch
     → Body: { lead_ids: [...], message_type }
     → Batch generate messages for multiple leads

GET  /api/closer/status
     → Return closer agent status

GET  /api/closer/templates
     → Return message templates for each type
```

#### 3. `src/pages/dashboard.ts` - UI Updates
```
- Lead card "Send WA" button → triggers /api/closer/generate
- Show message preview before sending
- Message history per lead
- Batch action: "Send WA to All New Leads"
- Message type selector (initial/follow_up/closing)
```

### Groq AI Message Generation Prompt Template
```
You are a persuasive digital marketing closer targeting Indonesian UMKM businesses.
Generate a WhatsApp message for:
- Business: {name} ({category})
- Rating: {rating}/5 ({review_count} reviews)
- Digital Gap: {no website, no booking, etc.}
- AI Score: {score}/100

Message type: {initial/follow_up/closing}

Rules:
- Use Bahasa Indonesia (informal, friendly)
- Keep under 200 characters for WhatsApp
- Include specific business details (name, rating)
- Offer FREE demo/trial
- Create urgency
- End with call-to-action
```

### Key Points
- **All AI calls server-side** via Hono routes
- **Groq rate limits**: Sequential with 300ms delay
- **WA deeplinks**: `https://wa.me/{phone}?text={encoded_message}`
- **Message types**: initial, follow_up, closing, upsell
- **Don't break existing endpoints** - add alongside

---

## BUILD COMMANDS

```bash
# Clone repo
git clone https://github.com/Estes786/Svereign-predtor-suite.git webapp
cd webapp && npm install

# Create .dev.vars with credentials (see above)

# Build & run
npm run build
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000/api/health
curl http://localhost:3000/api/scout/status
curl "http://localhost:3000/api/scout/search?area=Jakarta+Selatan&category=barber+shop&limit=3"

# After changes
npm run build && pm2 restart sovereign-predator

# Deploy to Cloudflare
export CLOUDFLARE_API_TOKEN=<token>
npm run build && npx wrangler pages deploy dist --project-name sovereign-predator-suite

# Push to GitHub
git add . && git commit -m "Phase 4: Closer Agent - The Ghostwriter"
git push origin main
```

---

## FILE STRUCTURE

```
/home/user/webapp/
├── src/
│   ├── index.tsx              # Main Hono app (18 endpoints)
│   ├── agents/
│   │   └── scout.ts           # Scout Agent (SerpAPI + Groq AI)
│   └── pages/
│       ├── landing.ts         # Landing page HTML
│       └── dashboard.ts       # Full 4-tab dashboard (scout integrated)
├── migrations/
│   └── 0001_initial_schema.sql # DB schema (applied to Supabase)
├── scripts/
│   └── apply_migration.py     # Supabase migration tool
├── .dev.vars                   # Credentials (GITIGNORED)
├── .gitignore                  # Git ignore
├── ecosystem.config.cjs        # PM2 config
├── wrangler.jsonc              # Cloudflare config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite build config
├── README.md                   # Documentation
├── SESSION_HANDOFF_PHASE2.md   # Phase 1→2 handoff
├── SESSION_HANDOFF_PHASE3.md   # Phase 2→3 handoff
└── SESSION_HANDOFF_PHASE4.md   # Phase 3→4 handoff (this file)
```

---

## IMPORTANT NOTES

1. **Dummy data stays** until Phase 6 (Harvester) when real Supabase integration happens
2. **Phase 4 adds NEW routes** alongside existing ones - don't break existing functionality
3. **Groq rate limits**: Sequential AI calls with 300ms delay between each
4. **WA deeplinks**: Must properly encode the message text
5. **All secrets in .dev.vars** - never hardcode in source, never push to GitHub
6. **Cloudflare secrets already set** for production (GROQ_API_KEY, SERPAPI_KEY, SUPABASE_*)
7. **Scout leads are in-memory** - they reset on worker restart (by design until Phase 6)

---

*Session Handoff v4.0 | Phase 3 → Phase 4 | Sovereign Predator Suite*
*Date: 2026-03-07 | Author: AI Agent (Genspark)*
