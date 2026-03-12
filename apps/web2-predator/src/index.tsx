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
import {
  bulkHuntWorkflow,
  getBulkHuntStatus,
  DEFAULT_HUNT_CITIES,
  DEFAULT_HUNT_CATEGORIES,
  type HuntMission
} from './agents/bulk-hunter'
import {
  generateWAMessage,
  generateAIMessage,
  batchGenerateMessages,
  type WAMessage
} from './agents/closer'
import { createSupabaseClient } from './lib/supabase'

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
// IN-MEMORY STORES (augmented with live data)
// ============================================================
let liveScoutLeads: ScoredLead[] = []
let generatedMessages: WAMessage[] = []

const agentLogs: any[] = [
  { id: 'log-001', agent_type: 'scout', action: 'search_businesses', status: 'success', execution_time_ms: 2340, details: 'Session 003 - Initial scout test', created_at: '2026-03-11T10:00:00Z' },
  { id: 'log-002', agent_type: 'scout', action: 'ai_scoring', status: 'success', execution_time_ms: 1850, details: 'Session 003 - AI scoring pipeline', created_at: '2026-03-11T10:01:00Z' },
  { id: 'log-003', agent_type: 'system', action: 'session_004_start', status: 'success', execution_time_ms: 0, details: 'Session 004 - Bulk Hunt + Closer Agent initialized', created_at: '2026-03-12T00:00:00Z' },
]

function addLog(agentType: string, action: string, status: string, details: string, timeMs: number = 0) {
  agentLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    agent_type: agentType,
    action,
    status,
    execution_time_ms: timeMs,
    details,
    created_at: new Date().toISOString()
  })
}

// Helper: get all scout leads
function getAllScoutLeads() {
  return [...liveScoutLeads]
}

// ============================================================
// API ROUTES - Core
// ============================================================

app.get('/api/health', (c) => {
  const scout = getScoutStatus()
  const bulk = getBulkHuntStatus()
  return c.json({
    status: 'online',
    engine: 'sovereign-predator',
    version: '4.0.0',
    phase: 4,
    session: '004',
    agents: {
      scout: scout.state,
      bulk_hunter: bulk?.status || 'idle',
      closer: generatedMessages.length > 0 ? 'active' : 'idle',
      architect: 'idle',
      harvester: 'idle',
      orchestrator: 'idle'
    },
    capabilities: [
      'single_hunt', 'bulk_hunt', 'ai_scoring',
      'supabase_storage', 'wa_closer', 'ai_messages'
    ],
    timestamp: new Date().toISOString()
  })
})

// GET /api/stats - Dashboard overview stats (from Supabase)
app.get('/api/stats', async (c) => {
  const scout = getScoutStatus()
  const bulk = getBulkHuntStatus()

  // Try to get real counts from Supabase
  let dbLeadCount = 0
  let dbHighScoreCount = 0
  try {
    if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
      const db = createSupabaseClient(c.env)
      const allLeads = await db.select('hunting_leads', 'select=id,ai_score,status')
      dbLeadCount = allLeads.length
      dbHighScoreCount = allLeads.filter((l: any) => l.ai_score >= 80).length
    }
  } catch (_) { /* fallback to in-memory */ }

  const totalLeads = dbLeadCount || liveScoutLeads.length
  const hotLeads = dbHighScoreCount || liveScoutLeads.filter(l => l.ai_score >= 80).length

  return c.json({
    leads: totalLeads,
    hot_leads: hotLeads,
    contacted: 0,
    conversions: 0,
    demos_deployed: 0,
    messages_generated: generatedMessages.length,
    revenue: 0,
    revenue_formatted: 'Rp 0',
    target: 7500000,
    target_formatted: 'Rp 7.500.000',
    target_usd: 500,
    progress_percent: 0,
    scout_status: scout.state,
    bulk_status: bulk?.status || 'idle',
    bulk_progress: bulk ? `${bulk.hunts_completed}/${bulk.hunts_total}` : null,
    today: {
      leads_found: liveScoutLeads.length,
      messages_generated: generatedMessages.length,
      hunts_run: bulk?.hunts_completed || 0
    }
  })
})

// GET /api/stats/dashboard - Full dashboard data
app.get('/api/stats/dashboard', async (c) => {
  const scout = getScoutStatus()
  const bulk = getBulkHuntStatus()

  let dbLeads: any[] = []
  try {
    if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
      const db = createSupabaseClient(c.env)
      dbLeads = await db.select('hunting_leads', 'select=id,ai_score,status,category,created_at&order=created_at.desc&limit=100')
    }
  } catch (_) {}

  const totalLeads = dbLeads.length || liveScoutLeads.length

  return c.json({
    overview: {
      total_leads: totalLeads,
      hot_leads: dbLeads.filter((l: any) => l.ai_score >= 80).length || liveScoutLeads.filter(l => l.ai_score >= 80).length,
      contacted: dbLeads.filter((l: any) => l.status === 'contacted').length,
      interested: dbLeads.filter((l: any) => l.status === 'interested').length,
      converted: dbLeads.filter((l: any) => l.status === 'converted').length,
      new_leads: dbLeads.filter((l: any) => l.status === 'new').length,
      in_memory_leads: liveScoutLeads.length,
      messages_generated: generatedMessages.length
    },
    revenue: {
      total: 0, today: 0, this_week: 0, this_month: 0,
      target: 7500000, progress_percent: 0
    },
    agents: {
      scout: {
        status: scout.state,
        last_run: scout.last_run,
        results: scout.results_count,
        current_step: scout.current_step
      },
      bulk_hunter: {
        status: bulk?.status || 'idle',
        cities_completed: bulk?.cities_completed || 0,
        cities_total: bulk?.cities_total || 0,
        hunts_completed: bulk?.hunts_completed || 0,
        hunts_total: bulk?.hunts_total || 0,
        total_leads: bulk?.total_leads || 0,
        total_saved: bulk?.total_saved || 0,
        errors: bulk?.errors?.length || 0
      },
      closer: {
        status: generatedMessages.length > 0 ? 'active' : 'idle',
        messages_generated: generatedMessages.length
      }
    },
    recent_activity: agentLogs.slice(0, 10),
    categories_breakdown: getCategoryBreakdown(dbLeads)
  })
})

function getCategoryBreakdown(dbLeads: any[]) {
  const cats: Record<string, number> = {}
  for (const l of dbLeads) {
    cats[l.category] = (cats[l.category] || 0) + 1
  }
  return cats
}

// ============================================================
// API ROUTES - Leads (Supabase-first)
// ============================================================

// GET /api/leads - Fetch from Supabase (primary) with in-memory fallback
app.get('/api/leads', async (c) => {
  const source = c.req.query('source') // 'db', 'memory', or undefined (all)
  const status = c.req.query('status')
  const category = c.req.query('category')
  const search = c.req.query('search')
  const minScore = parseInt(c.req.query('min_score') || '0')
  const limit = parseInt(c.req.query('limit') || '50')

  // Fetch from Supabase
  if (source !== 'memory') {
    try {
      if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
        const db = createSupabaseClient(c.env)
        let query = `order=ai_score.desc&limit=${limit}`
        if (status) query += `&status=eq.${status}`
        if (category) query += `&category=eq.${category}`
        if (minScore > 0) query += `&ai_score=gte.${minScore}`
        if (search) query += `&business_name=ilike.*${search}*`

        const leads = await db.select('hunting_leads', query)
        return c.json({
          data: leads,
          total: leads.length,
          source: 'supabase',
          in_memory_count: liveScoutLeads.length
        })
      }
    } catch (err: any) {
      // Fallback to in-memory
      if (source === 'db') {
        return c.json({ error: 'Supabase unavailable', message: err.message }, 500)
      }
    }
  }

  // In-memory fallback
  let filtered = [...liveScoutLeads]
  if (status) filtered = filtered.filter(l => l.status === status)
  if (category) filtered = filtered.filter(l => l.category === category)
  if (search) filtered = filtered.filter(l =>
    l.business_name.toLowerCase().includes(search.toLowerCase()) ||
    l.address.toLowerCase().includes(search.toLowerCase())
  )
  if (minScore > 0) filtered = filtered.filter(l => l.ai_score >= minScore)
  filtered.sort((a, b) => b.ai_score - a.ai_score)

  return c.json({
    data: filtered.slice(0, limit),
    total: filtered.length,
    source: 'memory'
  })
})

// GET /api/leads/db - Direct Supabase query
app.get('/api/leads/db', async (c) => {
  if (!c.env.SUPABASE_URL || !c.env.SUPABASE_SERVICE_ROLE_KEY) {
    return c.json({ error: 'Missing Supabase credentials' }, 500)
  }
  try {
    const db = createSupabaseClient(c.env)
    const status = c.req.query('status')
    const category = c.req.query('category')
    const minScore = c.req.query('min_score')
    let query = 'order=ai_score.desc&limit=100'
    if (status) query += `&status=eq.${status}`
    if (category) query += `&category=eq.${category}`
    if (minScore) query += `&ai_score=gte.${minScore}`
    const leads = await db.select('hunting_leads', query)
    return c.json({ data: leads, total: leads.length, source: 'supabase' })
  } catch (error: any) {
    return c.json({ error: 'Failed to fetch from Supabase', message: error.message }, 500)
  }
})

// POST /api/leads/save - Save leads to Supabase
app.post('/api/leads/save', async (c) => {
  if (!c.env.SUPABASE_URL || !c.env.SUPABASE_SERVICE_ROLE_KEY) {
    return c.json({ error: 'Missing Supabase credentials' }, 500)
  }
  try {
    const body = await c.req.json()
    const leadsToSave = body.leads || liveScoutLeads
    if (!leadsToSave.length) {
      return c.json({ error: 'No leads to save' }, 400)
    }
    const db = createSupabaseClient(c.env)
    const rows = leadsToSave.map((l: ScoredLead) => ({
      business_name: l.business_name, category: l.category, address: l.address,
      phone: l.phone, owner_name: l.owner_name, rating: l.rating,
      review_count: l.review_count, website_url: l.website_url,
      google_maps_url: l.google_maps_url, thumbnail: l.thumbnail,
      ai_score: l.ai_score, digital_gap_score: l.digital_gap_score,
      digital_gap_analysis: l.digital_gap_analysis,
      recommended_approach: l.recommended_approach,
      status: l.status || 'new', source: l.source || 'scout_agent'
    }))
    const saved = await db.insert('hunting_leads', rows)
    addLog('scout', 'save_to_supabase', 'success', `Saved ${saved.length} leads`)
    return c.json({ success: true, saved: saved.length })
  } catch (error: any) {
    return c.json({ error: 'Save failed', message: error.message }, 500)
  }
})

// PATCH /api/leads/db/:id - Update lead in Supabase
app.patch('/api/leads/db/:id', async (c) => {
  if (!c.env.SUPABASE_URL || !c.env.SUPABASE_SERVICE_ROLE_KEY) {
    return c.json({ error: 'Missing Supabase credentials' }, 500)
  }
  try {
    const db = createSupabaseClient(c.env)
    const id = c.req.param('id')
    const body = await c.req.json()
    const updated = await db.update('hunting_leads', body, `id=eq.${id}`)
    return c.json({ success: true, data: updated })
  } catch (error: any) {
    return c.json({ error: 'Update failed', message: error.message }, 500)
  }
})

// GET /api/leads/:id
app.get('/api/leads/:id', async (c) => {
  const id = c.req.param('id')
  // Try Supabase first
  try {
    if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
      const db = createSupabaseClient(c.env)
      const leads = await db.select('hunting_leads', `id=eq.${id}`)
      if (leads.length > 0) return c.json(leads[0])
    }
  } catch (_) {}
  // In-memory fallback
  const lead = liveScoutLeads.find(l => l.id === id)
  if (!lead) return c.json({ error: 'Lead not found' }, 404)
  return c.json(lead)
})

// ============================================================
// API ROUTES - Scout Agent (Single Hunt)
// ============================================================

app.get('/api/scout/status', (c) => {
  return c.json({ ...getScoutStatus(), cached_results: getLastHuntResults().length })
})

app.get('/api/scout/search', async (c) => {
  const area = c.req.query('area') || 'Jakarta Selatan'
  const category = c.req.query('category') || 'barber'
  const limit = Math.min(parseInt(c.req.query('limit') || '5'), 20)
  const autoSave = c.req.query('auto_save') !== 'false' // default: auto-save to Supabase

  const currentStatus = getScoutStatus()
  if (currentStatus.state === 'hunting' || currentStatus.state === 'scoring') {
    return c.json({ error: 'Scout busy', status: currentStatus }, 429)
  }

  if (!c.env.SERPAPI_KEY || !c.env.GROQ_API_KEY) {
    return c.json({ error: 'Missing API keys' }, 500)
  }

  const startTime = Date.now()

  try {
    const results = await scoutWorkflow(area, category, limit, c.env.SERPAPI_KEY, c.env.GROQ_API_KEY)

    // Deduplicate against existing
    const existingNames = new Set(liveScoutLeads.map(l => l.business_name.toLowerCase()))
    const newLeads = results.filter(r => !existingNames.has(r.business_name.toLowerCase()))
    liveScoutLeads = [...liveScoutLeads, ...newLeads]

    // Auto-save to Supabase
    let savedCount = 0
    if (autoSave && newLeads.length > 0 && c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const db = createSupabaseClient(c.env)
        const rows = newLeads.map(l => ({
          business_name: l.business_name, category: l.category, address: l.address,
          phone: l.phone, owner_name: l.owner_name, rating: l.rating,
          review_count: l.review_count, website_url: l.website_url,
          google_maps_url: l.google_maps_url, thumbnail: l.thumbnail,
          ai_score: l.ai_score, digital_gap_score: l.digital_gap_score,
          digital_gap_analysis: l.digital_gap_analysis,
          recommended_approach: l.recommended_approach,
          status: 'new', source: 'scout_agent'
        }))
        const saved = await db.insert('hunting_leads', rows)
        savedCount = saved.length
      } catch (saveErr: any) {
        // Non-blocking save error
        addLog('scout', 'auto_save_error', 'error', saveErr.message)
      }
    }

    addLog('scout', `hunt_${category}_${area.replace(/\s+/g, '_')}`, 'success',
      `Found ${results.length} leads (${newLeads.length} new, ${savedCount} saved)`, Date.now() - startTime)

    return c.json({
      success: true, area, category,
      results, total: results.length,
      new_leads: newLeads.length,
      saved_to_db: savedCount,
      status: getScoutStatus()
    })
  } catch (error: any) {
    addLog('scout', `hunt_error`, 'error', error.message, Date.now() - startTime)
    return c.json({ error: 'Hunt failed', message: error.message, status: getScoutStatus() }, 500)
  }
})

app.post('/api/scout/score', async (c) => {
  if (!c.env.GROQ_API_KEY) return c.json({ error: 'Missing GROQ_API_KEY' }, 500)
  try {
    const { business, category } = await c.req.json()
    if (!business?.title) return c.json({ error: 'Missing business data' }, 400)
    const scoring = await scoreLeadWithAI(business, category || 'generic', c.env.GROQ_API_KEY)
    return c.json({ success: true, business_name: business.title, scoring })
  } catch (error: any) {
    return c.json({ error: 'Scoring failed', message: error.message }, 500)
  }
})

app.get('/api/scout/results', (c) => {
  return c.json({ data: getLastHuntResults(), total: getLastHuntResults().length, status: getScoutStatus() })
})

app.delete('/api/scout/results', (c) => {
  liveScoutLeads = []
  return c.json({ success: true, message: 'Scout results cleared' })
})

// ============================================================
// API ROUTES - Bulk Hunter (Session 004)
// ============================================================

// GET /api/bulk/config - Get available cities and categories
app.get('/api/bulk/config', (c) => {
  return c.json({
    available_cities: DEFAULT_HUNT_CITIES,
    available_categories: DEFAULT_HUNT_CATEGORIES,
    max_cities: 15,
    max_categories: 10,
    max_limit_per_hunt: 5,
    recommended: {
      cities: ['Jakarta Selatan', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali Denpasar'],
      categories: ['barber shop', 'salon kecantikan', 'cafe'],
      limit: 3
    }
  })
})

// GET /api/bulk/status - Get bulk hunt status
app.get('/api/bulk/status', (c) => {
  const status = getBulkHuntStatus()
  if (!status) return c.json({ status: 'idle', message: 'No bulk hunt running' })
  return c.json(status)
})

// POST /api/bulk/hunt - Start bulk hunt
app.post('/api/bulk/hunt', async (c) => {
  if (!c.env.SERPAPI_KEY || !c.env.GROQ_API_KEY) {
    return c.json({ error: 'Missing API keys (SERPAPI_KEY, GROQ_API_KEY)' }, 500)
  }
  if (!c.env.SUPABASE_URL || !c.env.SUPABASE_SERVICE_ROLE_KEY) {
    return c.json({ error: 'Missing Supabase credentials for auto-save' }, 500)
  }

  const current = getBulkHuntStatus()
  if (current?.status === 'running') {
    return c.json({ error: 'Bulk hunt already running!', status: current }, 429)
  }

  const body = await c.req.json().catch(() => ({}))
  const mission: HuntMission = {
    cities: body.cities || ['Jakarta Selatan', 'Bandung', 'Surabaya'],
    categories: body.categories || ['barber shop', 'cafe', 'salon kecantikan'],
    limit_per_hunt: Math.min(body.limit || 3, 5)
  }

  addLog('bulk_hunter', 'bulk_hunt_start', 'success',
    `Starting: ${mission.cities.length} cities x ${mission.categories.length} categories`)

  const startTime = Date.now()

  try {
    const result = await bulkHuntWorkflow(
      mission,
      c.env.SERPAPI_KEY,
      c.env.GROQ_API_KEY,
      c.env.SUPABASE_URL,
      c.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Add new leads to in-memory store too
    const existingNames = new Set(liveScoutLeads.map(l => l.business_name.toLowerCase()))
    const newLeads = result.all_leads.filter(l => !existingNames.has(l.business_name.toLowerCase()))
    liveScoutLeads = [...liveScoutLeads, ...newLeads]

    addLog('bulk_hunter', 'bulk_hunt_complete', 'success',
      `Done! ${result.total_leads} leads found, ${result.total_saved} saved to DB. ${result.errors.length} errors.`,
      Date.now() - startTime)

    return c.json({
      success: true,
      summary: {
        total_leads: result.total_leads,
        total_saved: result.total_saved,
        cities_completed: result.cities_completed,
        hunts_completed: result.hunts_completed,
        errors: result.errors.length,
        duration_ms: Date.now() - startTime
      },
      results_by_city: result.results_by_city,
      top_leads: result.all_leads.slice(0, 10).map(l => ({
        name: l.business_name, city: l.address, category: l.category,
        score: l.ai_score, gap: l.digital_gap_score
      })),
      errors: result.errors
    })
  } catch (error: any) {
    addLog('bulk_hunter', 'bulk_hunt_error', 'error', error.message, Date.now() - startTime)
    return c.json({ error: 'Bulk hunt failed', message: error.message }, 500)
  }
})

// ============================================================
// API ROUTES - Closer Agent / WhatsApp (Session 004)
// ============================================================

// POST /api/closer/generate - Generate WA message for a lead
app.post('/api/closer/generate', async (c) => {
  const body = await c.req.json()
  const { lead_id, message_type, use_ai } = body

  // Find lead from Supabase or in-memory
  let lead: any = null
  try {
    if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
      const db = createSupabaseClient(c.env)
      const results = await db.select('hunting_leads', `id=eq.${lead_id}`)
      if (results.length > 0) {
        lead = results[0]
        // Map DB fields to ScoredLead format
        lead.id = String(lead.id)
      }
    }
  } catch (_) {}

  if (!lead) {
    lead = liveScoutLeads.find(l => l.id === lead_id)
  }

  if (!lead) {
    return c.json({ error: 'Lead not found' }, 404)
  }

  let message: WAMessage

  if (use_ai && c.env.GROQ_API_KEY) {
    message = await generateAIMessage(lead as ScoredLead, message_type || 'initial', c.env.GROQ_API_KEY)
    addLog('closer', 'ai_message_generated', 'success', `AI message for ${lead.business_name}`)
  } else {
    message = generateWAMessage(lead as ScoredLead, message_type || 'initial')
    addLog('closer', 'template_message_generated', 'success', `Template message for ${lead.business_name}`)
  }

  generatedMessages.push(message)
  return c.json({ success: true, message })
})

// POST /api/closer/batch - Generate messages for multiple leads
app.post('/api/closer/batch', async (c) => {
  const body = await c.req.json()
  const { min_score, category, message_type, limit: msgLimit } = body

  // Get leads from Supabase
  let leads: any[] = []
  try {
    if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
      const db = createSupabaseClient(c.env)
      let query = `order=ai_score.desc&limit=${msgLimit || 20}&status=eq.new`
      if (min_score) query += `&ai_score=gte.${min_score}`
      if (category) query += `&category=eq.${category}`
      leads = await db.select('hunting_leads', query)
    }
  } catch (_) {}

  if (leads.length === 0) {
    leads = liveScoutLeads.filter(l => l.ai_score >= (min_score || 60))
  }

  if (leads.length === 0) {
    return c.json({ error: 'No leads found matching criteria' }, 404)
  }

  const messages = batchGenerateMessages(leads as ScoredLead[], message_type || 'initial')
  generatedMessages = [...generatedMessages, ...messages]

  addLog('closer', 'batch_messages', 'success', `Generated ${messages.length} messages for ${leads.length} leads`)

  return c.json({
    success: true,
    generated: messages.length,
    messages: messages
  })
})

// GET /api/closer/messages - Get all generated messages
app.get('/api/closer/messages', (c) => {
  return c.json({
    data: generatedMessages,
    total: generatedMessages.length
  })
})

// DELETE /api/closer/messages - Clear generated messages
app.delete('/api/closer/messages', (c) => {
  generatedMessages = []
  return c.json({ success: true, message: 'Messages cleared' })
})

// ============================================================
// API ROUTES - Agent Logs
// ============================================================

app.get('/api/agent-logs', (c) => {
  const limit = parseInt(c.req.query('limit') || '20')
  const agentType = c.req.query('agent')
  let filtered = agentType ? agentLogs.filter(l => l.agent_type === agentType) : agentLogs
  return c.json({ data: filtered.slice(0, limit), total: filtered.length })
})

// ============================================================
// API ROUTES - Treasury
// ============================================================

app.get('/api/treasury/stats', (c) => {
  return c.json({
    total_revenue_idr: 0,
    total_revenue_usd: 0,
    target_idr: 7500000,
    target_usd: 500,
    progress_percent: 0,
    profit_split: { operational: 0, growth: 0, liquidity: 0, staking: 0 },
    note: 'Revenue tracking starts when first deal closes. Focus: Hunt → Contact → Close!'
  })
})

app.get('/api/transactions', (c) => {
  return c.json({ data: [], total: 0, summary: { total_revenue: 0, total_paid: 0, total_pending: 0 } })
})

// ============================================================
// API ROUTES - Reports
// ============================================================

app.get('/api/reports/hunt-summary', async (c) => {
  let dbLeads: any[] = []
  try {
    if (c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY) {
      const db = createSupabaseClient(c.env)
      dbLeads = await db.select('hunting_leads', 'select=id,business_name,category,address,ai_score,digital_gap_score,status,source,created_at&order=ai_score.desc')
    }
  } catch (_) {}

  // Category breakdown
  const byCategory: Record<string, { count: number; avg_score: number; top_lead: string }> = {}
  for (const l of dbLeads) {
    if (!byCategory[l.category]) {
      byCategory[l.category] = { count: 0, avg_score: 0, top_lead: '' }
    }
    byCategory[l.category].count++
    byCategory[l.category].avg_score += l.ai_score
    if (!byCategory[l.category].top_lead || l.ai_score > 80) {
      byCategory[l.category].top_lead = l.business_name
    }
  }
  for (const cat in byCategory) {
    byCategory[cat].avg_score = Math.round(byCategory[cat].avg_score / byCategory[cat].count)
  }

  return c.json({
    total_leads: dbLeads.length,
    hot_leads: dbLeads.filter(l => l.ai_score >= 80).length,
    warm_leads: dbLeads.filter(l => l.ai_score >= 60 && l.ai_score < 80).length,
    cold_leads: dbLeads.filter(l => l.ai_score < 60).length,
    by_category: byCategory,
    top_10: dbLeads.slice(0, 10).map(l => ({
      name: l.business_name, category: l.category,
      score: l.ai_score, gap: l.digital_gap_score, city: l.address
    })),
    messages_generated: generatedMessages.length,
    generated_at: new Date().toISOString()
  })
})

// ============================================================
// PAGES
// ============================================================
app.get('/', (c) => c.html(landingPageHTML))
app.get('/dashboard', (c) => c.html(dashboardHTML))

export default app
