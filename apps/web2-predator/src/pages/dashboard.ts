export const dashboardHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>PREDATOR v5.0 | Sovereign Predator Suite</title>
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
      .glass-neon{background:rgba(0,255,0,0.05);backdrop-filter:blur(20px);border:1px solid rgba(0,255,0,0.2)}
      .glass-blue{background:rgba(59,130,246,0.05);backdrop-filter:blur(20px);border:1px solid rgba(59,130,246,0.2)}
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
      .chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:9999px;font-size:9px;font-family:monospace;cursor:pointer;transition:all .2s;border:1px solid transparent}
      .chip.active{border-color:rgba(255,215,0,0.5);background:rgba(255,215,0,0.1)}
      .chip:hover{background:rgba(255,255,255,0.05)}
      .wa-msg{background:rgba(37,211,102,0.05);border:1px solid rgba(37,211,102,0.2);border-radius:12px;padding:12px}
    </style>
</head>
<body class="grid-bg min-h-screen pb-20">
    <!-- Toast -->
    <div id="toast" class="toast glass-gold rounded-xl px-4 py-3 flex items-center gap-2 max-w-xs">
        <i id="toast-icon" class="fas fa-check-circle text-neon"></i>
        <span id="toast-msg" class="text-xs font-medium"></span>
    </div>

    <!-- Hunt Progress Overlay -->
    <div id="hunt-overlay" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center" style="display:none">
        <div class="glass-gold rounded-3xl p-6 max-w-sm w-full mx-4 text-center">
            <div class="text-4xl mb-3" id="hunt-emoji">🎯</div>
            <h3 class="font-display font-black text-gold text-lg mb-2" id="hunt-title">HUNTING...</h3>
            <p class="text-xs text-white/60 mb-4" id="hunt-step">Initializing...</p>
            <div class="w-full bg-white/5 rounded-full h-2 mb-3 overflow-hidden">
                <div id="hunt-progress" class="h-full rounded-full bg-gradient-to-r from-neon to-gold transition-all duration-500" style="width:0%"></div>
            </div>
            <p class="text-[10px] font-mono text-white/30" id="hunt-detail">0 / 0</p>
            <button id="hunt-close-btn" class="mt-3 glass px-4 py-2 rounded-xl text-[10px] font-mono text-white/40 hover:text-white transition-all" style="display:none" onclick="document.getElementById('hunt-overlay').style.display='none'">CLOSE</button>
        </div>
    </div>

    <!-- Header -->
    <header class="glass sticky top-0 z-40 px-4 py-3">
        <div class="flex items-center justify-between max-w-4xl mx-auto">
            <div class="flex items-center gap-2">
                <a href="/" class="text-xl">👹</a>
                <span class="font-display font-black text-gold text-sm tracking-wider">PREDATOR</span>
                <span class="text-[9px] font-mono text-neon glass px-1.5 py-0.5 rounded">v5.0</span>
            </div>
            <div class="flex items-center gap-2">
                <div id="db-count" class="text-[9px] font-mono text-gold/60 mr-1"></div>
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
            <div class="mb-4 slide-up"><h2 class="font-display font-black text-xl text-gold mb-0.5">COMMAND CENTER</h2><p class="text-[10px] text-white/40 font-mono">// Session 005 — Ghost Web Builder (Architect) LIVE</p></div>

            <!-- Scout Banner -->
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
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-gold" id="s-leads">-</div><div class="text-[8px] text-white/40 font-mono">DB LEADS</div></div>
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-neon" id="s-hot">-</div><div class="text-[8px] text-white/40 font-mono">HOT 80+</div></div>
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-blue-400" id="s-msgs">-</div><div class="text-[8px] text-white/40 font-mono">MESSAGES</div></div>
                <div class="glass rounded-xl p-2.5 text-center"><div class="text-lg font-display font-black text-gold" id="s-deals">-</div><div class="text-[8px] text-white/40 font-mono">DEALS</div></div>
            </div>

            <!-- Liquidity Progress -->
            <div class="glass-gold rounded-2xl p-4 mb-4 slide-up" style="animation-delay:.15s">
                <div class="flex items-center justify-between mb-1.5"><span class="font-display font-bold text-xs text-gold">LIQUIDITY PROGRESS</span><span class="text-[10px] font-mono text-white/40" id="prog-pct">0%</span></div>
                <div class="w-full bg-white/5 rounded-full h-3 mb-1 overflow-hidden"><div id="prog-bar" class="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-neon transition-all duration-1000" style="width:0%"></div></div>
                <div class="flex justify-between text-[9px] font-mono text-white/30"><span>Rp 0</span><span id="prog-rev" class="text-gold font-bold">Rp 0</span><span>Rp 7.5M</span></div>
            </div>

            <!-- Single Hunt Config -->
            <div class="glass rounded-2xl p-4 mb-4 slide-up" style="animation-delay:.2s">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-crosshairs text-gold mr-2"></i>SINGLE HUNT</h3>
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">AREA</label>
                        <select id="cfg-area" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold focus:outline-none">
                            <option value="Jakarta Selatan">Jakarta Selatan</option><option value="Jakarta Pusat">Jakarta Pusat</option><option value="Jakarta Barat">Jakarta Barat</option><option value="Bandung">Bandung</option><option value="Surabaya">Surabaya</option><option value="Yogyakarta">Yogyakarta</option><option value="Bali Denpasar">Bali</option><option value="Medan">Medan</option><option value="Semarang">Semarang</option><option value="Makassar">Makassar</option><option value="Malang">Malang</option><option value="Bekasi">Bekasi</option><option value="Tangerang">Tangerang</option><option value="Depok">Depok</option><option value="Bogor">Bogor</option>
                        </select>
                    </div>
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">CATEGORY</label>
                        <select id="cfg-cat" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold focus:outline-none">
                            <option value="barber shop">Barber Shop</option><option value="salon kecantikan">Salon</option><option value="cafe">Cafe</option><option value="restoran">Restaurant</option><option value="bengkel mobil">Bengkel</option><option value="klinik gigi">Klinik Gigi</option><option value="gym fitness">Gym</option><option value="laundry">Laundry</option><option value="toko bunga">Toko Bunga</option><option value="pet shop">Pet Shop</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3"><label class="text-[9px] font-mono text-white/40 block mb-1">MAX LEADS</label><input type="number" id="cfg-limit" value="5" min="1" max="20" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold focus:outline-none text-center"></div>
                <button id="btn-hunt" class="w-full bg-neon/10 border-2 border-neon text-neon py-3 rounded-2xl font-display font-black text-sm animate-pulse-glow hover:bg-neon/20 transition-all flex items-center justify-center gap-2">
                    <i class="fas fa-crosshairs"></i>HUNT<i class="fas fa-bolt"></i>
                </button>
                <p class="text-center text-[8px] font-mono text-white/20 mt-1">SerpAPI + Groq AI — Auto-save to Supabase</p>
            </div>

            <!-- BULK HUNT Config -->
            <div class="glass-neon rounded-2xl p-4 mb-4 slide-up" style="animation-delay:.25s">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-bomb text-neon mr-2"></i>BULK HUNT — Multi-City Blitz</h3>
                <div class="mb-3">
                    <label class="text-[9px] font-mono text-white/40 block mb-1">SELECT CITIES</label>
                    <div id="bulk-cities" class="flex flex-wrap gap-1.5"></div>
                </div>
                <div class="mb-3">
                    <label class="text-[9px] font-mono text-white/40 block mb-1">SELECT CATEGORIES</label>
                    <div id="bulk-cats" class="flex flex-wrap gap-1.5"></div>
                </div>
                <div class="mb-3"><label class="text-[9px] font-mono text-white/40 block mb-1">LEADS PER HUNT (max 5)</label><input type="number" id="bulk-limit" value="3" min="1" max="5" class="w-full border border-neon/20 rounded-xl px-3 py-2 text-xs focus:border-neon focus:outline-none text-center"></div>
                <div class="glass-gold rounded-xl p-2 mb-3 text-center">
                    <span class="text-[10px] font-mono text-gold" id="bulk-estimate">Select cities & categories to see estimate</span>
                </div>
                <button id="btn-bulk" class="w-full bg-neon/10 border-2 border-neon text-neon py-3 rounded-2xl font-display font-black text-sm hover:bg-neon/20 transition-all flex items-center justify-center gap-2">
                    <i class="fas fa-bomb"></i>LAUNCH BULK HUNT<i class="fas fa-fire"></i>
                </button>
                <p class="text-center text-[8px] font-mono text-white/20 mt-1">Auto-searches + AI-scores + saves to Supabase</p>
            </div>

            <!-- Crew Status -->
            <div class="glass rounded-2xl p-4 mb-4 slide-up" style="animation-delay:.3s">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-users text-gold mr-2"></i>CREW STATUS</h3>
                <div class="space-y-2" id="crew-list">
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fas fa-crosshairs text-gold text-sm"></i><span class="text-xs">Scout (Hunter)</span></div><div class="flex items-center gap-1.5" id="crew-scout"><div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span></div></div>
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fas fa-bomb text-neon text-sm"></i><span class="text-xs">Bulk Hunter</span></div><div class="flex items-center gap-1.5" id="crew-bulk"><div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span></div></div>
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fab fa-whatsapp text-green-400 text-sm"></i><span class="text-xs">Closer (WA)</span></div><div class="flex items-center gap-1.5" id="crew-closer"><div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span></div></div>
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fas fa-code text-purple-400 text-sm"></i><span class="text-xs">Architect (Builder)</span></div><div class="flex items-center gap-1.5" id="crew-architect"><div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span></div></div>
                    <div class="flex items-center justify-between glass rounded-xl px-3 py-2.5"><div class="flex items-center gap-2"><i class="fas fa-coins text-gold text-sm"></i><span class="text-xs">Harvester ($$)</span></div><div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-white/20 rounded-full"></div><span class="text-[10px] font-mono text-white/40">PHASE 6</span></div></div>
                </div>
            </div>

            <!-- Activity Log -->
            <div class="glass rounded-2xl p-4 slide-up" style="animation-delay:.35s">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-stream text-gold mr-2"></i>ACTIVITY LOG</h3>
                <div id="activity-log" class="space-y-1.5 max-h-48 overflow-y-auto"></div>
            </div>
        </div>

        <!-- ===================== TAB: LEADS ===================== -->
        <div id="tab-leads" class="tab-content">
            <div class="mb-4"><h2 class="font-display font-black text-xl text-gold mb-0.5">LEAD DATABASE</h2><p class="text-[10px] text-white/40 font-mono">// Supabase-powered — Real-time lead management</p></div>

            <!-- Source Toggle -->
            <div class="flex gap-2 mb-3">
                <button onclick="setLeadSource('db')" id="src-db" class="flex-1 glass-gold py-2 rounded-xl text-[10px] font-display font-bold text-gold text-center">DATABASE</button>
                <button onclick="setLeadSource('memory')" id="src-memory" class="flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/40 text-center">IN-MEMORY</button>
            </div>

            <!-- Filters -->
            <div class="glass rounded-xl p-2.5 mb-3 flex gap-2">
                <input type="text" id="lead-search" placeholder="Search..." class="flex-1 bg-transparent text-xs text-white placeholder-white/30 focus:outline-none px-2">
                <select id="lead-filter-cat" class="bg-transparent border border-white/10 rounded-lg px-2 text-[10px] text-white/60 focus:outline-none">
                    <option value="">All Cat</option><option value="barber shop">Barber</option><option value="cafe">Cafe</option><option value="salon kecantikan">Salon</option><option value="restoran">Restaurant</option><option value="bengkel mobil">Bengkel</option><option value="laundry">Laundry</option><option value="gym fitness">Gym</option><option value="pet shop">Pet</option>
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

        <!-- ===================== TAB: CLOSER ===================== -->
        <div id="tab-closer" class="tab-content">
            <div class="mb-4"><h2 class="font-display font-black text-xl text-green-400 mb-0.5">WA CLOSER AGENT</h2><p class="text-[10px] text-white/40 font-mono">// AI-powered WhatsApp outreach — Session 004</p></div>

            <!-- Batch Generate -->
            <div class="glass-neon rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fab fa-whatsapp text-green-400 mr-2"></i>BATCH GENERATE MESSAGES</h3>
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">MIN SCORE</label><input type="number" id="wa-min-score" value="60" min="0" max="100" class="w-full border border-green-400/20 rounded-xl px-3 py-2 text-xs focus:border-green-400 focus:outline-none text-center"></div>
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">MESSAGE TYPE</label>
                        <select id="wa-msg-type" class="w-full border border-green-400/20 rounded-xl px-3 py-2 text-xs focus:border-green-400 focus:outline-none">
                            <option value="initial">Initial Contact</option><option value="follow_up">Follow Up</option><option value="closing">Closing</option><option value="demo_offer">Demo Offer</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3"><label class="text-[9px] font-mono text-white/40 block mb-1">LIMIT</label><input type="number" id="wa-limit" value="10" min="1" max="50" class="w-full border border-green-400/20 rounded-xl px-3 py-2 text-xs focus:border-green-400 focus:outline-none text-center"></div>
                <button id="btn-batch-wa" class="w-full bg-green-500/10 border-2 border-green-400 text-green-400 py-3 rounded-2xl font-display font-black text-sm hover:bg-green-500/20 transition-all flex items-center justify-center gap-2">
                    <i class="fab fa-whatsapp"></i>GENERATE BATCH MESSAGES<i class="fas fa-bolt"></i>
                </button>
            </div>

            <!-- Generated Messages -->
            <div class="glass rounded-2xl p-4 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-display font-bold text-xs text-white"><i class="fas fa-envelope text-green-400 mr-2"></i>GENERATED MESSAGES</h3>
                    <span class="text-[9px] font-mono text-white/30" id="wa-msg-count">0 messages</span>
                </div>
                <div id="wa-messages-list" class="space-y-3 max-h-[60vh] overflow-y-auto"></div>
            </div>
        </div>

        <!-- ===================== TAB: BUILDER ===================== -->
        <div id="tab-builder" class="tab-content">
            <div class="mb-4"><h2 class="font-display font-black text-xl text-purple-400 mb-0.5">GHOST WEB BUILDER</h2><p class="text-[10px] text-white/40 font-mono">// Architect Agent — Generate UMKM landing pages in 60s</p></div>

            <!-- Template Picker -->
            <div class="glass rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-palette text-purple-400 mr-2"></i>SELECT TEMPLATE</h3>
                <div class="grid grid-cols-5 gap-2 mb-3" id="tpl-picker"></div>
                <div id="tpl-selected" class="text-center text-[10px] font-mono text-white/40">Select a template above</div>
            </div>

            <!-- Generate from Lead -->
            <div class="glass-blue rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-magic text-purple-400 mr-2"></i>GENERATE FROM LEAD</h3>
                <div class="mb-3">
                    <label class="text-[9px] font-mono text-white/40 block mb-1">SELECT LEAD (from DB)</label>
                    <select id="build-lead-select" class="w-full border border-purple-400/20 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none">
                        <option value="">Loading leads...</option>
                    </select>
                </div>
                <button id="btn-generate-lead" class="w-full bg-purple-500/10 border-2 border-purple-400 text-purple-400 py-3 rounded-2xl font-display font-black text-sm hover:bg-purple-500/20 transition-all flex items-center justify-center gap-2">
                    <i class="fas fa-bolt"></i>GENERATE WEBSITE<i class="fas fa-rocket"></i>
                </button>
                <p class="text-center text-[8px] font-mono text-white/20 mt-1">Auto-detects category → picks best template → generates in &lt;1s</p>
            </div>

            <!-- Generate Custom -->
            <div class="glass rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-pen-nib text-purple-400 mr-2"></i>CUSTOM BUILD</h3>
                <div class="grid grid-cols-2 gap-2 mb-2">
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">BUSINESS NAME</label><input type="text" id="custom-name" placeholder="e.g. Bosshead Barbershop" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none"></div>
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">PHONE</label><input type="text" id="custom-phone" placeholder="0812xxx" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none"></div>
                </div>
                <div class="mb-2"><label class="text-[9px] font-mono text-white/40 block mb-1">ADDRESS</label><input type="text" id="custom-address" placeholder="Jl. Raya No.123, Jakarta" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none"></div>
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">RATING</label><input type="number" id="custom-rating" value="4.5" min="1" max="5" step="0.1" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none text-center"></div>
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">REVIEWS</label><input type="number" id="custom-reviews" value="100" min="0" class="w-full border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-purple-400 focus:outline-none text-center"></div>
                </div>
                <button id="btn-generate-custom" class="w-full glass-gold py-2.5 rounded-2xl font-display font-bold text-xs text-gold flex items-center justify-center gap-2 hover:bg-gold/10 transition-all">
                    <i class="fas fa-wand-magic-sparkles"></i>BUILD CUSTOM SITE
                </button>
            </div>

            <!-- Batch Generate -->
            <div class="glass-neon rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-layer-group text-neon mr-2"></i>BATCH GENERATE</h3>
                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">MIN SCORE</label><input type="number" id="batch-build-score" value="60" min="0" max="100" class="w-full border border-neon/20 rounded-xl px-3 py-2 text-xs focus:border-neon focus:outline-none text-center"></div>
                    <div><label class="text-[9px] font-mono text-white/40 block mb-1">MAX LEADS</label><input type="number" id="batch-build-limit" value="5" min="1" max="20" class="w-full border border-neon/20 rounded-xl px-3 py-2 text-xs focus:border-neon focus:outline-none text-center"></div>
                </div>
                <button id="btn-batch-build" class="w-full bg-neon/10 border-2 border-neon text-neon py-3 rounded-2xl font-display font-black text-sm hover:bg-neon/20 transition-all flex items-center justify-center gap-2">
                    <i class="fas fa-layer-group"></i>BATCH BUILD ALL<i class="fas fa-bolt"></i>
                </button>
            </div>

            <!-- Demo Gallery -->
            <div class="glass rounded-2xl p-4">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="font-display font-bold text-xs text-white"><i class="fas fa-globe text-purple-400 mr-2"></i>GENERATED DEMOS</h3>
                    <span class="text-[9px] font-mono text-white/30" id="demo-count">0 demos</span>
                </div>
                <div id="demos-container" class="space-y-3"></div>
            </div>
        </div>

        <!-- ===================== TAB: TREASURY ===================== -->
        <div id="tab-treasury" class="tab-content">
            <div class="mb-4"><h2 class="font-display font-black text-xl text-gold mb-0.5">TREASURY</h2><p class="text-[10px] text-white/40 font-mono">// Revenue tracking — Target $500 / Rp 7.5M</p></div>
            <div class="glass-gold rounded-2xl p-5 mb-4 text-center">
                <p class="text-[9px] font-mono text-gold mb-1">TOTAL REVENUE</p>
                <div class="font-display font-black text-3xl text-white">Rp 0</div>
                <p class="text-[10px] font-mono text-white/30">$0</p>
            </div>
            <div class="glass rounded-2xl p-4 mb-4 text-center">
                <p class="text-[9px] font-mono text-white/40 mb-2">PROGRESS TO $500</p>
                <div class="flex justify-center"><canvas id="progressChart" width="140" height="140"></canvas></div>
            </div>
            <div class="glass rounded-2xl p-4 mb-4">
                <h3 class="font-display font-bold text-xs text-white mb-3"><i class="fas fa-chart-bar text-gold mr-2"></i>HUNT REPORT</h3>
                <div id="hunt-report" class="space-y-2"></div>
            </div>
        </div>
    </main>

    <!-- Bottom Nav -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
        <div class="max-w-4xl mx-auto flex items-center justify-around py-2">
            <button onclick="switchTab('predator')" class="tab-btn flex flex-col items-center gap-0.5 px-3 py-1 text-gold" data-tab="predator"><i class="fas fa-crosshairs text-lg"></i><span class="text-[8px] font-display font-bold">HUNT</span></button>
            <button onclick="switchTab('leads')" class="tab-btn flex flex-col items-center gap-0.5 px-3 py-1 text-white/40" data-tab="leads"><i class="fas fa-database text-lg"></i><span class="text-[8px] font-display font-bold">LEADS</span></button>
            <button onclick="switchTab('closer')" class="tab-btn flex flex-col items-center gap-0.5 px-3 py-1 text-white/40" data-tab="closer"><i class="fab fa-whatsapp text-lg"></i><span class="text-[8px] font-display font-bold">CLOSER</span></button>
            <button onclick="switchTab('builder')" class="tab-btn flex flex-col items-center gap-0.5 px-3 py-1 text-white/40" data-tab="builder"><i class="fas fa-code text-lg"></i><span class="text-[8px] font-display font-bold">BUILD</span></button>
            <button onclick="switchTab('treasury')" class="tab-btn flex flex-col items-center gap-0.5 px-3 py-1 text-white/40" data-tab="treasury"><i class="fas fa-coins text-lg"></i><span class="text-[8px] font-display font-bold">$$</span></button>
        </div>
    </nav>

    <script>
    // ===================== STATE =====================
    let stats={}, isHunting=false, isBulkHunting=false, huntPollInterval=null;
    let leadSource='db';
    let selectedBulkCities=new Set(['Jakarta Selatan','Bandung','Surabaya']);
    let selectedBulkCats=new Set(['barber shop','cafe','salon kecantikan']);
    let selectedTemplate=null;
    let builderLeads=[];

    const CITIES=['Jakarta Selatan','Jakarta Pusat','Jakarta Barat','Bandung','Surabaya','Yogyakarta','Semarang','Malang','Bali Denpasar','Medan','Makassar','Bekasi','Tangerang','Depok','Bogor'];
    const CATS=['barber shop','salon kecantikan','cafe','restoran','bengkel mobil','klinik gigi','gym fitness','laundry','toko bunga','pet shop'];
    const CAT_EMOJI={'barber shop':'💈','salon kecantikan':'💅','cafe':'☕','restoran':'🍽️','bengkel mobil':'🔧','klinik gigi':'🦷','gym fitness':'💪','laundry':'🧺','toko bunga':'💐','pet shop':'🐾'};

    // ===================== TABS =====================
    function switchTab(t){
        document.querySelectorAll('.tab-content').forEach(e=>e.classList.remove('active'));
        document.getElementById('tab-'+t).classList.add('active');
        document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.toggle('text-gold',b.dataset.tab===t);b.classList.toggle('text-white/40',b.dataset.tab!==t)});
        history.replaceState(null,null,'#'+t);
        if(t==='leads')loadLeads();
        if(t==='closer')loadWAMessages();
        if(t==='builder'){loadBuilderLeads();loadDemos()}
        if(t==='treasury')loadTreasury();
    }

    // ===================== TOAST =====================
    function showToast(msg,type='success'){
        const t=document.getElementById('toast'),ic=document.getElementById('toast-icon'),m=document.getElementById('toast-msg');
        m.textContent=msg;
        ic.className=type==='success'?'fas fa-check-circle text-neon':type==='error'?'fas fa-times-circle text-predator':'fas fa-info-circle text-gold';
        t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500);
    }

    // ===================== HELPERS =====================
    function scoreBg(s){return s>=80?'bg-neon/20 text-neon':s>=50?'bg-gold/20 text-gold':'bg-predator/20 text-predator'}
    function statusBadge(st){const m={new:'bg-white/10 text-white/60',contacted:'bg-blue-500/20 text-blue-400',interested:'bg-gold/20 text-gold',converted:'bg-neon/20 text-neon'};return m[st]||m.new}
    function catEmoji(c){return CAT_EMOJI[c]||'🏪'}

    // ===================== BULK HUNT CHIPS =====================
    function renderChips(){
        const cc=document.getElementById('bulk-cities');
        cc.innerHTML=CITIES.map(c=>'<span class="chip text-white/50 '+(selectedBulkCities.has(c)?'active text-gold':'')+'" onclick="toggleCity(this,\\''+c+'\\')">'+(selectedBulkCities.has(c)?'✓ ':'')+c+'</span>').join('');
        const kc=document.getElementById('bulk-cats');
        kc.innerHTML=CATS.map(c=>'<span class="chip text-white/50 '+(selectedBulkCats.has(c)?'active text-neon':'')+'" onclick="toggleCat(this,\\''+c+'\\')">'+(CAT_EMOJI[c]||'')+(selectedBulkCats.has(c)?' ✓':'')+' '+c+'</span>').join('');
        updateBulkEstimate();
    }
    function toggleCity(el,c){selectedBulkCities.has(c)?selectedBulkCities.delete(c):selectedBulkCities.add(c);renderChips()}
    function toggleCat(el,c){selectedBulkCats.has(c)?selectedBulkCats.delete(c):selectedBulkCats.add(c);renderChips()}
    function updateBulkEstimate(){
        const cities=selectedBulkCities.size, cats=selectedBulkCats.size;
        const lim=parseInt(document.getElementById('bulk-limit')?.value||3);
        const hunts=cities*cats, maxLeads=hunts*lim;
        document.getElementById('bulk-estimate').textContent=cities+' cities x '+cats+' categories = '+hunts+' hunts → up to '+maxLeads+' leads';
    }

    // ===================== LOAD STATS =====================
    async function loadStats(){
        try{
            const r=await fetch('/api/stats');stats=await r.json();
            document.getElementById('s-leads').textContent=stats.leads||0;
            document.getElementById('s-hot').textContent=stats.hot_leads||0;
            document.getElementById('s-msgs').textContent=stats.messages_generated||0;
            document.getElementById('s-deals').textContent=stats.conversions||0;
            document.getElementById('prog-pct').textContent=(stats.progress_percent||0)+'%';
            document.getElementById('prog-bar').style.width=Math.max(stats.progress_percent||0,2)+'%';
            document.getElementById('prog-rev').textContent=stats.revenue_formatted||'Rp 0';
            document.getElementById('db-count').textContent=stats.leads?stats.leads+' in DB':'';
        }catch(e){console.error('Stats error:',e)}
    }

    // ===================== SCOUT STATUS =====================
    async function pollScoutStatus(){
        try{
            const r=await fetch('/api/scout/status');const s=await r.json();
            const badge=document.getElementById('scout-state-badge');
            const msg=document.getElementById('scout-state-msg');
            const count=document.getElementById('scout-result-count');
            const colors={idle:'bg-white/10 text-white/40',hunting:'bg-gold/20 text-gold',scoring:'bg-neon/20 text-neon',complete:'bg-neon/20 text-neon',error:'bg-predator/20 text-predator'};
            badge.className='text-[8px] font-mono px-1.5 py-0.5 rounded '+(colors[s.state]||colors.idle);
            badge.textContent=s.state.toUpperCase();
            msg.textContent=s.current_step;
            count.textContent=s.cached_results||0;
            const crewScout=document.getElementById('crew-scout');
            if(s.state==='hunting'||s.state==='scoring'){
                crewScout.innerHTML='<div class="w-2 h-2 bg-gold rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-gold font-bold">HUNTING</span>';
            } else {
                crewScout.innerHTML='<div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-[10px] font-mono text-neon font-bold">READY</span>';
            }
            const ind=document.getElementById('scout-indicator');
            if(s.state==='hunting'||s.state==='scoring'){
                ind.innerHTML='<div class="w-2 h-2 bg-gold rounded-full animate-pulse"></div><span class="text-gold font-mono text-[10px]">HUNTING</span>';
            } else {
                ind.innerHTML='<div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-neon font-mono text-[10px]">ONLINE</span>';
            }
            return s;
        }catch(e){return null}
    }

    // ===================== SINGLE HUNT =====================
    async function startHunt(){
        if(isHunting)return;
        isHunting=true;
        const area=document.getElementById('cfg-area').value;
        const cat=document.getElementById('cfg-cat').value;
        const limit=parseInt(document.getElementById('cfg-limit').value)||5;
        const btn=document.getElementById('btn-hunt');
        btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> HUNTING...';btn.classList.remove('animate-pulse-glow');btn.classList.add('hunt-active');
        showOverlay('🎯','HUNTING: '+cat,'Scanning Google Maps...','Area: '+area);

        huntPollInterval=setInterval(async()=>{
            const s=await pollScoutStatus();
            if(s){
                const pct=s.total>0?Math.round((s.progress/s.total)*100):10;
                document.getElementById('hunt-step').textContent=s.current_step;
                document.getElementById('hunt-progress').style.width=Math.max(pct,5)+'%';
                document.getElementById('hunt-detail').textContent=s.progress+'/'+s.total+' scored';
                if(s.state==='hunting')document.getElementById('hunt-title').textContent='🔍 SCANNING...';
                else if(s.state==='scoring')document.getElementById('hunt-title').textContent='🧠 AI SCORING...';
            }
        },1500);

        try{
            const url='/api/scout/search?area='+encodeURIComponent(area)+'&category='+encodeURIComponent(cat)+'&limit='+limit;
            const r=await fetch(url);const data=await r.json();
            clearInterval(huntPollInterval);
            if(data.success){
                updateOverlay('✅','HUNT COMPLETE!','Found '+data.total+' leads ('+data.new_leads+' new, '+data.saved_to_db+' saved)',100);
                showToast(data.total+' leads! '+data.saved_to_db+' saved to DB');
                await loadStats();
                setTimeout(()=>{hideOverlay();switchTab('leads')},2000);
            } else {
                updateOverlay('❌','FAILED',data.error||'Unknown error',0);
                showToast(data.error||'Hunt failed','error');
                setTimeout(hideOverlay,3000);
            }
        }catch(e){
            clearInterval(huntPollInterval);
            updateOverlay('❌','ERROR',e.message,0);
            showToast('Error: '+e.message,'error');
            setTimeout(hideOverlay,3000);
        }
        btn.disabled=false;btn.innerHTML='<i class="fas fa-crosshairs"></i>HUNT<i class="fas fa-bolt"></i>';btn.classList.add('animate-pulse-glow');btn.classList.remove('hunt-active');
        isHunting=false;
    }

    // ===================== BULK HUNT =====================
    async function startBulkHunt(){
        if(isBulkHunting)return;
        const cities=[...selectedBulkCities];
        const cats=[...selectedBulkCats];
        const limit=parseInt(document.getElementById('bulk-limit').value)||3;
        if(!cities.length||!cats.length){showToast('Select at least 1 city and 1 category','error');return}
        isBulkHunting=true;
        const btn=document.getElementById('btn-bulk');
        btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> BULK HUNTING...';
        const totalHunts=cities.length*cats.length;
        showOverlay('💣','BULK HUNT LAUNCHED!','0/'+totalHunts+' hunts completed',cities.length+' cities x '+cats.length+' categories');

        // Poll bulk status
        const bulkPoll=setInterval(async()=>{
            try{
                const r=await fetch('/api/bulk/status');const s=await r.json();
                if(s.status==='running'||s.hunts_completed>0){
                    const pct=s.hunts_total>0?Math.round((s.hunts_completed/s.hunts_total)*100):0;
                    document.getElementById('hunt-step').textContent=s.hunts_completed+'/'+s.hunts_total+' hunts | '+s.total_leads+' leads found | '+s.total_saved+' saved';
                    document.getElementById('hunt-progress').style.width=Math.max(pct,3)+'%';
                    document.getElementById('hunt-detail').textContent=s.cities_completed+'/'+s.cities_total+' cities done';
                    if(s.hunts_completed>0)document.getElementById('hunt-title').textContent='⚡ HUNTING '+s.cities_completed+'/'+s.cities_total+'...';
                }
            }catch(e){}
            await pollScoutStatus();
        },3000);

        try{
            const r=await fetch('/api/bulk/hunt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cities,categories:cats,limit})});
            const data=await r.json();
            clearInterval(bulkPoll);
            if(data.success){
                const s=data.summary;
                updateOverlay('🎉','BULK HUNT COMPLETE!',s.total_leads+' leads found, '+s.total_saved+' saved! ('+s.errors+' errors)',100);
                showToast('Bulk Hunt done! '+s.total_leads+' leads, '+s.total_saved+' saved');
                document.getElementById('hunt-close-btn').style.display='inline-block';
                await loadStats();
            } else {
                updateOverlay('❌','BULK HUNT FAILED',data.error||'Unknown',0);
                showToast(data.error||'Bulk hunt failed','error');
                document.getElementById('hunt-close-btn').style.display='inline-block';
            }
        }catch(e){
            clearInterval(bulkPoll);
            updateOverlay('❌','ERROR',e.message,0);
            showToast('Error: '+e.message,'error');
            document.getElementById('hunt-close-btn').style.display='inline-block';
        }
        btn.disabled=false;btn.innerHTML='<i class="fas fa-bomb"></i>LAUNCH BULK HUNT<i class="fas fa-fire"></i>';
        isBulkHunting=false;
    }

    // ===================== OVERLAY HELPERS =====================
    function showOverlay(emoji,title,step,detail){
        const o=document.getElementById('hunt-overlay');o.style.display='flex';
        document.getElementById('hunt-emoji').textContent=emoji;
        document.getElementById('hunt-title').textContent=title;
        document.getElementById('hunt-step').textContent=step;
        document.getElementById('hunt-progress').style.width='5%';
        document.getElementById('hunt-detail').textContent=detail;
        document.getElementById('hunt-close-btn').style.display='none';
    }
    function updateOverlay(emoji,title,step,pct){
        document.getElementById('hunt-emoji').textContent=emoji;
        document.getElementById('hunt-title').textContent=title;
        document.getElementById('hunt-step').textContent=step;
        document.getElementById('hunt-progress').style.width=pct+'%';
    }
    function hideOverlay(){document.getElementById('hunt-overlay').style.display='none'}

    // ===================== LEAD SOURCE =====================
    function setLeadSource(src){
        leadSource=src;
        document.getElementById('src-db').className=src==='db'?'flex-1 glass-gold py-2 rounded-xl text-[10px] font-display font-bold text-gold text-center':'flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/40 text-center';
        document.getElementById('src-memory').className=src==='memory'?'flex-1 glass-neon py-2 rounded-xl text-[10px] font-display font-bold text-neon text-center':'flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/40 text-center';
        loadLeads();
    }

    // ===================== LOAD LEADS =====================
    async function loadLeads(){
        try{
            const search=document.getElementById('lead-search')?.value||'';
            const cat=document.getElementById('lead-filter-cat')?.value||'';
            const st=document.getElementById('lead-filter-status')?.value||'';
            let url='/api/leads?source='+leadSource+'&limit=50';
            if(search)url+='&search='+encodeURIComponent(search);
            if(cat)url+='&category='+encodeURIComponent(cat);
            if(st)url+='&status='+st;
            const r=await fetch(url);const d=await r.json();
            document.getElementById('lead-count').textContent=d.total+' leads ('+d.source+')';
            const container=document.getElementById('leads-container');
            if(!d.data||!d.data.length){
                container.innerHTML='<div class="glass rounded-2xl p-8 text-center"><div class="text-4xl mb-3 opacity-30">🔍</div><h3 class="font-display font-bold text-white/50 text-sm mb-1">No leads found</h3><p class="text-[11px] text-white/30">Run a hunt first!</p></div>';
                return;
            }
            container.innerHTML=d.data.map(l=>{
                const gapData=typeof l.digital_gap_analysis==='string'?JSON.parse(l.digital_gap_analysis||'{}'):l.digital_gap_analysis||{};
                return '<div class="lead-card glass rounded-2xl p-4">'+
                '<div class="flex items-start justify-between mb-2">'+
                    '<div class="flex items-center gap-2"><span class="text-lg">'+catEmoji(l.category)+'</span><div><div class="font-display font-bold text-sm text-white leading-tight">'+l.business_name+'</div><div class="text-[10px] text-white/40">'+(l.address||'').substring(0,50)+'</div></div></div>'+
                    '<div class="flex flex-col items-end gap-1"><span class="'+scoreBg(l.ai_score)+' px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">'+l.ai_score+'</span><span class="'+statusBadge(l.status)+' px-1.5 py-0.5 rounded text-[8px] font-mono uppercase">'+(l.status||'new')+'</span></div>'+
                '</div>'+
                '<div class="flex items-center gap-3 mb-2 text-[10px] text-white/40">'+
                    '<span>⭐ '+(l.rating||'?')+'</span><span>📝 '+(l.review_count||0)+'</span><span class="'+(l.website_url?'text-neon':'text-predator')+'">'+(l.website_url?'🌐 Web':'❌ No Web')+'</span>'+
                '</div>'+
                (gapData.summary?'<div class="text-[10px] text-white/30 mb-2 italic">💡 '+gapData.summary+'</div>':'')+
                (l.recommended_approach?'<div class="text-[10px] text-gold/60 mb-3">🎯 '+l.recommended_approach+'</div>':'')+
                '<div class="flex gap-2">'+
                    '<button onclick="generateWAForLead('+l.id+',\\''+escHtml(l.business_name)+'\\')" class="flex-1 bg-green-500/10 border border-green-400 py-2 rounded-xl text-[10px] font-display font-bold text-green-400 hover:bg-green-500/20 transition-all flex items-center justify-center gap-1"><i class="fab fa-whatsapp"></i>WA Message</button>'+
                    (l.phone&&l.phone!=='unknown'&&l.phone!=='+62-unknown'?'<a href="https://wa.me/'+cleanPhone(l.phone)+'" target="_blank" class="flex-1 bg-neon/10 border border-neon py-2 rounded-xl text-[10px] font-display font-bold text-neon hover:bg-neon/20 transition-all flex items-center justify-center gap-1"><i class="fab fa-whatsapp"></i>Direct WA</a>':'<button class="flex-1 glass py-2 rounded-xl text-[10px] font-display font-bold text-white/30 flex items-center justify-center gap-1" disabled><i class="fas fa-phone-slash"></i>No Phone</button>')+
                    '<button onclick="quickBuildDemo('+l.id+',\\''+escHtml(l.business_name)+'\\')" class="flex-1 bg-purple-500/10 border border-purple-400 py-2 rounded-xl text-[10px] font-display font-bold text-purple-400 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1"><i class="fas fa-code"></i>Build</button>'+
                '</div>'+
            '</div>'}).join('');
        }catch(e){console.error('Leads error:',e)}
    }

    function escHtml(s){return (s||'').replace(/'/g,'').replace(/"/g,'').replace(/</g,'&lt;')}
    function cleanPhone(p){let c=(p||'').replace(/[^0-9]/g,'');if(c.startsWith('0'))c='62'+c.slice(1);return c}

    // ===================== WA CLOSER =====================
    async function generateWAForLead(leadId,name){
        showToast('Generating AI message for '+name+'...','info');
        try{
            const r=await fetch('/api/closer/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lead_id:leadId,message_type:'initial',use_ai:true})});
            const d=await r.json();
            if(d.success){
                showToast('Message generated for '+name);
                switchTab('closer');
                loadWAMessages();
            } else {
                showToast(d.error||'Failed','error');
            }
        }catch(e){showToast('Error: '+e.message,'error')}
    }

    async function batchGenerateWA(){
        const minScore=parseInt(document.getElementById('wa-min-score').value)||60;
        const msgType=document.getElementById('wa-msg-type').value;
        const limit=parseInt(document.getElementById('wa-limit').value)||10;
        const btn=document.getElementById('btn-batch-wa');
        btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> GENERATING...';
        try{
            const r=await fetch('/api/closer/batch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({min_score:minScore,message_type:msgType,limit})});
            const d=await r.json();
            if(d.success){
                showToast(d.generated+' messages generated!');
                loadWAMessages();
            } else {
                showToast(d.error||'Failed','error');
            }
        }catch(e){showToast('Error: '+e.message,'error')}
        btn.disabled=false;btn.innerHTML='<i class="fab fa-whatsapp"></i>GENERATE BATCH MESSAGES<i class="fas fa-bolt"></i>';
    }

    async function loadWAMessages(){
        try{
            const r=await fetch('/api/closer/messages');const d=await r.json();
            document.getElementById('wa-msg-count').textContent=d.total+' messages';
            const c=document.getElementById('wa-messages-list');
            if(!d.data||!d.data.length){
                c.innerHTML='<div class="text-center py-6"><div class="text-3xl mb-2 opacity-30"><i class="fab fa-whatsapp"></i></div><p class="text-[11px] text-white/30">No messages yet. Generate from leads or use batch!</p></div>';
                return;
            }
            c.innerHTML=d.data.map(m=>'<div class="wa-msg">'+
                '<div class="flex items-center justify-between mb-2">'+
                    '<span class="font-display font-bold text-xs text-white">'+m.business_name+'</span>'+
                    '<span class="text-[8px] font-mono bg-green-500/20 text-green-400 px-2 py-0.5 rounded">'+m.message_type+'</span>'+
                '</div>'+
                '<p class="text-[11px] text-white/70 mb-3 leading-relaxed">'+m.message_text+'</p>'+
                '<div class="flex items-center justify-between">'+
                    '<span class="text-[9px] font-mono text-white/30">'+m.phone+'</span>'+
                    '<a href="'+m.wa_deeplink+'" target="_blank" class="bg-green-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-display font-bold flex items-center gap-1 hover:bg-green-600 transition-all"><i class="fab fa-whatsapp"></i>OPEN WA</a>'+
                '</div>'+
            '</div>').join('');
        }catch(e){console.error(e)}
    }

    // ===================== TREASURY =====================
    async function loadTreasury(){
        try{
            const r=await fetch('/api/reports/hunt-summary');const d=await r.json();
            const rep=document.getElementById('hunt-report');
            rep.innerHTML='<div class="grid grid-cols-3 gap-2 mb-3">'+
                '<div class="glass rounded-xl p-3 text-center"><div class="text-lg font-display font-black text-neon">'+d.total_leads+'</div><div class="text-[8px] font-mono text-white/40">TOTAL</div></div>'+
                '<div class="glass rounded-xl p-3 text-center"><div class="text-lg font-display font-black text-gold">'+(d.hot_leads||0)+'</div><div class="text-[8px] font-mono text-white/40">HOT 80+</div></div>'+
                '<div class="glass rounded-xl p-3 text-center"><div class="text-lg font-display font-black text-blue-400">'+(d.messages_generated||0)+'</div><div class="text-[8px] font-mono text-white/40">MSGS</div></div>'+
            '</div>';
            if(d.top_10&&d.top_10.length){
                rep.innerHTML+='<h4 class="text-[9px] font-mono text-white/40 mb-2">TOP LEADS</h4>';
                rep.innerHTML+=d.top_10.map((l,i)=>'<div class="glass rounded-xl px-3 py-2 flex items-center justify-between text-xs">'+
                    '<span class="text-white/60">#'+(i+1)+' '+l.name+'</span>'+
                    '<span class="'+scoreBg(l.score)+' px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">'+l.score+'</span>'+
                '</div>').join('');
            }
            // Progress chart
            if(typeof Chart!=='undefined'){
                const pc=document.getElementById('progressChart');
                if(pc){new Chart(pc,{type:'doughnut',data:{labels:['Collected','Target'],datasets:[{data:[0,100],backgroundColor:['#FFD700','rgba(255,255,255,0.05)'],borderWidth:0,cutout:'75%'}]},options:{responsive:false,plugins:{legend:{display:false}}},plugins:[{id:'ct',afterDraw:function(ch){const x=ch.ctx;x.save();x.textAlign='center';x.textBaseline='middle';const cx=ch.width/2,cy=ch.height/2;x.font='bold 22px Montserrat';x.fillStyle='#FFD700';x.fillText('0%',cx,cy-4);x.font='9px monospace';x.fillStyle='rgba(255,255,255,0.3)';x.fillText('of $500',cx,cy+14);x.restore()}}]})}
            }
        }catch(e){console.error(e)}
    }

    // ===================== BUILDER / ARCHITECT =====================
    async function loadTemplates(){
        try{
            const r=await fetch('/api/architect/templates');const d=await r.json();
            const picker=document.getElementById('tpl-picker');
            if(!picker)return;
            picker.innerHTML=d.templates.map(t=>'<button onclick="selectTemplate(\\''+t.id+'\\')" class="tpl-btn flex flex-col items-center gap-1 p-2 rounded-xl border transition-all '+(selectedTemplate===t.id?'border-purple-400 bg-purple-500/10':'border-white/10 glass hover:border-purple-400/50')+'" data-tpl="'+t.id+'">'+
                '<span class="text-xl">'+t.emoji+'</span>'+
                '<span class="text-[8px] font-display font-bold text-white/70">'+t.name.split(' ')[0]+'</span>'+
            '</button>').join('');
        }catch(e){}
    }
    function selectTemplate(tpl){
        selectedTemplate=tpl;
        document.querySelectorAll('.tpl-btn').forEach(b=>{
            b.classList.toggle('border-purple-400',b.dataset.tpl===tpl);
            b.classList.toggle('bg-purple-500/10',b.dataset.tpl===tpl);
            b.classList.toggle('border-white/10',b.dataset.tpl!==tpl);
        });
        const TNAMES={barber:'Barber Shop — Dark Bold',cafe:'Cafe — Warm Cozy',salon:'Salon — Elegant Rose',workshop:'Bengkel — Industrial',generic:'Generic — Modern Clean'};
        document.getElementById('tpl-selected').innerHTML='<span class="text-purple-400 font-bold">'+tpl.toUpperCase()+'</span> — '+(TNAMES[tpl]||tpl);
    }

    async function loadBuilderLeads(){
        try{
            const r=await fetch('/api/leads?source=db&limit=50');const d=await r.json();
            builderLeads=d.data||[];
            const sel=document.getElementById('build-lead-select');
            if(!sel)return;
            sel.innerHTML='<option value="">-- Select Lead --</option>'+
                builderLeads.map(l=>'<option value="'+l.id+'">'+catEmoji(l.category)+' '+l.business_name+' (Score: '+l.ai_score+')</option>').join('');
        }catch(e){}
        loadTemplates();
    }

    async function generateFromLead(){
        const leadId=document.getElementById('build-lead-select')?.value;
        if(!leadId){showToast('Select a lead first!','error');return}
        const btn=document.getElementById('btn-generate-lead');
        btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> GENERATING...';
        try{
            const r=await fetch('/api/architect/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lead_id:parseInt(leadId),template:selectedTemplate||undefined})});
            const d=await r.json();
            if(d.success){
                showToast('Website generated for '+d.demo.business_name+' in '+d.generation_time_ms+'ms!');
                loadDemos();
                // Open preview
                window.open(d.demo.preview_url,'_blank');
            } else {
                showToast(d.error||'Failed','error');
            }
        }catch(e){showToast('Error: '+e.message,'error')}
        btn.disabled=false;btn.innerHTML='<i class="fas fa-bolt"></i>GENERATE WEBSITE<i class="fas fa-rocket"></i>';
    }

    async function generateCustom(){
        const name=document.getElementById('custom-name')?.value;
        if(!name){showToast('Enter a business name!','error');return}
        const btn=document.getElementById('btn-generate-custom');
        btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> BUILDING...';
        try{
            const r=await fetch('/api/architect/generate-from-data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
                business_name:name,
                category:selectedTemplate||'generic',
                address:document.getElementById('custom-address')?.value||'',
                phone:document.getElementById('custom-phone')?.value||'',
                rating:parseFloat(document.getElementById('custom-rating')?.value)||4.5,
                review_count:parseInt(document.getElementById('custom-reviews')?.value)||100,
                template:selectedTemplate||undefined
            })});
            const d=await r.json();
            if(d.success){
                showToast('Custom website built in '+d.generation_time_ms+'ms!');
                loadDemos();
                window.open(d.demo.preview_url,'_blank');
            } else {
                showToast(d.error||'Failed','error');
            }
        }catch(e){showToast('Error: '+e.message,'error')}
        btn.disabled=false;btn.innerHTML='<i class="fas fa-wand-magic-sparkles"></i>BUILD CUSTOM SITE';
    }

    async function batchBuild(){
        const minScore=parseInt(document.getElementById('batch-build-score')?.value)||60;
        const limit=parseInt(document.getElementById('batch-build-limit')?.value)||5;
        const btn=document.getElementById('btn-batch-build');
        btn.disabled=true;btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> BATCH BUILDING...';
        try{
            const r=await fetch('/api/architect/batch-generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({min_score:minScore,limit,template:selectedTemplate||undefined})});
            const d=await r.json();
            if(d.success){
                showToast(d.total+' demos generated in '+d.generation_time_ms+'ms!');
                loadDemos();
                await loadStats();
            } else {
                showToast(d.error||'Failed','error');
            }
        }catch(e){showToast('Error: '+e.message,'error')}
        btn.disabled=false;btn.innerHTML='<i class="fas fa-layer-group"></i>BATCH BUILD ALL<i class="fas fa-bolt"></i>';
    }

    async function loadDemos(){
        try{
            const r=await fetch('/api/architect/demos');const d=await r.json();
            document.getElementById('demo-count').textContent=d.total+' demos';
            const c=document.getElementById('demos-container');
            if(!d.data||!d.data.length){
                c.innerHTML='<div class="text-center py-6"><div class="text-3xl mb-2 opacity-30"><i class="fas fa-globe"></i></div><p class="text-[11px] text-white/30">No demos yet. Generate from leads or custom!</p></div>';
                return;
            }
            const TPL_COLOR={barber:'gold',cafe:'orange-400',salon:'pink-400',workshop:'yellow-400',generic:'indigo-400'};
            const TPL_EMOJI={barber:'💈',cafe:'☕',salon:'💅',workshop:'🔧',generic:'🏪'};
            c.innerHTML=d.data.map(dm=>'<div class="glass rounded-2xl p-4">'+
                '<div class="flex items-start justify-between mb-2">'+
                    '<div class="flex items-center gap-2"><span class="text-lg">'+(TPL_EMOJI[dm.template_type]||'🏪')+'</span><div><div class="font-display font-bold text-sm text-white">'+dm.business_name+'</div><div class="text-[10px] text-white/40">'+dm.template_type+' template</div></div></div>'+
                    '<div class="flex flex-col items-end gap-1"><span class="text-[8px] font-mono bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">'+dm.status+'</span><span class="text-[8px] font-mono text-white/30">👁 '+dm.views+' views</span></div>'+
                '</div>'+
                '<div class="flex gap-2">'+
                    '<a href="'+dm.preview_url+'" target="_blank" class="flex-1 bg-purple-500/10 border border-purple-400 py-2 rounded-xl text-[10px] font-display font-bold text-purple-400 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1"><i class="fas fa-external-link-alt"></i>PREVIEW</a>'+
                    '<button onclick="copyDemoLink(\\''+dm.preview_url+'\\')" class="flex-1 glass-gold py-2 rounded-xl text-[10px] font-display font-bold text-gold flex items-center justify-center gap-1 hover:bg-gold/10 transition-all"><i class="fas fa-copy"></i>COPY LINK</button>'+
                    '<button onclick="sendDemoViaWA(\\''+dm.id+'\\',\\''+escHtml(dm.business_name)+'\\')" class="flex-1 bg-green-500/10 border border-green-400 py-2 rounded-xl text-[10px] font-display font-bold text-green-400 hover:bg-green-500/20 transition-all flex items-center justify-center gap-1"><i class="fab fa-whatsapp"></i>SEND</button>'+
                '</div>'+
            '</div>').join('');
        }catch(e){console.error(e)}
    }

    function copyDemoLink(url){
        const full=window.location.origin+url;
        navigator.clipboard.writeText(full).then(()=>showToast('Link copied: '+full)).catch(()=>showToast('Copy failed','error'));
    }

    function sendDemoViaWA(demoId,name){
        const full=window.location.origin+'/demo/'+demoId;
        const text=encodeURIComponent('Halo! Saya buatkan preview website untuk '+name+'. Silakan cek di sini: '+full+' \\n\\nGratis, tanpa biaya. Kalau cocok bisa kita lanjut. 🙏');
        window.open('https://wa.me/?text='+text,'_blank');
        showToast('Opening WhatsApp to share demo...');
    }

    // ===================== ACTIVITY LOG =====================
    async function loadActivity(){
        try{
            const r=await fetch('/api/agent-logs');const d=await r.json();
            const icons={scout:'fa-crosshairs text-gold',bulk_hunter:'fa-bomb text-neon',closer:'fa-comment text-green-400',system:'fa-cog text-white/40'};
            document.getElementById('activity-log').innerHTML=d.data.slice(0,15).map(l=>'<div class="flex items-center gap-2 text-[10px]">'+
                '<i class="fas '+(icons[l.agent_type]||'fa-circle text-white/30')+' w-4 text-center"></i>'+
                '<span class="text-white/60 flex-1 truncate">'+l.action+(l.details?' — '+l.details:'')+'</span>'+
                '<span class="font-mono '+(l.status==='success'?'text-neon':'text-predator')+'">'+l.status.toUpperCase()+'</span>'+
            '</div>').join('');
        }catch(e){}
    }

    // ===================== QUICK BUILD FROM LEADS TAB =====================
    async function quickBuildDemo(leadId,name){
        showToast('Building website for '+name+'...','info');
        try{
            const r=await fetch('/api/architect/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lead_id:leadId})});
            const d=await r.json();
            if(d.success){
                showToast('Website built for '+d.demo.business_name+'!');
                window.open(d.demo.preview_url,'_blank');
            } else showToast(d.error||'Failed','error');
        }catch(e){showToast('Error: '+e.message,'error')}
    }

    // ===================== EVENT LISTENERS =====================
    document.getElementById('btn-hunt')?.addEventListener('click',startHunt);
    document.getElementById('btn-bulk')?.addEventListener('click',startBulkHunt);
    document.getElementById('btn-batch-wa')?.addEventListener('click',batchGenerateWA);
    document.getElementById('btn-generate-lead')?.addEventListener('click',generateFromLead);
    document.getElementById('btn-generate-custom')?.addEventListener('click',generateCustom);
    document.getElementById('btn-batch-build')?.addEventListener('click',batchBuild);
    document.getElementById('lead-search')?.addEventListener('input',()=>{clearTimeout(window._st);window._st=setTimeout(loadLeads,300)});
    document.getElementById('lead-filter-cat')?.addEventListener('change',loadLeads);
    document.getElementById('lead-filter-status')?.addEventListener('change',loadLeads);
    document.getElementById('bulk-limit')?.addEventListener('input',updateBulkEstimate);

    // ===================== INIT =====================
    (async()=>{
        renderChips();
        const hash=window.location.hash.replace('#','');
        if(['predator','leads','closer','builder','treasury'].includes(hash))switchTab(hash);
        await loadStats();
        await loadActivity();
        await pollScoutStatus();
        setInterval(pollScoutStatus,10000);
        setInterval(loadStats,30000);
    })();
    </script>
</body>
</html>`
