export const dashboardHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PREDATOR DASHBOARD | Sovereign Predator Suite v3.0</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👹</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <script>
      tailwind.config={theme:{extend:{colors:{obsidian:'#050505','obsidian-card':'#1A1A1A',gold:'#FFD700','gold-dark':'#B8860B',neon:'#00FF00','neon-dark':'#00CC00',predator:'#FF3333'},fontFamily:{display:['Montserrat','sans-serif'],body:['Inter','sans-serif']}}}}
    </script>
    <style>
      body{font-family:'Inter',sans-serif;background:#050505;color:#fff;overflow-x:hidden;-webkit-tap-highlight-color:transparent}
      .glass{background:rgba(26,26,26,0.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,215,0,0.1)}
      .glass-gold{background:rgba(255,215,0,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,215,0,0.2)}
      .glow-neon{box-shadow:0 0 20px rgba(0,255,0,0.4),0 0 60px rgba(0,255,0,0.15)}
      @keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(0,255,0,0.4)}50%{box-shadow:0 0 35px rgba(0,255,0,0.6),0 0 80px rgba(0,255,0,0.2)}}
      @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes scanning{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @keyframes huntPulse{0%,100%{border-color:rgba(0,255,0,0.6)}50%{border-color:rgba(255,215,0,0.8)}}
      .animate-pulse-glow{animation:pulse-glow 2s ease-in-out infinite}
      .slide-up{animation:slideUp .5s ease-out forwards;opacity:0}
      .grid-bg{background-image:linear-gradient(rgba(255,215,0,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.02) 1px,transparent 1px);background-size:40px 40px}
      ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#050505}::-webkit-scrollbar-thumb{background:#FFD700;border-radius:4px}
      .tab-content{display:none}.tab-content.active{display:block}
      .score-high{color:#00FF00}.score-mid{color:#FFD700}.score-low{color:#FF3333}
      .lead-card{transition:all .3s ease}.lead-card:active{transform:scale(0.98)}
      .toast{position:fixed;top:70px;right:16px;z-index:100;transform:translateX(120%);transition:transform .3s ease}
      .toast.show{transform:translateX(0)}
      .scanning-bar{background:linear-gradient(90deg,transparent,rgba(0,255,0,0.3),rgba(0,255,0,0.6),rgba(0,255,0,0.3),transparent);background-size:200% 100%;animation:scanning 1.5s linear infinite}
      select,input{background:rgba(255,255,255,0.05);color:#fff}
      select option{background:#1A1A1A;color:#fff}
      .hunt-active{animation:huntPulse 1s ease-in-out infinite;border-color:rgba(0,255,0,0.6)}
      .scout-badge{background:linear-gradient(135deg,rgba(0,255,0,0.15),rgba(255,215,0,0.1));border:1px solid rgba(0,255,0,0.3)}
      .progress-ring{transition:stroke-dashoffset 0.5s ease}
    </style>
</head>
<body class="grid-bg min-h-screen pb-20">
    <!-- Toast Notification -->
    <div id="toast" class="toast glass-gold rounded-xl px-4 py-3 flex items-center gap-2 max-w-xs">
        <i id="toast-icon" class="fas fa-check-circle text-neon"></i>
        <span id="toast-msg" class="text-xs font-medium"></span>
    </div>

    <!-- Hunt Progress Overlay -->
    <div id="hunt-overlay" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center" style="display:none">
        <div class="glass-gold rounded-3xl p-6 max-w-sm w-full mx-4 text-center">
            <div class="text-4xl mb-3">🎯</div>
            <h3 class="font-display font-black text-gold text-lg mb-2" id="hunt-title">HUNTING...</h3>
            <p class="text-xs text-white/60 mb-4" id="hunt-step">Initializing Scout Agent...</p>
            <div class="w-full bg-white/5 rounded-full h-2 mb-3 overflow-hidden">
                <div id="hunt-progress" class="h-full rounded-full bg-gradient-to-r from-neon to-gold transition-all duration-500" style="width:0%"></div>
            </div>
            <p class="text-[10px] font-mono text-white/30" id="hunt-detail">0 / 0 leads scored</p>
        </div>
    </div>

    <!-- Header -->
    <header class="glass sticky top-0 z-40 px-4 py-3">
        <div class="flex items-center justify-between max-w-4xl mx-auto">
            <div class="flex items-center gap-2">
                <a href="/" class="text-xl">👹</a>
                <span class="font-display font-black text-gold text-sm tracking-wider">PREDATOR</span>
                <span class="text-[9px] font-mono text-white/30 glass px-1.5 py-0.5 rounded">v3.0</span>
            </div>
            <div class="flex items-center gap-2">
                <div id="scout-indicator" class="flex items-center gap-1">
                    <div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div>
                    <span class="text-neon font-mono text-[10px]">ONLINE</span>
                </div>
            </div>
        </div>
    </header>

    <main class="px-4 py-4 max-w-4xl mx-auto">
        <!-- ===================== TAB: PREDATOR ===================== -->
        <div id="tab-predator" class="tab-content active">
            <div class="mb-4 slide-up"><h2 class="font-display font-black text-xl text-gold mb-0.5">COMMAND CENTER</h2><p class="text-[10px] text-white/40 font-mono">// Sovereign Predator Orchestrator v3.0 — Scout Agent LIVE</p></div>

            <!-- Scout Status Banner -->
            <div id="scout-banner" class="glass-gold rounded-2xl p-3 mb-4 slide-up flex items-center gap-3" style="animation-delay:.05s">
                <div class="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-lg">🎯</div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-0.5">
                        <span class="font-display font-bold text-xs text-neon">SCOUT AGENT</span>
                        <span id="scout-state-badge" class="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white/40">IDLE</span>
                    </div>
                    <p class="text-[10px] text-white/40 font-mono" id="scout-state-msg">Awaiting orders...</p>
                </div>
                <div class="text-right">
                    <div class="text-lg font-display font-black text-gold" id="scout-result-count">0</div>
                    <div class="text-[8px] font-mono text-white/30">HUNTED</div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-4 gap-2 mb-4 slide-up" style="animation-delay:.1s">
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-gold" id="s-leads">-</div><div class="text-[8px] text-white/40 font-mono">LEADS</div></div>
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-neon" id="s-sent">-</div><div class="text-[8px] text-white/40 font-mono">SENT</div></div>
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-purple-400" id="s-demos">-</div><div class="text-[8px] text-white/40 font-mono">DEMOS</div></div>
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-gold" id="s-conv">-</div><div class="text-[8px] text-white/40 font-mono">DEALS</div></div>
            </div>

            <!-- Liquidity Progress -->
            <div class="glass-gold rounded-2xl p-4 mb-4 slide-up" style="animation-delay:.15s">
                <div class="flex items-center justify-between mb-1.5"><span class="font-display font-bold text-xs text-gold">LIQUIDITY PROGRESS</span><span class="text-[10px] font-mono text-white/40" id="prog-pct">0%</span></div>
                <div class="w-full bg-white/5 rounded-full h-3 mb-1 overflow-hidden"><div id="prog-bar" class="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-neon transition-all duration-1000" style="width:0%"></div></div>
                <div class="flex justify-between text-[9px] font-mono text-white/30"><span>Rp 0</span><span id="prog-rev" class="text-gold font-bold">Rp -</span><span>Rp 7.5M</span></div>
            </div>

            <!-- Mission Config -->
            <div class="glass rounded-2xl p-4 mb-4 slide-up" style="animation-delay:.2s">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-bullseye text-gold mr-2"></i>MISSION CONFIG</h3>
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">TARGET AREA</label>
                        <select id="cfg-area" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold focus:outline-none">
                            <option value="Jakarta Selatan">Jakarta Selatan</option><option value="Jakarta Pusat">Jakarta Pusat</option><option value="Jakarta Barat">Jakarta Barat</option><option value="Jakarta Utara">Jakarta Utara</option><option value="Jakarta Timur">Jakarta Timur</option><option value="Bandung">Bandung</option><option value="Surabaya">Surabaya</option><option value="Yogyakarta">Yogyakarta</option><option value="Bali Denpasar">Bali</option><option value="Medan">Medan</option><option value="Semarang">Semarang</option><option value="Makassar">Makassar</option>
                        </select>
                    </div>
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">CATEGORY</label>
                        <select id="cfg-cat" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold focus:outline-none">
                            <option value="barber shop">Barber Shop</option><option value="cafe restaurant">Cafe & Restaurant</option><option value="salon kecantikan">Salon & Beauty</option><option value="bengkel mobil motor">Workshop/Bengkel</option><option value="laundry">Laundry</option><option value="toko bangunan">Toko Bangunan</option><option value="pet shop grooming">Pet Shop</option><option value="gym fitness">Gym & Fitness</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">MIN AI SCORE</label><input type="range" id="cfg-score" min="0" max="100" value="50" class="w-full accent-gold"><div class="text-center text-[10px] font-mono text-gold" id="cfg-score-val">50</div></div>
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">MAX LEADS</label><input type="number" id="cfg-limit" value="5" min="1" max="20" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold focus:outline-none text-center"></div>
                </div>
            </div>

            <!-- Crew Status -->
            <div class="glass rounded-2xl p-4 mb-4 slide-up" style="animation-delay:.25s">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-users text-gold mr-2"></i>CREW STATUS</h3>
                <div class="space-y-2" id="crew-list">
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5" id="crew-scout-row"><div class="flex items-center gap-2"><i class="fas fa-crosshairs text-gold text-sm"></i><span class="text-xs">Scout (Hunter)</span></div><div class="flex items-center gap-1.5" id="crew-scout"><div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span></div></div>
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fas fa-user-secret text-blue-400 text-sm"></i><span class="text-xs">Closer (WA)</span></div><div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-white/20 rounded-full"></div><span class="text-[10px] font-mono text-white/40">PHASE 4</span></div></div>
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fas fa-code text-purple-400 text-sm"></i><span class="text-xs">Architect (Builder)</span></div><div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-white/20 rounded-full"></div><span class="text-[10px] font-mono text-white/40">PHASE 5</span></div></div>
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fas fa-coins text-gold text-sm"></i><span class="text-xs">Harvester ($$)</span></div><div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-white/20 rounded-full"></div><span class="text-[10px] font-mono text-white/40">PHASE 6</span></div></div>
                </div>
            </div>

            <!-- Hunting Button -->
            <button id="btn-hunt" class="w-full bg-neon/10 border-2 border-neon text-neon py-4 rounded-2xl font-display font-black text-lg animate-pulse-glow hover:bg-neon/20 transition-all flex items-center justify-center gap-3 slide-up" style="animation-delay:.3s">
                <i class="fas fa-crosshairs"></i>START HUNTING<i class="fas fa-bolt"></i>
            </button>
            <p class="text-center text-[9px] font-mono text-white/20 mt-1">Real SerpAPI + Groq AI Scoring — Live Results</p>

            <!-- Activity Log -->
            <div class="glass rounded-2xl p-4 mt-4 slide-up" style="animation-delay:.35s">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-stream text-gold mr-2"></i>RECENT ACTIVITY</h3>
                <div id="activity-log" class="space-y-1.5 max-h-40 overflow-y-auto"></div>
            </div>
        </div>

        <!-- ===================== TAB: LEADS ===================== -->
        <div id="tab-leads" class="tab-content">
            <div class="mb-4"><h2 class="font-display font-black text-xl text-gold mb-0.5">THE HUNTER'S EYE</h2><p class="text-[10px] text-white/40 font-mono">// Lead discovery & management — Scout Agent powered</p></div>

            <!-- Source Toggle -->
            <div class="flex gap-2 mb-3">
                <button onclick="setLeadSource('all')" id="src-all" class="flex-1 glass-gold py-2 rounded-xl text-[10px] font-display font-bold text-gold text-center">ALL LEADS</button>
                <button onclick="setLeadSource('scout')" id="src-scout" class="flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/40 text-center">🎯 SCOUT ONLY</button>
            </div>

            <!-- Filters -->
            <div class="glass rounded-xl p-2.5 mb-3 flex gap-2">
                <input type="text" id="lead-search" placeholder="Search business..." class="flex-1 bg-transparent text-xs text-white placeholder-white/30 focus:outline-none px-2">
                <select id="lead-filter-cat" class="bg-transparent border border-white/10 rounded-lg px-2 text-[10px] text-white/60 focus:outline-none">
                    <option value="">All</option><option value="barber">Barber</option><option value="cafe">Cafe</option><option value="salon">Salon</option><option value="workshop">Workshop</option>
                </select>
                <select id="lead-filter-status" class="bg-transparent border border-white/10 rounded-lg px-2 text-[10px] text-white/60 focus:outline-none">
                    <option value="">All Status</option><option value="new">New</option><option value="contacted">Contacted</option><option value="interested">Interested</option><option value="converted">Converted</option>
                </select>
            </div>
            <div class="flex items-center justify-between mb-3">
                <span class="text-[10px] font-mono text-white/30" id="lead-count">Loading...</span>
                <button onclick="loadLeads()" class="glass-gold px-2.5 py-1 rounded-lg text-[10px] font-mono text-gold"><i class="fas fa-sync-alt mr-1"></i>Refresh</button>
            </div>
            <div id="leads-container" class="space-y-3"></div>
        </div>

        <!-- ===================== TAB: BUILDER ===================== -->
        <div id="tab-builder" class="tab-content">
            <div class="mb-4"><h2 class="font-display font-black text-xl text-purple-400 mb-0.5">GHOST WEB BUILDER</h2><p class="text-[10px] text-white/40 font-mono">// Instant website generator & deployer</p></div>
            <div class="glass rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-palette text-purple-400 mr-2"></i>SELECT TEMPLATE</h3>
                <div class="grid grid-cols-5 gap-2" id="tpl-grid">
                    <button onclick="selectTemplate('barber')" class="tpl-btn glass-gold rounded-xl p-2.5 text-center transition-all" data-tpl="barber"><div class="text-xl mb-0.5">💈</div><div class="text-[9px] font-mono text-white/50">Barber</div></button>
                    <button onclick="selectTemplate('cafe')" class="tpl-btn glass rounded-xl p-2.5 text-center transition-all" data-tpl="cafe"><div class="text-xl mb-0.5">☕</div><div class="text-[9px] font-mono text-white/50">Cafe</div></button>
                    <button onclick="selectTemplate('salon')" class="tpl-btn glass rounded-xl p-2.5 text-center transition-all" data-tpl="salon"><div class="text-xl mb-0.5">💅</div><div class="text-[9px] font-mono text-white/50">Salon</div></button>
                    <button onclick="selectTemplate('workshop')" class="tpl-btn glass rounded-xl p-2.5 text-center transition-all" data-tpl="workshop"><div class="text-xl mb-0.5">🔧</div><div class="text-[9px] font-mono text-white/50">Workshop</div></button>
                    <button onclick="selectTemplate('generic')" class="tpl-btn glass rounded-xl p-2.5 text-center transition-all" data-tpl="generic"><div class="text-xl mb-0.5">🏪</div><div class="text-[9px] font-mono text-white/50">Generic</div></button>
                </div>
            </div>
            <div class="glass rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-edit text-purple-400 mr-2"></i>BUSINESS INFO</h3>
                <div class="space-y-2">
                    <input type="text" id="bld-name" placeholder="Business name..." class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none bg-white/5">
                    <input type="text" id="bld-phone" placeholder="Phone (08xxx)" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none bg-white/5">
                    <input type="text" id="bld-addr" placeholder="Address..." class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none bg-white/5">
                    <button id="btn-generate" class="w-full bg-purple-500/10 border border-purple-400 text-purple-400 py-2.5 rounded-xl font-display font-bold text-sm hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2">
                        <i class="fas fa-magic"></i>GENERATE & DEPLOY
                    </button>
                </div>
            </div>
            <div class="glass rounded-2xl p-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-rocket text-purple-400 mr-2"></i>DEPLOYED DEMOS</h3>
                <div id="demos-list" class="space-y-2"></div>
            </div>
        </div>

        <!-- ===================== TAB: TREASURY ===================== -->
        <div id="tab-treasury" class="tab-content">
            <div class="mb-4"><h2 class="font-display font-black text-xl text-gold mb-0.5">THE HARVESTER</h2><p class="text-[10px] text-white/40 font-mono">// Revenue tracking & profit management</p></div>
            <div class="glass-gold rounded-2xl p-5 mb-4 text-center">
                <p class="text-[9px] font-mono text-gold mb-1">TOTAL REVENUE</p>
                <div class="font-display font-black text-3xl text-white" id="t-revenue">Rp -</div>
                <p class="text-[10px] font-mono text-white/30" id="t-revenue-usd">$-</p>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="glass rounded-2xl p-4">
                    <p class="text-[9px] font-mono text-white/40 mb-2">PROGRESS TO $500</p>
                    <div class="flex justify-center"><canvas id="progressChart" width="140" height="140"></canvas></div>
                </div>
                <div class="glass rounded-2xl p-4">
                    <p class="text-[9px] font-mono text-white/40 mb-2">PROFIT SPLIT</p>
                    <div class="flex justify-center"><canvas id="splitChart" width="140" height="140"></canvas></div>
                </div>
            </div>
            <div class="glass rounded-2xl p-4 mb-4">
                <p class="text-[9px] font-mono text-white/40 mb-2">DAILY REVENUE (7 DAYS)</p>
                <canvas id="dailyChart" height="150"></canvas>
            </div>
            <div class="glass rounded-2xl p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-display font-bold text-xs text-white"><i class="fas fa-receipt text-gold mr-2"></i>TRANSACTIONS</h3>
                    <button onclick="exportCSV()" class="glass-gold px-2.5 py-1 rounded-lg text-[9px] font-mono text-gold"><i class="fas fa-download mr-1"></i>CSV</button>
                </div>
                <div id="txn-list" class="space-y-2"></div>
            </div>
        </div>
    </main>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
        <div class="max-w-4xl mx-auto flex items-center justify-around py-2">
            <button onclick="switchTab('predator')" class="tab-btn flex flex-col items-center gap-0.5 px-4 py-1 text-gold" data-tab="predator"><i class="fas fa-crosshairs text-lg"></i><span class="text-[8px] font-display font-bold">PREDATOR</span></button>
            <button onclick="switchTab('leads')" class="tab-btn flex flex-col items-center gap-0.5 px-4 py-1 text-white/40" data-tab="leads"><i class="fas fa-search text-lg"></i><span class="text-[8px] font-display font-bold">LEADS</span></button>
            <button onclick="switchTab('builder')" class="tab-btn flex flex-col items-center gap-0.5 px-4 py-1 text-white/40" data-tab="builder"><i class="fas fa-code text-lg"></i><span class="text-[8px] font-display font-bold">BUILDER</span></button>
            <button onclick="switchTab('treasury')" class="tab-btn flex flex-col items-center gap-0.5 px-4 py-1 text-white/40" data-tab="treasury"><i class="fas fa-coins text-lg"></i><span class="text-[8px] font-display font-bold">TREASURY</span></button>
        </div>
    </nav>

    <script>
    // ===================== GLOBAL STATE =====================
    let allLeads=[], allDemos=[], allTxns=[], stats={}, treasuryData={};
    let selectedTemplate='barber';
    let leadSource='all'; // 'all' or 'scout'
    let progressChart, splitChart, dailyChart;
    let isHunting=false;
    let huntPollInterval=null;

    // ===================== TAB SWITCHING =====================
    function switchTab(t){
        document.querySelectorAll('.tab-content').forEach(e=>e.classList.remove('active'));
        document.getElementById('tab-'+t).classList.add('active');
        document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.toggle('text-gold',b.dataset.tab===t);b.classList.toggle('text-white/40',b.dataset.tab!==t)});
        history.replaceState(null,null,'#'+t);
        if(t==='leads')loadLeads();
        if(t==='treasury')loadTreasury();
        if(t==='builder')loadDemos();
    }

    // ===================== TOAST =====================
    function showToast(msg,type='success'){
        const t=document.getElementById('toast'),ic=document.getElementById('toast-icon'),m=document.getElementById('toast-msg');
        m.textContent=msg;
        ic.className=type==='success'?'fas fa-check-circle text-neon':type==='error'?'fas fa-times-circle text-predator':'fas fa-info-circle text-gold';
        t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);
    }

    // ===================== SCORE / STATUS HELPERS =====================
    function scoreColor(s){return s>=80?'text-neon':s>=50?'text-gold':'text-predator'}
    function scoreBg(s){return s>=80?'bg-neon/20 text-neon':s>=50?'bg-gold/20 text-gold':'bg-predator/20 text-predator'}
    function statusBadge(st){const m={new:'bg-white/10 text-white/60',contacted:'bg-blue-500/20 text-blue-400',interested:'bg-gold/20 text-gold',converted:'bg-neon/20 text-neon',rejected:'bg-predator/20 text-predator'};return m[st]||m.new}
    function catEmoji(c){return{barber:'💈','barber shop':'💈',cafe:'☕','cafe restaurant':'☕',salon:'💅','salon kecantikan':'💅',workshop:'🔧','bengkel mobil motor':'🔧',laundry:'🧺','toko bangunan':'🏗️','pet shop grooming':'🐾','gym fitness':'💪',generic:'🏪'}[c]||'🏪'}

    // ===================== LEAD SOURCE TOGGLE =====================
    function setLeadSource(src){
        leadSource=src;
        document.getElementById('src-all').className=src==='all'?'flex-1 glass-gold py-2 rounded-xl text-[10px] font-display font-bold text-gold text-center':'flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/40 text-center';
        document.getElementById('src-scout').className=src==='scout'?'flex-1 scout-badge py-2 rounded-xl text-[10px] font-display font-bold text-neon text-center':'flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/40 text-center';
        loadLeads();
    }

    // ===================== LOAD STATS =====================
    async function loadStats(){
        try{
            const r=await fetch('/api/stats');stats=await r.json();
            document.getElementById('s-leads').textContent=stats.leads;
            document.getElementById('s-sent').textContent=stats.messages_sent;
            document.getElementById('s-demos').textContent=stats.demos_deployed;
            document.getElementById('s-conv').textContent=stats.conversions;
            document.getElementById('prog-pct').textContent=stats.progress_percent+'%';
            document.getElementById('prog-bar').style.width=Math.max(stats.progress_percent,2)+'%';
            document.getElementById('prog-rev').textContent=stats.revenue_formatted;
        }catch(e){console.error('Stats error:',e)}
    }

    // ===================== SCOUT STATUS =====================
    async function pollScoutStatus(){
        try{
            const r=await fetch('/api/scout/status');const s=await r.json();
            const badge=document.getElementById('scout-state-badge');
            const msg=document.getElementById('scout-state-msg');
            const count=document.getElementById('scout-result-count');
            const stateColors={idle:'bg-white/10 text-white/40',hunting:'bg-gold/20 text-gold',scoring:'bg-neon/20 text-neon',complete:'bg-neon/20 text-neon',error:'bg-predator/20 text-predator'};
            badge.className='text-[8px] font-mono px-1.5 py-0.5 rounded '+(stateColors[s.state]||stateColors.idle);
            badge.textContent=s.state.toUpperCase();
            msg.textContent=s.current_step;
            count.textContent=s.cached_results||0;

            // Update crew scout row
            const crewScout=document.getElementById('crew-scout');
            if(s.state==='hunting'||s.state==='scoring'){
                crewScout.innerHTML='<div class="w-2 h-2 bg-gold rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-gold font-bold">HUNTING</span>';
            } else if(s.state==='complete'){
                crewScout.innerHTML='<div class="w-2 h-2 bg-neon rounded-full"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span>';
            } else {
                crewScout.innerHTML='<div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span>';
            }

            // Update header indicator
            const ind=document.getElementById('scout-indicator');
            if(s.state==='hunting'||s.state==='scoring'){
                ind.innerHTML='<div class="w-2 h-2 bg-gold rounded-full animate-pulse"></div><span class="text-gold font-mono text-[10px]">HUNTING</span>';
            } else {
                ind.innerHTML='<div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-neon font-mono text-[10px]">ONLINE</span>';
            }

            return s;
        }catch(e){console.error('Scout status error:',e);return null}
    }

    // ===================== LIVE HUNT =====================
    async function startLiveHunt(){
        if(isHunting)return;
        isHunting=true;

        const area=document.getElementById('cfg-area').value;
        const cat=document.getElementById('cfg-cat').value;
        const limit=parseInt(document.getElementById('cfg-limit').value)||5;

        const btn=document.getElementById('btn-hunt');
        btn.disabled=true;
        btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> HUNTING...';
        btn.classList.remove('animate-pulse-glow');
        btn.classList.add('hunt-active');

        // Show overlay
        const overlay=document.getElementById('hunt-overlay');
        overlay.style.display='flex';
        document.getElementById('hunt-title').textContent='HUNTING: '+cat;
        document.getElementById('hunt-step').textContent='Connecting to Google Maps via SerpAPI...';
        document.getElementById('hunt-progress').style.width='5%';
        document.getElementById('hunt-detail').textContent='Area: '+area+' | Limit: '+limit;

        // Start polling status
        let pollCount=0;
        huntPollInterval=setInterval(async()=>{
            pollCount++;
            const s=await pollScoutStatus();
            if(s){
                const pct=s.total>0?Math.round((s.progress/s.total)*100):Math.min(pollCount*5,30);
                document.getElementById('hunt-step').textContent=s.current_step;
                document.getElementById('hunt-progress').style.width=Math.max(pct,5)+'%';
                document.getElementById('hunt-detail').textContent=s.progress+' / '+s.total+' leads scored';

                if(s.state==='hunting'){
                    document.getElementById('hunt-title').textContent='🔍 SCANNING...';
                } else if(s.state==='scoring'){
                    document.getElementById('hunt-title').textContent='🧠 AI SCORING...';
                }
            }
        },1500);

        try{
            const url='/api/scout/search?area='+encodeURIComponent(area)+'&category='+encodeURIComponent(cat)+'&limit='+limit;
            const r=await fetch(url);
            const data=await r.json();

            clearInterval(huntPollInterval);

            if(data.success){
                document.getElementById('hunt-title').textContent='✅ HUNT COMPLETE!';
                document.getElementById('hunt-step').textContent='Found '+data.total+' leads ('+data.new_leads+' new)';
                document.getElementById('hunt-progress').style.width='100%';

                const topScore=data.results&&data.results[0]?data.results[0].ai_score:0;
                document.getElementById('hunt-detail').textContent='Top AI Score: '+topScore+' | Area: '+area;

                showToast(data.total+' leads found! '+data.new_leads+' new. Top score: '+topScore,'success');

                // Refresh stats
                await loadStats();
                await pollScoutStatus();

                // Auto-close overlay after 2s
                setTimeout(()=>{
                    overlay.style.display='none';
                    // Switch to leads tab to show results
                    switchTab('leads');
                    setLeadSource('scout');
                },2000);
            } else {
                document.getElementById('hunt-title').textContent='❌ HUNT FAILED';
                document.getElementById('hunt-step').textContent=data.error||data.message||'Unknown error';
                document.getElementById('hunt-progress').style.width='0%';
                showToast('Hunt failed: '+(data.error||data.message),'error');
                setTimeout(()=>{overlay.style.display='none'},3000);
            }
        }catch(e){
            clearInterval(huntPollInterval);
            document.getElementById('hunt-title').textContent='❌ ERROR';
            document.getElementById('hunt-step').textContent=e.message;
            showToast('Hunt error: '+e.message,'error');
            setTimeout(()=>{overlay.style.display='none'},3000);
        }

        btn.disabled=false;
        btn.innerHTML='<i class="fas fa-crosshairs"></i> START HUNTING <i class="fas fa-bolt"></i>';
        btn.classList.add('animate-pulse-glow');
        btn.classList.remove('hunt-active');
        isHunting=false;
    }

    // ===================== LOAD LEADS =====================
    async function loadLeads(){
        try{
            const search=document.getElementById('lead-search')?.value||'';
            const cat=document.getElementById('lead-filter-cat')?.value||'';
            const st=document.getElementById('lead-filter-status')?.value||'';
            let url='/api/leads?';
            if(leadSource==='scout')url+='source=scout&';
            if(search)url+='search='+encodeURIComponent(search)+'&';
            if(cat)url+='category='+cat+'&';
            if(st)url+='status='+st+'&';
            const r=await fetch(url);const d=await r.json();allLeads=d.data;
            const countEl=document.getElementById('lead-count');
            countEl.textContent=d.total+' leads found'+(d.scout_count>0?' ('+d.scout_count+' from scout)':'');
            const container=document.getElementById('leads-container');
            if(!d.data.length){
                container.innerHTML='<div class="glass rounded-2xl p-8 text-center"><div class="text-4xl mb-3 opacity-30">'+(leadSource==='scout'?'🎯':'🔍')+'</div><h3 class="font-display font-bold text-white/50 text-sm mb-1">'+(leadSource==='scout'?'No scout results yet':'No leads match')+'</h3><p class="text-[11px] text-white/30">'+(leadSource==='scout'?'Hit START HUNTING on the Predator tab to find leads!':'Try different filters')+'</p></div>';
                return;
            }
            container.innerHTML=d.data.map(l=>{
                const isScout=l.source==='scout_agent';
                return '<div class="lead-card glass rounded-2xl p-4 cursor-pointer hover:border-gold/30 transition-all '+(isScout?'border-neon/20':'')+'">'+
                '<div class="flex items-start justify-between mb-2">'+
                    '<div class="flex items-center gap-2"><span class="text-lg">'+catEmoji(l.category)+'</span><div><div class="font-display font-bold text-sm text-white leading-tight">'+l.business_name+'</div><div class="text-[10px] text-white/40">'+(l.address||'').substring(0,45)+'...</div></div></div>'+
                    '<div class="flex flex-col items-end gap-1"><span class="'+scoreBg(l.ai_score)+' px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">'+l.ai_score+'</span>'+(isScout?'<span class="scout-badge px-1.5 py-0.5 rounded text-[7px] font-mono text-neon">SCOUT</span>':'')+'<span class="'+statusBadge(l.status)+' px-1.5 py-0.5 rounded text-[8px] font-mono uppercase">'+l.status+'</span></div>'+
                '</div>'+
                '<div class="flex items-center gap-3 mb-2 text-[10px] text-white/40">'+
                    '<span>'+(l.rating?'⭐ '+l.rating:'⭐ N/A')+'</span><span>📝 '+(l.review_count||0)+' reviews</span><span class="'+(l.website_url?'text-neon':'text-predator')+'">'+(l.website_url?'🌐 Has Web':'❌ No Web')+'</span>'+
                '</div>'+
                (l.digital_gap_analysis?'<div class="flex items-center gap-3 text-[9px] font-mono text-white/30 mb-2">'+
                    '<span>'+(l.digital_gap_analysis.has_website?'✅':'❌')+' Website</span>'+
                    '<span>'+(l.digital_gap_analysis.has_booking?'✅':'❌')+' Booking</span>'+
                    '<span>'+(l.digital_gap_analysis.social_active?'✅':'❌')+' Social</span>'+
                '</div>':'')+
                (l.digital_gap_analysis&&l.digital_gap_analysis.summary?'<div class="text-[10px] text-white/30 mb-3 italic">💡 '+l.digital_gap_analysis.summary+'</div>':'')+
                (l.recommended_approach?'<div class="text-[10px] text-gold/60 mb-3">🎯 '+l.recommended_approach+'</div>':'')+
                '<div class="flex gap-2">'+
                    '<button onclick="event.stopPropagation();deployDemo(\\''+l.id+'\\',\\''+l.business_name.replace(/'/g,"")+'\\',\\''+l.category+'\\')" class="flex-1 glass-gold py-2 rounded-xl text-[10px] font-display font-bold text-gold hover:bg-gold/10 transition-all flex items-center justify-center gap-1"><i class="fas fa-rocket"></i>Deploy Demo</button>'+
                    (l.phone&&l.phone!=='+62-unknown'?'<button onclick="event.stopPropagation();sendWA(\\''+l.phone+'\\',\\''+l.business_name.replace(/'/g,"")+'\\','+(l.rating||0)+')" class="flex-1 bg-neon/10 border border-neon py-2 rounded-xl text-[10px] font-display font-bold text-neon hover:bg-neon/20 transition-all flex items-center justify-center gap-1"><i class="fab fa-whatsapp"></i>Send WA</button>':'<button class="flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/30 flex items-center justify-center gap-1" disabled><i class="fab fa-whatsapp"></i>No Phone</button>')+
                '</div>'+
            '</div>'}).join('');
        }catch(e){console.error('Leads error:',e)}
    }

    function sendWA(phone,name,rating){
        const msg='Halo Kak! Saya lihat '+name+' punya rating '+rating+' di Google Maps. Mau saya buatkan website + booking system GRATIS? Demo siap dalam 60 detik! Tertarik?';
        const clean=phone.replace(/[^0-9]/g,'');
        const link='https://wa.me/'+clean+'?text='+encodeURIComponent(msg);
        window.open(link,'_blank');
        showToast('WA deeplink opened for '+name);
    }

    function deployDemo(id,name,cat){
        showToast('Generating demo for '+name+'... (Phase 5)','info');
    }

    // ===================== LOAD DEMOS =====================
    async function loadDemos(){
        try{
            const r=await fetch('/api/demos');const d=await r.json();allDemos=d.data;
            const c=document.getElementById('demos-list');
            if(!d.data.length){c.innerHTML='<div class="text-center py-4"><div class="text-3xl mb-2 opacity-30">🏗️</div><p class="text-[11px] text-white/30">No demos deployed yet</p></div>';return}
            c.innerHTML=d.data.map(dm=>'<div class="glass rounded-xl p-3 flex items-center justify-between">'+
                '<div class="flex items-center gap-2"><span class="text-lg">'+catEmoji(dm.template_type)+'</span><div><div class="text-xs font-bold">'+dm.business_name+'</div><div class="text-[9px] text-white/30 font-mono">'+dm.template_type+' | 👁 '+dm.views_count+' views</div></div></div>'+
                '<div class="flex items-center gap-2"><span class="text-[9px] font-mono '+(dm.status==='active'?'text-neon':'text-gold')+'">'+dm.status.toUpperCase()+'</span></div>'+
            '</div>').join('');
        }catch(e){console.error('Demos error:',e)}
    }

    // ===================== TEMPLATE SELECT =====================
    function selectTemplate(t){
        selectedTemplate=t;
        document.querySelectorAll('.tpl-btn').forEach(b=>{b.classList.toggle('glass-gold',b.dataset.tpl===t);b.classList.toggle('glass',b.dataset.tpl!==t)});
    }

    // ===================== LOAD TREASURY =====================
    async function loadTreasury(){
        try{
            const r=await fetch('/api/treasury/stats');treasuryData=await r.json();
            document.getElementById('t-revenue').textContent='Rp '+treasuryData.total_revenue_idr.toLocaleString('id-ID');
            document.getElementById('t-revenue-usd').textContent='$'+treasuryData.total_revenue_usd;

            if(progressChart)progressChart.destroy();
            const pc=document.getElementById('progressChart');
            if(pc){progressChart=new Chart(pc,{type:'doughnut',data:{labels:['Collected','Remaining'],datasets:[{data:[treasuryData.progress_percent,100-treasuryData.progress_percent],backgroundColor:['#FFD700','rgba(255,255,255,0.05)'],borderWidth:0,cutout:'75%'}]},options:{responsive:false,plugins:{legend:{display:false},tooltip:{enabled:false}}},plugins:[{id:'ct',afterDraw:function(ch){const x=ch.ctx;x.save();x.textAlign='center';x.textBaseline='middle';const cx=ch.width/2,cy=ch.height/2;x.font='bold 22px Montserrat';x.fillStyle='#FFD700';x.fillText(treasuryData.progress_percent+'%',cx,cy-4);x.font='9px monospace';x.fillStyle='rgba(255,255,255,0.3)';x.fillText('of $500',cx,cy+14);x.restore()}}]})}

            if(splitChart)splitChart.destroy();
            const sc=document.getElementById('splitChart');
            const sp=treasuryData.profit_split;
            if(sc){splitChart=new Chart(sc,{type:'doughnut',data:{labels:['Op 30%','Growth 20%','Liquidity 30%','Staking 20%'],datasets:[{data:[sp.operational,sp.growth,sp.liquidity,sp.staking],backgroundColor:['#3B82F6','#00FF00','#FFD700','#A855F7'],borderWidth:0,cutout:'60%'}]},options:{responsive:false,plugins:{legend:{display:false},tooltip:{enabled:true}}}})}

            if(dailyChart)dailyChart.destroy();
            const dc=document.getElementById('dailyChart');
            if(dc){const dd=treasuryData.daily_revenue||[];dailyChart=new Chart(dc,{type:'bar',data:{labels:dd.map(d=>d.date.slice(5)),datasets:[{data:dd.map(d=>d.amount),backgroundColor:dd.map(d=>d.amount>0?'rgba(255,215,0,0.6)':'rgba(255,255,255,0.05)'),borderRadius:6,borderSkipped:false}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{ticks:{color:'rgba(255,255,255,0.3)',font:{size:9}},grid:{display:false}},y:{ticks:{color:'rgba(255,255,255,0.2)',font:{size:9},callback:v=>'Rp'+Math.round(v/1000)+'k'},grid:{color:'rgba(255,255,255,0.03)'}}}}})}

            const td=await(await fetch('/api/transactions')).json();
            const tl=document.getElementById('txn-list');
            if(!td.data||!td.data.length){tl.innerHTML='<div class="text-center py-3"><div class="text-2xl mb-1 opacity-30">💰</div><p class="text-[10px] text-white/30">No transactions yet</p></div>';return}
            tl.innerHTML=td.data.map(tx=>'<div class="glass rounded-xl p-3 flex items-center justify-between">'+
                '<div><div class="text-xs font-bold">'+tx.description+'</div><div class="text-[9px] text-white/30 font-mono">'+tx.invoice_number+' | '+new Date(tx.created_at).toLocaleDateString('id-ID')+'</div></div>'+
                '<div class="text-right"><div class="text-sm font-display font-bold '+(tx.payment_status==='paid'?'text-neon':'text-gold')+'">Rp '+tx.amount_idr.toLocaleString('id-ID')+'</div><div class="text-[8px] font-mono '+(tx.payment_status==='paid'?'text-neon':'text-gold')+'">'+tx.payment_status.toUpperCase()+'</div></div>'+
            '</div>').join('');
        }catch(e){console.error('Treasury error:',e)}
    }

    function exportCSV(){showToast('CSV export coming in Phase 6','info')}

    // ===================== HUNT BUTTON =====================
    document.getElementById('btn-hunt')?.addEventListener('click', startLiveHunt);

    // ===================== GENERATE BUTTON =====================
    document.getElementById('btn-generate')?.addEventListener('click',()=>{
        const name=document.getElementById('bld-name').value;
        if(!name){showToast('Enter business name first','error');return}
        showToast('Generating '+selectedTemplate+' website for '+name+'... (Phase 5)','info');
    });

    // ===================== FILTERS =====================
    document.getElementById('lead-search')?.addEventListener('input',()=>{clearTimeout(window._searchTimer);window._searchTimer=setTimeout(loadLeads,300)});
    document.getElementById('lead-filter-cat')?.addEventListener('change',()=>loadLeads());
    document.getElementById('lead-filter-status')?.addEventListener('change',()=>loadLeads());
    document.getElementById('cfg-score')?.addEventListener('input',function(){document.getElementById('cfg-score-val').textContent=this.value});

    // ===================== ACTIVITY LOG =====================
    async function loadActivity(){
        try{
            const r=await fetch('/api/agent-logs');const d=await r.json();
            const c=document.getElementById('activity-log');
            const icons={scout:'fa-crosshairs text-gold',profiler:'fa-user-secret text-blue-400',closer:'fa-pen-fancy text-neon',architect:'fa-code text-purple-400',harvester:'fa-coins text-gold',orchestrator:'fa-brain text-white'};
            c.innerHTML=d.data.slice(0,10).map(l=>'<div class="flex items-center gap-2 text-[10px]">'+
                '<i class="fas '+(icons[l.agent_type]||'fa-circle text-white/30')+' w-4 text-center"></i>'+
                '<span class="text-white/60 flex-1 truncate">'+l.agent_type+': '+l.action+'</span>'+
                '<span class="font-mono '+(l.status==='success'?'text-neon':'text-predator')+'">'+l.status.toUpperCase()+'</span>'+
            '</div>').join('');
        }catch(e){console.error(e)}
    }

    // ===================== INIT =====================
    (async()=>{
        const hash=window.location.hash.replace('#','');
        if(['predator','leads','builder','treasury'].includes(hash))switchTab(hash);
        await loadStats();
        await loadActivity();
        await pollScoutStatus();
        // Poll scout status every 10s
        setInterval(pollScoutStatus,10000);
    })();
    </script>
</body>
</html>`
