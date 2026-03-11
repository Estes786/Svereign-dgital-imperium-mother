import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GROQ_API_KEY?: string
  PREDATOR_URL?: string
  STORE_URL?: string
  ECONOMY_URL?: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// ============================================================
// API ROUTES - Ecosystem Health & Bridge
// ============================================================

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    name: 'Sovereign Command Center',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    ecosystem: {
      web2_predator: 'https://sovereign-predator-suite.pages.dev',
      web25_store: 'https://sovereignt-agent-store-1.pages.dev',
      web3_economy: 'https://gani-hypha-web3.pages.dev'
    }
  })
})

// Ecosystem status aggregator
app.get('/api/ecosystem/status', async (c) => {
  const predatorUrl = c.env?.PREDATOR_URL || 'https://sovereign-predator-suite.pages.dev'
  const storeUrl = c.env?.STORE_URL || 'https://sovereignt-agent-store-1.pages.dev'
  const economyUrl = c.env?.ECONOMY_URL || 'https://gani-hypha-web3.pages.dev'

  const results: Record<string, any> = {}
  
  // Fetch health from each app (with timeout)
  const fetchHealth = async (name: string, url: string) => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000)
      const res = await fetch(`${url}/api/health`, { signal: controller.signal })
      clearTimeout(timeout)
      if (res.ok) {
        const data = await res.json()
        return { status: 'online', data }
      }
      return { status: 'error', code: res.status }
    } catch {
      return { status: 'offline' }
    }
  }

  const [predator, store, economy] = await Promise.all([
    fetchHealth('predator', predatorUrl),
    fetchHealth('store', storeUrl),
    fetchHealth('economy', economyUrl)
  ])

  return c.json({
    timestamp: new Date().toISOString(),
    command_center: 'online',
    ecosystem: { predator, store, economy }
  })
})

// Sovereign Bridge - Cross-app event relay
app.post('/api/bridge/event', async (c) => {
  const body = await c.req.json()
  // In production: relay events between apps, update shared DB
  return c.json({
    received: true,
    event_type: body.type,
    source: body.source,
    timestamp: new Date().toISOString(),
    note: 'Event logged. Bridge relay will be active when Supabase is connected.'
  })
})

// ============================================================
// COMMAND CENTER DASHBOARD
// ============================================================

app.get('/', (c) => {
  return c.html(commandCenterHTML())
})

app.get('/dashboard', (c) => {
  return c.html(commandCenterHTML())
})

function commandCenterHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>SOVEREIGN COMMAND CENTER - The Mother Folder</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --gold: #D4AF37;
      --gold-dim: rgba(212,175,55,0.15);
      --dark: #0a0a0f;
      --card: #111827;
      --surface: #1a1a2e;
      --accent: #00AEEF;
      --danger: #EF4444;
      --success: #10B981;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--dark); color: #e5e7eb; font-family: 'Inter', sans-serif; min-height: 100vh; overflow-x: hidden; }
    
    /* Animated background */
    .bg-grid { 
      background-image: 
        linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;
    }
    .bg-glow {
      position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
      width: 600px; height: 600px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%);
      z-index: 0; pointer-events: none;
    }
    
    .content { position: relative; z-index: 1; }
    .gold-text { background: linear-gradient(135deg, #D4AF37, #F5E6A3, #B8860B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .accent-text { color: var(--accent); }
    
    .card { 
      background: rgba(17,24,39,0.8); backdrop-filter: blur(10px);
      border: 1px solid rgba(212,175,55,0.1); border-radius: 16px; 
      transition: all 0.3s; 
    }
    .card:hover { border-color: rgba(212,175,55,0.3); box-shadow: 0 0 30px rgba(212,175,55,0.1); transform: translateY(-2px); }
    
    .app-card { cursor: pointer; }
    .app-card .icon-circle {
      width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; transition: all 0.3s;
    }
    .app-card:hover .icon-circle { transform: scale(1.1); }
    
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .status-online { background: var(--success); box-shadow: 0 0 8px var(--success); }
    .status-offline { background: var(--danger); box-shadow: 0 0 8px var(--danger); }
    .status-checking { background: var(--gold); animation: pulse 1.5s infinite; }
    
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: slideUp 0.5s ease-out forwards; }
    
    .layer-bar { height: 8px; border-radius: 4px; transition: width 1s ease; }
    
    .nav-tab { 
      padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; transition: all 0.2s;
      border: 1px solid transparent; font-size: 0.85rem;
    }
    .nav-tab:hover { background: rgba(212,175,55,0.1); }
    .nav-tab.active { background: rgba(212,175,55,0.15); border-color: rgba(212,175,55,0.3); color: var(--gold); }
    
    .metric-value { font-family: 'JetBrains Mono', monospace; font-weight: 700; }
    
    .btn-gold {
      background: linear-gradient(135deg, #D4AF37, #B8860B); color: #0a0a0f; font-weight: 700;
      padding: 0.75rem 1.5rem; border-radius: 12px; border: none; cursor: pointer; transition: all 0.3s;
    }
    .btn-gold:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(212,175,55,0.4); }

    /* Mobile optimized */
    @media (max-width: 640px) {
      .grid-apps { grid-template-columns: 1fr !important; }
      .hero-title { font-size: 1.5rem !important; }
    }
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="bg-glow"></div>
  
  <div class="content">
    <!-- HEADER -->
    <header class="px-4 py-4 border-b border-gray-800/50" style="backdrop-filter: blur(10px); background: rgba(10,10,15,0.8);">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center text-xl" style="background: linear-gradient(135deg, #D4AF37, #B8860B);">
            👑
          </div>
          <div>
            <h1 class="font-bold text-sm gold-text">SOVEREIGN COMMAND CENTER</h1>
            <p class="text-xs text-gray-500">The Mother Folder | Unified Imperium</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span id="globalStatus" class="status-dot status-checking"></span>
          <span class="text-xs text-gray-400" id="statusText">Checking...</span>
        </div>
      </div>
    </header>

    <!-- NAV TABS -->
    <div class="px-4 py-3 border-b border-gray-800/30 overflow-x-auto" style="background: rgba(10,10,15,0.5);">
      <div class="max-w-6xl mx-auto flex gap-2">
        <div class="nav-tab active" onclick="showTab('overview')"><i class="fas fa-home mr-1"></i>Overview</div>
        <div class="nav-tab" onclick="showTab('apps')"><i class="fas fa-th-large mr-1"></i>Apps</div>
        <div class="nav-tab" onclick="showTab('bridge')"><i class="fas fa-exchange-alt mr-1"></i>Bridge</div>
        <div class="nav-tab" onclick="showTab('revenue')"><i class="fas fa-chart-line mr-1"></i>Revenue</div>
        <div class="nav-tab" onclick="showTab('roadmap')"><i class="fas fa-road mr-1"></i>Roadmap</div>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <main class="max-w-6xl mx-auto px-4 py-6">
      
      <!-- OVERVIEW TAB -->
      <div id="tab-overview" class="tab-content">
        <!-- Hero -->
        <div class="card p-6 mb-6 animate-in" style="animation-delay: 0.1s">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h2 class="hero-title text-2xl font-black gold-text mb-2">SOVEREIGN DIGITAL IMPERIUM</h2>
              <p class="text-gray-400 text-sm">Satu Paket, Satu Visi, Kedaulatan Penuh 😌🔥👑</p>
            </div>
            <span class="text-3xl">🏰</span>
          </div>
          
          <!-- 4-Layer Stack Visualization -->
          <div class="space-y-2 mt-4">
            <div class="flex items-center gap-3">
              <span class="text-xs w-16 text-right text-gray-500">L-3 Web5</span>
              <div class="flex-1 bg-gray-800 rounded-full h-2"><div class="layer-bar bg-purple-500" style="width: 10%"></div></div>
              <span class="text-xs text-gray-500">10%</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs w-16 text-right text-gray-500">L-2 Web3</span>
              <div class="flex-1 bg-gray-800 rounded-full h-2"><div class="layer-bar bg-blue-500" style="width: 25%"></div></div>
              <span class="text-xs text-gray-500">25%</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs w-16 text-right text-gray-500">L-1 Web2.5</span>
              <div class="flex-1 bg-gray-800 rounded-full h-2"><div class="layer-bar" style="width: 50%; background: var(--accent)"></div></div>
              <span class="text-xs text-gray-500">50%</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs w-16 text-right text-gray-500">L-0 Web2</span>
              <div class="flex-1 bg-gray-800 rounded-full h-2"><div class="layer-bar" style="width: 75%; background: var(--gold)"></div></div>
              <span class="text-xs text-gray-500">75%</span>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div class="card p-4 animate-in" style="animation-delay: 0.2s">
            <div class="text-xs text-gray-500 mb-1">Total Leads</div>
            <div class="metric-value text-xl" style="color: var(--gold)" id="totalLeads">8</div>
            <div class="text-xs text-green-400 mt-1"><i class="fas fa-arrow-up"></i> Active hunting</div>
          </div>
          <div class="card p-4 animate-in" style="animation-delay: 0.3s">
            <div class="text-xs text-gray-500 mb-1">Revenue</div>
            <div class="metric-value text-xl" style="color: var(--success)" id="totalRevenue">Rp 200.000</div>
            <div class="text-xs text-gray-400 mt-1">Target: $500</div>
          </div>
          <div class="card p-4 animate-in" style="animation-delay: 0.4s">
            <div class="text-xs text-gray-500 mb-1">Agents Live</div>
            <div class="metric-value text-xl" style="color: var(--accent)" id="totalAgents">6</div>
            <div class="text-xs text-gray-400 mt-1">Web 2.5 Store</div>
          </div>
          <div class="card p-4 animate-in" style="animation-delay: 0.5s">
            <div class="text-xs text-gray-500 mb-1">$HYPHA</div>
            <div class="metric-value text-xl text-purple-400" id="hyphaValue">$0.00</div>
            <div class="text-xs text-gray-400 mt-1">Pre-launch</div>
          </div>
        </div>

        <!-- Ecosystem Apps Grid -->
        <h3 class="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider"><i class="fas fa-layer-group mr-1"></i> Ecosystem Apps</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 grid-apps mb-6">
          
          <!-- Web 2.0 Predator -->
          <a href="https://sovereign-predator-suite.pages.dev" target="_blank" class="card app-card p-5 animate-in" style="animation-delay: 0.2s">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-circle" style="background: rgba(212,175,55,0.15); color: var(--gold);">
                <i class="fas fa-crosshairs"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-sm">Sovereign Predator Suite</h4>
                <p class="text-xs text-gray-500">Web 2.0 — Lead Hunter & Closer</p>
              </div>
              <span id="predator-status" class="status-dot status-checking"></span>
            </div>
            <div class="text-xs text-gray-400 mb-3">Scout Agent mencari leads via Google Maps + AI scoring. Auto-generate pesan WhatsApp & demo website.</div>
            <div class="flex items-center justify-between">
              <div class="flex gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(212,175,55,0.15); color: var(--gold);">Hono</span>
                <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(0,174,239,0.15); color: var(--accent);">Groq AI</span>
              </div>
              <i class="fas fa-external-link-alt text-xs text-gray-600"></i>
            </div>
          </a>

          <!-- Web 2.5 Store -->
          <a href="https://sovereignt-agent-store-1.pages.dev" target="_blank" class="card app-card p-5 animate-in" style="animation-delay: 0.3s">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-circle" style="background: rgba(0,174,239,0.15); color: var(--accent);">
                <i class="fas fa-store"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-sm">Sovereign Agent Store</h4>
                <p class="text-xs text-gray-500">Web 2.5 — AI Agent Marketplace</p>
              </div>
              <span id="store-status" class="status-dot status-checking"></span>
            </div>
            <div class="text-xs text-gray-400 mb-3">Marketplace untuk AI agents. Barber Dynasty, SICA Catering, SHGA Hamper, dan lebih banyak lagi.</div>
            <div class="flex items-center justify-between">
              <div class="flex gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(0,174,239,0.15); color: var(--accent);">Hono</span>
                <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(16,185,129,0.15); color: var(--success);">Store</span>
              </div>
              <i class="fas fa-external-link-alt text-xs text-gray-600"></i>
            </div>
          </a>

          <!-- Web 3.0 Economy -->
          <a href="https://gani-hypha-web3.pages.dev" target="_blank" class="card app-card p-5 animate-in" style="animation-delay: 0.4s">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-circle" style="background: rgba(139,92,246,0.15); color: #8B5CF6;">
                <i class="fas fa-gem"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-sm">GANI HYPHA Economy</h4>
                <p class="text-xs text-gray-500">Web 3.0 — Token & Autonomous Economy</p>
              </div>
              <span id="economy-status" class="status-dot status-checking"></span>
            </div>
            <div class="text-xs text-gray-400 mb-3">$HYPHA Token, DAO Governance, Liquidity Pool, Staking, dan seluruh ekosistem Web3 + Web5 DID.</div>
            <div class="flex items-center justify-between">
              <div class="flex gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(139,92,246,0.15); color: #8B5CF6;">React</span>
                <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(239,68,68,0.15); color: var(--danger);">Ethers</span>
              </div>
              <i class="fas fa-external-link-alt text-xs text-gray-600"></i>
            </div>
          </a>
        </div>

        <!-- Architecture Diagram -->
        <div class="card p-5 animate-in" style="animation-delay: 0.5s">
          <h3 class="font-bold text-sm mb-4 gold-text"><i class="fas fa-project-diagram mr-1"></i> Mother Folder Architecture</h3>
          <div class="font-mono text-xs leading-relaxed" style="color: var(--gold);">
            <pre style="overflow-x: auto; white-space: pre;">
/sovereign-digital-imperium (MOTHER FOLDER)
├── /apps
│   ├── /web2-predator    ← Svereign-predtor-suite (Hono+Vite)
│   ├── /web25-store      ← Sovereignt-agent-store-1 (Hono+Vite)  
│   ├── /web3-economy     ← Agnt-Mrket-place-Web-3-Web-4-5 (React+Hono)
│   └── /command-center   ← THIS APP (Unified Dashboard)
├── /packages
│   ├── /shared-core      ← API Clients, Types, Utilities
│   └── /shared-ui        ← Predator Dark Mode Design System
├── /docs                 ← All Blueprint & Strategy Documents
│   ├── /01-vision-philosophy
│   ├── /02-product-requirements
│   ├── /03-architecture
│   ├── ...14 categories of docs
│   └── /15-eco-green
├── /infra                ← Cloudflare & GitHub Actions
└── package.json          ← NPM Workspaces (Monorepo Root)
            </pre>
          </div>
        </div>
      </div>

      <!-- APPS TAB -->
      <div id="tab-apps" class="tab-content" style="display:none;">
        <h2 class="text-lg font-bold gold-text mb-4"><i class="fas fa-th-large mr-2"></i>All Sovereign Apps</h2>
        
        <div class="space-y-4">
          <!-- Predator Deep -->
          <div class="card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style="background: rgba(212,175,55,0.15);">🎯</div>
              <div class="flex-1">
                <h3 class="font-bold gold-text">Sovereign Predator Suite (Web 2.0)</h3>
                <p class="text-xs text-gray-500">The Revenue Engine — Hunt, Close, Build, Harvest</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Scout Agent</div>
                <div class="text-sm font-semibold text-green-400"><i class="fas fa-check-circle"></i> Active</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Closer Agent</div>
                <div class="text-sm font-semibold text-yellow-400"><i class="fas fa-clock"></i> Phase 4</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Architect Agent</div>
                <div class="text-sm font-semibold text-yellow-400"><i class="fas fa-clock"></i> Phase 5</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-xs text-gray-500">Harvester</div>
                <div class="text-sm font-semibold text-gray-500"><i class="fas fa-lock"></i> Phase 6</div>
              </div>
            </div>
            <div class="flex gap-2">
              <a href="https://sovereign-predator-suite.pages.dev" target="_blank" class="btn-gold text-xs px-3 py-2 rounded-lg inline-flex items-center gap-1"><i class="fas fa-external-link-alt"></i> Open App</a>
              <a href="https://github.com/Estes786/Svereign-predtor-suite" target="_blank" class="text-xs px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white inline-flex items-center gap-1"><i class="fab fa-github"></i> GitHub</a>
            </div>
          </div>

          <!-- Store Deep -->
          <div class="card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style="background: rgba(0,174,239,0.15);">🏪</div>
              <div class="flex-1">
                <h3 class="font-bold accent-text">Sovereign Agent Store (Web 2.5)</h3>
                <p class="text-xs text-gray-500">AI Agent Marketplace — Buy, Sell, Upgrade Agents</p>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div class="bg-gray-800/50 rounded-lg p-2 text-center">
                <div class="text-lg">✂️</div>
                <div class="text-xs text-gray-400">Barber</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-2 text-center">
                <div class="text-lg">🍽️</div>
                <div class="text-xs text-gray-400">SICA</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-2 text-center">
                <div class="text-lg">🎁</div>
                <div class="text-xs text-gray-400">SHGA</div>
              </div>
            </div>
            <div class="flex gap-2">
              <a href="https://sovereignt-agent-store-1.pages.dev" target="_blank" class="btn-gold text-xs px-3 py-2 rounded-lg inline-flex items-center gap-1"><i class="fas fa-external-link-alt"></i> Open Store</a>
              <a href="https://github.com/Estes786/Sovereignt-agent-store-1" target="_blank" class="text-xs px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white inline-flex items-center gap-1"><i class="fab fa-github"></i> GitHub</a>
            </div>
          </div>

          <!-- Economy Deep -->
          <div class="card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style="background: rgba(139,92,246,0.15);">💎</div>
              <div class="flex-1">
                <h3 class="font-bold text-purple-400">GANI HYPHA Economy (Web 3.0)</h3>
                <p class="text-xs text-gray-500">Token Economy — $HYPHA, DAO, DeFi, Web5 DID</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-xs text-gray-500">$HYPHA Token</div>
                <div class="text-sm font-semibold text-purple-400">Pre-launch</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-xs text-gray-500">DAO Governance</div>
                <div class="text-sm font-semibold text-purple-400">Designed</div>
              </div>
            </div>
            <div class="flex gap-2">
              <a href="https://gani-hypha-web3.pages.dev" target="_blank" class="btn-gold text-xs px-3 py-2 rounded-lg inline-flex items-center gap-1"><i class="fas fa-external-link-alt"></i> Open Economy</a>
              <a href="https://github.com/Estes786/Agnt-Mrket-place-Web-3-Web-4-5" target="_blank" class="text-xs px-3 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white inline-flex items-center gap-1"><i class="fab fa-github"></i> GitHub</a>
            </div>
          </div>
        </div>
      </div>

      <!-- BRIDGE TAB -->
      <div id="tab-bridge" class="tab-content" style="display:none;">
        <h2 class="text-lg font-bold gold-text mb-4"><i class="fas fa-exchange-alt mr-2"></i>Sovereign Bridge</h2>
        <div class="card p-5 mb-4">
          <h3 class="font-semibold text-sm mb-3">Cross-App Data Flow</h3>
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span class="text-xl">🎯</span>
              <div class="flex-1">
                <div class="text-xs font-semibold" style="color: var(--gold)">Web 2.0 → Bridge</div>
                <div class="text-xs text-gray-400">Lead closed → Revenue recorded → Trigger sync</div>
              </div>
              <i class="fas fa-arrow-right text-gray-600"></i>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span class="text-xl">🏪</span>
              <div class="flex-1">
                <div class="text-xs font-semibold" style="color: var(--accent)">Web 2.5 → Bridge</div>
                <div class="text-xs text-gray-400">Agent sold/upgraded → Badge update → Notify economy</div>
              </div>
              <i class="fas fa-arrow-right text-gray-600"></i>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
              <span class="text-xl">💎</span>
              <div class="flex-1">
                <div class="text-xs font-semibold text-purple-400">Web 3.0 ← Bridge</div>
                <div class="text-xs text-gray-400">Revenue in → 20% to LP $HYPHA → Liquidity grows</div>
              </div>
              <i class="fas fa-check-circle text-green-400"></i>
            </div>
          </div>
        </div>
        <div class="card p-5">
          <h3 class="font-semibold text-sm mb-3">Bridge Status</h3>
          <div class="text-xs text-gray-400">
            <p class="mb-2"><i class="fas fa-info-circle text-yellow-400"></i> Bridge is in <span class="text-yellow-400 font-semibold">DESIGN PHASE</span></p>
            <p>When Supabase is connected and all apps are live, the bridge will automatically relay events between Web 2.0 (revenue), Web 2.5 (agents), and Web 3.0 ($HYPHA).</p>
          </div>
        </div>
      </div>

      <!-- REVENUE TAB -->
      <div id="tab-revenue" class="tab-content" style="display:none;">
        <h2 class="text-lg font-bold gold-text mb-4"><i class="fas fa-chart-line mr-2"></i>Revenue Tracker</h2>
        <div class="card p-5 mb-4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-xs text-gray-500">Liquidity Target</div>
              <div class="metric-value text-2xl" style="color: var(--gold)">$500</div>
            </div>
            <div class="text-right">
              <div class="text-xs text-gray-500">Current</div>
              <div class="metric-value text-2xl text-green-400">$13.33</div>
            </div>
          </div>
          <div class="bg-gray-800 rounded-full h-4 mb-2">
            <div class="h-4 rounded-full" style="width: 2.67%; background: linear-gradient(90deg, var(--gold), var(--success)); min-width: 20px;"></div>
          </div>
          <div class="text-xs text-gray-500 text-center">2.67% of $500 target (Rp 200.000 / Rp 7.500.000)</div>
        </div>
        <div class="card p-5">
          <h3 class="font-semibold text-sm mb-3">Transaction History</h3>
          <div class="bg-gray-800/50 rounded-lg p-3 mb-2 flex items-center gap-3">
            <span class="text-lg">💰</span>
            <div class="flex-1">
              <div class="text-xs font-semibold text-green-400">Landing Page - Kedai Kopi Luwak</div>
              <div class="text-xs text-gray-500">INV-2026-001 • 6 Mar 2026</div>
            </div>
            <div class="text-sm font-bold text-green-400">Rp 200.000</div>
          </div>
          <p class="text-xs text-gray-500 text-center mt-3">Keep hunting, Gyss! The Predator never sleeps 🔥</p>
        </div>
      </div>

      <!-- ROADMAP TAB -->
      <div id="tab-roadmap" class="tab-content" style="display:none;">
        <h2 class="text-lg font-bold gold-text mb-4"><i class="fas fa-road mr-2"></i>Session Roadmap</h2>
        <div class="space-y-3">
          <div class="card p-4 border-l-4" style="border-left-color: var(--success);">
            <div class="flex items-center gap-2 mb-1">
              <i class="fas fa-check-circle text-green-400 text-sm"></i>
              <span class="font-semibold text-sm">SESI 001: Foundation</span>
            </div>
            <p class="text-xs text-gray-400">Mother Folder initialized. 3 repos integrated. Shared packages created.</p>
          </div>
          <div class="card p-4 border-l-4" style="border-left-color: var(--gold);">
            <div class="flex items-center gap-2 mb-1">
              <i class="fas fa-spinner fa-spin text-yellow-400 text-sm"></i>
              <span class="font-semibold text-sm">SESI 002: Brain Sync</span>
            </div>
            <p class="text-xs text-gray-400">Integrasi Groq API & Supabase ke shared-core. Agent communication.</p>
          </div>
          <div class="card p-4 border-l-4 opacity-60" style="border-left-color: #374151;">
            <div class="flex items-center gap-2 mb-1">
              <i class="fas fa-lock text-gray-500 text-sm"></i>
              <span class="font-semibold text-sm">SESI 003: Predator Crew (CrewAI)</span>
            </div>
            <p class="text-xs text-gray-400">Orchestrator mengatur Scout→Profiler→Closer→Architect→Harvester.</p>
          </div>
          <div class="card p-4 border-l-4 opacity-60" style="border-left-color: #374151;">
            <div class="flex items-center gap-2 mb-1">
              <i class="fas fa-lock text-gray-500 text-sm"></i>
              <span class="font-semibold text-sm">SESI 004: Zero-Touch Builder</span>
            </div>
            <p class="text-xs text-gray-400">Architect Agent auto-deploy demo websites ke Cloudflare.</p>
          </div>
          <div class="card p-4 border-l-4 opacity-60" style="border-left-color: #374151;">
            <div class="flex items-center gap-2 mb-1">
              <i class="fas fa-lock text-gray-500 text-sm"></i>
              <span class="font-semibold text-sm">SESI 005: The Harvest ($500)</span>
            </div>
            <p class="text-xs text-gray-400">Revenue optimization. $500 liquidity target. $HYPHA activation.</p>
          </div>
        </div>
      </div>

    </main>

    <!-- FOOTER -->
    <footer class="px-4 py-6 border-t border-gray-800/30 text-center">
      <p class="text-xs text-gray-600">Sovereign Digital Imperium v1.0 • Mother Folder Edition</p>
      <p class="text-xs text-gray-700 mt-1">Built with Hono + Cloudflare Workers • Zero Mercy Execution 😌🔥👑</p>
    </footer>
  </div>

  <script>
    // Tab navigation
    function showTab(name) {
      document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none')
      document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'))
      document.getElementById('tab-' + name).style.display = 'block'
      event.currentTarget.classList.add('active')
    }

    // Check ecosystem health via server-side proxy
    async function checkEcosystem() {
      try {
        const res = await fetch('/api/ecosystem/status')
        const data = await res.json()
        
        const apps = ['predator', 'store', 'economy']
        let onlineCount = 0
        
        apps.forEach(app => {
          const dot = document.getElementById(app + '-status')
          if (dot) {
            const status = data.ecosystem?.[app]?.status
            if (status === 'online') {
              dot.className = 'status-dot status-online'
              onlineCount++
            } else {
              dot.className = 'status-dot status-offline'
            }
          }
        })

        const globalDot = document.getElementById('globalStatus')
        const statusText = document.getElementById('statusText')
        if (onlineCount === apps.length) {
          globalDot.className = 'status-dot status-online'
          statusText.textContent = 'All Systems Online'
        } else if (onlineCount > 0) {
          globalDot.className = 'status-dot status-checking'
          statusText.textContent = onlineCount + '/' + apps.length + ' Online'
        } else {
          globalDot.className = 'status-dot status-offline'
          statusText.textContent = 'Command Center Active'
        }
      } catch {
        document.getElementById('globalStatus').className = 'status-dot status-online'
        document.getElementById('statusText').textContent = 'Command Center Active'
      }
    }

    // Run health check
    checkEcosystem()
    // Auto-refresh every 60s
    setInterval(checkEcosystem, 60000)
  </script>
</body>
</html>`
}

export default app
