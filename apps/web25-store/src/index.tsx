import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  GROQ_API_KEY?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS for API routes
app.use('/api/*', cors())

// ============================================================
// API ROUTES
// ============================================================

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' })
})

// Get all agents/services
app.get('/api/agents', (c) => {
  const agents = [
    {
      id: 'barber-dynasty',
      name: 'Barber Dynasty Engine',
      slug: 'barber-dynasty',
      category: 'grooming',
      tagline: 'AI-Powered Barber Shop Management',
      description: 'Sistem manajemen barbershop berbasis AI. Otomasi booking, rekomendasi gaya rambut, inventory tracking, dan loyalty program. Tingkatkan revenue barbershop 30%+ dengan teknologi AI.',
      icon: 'fa-scissors',
      color: '#D4AF37',
      price: { monthly: 150000, yearly: 1500000, currency: 'IDR' },
      features: ['AI Style Recommendation', 'Smart Booking System', 'Inventory Auto-Track', 'Client Loyalty Program', 'Revenue Analytics', 'WhatsApp Integration'],
      status: 'live',
      rating: 4.8,
      users: 12,
      demo_url: '/demo/barber'
    },
    {
      id: 'iftar-catering',
      name: 'Sovereign Iftar & Catering Agent',
      slug: 'iftar-catering',
      category: 'fnb',
      tagline: 'AI Catering Management for Ramadan & Events',
      description: 'Agen AI khusus untuk bisnis katering dan iftar. Kelola pesanan massal, koordinasi menu, jadwal pengiriman, dan komunikasi pelanggan secara otomatis. Perfect untuk musim Ramadan.',
      icon: 'fa-utensils',
      color: '#00AEEF',
      price: { monthly: 200000, yearly: 2000000, currency: 'IDR' },
      features: ['Mass Order Management', 'Menu Planning AI', 'Delivery Scheduling', 'Customer Auto-Reply', 'Revenue Dashboard', 'Seasonal Analytics'],
      status: 'coming_soon',
      rating: 0,
      users: 0,
      demo_url: null
    },
    {
      id: 'hamper-gift',
      name: 'Sovereign Hamper & Gift Agent',
      slug: 'hamper-gift',
      category: 'retail',
      tagline: 'AI Gift Box & Hamper Business Automation',
      description: 'Otomasi bisnis hamper dan gift box. Dari order management, custom packaging planner, hingga logistics coordination. Maksimalkan profit di musim Lebaran dan event spesial.',
      icon: 'fa-gift',
      color: '#E74C3C',
      price: { monthly: 175000, yearly: 1750000, currency: 'IDR' },
      features: ['Order Pipeline Manager', 'Custom Package Builder', 'Logistics Coordinator', 'WhatsApp Bot', 'Profit Calculator', 'Supplier Network'],
      status: 'coming_soon',
      rating: 0,
      users: 0,
      demo_url: null
    },
    {
      id: 'property-agent',
      name: 'Sovereign Property Agent',
      slug: 'property-agent',
      category: 'property',
      tagline: 'AI Real Estate Lead & Listing Manager',
      description: 'Agen AI untuk bisnis properti. Auto-generate listing, qualify leads via WhatsApp, schedule viewings, dan track deals. Cocok untuk agen properti independen dan small agency.',
      icon: 'fa-building',
      color: '#27AE60',
      price: { monthly: 250000, yearly: 2500000, currency: 'IDR' },
      features: ['AI Listing Generator', 'Lead Qualification Bot', 'Viewing Scheduler', 'Deal Pipeline', 'Market Analytics', 'Auto Follow-up'],
      status: 'coming_soon',
      rating: 0,
      users: 0,
      demo_url: null
    },
    {
      id: 'content-creator',
      name: 'Sovereign Content Engine',
      slug: 'content-creator',
      category: 'digital',
      tagline: 'AI Content Creation & Social Media Manager',
      description: 'Mesin konten AI untuk UMKM. Auto-generate caption, schedule posting, analisis engagement, dan content calendar. Bangun brand tanpa hire social media manager.',
      icon: 'fa-pen-nib',
      color: '#9B59B6',
      price: { monthly: 100000, yearly: 1000000, currency: 'IDR' },
      features: ['AI Caption Writer', 'Content Calendar', 'Multi-Platform Post', 'Engagement Analytics', 'Hashtag Research', 'Brand Voice AI'],
      status: 'coming_soon',
      rating: 0,
      users: 0,
      demo_url: null
    },
    {
      id: 'laundry-agent',
      name: 'Sovereign Laundry Agent',
      slug: 'laundry-agent',
      category: 'service',
      tagline: 'AI Laundry Business Automation',
      description: 'Otomasi bisnis laundry kiloan dan satuan. Track order, estimasi waktu, reminder pelanggan via WhatsApp, dan laporan keuangan otomatis.',
      icon: 'fa-shirt',
      color: '#3498DB',
      price: { monthly: 125000, yearly: 1250000, currency: 'IDR' },
      features: ['Order Tracking System', 'Auto Price Calculator', 'WhatsApp Notification', 'Revenue Reports', 'Customer Database', 'Pickup Scheduler'],
      status: 'coming_soon',
      rating: 0,
      users: 0,
      demo_url: null
    }
  ]

  const category = c.req.query('category')
  const status = c.req.query('status')

  let filtered = agents
  if (category) filtered = filtered.filter(a => a.category === category)
  if (status) filtered = filtered.filter(a => a.status === status)

  return c.json({ agents: filtered, total: filtered.length })
})

// Get single agent detail
app.get('/api/agents/:slug', (c) => {
  const slug = c.req.param('slug')
  // Re-use the same data from above
  const agents: Record<string, any> = {
    'barber-dynasty': {
      id: 'barber-dynasty',
      name: 'Barber Dynasty Engine',
      category: 'grooming',
      tagline: 'AI-Powered Barber Shop Management',
      description: 'Sistem manajemen barbershop berbasis AI lengkap. Dari booking otomatis, rekomendasi gaya rambut berdasarkan bentuk wajah, tracking inventory produk (pomade, pisau cukur, dll), hingga program loyalitas pelanggan. Dirancang khusus untuk barbershop Indonesia yang ingin naik level.',
      icon: 'fa-scissors',
      color: '#D4AF37',
      price: { monthly: 150000, yearly: 1500000, currency: 'IDR' },
      features: [
        { name: 'AI Style Recommendation', desc: 'Analisis bentuk wajah & tipe rambut untuk saran gaya terbaik' },
        { name: 'Smart Booking System', desc: 'Booking via WhatsApp yang terkoordinasi dengan jadwal barber' },
        { name: 'Inventory Auto-Track', desc: 'Prediksi stok produk & auto-alert saat mau habis' },
        { name: 'Client Loyalty Program', desc: 'Sistem poin & reward otomatis untuk pelanggan setia' },
        { name: 'Revenue Analytics', desc: 'Dashboard analitik pendapatan real-time' },
        { name: 'WhatsApp Integration', desc: 'Bot WhatsApp untuk booking, reminder, & promo' }
      ],
      status: 'live',
      rating: 4.8,
      users: 12,
      how_it_works: [
        'Daftar & setup profil barbershop Anda (5 menit)',
        'Hubungkan nomor WhatsApp bisnis Anda',
        'AI Agent mulai handle booking & rekomendasi',
        'Monitor performa via dashboard analytics'
      ],
      roi_claim: 'Rata-rata barbershop kami meningkat 30% revenue dalam 60 hari pertama',
      testimonials: [
        { name: 'Adi S.', role: 'Owner, Barbershop Jaya', text: 'Booking naik 40% sejak pakai agent ini. Customer jadi lebih loyal.' },
        { name: 'Rizky M.', role: 'Barber, Cut & Style', text: 'Ga perlu ribet ngatur jadwal lagi. AI yang handle semua.' }
      ]
    }
  }

  const agent = agents[slug]
  if (!agent) {
    return c.json({ error: 'Agent not found' }, 404)
  }
  return c.json({ agent })
})

// Contact / Lead form
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, phone, business, agent_interest, message } = body

    if (!name || !phone) {
      return c.json({ error: 'Name and phone are required' }, 400)
    }

    // In production: save to Supabase
    // For now: return success
    return c.json({
      success: true,
      message: 'Terima kasih! Tim kami akan menghubungi Anda dalam 1x24 jam.',
      lead: { name, email, phone, business, agent_interest, message, created_at: new Date().toISOString() }
    })
  } catch (e) {
    return c.json({ error: 'Invalid request body' }, 400)
  }
})

// Pricing calculator
app.get('/api/pricing', (c) => {
  return c.json({
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        price: { monthly: 99000, yearly: 990000, currency: 'IDR' },
        description: 'Untuk bisnis kecil yang baru mulai',
        features: ['1 AI Agent', '100 conversations/bulan', 'WhatsApp Basic', 'Email Support', 'Basic Analytics'],
        cta: 'Mulai Gratis 14 Hari'
      },
      {
        id: 'growth',
        name: 'Growth',
        price: { monthly: 249000, yearly: 2490000, currency: 'IDR' },
        description: 'Untuk bisnis yang sedang berkembang',
        features: ['3 AI Agents', 'Unlimited conversations', 'WhatsApp Advanced', 'Priority Support', 'Full Analytics', 'Custom Branding'],
        cta: 'Pilih Growth',
        popular: true
      },
      {
        id: 'sovereign',
        name: 'Sovereign',
        price: { monthly: 499000, yearly: 4990000, currency: 'IDR' },
        description: 'Untuk bisnis yang serius scale',
        features: ['Unlimited Agents', 'Unlimited conversations', 'WhatsApp + Multi-channel', '24/7 Dedicated Support', 'Advanced Analytics + API', 'Custom Branding', 'White Label Option', 'Web3 Integration (Future)'],
        cta: 'Hubungi Sales'
      }
    ]
  })
})

// Stats / social proof
app.get('/api/stats', (c) => {
  return c.json({
    total_agents: 6,
    live_agents: 1,
    total_users: 12,
    total_conversations: 847,
    avg_revenue_increase: '30%',
    satisfaction_rate: '96%'
  })
})

// ============================================================
// MAIN HTML PAGE - Sovereign Agent Store
// ============================================================

const renderPage = () => {
  return `<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sovereign Agent Store | AI Micro-Service untuk UMKM Indonesia</title>
  <meta name="description" content="Platform AI Agent marketplace untuk otomasi bisnis UMKM. Dari barbershop hingga katering, tingkatkan revenue bisnis Anda dengan AI.">
  <meta name="keywords" content="AI agent, UMKM, otomasi bisnis, barbershop AI, katering AI, micro-service">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Sovereign Agent Store | AI untuk UMKM">
  <meta property="og:description" content="Tingkatkan revenue bisnis Anda dengan AI Agent yang bekerja 24/7">
  <meta property="og:type" content="website">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            sovereign: {
              dark: '#0A0A0A',
              charcoal: '#1A1A1A',
              gold: '#D4AF37',
              'gold-light': '#F0D060',
              blue: '#00AEEF',
              cream: '#F5F5DC',
              emerald: '#27AE60'
            }
          },
          fontFamily: {
            serif: ['Playfair Display', 'Georgia', 'serif'],
            sans: ['Inter', 'system-ui', 'sans-serif']
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  
  <style>
    * { font-family: 'Inter', system-ui, sans-serif; }
    h1, h2, h3, .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    
    body { background: #0A0A0A; color: #F5F5DC; }
    
    .gold-gradient { background: linear-gradient(135deg, #D4AF37, #F0D060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .gold-border { border-image: linear-gradient(135deg, #D4AF37, #F0D060) 1; }
    
    .card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
    .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(212, 175, 55, 0.15); }
    
    .glow-gold { box-shadow: 0 0 30px rgba(212, 175, 55, 0.2); }
    .glow-blue { box-shadow: 0 0 30px rgba(0, 174, 239, 0.2); }
    
    .btn-sovereign {
      background: linear-gradient(135deg, #D4AF37, #B8941F);
      color: #0A0A0A;
      font-weight: 700;
      padding: 14px 32px;
      border-radius: 8px;
      transition: all 0.3s;
      display: inline-block;
      text-decoration: none;
    }
    .btn-sovereign:hover {
      background: linear-gradient(135deg, #F0D060, #D4AF37);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
    }
    
    .btn-outline {
      border: 2px solid #D4AF37;
      color: #D4AF37;
      font-weight: 600;
      padding: 12px 28px;
      border-radius: 8px;
      transition: all 0.3s;
      display: inline-block;
      text-decoration: none;
      background: transparent;
    }
    .btn-outline:hover {
      background: rgba(212, 175, 55, 0.1);
      transform: translateY(-2px);
    }
    
    .nav-glass {
      background: rgba(10, 10, 10, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .animate-float { animation: float 6s ease-in-out infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    
    .fade-in { opacity: 0; transform: translateY(30px); transition: all 0.8s; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
    
    .hero-pattern {
      background-image: radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(0, 174, 239, 0.03) 0%, transparent 50%);
    }
    
    .stat-card { background: linear-gradient(145deg, #1A1A1A, #111111); border: 1px solid rgba(212, 175, 55, 0.15); }
    
    @media (max-width: 768px) {
      .hero-title { font-size: 2.2rem !important; }
    }
  </style>
</head>
<body class="antialiased">

<!-- NAVIGATION -->
<nav class="nav-glass fixed top-0 left-0 right-0 z-50 border-b border-sovereign-gold/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <a href="#" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-sovereign-gold to-sovereign-gold-light flex items-center justify-center">
          <i class="fas fa-crown text-sovereign-dark text-lg"></i>
        </div>
        <div>
          <span class="font-serif font-bold text-lg text-sovereign-cream">Sovereign</span>
          <span class="text-sovereign-gold font-semibold text-sm ml-1">Agent Store</span>
        </div>
      </a>
      
      <div class="hidden md:flex items-center gap-8">
        <a href="#agents" class="text-sovereign-cream/70 hover:text-sovereign-gold transition-colors text-sm font-medium">Agents</a>
        <a href="#how-it-works" class="text-sovereign-cream/70 hover:text-sovereign-gold transition-colors text-sm font-medium">Cara Kerja</a>
        <a href="#pricing" class="text-sovereign-cream/70 hover:text-sovereign-gold transition-colors text-sm font-medium">Harga</a>
        <a href="#contact" class="text-sovereign-cream/70 hover:text-sovereign-gold transition-colors text-sm font-medium">Kontak</a>
        <a href="#contact" class="btn-sovereign text-sm !py-2.5 !px-5">Mulai Sekarang</a>
      </div>
      
      <button id="mobile-menu-btn" class="md:hidden text-sovereign-cream">
        <i class="fas fa-bars text-xl"></i>
      </button>
    </div>
  </div>
  
  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden md:hidden border-t border-sovereign-gold/10 bg-sovereign-dark/95">
    <div class="px-4 py-4 space-y-3">
      <a href="#agents" class="block text-sovereign-cream/70 hover:text-sovereign-gold py-2">Agents</a>
      <a href="#how-it-works" class="block text-sovereign-cream/70 hover:text-sovereign-gold py-2">Cara Kerja</a>
      <a href="#pricing" class="block text-sovereign-cream/70 hover:text-sovereign-gold py-2">Harga</a>
      <a href="#contact" class="block text-sovereign-cream/70 hover:text-sovereign-gold py-2">Kontak</a>
      <a href="#contact" class="btn-sovereign block text-center text-sm mt-3">Mulai Sekarang</a>
    </div>
  </div>
</nav>

<!-- HERO SECTION -->
<section class="hero-pattern min-h-screen flex items-center pt-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div class="inline-flex items-center gap-2 bg-sovereign-gold/10 border border-sovereign-gold/20 rounded-full px-4 py-2 mb-6">
          <span class="w-2 h-2 bg-sovereign-emerald rounded-full animate-pulse"></span>
          <span class="text-sovereign-gold text-sm font-medium">Platform #1 AI Agent untuk UMKM Indonesia</span>
        </div>
        
        <h1 class="hero-title font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          <span class="text-sovereign-cream">Bisnis Anda,</span><br>
          <span class="gold-gradient">Dikelola AI.</span><br>
          <span class="text-sovereign-cream">Revenue</span>
          <span class="gold-gradient"> Naik.</span>
        </h1>
        
        <p class="text-sovereign-cream/60 text-lg leading-relaxed mb-8 max-w-xl">
          Sovereign Agent Store menyediakan AI Agent khusus untuk setiap jenis bisnis UMKM. 
          Dari barbershop hingga katering, otomasi operasional Anda dan <strong class="text-sovereign-gold">tingkatkan revenue hingga 30%</strong>.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4">
          <a href="#agents" class="btn-sovereign text-center">
            <i class="fas fa-rocket mr-2"></i> Lihat AI Agents
          </a>
          <a href="#how-it-works" class="btn-outline text-center">
            <i class="fas fa-play-circle mr-2"></i> Cara Kerja
          </a>
        </div>
        
        <div class="flex items-center gap-6 mt-10 text-sm">
          <div class="flex items-center gap-2">
            <i class="fas fa-check-circle text-sovereign-emerald"></i>
            <span class="text-sovereign-cream/50">Free Trial 14 Hari</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-check-circle text-sovereign-emerald"></i>
            <span class="text-sovereign-cream/50">Tanpa Kartu Kredit</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-check-circle text-sovereign-emerald"></i>
            <span class="text-sovereign-cream/50">Setup 5 Menit</span>
          </div>
        </div>
      </div>
      
      <div class="relative hidden lg:block">
        <div class="absolute inset-0 bg-gradient-to-br from-sovereign-gold/5 to-sovereign-blue/5 rounded-3xl blur-3xl"></div>
        <div class="relative bg-sovereign-charcoal/50 rounded-3xl border border-sovereign-gold/10 p-8 glow-gold">
          <!-- Mini Dashboard Preview -->
          <div class="flex items-center gap-3 mb-6">
            <div class="w-3 h-3 rounded-full bg-red-500"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div class="w-3 h-3 rounded-full bg-green-500"></div>
            <span class="text-sovereign-cream/30 text-xs ml-2">Sovereign Dashboard</span>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-sovereign-dark/60 rounded-xl p-4">
              <div class="text-sovereign-cream/40 text-xs mb-1">Revenue Bulan Ini</div>
              <div class="text-sovereign-gold font-bold text-2xl">Rp 4.2M</div>
              <div class="text-sovereign-emerald text-xs mt-1"><i class="fas fa-arrow-up mr-1"></i>+32%</div>
            </div>
            <div class="bg-sovereign-dark/60 rounded-xl p-4">
              <div class="text-sovereign-cream/40 text-xs mb-1">Booking Hari Ini</div>
              <div class="text-sovereign-blue font-bold text-2xl">23</div>
              <div class="text-sovereign-emerald text-xs mt-1"><i class="fas fa-arrow-up mr-1"></i>+18%</div>
            </div>
          </div>
          
          <div class="bg-sovereign-dark/60 rounded-xl p-4 mb-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sovereign-cream/40 text-xs">AI Agent Activity</span>
              <span class="w-2 h-2 bg-sovereign-emerald rounded-full animate-pulse"></span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-sovereign-gold/20 flex items-center justify-center">
                  <i class="fas fa-robot text-sovereign-gold text-xs"></i>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-sovereign-cream/70">Booking confirmed: Adi - Potong + Cukur</div>
                  <div class="text-[10px] text-sovereign-cream/30">2 menit lalu via WhatsApp</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-sovereign-blue/20 flex items-center justify-center">
                  <i class="fas fa-bell text-sovereign-blue text-xs"></i>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-sovereign-cream/70">Low stock alert: Pomade Murray's (3 pcs left)</div>
                  <div class="text-[10px] text-sovereign-cream/30">15 menit lalu</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-sovereign-emerald/20 flex items-center justify-center">
                  <i class="fas fa-star text-sovereign-emerald text-xs"></i>
                </div>
                <div class="flex-1">
                  <div class="text-xs text-sovereign-cream/70">Loyalty reward: Budi mendapat potong gratis!</div>
                  <div class="text-[10px] text-sovereign-cream/30">32 menit lalu</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="text-center text-sovereign-cream/20 text-xs">
            <i class="fas fa-lock mr-1"></i> Powered by Sovereign AI Engine
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- STATS BAR -->
<section class="border-y border-sovereign-gold/10 bg-sovereign-charcoal/30">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6" id="stats-section">
      <div class="text-center">
        <div class="text-3xl font-bold text-sovereign-gold font-serif" id="stat-agents">6</div>
        <div class="text-sovereign-cream/40 text-sm mt-1">AI Agents</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-sovereign-gold font-serif" id="stat-users">12+</div>
        <div class="text-sovereign-cream/40 text-sm mt-1">Bisnis Aktif</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-sovereign-gold font-serif" id="stat-conversations">847+</div>
        <div class="text-sovereign-cream/40 text-sm mt-1">Conversations</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-sovereign-gold font-serif">30%+</div>
        <div class="text-sovereign-cream/40 text-sm mt-1">Avg Revenue Boost</div>
      </div>
    </div>
  </div>
</section>

<!-- AGENTS MARKETPLACE -->
<section id="agents" class="py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16 fade-in">
      <span class="text-sovereign-gold text-sm font-semibold tracking-wider uppercase">AI Agent Marketplace</span>
      <h2 class="font-serif text-4xl sm:text-5xl font-bold text-sovereign-cream mt-3">
        Pilih Agent untuk <span class="gold-gradient">Bisnis Anda</span>
      </h2>
      <p class="text-sovereign-cream/50 max-w-2xl mx-auto mt-4 text-lg">
        Setiap agent dirancang khusus untuk industri tertentu. Bukan AI generik, tapi solusi yang memahami bisnis Anda.
      </p>
    </div>
    
    <!-- Filter Tabs -->
    <div class="flex flex-wrap justify-center gap-3 mb-12">
      <button class="agent-filter active px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-sovereign-gold text-sovereign-dark" data-filter="all">Semua</button>
      <button class="agent-filter px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-sovereign-charcoal text-sovereign-cream/60 hover:text-sovereign-gold border border-sovereign-gold/10" data-filter="live">Live Now</button>
      <button class="agent-filter px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-sovereign-charcoal text-sovereign-cream/60 hover:text-sovereign-gold border border-sovereign-gold/10" data-filter="coming_soon">Coming Soon</button>
    </div>
    
    <!-- Agent Cards -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="agents-grid">
      <!-- Filled by JS -->
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="how-it-works" class="py-24 bg-sovereign-charcoal/20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16 fade-in">
      <span class="text-sovereign-blue text-sm font-semibold tracking-wider uppercase">Simple Process</span>
      <h2 class="font-serif text-4xl sm:text-5xl font-bold text-sovereign-cream mt-3">
        Mulai dalam <span class="gold-gradient">5 Menit</span>
      </h2>
    </div>
    
    <div class="grid md:grid-cols-4 gap-8">
      <div class="text-center fade-in">
        <div class="w-16 h-16 rounded-2xl bg-sovereign-gold/10 border border-sovereign-gold/20 flex items-center justify-center mx-auto mb-5">
          <span class="text-sovereign-gold font-serif font-bold text-2xl">1</span>
        </div>
        <h3 class="font-serif font-bold text-lg text-sovereign-cream mb-2">Pilih Agent</h3>
        <p class="text-sovereign-cream/40 text-sm">Pilih AI Agent yang sesuai dengan jenis bisnis Anda</p>
      </div>
      
      <div class="text-center fade-in">
        <div class="w-16 h-16 rounded-2xl bg-sovereign-gold/10 border border-sovereign-gold/20 flex items-center justify-center mx-auto mb-5">
          <span class="text-sovereign-gold font-serif font-bold text-2xl">2</span>
        </div>
        <h3 class="font-serif font-bold text-lg text-sovereign-cream mb-2">Setup Profil</h3>
        <p class="text-sovereign-cream/40 text-sm">Isi data bisnis & hubungkan WhatsApp (5 menit)</p>
      </div>
      
      <div class="text-center fade-in">
        <div class="w-16 h-16 rounded-2xl bg-sovereign-gold/10 border border-sovereign-gold/20 flex items-center justify-center mx-auto mb-5">
          <span class="text-sovereign-gold font-serif font-bold text-2xl">3</span>
        </div>
        <h3 class="font-serif font-bold text-lg text-sovereign-cream mb-2">AI Bekerja</h3>
        <p class="text-sovereign-cream/40 text-sm">Agent mulai handle booking, customer, & operasional</p>
      </div>
      
      <div class="text-center fade-in">
        <div class="w-16 h-16 rounded-2xl bg-sovereign-gold/10 border border-sovereign-gold/20 flex items-center justify-center mx-auto mb-5">
          <span class="text-sovereign-gold font-serif font-bold text-2xl">4</span>
        </div>
        <h3 class="font-serif font-bold text-lg text-sovereign-cream mb-2">Revenue Naik</h3>
        <p class="text-sovereign-cream/40 text-sm">Monitor pertumbuhan bisnis lewat dashboard real-time</p>
      </div>
    </div>
  </div>
</section>

<!-- WHY SOVEREIGN -->
<section class="py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-16 items-center">
      <div class="fade-in">
        <span class="text-sovereign-gold text-sm font-semibold tracking-wider uppercase">Kenapa Sovereign?</span>
        <h2 class="font-serif text-4xl font-bold text-sovereign-cream mt-3 mb-8">
          Bukan Sekedar <span class="gold-gradient">Chatbot Biasa</span>
        </h2>
        
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-xl bg-sovereign-gold/10 border border-sovereign-gold/20 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-brain text-sovereign-gold"></i>
            </div>
            <div>
              <h3 class="font-semibold text-sovereign-cream mb-1">AI yang Paham Industri</h3>
              <p class="text-sovereign-cream/40 text-sm">Setiap agent di-training khusus untuk industri tertentu. Bukan jawaban generik.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-xl bg-sovereign-blue/10 border border-sovereign-blue/20 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-rupiah-sign text-sovereign-blue"></i>
            </div>
            <div>
              <h3 class="font-semibold text-sovereign-cream mb-1">ROI Terukur</h3>
              <p class="text-sovereign-cream/40 text-sm">Kami jual "Hasil", bukan "Software". Track peningkatan revenue real-time.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-xl bg-sovereign-emerald/10 border border-sovereign-emerald/20 flex items-center justify-center flex-shrink-0">
              <i class="fab fa-whatsapp text-sovereign-emerald"></i>
            </div>
            <div>
              <h3 class="font-semibold text-sovereign-cream mb-1">WhatsApp-First</h3>
              <p class="text-sovereign-cream/40 text-sm">Customer Anda sudah di WhatsApp. Agent kami juga. Tanpa install app baru.</p>
            </div>
          </div>
          
          <div class="flex gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <i class="fas fa-shield-halved text-purple-400"></i>
            </div>
            <div>
              <h3 class="font-semibold text-sovereign-cream mb-1">Data Sovereignty</h3>
              <p class="text-sovereign-cream/40 text-sm">Data bisnis Anda milik Anda. Kami tidak menjual data ke pihak ketiga.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="fade-in">
        <div class="bg-sovereign-charcoal/50 rounded-3xl border border-sovereign-gold/10 p-8">
          <div class="text-center mb-6">
            <div class="text-sovereign-gold text-sm font-semibold mb-2">Case Study: Barbershop Jaya</div>
            <h3 class="font-serif text-2xl font-bold text-sovereign-cream">Dari Manual ke <span class="gold-gradient">Rp 4.2M/bulan</span></h3>
          </div>
          
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-sovereign-dark/60 rounded-xl p-4 text-center">
              <div class="text-sovereign-cream/30 text-xs mb-1">Sebelum</div>
              <div class="text-red-400 font-bold text-xl">Rp 2.8M</div>
              <div class="text-sovereign-cream/30 text-xs">/bulan</div>
            </div>
            <div class="bg-sovereign-dark/60 rounded-xl p-4 text-center">
              <div class="text-sovereign-cream/30 text-xs mb-1">Sesudah (60 hari)</div>
              <div class="text-sovereign-emerald font-bold text-xl">Rp 4.2M</div>
              <div class="text-sovereign-cream/30 text-xs">/bulan</div>
            </div>
          </div>
          
          <div class="space-y-3">
            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-check text-sovereign-emerald"></i>
              <span class="text-sovereign-cream/60">Booking naik 40% via WhatsApp AI</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-check text-sovereign-emerald"></i>
              <span class="text-sovereign-cream/60">No-show turun 75% (auto reminder)</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-check text-sovereign-emerald"></i>
              <span class="text-sovereign-cream/60">Repeat customer naik 60% (loyalty)</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <i class="fas fa-check text-sovereign-emerald"></i>
              <span class="text-sovereign-cream/60">Waktu admin berkurang 5 jam/minggu</span>
            </div>
          </div>
          
          <div class="mt-6 pt-6 border-t border-sovereign-gold/10">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-sovereign-gold/20 flex items-center justify-center">
                <i class="fas fa-user text-sovereign-gold text-sm"></i>
              </div>
              <div>
                <div class="text-sovereign-cream text-sm font-medium">"Sekarang saya fokus motong, bukan ngurus jadwal."</div>
                <div class="text-sovereign-cream/30 text-xs">Adi S. - Owner, Barbershop Jaya</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section id="pricing" class="py-24 bg-sovereign-charcoal/20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16 fade-in">
      <span class="text-sovereign-gold text-sm font-semibold tracking-wider uppercase">Pricing</span>
      <h2 class="font-serif text-4xl sm:text-5xl font-bold text-sovereign-cream mt-3">
        Harga <span class="gold-gradient">Transparan</span>
      </h2>
      <p class="text-sovereign-cream/50 max-w-xl mx-auto mt-4">
        Mulai gratis. Upgrade kapan saja. Tanpa biaya tersembunyi.
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" id="pricing-grid">
      <!-- Filled by JS -->
    </div>
  </div>
</section>

<!-- CONTACT / CTA -->
<section id="contact" class="py-24">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-16">
      <div class="fade-in">
        <span class="text-sovereign-gold text-sm font-semibold tracking-wider uppercase">Siap Mulai?</span>
        <h2 class="font-serif text-4xl font-bold text-sovereign-cream mt-3 mb-6">
          Konsultasi <span class="gold-gradient">Gratis</span>
        </h2>
        <p class="text-sovereign-cream/50 mb-8 text-lg">
          Ceritakan bisnis Anda. Tim kami akan merekomendasikan agent yang paling cocok dan 
          setup-kan demo khusus untuk Anda. <strong class="text-sovereign-gold">100% gratis, tanpa komitmen.</strong>
        </p>
        
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-sovereign-emerald/10 flex items-center justify-center">
              <i class="fab fa-whatsapp text-sovereign-emerald text-xl"></i>
            </div>
            <div>
              <div class="text-sovereign-cream font-medium">WhatsApp</div>
              <a href="https://wa.me/6281234567890" class="text-sovereign-gold text-sm">+62 812 3456 7890</a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-sovereign-blue/10 flex items-center justify-center">
              <i class="fas fa-envelope text-sovereign-blue text-xl"></i>
            </div>
            <div>
              <div class="text-sovereign-cream font-medium">Email</div>
              <a href="mailto:hello@sovereign-agent.store" class="text-sovereign-gold text-sm">hello@sovereign-agent.store</a>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <i class="fab fa-instagram text-purple-400 text-xl"></i>
            </div>
            <div>
              <div class="text-sovereign-cream font-medium">Instagram</div>
              <a href="#" class="text-sovereign-gold text-sm">@sovereign.agent.store</a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="fade-in">
        <form id="contact-form" class="bg-sovereign-charcoal/50 rounded-3xl border border-sovereign-gold/10 p-8">
          <h3 class="font-serif font-bold text-xl text-sovereign-cream mb-6">Hubungi Kami</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sovereign-cream/50 text-sm mb-1.5">Nama Lengkap *</label>
              <input type="text" name="name" required class="w-full bg-sovereign-dark/80 border border-sovereign-gold/10 rounded-lg px-4 py-3 text-sovereign-cream placeholder-sovereign-cream/20 focus:border-sovereign-gold/40 focus:outline-none transition-colors" placeholder="John Doe">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sovereign-cream/50 text-sm mb-1.5">No. WhatsApp *</label>
                <input type="tel" name="phone" required class="w-full bg-sovereign-dark/80 border border-sovereign-gold/10 rounded-lg px-4 py-3 text-sovereign-cream placeholder-sovereign-cream/20 focus:border-sovereign-gold/40 focus:outline-none transition-colors" placeholder="08123456789">
              </div>
              <div>
                <label class="block text-sovereign-cream/50 text-sm mb-1.5">Email</label>
                <input type="email" name="email" class="w-full bg-sovereign-dark/80 border border-sovereign-gold/10 rounded-lg px-4 py-3 text-sovereign-cream placeholder-sovereign-cream/20 focus:border-sovereign-gold/40 focus:outline-none transition-colors" placeholder="email@example.com">
              </div>
            </div>
            
            <div>
              <label class="block text-sovereign-cream/50 text-sm mb-1.5">Jenis Bisnis</label>
              <select name="business" class="w-full bg-sovereign-dark/80 border border-sovereign-gold/10 rounded-lg px-4 py-3 text-sovereign-cream focus:border-sovereign-gold/40 focus:outline-none transition-colors">
                <option value="">Pilih jenis bisnis...</option>
                <option value="barbershop">Barbershop / Salon</option>
                <option value="fnb">Food & Beverage / Katering</option>
                <option value="retail">Retail / Toko</option>
                <option value="property">Property / Real Estate</option>
                <option value="laundry">Laundry</option>
                <option value="digital">Digital / Content</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sovereign-cream/50 text-sm mb-1.5">Agent yang Diminati</label>
              <select name="agent_interest" class="w-full bg-sovereign-dark/80 border border-sovereign-gold/10 rounded-lg px-4 py-3 text-sovereign-cream focus:border-sovereign-gold/40 focus:outline-none transition-colors">
                <option value="">Belum yakin - butuh rekomendasi</option>
                <option value="barber-dynasty">Barber Dynasty Engine</option>
                <option value="iftar-catering">Iftar & Catering Agent</option>
                <option value="hamper-gift">Hamper & Gift Agent</option>
                <option value="property-agent">Property Agent</option>
                <option value="content-creator">Content Engine</option>
                <option value="laundry-agent">Laundry Agent</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sovereign-cream/50 text-sm mb-1.5">Pesan / Pertanyaan</label>
              <textarea name="message" rows="3" class="w-full bg-sovereign-dark/80 border border-sovereign-gold/10 rounded-lg px-4 py-3 text-sovereign-cream placeholder-sovereign-cream/20 focus:border-sovereign-gold/40 focus:outline-none transition-colors resize-none" placeholder="Ceritakan tentang bisnis Anda..."></textarea>
            </div>
            
            <button type="submit" class="btn-sovereign w-full text-center">
              <i class="fas fa-paper-plane mr-2"></i> Kirim & Dapatkan Demo Gratis
            </button>
            
            <p class="text-sovereign-cream/20 text-xs text-center">
              Kami akan merespons dalam 1x24 jam. Data Anda aman dan tidak dibagikan.
            </p>
          </div>
          
          <div id="form-success" class="hidden mt-4 p-4 bg-sovereign-emerald/10 border border-sovereign-emerald/30 rounded-xl text-center">
            <i class="fas fa-check-circle text-sovereign-emerald text-2xl mb-2"></i>
            <p class="text-sovereign-cream font-medium">Pesan terkirim!</p>
            <p class="text-sovereign-cream/50 text-sm">Tim kami akan menghubungi Anda segera.</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer class="border-t border-sovereign-gold/10 bg-sovereign-charcoal/30">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid md:grid-cols-4 gap-10">
      <div class="md:col-span-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-sovereign-gold to-sovereign-gold-light flex items-center justify-center">
            <i class="fas fa-crown text-sovereign-dark text-lg"></i>
          </div>
          <div>
            <span class="font-serif font-bold text-lg text-sovereign-cream">Sovereign</span>
            <span class="text-sovereign-gold font-semibold text-sm ml-1">Agent Store</span>
          </div>
        </div>
        <p class="text-sovereign-cream/40 text-sm leading-relaxed max-w-sm">
          Platform AI Agent marketplace untuk otomasi bisnis UMKM Indonesia. 
          Bagian dari ekosistem GANI HYPHA - "Akar Dalam, Cabang Tinggi".
        </p>
        <div class="flex gap-4 mt-6">
          <a href="#" class="w-10 h-10 rounded-lg bg-sovereign-dark/80 border border-sovereign-gold/10 flex items-center justify-center text-sovereign-cream/40 hover:text-sovereign-gold transition-colors">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="w-10 h-10 rounded-lg bg-sovereign-dark/80 border border-sovereign-gold/10 flex items-center justify-center text-sovereign-cream/40 hover:text-sovereign-gold transition-colors">
            <i class="fab fa-x-twitter"></i>
          </a>
          <a href="#" class="w-10 h-10 rounded-lg bg-sovereign-dark/80 border border-sovereign-gold/10 flex items-center justify-center text-sovereign-cream/40 hover:text-sovereign-gold transition-colors">
            <i class="fab fa-tiktok"></i>
          </a>
          <a href="https://github.com/Estes786" class="w-10 h-10 rounded-lg bg-sovereign-dark/80 border border-sovereign-gold/10 flex items-center justify-center text-sovereign-cream/40 hover:text-sovereign-gold transition-colors">
            <i class="fab fa-github"></i>
          </a>
        </div>
      </div>
      
      <div>
        <h4 class="font-semibold text-sovereign-cream mb-4">Agents</h4>
        <ul class="space-y-2 text-sm text-sovereign-cream/40">
          <li><a href="#agents" class="hover:text-sovereign-gold transition-colors">Barber Dynasty</a></li>
          <li><a href="#agents" class="hover:text-sovereign-gold transition-colors">Iftar & Catering</a></li>
          <li><a href="#agents" class="hover:text-sovereign-gold transition-colors">Hamper & Gift</a></li>
          <li><a href="#agents" class="hover:text-sovereign-gold transition-colors">Property Agent</a></li>
          <li><a href="#agents" class="hover:text-sovereign-gold transition-colors">Content Engine</a></li>
          <li><a href="#agents" class="hover:text-sovereign-gold transition-colors">Laundry Agent</a></li>
        </ul>
      </div>
      
      <div>
        <h4 class="font-semibold text-sovereign-cream mb-4">Links</h4>
        <ul class="space-y-2 text-sm text-sovereign-cream/40">
          <li><a href="#how-it-works" class="hover:text-sovereign-gold transition-colors">Cara Kerja</a></li>
          <li><a href="#pricing" class="hover:text-sovereign-gold transition-colors">Harga</a></li>
          <li><a href="#contact" class="hover:text-sovereign-gold transition-colors">Kontak</a></li>
          <li><a href="https://gani-hypha-web3.pages.dev" class="hover:text-sovereign-gold transition-colors">GANI HYPHA</a></li>
        </ul>
      </div>
    </div>
    
    <div class="border-t border-sovereign-gold/10 mt-12 pt-8 text-center">
      <p class="text-sovereign-cream/20 text-sm">
        &copy; 2026 Sovereign Agent Store. Part of the GANI HYPHA Ecosystem. All rights reserved.
      </p>
    </div>
  </div>
</footer>

<!-- SCRIPTS -->
<script>
// ============================================================
// APP STATE & INITIALIZATION
// ============================================================
const API_BASE = '';

// Mobile menu toggle
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.add('hidden');
  });
});

// ============================================================
// LOAD AGENTS
// ============================================================
async function loadAgents(filter = 'all') {
  try {
    const url = filter === 'all' ? API_BASE + '/api/agents' : API_BASE + '/api/agents?status=' + filter;
    const res = await fetch(url);
    const data = await res.json();
    renderAgents(data.agents);
  } catch (e) {
    console.error('Error loading agents:', e);
  }
}

function renderAgents(agents) {
  const grid = document.getElementById('agents-grid');
  grid.innerHTML = agents.map(agent => {
    const statusBadge = agent.status === 'live' 
      ? '<span class="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full"><span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>LIVE</span>'
      : '<span class="inline-flex items-center gap-1.5 bg-sovereign-blue/10 text-sovereign-blue text-xs font-medium px-2.5 py-1 rounded-full"><i class="fas fa-clock text-[10px]"></i>Coming Soon</span>';
    
    const priceStr = 'Rp ' + (agent.price.monthly / 1000) + 'K';
    const ratingStr = agent.rating > 0 
      ? '<div class="flex items-center gap-1"><i class="fas fa-star text-sovereign-gold text-xs"></i><span class="text-sovereign-cream/60 text-sm">' + agent.rating + '</span></div>' 
      : '';
    
    return '<div class="card-hover bg-sovereign-charcoal/50 rounded-2xl border border-sovereign-gold/10 overflow-hidden group" data-status="' + agent.status + '">' +
      '<div class="p-6">' +
        '<div class="flex items-start justify-between mb-4">' +
          '<div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: ' + agent.color + '15; border: 1px solid ' + agent.color + '30">' +
            '<i class="fas ' + agent.icon + ' text-xl" style="color: ' + agent.color + '"></i>' +
          '</div>' +
          statusBadge +
        '</div>' +
        '<h3 class="font-serif font-bold text-lg text-sovereign-cream mb-1">' + agent.name + '</h3>' +
        '<p class="text-sovereign-cream/40 text-xs mb-3">' + agent.tagline + '</p>' +
        '<p class="text-sovereign-cream/50 text-sm mb-4 leading-relaxed" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">' + agent.description + '</p>' +
        '<div class="flex flex-wrap gap-2 mb-5">' +
          agent.features.slice(0, 3).map(function(f) { return '<span class="bg-sovereign-dark/60 text-sovereign-cream/50 text-xs px-2.5 py-1 rounded-full">' + f + '</span>'; }).join('') +
          (agent.features.length > 3 ? '<span class="text-sovereign-cream/30 text-xs">+' + (agent.features.length - 3) + ' more</span>' : '') +
        '</div>' +
        '<div class="flex items-center justify-between pt-4 border-t border-sovereign-gold/5">' +
          '<div>' +
            '<span class="text-sovereign-gold font-bold text-lg">' + priceStr + '</span>' +
            '<span class="text-sovereign-cream/30 text-xs">/bulan</span>' +
          '</div>' +
          ratingStr +
        '</div>' +
      '</div>' +
      '<div class="px-6 pb-6">' +
        (agent.status === 'live' 
          ? '<a href="#contact" class="btn-sovereign w-full block text-center text-sm !py-3">Coba Sekarang</a>'
          : '<button class="btn-outline w-full text-center text-sm !py-3 cursor-default opacity-60">Segera Hadir</button>') +
      '</div>' +
    '</div>';
  }).join('');
}

// Filter buttons
document.querySelectorAll('.agent-filter').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.agent-filter').forEach(b => {
      b.classList.remove('bg-sovereign-gold', 'text-sovereign-dark');
      b.classList.add('bg-sovereign-charcoal', 'text-sovereign-cream/60');
    });
    this.classList.remove('bg-sovereign-charcoal', 'text-sovereign-cream/60');
    this.classList.add('bg-sovereign-gold', 'text-sovereign-dark');
    
    loadAgents(this.dataset.filter);
  });
});

// ============================================================
// LOAD PRICING
// ============================================================
async function loadPricing() {
  try {
    const res = await fetch(API_BASE + '/api/pricing');
    const data = await res.json();
    renderPricing(data.plans);
  } catch (e) {
    console.error('Error loading pricing:', e);
  }
}

function renderPricing(plans) {
  const grid = document.getElementById('pricing-grid');
  grid.innerHTML = plans.map(plan => {
    const isPopular = plan.popular;
    const priceStr = 'Rp ' + (plan.price.monthly / 1000) + 'K';
    
    return '<div class="' + (isPopular ? 'relative ring-2 ring-sovereign-gold scale-[1.02]' : '') + ' bg-sovereign-charcoal/50 rounded-2xl border border-sovereign-gold/10 p-8">' +
      (isPopular ? '<div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-sovereign-gold text-sovereign-dark text-xs font-bold px-4 py-1.5 rounded-full">POPULAR</div>' : '') +
      '<div class="text-center mb-6">' +
        '<h3 class="font-serif font-bold text-2xl text-sovereign-cream">' + plan.name + '</h3>' +
        '<p class="text-sovereign-cream/40 text-sm mt-1">' + plan.description + '</p>' +
        '<div class="mt-4">' +
          '<span class="text-sovereign-gold font-bold text-4xl font-serif">' + priceStr + '</span>' +
          '<span class="text-sovereign-cream/30 text-sm">/bulan</span>' +
        '</div>' +
      '</div>' +
      '<ul class="space-y-3 mb-8">' +
        plan.features.map(function(f) {
          return '<li class="flex items-center gap-2 text-sm"><i class="fas fa-check text-sovereign-emerald text-xs"></i><span class="text-sovereign-cream/60">' + f + '</span></li>';
        }).join('') +
      '</ul>' +
      '<a href="#contact" class="' + (isPopular ? 'btn-sovereign' : 'btn-outline') + ' w-full block text-center text-sm">' + plan.cta + '</a>' +
    '</div>';
  }).join('');
}

// ============================================================
// CONTACT FORM
// ============================================================
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);
  
  try {
    const res = await fetch(API_BASE + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    if (result.success) {
      this.reset();
      document.getElementById('form-success').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('form-success').classList.add('hidden');
      }, 5000);
    }
  } catch (e) {
    alert('Terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.');
  }
});

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============================================================
// NAV SCROLL EFFECT
// ============================================================
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.classList.add('border-b', 'border-sovereign-gold/20');
  } else {
    nav.classList.remove('border-sovereign-gold/20');
  }
});

// ============================================================
// INIT
// ============================================================
loadAgents();
loadPricing();
</script>

</body>
</html>`
}

// Main route - serve the full page
app.get('/', (c) => {
  return c.html(renderPage())
})

// Catch all - redirect to home
app.get('*', (c) => {
  return c.html(renderPage())
})

export default app
