# SOVEREIGN DIGITAL IMPERIUM - MOTHER FOLDER

## The Unified Command Center for Sovereign Ecosystem

**Owner**: GYS (The Sovereign Orchestrator)  
**Status**: MONOREPO INTEGRATED & LIVE  
**Vision**: Autonomous AI Business Empire (Web 2.0 -> Web 5.0)  
**Target**: $500 Liquidity -> Infinite Scaling  
**Last Updated**: 2026-03-11

---

## Project Overview

This is the **MOTHER FOLDER (Monorepo)** that unifies the entire Sovereign Digital Imperium ecosystem. Three separate repositories have been integrated into one cohesive workspace with shared packages, unified deployment, and a master control gateway.

## URLs

- **Gateway (Command Center)**: Live on sandbox
- **GitHub (Mother Folder)**: https://github.com/Estes786/Svereign-dgital-imperium-mother
- **API Health**: `/api/health`
- **API Ecosystem**: `/api/ecosystem`
- **API Apps**: `/api/apps`
- **API Roadmap**: `/api/roadmap`

## Monorepo Structure

```
sovereign-digital-imperium/ (MOTHER FOLDER)
|
|-- apps/
|   |-- gateway/               # Unified Master Control Dashboard (Hono + CF Pages)
|   |   |-- src/index.tsx      # Main gateway app with ecosystem API
|   |   |-- wrangler.jsonc     # Cloudflare config
|   |   `-- vite.config.ts     # Build config
|   |
|   |-- web2-predator/         # Web 2.0 - Autonomous Lead Hunting Engine
|   |   |-- src/               # Hono app with Scout Agent, Dashboard
|   |   |   |-- index.tsx      # Main app (APIs + Pages)
|   |   |   |-- agents/scout.ts # SerpAPI + Groq AI scoring
|   |   |   `-- pages/         # Landing + Dashboard HTML
|   |   `-- migrations/        # DB schema
|   |
|   |-- web25-store/           # Web 2.5 - AI Agent Marketplace  
|   |   |-- src/index.tsx      # Full marketplace app
|   |   `-- public/            # Static assets
|   |
|   `-- web3-economy/          # Web 3.0 - GANI HYPHA Economy
|       |-- src/               # React + Hono app
|       |   |-- components/    # 30+ React components
|       |   `-- server/        # Hono API server
|       `-- docs/              # Architecture docs
|
|-- packages/
|   |-- shared-core/           # Shared logic: Groq API, profit calculator, bridge events
|   |   `-- index.ts           # Core exports (callGroqAPI, calculateProfitSplit, etc.)
|   |
|   |-- shared-types/          # Shared TypeScript interfaces
|   |   `-- index.ts           # Lead, Message, Transaction, AgentProduct, etc.
|   |
|   `-- shared-ui/             # Shared Predator Dark Mode theme
|       `-- index.ts           # SOVEREIGN_THEME, SOVEREIGN_CSS, CDN_LINKS
|
|-- docs/                      # All documentation (129 files)
|   |-- 01-vision-philosophy/  # 4-Layer Architecture, Infinity Loop
|   |-- 02-product-requirements/ # PRD, TODO, Feature specs
|   |-- 03-architecture/       # Technical architecture & system design
|   |-- 04-design-uiux/        # UI/UX, Predator Dark Mode
|   |-- 05-business-strategy/  # Business plans, marketing
|   |-- 06-execution-protocols/ # Daily ops, profit scaling
|   |-- 07-vps-infrastructure/ # VPS 2GB RAM optimization
|   |-- 08-omni-channel-social/ # Social media automation
|   |-- 09-web4-autonomous/    # Web 4.0 autonomous architecture
|   |-- 10-integration-sync/   # Multi-repo sync
|   |-- 11-session-handoffs/   # Phase handoff documents
|   |-- 12-learning-blueprints/ # Claude API learning materials
|   |-- 13-conversation-logs/  # AI conversation history
|   |-- 14-execution-prompts/  # System prompts
|   `-- 15-eco-green/          # Eco-Green barber initiative
|
|-- ecosystem.config.cjs       # PM2 configuration
|-- package.json               # Root workspace config
`-- .gitignore                 # Git ignore rules
```

## The 3 Integrated Apps

| App | Layer | Tech Stack | Status | Description |
|:----|:------|:-----------|:-------|:------------|
| **web2-predator** | L-0/L-1 | Hono + Groq + SerpAPI | Phase 3 Active | Autonomous lead hunter. Scout searches Google Maps, AI scores leads, auto-generates WA messages |
| **web25-store** | L-1/L-2 | Hono + TailwindCSS | Live Marketplace | AI Agent marketplace for UMKM. 6 agents: Barber, Catering, Hamper, Property, Content, Laundry |
| **web3-economy** | L-2/L-3 | React + Ethers + Hono | Architecture Ready | $HYPHA token economy, DAO governance, DApps hub, wallet connect |

## Shared Packages

| Package | Purpose |
|:--------|:--------|
| `@sovereign/shared-core` | Groq API client, profit calculator, revenue tracker, bridge events, IDR/USD conversion |
| `@sovereign/shared-types` | TypeScript interfaces: Lead, Message, Transaction, AgentProduct, TreasuryStats |
| `@sovereign/shared-ui` | Predator Dark Mode theme: colors, gradients, fonts, CSS classes, CDN links |

## The 4-Layer Sovereign Stack

```
+--------------------------------------------------+
|  L-4: WEB 5.0 - Self-Sovereign Identity (FUTURE) |
|  (DID, DWN, Data Ownership)                      |
+--------------------------------------------------+
|  L-3: WEB 4.0 - AI Orchestration (IN PROGRESS)   |
|  (CrewAI, Groq Llama 3.3, Scout/Closer/Architect)|
+--------------------------------------------------+
|  L-2: WEB 3.0 - Token Economy (ARCHITECTURE)     |
|  ($HYPHA, Liquidity Pool, Staking, DAO)           |
+--------------------------------------------------+
|  L-1: WEB 2.5 - Revenue Bridge (LIVE)            |
|  (Agent Store, Barber Booking, SICA/SHGA)         |
+--------------------------------------------------+
|  L-0: REAL WORLD - Physical Business (LIVE)       |
|  (Sovereign Barber, Eco-Green, Predator Suite)    |
+--------------------------------------------------+
```

## Data Architecture

- **Primary Database**: Supabase (PostgreSQL + Realtime)
- **Edge Runtime**: Cloudflare Workers (Hono)
- **AI Engine**: Groq API (Llama 3.3 70B Versatile)
- **Scraping**: SerpAPI (Google Maps)
- **Token Economy**: Ethers.js + Smart Contracts (future)
- **Identity**: Web5 DID/DWN (future)

## User Guide

### Quick Start (Development)
```bash
# Clone the mother folder
git clone https://github.com/Estes786/Svereign-dgital-imperium-mother.git
cd Svereign-dgital-imperium-mother

# Install all dependencies (workspaces)
npm install

# Build the gateway
cd apps/gateway && npm run build

# Start dev server
npm run dev:sandbox
# -> http://localhost:3000
```

### API Endpoints (Gateway)
| Endpoint | Method | Description |
|:---------|:-------|:------------|
| `/api/health` | GET | System health check |
| `/api/ecosystem` | GET | Full ecosystem data (all apps, layers, packages) |
| `/api/apps` | GET | List all sovereign apps |
| `/api/apps/:key` | GET | Get specific app details |
| `/api/roadmap` | GET | Session execution roadmap |

## Deployment

- **Platform**: Cloudflare Pages
- **Status**: LIVE (Gateway)
- **Tech Stack**: Hono + Vite + npm Workspaces
- **Build Command**: `cd apps/gateway && npm run build`
- **Output Dir**: `apps/gateway/dist`

## Current Phase

| Phase | Status |
|:------|:-------|
| S001: Foundation (Mother Folder Init) | COMPLETED |
| S002: Brain Sync (Shared Logic) | COMPLETED |
| S003: Predator Crew (CrewAI) | IN PROGRESS |
| S004: Zero-Touch Builder | PENDING |
| S005: Harvest (Revenue & Scaling) | PENDING |
| S006: Web 3.0 Ascension | FUTURE |

---

**GAS POL, GYSS! THE SOVEREIGN PREDATOR NEVER SLEEPS!**  
**Satu Paket, Satu Visi, Kedaulatan Penuh!**
