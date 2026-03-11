# PROJECT ARCHITECTURE: Sovereign Digital Imperium

## Architectural Overview

```
                    ┌─────────────────────────────────────┐
                    │     SOVEREIGN DIGITAL IMPERIUM       │
                    │         (MOTHER FOLDER)              │
                    └──────────────┬──────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
    ┌─────▼──────┐          ┌─────▼──────┐          ┌─────▼──────┐
    │  PREDATOR   │          │   SOCIAL    │          │  ECO-GREEN  │
    │   SUITE     │          │  PREDATOR   │          │ INITIATIVE  │
    │ (Web 2.0)   │          │  (Omni)     │          │ (L-0)       │
    └─────┬──────┘          └─────┬──────┘          └─────┬──────┘
          │                        │                        │
          └────────────────────────┼────────────────────────┘
                                   │
                    ┌──────────────▼──────────────────────┐
                    │        SOVEREIGN BRAIN              │
                    │    (AI Orchestrator Layer)           │
                    │                                     │
                    │  ┌──────┐ ┌──────┐ ┌──────┐        │
                    │  │SCOUT │ │CLOSER│ │ARCHI-│        │
                    │  │AGENT │ │AGENT │ │TECT  │        │
                    │  └──┬───┘ └──┬───┘ └──┬───┘        │
                    │     │        │        │             │
                    │  ┌──▼────────▼────────▼──┐          │
                    │  │   GROQ LLAMA 3.3 70B   │          │
                    │  │   (AI Reasoning)        │          │
                    │  └────────────────────────┘          │
                    └──────────────┬──────────────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
    ┌─────▼──────┐          ┌─────▼──────┐          ┌─────▼──────┐
    │  SUPABASE   │          │ CLOUDFLARE  │          │  SERPAPI    │
    │ (Database)  │          │  (Deploy)   │          │ (Scraping) │
    └────────────┘          └────────────┘          └────────────┘
```

---

## 1. System Layers (Detailed)

### Layer 0: Real World Foundation (L-0)
```
┌────────────────────────────────────────────────┐
│                  LAYER 0: PHYSICAL              │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Sovereign │  │   SICA   │  │   SHGA   │     │
│  │  Barber   │  │(Catering)│  │ (Hamper) │     │
│  └──────────┘  └──────────┘  └──────────┘     │
│                                                 │
│  ┌──────────┐  ┌──────────┐                    │
│  │Eco-Green │  │  GANI    │                    │
│  │(Recycle) │  │  Store   │                    │
│  └──────────┘  └──────────┘                    │
└────────────────────────────────────────────────┘
```

### Layer 1: Web 2.5 Bridge (Revenue Engine)
```
┌────────────────────────────────────────────────┐
│              LAYER 1: WEB 2.5 BRIDGE            │
│                                                 │
│  Frontend: Hono + TailwindCSS (Mobile-First)    │
│  Backend:  Cloudflare Workers (Edge)            │
│  Database: Supabase (PostgreSQL + Realtime)     │
│  Payment:  Midtrans/DOKU (Fiat)                 │
│                                                 │
│  Services:                                      │
│  - Barber Booking System                        │
│  - SICA/SHGA E-commerce                        │
│  - Lead Management CRM                         │
│  - Auto-Deploy Demo Websites                   │
│                                                 │
│  Target: $500 Liquidity                         │
└────────────────────────────────────────────────┘
```

### Layer 2: Web 3.0 Token Economy
```
┌────────────────────────────────────────────────┐
│            LAYER 2: WEB 3.0 ECONOMY             │
│                                                 │
│  Token:    $HYPHA                               │
│  DEX:      Liquidity Pool                       │
│  Staking:  Yield Generation                     │
│  NFT:      Style Vault (Barber)                 │
│                                                 │
│  Activation: After $500 Liquidity reached       │
└────────────────────────────────────────────────┘
```

### Layer 3: Web 4.0 AI Orchestration
```
┌────────────────────────────────────────────────┐
│          LAYER 3: WEB 4.0 AI BRAIN              │
│                                                 │
│  Orchestrator: CrewAI + LangGraph               │
│  AI Model:     Groq Llama 3.3 70B              │
│  Agents:                                        │
│    - The Scout    (Lead Hunter)                 │
│    - The Profiler (AI Scoring)                  │
│    - The Closer   (WA Automation)               │
│    - The Architect(Web Builder)                 │
│    - The Harvester(Profit Manager)              │
│                                                 │
│  Pattern: Orchestrator-Worker (RAM Efficient)   │
│  VPS: 2GB RAM -> Offload AI to Cloud APIs       │
└────────────────────────────────────────────────┘
```

### Layer 4: Web 5.0 Self-Sovereign
```
┌────────────────────────────────────────────────┐
│       LAYER 4: WEB 5.0 SOVEREIGNTY              │
│                                                 │
│  DID:  Decentralized Identifiers               │
│  DWN:  Decentralized Web Nodes                 │
│  Vault: AES-256 + IPFS (Pinata)                │
│                                                 │
│  Services:                                      │
│    - Sovereign Legacy (Family Vault)            │
│    - Style Vault (Barber History)               │
│    - Data Ownership (User Controls)             │
└────────────────────────────────────────────────┘
```

---

## 2. Multi-Agent Predator Architecture

```
         INPUT                PROCESSING              OUTPUT
    ┌──────────┐         ┌──────────────┐        ┌──────────┐
    │ Target   │────────▶│  THE SCOUT    │───────▶│ 50 Hot   │
    │ Location │         │ (SerpAPI)     │        │ Leads    │
    └──────────┘         └──────────────┘        └────┬─────┘
                                                       │
                         ┌──────────────┐              │
                         │ THE PROFILER  │◀────────────┘
                         │ (AI Scoring)  │
                         └──────┬───────┘
                                │
                    ┌───────────┼───────────┐
                    │                       │
            ┌───────▼───────┐       ┌───────▼───────┐
            │ THE GHOSTWRITER│       │ THE ARCHITECT  │
            │ (WA Messages) │       │ (Demo Builder) │
            └───────┬───────┘       └───────┬───────┘
                    │                       │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │    THE HARVESTER      │
                    │  (Profit Allocator)   │
                    │                       │
                    │  30% Operations       │
                    │  20% Growth           │
                    │  30% Liquidity        │
                    │  10% Staking          │
                    │  10% Owner Profit     │
                    └───────────────────────┘
```

---

## 3. VPS Infrastructure (2GB RAM Optimization)

```
┌──────────────────────────────────────┐
│         VPS 2GB RAM LAYOUT           │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Hono/Node.js Orchestrator     │  │
│  │ (~200MB RAM)                  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ PM2 Process Manager           │  │
│  │ (~50MB RAM)                   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ZRAM + Swap (4GB Virtual)     │  │
│  │ Makes 2GB feel like 4GB       │  │
│  └────────────────────────────────┘  │
│                                      │
│  Heavy Processing = OFFLOADED:       │
│  - AI Reasoning -> Groq Cloud API    │
│  - Database     -> Supabase Cloud    │
│  - Deployment   -> Cloudflare API    │
│  - Scraping     -> SerpAPI Cloud     │
└──────────────────────────────────────┘
```

---

## 4. Data Flow Architecture

```
    Google Maps                Social Media
    (SerpAPI)                  (IG/TikTok/FB)
        │                          │
        ▼                          ▼
┌──────────────────────────────────────────┐
│           SUPABASE DATABASE               │
│                                           │
│  leads          │  transactions           │
│  ├─ id          │  ├─ id                  │
│  ├─ name        │  ├─ lead_id             │
│  ├─ category    │  ├─ amount              │
│  ├─ location    │  ├─ status              │
│  ├─ ai_score    │  ├─ payment_method      │
│  ├─ digital_gap │  └─ created_at          │
│  ├─ wa_number   │                         │
│  └─ status      │  agent_logs             │
│                  │  ├─ id                  │
│  demo_sites     │  ├─ agent_name          │
│  ├─ id          │  ├─ action              │
│  ├─ lead_id     │  ├─ result              │
│  ├─ url         │  └─ created_at          │
│  ├─ template    │                         │
│  └─ deployed_at │  liquidity_sync         │
│                  │  ├─ total_revenue       │
│                  │  ├─ allocated_liq       │
│                  │  └─ target_progress     │
└──────────────────────────────────────────┘
```

---

## 5. Deployment Architecture

```
┌──────────────────────────────────────────────┐
│              DEPLOYMENT PIPELINE              │
│                                               │
│  Developer (GYS)                              │
│       │                                       │
│       ▼                                       │
│  GitHub (Mother Folder)                       │
│       │                                       │
│       ├──────────────────┐                    │
│       │                  │                    │
│       ▼                  ▼                    │
│  Cloudflare Pages    VPS (2GB RAM)            │
│  (Static + API)      (Orchestrator)           │
│       │                  │                    │
│       ▼                  ▼                    │
│  Edge Network        PM2 Daemon               │
│  (Global CDN)        (24/7 Uptime)            │
│                                               │
│  External APIs:                               │
│  ├─ Groq (AI)                                │
│  ├─ Supabase (DB)                            │
│  ├─ SerpAPI (Scraping)                       │
│  └─ WhatsApp Deeplink (Messaging)            │
└──────────────────────────────────────────────┘
```

---

## 6. Security Architecture

```
┌──────────────────────────────────────────────┐
│              SECURITY LAYERS                  │
│                                               │
│  1. VPS Hardening                             │
│     - SSH Key Only (Port 2209)                │
│     - UFW Firewall                            │
│     - Fail2Ban                                │
│     - No Root Login                           │
│                                               │
│  2. API Security                              │
│     - .dev.vars (local secrets)               │
│     - Cloudflare Secrets (production)         │
│     - CORS restricted                         │
│     - Rate limiting                           │
│                                               │
│  3. Data Security                             │
│     - Supabase Row Level Security             │
│     - AES-256 Encryption (Legacy Vault)       │
│     - IPFS + Pinata (Immutable Storage)       │
│                                               │
│  4. Git Security                              │
│     - .gitignore (no secrets committed)       │
│     - GitHub Access Token (not in code)       │
└──────────────────────────────────────────────┘
```
