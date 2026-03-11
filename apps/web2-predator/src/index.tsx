import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { landingPageHTML } from './pages/landing'
import { dashboardHTML } from './pages/dashboard'
import {
  searchBusinesses,
  scoreLeadWithAI,
  scoutWorkflow,
  getScoutStatus,
  getLastHuntResults,
  type ScoredLead
} from './agents/scout'

type Bindings = {
  GROQ_API_KEY: string
  SERPAPI_KEY: string
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())

// ============================================================
// DUMMY DATA (Phase 2 - will be replaced by Supabase in Phase 6)
// ============================================================
const dummyLeads = [
  { id: 'lead-001', business_name: 'Barbershop Mas Joko', category: 'barber', address: 'Jl. Kemang Raya No. 12, Jakarta Selatan', phone: '+6281234567890', owner_name: 'Joko Susanto', rating: 4.2, review_count: 87, website_url: null, google_maps_url: 'https://maps.google.com/?cid=123456', thumbnail: null, ai_score: 92, digital_gap_score: 85, digital_gap_analysis: { has_website: false, has_booking: false, social_active: true, needs: ['website', 'booking system', 'online presence'], summary: 'Belum punya website, butuh kehadiran digital' }, recommended_approach: 'Tawarkan website + booking system gratis demo', status: 'new', source: 'dummy', created_at: '2026-03-07T10:00:00Z' },
  { id: 'lead-002', business_name: 'Kopi Nusantara Cafe', category: 'cafe', address: 'Jl. Sudirman No. 45, Jakarta Pusat', phone: '+6281345678901', owner_name: 'Dewi Sari', rating: 4.5, review_count: 234, website_url: null, google_maps_url: 'https://maps.google.com/?cid=234567', thumbnail: null, ai_score: 88, digital_gap_score: 75, digital_gap_analysis: { has_website: false, has_booking: false, social_active: true, needs: ['website', 'online menu', 'order system'], summary: 'Populer tapi belum punya website' }, recommended_approach: 'Tawarkan website dengan menu online + order via WA', status: 'new', source: 'dummy', created_at: '2026-03-07T10:05:00Z' },
  { id: 'lead-003', business_name: 'Salon Cantik Bunda', category: 'salon', address: 'Jl. Fatmawati No. 78, Jakarta Selatan', phone: '+6281456789012', owner_name: 'Sri Wahyuni', rating: 3.8, review_count: 42, website_url: null, google_maps_url: 'https://maps.google.com/?cid=345678', thumbnail: null, ai_score: 95, digital_gap_score: 95, digital_gap_analysis: { has_website: false, has_booking: false, social_active: false, needs: ['website', 'booking', 'social media', 'gallery'], summary: 'Tidak punya website dan tidak aktif di sosial media' }, recommended_approach: 'Full digital makeover - website + booking + gallery', status: 'contacted', source: 'dummy', created_at: '2026-03-07T09:30:00Z' },
  { id: 'lead-004', business_name: 'Bengkel Maju Jaya', category: 'workshop', address: 'Jl. TB Simatupang No. 33, Jakarta Selatan', phone: '+6281567890123', owner_name: 'Budi Hartono', rating: 4.0, review_count: 156, website_url: 'http://bengkelmajujaya.blogspot.com', google_maps_url: 'https://maps.google.com/?cid=456789', thumbnail: null, ai_score: 72, digital_gap_score: 60, digital_gap_analysis: { has_website: true, has_booking: false, social_active: false, needs: ['modern website', 'booking system'], summary: 'Punya blogspot tapi butuh website modern' }, recommended_approach: 'Upgrade dari blogspot ke website profesional', status: 'new', source: 'dummy', created_at: '2026-03-07T10:15:00Z' },
  { id: 'lead-005', business_name: 'Warung Makan Sederhana', category: 'cafe', address: 'Jl. Blok M No. 10, Jakarta Selatan', phone: '+6281678901234', owner_name: 'Pak Agus', rating: 4.7, review_count: 512, website_url: null, google_maps_url: 'https://maps.google.com/?cid=567890', thumbnail: null, ai_score: 78, digital_gap_score: 70, digital_gap_analysis: { has_website: false, has_booking: false, social_active: true, needs: ['website', 'online menu'], summary: 'Warung populer tanpa website' }, recommended_approach: 'Website dengan menu + lokasi + review showcase', status: 'interested', source: 'dummy', created_at: '2026-03-07T08:45:00Z' },
  { id: 'lead-006', business_name: 'Pangkas Rambut Abang', category: 'barber', address: 'Jl. Cipete Raya No. 55, Jakarta Selatan', phone: '+6281789012345', owner_name: 'Abang Rizky', rating: 3.5, review_count: 23, website_url: null, google_maps_url: 'https://maps.google.com/?cid=678901', thumbnail: null, ai_score: 97, digital_gap_score: 98, digital_gap_analysis: { has_website: false, has_booking: false, social_active: false, needs: ['everything'], summary: 'Tidak ada kehadiran digital sama sekali' }, recommended_approach: 'Full package - brand identity + website + booking', status: 'new', source: 'dummy', created_at: '2026-03-07T10:20:00Z' },
  { id: 'lead-007', business_name: 'Nail Art Studio Rina', category: 'salon', address: 'Jl. Gandaria No. 22, Jakarta Selatan', phone: '+6281890123456', owner_name: 'Rina Marlina', rating: 4.8, review_count: 89, website_url: null, google_maps_url: 'https://maps.google.com/?cid=789012', thumbnail: null, ai_score: 86, digital_gap_score: 80, digital_gap_analysis: { has_website: false, has_booking: false, social_active: true, needs: ['website', 'portfolio gallery', 'booking'], summary: 'Aktif di Instagram tapi belum punya website' }, recommended_approach: 'Website portfolio + booking online', status: 'new', source: 'dummy', created_at: '2026-03-07T10:25:00Z' },
  { id: 'lead-008', business_name: 'Kedai Kopi Luwak', category: 'cafe', address: 'Jl. Senopati No. 8, Jakarta Selatan', phone: '+6281901234567', owner_name: 'Ahmad Fauzi', rating: 4.3, review_count: 178, website_url: null, google_maps_url: 'https://maps.google.com/?cid=890123', thumbnail: null, ai_score: 82, digital_gap_score: 72, digital_gap_analysis: { has_website: false, has_booking: false, social_active: true, needs: ['website', 'menu online', 'delivery info'], summary: 'Kopi populer tapi belum punya website' }, recommended_approach: 'Website premium + menu interaktif', status: 'converted', source: 'dummy', created_at: '2026-03-06T14:00:00Z' },
]

// Live scout results storage (merged with dummy on read)
let liveScoutLeads: ScoredLead[] = []

const dummyMessages = [
  { id: 'msg-001', lead_id: 'lead-003', message_text: 'Halo Kak Sri! Saya lihat Salon Cantik Bunda punya rating 3.8 di Google Maps. Mau saya buatkan website + sistem booking GRATIS? Pelanggan bisa booking dari HP langsung. Demo: [link]', message_type: 'initial', wa_deeplink: 'https://wa.me/6281456789012?text=Halo%20Kak%20Sri', sent_at: '2026-03-07T11:00:00Z', response_status: 'sent', created_at: '2026-03-07T10:55:00Z' },
  { id: 'msg-002', lead_id: 'lead-005', message_text: 'Halo Pak Agus! Warung Sederhana terkenal banget ya, 512 review! Mau saya buatkan menu online biar pelanggan bisa lihat dari HP? GRATIS demo dulu. Tertarik?', message_type: 'initial', wa_deeplink: 'https://wa.me/6281678901234?text=Halo%20Pak%20Agus', sent_at: '2026-03-07T09:30:00Z', response_status: 'replied', created_at: '2026-03-07T09:25:00Z' },
  { id: 'msg-003', lead_id: 'lead-008', message_text: 'Pak Ahmad, website demo Kedai Kopi Luwak sudah jadi! Cek di sini: [demo-link]. Kalau cocok, harga spesial Rp 200rb aja. Deal?', message_type: 'closing', wa_deeplink: 'https://wa.me/6281901234567?text=Pak%20Ahmad', sent_at: '2026-03-06T16:00:00Z', response_status: 'replied', created_at: '2026-03-06T15:55:00Z' },
]

const dummyTransactions = [
  { id: 'txn-001', lead_id: 'lead-008', amount_idr: 200000, amount_usd: 13.33, description: 'Landing Page - Kedai Kopi Luwak', payment_method: 'transfer', payment_status: 'paid', invoice_number: 'INV-2026-001', paid_at: '2026-03-06T18:00:00Z', created_at: '2026-03-06T16:30:00Z' },
]

const dummyDemos = [
  { id: 'demo-001', lead_id: 'lead-008', business_name: 'Kedai Kopi Luwak', template_type: 'cafe', deploy_url: '/demo/demo-001', status: 'active', views_count: 12, created_at: '2026-03-06T15:30:00Z' },
  { id: 'demo-002', lead_id: 'lead-003', business_name: 'Salon Cantik Bunda', template_type: 'salon', deploy_url: '/demo/demo-002', status: 'deployed', views_count: 3, created_at: '2026-03-07T11:30:00Z' },
]

const dummyAgentLogs: any[] = [
  { id: 'log-001', agent_type: 'scout', action: 'search_businesses', status: 'success', execution_time_ms: 2340, created_at: '2026-03-07T10:00:00Z' },
  { id: 'log-002', agent_type: 'scout', action: 'ai_scoring', status: 'success', execution_time_ms: 1850, created_at: '2026-03-07T10:01:00Z' },
  { id: 'log-003', agent_type: 'closer', action: 'generate_message', status: 'success', execution_time_ms: 980, created_at: '2026-03-07T10:55:00Z' },
  { id: 'log-004', agent_type: 'architect', action: 'generate_website', status: 'success', execution_time_ms: 4200, created_at: '2026-03-06T15:30:00Z' },
  { id: 'log-005', agent_type: 'harvester', action: 'record_payment', status: 'success', execution_time_ms: 350, created_at: '2026-03-06T18:00:00Z' },
  { id: 'log-006', agent_type: 'closer', action: 'generate_message', status: 'success', execution_time_ms: 1100, created_at: '2026-03-07T09:25:00Z' },
  { id: 'log-007', agent_type: 'architect', action: 'generate_website', status: 'success', execution_time_ms: 3800, created_at: '2026-03-07T11:30:00Z' },
  { id: 'log-008', agent_type: 'orchestrator', action: 'predator_loop', status: 'success', execution_time_ms: 15000, created_at: '2026-03-07T10:00:00Z' },
]

// Helper: get all leads (dummy + live scout results)
function getAllLeads() {
  return [...dummyLeads, ...liveScoutLeads]
}

// ============================================================
// API ROUTES - Existing (Phase 2)
// ============================================================

app.get('/api/health', (c) => {
  const scout = getScoutStatus()
  return c.json({
    status: 'online', engine: 'sovereign-predator', version: '3.0.0', phase: 3,
    agents: {
      scout: scout.state,
      closer: 'idle', architect: 'idle', harvester: 'idle', orchestrator: 'idle'
    },
    scout_status: scout,
    timestamp: new Date().toISOString()
  })
})

app.get('/api/stats', (c) => {
  const allLeads = getAllLeads()
  const totalRevenue = dummyTransactions.filter(t => t.payment_status === 'paid').reduce((s, t) => s + t.amount_idr, 0)
  return c.json({
    leads: allLeads.length,
    contacted: allLeads.filter(l => l.status !== 'new').length,
    conversions: allLeads.filter(l => l.status === 'converted').length,
    demos_deployed: dummyDemos.length,
    messages_sent: dummyMessages.length,
    revenue: totalRevenue,
    revenue_formatted: 'Rp ' + totalRevenue.toLocaleString('id-ID'),
    target: 7500000, target_formatted: 'Rp 7.500.000', target_usd: 500,
    progress_percent: Math.round((totalRevenue / 7500000) * 100),
    today: { leads_found: liveScoutLeads.length + 6, messages_sent: 1, websites_deployed: 1, revenue: 0 },
    scout_leads: liveScoutLeads.length
  })
})

app.get('/api/stats/dashboard', (c) => {
  const allLeads = getAllLeads()
  const totalRevenue = dummyTransactions.filter(t => t.payment_status === 'paid').reduce((s, t) => s + t.amount_idr, 0)
  const scout = getScoutStatus()
  return c.json({
    overview: {
      total_leads: allLeads.length,
      hot_leads: allLeads.filter(l => l.ai_score >= 80).length,
      contacted: allLeads.filter(l => l.status === 'contacted').length,
      interested: allLeads.filter(l => l.status === 'interested').length,
      converted: allLeads.filter(l => l.status === 'converted').length,
      rejected: 0,
      scout_leads: liveScoutLeads.length
    },
    revenue: { total: totalRevenue, today: 0, this_week: totalRevenue, this_month: totalRevenue, target: 7500000, progress_percent: Math.round((totalRevenue / 7500000) * 100) },
    agents: {
      scout: { status: scout.state, last_run: scout.last_run || '2026-03-07T10:01:00Z', total_runs: scout.last_run ? 3 : 2, results: scout.results_count },
      closer: { status: 'idle', last_run: '2026-03-07T10:55:00Z', total_runs: 3 },
      architect: { status: 'idle', last_run: '2026-03-07T11:30:00Z', total_runs: 2 },
      harvester: { status: 'idle', last_run: '2026-03-06T18:00:00Z', total_runs: 1 }
    },
    recent_activity: dummyAgentLogs.slice(0, 5)
  })
})

app.get('/api/leads', (c) => {
  const status = c.req.query('status')
  const category = c.req.query('category')
  const search = c.req.query('search')
  const minScore = parseInt(c.req.query('min_score') || '0')
  const source = c.req.query('source') // 'scout' to filter only scout leads
  let filtered = source === 'scout' ? [...liveScoutLeads] : getAllLeads()
  if (status) filtered = filtered.filter(l => l.status === status)
  if (category) filtered = filtered.filter(l => l.category === category)
  if (search) filtered = filtered.filter(l => l.business_name.toLowerCase().includes(search.toLowerCase()) || l.address.toLowerCase().includes(search.toLowerCase()))
  if (minScore > 0) filtered = filtered.filter(l => l.ai_score >= minScore)
  filtered.sort((a, b) => b.ai_score - a.ai_score)
  return c.json({ data: filtered, total: filtered.length, page: 1, per_page: 20, scout_count: liveScoutLeads.length })
})

app.get('/api/leads/:id', (c) => {
  const allLeads = getAllLeads()
  const lead = allLeads.find(l => l.id === c.req.param('id'))
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  return c.json(lead)
})

app.post('/api/leads', async (c) => {
  const body = await c.req.json()
  return c.json({ success: true, message: 'Lead created', data: { id: 'lead-new-' + Date.now(), ...body, created_at: new Date().toISOString() } }, 201)
})

app.get('/api/transactions', (c) => {
  const totalPaid = dummyTransactions.filter(t => t.payment_status === 'paid').reduce((s, t) => s + t.amount_idr, 0)
  return c.json({ data: dummyTransactions, total: dummyTransactions.length, summary: { total_revenue: totalPaid, total_paid: totalPaid, total_pending: 0 } })
})

app.get('/api/messages/:leadId', (c) => {
  const msgs = dummyMessages.filter(m => m.lead_id === c.req.param('leadId'))
  return c.json({ data: msgs, total: msgs.length })
})

app.get('/api/demos', (c) => {
  return c.json({ data: dummyDemos, total: dummyDemos.length })
})

app.get('/api/agent-logs', (c) => {
  return c.json({ data: dummyAgentLogs, total: dummyAgentLogs.length })
})

app.get('/api/treasury/stats', (c) => {
  const totalRevenue = dummyTransactions.filter(t => t.payment_status === 'paid').reduce((s, t) => s + t.amount_idr, 0)
  const pct = Math.round((totalRevenue / 7500000) * 100)
  return c.json({
    total_revenue_idr: totalRevenue,
    total_revenue_usd: Math.round(totalRevenue / 15000 * 100) / 100,
    target_idr: 7500000, target_usd: 500,
    progress_percent: pct,
    profit_split: { operational: Math.round(totalRevenue * 0.30), growth: Math.round(totalRevenue * 0.20), liquidity: Math.round(totalRevenue * 0.30), staking: Math.round(totalRevenue * 0.20) },
    daily_revenue: [
      { date: '2026-03-01', amount: 0 }, { date: '2026-03-02', amount: 0 },
      { date: '2026-03-03', amount: 0 }, { date: '2026-03-04', amount: 0 },
      { date: '2026-03-05', amount: 0 }, { date: '2026-03-06', amount: 200000 },
      { date: '2026-03-07', amount: 0 }
    ]
  })
})

// ============================================================
// API ROUTES - Phase 3: Scout Agent (The Hunter)
// ============================================================

// GET /api/scout/status - Scout agent status
app.get('/api/scout/status', (c) => {
  const status = getScoutStatus()
  return c.json({
    ...status,
    cached_results: getLastHuntResults().length
  })
})

// GET /api/scout/search - Execute scout search (SerpAPI + Groq AI)
app.get('/api/scout/search', async (c) => {
  const area = c.req.query('area') || 'Jakarta Selatan'
  const category = c.req.query('category') || 'barber'
  const limit = Math.min(parseInt(c.req.query('limit') || '5'), 20)

  // Check if already hunting
  const currentStatus = getScoutStatus()
  if (currentStatus.state === 'hunting' || currentStatus.state === 'scoring') {
    return c.json({
      error: 'Scout is already hunting! Wait for current hunt to complete.',
      status: currentStatus
    }, 429)
  }

  // Check API keys
  if (!c.env.SERPAPI_KEY || !c.env.GROQ_API_KEY) {
    return c.json({
      error: 'Missing API keys. Configure SERPAPI_KEY and GROQ_API_KEY in .dev.vars',
      status: getScoutStatus()
    }, 500)
  }

  try {
    const results = await scoutWorkflow(
      area,
      category,
      limit,
      c.env.SERPAPI_KEY,
      c.env.GROQ_API_KEY
    )

    // Add to live scout leads (avoid duplicates by business name)
    const existingNames = new Set(liveScoutLeads.map(l => l.business_name.toLowerCase()))
    const newLeads = results.filter(r => !existingNames.has(r.business_name.toLowerCase()))
    liveScoutLeads = [...liveScoutLeads, ...newLeads]

    // Add agent log
    dummyAgentLogs.unshift({
      id: 'log-scout-' + Date.now(),
      agent_type: 'scout',
      action: `hunt_${category}_${area.replace(/\s+/g, '_')}`,
      status: 'success',
      execution_time_ms: 0,
      details: `Found ${results.length} leads (${newLeads.length} new)`,
      created_at: new Date().toISOString()
    })

    return c.json({
      success: true,
      area,
      category,
      results: results,
      total: results.length,
      new_leads: newLeads.length,
      status: getScoutStatus()
    })
  } catch (error: any) {
    // Add error log
    dummyAgentLogs.unshift({
      id: 'log-scout-err-' + Date.now(),
      agent_type: 'scout',
      action: `hunt_${category}_${area.replace(/\s+/g, '_')}`,
      status: 'error',
      execution_time_ms: 0,
      details: error.message,
      created_at: new Date().toISOString()
    })

    return c.json({
      error: 'Scout hunt failed',
      message: error.message,
      status: getScoutStatus()
    }, 500)
  }
})

// POST /api/scout/score - Score a single business with Groq AI
app.post('/api/scout/score', async (c) => {
  if (!c.env.GROQ_API_KEY) {
    return c.json({ error: 'Missing GROQ_API_KEY in .dev.vars' }, 500)
  }

  try {
    const body = await c.req.json()
    const { business, category } = body

    if (!business || !business.title) {
      return c.json({ error: 'Missing business data. Required: { business: { title, address, ... }, category: "..." }' }, 400)
    }

    const scoring = await scoreLeadWithAI(
      business,
      category || 'generic',
      c.env.GROQ_API_KEY
    )

    return c.json({
      success: true,
      business_name: business.title,
      scoring
    })
  } catch (error: any) {
    return c.json({
      error: 'Scoring failed',
      message: error.message
    }, 500)
  }
})

// GET /api/scout/results - Get cached results from last hunt
app.get('/api/scout/results', (c) => {
  const results = getLastHuntResults()
  return c.json({
    data: results,
    total: results.length,
    status: getScoutStatus()
  })
})

// DELETE /api/scout/results - Clear cached scout results
app.delete('/api/scout/results', (c) => {
  liveScoutLeads = []
  return c.json({ success: true, message: 'Scout results cleared' })
})

// ============================================================
// PAGES
// ============================================================
app.get('/', (c) => c.html(landingPageHTML))
app.get('/dashboard', (c) => c.html(dashboardHTML))

export default app
