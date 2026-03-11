export const landingPageHTML = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>SOVEREIGN PREDATOR SUITE | Autonomous AI Business Empire</title>
    <meta name="description" content="Sovereign Predator Suite - Autonomous AI-powered business hunting system for UMKM Indonesia.">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>👹</text></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
      tailwind.config = { theme: { extend: { colors: { obsidian:'#050505',gold:'#FFD700','gold-dark':'#B8860B',neon:'#00FF00',predator:'#FF3333' }, fontFamily: { display:['Montserrat','sans-serif'], body:['Inter','sans-serif'] } } } }
    </script>
    <style>
      body{font-family:'Inter',sans-serif;background:#050505;color:#fff;overflow-x:hidden}
      .glass{background:rgba(26,26,26,0.6);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,215,0,0.1)}
      .glass-gold{background:rgba(255,215,0,0.05);backdrop-filter:blur(20px);border:1px solid rgba(255,215,0,0.2)}
      .glow-gold{box-shadow:0 0 20px rgba(255,215,0,0.3),0 0 60px rgba(255,215,0,0.1)}
      .text-glow-gold{text-shadow:0 0 20px rgba(255,215,0,0.5)}
      @keyframes pulse-glow{0%,100%{box-shadow:0 0 20px rgba(0,255,0,0.4),0 0 60px rgba(0,255,0,0.15)}50%{box-shadow:0 0 30px rgba(0,255,0,0.6),0 0 80px rgba(0,255,0,0.25)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes scan-line{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
      .animate-pulse-glow{animation:pulse-glow 2s ease-in-out infinite}
      .animate-float{animation:float 3s ease-in-out infinite}
      .fade-in-up{animation:fadeInUp 0.8s ease-out forwards;opacity:0}
      .delay-1{animation-delay:.1s}.delay-2{animation-delay:.2s}.delay-3{animation-delay:.3s}.delay-4{animation-delay:.4s}.delay-5{animation-delay:.5s}
      .scan-overlay::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(0,255,0,0.5),transparent);animation:scan-line 3s linear infinite;z-index:1}
      .grid-bg{background-image:linear-gradient(rgba(255,215,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.03) 1px,transparent 1px);background-size:40px 40px}
      ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#050505}::-webkit-scrollbar-thumb{background:#FFD700;border-radius:4px}
    </style>
</head>
<body class="grid-bg min-h-screen">
    <div class="scan-overlay fixed inset-0 pointer-events-none z-50"></div>
    <nav class="fixed top-0 left-0 right-0 z-40 glass">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2"><span class="text-2xl">👹</span><span class="font-display font-black text-gold text-sm tracking-wider">SOVEREIGN</span></div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 text-xs"><div class="w-2 h-2 bg-neon rounded-full animate-pulse"></div><span class="text-neon font-mono text-xs hidden sm:inline">SYSTEM ONLINE</span></div>
                <a href="/dashboard" class="glass-gold px-3 py-1.5 rounded-lg text-gold text-xs font-display font-bold hover:bg-gold/10 transition-all">DASHBOARD</a>
            </div>
        </div>
    </nav>
    <section class="min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
        <div class="max-w-4xl mx-auto text-center">
            <div class="fade-in-up mb-6"><div class="text-6xl md:text-8xl mb-4 animate-float">👹</div></div>
            <h1 class="font-display font-black text-3xl md:text-5xl lg:text-6xl text-gold text-glow-gold mb-4 fade-in-up delay-1 tracking-tight leading-tight">SOVEREIGN<br>PREDATOR SUITE</h1>
            <p class="font-display font-bold text-lg md:text-2xl text-white/80 mb-2 fade-in-up delay-2">Autonomous AI Business Empire</p>
            <p class="text-sm text-white/40 mb-8 fade-in-up delay-2 font-mono">// Zero Human Intervention. Zero Mercy.</p>
            <div class="flex items-center justify-center gap-3 mb-8 fade-in-up delay-3">
                <span class="glass-gold px-3 py-1 rounded-full text-xs font-mono text-gold">v2.0.0</span>
                <span class="glass px-3 py-1 rounded-full text-xs font-mono text-neon flex items-center gap-1"><span class="w-2 h-2 bg-neon rounded-full animate-pulse"></span>PHASE 2 ACTIVE</span>
            </div>
            <div class="fade-in-up delay-4">
                <a href="/dashboard" class="inline-flex items-center gap-3 bg-neon/10 border-2 border-neon text-neon px-8 py-4 rounded-2xl font-display font-black text-lg md:text-xl animate-pulse-glow hover:bg-neon/20 transition-all duration-300 group">
                    <i class="fas fa-crosshairs group-hover:animate-spin"></i>LAUNCH PREDATOR<i class="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </a>
            </div>
            <p class="text-white/30 text-xs mt-4 fade-in-up delay-5 font-mono">Target: Rp 7.500.000 (~$500) | 4 AI Agents | Full Autonomous</p>
        </div>
    </section>
    <section class="px-4 pb-16">
        <div class="max-w-4xl mx-auto">
            <h2 class="font-display font-black text-xl text-center text-gold mb-2">THE PREDATOR ENGINES</h2>
            <p class="text-center text-white/40 text-sm mb-8 font-mono">// 4 autonomous AI agents working 24/7</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="glass rounded-2xl p-6 hover:glow-gold transition-all duration-500 fade-in-up delay-1 group cursor-pointer">
                    <div class="flex items-center gap-3 mb-3"><div class="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-xl"><i class="fas fa-crosshairs"></i></div><div><h3 class="font-display font-black text-gold">THE HUNTER</h3><span class="text-[10px] font-mono text-white/40">SCOUT AGENT</span></div></div>
                    <p class="text-white/60 text-sm leading-relaxed mb-3">Scans Google Maps untuk menemukan bisnis UMKM tanpa website. AI scoring 0-100.</p>
                    <div class="flex items-center gap-3 text-[10px] font-mono text-white/30"><span><i class="fas fa-map-marker-alt text-gold/50 mr-1"></i>SerpAPI</span><span><i class="fas fa-brain text-gold/50 mr-1"></i>Groq AI</span></div>
                </div>
                <div class="glass rounded-2xl p-6 hover:glow-gold transition-all duration-500 fade-in-up delay-2 group cursor-pointer">
                    <div class="flex items-center gap-3 mb-3"><div class="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center text-neon text-xl"><i class="fab fa-whatsapp"></i></div><div><h3 class="font-display font-black text-neon">THE CLOSER</h3><span class="text-[10px] font-mono text-white/40">CLOSER AGENT</span></div></div>
                    <p class="text-white/60 text-sm leading-relaxed mb-3">Generate pesan WhatsApp "Devil Hunter" personal dan sulit ditolak.</p>
                    <div class="flex items-center gap-3 text-[10px] font-mono text-white/30"><span><i class="fab fa-whatsapp text-neon/50 mr-1"></i>WA Deeplink</span><span><i class="fas fa-pen text-neon/50 mr-1"></i>AI Copy</span></div>
                </div>
                <div class="glass rounded-2xl p-6 hover:glow-gold transition-all duration-500 fade-in-up delay-3 group cursor-pointer">
                    <div class="flex items-center gap-3 mb-3"><div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl"><i class="fas fa-code"></i></div><div><h3 class="font-display font-black text-purple-400">THE BUILDER</h3><span class="text-[10px] font-mono text-white/40">ARCHITECT AGENT</span></div></div>
                    <p class="text-white/60 text-sm leading-relaxed mb-3">Auto-generate "Ghost Website" profesional dalam hitungan detik.</p>
                    <div class="flex items-center gap-3 text-[10px] font-mono text-white/30"><span><i class="fas fa-bolt text-purple-400/50 mr-1"></i>&lt;60s</span><span><i class="fas fa-rocket text-purple-400/50 mr-1"></i>Auto Deploy</span></div>
                </div>
                <div class="glass rounded-2xl p-6 hover:glow-gold transition-all duration-500 fade-in-up delay-4 group cursor-pointer">
                    <div class="flex items-center gap-3 mb-3"><div class="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold text-xl"><i class="fas fa-coins"></i></div><div><h3 class="font-display font-black text-gold">THE HARVESTER</h3><span class="text-[10px] font-mono text-white/40">TREASURY AGENT</span></div></div>
                    <p class="text-white/60 text-sm leading-relaxed mb-3">Track revenue real-time. Auto profit split: Op 30%, Growth 20%, Liq 30%, Stake 20%.</p>
                    <div class="flex items-center gap-3 text-[10px] font-mono text-white/30"><span><i class="fas fa-dollar-sign text-gold/50 mr-1"></i>Revenue</span><span><i class="fas fa-chart-pie text-gold/50 mr-1"></i>Auto Split</span></div>
                </div>
            </div>
        </div>
    </section>
    <footer class="glass border-t border-white/5 py-6 px-4">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2"><span class="text-xl">👹</span><span class="font-display font-black text-gold text-xs">SOVEREIGN PREDATOR SUITE v2.0</span></div>
            <div class="flex items-center gap-2 text-xs text-white/30 font-mono"><span class="w-2 h-2 bg-predator rounded-full animate-pulse"></span>Zero Mercy Mode</div>
            <div class="text-xs text-white/20 font-mono">&copy; 2026 GYS | The Sovereign Predator</div>
        </div>
    </footer>
</body>
</html>`
